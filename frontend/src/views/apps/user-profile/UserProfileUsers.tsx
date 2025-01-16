// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import PageContainer from 'src/components/container/PageContainer';
import UsersCard from 'src/components/apps/userprofile/users/UsersCard';
import ProfileBanner from 'src/components/apps/userprofile/profile/ProfileBanner';
import { useGetUserQuery } from 'src/services/api/user.api';
import { useSelector } from 'src/store/Store';
import { selectAccountSetting } from 'src/store/apps/accountSetting/AccountSettingSlice';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import Notifications from 'src/components/shared/Notifications';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Benutzer',
  },
];

const UserProfileUsers = ({ userId }: any) => {
  const { data, refetch } = useGetUserQuery({ userId });
  const accountSetting = useSelector(selectAccountSetting);

  const user = data?.user

  useEffect(() => {
    refetch().then()
  }, [accountSetting])
  
  return (
    (<PageContainer title="Benutzer" description="this is Benutzer page">
      <Notifications/>
      <Breadcrumb title="Benutzer" items={BCrumb} />
      <Grid container spacing={3}>
        <Grid
          size={{
            sm: 12
          }}>
          {user && <ProfileBanner user={user}  />}
        </Grid>
        <Grid
          size={{
            sm: 12
          }}>
          <UsersCard />
        </Grid>
      </Grid>
    </PageContainer>)
  );
};

export default UserProfileUsers;
