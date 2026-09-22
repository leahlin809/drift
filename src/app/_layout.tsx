import { DarkTheme, DefaultTheme, Stack, ThemeProvider, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, useColorScheme } from 'react-native';

import { DataProvider } from '@/data';
import { DemoProvider } from '@/demo';
import { PreviewShell } from '@/components/layout/preview-shell';
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
      <Stack screenOptions={{ headerShown: false, animation: 'fade_from_bottom' }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="add-entry"
          options={{ presentation: 'fullScreenModal', title: t('addEntry.title') }}
        />
        <Stack.Screen name="location-picker" options={{ presentation: 'fullScreenModal' }} />
        <Stack.Screen name="entry/[id]" />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const pathname = usePathname();
  const isShowcase = Platform.OS === 'web' && pathname === '/showcase';
  const isStandaloneDemo = Platform.OS === 'web' && pathname === '/demo';

  if (isShowcase || isStandaloneDemo) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="showcase" />
        <Stack.Screen name="demo" />
      </Stack>
    );
  }

  return (
    <LocalizationProvider>
      <DataProvider>
        <DemoProvider>
          <PreviewShell>
            <RootNavigator />
          </PreviewShell>
        </DemoProvider>
      </DataProvider>
    </LocalizationProvider>
  );
}
