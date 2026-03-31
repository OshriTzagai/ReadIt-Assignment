import * as SecureStore from 'expo-secure-store';
import type { AuthPayload } from '@/utils/types';

const TOKEN_KEY = 'readit_auth_token';

const VALID_CREDENTIALS = {
  email: 'user@readit.dev',
  password: 'password123',
} as const;

const SERVER_URL = "your_ip_address:3001"; //! change to you ip address here and run npm start on server folder .. if server is not running - use the local login

export async function loginWithServer(
  email: string,
  password: string,
): Promise<string> {
  const res = await fetch(`${SERVER_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Invalid credentials');
  const data = (await res.json()) as { token: string };
  return data.token;
}

export function validateCredentials(email: string, password: string): boolean {
  return (
    email === VALID_CREDENTIALS.email && password === VALID_CREDENTIALS.password
  );
}

export function createToken(email: string): string {
  const now = Math.floor(Date.now() / 1000);
  const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({ sub: email, iat: now, exp: now + 86_400 } satisfies AuthPayload),
  );
  return `${header}.${payload}.unsigned`;
}

export async function persistToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function loadToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function clearToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export function decodeToken(token: string): AuthPayload | null {
  try {
    return JSON.parse(atob(token.split('.')[1])) as AuthPayload;
  } catch {
    return null;
  }
}

export function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  const payload = decodeToken(token);
  if (!payload) return false;
  return payload.exp * 1000 > Date.now();
}
