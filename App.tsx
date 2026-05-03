import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { RootStackParamList } from './src/types';
import { COLORS, TYPOGRAPHY } from './src/lib/theme';

import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { FocusAreaScreen } from './src/screens/FocusAreaScreen';
import { VoiceSetupScreen } from './src/screens/VoiceSetupScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { LessonListScreen } from './src/screens/LessonListScreen';
import { LessonDetailScreen } from './src/screens/LessonDetailScreen';
import { ChecklistScreen } from './src/screens/ChecklistScreen';
import { ScriptScreen } from './src/screens/ScriptScreen';
import { ReminderSetupScreen } from './src/screens/ReminderSetupScreen';
import { ProgressScreen } from './src/screens/ProgressScreen';
import { SavedToolsScreen } from './src/screens/SavedToolsScreen';
import { EmergencyHomeScreen } from './src/screens/EmergencyHomeScreen';
import { EmergencyTopicPickerScreen } from './src/screens/EmergencyTopicPickerScreen';
import { EmergencyRightNowScreen } from './src/screens/EmergencyRightNowScreen';
import { EmergencyLessonScreen } from './src/screens/EmergencyLessonScreen';
import { EmergencyContactsScreen } from './src/screens/EmergencyContactsScreen';
import { useOnboarding } from './src/hooks/useOnboarding';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<{
  Home: undefined;
  Progress: undefined;
  Saved: undefined;
  Emergency: undefined;
}>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '500',
          marginBottom: 4,
        },
        tabBarIconStyle: { display: 'none' },
        tabBarItemStyle: { paddingTop: 10 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{ tabBarLabel: 'Progress' }}
      />
      <Tab.Screen
        name="Saved"
        component={SavedToolsScreen}
        options={{ tabBarLabel: 'Saved' }}
      />
      <Tab.Screen
        name="Emergency"
        component={EmergencyHomeScreen}
        options={{ tabBarLabel: '🚨 SOS' }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { onboardingComplete, loading } = useOnboarding();

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={onboardingComplete ? 'Main' : 'Welcome'}
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.background,
        },
        headerShadowVisible: false,
        headerTintColor: COLORS.primary,
        headerTitleStyle: {
          ...TYPOGRAPHY.subtitle,
          fontSize: 17,
          color: COLORS.text,
        },
        headerBackTitle: 'Back',
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FocusArea"
        component={FocusAreaScreen}
        options={{ title: 'Focus areas', headerShown: true }}
      />
      <Stack.Screen
        name="VoiceSetup"
        component={VoiceSetupScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Main"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LessonList"
        component={LessonListScreen}
        options={{ title: '' }}
      />
      <Stack.Screen
        name="LessonDetail"
        component={LessonDetailScreen}
        options={{ title: '' }}
      />
      <Stack.Screen
        name="Checklist"
        component={ChecklistScreen}
        options={{ title: 'Checklist' }}
      />
      <Stack.Screen
        name="Script"
        component={ScriptScreen}
        options={{ title: 'Script' }}
      />
      <Stack.Screen
        name="ReminderSetup"
        component={ReminderSetupScreen}
        options={{ title: 'Reminders' }}
      />
      <Stack.Screen
        name="EmergencyTopicPicker"
        component={EmergencyTopicPickerScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EmergencyRightNow"
        component={EmergencyRightNowScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EmergencyLesson"
        component={EmergencyLessonScreen}
        options={{ title: '' }}
      />
      <Stack.Screen
        name="EmergencyContacts"
        component={EmergencyContactsScreen}
        options={{ title: 'Emergency Contacts' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" backgroundColor={COLORS.background} />
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
});
