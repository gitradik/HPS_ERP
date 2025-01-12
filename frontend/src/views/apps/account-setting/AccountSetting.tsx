// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as React from 'react';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { Grid2 as Grid, Tabs, Tab, Box, CardContent, Divider } from '@mui/material';

// components
import { IconBell, IconUserCircle } from '@tabler/icons-react';
import BlankCard from '../../../components/shared/BlankCard';
import { useSelector } from 'src/store/Store';
import { selectUserId } from 'src/store/apps/auth/AuthSlice';
import { useGetUserQuery } from 'src/services/api/auth.api';
import AccountTab from 'src/components/apps/account-setting/AccountTab';
import NotificationTab from 'src/components/apps/account-setting/NotificationTab';
import Notifications from 'src/components/shared/Notifications';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    to: '/user-profile',
    title: 'My Profile',
  },
  {
    title: 'Account Setting',
  },
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const AccountSetting = () => {
  const [value, setValue] = React.useState(0);
  const userId = useSelector(selectUserId);
  const { data } = useGetUserQuery({ userId });
  
  const user = data?.user

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    (<PageContainer title="Account Setting" description="this is Account Setting page">
      {/* breadcrumb */}
      <Breadcrumb title="Account Setting" items={BCrumb} />
      {/* end breadcrumb */}
      <Notifications />
      <Grid container spacing={3}>
        <Grid size={12}>
          {user && <BlankCard>
            <Box sx={{ maxWidth: { xs: 320, sm: 480 } }}>
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="basic tabs example"
              >
                <Tab
                  iconPosition="start"
                  icon={<IconUserCircle size="22" />}
                  label="Account"
                  {...a11yProps(0)}
                />

                <Tab
                  iconPosition="start"
                  icon={<IconBell size="22" />}
                  label="Notifications"
                  {...a11yProps(1)}
                />
              </Tabs>
            </Box>
            <Divider />
            <CardContent>
              <TabPanel value={value} index={0}>
                <AccountTab user={user} />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <NotificationTab />
              </TabPanel>
            </CardContent>
          </BlankCard>}
        </Grid>
      </Grid>
    </PageContainer>)
  );
};

export default AccountSetting;
