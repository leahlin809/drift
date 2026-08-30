export type ISODateTimeString = string;

export interface EntryLocation {
  entry_id: string;
  location_id: string;
  created_at: ISODateTimeString;
}

export interface EntryTag {
  entry_id: string;
  tag_id: string;
}

export interface EntryTopic {
  entry_id: string;
  topic_id: string;
}

export interface TopicLocation {
  topic_id: string;
  location_id: string;
}
