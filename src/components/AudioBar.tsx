import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../lib/theme';
import { UseAudioResult } from '../hooks/useAudio';

interface AudioBarProps {
  /** The audio hook result from the parent screen */
  audio: UseAudioResult;
  /** Text chunks to read — passed back to audio.speak() when Play is pressed */
  chunks: string[];
  /** Total number of readable items (shown in "Reading X of Y" label) */
  totalItems?: number;
  /** Label for what's being read, e.g. "step" or "line" */
  itemLabel?: string;
}

/**
 * AudioBar — a small, always-visible control strip for read-aloud mode.
 *
 * Layout:  [🔊/🔇 toggle]  [status text]  [▶ Play / ⏹ Stop]
 *
 * When audio is unavailable in the browser, the bar hides itself entirely
 * rather than showing a broken state.
 */
export function AudioBar({
  audio,
  chunks,
  totalItems,
  itemLabel = 'step',
}: AudioBarProps) {
  if (!audio.isAvailable) return null;

  const { isMuted, isPlaying, currentIndex, speak, stop, toggleMute } = audio;

  function handlePlayStop() {
    if (isPlaying) {
      stop();
    } else {
      speak(chunks);
    }
  }

  // Status label shown in the middle of the bar
  let statusText = isMuted ? 'Audio off' : 'Read aloud';
  if (!isMuted && isPlaying && currentIndex >= 0 && totalItems != null) {
    statusText = `Reading ${itemLabel} ${currentIndex + 1} of ${totalItems}`;
  } else if (!isMuted && isPlaying) {
    statusText = 'Reading…';
  }

  return (
    <View style={styles.bar}>
      {/* Mute / unmute toggle */}
      <TouchableOpacity
        onPress={toggleMute}
        style={styles.iconButton}
        activeOpacity={0.7}
        accessibilityLabel={isMuted ? 'Turn audio on' : 'Turn audio off'}
        accessibilityRole="button"
      >
        <Text style={styles.icon}>{isMuted ? '🔇' : '🔊'}</Text>
      </TouchableOpacity>

      {/* Status text */}
      <Text style={[styles.statusText, isMuted && styles.statusTextMuted]}>
        {statusText}
      </Text>

      {/* Play / Stop — hidden when muted */}
      {!isMuted && (
        <TouchableOpacity
          onPress={handlePlayStop}
          style={[styles.playButton, isPlaying && styles.playButtonActive]}
          activeOpacity={0.75}
          accessibilityLabel={isPlaying ? 'Stop reading' : 'Start reading aloud'}
          accessibilityRole="button"
        >
          <Text style={[styles.playButtonText, isPlaying && styles.playButtonTextActive]}>
            {isPlaying ? '⏹ Stop' : '▶ Play'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  iconButton: {
    padding: SPACING.xs,
  },
  icon: {
    fontSize: 18,
  },
  statusText: {
    ...TYPOGRAPHY.small,
    flex: 1,
    color: COLORS.text,
    fontWeight: '500',
  },
  statusTextMuted: {
    color: COLORS.textMuted,
  },
  playButton: {
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.background,
  },
  playButtonActive: {
    backgroundColor: COLORS.primary + '15',
    borderColor: COLORS.primary,
  },
  playButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  playButtonTextActive: {
    color: COLORS.primary,
  },
});
