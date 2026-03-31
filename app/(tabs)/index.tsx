import { useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadFeed, loadNextPage, refreshFeed } from '@/store/feedSlice';
import ArticleRow, { ITEM_HEIGHT } from '@/components/ArticleRow';
import SkeletonRow from '@/components/SkeletonRow';
import { colors, spacing, fonts } from '@/theme/index';
import type { HNItem } from '@/utils/types';

const SKELETON_DATA = Array.from({ length: 10 }, (_, i) => `sk-${i}`);

export default function FeedScreen() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.feed.items);
  const status = useAppSelector((s) => s.feed.status);
  const hasMore = useAppSelector((s) => s.feed.hasMore);
  const error = useAppSelector((s) => s.feed.error);
  const scheme = useColorScheme() ?? 'light';
  const theme = colors[scheme];

  useEffect(() => {
    dispatch(loadFeed());
  }, [dispatch]);

  const handleEndReached = useCallback(() => {
    if (status === 'succeeded' && hasMore) {
      dispatch(loadNextPage());
    }
  }, [dispatch, status, hasMore]);

  const handleRefresh = useCallback(() => {
    dispatch(refreshFeed());
  }, [dispatch]);

  const renderItem = useCallback(
    ({ item }: { item: HNItem }) => <ArticleRow item={item} />,
    [],
  );

  const keyExtractor = useCallback((item: HNItem) => String(item.id), []);

  const getItemLayout = useCallback(
    (_: ArrayLike<HNItem> | null | undefined, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [],
  );

  const Separator = useCallback(
    () => (
      <View
        style={[styles.separator, { backgroundColor: theme.border }]}
      />
    ),
    [theme.border],
  );

  const Footer = useCallback(() => {
    if (status !== 'paginating') return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={theme.tint} />
      </View>
    );
  }, [status, theme.tint]);

  const isLoading = status === 'loading';
  const isRefreshing = status === 'refreshing';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <View>
          <Text style={[styles.title, { color: theme.tint }]}>ReadIt</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Top Stories</Text>
        </View>
      </View>

      {error && status === 'failed' ? (
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
        </View>
      ) : isLoading ? (
        <FlatList
          data={SKELETON_DATA}
          renderItem={() => <SkeletonRow />}
          keyExtractor={(key) => key}
          scrollEnabled={false}
          ItemSeparatorComponent={Separator}
        />
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          windowSize={5}
          maxToRenderPerBatch={10}
          initialNumToRender={10}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.3}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          ListFooterComponent={Footer}
          ItemSeparatorComponent={Separator}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: { fontSize: fonts.sizes.xl, fontWeight: '700' },
  subtitle: { fontSize: fonts.sizes.xs, fontWeight: '400', marginTop: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { fontSize: fonts.sizes.md, textAlign: 'center' },
  footer: { paddingVertical: spacing.lg, alignItems: 'center' },
  separator: { height: StyleSheet.hairlineWidth, marginLeft: spacing.lg },
});