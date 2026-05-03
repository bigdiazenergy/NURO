import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, SavedTool } from '../types';
import { COLORS, SPACING, RADIUS, SHADOW, TYPOGRAPHY } from '../lib/theme';
import { useSaved } from '../hooks/useSaved';
import { CategoryBadge } from '../components/CategoryBadge';

type Props = CompositeScreenProps<
  BottomTabScreenProps<{ Home: undefined; Progress: undefined; Saved: undefined }, 'Saved'>,
  NativeStackScreenProps<RootStackParamList>
>;

type TabKey = 'checklist' | 'script' | 'note';

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '';
  }
}

export function SavedToolsScreen({ navigation }: Props) {
  const { savedTools, loading, removeTool, refresh } = useSaved();
  const [activeTab, setActiveTab] = useState<TabKey>('checklist');

  useEffect(() => {
    const unsubscribe = (navigation as any).addListener?.('focus', () => {
      refresh();
    });
    return unsubscribe;
  }, [navigation, refresh]);

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'checklist', label: 'Checklists' },
    { key: 'script', label: 'Scripts' },
    { key: 'note', label: 'Notes' },
  ];

  const filtered = savedTools.filter((t) => t.type === activeTab);

  function handleRemove(tool: SavedTool) {
    Alert.alert('Remove this item?', `"${tool.title}" will be removed from your saved tools.`, [
      { text: 'Keep it', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          await removeTool(tool);
          Alert.alert('Removed', 'This saved item has been removed.', [{ text: 'OK' }]);
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Your saved tools</Text>
      </View>

      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
            activeOpacity={0.8}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === tab.key }}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="small" color={COLORS.primary} style={styles.spinner} />
        ) : filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Nothing saved here yet.</Text>
            <Text style={styles.emptySubTitle}>
              {activeTab === 'checklist'
                ? 'Open a lesson and tap "Save checklist" to save it here.'
                : activeTab === 'script'
                ? 'Open a lesson with a script and tap "Save this script" to keep it here.'
                : 'Notes you add will appear here.'}
            </Text>
          </View>
        ) : (
          filtered.map((tool) => (
            <View key={tool.id} style={styles.toolCard}>
              <View style={styles.toolCardHeader}>
                <Text style={styles.toolTitle} numberOfLines={2}>
                  {tool.title}
                </Text>
                <TouchableOpacity
                  onPress={() => handleRemove(tool)}
                  style={styles.removeButton}
                  activeOpacity={0.7}
                  accessibilityLabel={`Remove ${tool.title}`}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.toolContent} numberOfLines={4}>
                {tool.content}
              </Text>
              <View style={styles.toolFooter}>
                <View style={styles.toolFooterLeft}>
                  <CategoryBadge category={tool.category} />
                  <Text style={styles.savedLabel}>Saved</Text>
                </View>
                <Text style={styles.toolDate}>{formatDate(tool.savedAt)}</Text>
              </View>
            </View>
          ))
        )}
        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.title,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  tab: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginRight: SPACING.xs,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    ...TYPOGRAPHY.label,
    color: COLORS.textMuted,
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  spinner: {
    paddingTop: SPACING.xxl,
  },
  emptyState: {
    paddingTop: SPACING.xxl,
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  emptyTitle: {
    ...TYPOGRAPHY.subtitle,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptySubTitle: {
    ...TYPOGRAPHY.bodyMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
  toolCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
    ...SHADOW.card,
  },
  toolCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  toolTitle: {
    ...TYPOGRAPHY.subtitle,
    fontSize: 15,
    flex: 1,
    marginRight: SPACING.sm,
  },
  removeButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    flexShrink: 0,
  },
  removeButtonText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  toolContent: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: SPACING.sm,
  },
  toolFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toolFooterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  savedLabel: {
    ...TYPOGRAPHY.small,
    color: COLORS.success,
    fontWeight: '600',
  },
  toolDate: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
  },
  bottomPad: {
    height: SPACING.xl,
  },
});
