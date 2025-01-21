// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useCallback, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import PageContainer from 'src/components/container/PageContainer';

import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import EmployeesTable from 'src/components/tables/employee/EmployeesTable';
import { useGetEmployeesQuery } from 'src/services/api/employee.api';
import { Employee } from 'src/types/employee/employee';
import { useSnackbar } from 'notistack';
import { useSelector } from 'src/store/Store';
import { selectAccountSettingIsEmpty } from 'src/store/apps/setting/AccountSettingSlice';
import { usePrevious } from 'src/utils/previousValue';

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
  const { data: employeesData, isLoading, error, refetch } = useGetEmployeesQuery();
  const { enqueueSnackbar } = useSnackbar();
  const isEmpty = useSelector(selectAccountSettingIsEmpty);
  const isEmptyPrev = usePrevious(isEmpty);

  const employees = employeesData?.employees as Employee[];

  // @ts-ignore
  const errorMessage = error?.data?.friendlyMessage

  useEffect(() => {
    if (errorMessage) {
      enqueueSnackbar(errorMessage, { variant: "error", autoHideDuration: 3000 });
    }
  }, [errorMessage]);

  useEffect(() => {
    if (isEmptyPrev !== isEmpty) {
      refetch().then();
    }
  }, [isEmpty]);

  const renderEmployeeTable = useCallback(() => {
    if (isLoading || !employees) {
      return;
    }

    return <EmployeesTable employees={employees} />;
  }, [employees, isLoading]);

  return (
    (<PageContainer title="Mitarbeiter" description="this is Mitarbeiter page">
      <Breadcrumb title="Mitarbeiter" items={BCrumb} />
      <Grid container spacing={3}>
        {renderEmployeeTable()}
      </Grid>
    </PageContainer>)
  );
};

export default Employees;
