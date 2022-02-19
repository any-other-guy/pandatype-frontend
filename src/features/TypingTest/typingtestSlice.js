/* eslint-disable no-use-before-define */
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { loadState, saveState } from '../../app/localStorage';
import { client } from '../../utils/client';
import { containsNonChinese, findZiIndex, shuffle } from '../../utils/utils';

const enAdapter = createEntityAdapter({
  selectId: (word) => word.wordId,
  sortComparer: (a, b) => a.wordIndex < b.wordIndex,
});

const zhAdapter = createEntityAdapter({
  selectId: (word) => word.wordId,
  sortComparer: (a, b) => a.wordIndex < b.wordIndex,
});

const localOptions = loadState('testOptions');
const initialOptions =
  localOptions === undefined
    ? {
        language: 'en',
        mode: 'time',
        time: 30,
        words: 50,
        quote: 'short',
      }
    : localOptions;

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
  zhPerfected: 0,
  zhCompleted: 0,
  zhMistake: 0,
  rawTypingHistory: '',
  saved: false,
};

const initialState = {
  showTypingtest: true,
  // Entity Adapter for different languages
  en: enAdapter.getInitialState(),
  zh: zhAdapter.getInitialState(),
  // Test itself related
  status: 'unstarted',
  isTestCompleted: false,
  typedWordsArray: [''],

  // Test options related
  options: initialOptions,

  // Test load up related
  loading: {
    fetchingCount: 0,
    status: 'idle',
    error: null,
    wordsLoadedCount: 0,
    quoteWordCount: null,
  },

  // Test result related
  statistics: initialStatistics,
};

export const fetchTestContent = createAsyncThunk(
  'typingtest/getTest',
  async (query, ...payload) => {
    let url = `${process.env.REACT_APP_TYPINGTEST_API_URL}/getTest`;
    if (Object.keys(query).length > 0) {
      url += '?';
      Object.keys(query).forEach((q) => {
        if (query[q] === 'time') query[q] = 'words';
        url += `${q}=${query[q]}&`;
      });
      url = url.slice(0, -1);
    }
    // console.log(`Fetching from: ${url}`);
    const response = await client.get(url, payload);
    return response.data;
  }
);

export const postTestResult = createAsyncThunk(
  'typingtest/postTestResult',
  async (body, ...payload) => {
    const url = `${process.env.REACT_APP_LEADERBOARD_API_URL}/saveTestResult`;
    const response = await client.post(url, body, payload);
    return response.data;
  }
);

