import { useColorScheme } from 'react-native';

import { themes } from './tokens';

export function useAppTheme() {
  return useColorScheme() === 'dark' ? themes.dark : themes.light;
}
