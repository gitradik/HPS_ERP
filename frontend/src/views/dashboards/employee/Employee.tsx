// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useCallback, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import PageContainer from 'src/components/container/PageContainer';

import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import EmployeesTable from 'src/components/tables/employee/EmployeesTable';
import { useGetEmployeesQuery } from 'src/services/api/employeeApi';
import { Employee } from 'src/types/employee/employee';
import { useSnackbar } from 'notistack';
import { useSelector } from 'src/store/Store';
import { selectQueryParams } from 'src/store/queryParams/EmployeeQueryParamsSlice';

const BCrumb = [
  {
    to: '/',
    title: 'Startseite',
  },
  {
    title: 'Mitarbeiter',
  },
];

const Employees = () => {
  const queryParams = useSelector(selectQueryParams);
  const { data: employeesData, isLoading, error, refetch } = useGetEmployeesQuery(queryParams);
  const { enqueueSnackbar } = useSnackbar();

  const employees = employeesData?.items as Employee[];
  const totalCount = employeesData?.totalCount || 0;

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

  const renderEmployeeTable = useCallback(() => {
    if (isLoading || !employees) return;
    return <EmployeesTable employees={employees} totalCount={totalCount} />;
  }, [employees, isLoading]);

  return (
    <PageContainer title="Mitarbeiter" description="this is Mitarbeiter page">
      <Breadcrumb title="Mitarbeiter" items={BCrumb} />
      <Grid container spacing={3}>
        {renderEmployeeTable()}
      </Grid>
    </PageContainer>
  );
};

export default Employees;
