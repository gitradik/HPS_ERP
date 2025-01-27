// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';

import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { useSnackbar } from 'notistack';
import Spinner from '../../spinner/Spinner';
import { useGetClientQuery } from 'src/services/api/clientApi';
import { Client } from 'src/types/client/client';
import ClientSetting from 'src/components/dashboards/client/ClientSetting';

const BCrumb = [
  {
    to: '/',
    title: 'Startseite',
  },
  {
    to: '/clients',
    title: 'Kunden',
  },
  {
    title: 'Kunden Detail',
  },
];

const ClientDetail = () => {
  const { id } = useParams();
  const { data: clientData, isLoading, error, refetch } = useGetClientQuery({ clientId: id! });
  const { enqueueSnackbar } = useSnackbar();

  const client = clientData?.client as Client;

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

  const renderClientDetails = useCallback(() => {
    if (isLoading || !client) {
      return <Spinner />;
    }

    return <ClientSetting client={client} />;
  }, [client, isLoading]);

  return (
    <PageContainer title="Kundendetails" description="Detaillierte Informationen über den Kunden">
      <Breadcrumb title="Kunden Detail" items={BCrumb} />
      {renderClientDetails()}
    </PageContainer>
  );
};

export default ClientDetail;
