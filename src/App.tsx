import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AuthProvider } from './hooks/useAuth';
import AppRouter from './router/AppRouter';
import './styles.scss';

const App: React.FC = () => {
  return (
    <ConfigProvider>
        <AuthProvider>
          <Router>
            <AppRouter />
          </Router>
        </AuthProvider>
    </ConfigProvider>
  );
};

export default App;