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
  const { data: staffData, isLoading, error, refetch } = useGetStaffsQuery();
  const { enqueueSnackbar } = useSnackbar();

  const staffs = staffData?.staffs as Staff[];

  // @ts-ignore
  const errorMessage = error?.data?.friendlyMessage;

  useEffect(() => {
    if (errorMessage) {
      enqueueSnackbar(errorMessage, { variant: 'error', autoHideDuration: 3000 });
    }
  }, [errorMessage]);

  useEffect(() => {
    refetch().then();
  }, []);

  const renderStaffsTable = useCallback(() => {
    if (isLoading || !staffs) {
      return;
    }

    return <StaffTable staff={staffs} />;
  }, [staffs, isLoading]);

  return (
    <PageContainer title="Personal" description="Dies ist die Personal-Seite">
      <Breadcrumb title="Personal" items={BCrumb} />
      <Grid container spacing={3}>
        {renderStaffsTable()}
      </Grid>
    </PageContainer>
  );
};

export default StaffPage;
