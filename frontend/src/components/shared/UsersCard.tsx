// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import { IconFilter, IconSearch } from '@tabler/icons-react';
import {
  Tooltip,
  IconButton,
  Menu,
  Stack,
  Select,
  FormControl,
  Button,
  Typography,
  Grid2 as Grid,
  InputAdornment,
  TextField,
  Divider,
  Chip,
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { Formik } from 'formik';
import ParentCard from './ParentCard';
import { User, UserRole } from 'src/types/user/user';
import { useTranslation } from 'react-i18next';

interface TableCardProps {
  children: any;
  onOpenAddUserDialog: () => void;
  onSearch: (value: string) => void;
  onFilterSubmit: (values: Partial<User>) => void;
  defaultValues: Partial<User>;
  usersCount: number;
}

const UsersCard = ({
  children,
  usersCount,
  onOpenAddUserDialog,
  onSearch,
  onFilterSubmit,
  defaultValues,
}: TableCardProps) => {
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const initialValues = {
    ...defaultValues,
    role: defaultValues.role || 'all',
    isActive:
      defaultValues.isActive !== undefined
        ? defaultValues.isActive
          ? 'active'
          : 'inactive'
        : 'all',
  };

  return (
    <Grid container spacing={3}>
      <Grid
        size={{
          xs: 12,
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          mt={2}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h3" pr={1}>
              Benutzer &nbsp;
              <Chip label={usersCount} color="secondary" size="small" />
            </Typography>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ borderRightWidth: '1px', borderColor: 'default' }}
            />
            <Button variant="contained" color="primary" size="small" onClick={onOpenAddUserDialog}>
              Benutzer erstellen
            </Button>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Tooltip title="Filter" placement="top">
              <IconButton onClick={handleClick}>
                <IconFilter />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              MenuListProps={{ sx: { p: 0 } }}
            >
              <ParentCard title="Filter">
                <Formik
                  initialValues={initialValues}
                  onSubmit={(values, actions) => {
                    onFilterSubmit({
                      role: values.role === 'all' ? undefined : (values.role as UserRole),
                      isActive:
                        values.isActive === 'all' ? undefined : values.isActive === 'active',
                    });
                    actions.setSubmitting(false);
                  }}
                >
                  {(props) => (
                    <form onSubmit={props.handleSubmit}>
                      <Stack spacing={2}>
                        <FormControl fullWidth>
                          <Typography variant="subtitle1" fontSize={12} fontWeight={600}>
                            Rolle
                          </Typography>
                          <Select
                            name="role"
                            value={props.values.role}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          >
                            <MenuItem value={'all'}>Alle</MenuItem>
                            {Object.values(UserRole)
                              .filter((role) => role !== UserRole.SUPER_ADMIN)
                              .map((role, idx) => (
                                <MenuItem key={`${role}${idx}`} value={role}>
                                  {t(`UserRole.${role}`)}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                        <FormControl fullWidth>
                          <Typography variant="subtitle1" fontSize={12} fontWeight={600}>
                            E-Mail Aktivitätsstatus
                          </Typography>
                          <Select
                            name="isActive"
                            value={props.values.isActive}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          >
                            <MenuItem value="all">{t('StatusValue.ALL')}</MenuItem>
                            <MenuItem value="active">{t('StatusValue.ACTIVE')}</MenuItem>
                            <MenuItem value="inactive">{t('StatusValue.INACTIVE')}</MenuItem>
                          </Select>
                        </FormControl>
                      </Stack>

                      <Stack pt={3} direction={'row'} spacing={3}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          loading={false}
                          disabled={props.isSubmitting}
                          size="small"
                        >
                          Übernehmen
                        </Button>
                        <Button size="small" onClick={handleClose} color="error">
                          Abbrechen
                        </Button>
                      </Stack>
                    </form>
                  )}
                </Formik>
              </ParentCard>
            </Menu>

            <TextField
              placeholder="Suche"
              size="small"
              type="search"
              variant="outlined"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconSearch size="14" />
                    </InputAdornment>
                  ),
                },
              }}
              fullWidth
              onChange={(e) => onSearch(e.target.value)}
            />
          </Stack>
        </Stack>
      </Grid>

      {children}
    </Grid>
  );
};

export default UsersCard;
