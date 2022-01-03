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
  //states for notifying changes to the frontend
  typedWordsArray: [''],
  rawTypingHistory: '',
  // currentWordIndex: 0,
  // currentLetterIndex: 0,
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

      //states for notifying changes to the frontend
      const currentWordIndex = typedWordsArray.length - 1;
      const currentWord = typedWordsArray[currentWordIndex];

      const { key } = action.payload;
      //Handle each type of key pressing
      if (/\w|\s/.test(key)) {
        let wordId = state.ids[currentWordIndex];
        let letterIndex = typedWordsArray[currentWordIndex].length - 1;
        let wordObj = state.entities[wordId];
        let letterObj = wordObj.letters[letterIndex];
        wordObj.active = true;

        switch (true) {
          //Space bar is the word splitter
          case /\s/.test(key):
            if(currentWord !== ''){
              //check if current word has untyped letters, mark them mistake
              wordObj.letters.forEach((letter) => {
                if(letter.status === 'untyped'){
                  letter.status = 'mistake';
                }
              })
              //making current word inactive and next word active
              wordObj.active = false;
              const nextWordId = state.ids[currentWordIndex+1];
              if(state.entities[nextWordId] != null) state.entities[nextWordId].active = true;
              //add a new empty entry to typedWordsArray
              typedWordsArray.push('');

              wordObj.cursorPosition = 0;
            }

            state.rawTypingHistory+=' ';
            break;

          //Alphabet character get pushed into current typing word
          case /^[a-zA-Z]{1,1}$/.test(key):
            typedWordsArray[currentWordIndex] = currentWord + key;
            state.currentLetterIndex++;

            wordId = state.ids[currentWordIndex];
            letterIndex = typedWordsArray[currentWordIndex].length - 1;
            wordObj = state.entities[wordId];
            letterObj = wordObj.letters[letterIndex];

            if(wordId != null && wordObj != null){
              wordObj.cursorPosition++;

              if (letterObj != null) {
                if (key === letterObj.letter) {
                  letterObj.status = "typed";
                } else {
                  letterObj.status = "mistake";
                  letterObj.actualyTyped = key;
                  state.statistics.mistakeCount++;
                }
              }
              //if extra letter typed, 
              else if(letterIndex >= wordObj.word.length){
                wordObj.extraLetters.push(key);
                state.mistakeCount++;
              }
            }
            
            state.rawTypingHistory+=key;
            break;

          //Backspace slices from current typing word
          case /^Backspace$/.test(key):
            wordId = state.ids[currentWordIndex];
            letterIndex = typedWordsArray[currentWordIndex].length - 1;
            wordObj = state.entities[wordId];
            letterObj = wordObj.letters[letterIndex];

            if(wordId !== null && wordObj !== null){
              if(wordObj.cursorPosition !== 0) wordObj.cursorPosition--;
              if (letterObj != null) {
                letterObj.status = 'untyped';
                letterObj.actuallyTyped = null;
                letterObj.mistake = false;
              }
              //if extra letter exists, delete the last one since backspace was pressed
              else if(letterIndex >= wordObj.word.length){
                wordObj.extraLetters = wordObj.extraLetters.slice(0, -1);
              }
            }
            

            //Edit typedWordsArray after changing entities because indexing is more intuitive/easier
            //还是有点奇怪的。。
            typedWordsArray[currentWordIndex] = currentWord.slice(0, -1);
            state.currentLetterIndex--;

            state.rawTypingHistory+='⌫';
            break;

          default:
        }
      } else {
        
        console.log("something else pressed: " + key);
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
            active: wordIndex === 0? true : false,
            cursorPosition: 0,
            letters: word.split("").map((letter, letterIndex) => {
              return {
                letter: letter,
                letterIndex: letterIndex,
                status: "untyped",
                mistake: false,
                actuallyTyped: null
              };
            }),
            extraLetters:[],
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

export const { keyAction } = typingtestSlice.actions;

export default typingtestSlice.reducer;

export const {
  selectAll: selectAllWords,
  selectById: selectWordsById,
  selectIds: selectWordsIds,
} = typingtestAdapter.getSelectors((state) => state.typingtest);
