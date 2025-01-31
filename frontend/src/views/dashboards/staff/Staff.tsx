// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useCallback, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import PageContainer from 'src/components/container/PageContainer';

import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { useSnackbar } from 'notistack';
import { useGetStaffsQuery } from 'src/services/api/staffApi';
import { Staff } from 'src/types/staff/staff';
import StaffTable from 'src/components/tables/staff/StaffTable';
import { useSelector } from 'src/store/Store';
import { selectQueryParams } from 'src/store/queryParams/QueryParamsSlice';

const BCrumb = [
  {
    to: '/',
    title: 'Startseite',
  },
  {
    title: 'Personal verwalten',
  },
];

const StaffPage = () => {
  const queryParams = useSelector(selectQueryParams);
  const { data: staffData, isLoading, error, refetch } = useGetStaffsQuery(queryParams);
  const { enqueueSnackbar } = useSnackbar();

  const staffs = staffData?.items as Staff[];
  const totalCount = staffData?.totalCount || 0;

  // @ts-ignore
  const errorMessage = error?.data?.friendlyMessage;

  useEffect(() => {
    if (errorMessage) enqueueSnackbar(errorMessage, { variant: 'error', autoHideDuration: 3000 });
  }, [errorMessage]);

  useEffect(() => {
    refetch().then();
  }, []);

  const renderStaffsTable = useCallback(() => {
    if (isLoading || !staffs) return;
    return <StaffTable staffs={staffs} totalCount={totalCount} />;
  }, [staffs, isLoading]);

  return (
    <PageContainer title="Personal" description="Dies ist die Personal-Seite">
      <Breadcrumb title="Personal" items={BCrumb} />
      <Grid container>{renderStaffsTable()}</Grid>
    </PageContainer>
  );
};

export default StaffPage;
