import { useEffect } from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { colors, spacing } from '@/theme/index';
import { ITEM_HEIGHT } from '@/components/ArticleRow';

export default function SkeletonRow() {
  const scheme = useColorScheme() ?? 'light';
  const theme = colors[scheme];

  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.35, { duration: 700, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return { opacity: opacity.value };
  });

  const bone = (width: string) => (
    <Animated.View
      style={[
        styles.bone,
        { width, backgroundColor: theme.skeleton },
        animatedStyle,
      ]}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        {bone('88%')}
        {bone('55%')}
        {bone('45%')}
      </View>
      <Animated.View
        style={[styles.icon, { backgroundColor: theme.skeleton }, animatedStyle]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    height: ITEM_HEIGHT,
  },
  content: { flex: 1, gap: spacing.xs },
  bone: { height: 14, borderRadius: 4 },
  icon: { width: 20, height: 20, borderRadius: 4, marginLeft: spacing.md },
});