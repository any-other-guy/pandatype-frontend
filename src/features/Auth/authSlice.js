import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { client } from '../../utils/client';

const initialState = {
  showLoginForm: false,
  loading: {
    status: 'idle',
    error: null,
  },
  login: {
    status: null,
    error: '',
  },
  registration: {
    status: null,
    error: '',
  },
  token: null,
  username: null,
};

export const postLogin = createAsyncThunk('auth/postLogin', async (body, ...payload) => {
  const url = `${process.env.REACT_APP_AUTH_API_URL}/login`;
  const response = await client.post(url, body, payload);
  return response.data;
});

export const postRegister = createAsyncThunk('auth/postRegister', async (body, ...payload) => {
  const url = `${process.env.REACT_APP_AUTH_API_URL}/register`;
  const response = await client.post(url, body, payload);
  return response.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    showLoginFormAction(state, action) {
      const { show } = action.payload;
      state.showLoginForm = show;
    },
  },
  extraReducers(builder) {
    builder
      // POST /login handler
      .addCase(postLogin.pending, (state) => {
        state.loading.status = 'loading';
      })
      .addCase(postLogin.fulfilled, (state, action) => {
        state.loading.status = 'succeeded';
        const { status, message, username } = action.payload;
        if (status === 'SUCCESS' && message.includes('Bearer') && username !== null) {
          state.hasLogin = true;
          state.username = username;
          state.token = message;
          state.login.status = 'ok';
        } else {
          state.hasLogin = false;
          state.login.status = 'error';
          state.login.error = message;
        }
      })
      .addCase(postLogin.rejected, (state, action) => {
        state.loading.status = 'failed';
        state.loading.error = action.error.message;
      })
      // POST /register handler
      .addCase(postRegister.pending, (state) => {
        state.loading.status = 'loading';
      })
      .addCase(postRegister.fulfilled, (state, action) => {
        state.loading.status = 'succeeded';
        const { status, message, username } = action.payload;
        if (status === 'SUCCESS' && message.includes('Bearer') && username !== null) {
          state.hasLogin = true;
          state.username = username;
          state.token = message;
          state.registration.status = 'ok';
        } else {
          state.hasLogin = false;
          state.registration.status = 'error';
          state.registration.error = message;
        }
      })
      .addCase(postRegister.rejected, (state, action) => {
        state.loading.status = 'failed';
        state.loading.error = action.error.message;
      });
  },
});

export const { showLoginFormAction } = authSlice.actions;

export default authSlice.reducer;
