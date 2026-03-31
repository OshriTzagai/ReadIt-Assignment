import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  loadToken,
  persistToken,
  clearToken,
  createToken,
  isTokenValid,
  validateCredentials,
  loginWithServer,
} from '@/services/authService';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  bootstrapped: boolean;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  bootstrapped: false,
  status: 'idle',
  error: null,
};

export const bootstrapAuth = createAsyncThunk('auth/bootstrap', async () => {
  const token = await loadToken();
  return isTokenValid(token) ? token : null;
});

export const login = createAsyncThunk(
  'auth/login',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const token = await loginWithServer(email, password);
      await persistToken(token);
      return token;
    } catch {
      // iif server is down, go local. 
    }

    if (!validateCredentials(email, password)) {
      return rejectWithValue('Invalid email or password');
    }
    const token = createToken(email);
    await persistToken(token);
    return token;
  },
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await clearToken();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.token = action.payload;
        state.isAuthenticated = action.payload !== null;
        state.bootstrapped = true;
      })
      .addCase(bootstrapAuth.rejected, (state) => {
        state.bootstrapped = true;
      })
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload;
        state.isAuthenticated = true;
        state.status = 'idle';
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.isAuthenticated = false;
        state.status = 'idle';
      });
  },
});

export default authSlice.reducer;