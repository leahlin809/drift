import type { ISODateTimeString } from './shared';

export interface Tag {
  id: string;
  name: string;
  created_at: ISODateTimeString;
  color: string | null;
}
