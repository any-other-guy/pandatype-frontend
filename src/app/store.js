import { configureStore } from "@reduxjs/toolkit";
import typingtestReducer from "../features/TypingTest/typingtestSlice";
import leaderboardReducer from "../features/Leaderboard/leaderboardSlice";
import authReducer from "../features/Auth/authSlice";
import dashboardReducer from "../features/Dashboard/dashboardSlice";
import settingsReducer from "../features/Settings/settingsSlice";
export const store = configureStore({
  reducer: {
    typingtest: typingtestReducer,
    leaderboard: leaderboardReducer,
    auth: authReducer,
    dashboard: dashboardReducer,
    settings: settingsReducer,
  },
});
