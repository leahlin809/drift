import type { CreateEntryInput, Entry, UpdateEntryInput } from '@/domain';

export interface EntryRepository {
  list(): Promise<Entry[]>;
  getById(id: string): Promise<Entry | null>;
  create(input: CreateEntryInput): Promise<Entry>;
  update(input: UpdateEntryInput): Promise<Entry>;
  delete(id: string): Promise<void>;
}
