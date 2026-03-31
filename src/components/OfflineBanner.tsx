import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNetwork } from '@/hooks/useNetwork';
import { colors, spacing, fonts } from '@/theme/index';

export default function OfflineBanner() {
  const { isConnected } = useNetwork();
  const scheme = useColorScheme() ?? 'light';
  const theme = colors[scheme];

  if (isConnected) return null;

  return (
    <View style={[styles.banner, { backgroundColor: theme.offlineBanner }]}>
      <Ionicons name="cloud-offline-outline" size={14} color="#fff" />
      <Text style={styles.text}>No internet connection</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    zIndex: 999,
  },
  text: {
    color: '#fff',
    fontSize: fonts.sizes.sm,
    fontWeight: '500',
  },
});