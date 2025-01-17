import {
  CardContent,
  Box,
  Stack,
  Avatar,
  Grid2 as Grid,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  Divider,
  Tooltip,
  Button,
} from '@mui/material';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useCallback, useEffect } from 'react';
import BlankCard from 'src/components/shared/BlankCard';
import {
  IconSearch,
  IconPlus
} from '@tabler/icons-react';
import { useGetUsersQuery } from 'src/services/api/user.api';
import img2 from 'src/assets/images/profile/user-2.jpg';
import { User, UserRole } from 'src/types/auth/auth';
import CreateUserDialog from './CreateUserDialog';
import { useSelector } from 'src/store/Store';
import { selectIsLoading } from 'src/store/apps/auth/RegisterSlice';
import CreateEmployeeOrClientDialog from './CreateEmployeeOrClientDialog';

const UsersCard = () => {
  const filterUsers = (cSearch: string, users?: User[]) => {
    if (users)
      return users.filter((t) =>
        (t.firstName + " " + t.lastName).toLocaleLowerCase().includes(cSearch.toLocaleLowerCase()),
      );

    return [];
  };
  const [search, setSearch] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [openUserDialog, setOpenUserDialog] = React.useState(false);
  const isLoadingRegisterUser = useSelector(selectIsLoading);
  const { data, refetch } = useGetUsersQuery();
  const users = data?.users || [];

  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

  const openUserDialogProcess = (u: User) => {
    setSelectedUser(u);
    setOpenUserDialog(true);
  }

  useEffect(() => {
    if (!isLoadingRegisterUser) refetch().then()
  }, [isLoadingRegisterUser]);

  const getUsers = useCallback(() => filterUsers(search, users), [users, search, filterUsers]);

  const isRoleUser = (user: User) => user.role === UserRole.USER;


  return (<>
    <Grid container spacing={3}>
      <CreateUserDialog title="Benutzer erstellen" open={open} onClose={() => setOpen(false)} />
      {selectedUser &&
        <CreateEmployeeOrClientDialog user={selectedUser} title="Rolle zuweisen" open={openUserDialog} onClose={() => setOpenUserDialog(false)} />}
      <Grid
        size={{
          xs: 12
        }}>
       <Stack
            direction={{ xs: 'column', sm: 'row' }} // Меняем направление в зависимости от размера экрана
            alignItems="center"
            justifyContent="space-between"
            mt={2}
            spacing={2} // Добавляем пространство между элементами
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="h3">
                Benutzer &nbsp;
                <Chip label={users.length} color="secondary" size="small" />
              </Typography>
            </Box>
            <Box sx={{ flex: 1, width: { xs: '100%', sm: 'auto' } }}>
              <Tooltip title="Benutzer erstellen...">
                <Button
                  size="small"
                  variant="contained"
                  color="secondary"
                  startIcon={<IconPlus />}
                  onClick={() => setOpen(true)}
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                  Benutzer erstellen
                </Button>
              </Tooltip>
            </Box>
            {/* Перемещаем поле поиска в Stack, чтобы оно было внизу на маленьких экранах */}
            <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
              <TextField
                id="outlined-search"
                placeholder="Search Friends"
                size="small"
                type="search"
                variant="outlined"
                inputProps={{ 'aria-label': 'Search Followers' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconSearch size="14" />
                    </InputAdornment>
                  ),
                }}
                fullWidth
                onChange={(e) => setSearch(e.target.value)}
              />
            </Box>
          </Stack>
      </Grid>
      
      
      {getUsers().map((profile) => {
        return (
          (<Grid
            key={profile.id}
            size={{
              xs: 12,
              lg: 4
            }}>
            <BlankCard className="hoverCard">
              <CardContent>
                <Stack direction={'column'} gap={1} alignItems="center">
                  <Avatar
                    alt="Remy Sharp"
                    src={img2}
                    sx={{ width: '80px', height: '80px' }}
                  />
                  <Box textAlign={'center'}>
                    <Typography variant="h5">{profile.firstName} {profile.lastName}</Typography>
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
                  color={isRoleUser(profile) ? "warning" : "success"}
                  disabled={!isRoleUser(profile)}
                  onClick={() => openUserDialogProcess(profile)}
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                  {isRoleUser(profile) ? "Rolle zuweisen" : profile.role}
                </Button>
              </Box>
            </BlankCard>
          </Grid>)
        );
      })}
    </Grid>
  </>);
};

export default UsersCard;
