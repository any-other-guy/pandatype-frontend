import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { client } from "../../utils/client";
import { shuffle } from "../../utils/utils";

const typingtestAdapter = createEntityAdapter({
  selectId: (word) => word.wordId,
  sortComparer: (a, b) => a.wordIndex < b.wordIndex,
});

const initialOptions = {
  language: "english",
  mode: "time",
  time: 30,
  words: 50,
  quote: "medium",
};

const initialStatistics = {
  perSecondWpm: [{ wpm: -1, rawWpm: -1, mistakesHere: 0 }],
  wpm: null,
  accuracy: null,
  consistency: null,
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
  quoteSource: null,
  rawTypingHistory: "",
};

const initialState = typingtestAdapter.getInitialState({
  // Test itself related
  status: "unstarted",
  isTestCompleted: false,
  typedWordsArray: [""],

  // Test options related
  options: initialOptions,

  // Test load up related
  loading: {
    fetchingCount: 0,
    status: "idle",
    error: null,
    wordsLoadedCount: 0,
    quoteWordCount: null,
  },

  // Test result related
  statistics: initialStatistics,
});

export const fetchTestContent = createAsyncThunk(
  "typingtest/getTest",
  async (query, ...payload) => {
    let url = "http://localhost:5000/getTest";
    if (Object.keys(query).length > 0) {
      url += "?";
      for (const q in query) {
        if (query[q] === "time") query[q] = "words";
        url += `${q}=${query[q]}&`;
      }
      url = url.slice(0, -1);
    }
    console.log("Fetching from: " + url);
    const response = await client.get(url, payload);
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
      if (/\w|\s|[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/.test(key)) {
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
                state.statistics.missedCount++;
              }
            });
            // Making current word inactive and next word active
            // FIXME: 决定一下到底空格后算complete还是打完，暂时决定是空格吧
            if (!wordObj.isCompleted) state.statistics.wordsCompleted++;
            wordObj.isCompleted = true;
            wordObj.active = false;

            const newWordId = state.ids[currentWordIndex + 1];
            if (
              newWordId !== undefined &&
              state.entities[newWordId] !== undefined
            ) {
              state.entities[newWordId].active = true;
            }
            // Ending test in a skipped way
            else {
              completeTest(state);
              return;
            }
            // Add a new empty entry to typedWordsArray
            typedWordsArray.push("");

            wordObj.cursorPosition = 0;
            state.statistics.rawCharacterCount++;

            state.statistics.rawTypingHistory += " ";
            break;

          // Alphabet character get pushed into current typing word
          case /^[a-zA-Z!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{1,1}$/.test(key):
            // Start the test if unstarted
            state.status =
              state.status === "unstarted" ? "started" : state.status;
            if (state.statistics.startTime === null) {
              state.statistics.startTime = Date.now();
            }

            // Pushing letter into store
            typedWordsArray[currentWordIndex] = currentWord + key;

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
                if (
                  (state.options.mode === "words" &&
                    wordObj.wordIndex + 1 === state.options.words &&
                    letterIndex + 1 === wordObj.letters.length) ||
                  (state.options.mode === "quote" &&
                    wordObj.wordIndex + 1 === state.loading.quoteWordCount &&
                    letterIndex + 1 === wordObj.letters.length)
                ) {
                  completeTest(state);
                  return;
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
                // FIXME: 决定一下到底空格后算complete还是打完，暂时决定是空格吧
                // if (!wordObj.isCompleted) state.statistics.wordsCompleted++;
                // wordObj.isCompleted = true;
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

            state.statistics.rawTypingHistory += "⌫";
            break;

          default:
        }
      } else {
        console.log("something else pressed: " + key);
      }
    },
    perSecondWpmAction: (state, action) => {
      // const { atSecond } = action.payload;
      //FIXME: atSecond很不准, 下面这个object的key暂时用array index代替秒数感觉有点准也
      const atSecond = state.statistics.perSecondWpm.length;
      // console.log(atSecond);
      const wpm = (60 / atSecond) * state.statistics.wordsPerfected;
      const rawWpm = (60 / atSecond) * state.statistics.wordsCompleted;
      state.statistics.perSecondWpm.push({
        index: state.statistics.perSecondWpm.length,
        wpm: wpm,
        rawWpm: rawWpm,
        atSecond: atSecond,
        mistakesHere: 0,
      });
    },
    testTimerDepletedAction: (state, action) => {
      completeTest(state);
      // Cleanup the last overtimed entry in perSecondWpm, if any
      //FIXME: find out why this happens, for now just purge them away
      while (
        state.options.mode === "time" &&
        state.statistics.perSecondWpm[state.statistics.perSecondWpm.length - 1]
          .index > state.options.time
      ) {
        state.statistics.perSecondWpm.pop();
      }
    },
    resetTestAction: (state, action) => {
      const {
        language = state.options.language,
        mode = state.options.mode,
        time = state.options.time,
        words = state.options.words,
        quote = state.options.quote,
      } = action.payload.options;

      //FIXME: typingtestAdapter.removeAll() doesnt work, why?
      // state.ids = [],
      state.entities = {};

      state.status = "unstarted";
      state.isTestCompleted = false;
      state.typedWordsArray = [""];

      state.options.language = language;
      state.options.mode = mode;
      state.options.time = parseInt(time);
      state.options.words = parseInt(words);
      state.options.quote = quote;

      state.loading.status = "idle";
      state.loading.error = null;
      state.loading.wordsLoadedCount = 0;
      state.loading.quoteWordCount = null;

      state.statistics = initialStatistics;
    },
    setLanguageAction: (state, action) => {
      const { language = "english" } = action.payload;
      state.options.language = language;
    },
    setTestModeAction: (state, action) => {
      const { mode = "time" } = action.payload;
      state.options.mode = mode;
    },
    setTestTimeOptionAction: (state, action) => {
      const { time = "30" } = action.payload;
      state.options.time = time;
    },
    setTestWordsOptionAction: (state, action) => {
      const { words = "50" } = action.payload;
      state.options.words = words;
    },
    setTestQuoteOptionAction: (state, action) => {
      const { quote = "medium" } = action.payload;
      state.options.quote = quote;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTestContent.pending, (state, action) => {
        state.loading.status = "loading";
        state.loading.fetchingCount++;
      })
      .addCase(fetchTestContent.fulfilled, (state, action) => {
        state.loading.status = "succeeded";
        const { language, type, ...testContent } = action.payload;
        state.options.language = language;
        let words;
        switch (type) {
          case "words":
            words = shuffle(testContent[type]).slice(0, 100);
            break;
          case "quote":
            words = testContent["words"];
            state.statistics.quoteSource = testContent["source"];
            state.loading.quoteWordCount = testContent["quoteWordCount"];
            break;
          default:
            break;
        }
        if (state.options.mode === "words") {
          words = words.slice(0, state.options.words);
        }
        if (words === undefined) return;
        // Populate test objects into store
        const wordsObj = words.map((word, index) => {
          const wordIndex = state.loading.wordsLoadedCount + index;
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
        typingtestAdapter.upsertMany(state, wordsObj);
        state.loading.wordsLoadedCount += Object.keys(wordsObj).length;
      })
      .addCase(fetchTestContent.rejected, (state, action) => {
        state.loading.status = "failed";
        state.loading.error = action.error.message;
      });
  },
});

