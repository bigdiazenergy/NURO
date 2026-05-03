import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../lib/theme';
import { UseSpeechResult } from '../hooks/useSpeech';

interface VoiceMicButtonProps {
  speech: UseSpeechResult;
  /** Called when the user taps a confirmed transcript (best guess or A/B/C selection) */
  onTranscript: (text: string) => void;
  /** Optional label shown below the button */
  label?: string;
}

export function VoiceMicButton({ speech, onTranscript, label }: VoiceMicButtonProps) {
  if (!speech.isAvailable) return null;

  const {
    isListening,
    isLowConfidence,
    transcript,
    alternatives,
    startListening,
    stopListening,
    reset,
    error,
  } = speech;

  function handlePress() {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }

  function handleSelectAlternative(text: string) {
    onTranscript(text);
    reset();
  }

  function handleConfirm() {
    if (transcript) {
      onTranscript(transcript);
      reset();
    }
  }

  return (
    <View style={styles.container}>
      {/* The mic button itself */}
      <TouchableOpacity
        onPress={handlePress}
        style={[styles.micButton, isListening && styles.micButtonActive]}
        activeOpacity={0.75}
        accessibilityLabel={isListening ? 'Stop listening' : 'Tap to speak'}
        accessibilityRole="button"
      >
        {isListening ? (
          <ActivityIndicator size="small" color={COLORS.white} />
        ) : (
          <Text style={styles.micIcon}>🎤</Text>
        )}
      </TouchableOpacity>

      {label && !isListening && !transcript && (
        <Text style={styles.label}>{label}</Text>
      )}

      {isListening && (
        <Text style={styles.listeningText}>Listening…</Text>
      )}

      {/* Error state */}
      {error && !isListening && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {/* Show best guess with confirm button if NOT low confidence */}
      {!isListening && transcript && !isLowConfidence && (
        <View style={styles.confirmRow}>
          <Text style={styles.transcriptText}>"{transcript}"</Text>
          <TouchableOpacity
            onPress={handleConfirm}
            style={styles.confirmButton}
            activeOpacity={0.8}
          >
            <Text style={styles.confirmButtonText}>Use this</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* A/B/C panel for low confidence */}
      {!isListening && isLowConfidence && alternatives.length > 0 && (
        <View style={styles.guessPanel}>
          <Text style={styles.guessPanelLabel}>Which did you mean?</Text>
          {alternatives.slice(0, 3).map((alt, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => handleSelectAlternative(alt.transcript)}
              style={styles.guessOption}
              activeOpacity={0.75}
            >
              <Text style={styles.guessLetter}>{String.fromCharCode(65 + i)}</Text>
              <Text style={styles.guessText}>{alt.transcript}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={reset} style={styles.retryButton} activeOpacity={0.75}>
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  micButton: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  micButtonActive: {
    backgroundColor: COLORS.accent,
    shadowColor: COLORS.accent,
  },
  micIcon: {
    fontSize: 22,
  },
  label: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  listeningText: {
    ...TYPOGRAPHY.small,
    color: COLORS.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorText: {
    ...TYPOGRAPHY.small,
    color: '#E53E3E',
    textAlign: 'center',
    maxWidth: 260,
  },
  confirmRow: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  transcriptText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontStyle: 'italic',
    textAlign: 'center',
    maxWidth: 280,
  },
  confirmButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
  },
  confirmButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
  },
  guessPanel: {
    width: '100%',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  guessPanelLabel: {
    ...TYPOGRAPHY.smallBold,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    marginBottom: SPACING.xs,
  },
  guessOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  guessLetter: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    width: 20,
  },
  guessText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    flex: 1,
  },
  retryButton: {
    alignSelf: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  retryText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
});
