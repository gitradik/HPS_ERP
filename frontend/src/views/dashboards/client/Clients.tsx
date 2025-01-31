// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useCallback, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import PageContainer from 'src/components/container/PageContainer';

import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { useSnackbar } from 'notistack';
import { useGetClientsQuery } from 'src/services/api/clientApi';
import { Client } from 'src/types/client/client';
import ClientsTable from 'src/components/tables/client/ClientsTable';
import { useSelector } from 'src/store/Store';
import { selectQueryParams } from 'src/store/queryParams/QueryParamsSlice';

const BCrumb = [
  {
    to: '/',
    title: 'Startseite',
  },
  {
    title: 'Kunden',
  },
];

const Clients = () => {
  const queryParams = useSelector(selectQueryParams);
  const { data: clientsData, isLoading, error, refetch } = useGetClientsQuery(queryParams);
  const { enqueueSnackbar } = useSnackbar();

  const clients = clientsData?.items as Client[];
  const totalCount = clientsData?.totalCount || 0;

  // @ts-ignore
  const errorMessage = error?.data?.friendlyMessage;

  useEffect(() => {
    if (errorMessage) enqueueSnackbar(errorMessage, { variant: 'error', autoHideDuration: 3000 });
  }, [errorMessage]);

  useEffect(() => {
    refetch().then();
  }, []);

  const renderClientsTable = useCallback(() => {
    if (isLoading || !clients) return;

    return <ClientsTable clients={clients} totalCount={totalCount} />;
  }, [clients, isLoading]);

  return (
    <PageContainer title="Kunden" description="Dies ist die Kundenseite">
      <Breadcrumb title="Kunden" items={BCrumb} />
      <Grid container spacing={3}>
        {renderClientsTable()}
      </Grid>
    </PageContainer>
  );
};

export default Clients;