export const typingtestSlice = createSlice({
  name: 'typingtest',
  initialState,
  reducers: {
    keyAction: (state, action) => {
      const { language } = state.options;
      const { typedWordsArray } = state;

      // states for notifying changes to the frontend
      const currentWordIndex = typedWordsArray.length - 1;
      const currentWord = typedWordsArray[currentWordIndex];

      const { key } = action.payload;
      // Handle each type of key pressing
      if (/\w|\s|[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/.test(key)) {
        let wordId = state[language].ids[currentWordIndex];
        let letterIndex = typedWordsArray[currentWordIndex].length - 1;
        let wordObj = state[language].entities[wordId];
        let letterObj = wordObj.letters[letterIndex];
        wordObj.active = true;

        if (wordId === undefined || wordObj === undefined) return;

        switch (true) {
          // Space bar is the word splitter
          case /\s/.test(key): {
            if (currentWord === '') return;
            // Check if current word has untyped letters, mark them mistake
            wordObj.letters.forEach((_letterObj) => {
              if (_letterObj.status === 'untyped') {
                _letterObj.status = 'missed';
                state.statistics.missedCount += 1;
                // Zhcn
                if (language === 'zh') {
                  wordObj.ziArray[_letterObj.ziIndex].status = 'missed';
                  state.statistics.zhMistake += 1;
                }
              }
            });

            // Making current word inactive and next word active
            // FIXME: 决定一下到底空格后算complete还是打完，暂时决定是空格吧
            state.statistics.wordsCompleted += 1;
            wordObj.isCompleted = true;
            wordObj.active = false;

            const newWordId = state[language].ids[currentWordIndex + 1];
            if (newWordId !== undefined && state[language].entities[newWordId] !== undefined) {
              state[language].entities[newWordId].active = true;
            }
            // Ending test in a skipped way
            else {
              completeTest(state);
              return;
            }
            // Add a new empty entry to typedWordsArray
            typedWordsArray.push('');

            wordObj.cursorPosition = 0;
            state.statistics.rawCharacterCount += 1;

            state.statistics.rawTypingHistory += ' ';
            break;
          }
          // Alphabet character get pushed into current typing word
          case /^[a-zA-Z!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{1,1}$/.test(key): {
            // Start the test if unstarted
            state.status = state.status === 'unstarted' ? 'started' : state.status;
            if (state.statistics.startTime === null) {
              state.statistics.startTime = Date.now();
            }

            // Pushing letter into store
            typedWordsArray[currentWordIndex] = currentWord + key;

            wordId = state[language].ids[currentWordIndex];
            letterIndex = typedWordsArray[currentWordIndex].length - 1;
            wordObj = state[language].entities[wordId];
            letterObj = wordObj.letters[letterIndex];

            if (wordId === undefined || wordObj === undefined) return;

            wordObj.cursorPosition += 1;

            if (letterObj != null) {
              // Update states when letter typed is correct
              if (key === letterObj.letter) {
                letterObj.status = 'typed';
                state.statistics.correctCount += 1;

                // End test if the last letter word of the last letter is typed correctly
                if (
                  (state.options.mode === 'words' &&
                    wordObj.wordIndex + 1 === state.options.words &&
                    letterIndex + 1 === wordObj.letters.length) ||
                  (state.options.mode === 'quote' &&
                    wordObj.wordIndex + 1 === state.loading.quoteWordCount &&
                    letterIndex + 1 === wordObj.letters.length)
                ) {
                  completeTest(state);
                  return;
                }
              } else {
                letterObj.status = 'mistake';
                letterObj.whatActuallyTyped = key;
                const currentPerSecondWpmObject =
                  state.statistics.perSecondWpm[state.statistics.perSecondWpm.length - 1];
                currentPerSecondWpmObject.mistakesHere += 1;
                state.statistics.mistakeCount += 1;
              }
              // Mark current word as completed or perfected
              if (letterIndex === wordObj.word.length - 1) {
                // if all no mistake found in the whole word, mark wordsPerfected++;
                if (wordObj.letters.every((_letterObj) => _letterObj.status === 'typed')) {
                  // To prevent counting error when correcting the last letter
                  if (!wordObj.isPerfected) state.statistics.wordsPerfected += 1;
                  wordObj.isPerfected = true;
                }
                // otherwise only mark wordsCompleted++;
                // FIXME: 决定一下到底空格后算complete还是打完，暂时决定是空格吧
                // if (!wordObj.isCompleted) state.statistics.wordsCompleted++;
                // wordObj.isCompleted = true;
              }

              // Zhcn mark Zi to its status
              if (language === 'zh' && letterObj.isLastLetterInZi) {
                const { ziPinyin } = wordObj.ziArray[letterObj.ziIndex];
                const typedZi = typedWordsArray[currentWordIndex]
                  .split('')
                  .slice(-letterObj.letterIndexInZi - 1)
                  .join('');

                if (typedZi === ziPinyin) {
                  wordObj.ziArray[letterObj.ziIndex].status = 'typed';
                  state.statistics.zhPerfected += 1;
                } else {
                  wordObj.ziArray[letterObj.ziIndex].status = 'mistake';
                  state.statistics.zhMistake += 1;
                }
                state.statistics.zhCompleted += 1;
              }
            }
            // If extra letter typed, beyond wordObj.letters[letterIndex]
            else if (letterIndex >= wordObj.word.length) {
              wordObj.extraLetters.push(key);
              const currentPerSecondWpmObject =
                state.statistics.perSecondWpm[state.statistics.perSecondWpm.length - 1];

              currentPerSecondWpmObject.mistakesHere += 1;
              // FIXME: extraCount may be over counted since user may delete those before pressing space to go to the next word
              state.statistics.extraCount += 1;

              // Zhcn
              if (language === 'zh') {
                wordObj.ziArray[wordObj.ziArray.length - 1].status = 'mistake';
                state.statistics.zhMistake += 1;
              }
            }
            state.statistics.rawCharacterCount += 1;

            state.statistics.rawTypingHistory += key;
            break;
          }
          // Backspace slices from current typing word
          case /^Backspace$/.test(key): {
            wordId = state[language].ids[currentWordIndex];
            letterIndex = typedWordsArray[currentWordIndex].length - 1;
            wordObj = state[language].entities[wordId];
            letterObj = wordObj.letters[letterIndex];

            if (wordId === undefined || wordObj === undefined) return;

            if (wordObj.cursorPosition !== 0) wordObj.cursorPosition -= 1;
            // FIXME: undefined?
            if (letterObj != null) {
              letterObj.status = 'untyped';
              letterObj.actuallyTyped = null;
            }
            // If extra letter exists, delete the last one since backspace was pressed
            else if (letterIndex >= wordObj.word.length) {
              wordObj.extraLetters = wordObj.extraLetters.slice(0, -1);
            }
            state.statistics.backspaceCount += 1;

            // Edit typedWordsArray after changing entities because indexing is more intuitive/easier
            typedWordsArray[currentWordIndex] = currentWord.slice(0, -1);

            // Zhcn mark Zi to its status
            if (language === 'zh') {
              if (letterObj === undefined) {
                if (wordObj.letters[wordObj.letters.length - 1].status === 'untyped') return;
                letterObj = wordObj.letters[wordObj.letters.length - 1];
              }
              if (letterObj.isLastLetterInZi) {
                let sliceFromLast = -letterObj.letterIndexInZi;
                if (letterIndex >= wordObj.word.length) {
                  sliceFromLast -= 1;
                } else {
                  sliceFromLast += 1;
                }
                const { ziPinyin } = wordObj.ziArray[letterObj.ziIndex];
                const typedZi = typedWordsArray[currentWordIndex]
                  .split('')
                  .slice(sliceFromLast)
                  .join('');

                if (typedZi === ziPinyin) {
                  wordObj.ziArray[letterObj.ziIndex].status = 'typed';
                  state.statistics.zhPerfected += 1;
                } else {
                  wordObj.ziArray[letterObj.ziIndex].status = 'mistake';
                  state.statistics.zhMistake += 1;
                }
                state.statistics.zhCompleted += 1;
              }
            }

            state.statistics.rawTypingHistory += '⌫';
            break;
          }
          default:
        }
      } else {
        // console.log(`something else pressed: ${key}`);
      }
    },
    perSecondWpmAction: (state) => {
      // const { atSecond } = action.payload;
      // FIXME: atSecond很不准, 下面这个object的key暂时用array index代替秒数感觉有点准也
      const atSecond = state.statistics.perSecondWpm.length;
      let wpm;
      let rawWpm;
      if (state.options.language === 'zh') {
        wpm = (60 / atSecond) * state.statistics.zhPerfected;
        rawWpm = (60 / atSecond) * state.statistics.zhCompleted;
      } else {
        wpm = (60 / atSecond) * state.statistics.wordsPerfected;
        rawWpm = (60 / atSecond) * state.statistics.wordsCompleted;
      }
      state.statistics.perSecondWpm.push({
        index: state.statistics.perSecondWpm.length,
        wpm,
        rawWpm,
        atSecond,
        mistakesHere: 0,
      });
    },
    testTimerDepletedAction: (state) => {
      completeTest(state);
      // Cleanup the last overtimed entry in perSecondWpm, if any
      // FIXME: find out why this happens, for now just purge them away
      while (
        state.options.mode === 'time' &&
        state.statistics.perSecondWpm[state.statistics.perSecondWpm.length - 1].index >
          state.options.time
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
      } = action.payload.options || {};

      // FIXME: <Adapter>.removeAll() doesnt work, why?
      // state[language].ids = [],
      state[language].entities = {};

      state.status = 'unstarted';
      state.isTestCompleted = false;
      state.typedWordsArray = [''];

      state.options.language = language;
      state.options.mode = mode;
      state.options.time = parseInt(time, 10);
      state.options.words = parseInt(words, 10);
      state.options.quote = quote;

      state.loading.status = 'idle';
      state.loading.error = null;
      state.loading.wordsLoadedCount = 0;
      state.loading.quoteWordCount = null;

      state.statistics = initialStatistics;

      // save to localStorage
      saveState(state.options, 'testOptions');
    },
    zhQuoteInputAction: (state, action) => {
      const { inputString } = action.payload;
      // Start the test if unstarted
      state.status = state.status === 'unstarted' ? 'started' : state.status;
      if (state.statistics.startTime === null) {
        state.statistics.startTime = Date.now();
      }

      if (containsNonChinese(inputString)) return;

      state.statistics.zhCompleted = 0;
      state.statistics.zhPerfected = 0;
      state.statistics.zhMistake = 0;
      state.statistics.mistakeCount = 0;
      state.statistics.correctCount = 0;

      const inputStringArray = inputString.split('');

      state.zh.ids.forEach((id, index) => {
        const ziObj = state.zh.entities[id];
        if (inputStringArray[index] !== undefined && ziObj.zi === inputStringArray[index]) {
          ziObj.status = ziObj.status === 'typed' ? ziObj.status : 'typed';
          state.statistics.zhPerfected += 1;
          state.statistics.correctCount += 1;
          state.statistics.zhCompleted += 1;
        } else if (inputStringArray[index] !== undefined && ziObj.zi !== inputStringArray[index]) {
          ziObj.status = ziObj.status === 'mistake' ? ziObj.status : 'mistake';
          state.statistics.zhMistake += 1;
          state.statistics.mistakeCount += 1;
          state.statistics.zhCompleted += 1;
        } else {
          ziObj.status = ziObj.status === 'untyped' ? ziObj.status : 'untyped';
        }
      });
      if (inputStringArray.length - 1 >= state.zh.ids.length - 1) {
        completeTest(state);
      }
    },
    showTypingtestAction: (state, action) => {
      const { show } = action.payload;
      state.showTypingtest = show;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTestContent.pending, (state) => {
        state.loading.status = 'loading';
        state.loading.fetchingCount += 1;
      })
      .addCase(fetchTestContent.fulfilled, (state, action) => {
        state.loading.status = 'succeeded';
        const { language } = action.payload;
        state.options.language = language;

        switch (language) {
          case 'en': {
            handleEnTestContent(state, action);
            break;
          }
          case 'zh': {
            handleZhTestContent(state, action);
            break;
          }
          default:
            break;
        }
      })
      .addCase(fetchTestContent.rejected, (state, action) => {
        state.loading.status = 'failed';
        state.loading.error = action.error.message;
      })
      // POST leaderboard record
      .addCase(postTestResult.pending, (state) => {
        state.loading.status = 'loading';
      })
      .addCase(postTestResult.fulfilled, (state, action) => {
        state.loading.status = 'succeeded';
        const { status } = action.payload;
        if (status === 'SUCCESS') {
          state.statistics.saved = true;
        }
      })
      .addCase(postTestResult.rejected, (state, action) => {
        state.loading.status = 'failed';
        state.loading.error = action.error.message;
      });
  },
});

const handleEnTestContent = (state, action) => {
  const { language, type, testContent } = action.payload;

  let words;
  switch (type) {
    case 'words': {
      // words = shuffle(testContent[type]).slice(0, 100);
      words = shuffle(testContent.map((obj) => obj.word)).slice(0, 100);
      break;
    }
    case 'quote': {
      words = testContent[0].text.split(' ');
      state.statistics.quoteSource = testContent[0].source;
      state.loading.quoteWordCount = words.length;
      break;
    }
    default:
      break;
  }
  if (state.options.mode === 'words') {
    words = words.slice(0, state.options.words);
  }
  if (words === undefined) return;
  // Populate test objects into store
  const wordsObj = words.map((word, index) => {
    const wordIndex = state.loading.wordsLoadedCount + index;
    return {
      word,
      wordIndex,
      wordId: word + wordIndex,
      active: wordIndex === 0,
      cursorPosition: 0,
      letters: word.split('').map((letter, letterIndex) => ({
        letter,
        letterIndex,
        status: 'untyped',
        actuallyTyped: null,
      })),
      extraLetters: [],
      isCompleted: false,
      isPerfected: false,
    };
  });
  typingtestAdapters[language].upsertMany(state[language], wordsObj);
  state.loading.wordsLoadedCount += Object.keys(wordsObj).length;
};

const handleZhTestContent = (state, action) => {
  const { language, type, testContent } = action.payload;

  let words;
  let wordsObj;
  switch (type) {
    case 'words': {
      if (state.options.mode === 'words') {
        words = shuffle(testContent).slice(0, state.options.words);
      } else if (state.options.mode === 'time') {
        words = shuffle(testContent).slice(0, 100);
      }
      if (words === undefined) return;
      // Populate test objects into store
      wordsObj = words.map((word, index) => {
        const wordIndex = state.loading.wordsLoadedCount + index;
        const ci = JSON.parse(word.zi).reduce((str, e) => str.concat(e), '');
        const pinyin = JSON.parse(word.pinyin).reduce((str, e) => str.concat(e), '');
        return {
          word: ci,
          pinyin,
          ciLength: ci.length,
          wordIndex,
          wordId: pinyin + wordIndex,
          active: wordIndex === 0,
          cursorPosition: 0,
          ziArray: ci.split('').map((zi, ziIndex) => ({
            zi,
            ziIndex,
            ziPinyin: JSON.parse(word.pinyin)[ziIndex],
            status: 'untyped',
          })),
          letters: JSON.parse(word.pinyin).reduce(
            (returnObject, zi) => {
              returnObject.letters = returnObject.letters.concat(
                zi.split('').map((letter, letterIndexInZi) => {
                  returnObject.count += 1;
                  return {
                    letter,
                    letterIndex: returnObject.count,
                    letterIndexInZi,
                    ziIndex: findZiIndex(JSON.parse(word.pinyin), letter, returnObject.count),
                    isLastLetterInZi: letterIndexInZi === zi.length - 1,
                    status: 'untyped',
                  };
                })
              );
              return returnObject;
            },
            { letters: [], count: -1 }
          ).letters,
          extraLetters: [],
          isCompleted: false,
          isPerfected: false,
        };
      });
      break;
    }
    case 'quote': {
      const quote = testContent[0].text.split('');
      wordsObj = quote.map((zi, index) => ({
        zi,
        ziIndex: index,
        wordId: zi + index,
        ziPinyin: null,
        status: 'untyped',
      }));
      state.loading.quoteWordCount = quote.length;
      state.statistics.quoteSource = testContent[0].source;
      break;
    }
    default:
      break;
  }

  typingtestAdapters[language].upsertMany(state[language], wordsObj);
  state.loading.wordsLoadedCount += Object.keys(wordsObj).length;
};

const completeTest = (state) => {
  state.isTestCompleted = true; // Preventing rerender on status started
  state.status = 'completed';
  state.statistics.endTime = Date.now();
  const elapsedTime = state.statistics.endTime - state.statistics.startTime;
  state.statistics.elapsedTime = elapsedTime / 1000;
  // Prepare test result related states in store
  let total;
  let bad;
  let wpm;
  let rawWpm;
  if (state.options.language === 'zh') {
    // Zhcn : all or nothing
    total = state.statistics.zhPerfected + state.statistics.zhMistake;
    bad = state.statistics.zhMistake;
    wpm = (60000 / elapsedTime) * state.statistics.zhPerfected;
    rawWpm = (60000 / elapsedTime) * state.statistics.zhCompleted;
  } else {
    total =
      state.statistics.correctCount +
      state.statistics.mistakeCount +
      state.statistics.extraCount +
      state.statistics.missedCount;
    bad =
      state.statistics.mistakeCount + state.statistics.extraCount + state.statistics.missedCount;
    wpm = (60000 / elapsedTime) * state.statistics.wordsPerfected;
    rawWpm = (60000 / elapsedTime) * state.statistics.wordsCompleted;
  }

  state.statistics.accuracy = ((total - bad) / total) * 100;
  state.statistics.wpm = wpm;
  state.statistics.rawWpm = rawWpm;

  // Correctly count the mistake before the first perSecondWpmAction dispatched
  if (state.statistics.perSecondWpm[0].mistakesHere > 0) {
    state.statistics.perSecondWpm[1].mistakesHere = state.statistics.perSecondWpm[0].mistakesHere;
  }
  // Cleaning up the initial 0th-second object in perSecondWpm
  state.statistics.perSecondWpm.shift();

  // Calculate typing speed consistency
  state.statistics.consistency =
    state.statistics.perSecondWpm
      .reduce((list, obj) => {
        list.push(100 - Math.abs((obj.wpm - state.statistics.wpm) / state.statistics.wpm) * 100);
        return list;
      }, [])
      .reduce((sum, e) => sum + e, 0) / state.statistics.perSecondWpm.length;
};

export const {
  keyAction,
  testTimerDepletedAction,
  perSecondWpmAction,
  resetTestAction,
  zhQuoteInputAction,
  showTypingtestAction,
} = typingtestSlice.actions;

export default typingtestSlice.reducer;

export const typingtestAdapters = {
  en: enAdapter,
  zh: zhAdapter,
};

export const typingtestSelectors = {
  en: enAdapter.getSelectors((state) => state.typingtest.en),
  zh: zhAdapter.getSelectors((state) => state.typingtest.zh),
};
