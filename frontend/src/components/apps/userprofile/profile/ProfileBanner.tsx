// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import {
  Grid2 as Grid,
  Box,
  Typography,
  Avatar,
  CardMedia,
  styled,
} from '@mui/material';
import profilecover from 'src/assets/images/backgrounds/abstract-paper-background-concept.jpg';
import userimg from 'src/assets/images/profile/user-1.jpg';
import ProfileTab from './ProfileTab';
import BlankCard from '../../../shared/BlankCard';
import { User } from 'src/types/auth/auth';

const ProfileBanner = ({ user }: { user: User }) => {
  const ProfileImage = styled(Box)(() => ({
    backgroundImage: 'linear-gradient(#50b2fc,#f44c66)',
    borderRadius: '50%',
    width: '110px',
    height: '110px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto'
  }));

  return (<>
    <BlankCard>
      <CardMedia component="img" image={profilecover} alt={profilecover} sx={{ height: 'auto', maxHeight: '320px', maxWidth: '100%' }} />
      <Grid container spacing={0} justifyContent="center" alignItems="center">
        {/* about profile */}
        <Grid
          sx={{
            order: {
              xs: '1',
              sm: '1',
              lg: '2',
            },
          }}
          size={{
            lg: 4,
            sm: 12,
            xs: 12
          }}>
          <Box
            display="flex"
            alignItems="center"
            textAlign="center"
            justifyContent="center"
            sx={{
              mt: '-115px',
            }}
          >
            <Box>
              <ProfileImage>
                <Avatar
                  src={userimg}
                  alt={userimg}
                  sx={{
                    borderRadius: '50%',
                    width: '100px',
                    height: '100px',
                    border: '4px solid #fff',
                  }}
                />
              </ProfileImage>
              <Box mt={1}>
                <Typography fontWeight={600} variant="h5">
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography color="textSecondary" variant="h6" fontWeight={400}>
                  {user.position}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
      {/**TabbingPart**/}
      <ProfileTab />
    </BlankCard>
  </>);
};

export default ProfileBanner;
