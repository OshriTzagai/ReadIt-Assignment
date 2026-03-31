import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import feedReducer from './feedSlice';
import bookmarkReducer from './bookmarkSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    feed: feedReducer,
    bookmarks: bookmarkReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;