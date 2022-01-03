import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { client } from "../../utils/client";

const typingtestAdapter = createEntityAdapter({
  selectId: (word) => word.wordId,
  sortComparer: (a, b) => a.wordIndex < b.wordIndex,
});

const initialState = typingtestAdapter.getInitialState({
  loadingStatus: "idle",
  loadingError: null,
  statistics: {
    elapsedTime: null,
    accuracy: null,
    chars: null,
    wpm: null,
    raw_wpm: null,
    mistakeCount: null,
    backspaceCount: null,
    date: null,
  },
});

export const fetchTestContent = createAsyncThunk(
  "typingtest/getTest",
  async () => {
    const response = await client.get("http://localhost:5000/getTest");
    return response.data;
  }
);

export const typingtestSlice = createSlice({
  name: "typingtest",
  initialState,
  reducers: {
    keyAction: (state, action) => {
      const { wordIndex, letterIndex, inputKey } = action.payload;
      const wordId = state.ids[wordIndex];
      const letterObj = state.entities[wordId].letters[letterIndex];
      if (wordId != null && letterObj != null) {
        if (inputKey === letterObj.letter) {
          letterObj.status = "typed";
        } else {
          letterObj.status = "mistake";
          state.statistics.mistakeCount++;
        }
      }
    },
    backspaceAction: (state, action) => {
      const { wordIndex, letterIndex } = action.payload;
      const wordId = state.ids[wordIndex];
      const letterObj = state.entities[wordId].letters[letterIndex];
      if (wordId != null && letterObj != null) {
        if (letterObj.status === "typed" && letterObj.status === "mistake") {
          letterObj.status = "untyped";
          state.statistics.backspaceCount++;
        }
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTestContent.pending, (state, action) => {
        state.loadingStatus = "loading";
      })
      .addCase(fetchTestContent.fulfilled, (state, action) => {
        state.loadingStatus = "succeeded";
        const { words } = action.payload;
        const wordsObj = words.map((word, wordIndex) => {
          return {
            word: word,
            wordIndex: wordIndex,
            wordId: word + wordIndex,
            active: false,
            letters: word.split("").map((letter, letterIndex) => {
              return {
                letter: letter,
                letterIndex: letterIndex,
                status: "untyped",
              };
            }),
          };
        });
        typingtestAdapter.setAll(state, wordsObj);
        // console.log(wordsObj);
      })
      .addCase(fetchTestContent.rejected, (state, action) => {
        state.loadingStatus = "failed";
        state.loadingError = action.error.message;
      });
  },
});

export const { keyAction, backspaceAction } = typingtestSlice.actions;

export default typingtestSlice.reducer;

export const {
  selectAll: selectAllWords,
  selectById: selectWordsById,
  selectIds: selectWordsIds,
} = typingtestAdapter.getSelectors((state) => state.typingtest);
