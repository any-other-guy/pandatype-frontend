import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showLoginForm: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    showLoginFormAction(state, action) {
      const { show } = action.payload;
      state.showLoginForm = show;
    },
  },
});

export const { showLoginFormAction } = authSlice.actions;

export default authSlice.reducer;
