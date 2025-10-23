'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import useAiSessionStore, { AISessionState, AIMsg } from '../../lib/stores/aiSessionStore';
import { streamAiResponse, summarizeSession, getGuidedPrompt } from '../../lib/api/aiClient';
import { saveSessionToDb, loadSessionFromDb, saveRecordingBlob, listSessionSummaries } from '../../lib/db/indexedDb';
import useSpeech from '../../lib/hooks/useSpeech';
import ActiveImaginationBoundary from './ActiveImaginationBoundary';
import clsx from 'clsx';

type Props = {
  userId: string;
  mbtiType?: string | null;
};

function nowISO() {
  return new Date().toISOString();
}

function generateTempId() {
  return `tmp_${Math.random().toString(36).slice(2, 9)}`;
}

/*
  Note: AI streaming (SSE/Fetch streaming) depends on your server /api/ai/stream implementation.
  The client below uses streamAiResponse which returns an async iterator / evented data.
*/

export default function ActiveImaginationEditor({ userId, mbtiType: mbtiTypeProp }: Props) {
  const mbtiType = mbtiTypeProp ?? undefined;
  // Zustand store hookup
  const {
    session,
    setSession,
    addMessage,
    updateMessage,
    setProgress
  } = useAiSessionStore();

  // Local component state
  const [isRecording, setIsRecording] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingPrompt, setLoadingPrompt] = useState(false);
  const [localTranscript, setLocalTranscript] = useState('');
  const [playbackUrl, setPlaybackUrl] = useState<string | null>(null);

  // Speech hook for voice-to-text
  const {
    startRecognition,
    stopRecognition,
    finalTranscript,
    listening
  } = useSpeech({ lang: 'nl-NL' });

  // Media recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<BlobPart[]>([]);

  // session identifier / ephemeral
  useEffect(() => {
    if (!session) {
      const sid = generateTempId();
      const s: AISessionState = {
        id: sid,
        userId,
        mbtiType: mbtiType ?? 'UNKNOWN',
        createdAt: nowISO(),
        messages: [],
        updatedAt: nowISO(),
        progress: 0
      };
      setSession(s);
      // try to load last saved session
      (async () => {
        try {
          const last = await loadSessionFromDb(userId);
          if (last) {
            // merge or offer restore -- simple restore for now
            setSession(last);
          }
        } catch (e) {
          console.warn('No previous session or load failed', e);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, mbtiType]);

  // hook for finalTranscript from speech recognition -> append to draft / messages
  useEffect(() => {
    if (finalTranscript && finalTranscript.trim()) {
      setLocalTranscript(prev => (prev ? prev + ' ' + finalTranscript : finalTranscript));
    }
  }, [finalTranscript]);

  // helper: push user message and ask AI to respond streaming
  async function sendUserMessage(text: string) {
    setError(null);
    if (!session) return;
    const messageId = generateTempId();
    const msg: AIMsg = { id: messageId, role: 'user', content: text, createdAt: nowISO() };
    addMessage(msg);

    // optimistic UI: store session locally and to IndexedDB
    const newSession = { ...session, messages: [...session.messages, msg], updatedAt: nowISO() };
    setSession(newSession);
    await saveSessionToDb(newSession);

    // stream AI response
    setIsStreaming(true);
    const assistantId = generateTempId();
    const assistantMsg: AIMsg = { id: assistantId, role: 'assistant', content: '', createdAt: nowISO() };
    addMessage(assistantMsg);

    try {
      // streamAiResponse returns an async iterable of chunks or a readable stream wrapper
      const stream = await streamAiResponse({
        sessionId: session.id,
        userId,
        mbtiType: session.mbtiType,
        promptContext: buildPromptContext(newSession)
      });

      // gather text and optional metadata (sentiment)
      let accumulated = '';
      for await (const chunk of stream) {
        // chunk may be { delta, sentimentScore? }
        if (typeof chunk === 'string') {
          accumulated += chunk;
          updateMessage(assistantId, { content: accumulated });
        } else if ('delta' in (chunk as any)) {
          accumulated += (chunk as any).delta ?? '';
          updateMessage(assistantId, { content: accumulated });
        }
        setProgress(Math.min(100, Math.round(accumulated.length / 10)));
      }

      // finalize message
      setIsStreaming(false);
      updateMessage(assistantId, { content: accumulated });
      const finalSession = { ...newSession, messages: [...newSession.messages, assistantMsg], updatedAt: nowISO() };
      setSession(finalSession);
      await saveSessionToDb(finalSession);

      // optionally run summarization async
      try {
        const summary = await summarizeSession({ sessionId: session.id, userId });
        // accept summary and store analytics — we assume summary.text returned
        // persist summary into DB or store slice
        // we simply console.log for now
        console.info('Session summary:', summary);
      } catch (e) {
        console.warn('Summarize failed', e);
      }
    } catch (e: any) {
      console.error('AI stream failed', e);
      setError(String(e?.message ?? e));
      setIsStreaming(false);
      // keep assistant stub with error note
      updateMessage(assistantId, { content: '[AI response failed — offline or server error]' });
    }
  }

  // helper: generate guided prompt based on MBTI
  async function loadGuidedPrompt() {
    setLoadingPrompt(true);
    setError(null);
    try {
      const prompt = await getGuidedPrompt({ mbtiType: session?.mbtiType ?? mbtiType, userId });
      // push as system message
      const sysMsg: AIMsg = { id: generateTempId(), role: 'system', content: prompt, createdAt: nowISO() };
      addMessage(sysMsg);
      const s = { ...session!, messages: [...(session?.messages ?? []), sysMsg], updatedAt: nowISO() };
      setSession(s);
      await saveSessionToDb(s);
    } catch (e: any) {
      setError(String(e?.message ?? 'Failed to load guided prompt'));
    } finally {
      setLoadingPrompt(false);
    }
  }

  // voice recording using MediaRecorder
  async function startRecording() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      recordedChunksRef.current = [];
      mr.ondataavailable = ev => {
        if (ev.data && ev.data.size > 0) recordedChunksRef.current.push(ev.data);
      };
      mr.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setPlaybackUrl(url);
        await saveRecordingBlob(session!.id, blob);
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setIsRecording(true);
    } catch (e) {
      console.error('Recording failed', e);
      setError('Recording not permitted or unsupported');
    }
  }

  function stopRecording() {
    try {
      mediaRecorderRef.current?.stop();
      mediaRecorderRef.current = null;
      setIsRecording(false);
    } catch (e) {
      console.warn('Stop recording failed', e);
      setIsRecording(false);
    }
  }

  // quick export to markdown journal file
  async function exportToJournal() {
    if (!session) return;
    const lines: string[] = [];
    lines.push(`# Active Imagination — ${session.mbtiType} — ${new Date(session.createdAt).toLocaleString()}`);
    for (const m of session.messages) {
      lines.push(`\n**${m.role.toUpperCase()}** (${new Date(m.createdAt).toLocaleString()}):\n`);
      lines.push(m.content || '');
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `active-imagination-${session.id}.md`;
    a.click();
  }

  // accessibility: announce errors or assistant messages
  const liveRegionRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    // focus management: when assistant adds message, announce for screen readers
    const last = session?.messages?.[session.messages.length - 1];
    if (last?.role === 'assistant' && last.content && liveRegionRef.current) {
      liveRegionRef.current.textContent = 'Assistant: ' + last.content.slice(0, 300);
    }
  }, [session?.messages]);

  // utility functions
  function buildPromptContext(s: AISessionState) {
    // Compose prompt with system message, MBTI-specific guidance, and last N messages
    const lastMessages = (s.messages || []).slice(-6).map(m => `${m.role}: ${m.content}`).join('\n');
    return `You are a gentle imagination coach for MBTI ${s.mbtiType}. Use evocative, sensory language and ask reflection questions.\n\nSession:\n${lastMessages}`;
  }
  // function calculateProgressFromTokens(len: number) {
  //   // naive progress: cap at 100
  //   const val = Math.min(100, Math.round(len / 10));
  //   return val;
  // }

  // minimal UI rendering
  return (
    <ActiveImaginationBoundary>
      <section
        aria-labelledby="ai-imagination-title"
        className="max-w-3xl mx-auto p-4 sm:p-6"
      >
        <div className="glass rounded-xl p-4 sm:p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 id="ai-imagination-title" className="text-lg sm:text-2xl font-semibold">Actieve Imaginatie</h2>
              <p className="text-sm text-gray-500">Geleid door een AI-coach — aangepast op MBTI: {session?.mbtiType}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={loadGuidedPrompt}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-md text-sm"
                aria-label="Laad begeleidende prompt"
                disabled={loadingPrompt}
              >
                {loadingPrompt ? 'Laden...' : 'Laad Prompt'}
              </button>
              <button
                onClick={exportToJournal}
                className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm"
                aria-label="Exporteer sessie naar dagboek"
              >
                Exporteer
              </button>
            </div>
          </div>

          {/* messages */}
          <div className="space-y-3 mb-4">
            {(session?.messages || []).map((m) => (
              <article
                key={m.id}
                className={clsx('p-3 rounded-lg', m.role === 'assistant' ? 'bg-white/6' : 'bg-white/3')}
                aria-live={m.role === 'assistant' ? 'polite' : undefined}
              >
                <div className="text-xs text-gray-400 mb-1">{m.role.toUpperCase()} — {new Date(m.createdAt).toLocaleTimeString()}</div>
                <div className="whitespace-pre-wrap text-sm">{m.content}</div>
              </article>
            ))}
          </div>

          {/* input area */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto] gap-2 items-end">
            <textarea
              aria-label="Invoerveld voor je verbeelding"
              className="w-full p-3 rounded-md resize-none bg-white/5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              rows={3}
              value={localTranscript}
              onChange={(e) => setLocalTranscript(e.target.value)}
            />
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => sendUserMessage(localTranscript)}
                disabled={!localTranscript || isStreaming}
                className="px-3 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50"
              >
                {isStreaming ? 'Wachten...' : 'Stel voor'}
              </button>

              <button
                onClick={() => {
                  if (listening) stopRecognition();
                  else startRecognition();
                }}
                className={clsx('px-3 py-2 rounded-md', listening ? 'bg-red-500 text-white' : 'bg-white/10')}
                aria-pressed={listening}
                aria-label={listening ? 'Stop spraakherkenning' : 'Start spraakherkenning'}
              >
                {listening ? 'Stop opname' : 'Spreek'}
              </button>

              <div className="flex space-x-2">
                <button
                  onClick={() => (isRecording ? stopRecording() : startRecording())}
                  className={clsx('px-3 py-1 rounded-md text-sm', isRecording ? 'bg-red-500 text-white' : 'bg-white/10')}
                >
                  {isRecording ? 'Stop opnemen' : 'Start opnemen'}
                </button>

                <button
                  onClick={() => playbackUrl && window.open(playbackUrl, '_blank')}
                  className="px-3 py-1 rounded-md bg-white/10 text-sm"
                  disabled={!playbackUrl}
                >
                  Afspelen
                </button>
              </div>
            </div>
          </div>

          {/* footer: progress and controls */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-400">Voortgang: {session?.progress ?? 0}%</div>
            <div className="flex items-center space-x-2">
              <button
                onClick={async () => {
                  try {
                    const summaries = await listSessionSummaries(userId);
                    alert('Locatie sessies: ' + summaries.length);
                  } catch (e) {
                    console.warn(e);
                  }
                }}
                className="text-sm px-2 py-1 rounded-md bg-white/6"
              >
                Opslag controleren
              </button>
              <div role="status" aria-live="polite" className="sr-only" ref={liveRegionRef} />
            </div>
          </div>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 p-3 bg-red-600 text-white rounded-md" role="alert">
            {error}
          </motion.div>
        )}
      </section>
    </ActiveImaginationBoundary>
  );
}
