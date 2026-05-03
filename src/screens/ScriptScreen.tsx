import React, { useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { COLORS, SPACING, RADIUS, SHADOW, TYPOGRAPHY } from '../lib/theme';
import { getLessonById } from '../sample-data/lessons';
import { useSaved } from '../hooks/useSaved';
import { useAudio } from '../hooks/useAudio';
import { AudioBar } from '../components/AudioBar';

type Props = NativeStackScreenProps<RootStackParamList, 'Script'>;

export function ScriptScreen({ route, navigation }: Props) {
  const { lessonId, scriptId } = route.params;
  const lesson = getLessonById(lessonId);
  const { saveTool, savedTools } = useSaved();
  const audio = useAudio();

  // Stop audio when navigating away
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', audio.stop);
    return unsubscribe;
  }, [navigation, audio.stop]);

  const script = lesson?.scripts.find((s) => s.id === scriptId);
  const scriptSourceKey = useMemo(() => `script-${lessonId}-${scriptId}`, [lessonId, scriptId]);
  const scriptSaved = savedTools.some(
    (tool) => tool.type === 'script' && tool.sourceKey === scriptSourceKey
  );

  // Audio chunks: context first, then each line individually so currentIndex = line index
  const audioChunks = useMemo(() => {
    if (!script) return [];
    return [script.context, ...script.lines];
  }, [script]);

  if (!lesson || !script) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Script not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  async function handleCopyLine(line: string) {
    try {
      await Clipboard.setStringAsync(line);
    } catch {
      Alert.alert('Could not copy', 'Please copy the text manually.', [{ text: 'OK' }]);
    }
  }

  async function handleCopyAll() {
    try {
      const full = script!.lines.join('\n\n');
      await Clipboard.setStringAsync(full);
      Alert.alert('Script copied', 'Paste it wherever you need it.', [{ text: 'OK' }]);
    } catch {
      Alert.alert('Could not copy', 'Please copy the text manually.', [{ text: 'OK' }]);
    }
  }

  async function handleSave() {
    const content = script!.lines.join('\n');
    await saveTool({
      id: scriptSourceKey,
      sourceKey: scriptSourceKey,
      type: 'script',
      title: script!.title,
      content,
      category: lesson!.category,
      savedAt: new Date().toISOString(),
    });
    Alert.alert(
      scriptSaved ? 'Script already saved' : 'Script saved',
      scriptSaved ? 'This script is already in your Saved tab.' : 'Find it in the Saved tab anytime.',
      [{ text: 'OK' }]
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.lessonName}>{lesson.title}</Text>
          <Text style={styles.scriptTitle}>{script.title}</Text>
        </View>

        <View style={styles.contextCard}>
          <Text style={styles.contextText}>{script.context}</Text>
        </View>

        {/* Audio bar — reads context + each line in sequence */}
        <AudioBar
          audio={audio}
          chunks={audioChunks}
          totalItems={script.lines.length}
          itemLabel="line"
        />

        <View style={styles.linesSection}>
          <View style={styles.linesSectionHeader}>
            <Text style={styles.linesSectionLabel}>What to say</Text>
            <TouchableOpacity onPress={handleCopyAll} activeOpacity={0.7}>
              <Text style={styles.copyAllText}>Copy all</Text>
            </TouchableOpacity>
          </View>

          {script.lines.map((line, index) => {
            // chunk 0 = context, so line 0 = chunk index 1
            const isHighlighted = audio.currentIndex === index + 1;
            return (
              <View
                key={index}
                style={[styles.lineCard, isHighlighted && styles.lineCardHighlighted]}
              >
                <View style={styles.lineTop}>
                  <View style={[styles.lineIndex, isHighlighted && styles.lineIndexHighlighted]}>
                    <Text style={[styles.lineIndexText, isHighlighted && styles.lineIndexTextHighlighted]}>
                      {index + 1}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleCopyLine(line)}
                    style={styles.copyButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.copyButtonText}>Copy</Text>
                  </TouchableOpacity>
                </View>
                <Text style={[styles.lineText, isHighlighted && styles.lineTextHighlighted]}>
                  {line}
                </Text>
              </View>
            );
          })}
        </View>

        {script.alternates && script.alternates.length > 0 && (
          <View style={styles.alternatesSection}>
            <Text style={styles.alternatesLabel}>Other ways to say it</Text>
            {script.alternates.map((alt, index) => (
              <View key={index} style={styles.alternateRow}>
                <Text style={styles.alternateText}>{alt}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.saveButton, scriptSaved && styles.saveButtonSaved]}
            onPress={handleSave}
            activeOpacity={0.85}
          >
            <Text style={styles.saveButtonText}>{scriptSaved ? 'Saved to Saved tab' : 'Save this script'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    ...TYPOGRAPHY.bodyMuted,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  lessonName: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
  },
  scriptTitle: {
    ...TYPOGRAPHY.title,
  },
  contextCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    ...SHADOW.card,
  },
  contextText: {
    ...TYPOGRAPHY.body,
    fontStyle: 'italic',
    color: COLORS.textMuted,
    lineHeight: 24,
  },
  linesSection: {
    marginBottom: SPACING.md,
  },
  linesSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  linesSectionLabel: {
    ...TYPOGRAPHY.smallBold,
    color: COLORS.textMuted,
    letterSpacing: 0.6,
  },
  copyAllText: {
    ...TYPOGRAPHY.label,
    color: COLORS.primary,
    fontWeight: '600',
  },
  lineCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
    ...SHADOW.card,
  },
  lineCardHighlighted: {
    backgroundColor: COLORS.primary + '10',
    borderColor: COLORS.primary + '60',
  },
  lineTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  lineIndex: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineIndexHighlighted: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  lineIndexText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  lineIndexTextHighlighted: {
    color: COLORS.white,
  },
  copyButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  copyButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  lineText: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },
  lineTextHighlighted: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  alternatesSection: {
    marginBottom: SPACING.md,
  },
  alternatesLabel: {
    ...TYPOGRAPHY.smallBold,
    color: COLORS.textMuted,
    letterSpacing: 0.6,
    marginBottom: SPACING.sm,
  },
  alternateRow: {
    paddingLeft: SPACING.md,
    paddingVertical: SPACING.sm,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  alternateText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  actions: {
    marginTop: SPACING.sm,
  },
  saveButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  saveButtonSaved: {
    backgroundColor: COLORS.success,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
