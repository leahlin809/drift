import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

import { DataProvider } from '@/data';
import { LocalizationProvider, useLocalization } from '@/localization';
import { useAppTheme } from '@/theme';

function RootNavigator() {
  const colorScheme = useColorScheme();
  const theme = useAppTheme();
  const { t } = useLocalization();

  const navigationTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const themedNavigation = {
    ...navigationTheme,
    colors: {
      ...navigationTheme.colors,
      primary: theme.colors.accent,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.textPrimary,
      border: theme.colors.separator,
    },
  };

  return (
    <ThemeProvider value={themedNavigation}>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="add-entry"
          options={{ presentation: 'modal', title: t('addEntry.title') }}
        />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <LocalizationProvider>
      <DataProvider>
        <RootNavigator />
      </DataProvider>
    </LocalizationProvider>
  );
}
