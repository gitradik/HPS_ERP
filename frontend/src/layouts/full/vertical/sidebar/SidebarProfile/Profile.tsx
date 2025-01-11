import { Box, Avatar, Typography, IconButton, Tooltip, useMediaQuery } from '@mui/material';
import { RootState, useSelector } from 'src/store/Store';
import img1 from 'src/assets/images/profile/user-1.jpg';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { IconPower } from '@tabler/icons-react';
import { Link } from 'react-router';
import { useLogoutMutation } from 'src/services/api/auth.api';
import { logoutSuccess} from 'src/store/apps/auth/AuthSlice';
import { useDispatch } from 'react-redux';

export const Profile = () => {
  const customizer = useSelector((state: RootState) => state.customizer);
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up('lg'));
  const hideMenu = lgUp ? customizer.isCollapse && !customizer.isSidebarHover : '';
  const [logout, { isLoading }] = useLogoutMutation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(logoutSuccess())
    } catch (error) {
      console.error(error)
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
          <Avatar alt="Remy Sharp" src={img1} />

          <Box>
            <Typography variant="h6">Hermann</Typography>
            <Typography variant="caption">Geschäftsführung</Typography>
          </Box>
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
