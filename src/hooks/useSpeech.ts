import { useState, useCallback, useRef, useEffect } from 'react';

export type RecognitionAlternative = { transcript: string; confidence: number };

export interface UseSpeechResult {
  /** Whether SpeechRecognition is available in this browser */
  isAvailable: boolean;
  /** True while mic is actively listening */
  isListening: boolean;
  /** The best (highest-confidence) transcript so far */
  transcript: string;
  /** Up to 3 alternative interpretations, sorted by confidence descending */
  alternatives: RecognitionAlternative[];
  /** True if confidence on best result is below threshold (show A/B/C panel) */
  isLowConfidence: boolean;
  /** Start listening. Calls onResult when done. */
  startListening: () => void;
  /** Stop listening immediately */
  stopListening: () => void;
  /** Clear transcript and alternatives */
  reset: () => void;
  /** Last error message, if any */
  error: string | null;
}

const LOW_CONFIDENCE_THRESHOLD = 0.75;

function isSpeechRecognitionAvailable(): boolean {
  try {
    return (
      typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    );
  } catch {
    return false;
  }
}

export function useSpeech(): UseSpeechResult {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [alternatives, setAlternatives] = useState<RecognitionAlternative[]>([]);
  const [isLowConfidence, setIsLowConfidence] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const available = isSpeechRecognitionAvailable();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        recognitionRef.current = null;
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (!available) return;

    // Stop any existing session
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }

    setTranscript('');
    setAlternatives([]);
    setIsLowConfidence(false);
    setError(null);

    const SpeechRecognitionImpl =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    const recognition = new SpeechRecognitionImpl();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;
    recognition.continuous = false;

    recognitionRef.current = recognition;
    setIsListening(true);

    recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      const alts: RecognitionAlternative[] = [];

      for (let i = 0; i < result.length; i++) {
        alts.push({
          transcript: result[i].transcript,
          confidence: result[i].confidence ?? 1,
        });
      }

      // Sort by confidence descending
      alts.sort((a, b) => b.confidence - a.confidence);

      const best = alts[0];
      setTranscript(best.transcript);
      setAlternatives(alts);
      setIsLowConfidence(best.confidence < LOW_CONFIDENCE_THRESHOLD);
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      if (event.error !== 'aborted') {
        setError(
          event.error === 'no-speech'
            ? 'No speech detected. Try again.'
            : `Mic error: ${event.error}`
        );
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.start();
  }, [available]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  const reset = useCallback(() => {
    setTranscript('');
    setAlternatives([]);
    setIsLowConfidence(false);
    setError(null);
  }, []);

  return {
    isAvailable: available,
    isListening,
    transcript,
    alternatives,
    isLowConfidence,
    startListening,
    stopListening,
    reset,
    error,
  };
}
