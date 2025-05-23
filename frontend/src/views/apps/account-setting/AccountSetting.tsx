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
import { selectUser } from 'src/store/auth/AuthSlice';
import AccountTab from 'src/components/apps/account-setting/AccountTab';
import NotificationTab from 'src/components/apps/account-setting/NotificationTab';

const BCrumb = [
  {
    to: '/',
    title: 'Startseite',
  },
  {
    to: '/user-profile',
    title: 'Mein Profil',
  },
  {
    title: 'Kontoeinstellungen',
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
  const user = useSelector(selectUser);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <PageContainer title="Kontoeinstellungen " description="this is Kontoeinstellungen  page">
      {/* breadcrumb */}
      <Breadcrumb title="Kontoeinstellungen " items={BCrumb} />
      {/* end breadcrumb */}
      <Grid container spacing={3}>
        <Grid size={12}>
          {user && (
            <BlankCard>
              <Box sx={{ maxWidth: { xs: 320, sm: 480 } }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  variant="scrollable"
                  scrollButtons="auto"
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
            </BlankCard>
          )}
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default AccountSetting;
