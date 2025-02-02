import { StatusValue } from 'src/components/shared/tableCards/TableCard';
import {
  selectQueryParams,
  setFilters,
  setOffset,
} from 'src/store/queryParams/StaffQueryParamsSlice';
import { useDispatch, useSelector } from 'src/store/Store';
import { UseFilters } from 'src/types/table/filter/filter';

export const useStaffFilters = (): UseFilters<{ status: StatusValue }> => {
  const dispatch = useDispatch();
  // @ts-ignore
  const queryParams = useSelector(selectQueryParams);

  const handleFilter = ({ status }: { status: StatusValue }) => {
    dispatch(setOffset(0));
    dispatch(
      setFilters({
        isAssigned: status === StatusValue.ALL ? undefined : status === StatusValue.ACTIVE,
      }),
    );
  };

  const defaultValues: { status: StatusValue } = {
    status:
      queryParams.filters?.isAssigned === undefined
        ? StatusValue.ALL
        : queryParams.filters?.isAssigned
          ? StatusValue.ACTIVE
          : StatusValue.INACTIVE,
  };

  return { handleFilter, defaultValues };
};
