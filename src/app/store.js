import { configureStore } from "@reduxjs/toolkit";
import typingtestReducer from "../features/TypingTest/typingtestSlice";
export const store = configureStore({
  reducer: {
    typingtest: typingtestReducer,
  },
});
