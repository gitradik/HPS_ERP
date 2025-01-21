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
import { selectAccountSettingIsEmpty } from 'src/store/apps/setting/AccountSettingSlice';
import { useSelector } from 'src/store/Store';
import { usePrevious } from 'src/utils/previousValue';

const BCrumb = [
  {
    to: '/',
    title: 'Startseite',
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
  const {
    data: employeeData,
    isLoading,
    error,
    refetch,
  } = useGetEmployeeQuery({ employeeId: id! });
  const isEmpty = useSelector(selectAccountSettingIsEmpty);
  const isEmptyPrev = usePrevious(isEmpty);
  const { enqueueSnackbar } = useSnackbar();

  const employee = employeeData?.employee as Employee;

  // @ts-ignore
  const errorMessage = error?.data?.friendlyMessage;

  useEffect(() => {
    if (errorMessage) {
      enqueueSnackbar(errorMessage, { variant: 'error', autoHideDuration: 3000 });
    }
  }, [errorMessage]);

  useEffect(() => {
    if (isEmptyPrev !== isEmpty) {
      refetch().then();
    }
  }, [isEmpty]);

  const renderEmployeeDetails = useCallback(() => {
    if (isLoading || !employee) {
      return <Spinner />;
    }

    return <EmployeeSetting employee={employee} />;
  }, [employee, isLoading]);

  return (
    <PageContainer
      title="Mitarbeiter Detail"
      description="Detaillierte Informationen über den Mitarbeiter"
    >
      <Breadcrumb title="Mitarbeiter Detail" items={BCrumb} />
      {renderEmployeeDetails()}
    </PageContainer>
  );
};

export default EmployeeDetail;
