import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme';

export function AddEntryLink() {
  const theme = useAppTheme();
  const { t } = useLocalization();
  return (
    <Link href="/add-entry" asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('navigation.addEntry')}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: theme.colors.accent,
            opacity: pressed ? 0.78 : 1,
          },
        ]}
      >
        <Text style={[theme.typography.metadata, styles.label, { color: theme.colors.onAccent }]}>
          + {t('navigation.addEntry')}
        </Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
  label: { fontWeight: '600' },
});
