// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useCallback, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import PageContainer from 'src/components/container/PageContainer';

import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import EmployeesTable from 'src/components/tables/Employees';
import Notifications from 'src/components/shared/Notifications';
import { useDispatch } from 'src/store/Store';
import { addNotification } from 'src/store/apps/notifications/NotificationsSlice';
import { useGetEmployeesQuery } from 'src/services/api/employee.api';
import { Employee } from 'src/types/employee/employee';

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

  const dispatch = useDispatch();

  const employees = employeesData?.employees as Employee[];

  // @ts-ignore
  const errorMessage = error?.data?.friendlyMessage

  useEffect(() => {
    if (errorMessage) {
      dispatch(addNotification({
        message: errorMessage,
        type: 'error',
        autoHideDuration: 3000
      }));
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
      <Notifications />
      <Breadcrumb title="Mitarbeiter" items={BCrumb} />
      <Grid container spacing={3}>
        {renderEmployeesTable()}
      </Grid>
    </PageContainer>)
  );
};

export default Employees;
