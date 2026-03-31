import { useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleBookmark } from '@/store/bookmarkSlice';
import { timeAgo, extractDomain, formatScore } from '@/utils/formatters';
import { colors, spacing, fonts } from '@/theme/index';

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const scheme = useColorScheme() ?? 'light';
  const theme = colors[scheme];

  const numericId = Number(id);

  const item = useAppSelector(
    (s) =>
      s.feed.items.find((i) => i.id === numericId) ??
      s.bookmarks.bookmarks[numericId] ??
      null,
  );

  const isBookmarked = useAppSelector(
    (s) => !!s.bookmarks.bookmarks[numericId],
  );

  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 350 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const handleBookmark = useCallback(() => {
    if (item) dispatch(toggleBookmark(item));
  }, [dispatch, item]);

  const articleUrl = item?.url ?? 'https://news.ycombinator.com';
  const domain = extractDomain(item?.url);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={[styles.headerArea, { borderBottomColor: theme.border, backgroundColor: theme.surface }]}>
        <View style={styles.navRow}>
          <Pressable
            style={({ pressed }) => [styles.iconBtn, { backgroundColor: pressed ? theme.border : theme.background }]}
            onPress={() => router.back()}
            hitSlop={8}
          >
            <Ionicons name="arrow-back" size={20} color={theme.text} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.iconBtn,
              { backgroundColor: isBookmarked ? theme.tint : pressed ? theme.border : theme.background },
            ]}
            onPress={handleBookmark}
            hitSlop={8}
          >
            <Ionicons
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color={isBookmarked ? '#fff' : theme.textSecondary}
            />
          </Pressable>
        </View>

        {item ? (
          <>
            {domain ? (
              <View style={[styles.domainBadge, { backgroundColor: theme.tint + '18' }]}>
                <Ionicons name="link-outline" size={11} color={theme.tint} />
                <Text style={[styles.domainText, { color: theme.tint }]}>{domain}</Text>
              </View>
            ) : null}

            <Text style={[styles.title, { color: theme.text }]} numberOfLines={4}>
              {item.title}
            </Text>

            <View style={styles.chipsRow}>
              <View style={[styles.chip, { backgroundColor: theme.tint }]}>
                <Ionicons name="arrow-up" size={12} color="#fff" />
                <Text style={styles.chipText}>{formatScore(item.score)}</Text>
              </View>

              <View style={[styles.chip, { backgroundColor: theme.background, borderWidth: StyleSheet.hairlineWidth, borderColor: theme.border }]}>
                <Ionicons name="person-outline" size={12} color={theme.textSecondary} />
                <Text style={[styles.chipText, { color: theme.textSecondary }]}>{item.by}</Text>
              </View>

              <View style={[styles.chip, { backgroundColor: theme.background, borderWidth: StyleSheet.hairlineWidth, borderColor: theme.border }]}>
                <Ionicons name="chatbubble-outline" size={12} color={theme.textSecondary} />
                <Text style={[styles.chipText, { color: theme.textSecondary }]}>
                  {item.descendants ?? 0}
                </Text>
              </View>

              <Text style={[styles.timeText, { color: theme.textTertiary }]}>
                {timeAgo(item.time)}
              </Text>
            </View>
          </>
        ) : null}
      </View>

      <Animated.View style={[styles.webview, animatedStyle]}>
        <WebView
          source={{ uri: articleUrl }}
          startInLoadingState
          renderLoading={() => (
            <View style={[styles.loading, { backgroundColor: theme.background }]}>
              <ActivityIndicator color={theme.tint} />
            </View>
          )}
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  headerArea: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: spacing.sm,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  domainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 20,
  },
  domainText: {
    fontSize: fonts.sizes.xs,
    fontWeight: '600',
  },
  title: {
    fontSize: fonts.sizes.lg + 1,
    fontWeight: '700',
    lineHeight: 26,
  },
  chipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 20,
  },
  chipText: {
    fontSize: fonts.sizes.xs,
    fontWeight: '600',
    color: '#fff',
  },
  timeText: {
    fontSize: fonts.sizes.xs,
    marginLeft: 2,
  },
  webview: { flex: 1 },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
