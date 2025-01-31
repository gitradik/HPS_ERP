import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GetAllQueryParams, QueryState, SortOrder, WhereConditions } from 'src/types/query';

const initialState: GetAllQueryParams<any> = {
  filters: {},
  sortOptions: [],
  offset: 0,
  limit: 5,
};

const queryParamsSlice = createSlice({
  name: 'queryParams',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<WhereConditions<any>>) => {
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
export const selectQueryParams = (state: { queryParams: QueryState<any> }): QueryState<any> =>
  state.queryParams;

// Экспорт действий
export const { setFilters, setSortOptions, setOffset, setLimit, resetQueryParams } =
  queryParamsSlice.actions;

// Экспорт редьюсера
export default queryParamsSlice.reducer;
