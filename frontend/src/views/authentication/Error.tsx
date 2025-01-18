import { FC } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router';
import ErrorImg from 'src/assets/images/backgrounds/404-error-idea.gif';

const Error: FC = () => (
  <Box
    display="flex"
    flexDirection="column"
    height="100vh"
    textAlign="center"
    justifyContent="center"
  >
    <Container maxWidth="md">
      <img src={ErrorImg} alt="404" style={{ width: '100%', maxWidth: '500px' }} />
      <Typography align="center" variant="h1" mb={4}>
        Ups!!!
      </Typography>
      <Typography align="center" variant="h4" mb={4}>
        Die Seite, die Sie suchen, konnte nicht gefunden werden.
      </Typography>
      <Button color="primary" variant="contained" component={Link} to="/" disableElevation>
        Zurück zur Startseite
      </Button>
    </Container>
  </Box>
);

export default Error;
