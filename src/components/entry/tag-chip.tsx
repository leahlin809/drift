import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/theme';

interface TagChipProps {
  label: string;
  onPress?: () => void;
  topic?: boolean;
  compact?: boolean;
}

export function TagChip({ label, onPress, topic = false, compact = false }: TagChipProps) {
  const theme = useAppTheme();
  const content = (
    <Text numberOfLines={1} style={[styles.text, compact && styles.compactText, { color: topic ? theme.colors.topicText : theme.colors.tagText }]}>
      {topic ? label : `#${label}`}
    </Text>
  );
  const style = [
    styles.chip,
    compact && styles.compact,
    { backgroundColor: topic ? theme.colors.topicSurface : theme.colors.tagSurface },
  ];
  return onPress ? <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [style, { opacity: pressed ? 0.68 : 1 }]}>{content}</Pressable> : <View style={style}>{content}</View>;
}

const styles = StyleSheet.create({
  chip: { minHeight: 28, maxWidth: 180, paddingHorizontal: 10, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  compact: { minHeight: 23, paddingHorizontal: 8 },
  text: { fontSize: 13, lineHeight: 18, fontWeight: '600' },
  compactText: { fontSize: 11.5, lineHeight: 15 },
});
