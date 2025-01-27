// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import { IconFilter, IconSearch, IconUserPlus } from '@tabler/icons-react';
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
import { UserRole } from 'src/types/auth/auth';
import { useTranslation } from 'react-i18next';

export type defaultUserRoleType = UserRole | 'all';

interface TableCardProps {
  children: any;
  onOpenAddUserDialog: () => void;
  onSearch: (value: string) => void;
  onFilterSubmit: (values: any) => void;
  defaultValues: {
    role: defaultUserRoleType;
    search: string;
  };
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

  const initialValues = { ...defaultValues };

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
            <Tooltip title="Benutzer erstellen" placement="top">
              <IconButton color="inherit" size="medium" onClick={onOpenAddUserDialog}>
                <IconUserPlus />
              </IconButton>
            </Tooltip>
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
                    onFilterSubmit(values);
                    actions.setSubmitting(false);
                  }}
                >
                  {(props) => (
                    <form onSubmit={props.handleSubmit}>
                      <Stack>
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
              id="outlined-search"
              placeholder="Benutzer suchen"
              size="small"
              type="search"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconSearch size="14" />
                  </InputAdornment>
                ),
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
