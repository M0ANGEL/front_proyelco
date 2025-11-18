import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingAnimation from '@/components/ui/LoadingAnimation';

interface PublicRouterProps {
  children: React.ReactNode;
}

const PublicRouter: React.FC<PublicRouterProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <>
    <div style={{ padding: "50px", textAlign: "center" }}>
            Cargando...
          </div>
          {/* Animación debajo de las cartas */}
          <div style={{ marginTop: "70px", textAlign: "center" }}>
            <LoadingAnimation width={300} height={250} />
          </div>
    </>;
  }

  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

export default PublicRouter;