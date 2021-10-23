import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import React from 'react';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#435e7c',
    },
    secondary: {
      main: '#A5C2A6',
    },
  }
});

ReactDOM.render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <App />
      </Provider>
    </ThemeProvider>
  </StrictMode>,
  document.getElementById('root')
);