const completeTest = (state) => {
  state.isTestCompleted = true; //prevent rerender on status started
  state.status = "completed";
  state.statistics.endTime = Date.now();
  const elapsedTime = state.statistics.endTime - state.statistics.startTime;
  state.statistics.elapsedTime = elapsedTime;
  // Prepare test result related states in store
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

  const wpm = (60000 / elapsedTime) * state.statistics.wordsPerfected;
  const rawWpm = (60000 / elapsedTime) * state.statistics.wordsCompleted;
  state.statistics.wpm = wpm;
  state.statistics.rawWpm = rawWpm;

  // Correctly count the mistake before the first perSecondWpmAction dispatched
  if (state.statistics.perSecondWpm[0].mistakesHere > 0) {
    state.statistics.perSecondWpm[1].mistakesHere =
      state.statistics.perSecondWpm[0].mistakesHere;
  }
  // Cleaning up the initial 0th-second object in perSecondWpm
  state.statistics.perSecondWpm.shift();

  // Calculate typing speed consistency
  state.statistics.consistency =
    state.statistics.perSecondWpm
      .reduce((list, obj) => {
        list.push(
          100 -
            Math.abs((obj.wpm - state.statistics.wpm) / state.statistics.wpm) *
              100
        );
        return list;
      }, [])
      .reduce((sum, e) => sum + e, 0) / state.statistics.perSecondWpm.length;
};

export const {
  keyAction,
  testTimerDepletedAction,
  setLanguageAction,
  setTestModeAction,
  setTestTimeOptionAction,
  setTestWordsOptionAction,
  setTestQuoteOptionAction,
  perSecondWpmAction,
  resetTestAction,
} = typingtestSlice.actions;

export default typingtestSlice.reducer;

export const {
  selectAll: selectAllWords,
  selectById: selectWordsById,
  selectIds: selectWordsIds,
} = typingtestAdapter.getSelectors((state) => state.typingtest);
