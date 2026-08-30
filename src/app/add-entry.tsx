import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme';

export default function AddEntryScreen() {
  const theme = useAppTheme();
  const { t } = useLocalization();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text style={[theme.typography.screenTitle, { color: theme.colors.textPrimary }]}>
          {t('addEntry.title')}
        </Text>
        <Text style={[theme.typography.body, { color: theme.colors.textSecondary }]}>
          {t('addEntry.foundationOnly')}
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.back()}
        style={({ pressed }) => [
          styles.closeButton,
          {
            backgroundColor: theme.colors.surfaceSecondary,
            opacity: pressed ? 0.72 : 1,
          },
        ]}
      >
        <Text style={[theme.typography.body, { color: theme.colors.textPrimary }]}>
          {t('common.close')}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  content: { flex: 1, gap: 12, paddingTop: 20 },
  closeButton: {
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
});
