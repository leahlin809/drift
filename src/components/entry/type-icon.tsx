import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';

import type { EntryType } from '@/domain';

const iconNames: Record<EntryType, ComponentProps<typeof Ionicons>['name']> = {
  book: 'book-outline',
  movie: 'film-outline',
  music: 'musical-notes-outline',
  person: 'person-outline',
  history_event: 'time-outline',
  place_space: 'location-outline',
  article_podcast: 'mic-outline',
  other: 'shapes-outline',
};

export function TypeIcon({ type, size = 19, color }: { type: EntryType; size?: number; color: string }) {
  return <Ionicons accessibilityLabel={type} name={iconNames[type]} size={size} color={color} />;
}
