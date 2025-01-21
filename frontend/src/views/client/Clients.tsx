// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useCallback, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import PageContainer from 'src/components/container/PageContainer';

import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { useSnackbar } from 'notistack';
import { useSelector } from 'src/store/Store';
import { selectAccountSettingIsEmpty } from 'src/store/apps/setting/AccountSettingSlice';
import { usePrevious } from 'src/utils/previousValue';
import { useGetClientsQuery } from 'src/services/api/client.api';
import { Client } from 'src/types/client/client';
import ClientsTable from 'src/components/tables/client/ClientsTable';

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
  const { data: clientsData, isLoading, error, refetch } = useGetClientsQuery();
  const { enqueueSnackbar } = useSnackbar();
  const isEmpty = useSelector(selectAccountSettingIsEmpty);
  const isEmptyPrev = usePrevious(isEmpty);

  const clients = clientsData?.clients as Client[];

  // @ts-ignore
  const errorMessage = error?.data?.friendlyMessage;

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

  const renderClientsTable = useCallback(() => {
    if (isLoading || !clients) {
      return;
    }

    return <ClientsTable clients={clients} />;
  }, [clients, isLoading]);

  return (
    (<PageContainer title="Kunden" description="Dies ist die Kundenseite">
      <Breadcrumb title="Kunden" items={BCrumb} />
      <Grid container spacing={3}>
        {renderClientsTable()}
      </Grid>
    </PageContainer>)
  );
};

export default Clients;
