import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleBookmark } from '@/store/bookmarkSlice';
import { timeAgo, extractDomain, formatScore } from '@/utils/formatters';
import { colors, spacing, fonts } from '@/theme/index';
import type { HNItem } from '@/utils/types';

export const ITEM_HEIGHT = 80;

function ArticleRow({ item }: { item: HNItem }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isBookmarked = useAppSelector((s) => !!s.bookmarks.bookmarks[item.id]);
  const scheme = useColorScheme() ?? 'light';
  const theme = colors[scheme];

  const handlePress = useCallback(() => {
    router.push({
      pathname: '/article/[id]',
      params: { id: item.id.toString() },
    });
  }, [router, item.id]);

  const handleBookmark = useCallback(() => {
    dispatch(toggleBookmark(item));
  }, [dispatch, item]);

  const score = `${formatScore(item.score)} pts`;
  const rest = [
    extractDomain(item.url),
    `${item.descendants ?? 0} comments`,
    timeAgo(item.time),
  ]
    .filter(Boolean)
    .join('  ·  ');

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: pressed ? theme.surface : theme.background },
      ]}
      onPress={handlePress}
    >
      {isBookmarked && (
        <View style={[styles.accent, { backgroundColor: theme.tint }]} />
      )}
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.meta, { color: theme.textSecondary }]} numberOfLines={1}>
          <Text style={{ color: theme.tint, fontWeight: '500' }}>{score}</Text>
          {rest ? `  ·  ${rest}` : ''}
        </Text>
      </View>
      <Pressable style={styles.bookmarkBtn} onPress={handleBookmark} hitSlop={8}>
        <Ionicons
          name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
          size={20}
          color={isBookmarked ? theme.tint : theme.textTertiary}
        />
      </Pressable>
    </Pressable>
  );
}

export default memo(ArticleRow);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    height: ITEM_HEIGHT,
    position: 'relative',
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 12,
    bottom: 12,
    width: 3,
    borderRadius: 2,
  },
  content: { flex: 1, gap: spacing.xs },
  title: {
    fontSize: fonts.sizes.md,
    fontWeight: '600',
    lineHeight: 22,
  },
  meta: { fontSize: fonts.sizes.sm },
  bookmarkBtn: { paddingLeft: spacing.md, alignSelf: 'center' },
});
