// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';

import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { useGetEmployeeQuery } from 'src/services/api/employee.api';
import { Employee } from 'src/types/employee/employee';
import { useSnackbar } from 'notistack';
import Spinner from '../spinner/Spinner';
import EmployeeSetting from 'src/components/apps/employee/EmployeeSetting';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    to: '/employees',
    title: 'Mitarbeiter',
  },
  {
    title: 'Mitarbeiter Detail',
  },
];

const EmployeeDetail = () => {
  const { id } = useParams();
  const { data: employeeData, isLoading, error } = useGetEmployeeQuery({ employeeId: id! });
  const { enqueueSnackbar } = useSnackbar();

  const employee = employeeData?.employee as Employee;

  // @ts-ignore
  const errorMessage = error?.data?.friendlyMessage;

  useEffect(() => {
    if (errorMessage) {
      enqueueSnackbar(errorMessage, { variant: "error", autoHideDuration: 3000 });
    }
  }, [errorMessage]);

  const renderEmployeeDetails = useCallback(() => {
    if (isLoading || !employee) {
      return <Spinner />;
    }

    return <EmployeeSetting employee={employee} />;
  }, [employee, isLoading]);

  return (
    <PageContainer title="Mitarbeiter Detail" description="Detailed information about the employee">
      <Breadcrumb title="Mitarbeiter Detail" items={BCrumb} />
      {renderEmployeeDetails()}
    </PageContainer>
  );
};

export default EmployeeDetail;
