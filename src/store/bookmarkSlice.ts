import { createSlice, createAsyncThunk, current, type PayloadAction } from '@reduxjs/toolkit';
import { saveBookmarks, loadBookmarks } from '@/services/storageService';
import type { HNItem } from '@/utils/types';

interface BookmarkState {
  bookmarks: Record<number, HNItem>;
}

const initialState: BookmarkState = {
  bookmarks: {},
};

export const bootstrapBookmarks = createAsyncThunk(
  'bookmarks/bootstrap',
  async () => loadBookmarks(),
);

const bookmarkSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    toggleBookmark(state, action: PayloadAction<HNItem>) {
      const { id } = action.payload;
      if (state.bookmarks[id]) {
        delete state.bookmarks[id];
      } else {
        state.bookmarks[id] = action.payload;
      }
      saveBookmarks(current(state.bookmarks));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(bootstrapBookmarks.fulfilled, (state, action) => {
      state.bookmarks = action.payload;
    });
  },
});

export const { toggleBookmark } = bookmarkSlice.actions;
export default bookmarkSlice.reducer;