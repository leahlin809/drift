import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AddEntryLink } from '@/components/common/add-entry-link';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme';

export default function LibraryScreen() {
  const theme = useAppTheme();
  const { t } = useLocalization();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[theme.typography.screenTitle, { color: theme.colors.textPrimary }]}>
          {t('library.title')}
        </Text>
        <AddEntryLink />
      </View>
      <View style={styles.empty}>
        <Text style={[theme.typography.sectionTitle, { color: theme.colors.textPrimary }]}>
          {t('library.emptyTitle')}
        </Text>
        <Text style={[theme.typography.body, styles.emptyBody, { color: theme.colors.textSecondary }]}>
          {t('library.emptyBody')}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  header: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  empty: { flex: 1, justifyContent: 'center', paddingBottom: 96 },
  emptyBody: { marginTop: 10, maxWidth: 310 },
});
