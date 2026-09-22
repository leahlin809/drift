import { createContext, type PropsWithChildren, useContext, useMemo } from 'react';

import type { CreateEntryInput, Entry, UpdateEntryInput } from '@/domain';

import type { EntryRepository } from '../repositories/entry-repository';

interface Repositories {
  entries: EntryRepository;
}

const RepositoryContext = createContext<Repositories | null>(null);

class WebDemoEntryRepository implements EntryRepository {
  private entries: Entry[] = [];

  async list() { return this.entries; }
  async getById(id: string) { return this.entries.find((entry) => entry.id === id) ?? null; }
  async create(input: CreateEntryInput) {
    const now = new Date().toISOString();
    const entry: Entry = {
      id: `web-demo-${Date.now()}`,
      title: input.title,
      type: input.type,
      note: input.note ?? null,
      source: input.source ?? null,
      creator: input.creator ?? null,
      year: input.year ?? null,
      cover: input.cover ?? null,
      external_link: input.external_link ?? null,
      created_at: now,
      updated_at: now,
    };
    this.entries = [entry, ...this.entries];
    return entry;
  }
  async update(input: UpdateEntryInput) {
    const current = await this.getById(input.id);
    if (!current) throw new Error(`Entry not found: ${input.id}`);
    const updated: Entry = { ...current, ...input, updated_at: new Date().toISOString() };
    this.entries = this.entries.map((entry) => entry.id === input.id ? updated : entry);
    return updated;
  }
  async delete(id: string) { this.entries = this.entries.filter((entry) => entry.id !== id); }
}

export function DataProvider({ children }: PropsWithChildren) {
  const repositories = useMemo(() => ({ entries: new WebDemoEntryRepository() }), []);
  return <RepositoryContext.Provider value={repositories}>{children}</RepositoryContext.Provider>;
}

export function useRepositories() {
  const repositories = useContext(RepositoryContext);
  if (!repositories) throw new Error('useRepositories must be used inside DataProvider');
  return repositories;
}
