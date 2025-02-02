export interface UseFilters<T> {
  handleFilter: (values: T) => void;
  defaultValues: T;
}
