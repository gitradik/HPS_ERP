// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import { Box, Grid2 as Grid } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';

import TopCards from 'src/components/dashboards/modern/TopCards';
import RevenueUpdates from 'src/components/dashboards/modern/RevenueUpdates';

const Modern = () => {
  return (
    (<PageContainer title="Modern Dashboard" description="this is Modern Dashboard page">
      <Box>
        <Grid container spacing={3}>
          {/* column */}
          <Grid
            size={{
              xs: 12,
              lg: 12
            }}>
            <TopCards />
          </Grid>
          {/* column */}
          <Grid
            size={{
              xs: 12,
              lg: 8
            }}>
            <RevenueUpdates />
          </Grid>
        </Grid>
        {/* column */}
        {/* <Welcome /> */}
      </Box>
    </PageContainer>)
  );
};

export default Modern;
