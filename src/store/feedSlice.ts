import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPageItems, fetchTopStoryIds } from '@/api/hn-client';
import { cacheFeed, loadCachedFeed } from '@/services/storageService';
import type { HNItem, FeedStatus } from '@/utils/types';
import type { RootState } from './index';

const PAGE_SIZE = 20;

interface FeedState {
  allIds: number[];
  items: HNItem[];
  page: number;
  status: FeedStatus;
  error: string | null;
  hasMore: boolean;
}

const initialState: FeedState = {
  allIds: [],
  items: [],
  page: 0,
  status: 'idle',
  error: null,
  hasMore: true,
};

export const loadFeed = createAsyncThunk(
  'feed/load',
  async (_, { rejectWithValue }) => {
    try {
      const ids = await fetchTopStoryIds();
      const items = await fetchPageItems(ids, 0);
      cacheFeed(items);
      return { ids, items };
    } catch {
      const cached = await loadCachedFeed();
      if (cached.length > 0) {
        return { ids: cached.map((i) => i.id), items: cached };
      }
      return rejectWithValue('Failed to load feed');
    }
  },
);

export const loadNextPage = createAsyncThunk(
  'feed/loadNextPage',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const nextPage = state.feed.page + 1;
    try {
      const items = await fetchPageItems(state.feed.allIds, nextPage);
      return { items, page: nextPage };
    } catch {
      return rejectWithValue('Failed to load more');
    }
  },
);

export const refreshFeed = createAsyncThunk(
  'feed/refresh',
  async (_, { rejectWithValue }) => {
    try {
      const ids = await fetchTopStoryIds();
      const items = await fetchPageItems(ids, 0);
      cacheFeed(items);
      return { ids, items };
    } catch {
      return rejectWithValue('Failed to refresh');
    }
  },
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadFeed.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadFeed.fulfilled, (state, action) => {
        state.allIds = action.payload.ids;
        state.items = action.payload.items;
        state.page = 0;
        state.status = 'succeeded';
        state.hasMore = action.payload.ids.length > PAGE_SIZE;
      })
      .addCase(loadFeed.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(loadNextPage.pending, (state) => {
        state.status = 'paginating';
      })
      .addCase(loadNextPage.fulfilled, (state, action) => {
        state.items.push(...action.payload.items);
        state.page = action.payload.page;
        state.status = 'succeeded';
        state.hasMore =
          (action.payload.page + 1) * PAGE_SIZE < state.allIds.length;
      })
      .addCase(loadNextPage.rejected, (state) => {
        state.status = 'succeeded';
      })
      .addCase(refreshFeed.pending, (state) => {
        state.status = 'refreshing';
      })
      .addCase(refreshFeed.fulfilled, (state, action) => {
        state.allIds = action.payload.ids;
        state.items = action.payload.items;
        state.page = 0;
        state.status = 'succeeded';
        state.hasMore = action.payload.ids.length > PAGE_SIZE;
      })
      .addCase(refreshFeed.rejected, (state) => {
        state.status = 'succeeded';
      });
  },
});

export default feedSlice.reducer;