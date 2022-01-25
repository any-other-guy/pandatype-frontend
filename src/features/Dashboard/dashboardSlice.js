import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showDashboard: false,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    showDashboardAction(state, action) {
      const { show } = action.payload;
      state.showDashboard = show;
    },
  },
});

export const { showDashboardAction } = dashboardSlice.actions;

export default dashboardSlice.reducer;
