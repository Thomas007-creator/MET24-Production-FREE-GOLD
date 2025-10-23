export type StreamChunk = { delta?: string; type?: string; sentimentScore?: number } | string;

type CreateSessionReq = { userId: string; mbtiType?: string };
type CreateSessionRes = { sessionId: string; prompt?: string };

export async function createSession(payload: CreateSessionReq): Promise<CreateSessionRes> {
  const res = await fetch('/api/ai/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to create session');
  return res.json();
}

export async function getGuidedPrompt({ mbtiType, userId }: { mbtiType?: string; userId: string }): Promise<string> {
  const res = await fetch(`/api/ai/guided?mbtiType=${encodeURIComponent(mbtiType || '')}&userId=${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error('Failed to get guided prompt');
  const j = await res.json();
  return j.prompt;
}

/*
  streamAiResponse: starts a streaming request and yields chunk strings/objects.
  Server must implement streaming response (text/event-stream, SSE, or chunked Transfer-Encoding)
  and the client below will parse newline-delimited JSON lines OR chunked text.
*/
export async function streamAiResponse(opts: { sessionId: string; userId: string; mbtiType?: string; promptContext?: string }) {
  const res = await fetch('/api/ai/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(opts)
  });

  if (!res.ok) {
    throw new Error('AI stream request failed');
  }

  if (!res.body) {
    throw new Error('No stream available');
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder('utf-8');

  async function* streamGenerator() {
    try {
      let done = false;
      let buffer = '';
      while (!done) {
        const { value, done: d } = await reader.read();
        if (d) {
          done = true;
          if (buffer.length) {
            // flush
            try {
              const parsed = JSON.parse(buffer);
              yield parsed;
            } catch {
              yield buffer;
            }
          }
          break;
        }
        buffer += decoder.decode(value, { stream: true });
        // try split on newline-delimited JSON or plain text
        const lastNewline = buffer.lastIndexOf('\n');
        if (lastNewline !== -1) {
          const chunk = buffer.slice(0, lastNewline);
          buffer = buffer.slice(lastNewline + 1);
          // chunk may contain multiple lines
          const lines = chunk.split('\n');
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            try {
              const parsed = JSON.parse(trimmed);
              yield parsed;
            } catch (e) {
              yield trimmed;
            }
          }
        } else {
          // if buffer small, yield partial as text delta for low-latency UI
          if (buffer.length > 50) {
            yield buffer;
            buffer = '';
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  return streamGenerator();
}

export async function summarizeSession(opts: { sessionId: string; userId: string }) {
  const res = await fetch('/api/ai/summarize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(opts)
  });
  if (!res.ok) throw new Error('Summarization failed');
  return res.json();
}
