import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    webkitSpeechRecognition?: any;
  }
  interface SpeechRecognitionEvent {
    results: SpeechRecognitionResultList;
    resultIndex: number;
  }
}

type UseSpeechOptions = { lang?: string };

export default function useSpeech(opts?: UseSpeechOptions) {
  const [isSupported, setIsSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (typeof window !== 'undefined' && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)) || null;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }
    setIsSupported(true);
    const rec = new SpeechRecognition();
    rec.lang = opts?.lang ?? 'nl-NL';
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onresult = (ev: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';
      for (let i = ev.resultIndex; i < ev.results.length; ++i) {
        const res = ev.results[i];
        if ((res as SpeechRecognitionResult).isFinal) {
          final += res[0].transcript;
        } else {
          interim += res[0].transcript;
        }
      }
      setInterimTranscript(interim);
      if (final) {
        setFinalTranscript(prev => (prev ? prev + ' ' + final : final));
        setInterimTranscript('');
      }
    };
    rec.onend = () => {
      setListening(false);
    };
    rec.onerror = (err: any) => {
      console.warn('Speech recognition error', err);
      setListening(false);
    };
    recognitionRef.current = rec;
    // cleanup
    return () => {
      try {
        recognitionRef.current?.stop();
      } catch {
        // Ignore cleanup errors
      }
    };
  }, [opts?.lang]);

  function startRecognition() {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.start();
      setListening(true);
      setInterimTranscript('');
      setFinalTranscript('');
    } catch (e) {
      console.warn('startRecognition failed', e);
    }
  }
  function stopRecognition() {
    try {
      recognitionRef.current?.stop();
    } catch (e) {
      console.warn('stopRecognition failed', e);
    }
    setListening(false);
  }

  return { isSupported, listening, interimTranscript, finalTranscript, startRecognition, stopRecognition };
}
