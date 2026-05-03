import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Category } from '../types';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../lib/theme';
import { getCategoryMeta } from '../sample-data/categories';

interface CategoryBadgeProps {
  category: Category;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const meta = getCategoryMeta(category);

  return (
    <View style={[styles.badge, { backgroundColor: meta.color + '20', borderColor: meta.color + '40' }]}>
      <Text style={[styles.text, { color: meta.color }]}>{meta.title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
});
