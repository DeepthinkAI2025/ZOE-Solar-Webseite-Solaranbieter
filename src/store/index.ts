import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import aiChatSlice from './slices/aiChatSlice';
import seoPerformanceSlice from './slices/seoPerformanceSlice';
import userAnalyticsSlice from './slices/userAnalyticsSlice';
import themeSlice from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    aiChat: aiChatSlice,
    seoPerformance: seoPerformanceSlice,
    userAnalytics: userAnalyticsSlice,
    theme: themeSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        // Ignore these field paths in all actions
        ignoredPaths: ['aiChat.messages'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;