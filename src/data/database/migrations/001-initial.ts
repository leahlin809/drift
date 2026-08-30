import type { SQLiteDatabase } from 'expo-sqlite';

export const initialMigration = {
  version: 1,
  name: 'initial_domain_schema',
  async up(db: SQLiteDatabase) {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS entries (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN (
          'book', 'movie', 'music', 'person', 'history_event',
          'place_space', 'article_podcast', 'other'
        )),
        note TEXT,
        source TEXT,
        creator TEXT,
        year INTEGER,
        cover TEXT,
        external_link TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS locations (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN (
          'country', 'city', 'region', 'point', 'custom_area'
        )),
        parent_location_id TEXT REFERENCES locations(id) ON DELETE SET NULL,
        latitude REAL,
        longitude REAL,
        address TEXT,
        place_name TEXT,
        geometry TEXT,
        description TEXT,
        created_at TEXT NOT NULL,
        CHECK (
          (type = 'point' AND latitude IS NOT NULL AND longitude IS NOT NULL)
          OR type <> 'point'
        ),
        CHECK ((type = 'custom_area' AND geometry IS NOT NULL) OR type <> 'custom_area')
      );

      CREATE TABLE IF NOT EXISTS tags (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        color TEXT,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS topics (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        note TEXT,
        cover TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS entry_locations (
        entry_id TEXT NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
        location_id TEXT NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
        created_at TEXT NOT NULL,
        PRIMARY KEY (entry_id, location_id)
      );

      CREATE TABLE IF NOT EXISTS entry_tags (
        entry_id TEXT NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
        tag_id TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
        PRIMARY KEY (entry_id, tag_id)
      );

      CREATE TABLE IF NOT EXISTS entry_topics (
        entry_id TEXT NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
        topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
        PRIMARY KEY (entry_id, topic_id)
      );

      CREATE TABLE IF NOT EXISTS topic_locations (
        topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
        location_id TEXT NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
        PRIMARY KEY (topic_id, location_id)
      );

      CREATE INDEX IF NOT EXISTS idx_entries_updated_at ON entries(updated_at DESC);
      CREATE INDEX IF NOT EXISTS idx_locations_parent ON locations(parent_location_id);
      CREATE INDEX IF NOT EXISTS idx_entry_locations_location ON entry_locations(location_id);
      CREATE INDEX IF NOT EXISTS idx_entry_tags_tag ON entry_tags(tag_id);
    `);
  },
} as const;
