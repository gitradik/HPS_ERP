import {
  CardContent,
  Box,
  Stack,
  Avatar,
  Grid2 as Grid,
  Typography,
  Divider,
  Button,
} from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import BlankCard from 'src/components/shared/BlankCard';
import { useTranslation } from 'react-i18next';
import { useGetUsersQuery } from 'src/services/api/userApi';
import { User, UserRole } from 'src/types/auth/auth';
import CreateUserDialog from './CreateUserDialog';
import { useSelector } from 'src/store/Store';
import { selectIsLoading } from 'src/store/auth/RegisterSlice';
import SetUserRoleDialog from './SetUserRoleDialog';
import { getUploadsImagesProfilePath } from 'src/utils/uploadsPath';
import UsersCard, { defaultUserRoleType } from 'src/components/shared/UsersCard';
import { IconCircle, IconClock } from '@tabler/icons-react';

const UsersCards = () => {
  const filterUsers = (cSearch: string, role: defaultUserRoleType, users?: User[]) => {
    if (!users) return [];

    return users.filter((user) => {
      const matchesSearch = (user.firstName + ' ' + user.lastName + ' ' + user.email)
        .toLocaleLowerCase()
        .includes(cSearch.toLocaleLowerCase());

      const matchesRole = role === 'all' || user.role === role;

      return matchesSearch && matchesRole;
    });
  };
  const [search, setSearch] = React.useState('');
  const [role, setRole] = React.useState<defaultUserRoleType>('all');
  const [open, setOpen] = React.useState(false);
  const [openUserDialog, setOpenUserDialog] = React.useState(false);
  const isLoadingRegisterUser = useSelector(selectIsLoading);
  const { data, refetch } = useGetUsersQuery();
  const { t } = useTranslation();
  const users = data?.users || [];

  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

  const openUserDialogProcess = (u: User) => {
    setSelectedUser(u);
    setOpenUserDialog(true);
  };

  useEffect(() => {
    if (!isLoadingRegisterUser) refetch().then();
  }, [isLoadingRegisterUser]);

  const getUsers = useCallback(
    () => filterUsers(search, role, users),
    [users, search, filterUsers],
  );

  const isRoleUser = (u: User) => u.role === UserRole.USER;
  const showActiveStatus = (u: User) => {
    if (isRoleUser(u)) return <></>;

    const sizePx = 16;

    return (
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          color: u.isActive
            ? (theme) => theme.palette.success.main
            : (theme) => theme.palette.grey[500],
          borderRadius: '50%',
          height: sizePx,
          width: sizePx,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {u.isActive ? (
          <IconCircle height={sizePx} width={sizePx} />
        ) : (
          <IconClock height={sizePx} width={sizePx} />
        )}
      </Box>
    );
  };

  const handleFilter = ({ role: newRole, search: newSearch }: any) => {
    setRole(newRole || 'all');
    setSearch(newSearch || '');
  };

  return (
    <UsersCard
      onFilterSubmit={handleFilter}
      defaultValues={{ role, search }}
      onSearch={(value) => setSearch(value)}
      onOpenAddUserDialog={() => setOpen(true)}
      usersCount={users.length}
    >
      <CreateUserDialog title="Benutzer erstellen" open={open} onClose={() => setOpen(false)} />
      {selectedUser && (
        <SetUserRoleDialog
          user={selectedUser}
          title="Rolle zuweisen"
          open={openUserDialog}
          onClose={() => setOpenUserDialog(false)}
        />
      )}

      {getUsers().map((profile) => (
        <Grid
          key={profile.id}
          size={{
            xs: 12,
            lg: 4,
          }}
        >
          <BlankCard className="hoverCard">
            <Box display="flex" justifyContent="flex-end">
              {showActiveStatus(profile)}
            </Box>
            <CardContent>
              <Stack direction={'column'} gap={1} alignItems="center">
                <Avatar
                  alt={`${profile.firstName} ${profile.lastName}`}
                  src={getUploadsImagesProfilePath(profile.photo)}
                  sx={{ width: '80px', height: '80px' }}
                />
                <Box textAlign={'center'}>
                  <Typography variant="h5">
                    {profile.firstName} {profile.lastName}
                  </Typography>
                  <Typography variant="caption">{profile.position}</Typography>
                </Box>
                <Box textAlign={'center'}>
                  <Typography variant="body1">{profile.email}</Typography>
                </Box>
              </Stack>
            </CardContent>
            <Divider />
            <Box p={2} py={1} textAlign={'center'} sx={{ backgroundColor: 'grey.100' }}>
              <Button
                size="small"
                variant="text"
                color={isRoleUser(profile) ? 'warning' : 'info'}
                disabled={!isRoleUser(profile)}
                onClick={() => openUserDialogProcess(profile)}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                {isRoleUser(profile) ? t('setRole') : t(`UserRole.${profile.role}`)}
              </Button>
            </Box>
          </BlankCard>
        </Grid>
      ))}
    </UsersCard>
  );
};

export default UsersCards;
