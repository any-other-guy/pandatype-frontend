import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showSettings: false,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    showSettingsAction(state, action) {
      const { show } = action.payload;
      state.showSettings = show;
    },
  },
});

export const { showSettingsAction } = settingsSlice.actions;

export default settingsSlice.reducer;
