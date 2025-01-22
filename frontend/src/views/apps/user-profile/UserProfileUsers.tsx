// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import PageContainer from 'src/components/container/PageContainer';
import UsersCard from 'src/components/apps/userprofile/users/UsersCard';
import ProfileBanner from 'src/components/apps/userprofile/profile/ProfileBanner';
import { useSelector } from 'src/store/Store';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { selectUser } from 'src/store/apps/auth/AuthSlice';

const BCrumb = [
  {
    to: '/',
    title: 'Startseite',
  },
  {
    title: 'Benutzer',
  },
];

const UserProfileUsers = () => {
  const user = useSelector(selectUser);

  return (
    <PageContainer title="Benutzer" description="Dies ist die Benutzerseite">
      <Breadcrumb title="Benutzer" items={BCrumb} />
      <Grid container spacing={3}>
        <Grid
          size={{
            sm: 12,
          }}
        >
          {user && <ProfileBanner user={user} />}
        </Grid>
        <Grid
          size={{
            sm: 12,
          }}
        >
          <UsersCard />
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default UserProfileUsers;
