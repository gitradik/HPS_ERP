import { useDispatch, useSelector } from 'react-redux';
import { selectQueryParams, setOffset } from 'src/store/queryParams/EmployeeQueryParamsSlice';

export const useEmployeePagination = (totalCount: number) => {
  const dispatch = useDispatch();
  const queryParams = useSelector(selectQueryParams);

  const handlePageChange = (_: any, newPage: number) => {
    const newOffset = (newPage - 1) * queryParams.limit!;
    dispatch(setOffset(newOffset));
  };

  return {
    count: Math.ceil(totalCount / queryParams.limit!),
    page: Math.floor(queryParams.offset! / queryParams.limit!) + 1,
    handlePageChange,
  };
};
