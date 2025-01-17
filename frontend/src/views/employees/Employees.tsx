// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useCallback, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import PageContainer from 'src/components/container/PageContainer';

import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import EmployeesTable from 'src/components/tables/Employees';
import { useGetEmployeesQuery } from 'src/services/api/employee.api';
import { Employee } from 'src/types/employee/employee';
import { useSnackbar } from 'notistack';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Mitarbeiter',
  },
];


const Employees = () => {
  const { data: employeesData, isLoading, error } = useGetEmployeesQuery();
  const { enqueueSnackbar } = useSnackbar();

  const employees = employeesData?.employees as Employee[];

  // @ts-ignore
  const errorMessage = error?.data?.friendlyMessage

  useEffect(() => {
    if (errorMessage) {
      enqueueSnackbar(errorMessage, { variant: "error", autoHideDuration: 3000 });
    }
  }, [errorMessage])

  const renderEmployeesTable = useCallback(() => {
    if (isLoading || !employees) {
      return;
    }

    return <EmployeesTable employees={employees} />;
  }, [employees, isLoading]);

  return (
    (<PageContainer title="Mitarbeiter" description="this is Mitarbeiter page">
      <Breadcrumb title="Mitarbeiter" items={BCrumb} />
      <Grid container spacing={3}>
        {renderEmployeesTable()}
      </Grid>
    </PageContainer>)
  );
};

export default Employees;
