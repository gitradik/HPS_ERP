// Для App используем RootState
import { useSelector } from 'src/store/Store'; 
import { ThemeSettings } from './theme/Theme';
import RTL from './layouts/full/shared/customizer/RTL';
import { RootState } from './store/Store';  // Используем RootState вместо RootState
import { CssBaseline, ThemeProvider } from '@mui/material';
import { RouterProvider } from 'react-router';
import router from './routes/Router';
import { SnackbarProvider } from 'notistack';

function App() {
  const theme = ThemeSettings();
  const customizer = useSelector((state: RootState) => state.customizer); // Используем RootState
  return (
    <ThemeProvider theme={theme}>
        <RTL direction={customizer.activeDir}>
          <SnackbarProvider maxSnack={3}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left', 
            }}>
            <CssBaseline />
            <RouterProvider router={router} />
          </SnackbarProvider>
        </RTL>
    </ThemeProvider>
  );
}

export default App;
