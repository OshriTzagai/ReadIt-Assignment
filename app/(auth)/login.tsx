import { useState, useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  withTiming,
  withDelay,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login } from '@/store/authSlice';
import { colors, spacing, fonts } from '@/theme/index';





export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const status = useAppSelector((s) => s.auth.status);
  const error = useAppSelector((s) => s.auth.error);
  const scheme = useColorScheme() ?? 'light';
  const theme = colors[scheme];

  const logoScale = useSharedValue(0.5);
  const logoOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(18);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    const easing = Easing.out(Easing.back(1.4));
    logoScale.value = withTiming(1, { duration: 500, easing });
    logoOpacity.value = withTiming(1, { duration: 400 });
    textTranslateY.value = withDelay(180, withTiming(0, { duration: 400, easing: Easing.out(Easing.ease) }));
    textOpacity.value = withDelay(180, withTiming(1, { duration: 400 }));
  }, [logoScale, logoOpacity, textTranslateY, textOpacity]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: textTranslateY.value }],
    opacity: textOpacity.value,
  }));

  const handleLogin = useCallback(() => {
    if (!email.trim() || !password) return;
    dispatch(login({ email: email.trim(), password }));
  }, [dispatch, email, password]);

  const isLoading = status === 'loading';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.top}>
          <Animated.View
            style={[styles.logoCircle, { backgroundColor: theme.tint }, logoStyle]}
          >
            <Ionicons name="newspaper" size={38} color="#fff" />
          </Animated.View>
          <Animated.View style={[styles.textBlock, textStyle]}>
            <Text style={[styles.appName, { color: theme.text }]}>ReadIt</Text>
            <Text style={[styles.tagline, { color: theme.textSecondary }]}>
             Home Assigment | SQLink by Oshri
            </Text>
          </Animated.View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={[styles.inputRow, { borderColor: theme.border }]}>
            <Ionicons name="mail-outline" size={18} color={theme.textTertiary} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Email"
              placeholderTextColor={theme.textTertiary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              returnKeyType="next"
              editable={!isLoading}
            />
          </View>

          <View style={[styles.inputRow, styles.inputRowLast, { borderColor: theme.border }]}>
            <Ionicons name="lock-closed-outline" size={18} color={theme.textTertiary} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Password"
              placeholderTextColor={theme.textTertiary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoComplete="password"
              returnKeyType="done"
              onSubmitEditing={handleLogin}
              editable={!isLoading}
            />
            <Pressable onPress={() => setShowPassword((p) => !p)} hitSlop={8}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color={theme.textTertiary}
              />
            </Pressable>
          </View>
        </View>

        {error ? (
          <Text style={[styles.error, { color: theme.error }]}>{error}</Text>
        ) : null}

        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.tint, opacity: pressed || isLoading ? 0.8 : 1 },
          ]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign in</Text>
          )}
        </Pressable>

        <View style={styles.hintBlock}>
          <Text style={[styles.hint, { color: theme.textTertiary }]}>
            Only today! free access with those credentials:
          </Text>
          <Text style={[styles.hint, { color: theme.textTertiary }]}>email: user@readit.dev</Text>
          <Text style={[styles.hint, { color: theme.textTertiary }]}>password: password123</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  top: { alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
    shadowColor: '#FF6600',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  textBlock: { alignItems: 'center', gap: spacing.xs },
  appName: { fontSize: 32, fontWeight: '700', letterSpacing: -0.5 },
  tagline: { fontSize: fonts.sizes.sm },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  inputRowLast: { borderBottomWidth: 0 },
  input: {
    flex: 1,
    fontSize: fonts.sizes.md,
    height: 36,
  },
  error: { fontSize: fonts.sizes.sm, textAlign: 'center' },
  button: {
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6600',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: { color: '#fff', fontSize: fonts.sizes.md, fontWeight: '600' },
  hint: { fontSize: fonts.sizes.xs, textAlign: 'center' },
  hintBlock: { alignItems: 'center', gap: 2 },
});