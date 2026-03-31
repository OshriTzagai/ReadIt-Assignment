import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/authSlice';
import { decodeToken } from '@/services/authService';
import { colors, spacing, fonts } from '@/theme/index';
import type { ThemeColors } from '@/theme/index';

const DISPLAY_NAME_KEY = 'readit_display_name';

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.auth.token);
  const bookmarkCount = useAppSelector(
    (s) => Object.keys(s.bookmarks.bookmarks).length,
  );
  const scheme = useColorScheme() ?? 'light';
  const theme = colors[scheme];

  const email = decodeToken(token ?? '')?.sub ?? '';
  const initial = email.charAt(0).toUpperCase();

  const [displayName, setDisplayName] = useState('');
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    AsyncStorage.getItem(DISPLAY_NAME_KEY).then((val) => {
      if (val) setDisplayName(val);
    });
  }, []);

  const startEdit = useCallback(() => {
    setDraft(displayName);
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [displayName]);

  const saveName = useCallback(async () => {
    const trimmed = draft.trim();
    if (trimmed) {
      await AsyncStorage.setItem(DISPLAY_NAME_KEY, trimmed);
      setDisplayName(trimmed);
    }
    setEditing(false);
  }, [draft]);

  const handleLogout = useCallback(() => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => dispatch(logout()),
      },
    ]);
  }, [dispatch]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} bounces={false}>
        <View style={[styles.hero, { backgroundColor: theme.tint }]}>
          <View style={styles.avatarRing}>
            <Text style={styles.avatarLetter}>{initial}</Text>
          </View>

          {editing ? (
            <View style={styles.editRow}>
              <TextInput
                ref={inputRef}
                style={[styles.nameInput, { color: '#fff', borderBottomColor: 'rgba(255,255,255,0.6)' }]}
                value={draft}
                onChangeText={setDraft}
                onSubmitEditing={saveName}
                onBlur={saveName}
                placeholder="Enter display name"
                placeholderTextColor="rgba(255,255,255,0.5)"
                returnKeyType="done"
                maxLength={32}
                autoCorrect={false}
              />
            </View>
          ) : (
            <Pressable style={styles.nameRow} onPress={startEdit}>
              <Text style={styles.nameText}>
                {displayName || 'Add your name'}
              </Text>
              <Ionicons
                name="pencil-outline"
                size={14}
                color="rgba(255,255,255,0.7)"
                style={{ marginLeft: 6 }}
              />
            </Pressable>
          )}

          <Text style={styles.emailText}>{email}</Text>
        </View>

        <View style={[styles.statsRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.tint }]}>
              {bookmarkCount}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Saved
            </Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statItem}>
            <Ionicons name="newspaper-outline" size={22} color={theme.tint} />
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Reader
            </Text>
          </View>
        </View>

        <View style={[styles.section, { borderColor: theme.border }]}>
          <Row
            icon="person-outline"
            label="Account"
            value={email}
            theme={theme}
          />
          <Row
            icon="shield-checkmark-outline"
            label="Auth method"
            value="Token"
            theme={theme}
            last
          />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.logoutBtn,
            { backgroundColor: pressed ? '#c0392b' : '#e74c3c' },
          ]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={18} color="#fff" />
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({
  icon,
  label,
  value,
  theme,
  last = false,
}: {
  icon: string;
  label: string;
  value: string;
  theme: ThemeColors;
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.row,
        !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.border },
        { backgroundColor: theme.surface },
      ]}
    >
      <View style={[styles.rowIcon, { backgroundColor: theme.background }]}>
        <Ionicons name={icon as never} size={16} color={theme.tint} />
      </View>
      <Text style={[styles.rowLabel, { color: theme.text }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: theme.textSecondary }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingBottom: spacing.xxxl },
  hero: {
    alignItems: 'center',
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
  },
  avatarRing: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  avatarLetter: {
    fontSize: 38,
    fontWeight: '700',
    color: '#fff',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    fontSize: fonts.sizes.lg,
    fontWeight: '600',
    color: '#fff',
  },
  editRow: { width: 220, alignItems: 'center' },
  nameInput: {
    fontSize: fonts.sizes.lg,
    fontWeight: '600',
    borderBottomWidth: 1,
    paddingBottom: 4,
    textAlign: 'center',
    width: '100%',
  },
  emailText: {
    fontSize: fonts.sizes.sm,
    color: 'rgba(255,255,255,0.75)',
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.xs,
  },
  statDivider: { width: StyleSheet.hairlineWidth },
  statNumber: {
    fontSize: fonts.sizes.xxl,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: fonts.sizes.xs,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  rowIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    flex: 1,
    fontSize: fonts.sizes.md,
    fontWeight: '500',
  },
  rowValue: {
    fontSize: fonts.sizes.sm,
    maxWidth: 160,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    paddingVertical: spacing.md + 2,
    borderRadius: 14,
  },
  logoutText: {
    color: '#fff',
    fontSize: fonts.sizes.md,
    fontWeight: '600',
  },
});
