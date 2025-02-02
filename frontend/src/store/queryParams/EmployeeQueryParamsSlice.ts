import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Employee } from 'src/types/employee/employee';
import { GetAllQueryParams, QueryState, SortOrder, WhereConditions } from 'src/types/query';

const initialState: GetAllQueryParams<Employee> = {
  filters: {},
  sortOptions: [],
  offset: 0,
  limit: 5,
};

const employeeQueryParamsSlice = createSlice({
  name: 'employeeQueryParams',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<WhereConditions<Employee>>) => {
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
  employeeQueryParams: QueryState<Employee>;
}): QueryState<Employee> => state.employeeQueryParams;

// Экспорт действий
export const { setFilters, setSortOptions, setOffset, setLimit, resetQueryParams } =
employeeQueryParamsSlice.actions;

// Экспорт редьюсера
export default employeeQueryParamsSlice.reducer;
