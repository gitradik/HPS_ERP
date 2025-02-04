import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GetAllQueryParams, QueryState, SortOrder, WhereConditions } from 'src/types/query';
import { User } from 'src/types/user/user';

const initialState: GetAllQueryParams<User> = {
  filters: {},
  sortOptions: [],
  offset: 0,
  limit: 6,
};

const userQueryParamsSlice = createSlice({
  name: 'userQueryParams',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<WhereConditions<User>>) => {
      state.filters = action.payload;
    },
    setSortOptions: (state, action: PayloadAction<[string, SortOrder][]>) => {
      state.sortOptions = action.payload;
    },
    setOffset: (state, action: PayloadAction<number>) => {
      state.offset = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    resetQueryParams: () => initialState,
  },
});

// Селектор с использованием дженерика при вызове
export const selectQueryParams = (state: { userQueryParams: QueryState<User> }): QueryState<User> =>
  state.userQueryParams;

// Экспорт действий
export const { setFilters, setSortOptions, setOffset, setLimit, resetQueryParams } =
  userQueryParamsSlice.actions;

// Экспорт редьюсера
export default userQueryParamsSlice.reducer;
