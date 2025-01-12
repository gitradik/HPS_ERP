// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import PageContainer from 'src/components/container/PageContainer';

import ProfileBanner from 'src/components/apps/userprofile/profile/ProfileBanner';
import IntroCard from 'src/components/apps/userprofile/profile/IntroCard';
import { useGetUserQuery } from 'src/services/api/auth.api';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { useSelector } from 'src/store/Store';
import { selectAccountSetting } from 'src/store/apps/accountSetting/AccountSettingSlice';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'My Profile',
  },
];


const UserProfile = ({ userId }: any) => {
  const { data, refetch } = useGetUserQuery({ userId });
  const accountSetting = useSelector(selectAccountSetting);

  const user = data?.user

  useEffect(() => {
    refetch().then()
  }, [accountSetting])


  return (
    (<PageContainer title="User Profile" description="this is User Profile page">
      <Breadcrumb title="User Profile" items={BCrumb} />
      <Grid container spacing={3}>
        <Grid
          size={{
            sm: 12
          }}>
          {user && <ProfileBanner user={user}  />}
        </Grid>

        {/* intro and Photos Card */}
        <Grid
          size={{
            sm: 12,
            lg: 4,
            xs: 12
          }}>
          <Grid container spacing={3}>
            <Grid
              size={{
                sm: 12
              }}>
              {user && <IntroCard user={user}  />}
            </Grid>
          </Grid>
        </Grid>
        <Grid
          size={{
            sm: 12,
            lg: 8,
            xs: 12
          }}>
          {/* <Post /> */}
        </Grid>
      </Grid>
    </PageContainer>)
  );
};

export default UserProfile;
