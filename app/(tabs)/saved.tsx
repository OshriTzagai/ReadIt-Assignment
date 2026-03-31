import { useCallback } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector } from '@/store/hooks';
import ArticleRow, { ITEM_HEIGHT } from '@/components/ArticleRow';
import { colors, spacing, fonts } from '@/theme/index';
import type { HNItem } from '@/utils/types';

export default function SavedScreen() {
  const bookmarks = useAppSelector((s) => s.bookmarks.bookmarks);
  const items = Object.values(bookmarks);
  const scheme = useColorScheme() ?? 'light';
  const theme = colors[scheme];

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
    () => <View style={[styles.separator, { backgroundColor: theme.border }]} />,
    [theme.border],
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.text }]}>Saved</Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            No saved articles
          </Text>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            Tap the bookmark icon on any article to save it here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          windowSize={5}
          maxToRenderPerBatch={10}
          initialNumToRender={10}
          ItemSeparatorComponent={Separator}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: { fontSize: fonts.sizes.xl, fontWeight: '700' },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: { fontSize: fonts.sizes.lg, fontWeight: '600' },
  emptyText: { fontSize: fonts.sizes.sm, textAlign: 'center' },
  separator: { height: StyleSheet.hairlineWidth },
});