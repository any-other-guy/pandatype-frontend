import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showLeaderboard: false,
};

const leaderboardSlice = createSlice({
  name: "leaderboard",
  initialState,
  reducers: {
    showLeaderboardAction(state, action) {
      const { show } = action.payload;
      state.showLeaderboard = show;
    },
  },
});

export const { showLeaderboardAction } = leaderboardSlice.actions;

export default leaderboardSlice.reducer;
