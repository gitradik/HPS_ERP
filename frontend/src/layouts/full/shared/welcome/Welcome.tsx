import * as React from 'react';
import { Snackbar, Alert, AlertTitle } from '@mui/material';

const Welcome: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      handleClick();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <React.Fragment>
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity="info"
          variant="filled"
          sx={{ width: '100%', color: 'white' }}
        >
          <AlertTitle>Welcome To Modernize</AlertTitle>
          Easy to customize the Template!
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default Welcome;
