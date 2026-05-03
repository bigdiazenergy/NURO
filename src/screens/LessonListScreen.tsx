import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { COLORS, SPACING, TYPOGRAPHY } from '../lib/theme';
import { getLessonsByCategory } from '../sample-data/lessons';
import { LessonCard } from '../components/LessonCard';
import { useProgress } from '../hooks/useProgress';

type Props = NativeStackScreenProps<RootStackParamList, 'LessonList'>;

export function LessonListScreen({ route, navigation }: Props) {
  const { category, title } = route.params;
  const { isComplete, refresh } = useProgress();
  const lessons = getLessonsByCategory(category);

  useEffect(() => {
    navigation.setOptions({ title });
    const unsubscribe = navigation.addListener('focus', refresh);
    return unsubscribe;
  }, [navigation, title, refresh]);

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={lessons}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.count}>
              {lessons.length} {lessons.length === 1 ? 'lesson' : 'lessons'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <LessonCard
            lesson={item}
            completed={isComplete(item.id)}
            onPress={() => navigation.navigate('LessonDetail', { lessonId: item.id })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No lessons in this category yet.</Text>
          </View>
        }
      />
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
    paddingBottom: SPACING.xl,
  },
  header: {
    paddingTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  count: {
    ...TYPOGRAPHY.bodyMuted,
  },
  empty: {
    paddingVertical: SPACING.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...TYPOGRAPHY.bodyMuted,
  },
});
