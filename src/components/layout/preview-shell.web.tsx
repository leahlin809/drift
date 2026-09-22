import type { PropsWithChildren } from 'react';
import { Platform, StyleSheet, useColorScheme, useWindowDimensions, View } from 'react-native';

export function PreviewShell({ children }: PropsWithChildren) {
  const { width, height } = useWindowDimensions();
  const dark = useColorScheme() === 'dark';
  const framed = width >= 560;
  const phoneHeight = Math.min(896, Math.max(680, height - 32));

  return (
    <View style={[styles.stage, { backgroundColor: dark ? '#0B0E0C' : '#E7EAE6' }]}>
      <View
        style={[
          styles.phone,
          framed ? styles.framed : styles.unframed,
          { height: framed ? phoneHeight : height, width: framed ? 414 : width },
        ]}
      >
        {children}
        {framed ? <View pointerEvents="none" style={[styles.island, { backgroundColor: dark ? '#060706' : '#111311' }]} /> : null}
      </View>
      {framed ? <View style={[styles.caption, { opacity: Platform.OS === 'web' ? 1 : 0 }]} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stage: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  phone: { backgroundColor: '#F7F8F7', overflow: 'hidden' },
  framed: {
    borderRadius: 48,
    borderWidth: 7,
    borderColor: '#161916',
    shadowColor: '#0C120E',
    shadowOffset: { width: 0, height: 22 },
    shadowOpacity: 0.24,
    shadowRadius: 42,
  },
  unframed: { borderRadius: 0 },
  island: {
    position: 'absolute',
    top: 11,
    left: '50%',
    marginLeft: -48,
    width: 96,
    height: 27,
    borderRadius: 16,
  },
  caption: { position: 'absolute', width: 1, height: 1 },
});
