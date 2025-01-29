// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useState } from 'react';
import { Link } from 'react-router';
import { Box, Menu, Avatar, Typography, Divider, Button, IconButton, Stack } from '@mui/material';
import * as dropdownData from './data';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { IconMail } from '@tabler/icons-react';

import { useLogoutMutation } from 'src/services/api/authApi';
import { useDispatch, useSelector } from 'src/store/Store';
import { logoutSuccess, selectUser } from 'src/store/auth/AuthSlice';
import { getUploadsImagesProfilePath } from 'src/utils/uploadsPath';

const Profile = () => {
  const user = useSelector(selectUser);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const handleClick2 = (event: any) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const [logout, { isLoading }] = useLogoutMutation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(logoutSuccess());
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === 'object' && {
            color: 'primary.main',
          }),
        }}
        onClick={handleClick2}
      >
        {user && (
          <Avatar
            src={getUploadsImagesProfilePath(user.photo)}
            alt={user.photo}
            sx={{
              width: 35,
              height: 35,
            }}
          />
        )}
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '360px',
            p: 4,
          },
        }}
      >
        <Typography variant="h5">Benutzerprofil</Typography>
        {user && (
          <Stack direction="row" py={3} spacing={2} alignItems="center">
            <Avatar src={getUploadsImagesProfilePath(user.photo)} sx={{ width: 95, height: 95 }} />
            <Box>
              <Typography variant="subtitle2" color="textPrimary" fontWeight={600}>
                {`${user.firstName} ${user.lastName}`}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                {user.position || 'Position fehlt'}
              </Typography>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                display="flex"
                alignItems="center"
                gap={1}
              >
                <IconMail width={15} height={15} />
                {user.email}
              </Typography>
            </Box>
          </Stack>
        )}
        <Divider />
        {dropdownData.profile.map((profile) => (
          <Box key={profile.title}>
            <Box onClick={handleClose2} sx={{ py: 2, px: 0 }} className="hover-text-primary">
              <Link to={profile.href}>
                <Stack direction="row" spacing={2}>
                  <Box
                    width="45px"
                    height="45px"
                    bgcolor="primary.light"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Avatar
                      src={profile.icon}
                      alt={profile.icon}
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: 0,
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      color="textPrimary"
                      className="text-hover"
                      noWrap
                      sx={{
                        width: '240px',
                      }}
                    >
                      {profile.title}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="subtitle2"
                      sx={{
                        width: '240px',
                      }}
                      noWrap
                    >
                      {profile.subtitle}
                    </Typography>
                  </Box>
                </Stack>
              </Link>
            </Box>
          </Box>
        ))}
        <Box mt={2}>
          <Button
            onClick={handleLogout}
            disabled={isLoading}
            variant="outlined"
            color="primary"
            fullWidth
          >
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
