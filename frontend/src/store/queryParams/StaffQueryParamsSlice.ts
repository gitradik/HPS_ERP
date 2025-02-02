import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GetAllQueryParams, QueryState, SortOrder, WhereConditions } from 'src/types/query';
import { Staff } from 'src/types/staff/staff';

const initialState: GetAllQueryParams<Staff> = {
  filters: {},
  sortOptions: [],
  offset: 0,
  limit: 5,
};

const staffQueryParamsSlice = createSlice({
  name: 'staffQueryParams',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<WhereConditions<Staff>>) => {
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
  staffQueryParams: QueryState<Staff>;
}): QueryState<Staff> => state.staffQueryParams;

// Экспорт действий
export const { setFilters, setSortOptions, setOffset, setLimit, resetQueryParams } =
  staffQueryParamsSlice.actions;

// Экспорт редьюсера
export default staffQueryParamsSlice.reducer;
