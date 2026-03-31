import 'react-native-reanimated';
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store } from '@/store/index';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { bootstrapAuth } from '@/store/authSlice';
import { bootstrapBookmarks } from '@/store/bookmarkSlice';
import OfflineBanner from '@/components/OfflineBanner';

function AppNavigator() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const bootstrapped = useAppSelector((s) => s.auth.bootstrapped);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    dispatch(bootstrapAuth());
    dispatch(bootstrapBookmarks());
  }, [dispatch]);

  useEffect(() => {
    if (!bootstrapped) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [bootstrapped, isAuthenticated, segments, router]);

  if (!bootstrapped) return null;

  return (
    <>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="article/[id]" options={{ headerShown: false }} />
      </Stack>
      <OfflineBanner />
      <StatusBar style="auto" />
    </>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}