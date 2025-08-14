import { createSlice } from '@reduxjs/toolkit';

import {
  register,
  verify,
  login,
  logout,
  getCurrent,
  forgotPassword,
} from './auth_thunks';

import { pending, rejected } from '../reduxHelper'; 

const initialState = {
  token: '',
  user: null,
  loading: false,
  error: null,
};


const authSlice = createSlice({
  name: 'auth',
  initialState,
 reducers: {
  clearAuthError: (state) => {
    state.error = null;
  },
},
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, pending)
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, rejected)

      .addCase(verify.pending, pending)
      .addCase(verify.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verify.rejected, rejected)

      .addCase(login.pending, pending)
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.token = payload.token;
        state.user = payload.user;
      })
      .addCase(login.rejected, rejected)

      .addCase(getCurrent.pending, pending)
      .addCase(getCurrent.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.token = payload.token;
        state.user = payload.user;
      })
      .addCase(getCurrent.rejected, () => initialState)

      .addCase(forgotPassword.pending, pending)
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, rejected)

      .addCase(logout.pending, pending)
      .addCase(logout.fulfilled, () => initialState)
      .addCase(logout.rejected, rejected);
  },
});

export default authSlice.reducer;

export const { clearAuthError } = authSlice.actions;