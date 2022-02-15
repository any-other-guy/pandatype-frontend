/* eslint-disable no-use-before-define */
import { createAsyncThunk, createEntityAdapter, createSlice, nanoid } from '@reduxjs/toolkit';
import { client } from '../../utils/client';

const en15Adapter = createEntityAdapter({});
const en60Adapter = createEntityAdapter({});
const zh15Adapter = createEntityAdapter({});
const zh60Adapter = createEntityAdapter({});

const initialState = {
  showLeaderboard: false,
  loading: {
    status: 'idle',
    error: null,
  },
  en15: en15Adapter.getInitialState(),
  en60: en15Adapter.getInitialState(),
  zh15: en15Adapter.getInitialState(),
  zh60: en15Adapter.getInitialState(),
};

export const fetchLeaderboard = createAsyncThunk(
  'leaderboard/getLeaderboard',
  async (query, ...payload) => {
    let url = `${process.env.REACT_APP_LEADERBOARD_API_URL}/getLeaderboard`;
    if (Object.keys(query).length > 0) {
      url += '?';
      Object.keys(query).forEach((q) => {
        url += `${q}=${query[q]}&`;
      });
      url = url.slice(0, -1);
    }
    // console.log(`Fetching from: ${url}`);
    const response = await client.get(url, payload);
    return response.data;
  }
);

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    showLeaderboardAction(state, action) {
      const { show } = action.payload;
      state.showLeaderboard = show;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.loading.status = 'loading';
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.loading.status = 'succeeded';
        const { status, leaderboardList } = action.payload;
        if (status === 'SUCCESS') {
          leaderboardList.forEach((list) => {
            list.recordList.forEach((e) => {
              e.id = nanoid();
            });
            recordListAdapters[`${list.testLanguage}${list.testOption}`].setAll(
              state[`${list.testLanguage}${list.testOption}`],
              list.recordList
            );
          });
        }
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.loading.status = 'failed';
        state.loading.error = action.error.message;
      });
  },
});

export const { showLeaderboardAction } = leaderboardSlice.actions;

export default leaderboardSlice.reducer;

export const recordListAdapters = {
  en15: en15Adapter,
  en60: en60Adapter,
  zh15: zh15Adapter,
  zh60: zh60Adapter,
};

export const LeaderboardSelectors = {
  en15: en15Adapter.getSelectors((state) => state.leaderboard.en15),
  en60: en15Adapter.getSelectors((state) => state.leaderboard.en60),
  zh15: en15Adapter.getSelectors((state) => state.leaderboard.zh15),
  zh60: en15Adapter.getSelectors((state) => state.leaderboard.zh60),
};
