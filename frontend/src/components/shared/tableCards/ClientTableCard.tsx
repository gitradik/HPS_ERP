// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { IconDownload, IconFilter } from '@tabler/icons-react';
import {
  Card,
  CardHeader,
  Tooltip,
  IconButton,
  Menu,
  Stack,
  Select,
  FormControl,
  Button,
  Typography,
} from '@mui/material';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import { useSelector } from 'src/store/Store';
import { Formik } from 'formik';
import ParentCard from '../ParentCard';
import { ClientStatus } from 'src/types/client/client';
import { useTranslation } from 'react-i18next';

interface TableCardProps {
  title: string;
  children: any;
  onDownload: () => void;
  onFilterSubmit: (values: any) => void;
  defaultValues?: {
    status?: ClientStatus | 'all';
  };
}

const ClientTableCard = ({
  title,
  children,
  onDownload,
  onFilterSubmit,
  defaultValues,
}: TableCardProps) => {
  const { t } = useTranslation();
  const customizer = useSelector((state: any) => state.customizer);

  const theme = useTheme();
  const borderColor = theme.palette.divider;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const initialValues = { ...(defaultValues || {}) };

  return (
    <Card
      sx={{ padding: 0, border: !customizer.isCardShadow ? `1px solid ${borderColor}` : 'none' }}
      elevation={customizer.isCardShadow ? 9 : 0}
      variant={!customizer.isCardShadow ? 'outlined' : undefined}
    >
      <CardHeader
        title={title}
        action={
          <>
            <Tooltip title="Filter" placement="top">
              <IconButton onClick={handleClick}>
                <IconFilter />
              </IconButton>
            </Tooltip>

            <Tooltip title="Herunterladen" placement="top">
              <IconButton onClick={onDownload}>
                <IconDownload />
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
                            Status
                          </Typography>
                          <Select
                            name="status"
                            value={props.values.status}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          >
                            <MenuItem value="all">{t(`ClientStatus.ALL`)}</MenuItem>
                            {Object.values(ClientStatus).map((cs, idx) => (
                              <MenuItem
                                key={`ClientTableCard-SelectStatus-${cs}-${idx}`}
                                value={cs}
                              >
                                {t(`ClientStatus.${cs}`)}
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
          </>
        }
      />
      <Divider />
      {children}
    </Card>
  );
};

export default ClientTableCard;
