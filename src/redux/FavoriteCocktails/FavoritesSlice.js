import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { fetchFavorites, addFavorites, deleteFavorites } from './FavoritesOperation';

const handlePending = state => {
  state.isLoading = true;
};

const handleRejected = (state, { payload }) => {
  state.isLoading = false;
  state.error = payload;
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    page: 1,
    entities: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      // FETCH
      .addCase(fetchFavorites.fulfilled, (state, { payload }) => {
        state.entities = payload;
        state.error = null;
        state.isLoading = false;
      })
      // ADD
      .addCase(addFavorites.fulfilled, (state, _) => {
        state.isLoading = false;
      })
      // DELETE
      .addCase(deleteFavorites.fulfilled, (state, action) => {
        const index = state.entities.data.findIndex(item => item._id === action.meta.arg);
        state.entities.data.splice(index, 1);
        state.isLoading = false;
      })

      // PENDING
      .addMatcher(isAnyOf(fetchFavorites.pending, addFavorites.pending, deleteFavorites.pending), handlePending)

      // REJECTED
      .addMatcher(isAnyOf(fetchFavorites.rejected, addFavorites.rejected, deleteFavorites.rejected), handleRejected);
  },
});

export const { changeFavPage } = favoritesSlice.actions;
export const favoritesReducer = favoritesSlice.reducer;
