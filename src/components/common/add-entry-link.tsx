import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme';

export function AddEntryLink({ compact = false }: { compact?: boolean }) {
  const theme = useAppTheme();
  const { t } = useLocalization();
  return (
    <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('navigation.addEntry')}
        onPress={() => router.push('/add-entry')}
        style={({ pressed }) => [
          styles.button,
          compact && styles.compact,
          {
            backgroundColor: theme.colors.accent,
            opacity: pressed ? 0.78 : 1,
          },
        ]}
      >
        <Text style={[theme.typography.metadata, styles.label, { color: theme.colors.onAccent }]}>
          {compact ? '+' : `+ ${t('navigation.addEntry')}`}
        </Text>
    </Pressable>
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
  compact: { width: 44, paddingHorizontal: 0 },
  label: { fontWeight: '600' },
});
