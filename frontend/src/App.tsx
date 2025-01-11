// Для App используем RootState
import { useSelector } from 'src/store/Store'; 
import { ThemeSettings } from './theme/Theme';
import RTL from './layouts/full/shared/customizer/RTL';
import { RootState } from './store/Store';  // Используем RootState вместо AppState
import { CssBaseline, ThemeProvider } from '@mui/material';
import { RouterProvider } from 'react-router';
import router from './routes/Router';

function App() {
  const theme = ThemeSettings();
  const customizer = useSelector((state: RootState) => state.customizer); // Используем RootState
  return (
    <ThemeProvider theme={theme}>
      <RTL direction={customizer.activeDir}>
        <CssBaseline />
        <RouterProvider router={router} />
      </RTL>
    </ThemeProvider>
  );
}

export default App;
