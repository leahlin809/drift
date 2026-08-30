import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import {
  createContext,
  type PropsWithChildren,
  Suspense,
  useContext,
  useMemo,
} from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme';

import type { EntryRepository } from '../repositories/entry-repository';
import { SQLiteEntryRepository } from '../repositories/sqlite-entry-repository';
import { migrateDatabase } from './migrate';

interface Repositories {
  entries: EntryRepository;
}

const RepositoryContext = createContext<Repositories | null>(null);

function RepositoryBridge({ children }: PropsWithChildren) {
  const db = useSQLiteContext();
  const repositories = useMemo(
    () => ({ entries: new SQLiteEntryRepository(db) }),
    [db],
  );

  return (
    <RepositoryContext.Provider value={repositories}>
      {children}
    </RepositoryContext.Provider>
  );
}

function DatabaseFallback() {
  const theme = useAppTheme();
  const { t } = useLocalization();
  return (
    <View style={[styles.fallback, { backgroundColor: theme.colors.background }]}>
      <ActivityIndicator color={theme.colors.accent} />
      <Text style={[theme.typography.metadata, { color: theme.colors.textSecondary }]}>
        {t('common.loading')}
      </Text>
    </View>
  );
}

export function DataProvider({ children }: PropsWithChildren) {
  return (
    <Suspense fallback={<DatabaseFallback />}>
      <SQLiteProvider
        databaseName="wish-map.db"
        onInit={migrateDatabase}
        useSuspense
      >
        <RepositoryBridge>{children}</RepositoryBridge>
      </SQLiteProvider>
    </Suspense>
  );
}

export function useRepositories() {
  const repositories = useContext(RepositoryContext);
  if (!repositories) {
    throw new Error('useRepositories must be used inside DataProvider');
  }
  return repositories;
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
});
