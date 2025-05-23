import { useState } from 'react';
import { Box, Menu, Typography, Button, Divider, Grid2 as Grid } from '@mui/material';
import { Link } from 'react-router';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { IconChevronDown, IconHelp } from '@tabler/icons-react';
import AppLinks from './AppLinks';
import QuickLinks from './QuickLinks';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import { useTranslation } from 'react-i18next';

const AppDD = () => {
  const { t } = useTranslation();
  const [anchorEl2, setAnchorEl2] = useState(null);

  // const handleClick2 = (event: any) => {
  //   setAnchorEl2(event.currentTarget);
  // };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  return (
    <>
      <Box>
        {/* ------------------------------------------- */}
        {/* Message Dropdown */}
        {/* ------------------------------------------- */}
        <Menu
          id="msgs-menu"
          anchorEl={anchorEl2}
          keepMounted
          open={Boolean(anchorEl2)}
          onClose={handleClose2}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          transformOrigin={{ horizontal: 'left', vertical: 'top' }}
          sx={{
            '& .MuiMenu-paper': {
              width: '850px',
            },
            '& .MuiMenu-paper ul': {
              p: 0,
            },
          }}
        >
          <Grid container>
            <Grid
              display="flex"
              size={{
                sm: 8,
              }}
            >
              <Box p={4} pr={0} pb={3}>
                <AppLinks />
                <Divider />
                <Box
                  sx={{
                    display: {
                      xs: 'none',
                      sm: 'flex',
                    },
                  }}
                  alignItems="center"
                  justifyContent="space-between"
                  pt={2}
                  pr={4}
                >
                  <Link to="/faq">
                    <Typography
                      variant="subtitle2"
                      fontWeight="600"
                      color="textPrimary"
                      display="flex"
                      alignItems="center"
                      gap="4px"
                    >
                      <IconHelp width={24} />
                      Frequently Asked Questions
                    </Typography>
                  </Link>
                  <Button variant="contained" color="primary">
                    Check
                  </Button>
                </Box>
              </Box>
              <Divider orientation="vertical" />
            </Grid>
            <Grid
              size={{
                sm: 4,
              }}
            >
              <Box p={4}>
                <QuickLinks />
              </Box>
            </Grid>
          </Grid>
        </Menu>
      </Box>
      <Button
        color="inherit"
        sx={{ color: (theme) => theme.palette.text.secondary }}
        variant="text"
        to="/"
        component={Link}
      >
        {t('MenuItems.home_page')}
      </Button>
      <Button
        color="inherit"
        sx={{ color: (theme) => theme.palette.text.secondary }}
        variant="text"
        to="/calendar"
        component={Link}
      >
        {t('MenuItems.calendar')}
      </Button>
    </>
  );
};

export default AppDD;
