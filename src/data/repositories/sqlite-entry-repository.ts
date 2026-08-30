import { randomUUID } from 'expo-crypto';
import type { SQLiteDatabase } from 'expo-sqlite';

import type { CreateEntryInput, Entry, UpdateEntryInput } from '@/domain';

import type { EntryRepository } from './entry-repository';

const ENTRY_COLUMNS = `
  id, title, type, note, source, creator, year, cover,
  external_link, created_at, updated_at
`;

export class SQLiteEntryRepository implements EntryRepository {
  constructor(private readonly db: SQLiteDatabase) {}

  async list() {
    return this.db.getAllAsync<Entry>(
      `SELECT ${ENTRY_COLUMNS} FROM entries ORDER BY updated_at DESC`,
    );
  }

  async getById(id: string) {
    return this.db.getFirstAsync<Entry>(
      `SELECT ${ENTRY_COLUMNS} FROM entries WHERE id = ?`,
      id,
    );
  }

  async create(input: CreateEntryInput) {
    const now = new Date().toISOString();
    const entry: Entry = {
      id: randomUUID(),
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

    await this.db.runAsync(
      `INSERT INTO entries (
        id, title, type, note, source, creator, year, cover,
        external_link, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      entry.id,
      entry.title,
      entry.type,
      entry.note,
      entry.source,
      entry.creator,
      entry.year,
      entry.cover,
      entry.external_link,
      entry.created_at,
      entry.updated_at,
    );

    return entry;
  }

  async update(input: UpdateEntryInput) {
    const updated_at = new Date().toISOString();
    await this.db.runAsync(
      `UPDATE entries SET
        title = ?, type = ?, note = ?, source = ?, creator = ?, year = ?,
        cover = ?, external_link = ?, updated_at = ?
      WHERE id = ?`,
      input.title,
      input.type,
      input.note,
      input.source,
      input.creator,
      input.year,
      input.cover,
      input.external_link,
      updated_at,
      input.id,
    );

    const updated = await this.getById(input.id);
    if (!updated) throw new Error(`Entry not found: ${input.id}`);
    return updated;
  }

  async delete(id: string) {
    await this.db.runAsync('DELETE FROM entries WHERE id = ?', id);
  }
}
