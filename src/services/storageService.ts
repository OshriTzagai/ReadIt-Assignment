import AsyncStorage from '@react-native-async-storage/async-storage';
import type { HNItem } from '@/utils/types';

const FEED_CACHE_KEY = 'readit_feed_cache';
const BOOKMARKS_KEY = 'readit_bookmarks';

// Feed Cache

export async function cacheFeed(items: HNItem[]): Promise<void> {
  await AsyncStorage.setItem(FEED_CACHE_KEY, JSON.stringify(items));
  console.log('Feed cached', items);
}

export async function loadCachedFeed(): Promise<HNItem[]> {
  try {
    const raw = await AsyncStorage.getItem(FEED_CACHE_KEY);
    return raw ? (JSON.parse(raw) as HNItem[]) : [];
  } catch {
    return [];
  }
}

// Bookmarks

export async function saveBookmarks(
  bookmarks: Record<number, HNItem>,
): Promise<void> {
  await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
}

export async function loadBookmarks(): Promise<Record<number, HNItem>> {
  try {
    const raw = await AsyncStorage.getItem(BOOKMARKS_KEY);
    return raw ? (JSON.parse(raw) as Record<number, HNItem>) : {};
  } catch {
    return {};
  }
}