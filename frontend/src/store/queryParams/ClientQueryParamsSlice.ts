import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Client } from 'src/types/client/client';
import { GetAllQueryParams, QueryState, SortOrder, WhereConditions } from 'src/types/query';

const initialState: GetAllQueryParams<Client> = {
  filters: {},
  sortOptions: [],
  offset: 0,
  limit: 5,
};

const clientQueryParamsSlice = createSlice({
  name: 'clientQueryParams',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<WhereConditions<Client>>) => {
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
export const selectQueryParams = (state: {
  clientQueryParams: QueryState<Client>;
}): QueryState<Client> => state.clientQueryParams;

// Экспорт действий
export const { setFilters, setSortOptions, setOffset, setLimit, resetQueryParams } =
  clientQueryParamsSlice.actions;

// Экспорт редьюсера
export default clientQueryParamsSlice.reducer;
