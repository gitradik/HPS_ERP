import { Box, Avatar, Typography, IconButton, Tooltip, useMediaQuery } from '@mui/material';
import { RootState, useSelector } from 'src/store/Store';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { IconPower } from '@tabler/icons-react';
import { useLogoutMutation } from 'src/services/api/authApi';
import { logoutSuccess, selectUser } from 'src/store/apps/auth/AuthSlice';
import { useDispatch } from 'react-redux';
import { getUploadsImagesProfilePath } from 'src/utils/uploadsPath';

export const Profile = () => {
  const customizer = useSelector((state: RootState) => state.customizer);
  const user = useSelector(selectUser);
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up('lg'));
  const hideMenu = lgUp ? customizer.isCollapse && !customizer.isSidebarHover : '';
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
    <Box
      display={'flex'}
      alignItems="center"
      gap={2}
      sx={{ m: 2, p: 2, bgcolor: `${'secondary.light'}` }}
    >
      {!hideMenu ? (
        <>
          {user && (
            <Avatar alt="Remy Sharp" src={`${getUploadsImagesProfilePath()}/${user.photo}`} />
          )}

          {user && (
            <Box>
              <Typography variant="h6">{user.firstName}</Typography>
              <Typography variant="caption">{user.position || 'Position fehlt'}</Typography>
            </Box>
          )}
          <Box sx={{ ml: 'auto' }}>
            <Tooltip title="Logout" placement="top">
              <IconButton
                onClick={handleLogout}
                disabled={isLoading}
                color="primary"
                aria-label="logout"
                size="small"
              >
                <IconPower size="20" />
              </IconButton>
            </Tooltip>
          </Box>
        </>
      ) : (
        ''
      )}
    </Box>
  );
};
