import { useState, useCallback, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUDIO_MUTED_KEY = '@nuro:audio_muted';

function isSpeechAvailable(): boolean {
  try {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  } catch {
    return false;
  }
}

export interface UseAudioResult {
  /** True when the user has audio turned off */
  isMuted: boolean;
  /** True while speech is actively playing */
  isPlaying: boolean;
  /**
   * Index of the chunk currently being read aloud (-1 = nothing playing).
   * Use this to highlight the matching step or line in the UI.
   */
  currentIndex: number;
  /** Whether the Web Speech API is available in this browser */
  isAvailable: boolean;
  /**
   * Start reading an array of text chunks in order.
   * Each chunk gets its own utterance so currentIndex tracks progress.
   * Does nothing if muted or unavailable.
   */
  speak: (chunks: string[]) => void;
  /** Stop reading immediately */
  stop: () => void;
  /** Toggle audio on/off (persisted across sessions). Also stops playback if turning off. */
  toggleMute: () => void;
}

export function useAudio(): UseAudioResult {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  // Acts as a kill-switch so onend callbacks don't continue after stop() is called
  const cancelRef = useRef(false);
  const available = isSpeechAvailable();

  // Load persisted mute preference
  useEffect(() => {
    AsyncStorage.getItem(AUDIO_MUTED_KEY)
      .then((val) => { if (val === 'true') setIsMuted(true); })
      .catch(() => {});
  }, []);

  // Stop speech when the screen unmounts
  useEffect(() => {
    return () => {
      if (available) {
        cancelRef.current = true;
        window.speechSynthesis.cancel();
      }
    };
  }, [available]);

  const speak = useCallback(
    (chunks: string[]) => {
      if (!available || isMuted || chunks.length === 0) return;

      // Cancel any in-progress speech first
      cancelRef.current = true;
      window.speechSynthesis.cancel();

      // Small delay so the cancel registers before we start the new queue
      setTimeout(() => {
        cancelRef.current = false;
        setIsPlaying(true);

        let index = 0;

        function readNext() {
          if (cancelRef.current || index >= chunks.length) {
            setIsPlaying(false);
            setCurrentIndex(-1);
            return;
          }

          setCurrentIndex(index);

          const utterance = new SpeechSynthesisUtterance(chunks[index]);
          utterance.rate = 0.88;   // Slightly slower — easier for users with processing differences
          utterance.pitch = 1;
          utterance.volume = 1;

          utterance.onend = () => {
            index += 1;
            readNext();
          };

          utterance.onerror = () => {
            setIsPlaying(false);
            setCurrentIndex(-1);
          };

          window.speechSynthesis.speak(utterance);
        }

        readNext();
      }, 50);
    },
    [available, isMuted]
  );

  const stop = useCallback(() => {
    cancelRef.current = true;
    if (available) window.speechSynthesis.cancel();
    setIsPlaying(false);
    setCurrentIndex(-1);
  }, [available]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      AsyncStorage.setItem(AUDIO_MUTED_KEY, String(next)).catch(() => {});
      if (next) {
        // Turning audio OFF — stop whatever is playing
        cancelRef.current = true;
        if (available) window.speechSynthesis.cancel();
        setIsPlaying(false);
        setCurrentIndex(-1);
      }
      return next;
    });
  }, [available]);

  return {
    isMuted,
    isPlaying,
    currentIndex,
    isAvailable: available,
    speak,
    stop,
    toggleMute,
  };
}
