import { IconButton, Box, AppBar, useMediaQuery, Toolbar, styled, Stack } from '@mui/material';

import { useSelector, useDispatch, RootState } from 'src/store/Store';
import {
  toggleSidebar,
  toggleMobileSidebar,
  setDarkMode,
} from 'src/store/customizer/CustomizerSlice';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { IconMenu2, IconMoon, IconSun } from '@tabler/icons-react';
import Profile from './Profile';
import Language from './Language';
import MobileRightSidebar from './MobileRightSidebar';
import Search from './Search';
import Navigation from './Navigation';
import Notifications from './Notification';

const Header = () => {
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up('lg'));
  const lgDown = useMediaQuery((theme: any) => theme.breakpoints.down('lg'));

  // drawer
  const customizer = useSelector((state: RootState) => state.customizer);
  const dispatch = useDispatch();

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    background: theme.palette.background.paper,
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    [theme.breakpoints.up('lg')]: {
      minHeight: customizer.TopbarHeight,
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    color: theme.palette.text.secondary,
  }));

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        {/* ------------------------------------------- */}
        {/* Toggle Button Sidebar */}
        {/* ------------------------------------------- */}
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={lgUp ? () => dispatch(toggleSidebar()) : () => dispatch(toggleMobileSidebar())}
        >
          <IconMenu2 size="20" />
        </IconButton>

        {/* ------------------------------------------- */}
        {/* Search Dropdown */}
        {/* ------------------------------------------- */}
        <Search />
        {lgUp ? (
          <>
            <Navigation />
          </>
        ) : null}

        <Box flexGrow={1} />
        <Stack spacing={1} direction="row" alignItems="center">
          <Language />

          <IconButton size="large" color="inherit">
            {customizer.activeMode === 'light' ? (
              <IconMoon size="21" stroke="1.5" onClick={() => dispatch(setDarkMode('dark'))} />
            ) : (
              <IconSun size="21" stroke="1.5" onClick={() => dispatch(setDarkMode('light'))} />
            )}
          </IconButton>

          {/* <Notifications /> */}
          <Notifications />
          {/* ------------------------------------------- */}
          {/* Toggle Right Sidebar for mobile */}
          {/* ------------------------------------------- */}
          {lgDown ? <MobileRightSidebar /> : null}
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

export default Header;
