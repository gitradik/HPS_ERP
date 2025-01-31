import { useDispatch, useSelector } from 'src/store/Store';
import { setFilters, setOffset } from 'src/store/queryParams/QueryParamsSlice';
import { FilterFormValues, FilterStatusType } from 'src/types/table/filter/filter';

interface UseFilters {
  handleFilter: (values: FilterFormValues) => void;
  defaultValues: FilterFormValues;
}
interface UseFiltersProps {
  statusFieldName: string;
}
export const useFilters = ({ statusFieldName }: UseFiltersProps): UseFilters => {
  const dispatch = useDispatch();
  const queryParams = useSelector((state) => state.queryParams);

  const handleFilter = ({ status }: FilterFormValues) => {
    dispatch(setOffset(0));
    dispatch(
      setFilters({
        [statusFieldName]:
          status === FilterStatusType.ALL ? undefined : status === FilterStatusType.ACTIVE,
      }),
    );
  };

  const defaultValues: FilterFormValues = {
    status:
      queryParams.filters?.[statusFieldName] === undefined
        ? FilterStatusType.ALL
        : queryParams.filters?.[statusFieldName]
          ? FilterStatusType.ACTIVE
          : FilterStatusType.INACTIVE,
  };

  return { handleFilter, defaultValues };
};
