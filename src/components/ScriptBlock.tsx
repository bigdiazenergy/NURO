import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Script } from '../types';
import { COLORS, SPACING, RADIUS, SHADOW, TYPOGRAPHY } from '../lib/theme';

interface ScriptBlockProps {
  script: Script;
}

export function ScriptBlock({ script }: ScriptBlockProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.contextLabel}>Context</Text>
      <Text style={styles.context}>{script.context}</Text>

      <View style={styles.divider} />

      <Text style={styles.linesLabel}>What to say</Text>
      {script.lines.map((line, index) => (
        <View key={index} style={styles.lineRow}>
          <View style={styles.lineNumber}>
            <Text style={styles.lineNumberText}>{index + 1}</Text>
          </View>
          <Text style={styles.lineText}>{line}</Text>
        </View>
      ))}

      {script.alternates && script.alternates.length > 0 && (
        <>
          <View style={styles.divider} />
          <Text style={styles.alternatesLabel}>Other ways to say it</Text>
          {script.alternates.map((alt, index) => (
            <Text key={index} style={styles.alternateText}>
              {alt}
            </Text>
          ))}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.card,
  },
  contextLabel: {
    ...TYPOGRAPHY.smallBold,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.xs,
  },
  context: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  linesLabel: {
    ...TYPOGRAPHY.smallBold,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.sm,
  },
  lineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  lineNumber: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
    flexShrink: 0,
    marginTop: 1,
  },
  lineNumberText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  lineText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
    fontFamily: 'System',
  },
  alternatesLabel: {
    ...TYPOGRAPHY.smallBold,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.sm,
  },
  alternateText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    fontSize: 14,
    marginBottom: SPACING.xs,
    paddingLeft: SPACING.sm,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.border,
  },
});
