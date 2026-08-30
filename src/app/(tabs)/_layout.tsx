import { Tabs } from 'expo-router';

import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme';

export default function TabsLayout() {
  const theme = useAppTheme();
  const { t } = useLocalization();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.separator,
        },
        tabBarLabelStyle: theme.typography.caption,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: t('navigation.map') }}
      />
      <Tabs.Screen
        name="library"
        options={{ title: t('navigation.library') }}
      />
    </Tabs>
  );
}
