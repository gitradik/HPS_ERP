import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'src/store/Store';
import {
  selectQueryParams,
  setFilters,
  setSortOptions,
  setOffset,
  setLimit,
} from 'src/store/queryParams/QueryParamsSlice';
import { SortOrder, WhereConditions } from 'src/types/query';

const QueryParamsProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = useSelector(selectQueryParams);
  const dispatch = useDispatch();

  useEffect(() => {
    const filters: WhereConditions<any> = {};
    searchParams.forEach((value, key) => {
      if (key === 'sortOptions') {
        const sortOptions: [string, SortOrder][] = value
          .split(',')
          .map((item) => {
            const [field, order] = item.split(':');
            if (field && (order === SortOrder.ASC || order === SortOrder.DESC)) {
              return [field, order as SortOrder];
            }
            return null;
          })
          .filter(Boolean) as [string, SortOrder][];
        dispatch(setSortOptions(sortOptions));
      } else if (key === 'offset') dispatch(setOffset(Number(value)));
      else if (key === 'limit') dispatch(setLimit(Number(value)));
      else if (value === 'true' || value === 'false') filters[key] = value === 'true';
      else filters[key] = value;
    });

    if (Object.keys(filters).length) {
      dispatch(setFilters(filters));
    }
  }, []);

  // Update URL when have changes `queryParams`
  useEffect(() => {
    const newParams: Record<string, string> = {};

    // filters
    if (queryParams.filters)
      Object.entries(queryParams.filters).forEach(([key, value]) => {
        if (value !== undefined) {
          newParams[key] = value === true ? 'true' : value === false ? 'false' : value;
        }
      });

    // sorting
    if (queryParams.sortOptions?.length)
      newParams.sortOptions = queryParams.sortOptions
        .map(([field, order]) => `${field}:${order}`)
        .join(',');

    // pagination
    if (queryParams.offset !== undefined) newParams.offset = queryParams.offset.toString();

    if (queryParams.limit !== undefined) newParams.limit = queryParams.limit.toString();

    setSearchParams(newParams);
  }, [queryParams, setSearchParams]);

  return <>{children}</>;
};

export default QueryParamsProvider;
