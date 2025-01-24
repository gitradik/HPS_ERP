// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';

import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { useSnackbar } from 'notistack';
import Spinner from '../spinner/Spinner';
import { useGetStaffQuery } from 'src/services/api/staffApi';
import { Staff } from 'src/types/staff/staff';
import StaffSetting from 'src/components/apps/staff/StaffSetting';

const BCrumb = [
  {
    to: '/',
    title: 'Startseite',
  },
  {
    to: '/staff',
    title: 'Personal verwalten',
  },
  {
    title: 'Personal Detail',
  },
];

const StaffDetail = () => {
  const { id } = useParams();
  const { data: staffData, isLoading, error, refetch } = useGetStaffQuery({ staffId: id! });
  const { enqueueSnackbar } = useSnackbar();

  const staff = staffData?.staff as Staff;

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

  const renderStaffDetails = useCallback(() => {
    if (isLoading || !staff) {
      return <Spinner />;
    }

    return <StaffSetting staff={staff} />;
  }, [staff, isLoading]);

  return (
    <PageContainer
      title="Personal Details"
      description="Detaillierte Informationen über das Personal"
    >
      <Breadcrumb title="Personal Detail" items={BCrumb} />
      {renderStaffDetails()}
    </PageContainer>
  );
};

export default StaffDetail;
