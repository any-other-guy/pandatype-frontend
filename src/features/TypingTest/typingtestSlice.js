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
  // Test load up related
  loadingStatus: "idle",
  loadingError: null,
  // Test options related
  testLanguage: "english",
  testMode: "time",
  testTimeOption: 30,
  testWordOption: 50,
  testQuoteOption: "medium",
  // Test itself related
  testStatus: "unstarted",
  isTestCompleted: false,
  typedWordsArray: [""],
  wordsCompleted: 0,
  // Test result related
  statistics: {
    elapsedTime: null,
    accuracy: null,
    rawCharacterCount: null,
    wpm: null,
    raw_wpm: null,
    mistakeCount: null,
    backspaceCount: null,
    date: null,
    rawTypingHistory: "",
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
      // Start the test if unstarted
      state.testStatus =
        state.testStatus === "unstarted" ? "started" : state.testStatus;

      const typedWordsArray = state.typedWordsArray;

      // states for notifying changes to the frontend
      const currentWordIndex = typedWordsArray.length - 1;
      const currentWord = typedWordsArray[currentWordIndex];

      const { key } = action.payload;
      // Handle each type of key pressing
      if (/\w|\s/.test(key)) {
        let wordId = state.ids[currentWordIndex];
        let letterIndex = typedWordsArray[currentWordIndex].length - 1;
        let wordObj = state.entities[wordId];
        let letterObj = wordObj.letters[letterIndex];
        wordObj.active = true;

        switch (true) {
          // Space bar is the word splitter
          case /\s/.test(key):
            if (currentWord !== "") {
              // Check if current word has untyped letters, mark them mistake
              wordObj.letters.forEach((letter) => {
                if (letter.status === "untyped") {
                  letter.status = "mistake";
                }
              });
              // Making current word inactive and next word active
              wordObj.active = false;
              const nextWordId = state.ids[currentWordIndex + 1];
              if (state.entities[nextWordId] != null)
                state.entities[nextWordId].active = true;
              // Add a new empty entry to typedWordsArray
              typedWordsArray.push("");

              wordObj.cursorPosition = 0;
              state.statistics.rawCharacterCount++;
            }

            state.statistics.rawTypingHistory += " ";
            break;

          // Alphabet character get pushed into current typing word
          case /^[a-zA-Z]{1,1}$/.test(key):
            typedWordsArray[currentWordIndex] = currentWord + key;
            state.currentLetterIndex++;

            wordId = state.ids[currentWordIndex];
            letterIndex = typedWordsArray[currentWordIndex].length - 1;
            wordObj = state.entities[wordId];
            letterObj = wordObj.letters[letterIndex];

            if (wordId != null && wordObj != null) {
              wordObj.cursorPosition++;

              if (letterObj != null) {
                // Update states when letter typed is correct
                if (key === letterObj.letter) {
                  letterObj.status = "typed";
                  // Detecting if last letter typed correctly, end test
                  if (state.testMode === "words") {
                    if (
                      wordObj.wordIndex + 1 === state.ids.length &&
                      letterIndex + 1 === wordObj.letters.length
                    ) {
                      state.testStatus = "completed";
                    }
                  }
                } else {
                  letterObj.status = "mistake";
                  letterObj.actualyTyped = key;
                  state.statistics.mistakeCount++;
                }
                // Mark current word as completed
                if(letterIndex === wordObj.word.length - 1 && key === letterObj.letter){
                  state.wordsCompleted++;
                  wordObj.isCompleted = true;
                }
              }
              // If extra letter typed, beyond wordObj.letters[letterIndex]
              else if (letterIndex >= wordObj.word.length) {
                wordObj.extraLetters.push(key);
                state.statistics.mistakeCount++;
              }
              state.statistics.rawCharacterCount++;
            }

            state.statistics.rawTypingHistory += key;
            break;

          // Backspace slices from current typing word
          case /^Backspace$/.test(key):
            wordId = state.ids[currentWordIndex];
            letterIndex = typedWordsArray[currentWordIndex].length - 1;
            wordObj = state.entities[wordId];
            letterObj = wordObj.letters[letterIndex];

            if (wordId !== null && wordObj !== null) {
              if (wordObj.cursorPosition !== 0) wordObj.cursorPosition--;
              if (letterObj != null) {
                letterObj.status = "untyped";
                letterObj.actuallyTyped = null;
                letterObj.mistake = false;
              }
              // If extra letter exists, delete the last one since backspace was pressed
              else if (letterIndex >= wordObj.word.length) {
                wordObj.extraLetters = wordObj.extraLetters.slice(0, -1);
              }
              state.statistics.backspaceCount++;
            }

            // Edit typedWordsArray after changing entities because indexing is more intuitive/easier
            // 还是有点奇怪的。。
            typedWordsArray[currentWordIndex] = currentWord.slice(0, -1);
            state.currentLetterIndex--;

            state.statistics.rawTypingHistory += "⌫";
            break;

          default:
        }
      } else {
        console.log("something else pressed: " + key);
      }
    },
    testCompletedAction: (state, action) => {
      state.isTestCompleted = true; //prevent rerender on testStatus started
      state.testStatus = "completed";
    },
    setLanguageAction: (state, action) => {
      const { mode = "english" } = action.payload;
      state.testLanguage = mode;
    },
    setTestModeAction: (state, action) => {
      const { mode = "time" } = action.payload;
      state.testMode = mode;
    },
    setTestTimeOptionAction: (state, action) => {
      const { option = "30" } = action.payload;
      state.testTimeOption = option;
    },
    setTestWordOptionAction: (state, action) => {
      const { option = "50" } = action.payload;
      state.testWordOption = option;
    },
    setTestQuoteOptionAction: (state, action) => {
      const { option = "medium" } = action.payload;
      state.testQuoteOption = option;
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
            active: wordIndex === 0 ? true : false,
            isCompleted: false,
            cursorPosition: 0,
            letters: word.split("").map((letter, letterIndex) => {
              return {
                letter: letter,
                letterIndex: letterIndex,
                status: "untyped",
                mistake: false,
                actuallyTyped: null,
              };
            }),
            extraLetters: [],
          };
        });
        typingtestAdapter.setAll(state, wordsObj);
      })
      .addCase(fetchTestContent.rejected, (state, action) => {
        state.loadingStatus = "failed";
        state.loadingError = action.error.message;
      });
  },
});

export const {
  keyAction,
  testCompletedAction,
  setLanguageAction,
  setTestModeAction,
  setTestTimeOptionAction,
  setTestWordOptionAction,
  setTestQuoteOptionAction,
} = typingtestSlice.actions;

export default typingtestSlice.reducer;

export const {
  selectAll: selectAllWords,
  selectById: selectWordsById,
  selectIds: selectWordsIds,
} = typingtestAdapter.getSelectors((state) => state.typingtest);
