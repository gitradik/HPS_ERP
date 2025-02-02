import { selectQueryParams, setSortOptions } from 'src/store/queryParams/StaffQueryParamsSlice';
import { useDispatch, useSelector } from 'src/store/Store';
import { SortOrder } from 'src/types/query';

export const useStaffSortOrder = () => {
  const dispatch = useDispatch();
  // @ts-ignore
  const queryParams = useSelector(selectQueryParams);

  const handleSort = (columnId: string) => {
    let newSortOptions = [...(queryParams.sortOptions || [])];
    const existingSortIndex = newSortOptions.findIndex(([id]) => id === columnId);

    if (existingSortIndex !== -1) {
      const [_, currentSortOrder] = newSortOptions[existingSortIndex];

      if (currentSortOrder === SortOrder.ASC) {
        newSortOptions = newSortOptions.map(([col, order]) =>
          col === columnId ? [col, SortOrder.DESC] : [col, order],
        );
      } else {
        newSortOptions = newSortOptions.filter(([col]) => col !== columnId);
      }
    } else {
      newSortOptions.push([columnId, SortOrder.ASC]);
    }

    dispatch(setSortOptions(newSortOptions));
  };

  const getDirection = (columnId: string) => {
    return queryParams.sortOptions?.find(([id]) => id === columnId)?.[1] === SortOrder.ASC
      ? SortOrder.ASC
      : SortOrder.DESC;
  };

  const getSortDirection = (columnId: string) =>
    queryParams.sortOptions?.find(([id]) => id === columnId)?.[1];

  const isActiveDirection = (columnId: string) =>
    !!queryParams.sortOptions?.find(([id]) => id === columnId);

  return { handleSort, getDirection, getSortDirection, isActiveDirection };
};
