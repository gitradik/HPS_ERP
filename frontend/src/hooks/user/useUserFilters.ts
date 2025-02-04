import {
  setFilters,
  setOffset,
  selectQueryParams,
} from 'src/store/queryParams/UserQueryParamsSlice';
import { useDispatch, useSelector } from 'src/store/Store';
import { UseFilters } from 'src/types/table/filter/filter';
import { User } from 'src/types/user/user';

export const useUserFilters = (): UseFilters<Partial<User>> => {
  const dispatch = useDispatch();
  // @ts-ignore
  const queryParams = useSelector(selectQueryParams);

  const handleFilter = (user: Partial<User>) => {
    dispatch(setOffset(0));
    dispatch(setFilters({ ...user }));
  };

  const defaultValues = { ...queryParams.filters };

  return { handleFilter, defaultValues };
};
