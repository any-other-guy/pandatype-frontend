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
  // Test result related
  statistics: {
    perSecondWpm: [{ wpm: -1, rawWpm: -1, mistakesHere: 0 }],
    wpm: null,
    accuracy: null,
    startTime: null,
    endTime: null,
    elapsedTime: null,
    rawWpm: null,
    wordsPerfected: 0,
    wordsCompleted: 0,
    mistakeCount: 0,
    correctCount: 0,
    extraCount: 0,
    missedCount: 0,
    rawCharacterCount: 0,
    backspaceCount: 0,
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
            if (currentWord === "") return;
            // Check if current word has untyped letters, mark them mistake
            wordObj.letters.forEach((letter) => {
              if (letter.status === "untyped") {
                letter.status = "missed";
                letter.mistake = true;
                state.statistics.missedCount++; //TODO: not sure how this counts towards result accuracy and etc
              }
            });
            // Making current word inactive and next word active
            // NOTE: 现在暂时回不来空格掉的字，所以stats先这么搞，不需要if (!wordObj.isCompleted)
            state.statistics.wordsCompleted++;
            wordObj.isCompleted = true;
            wordObj.active = false;

            const nextWordId = state.ids[currentWordIndex + 1];
            if (state.entities[nextWordId] != null)
              state.entities[nextWordId].active = true;
            // Add a new empty entry to typedWordsArray
            typedWordsArray.push("");

            wordObj.cursorPosition = 0;
            state.statistics.rawCharacterCount++;

            state.statistics.rawTypingHistory += " ";
            break;

          // Alphabet character get pushed into current typing word
          case /^[a-zA-Z]{1,1}$/.test(key):
            // Start the test if unstarted
            state.testStatus =
              state.testStatus === "unstarted" ? "started" : state.testStatus;
            if (state.statistics.startTime === null) {
              state.statistics.startTime = Date.now();
            }

            // Pushing letter into store
            typedWordsArray[currentWordIndex] = currentWord + key;
            state.currentLetterIndex++;

            wordId = state.ids[currentWordIndex];
            letterIndex = typedWordsArray[currentWordIndex].length - 1;
            wordObj = state.entities[wordId];
            letterObj = wordObj.letters[letterIndex];

            if (wordId === null && wordObj === null) return;
            wordObj.cursorPosition++;

            if (letterObj != null) {
              // Update states when letter typed is correct
              if (key === letterObj.letter) {
                letterObj.status = "typed";
                state.statistics.correctCount++;
                // End test if the last letter word of the last letter is typed correctly
                if (state.testMode === "words") {
                  if (
                    wordObj.wordIndex + 1 === state.ids.length &&
                    letterIndex + 1 === wordObj.letters.length
                  ) {
                    state.testStatus = "completed"; // this only mutates testStatus from started to completed
                    state.isTestCompleted = true; // this updates the UI, components are subscribed to this state actually
                    state.statistics.endTime = Date.now();
                    // Prepare test result related states in store
                    // TODO: find a way to put these into reuseable function, how to pass states as plain object?
                    const total =
                      state.statistics.correctCount +
                      state.statistics.mistakeCount +
                      state.statistics.extraCount +
                      state.statistics.missedCount;
                    const bad =
                      state.statistics.mistakeCount +
                      state.statistics.extraCount +
                      state.statistics.missedCount;
                    state.statistics.accuracy = ((total - bad) / total) * 100;

                    state.statistics.elapsedTime =
                      state.statistics.endTime - state.statistics.startTime;
                    const wpm =
                      (60000 / state.statistics.elapsedTime) *
                      state.statistics.wordsPerfected;
                    const rawWpm =
                      (60000 / state.statistics.elapsedTime) *
                      state.statistics.wordsCompleted;
                    state.statistics.wpm = wpm;
                    state.statistics.rawWpm = rawWpm;
                    // Cleanup the initial 0th-second object in perSecondWpm
                    if (state.statistics.perSecondWpm[0].missedCount > 0) {
                      state.statistics.perSecondWpm[1].missedCount++;
                      state.statistics.perSecondWpm[0].missedCount = 0;
                    }
                  }
                }
              } else {
                letterObj.status = "mistake";
                letterObj.whatActuallyTyped = key;
                let currentPerSecondWpmObject =
                  state.statistics.perSecondWpm[
                    state.statistics.perSecondWpm.length - 1
                  ];
                currentPerSecondWpmObject.mistakesHere++;
                state.statistics.mistakeCount++;
              }
              // Mark current word as completed or perfected
              if (letterIndex === wordObj.word.length - 1) {
                // if all no mistake found in the whole word, mark wordsPerfected++;
                if (
                  wordObj.letters.every((letterObj) => {
                    return (
                      letterObj.status === "typed" &&
                      letterObj.mistake === false
                    );
                  })
                ) {
                  // To prevent counting error when correcting the last letter
                  if (!wordObj.isPerfected) state.statistics.wordsPerfected++;
                  wordObj.isPerfected = true;
                }
                // otherwise only mark wordsCompleted++;
                if (!wordObj.isCompleted) state.statistics.wordsCompleted++;
                wordObj.isCompleted = true;
              }
            }
            // If extra letter typed, beyond wordObj.letters[letterIndex]
            else if (letterIndex >= wordObj.word.length) {
              wordObj.extraLetters.push(key);
              let currentPerSecondWpmObject =
                state.statistics.perSecondWpm[
                  state.statistics.perSecondWpm.length - 1
                ];

              currentPerSecondWpmObject.mistakesHere++;
              //FIXME: extraCount may be over counted since user may delete those before pressing space to go to the next word
              state.statistics.extraCount++;
            }
            state.statistics.rawCharacterCount++;

            state.statistics.rawTypingHistory += key;
            break;

          // Backspace slices from current typing word
          case /^Backspace$/.test(key):
            wordId = state.ids[currentWordIndex];
            letterIndex = typedWordsArray[currentWordIndex].length - 1;
            wordObj = state.entities[wordId];
            letterObj = wordObj.letters[letterIndex];

            if (wordId === null && wordObj === null) return;
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
    perSecondWpmAction: (state, action) => {
      const { atSecond } = action.payload;
      const wpm = (60 / atSecond) * state.statistics.wordsPerfected;
      const rawWpm = (60 / atSecond) * state.statistics.wordsCompleted;
      //FIXME: atSecond很不准, 下面这个object的key暂时用array index代替秒数感觉有点准也
      state.statistics.perSecondWpm.push({
        [state.statistics.perSecondWpm.length]: {
          wpm: wpm,
          rawWpm: rawWpm,
          atSecond: atSecond,
          mistakesHere: 0,
        },
      });
    },
    testCompletedAction: (state, action) => {
      state.isTestCompleted = true; //prevent rerender on testStatus started
      state.testStatus = "completed";
      state.statistics.endTime = Date.now();

      // Prepare test result related states in store
      // TODO: find a way to put these into reuseable function, how to pass states as plain object?
      const total =
        state.statistics.correctCount +
        state.statistics.mistakeCount +
        state.statistics.extraCount +
        state.statistics.missedCount;
      const bad =
        state.statistics.mistakeCount +
        state.statistics.extraCount +
        state.statistics.missedCount;
      state.statistics.accuracy = ((total - bad) / total) * 100;

      const elapsedTime = state.statistics.endTime - state.statistics.startTime;
      console.log(elapsedTime);
      const wpm = (60000 / elapsedTime) * state.statistics.wordsPerfected;
      const rawWpm = (60000 / elapsedTime) * state.statistics.wordsCompleted;
      state.statistics.wpm = wpm;
      state.statistics.rawWpm = rawWpm;
      // Cleanup the initial 0th-second object in perSecondWpm
      if (state.statistics.perSecondWpm[0].missedCount > 0) {
        state.statistics.perSecondWpm[1].missedCount++;
        state.statistics.perSecondWpm[0].missedCount = 0;
      }
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
        // Populate test objects into store
        const wordsObj = words.map((word, wordIndex) => {
          return {
            word: word,
            wordIndex: wordIndex,
            wordId: word + wordIndex,
            active: wordIndex === 0 ? true : false,
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
            isCompleted: false,
            isPerfected: false,
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
  perSecondWpmAction,
} = typingtestSlice.actions;

export default typingtestSlice.reducer;

export const {
  selectAll: selectAllWords,
  selectById: selectWordsById,
  selectIds: selectWordsIds,
} = typingtestAdapter.getSelectors((state) => state.typingtest);
