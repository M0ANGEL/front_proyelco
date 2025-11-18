import React from "react";
import { Routes, Route } from "react-router-dom";
import Lottie from "lottie-react";
import animation403 from "../../../../components/animations/lottie/403.json"; // Asegúrate de tener esta animación

interface RoutesWithUnauthorizedProps {
  children: React.ReactNode;
  message?: string;
}

export const RoutesWithNotFound: React.FC<RoutesWithUnauthorizedProps> = ({
  children,
  message = "No tienes permisos para acceder a esta página."
}) => {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <Routes>
      {children}
      <Route
        path="*"
        element={
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            justifyContent: "center", 
            minHeight: "60vh",
            padding: "20px",
            textAlign: "center",
            backgroundColor: "white"
          }}>
            {/* Animación Lottie para no autorizado */}
            <div style={{
              width: "300px",
              height: "300px",
              marginBottom: "10px"
            }}>
              <Lottie
                animationData={animation403}
                loop={true}
                autoplay={true}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            
            <h1 style={{ 
              color: "#dc3545", 
              marginBottom: "10px",
              fontSize: "2rem",
              fontWeight: "bold"
            }}>
              403 - Acceso denegado
            </h1>
            
            <p style={{ 
              color: "#666", 
              marginBottom: "30px",
              fontSize: "1.1rem",
              maxWidth: "500px",
              lineHeight: "1.5"
            }}>
              {message}
            </p>
            
            <div style={{
              display: "flex",
              gap: "15px",
              flexWrap: "wrap",
              justifyContent: "center"
            }}>
              <button 
                onClick={handleGoBack}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: "500",
                  transition: "all 0.3s ease",
                  minWidth: "140px"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#5a6268";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#6c757d";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Volver atrás
              </button>
            </div>
          </div>
        }
      />
    </Routes>
  );
};