import { useDispatch, useSelector } from 'src/store/Store';
import {
  selectQueryParams,
  setFilters,
  setOffset,
} from 'src/store/queryParams/ClientQueryParamsSlice';
import { ClientStatus } from 'src/types/client/client';
import { UseFilters } from 'src/types/table/filter/filter';

export const useClinetFilters = (): UseFilters<{ status: ClientStatus | 'all' }> => {
  const dispatch = useDispatch();
  const queryParams = useSelector(selectQueryParams);

  const handleFilter = ({ status }: { status: ClientStatus | 'all' }) => {
    dispatch(setOffset(0));
    dispatch(setFilters({ status: status === 'all' ? undefined : status }));
  };

  const defaultValues: { status: ClientStatus | 'all' } = {
    status: queryParams.filters?.status || 'all',
  };

  return { handleFilter, defaultValues };
};
