import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  registerApi,
  verifyUserApi,
  loginUserApi,
  getCurrentApi,
  forgotPasswordApi,
  logoutUserApi,
} from '../../shared/api/auth_api';

export const register = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const data = await registerApi(payload);
    return data;
  } catch (error) {
    return rejectWithValue(
      error?.response?.data?.message || error.message
    );
  }
});

export const verify = createAsyncThunk('auth/verify', async ({ code }, { rejectWithValue }) => {
  try {
    const data = await verifyUserApi(code);
    return data;
  } catch (error) {
    return rejectWithValue(
      error?.response?.data?.message || error.message
    );
  }
});

export const login = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const data = await loginUserApi(payload);
    return data;
  } catch (error) {
    return rejectWithValue(
      error?.response?.data?.message || error.message
    );
  }
});

export const getCurrent = createAsyncThunk('auth/current', async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const data = await getCurrentApi(token);
    return data;
  } catch (error) {
    return rejectWithValue(
      error?.response?.data?.message || error.message
    );
  }
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (payload, { rejectWithValue }) => {
  try {
    const data = await forgotPasswordApi(payload);
    return data;
  } catch (error) {
    return rejectWithValue(
      error?.response?.data?.message || error.message
    );
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await logoutUserApi();
    return true;
  } catch (error) {
    return rejectWithValue(
      error?.response?.data?.message || error.message
    );
  }
});
