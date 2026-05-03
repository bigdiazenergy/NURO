import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChecklistItem as ChecklistItemType } from '../types';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../lib/theme';

interface ChecklistItemProps {
  item: ChecklistItemType;
  checked: boolean;
  onToggle: (id: string) => void;
}

export function ChecklistItem({ item, checked, onToggle }: ChecklistItemProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onToggle(item.id)}
      activeOpacity={0.7}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={item.text}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.itemText, checked && styles.itemTextChecked]}>{item.text}</Text>
        {item.detail ? (
          <Text style={[styles.detailText, checked && styles.detailTextChecked]}>
            {item.detail}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: RADIUS.sm,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 16,
  },
  textContainer: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  itemText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },
  itemTextChecked: {
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
  },
  detailText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  detailTextChecked: {
    color: COLORS.textMuted,
    opacity: 0.55,
  },
});
