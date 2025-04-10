
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
// import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* <AuthProvider> */}
          <ThemeProvider>
            <App />
          </ThemeProvider>
        {/* </AuthProvider> */}
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
