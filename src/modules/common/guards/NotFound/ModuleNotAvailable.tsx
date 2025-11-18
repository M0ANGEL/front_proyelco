import React from 'react';
import Lottie from 'lottie-react';
import animationMaintenance from '../../../../components/animations/lottie/routerNoDisponible.json'; // Ajusta la ruta

interface ModuleNotAvailableProps {
  moduleName?: string;
  estimatedDate?: string;
  message?: string;
}

const ModuleNotAvailable: React.FC<ModuleNotAvailableProps> = ({
  moduleName = "Este módulo",
  estimatedDate,
  message
}) => {
  const handleGoBack = () => {
    window.history.back();
  };


  const defaultMessage = message || `${moduleName} se encuentra en desarrollo y no está disponible en este momento.`;

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      minHeight: "100vh",
      padding: "20px",
      textAlign: "center",
      backgroundColor: "white"
    }}>
      {/* Animación Lottie */}
      <div style={{
        width: "300px",
        height: "300px",
        marginBottom: "10px"
      }}>
        <Lottie
          animationData={animationMaintenance}
          loop={true}
          autoplay={true}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      
      <h1 style={{ 
        color: "#856404", 
        marginBottom: "10px",
        fontSize: "2rem",
        fontWeight: "bold"
      }}>
        Módulo no disponible
      </h1>
      
      <p style={{ 
        color: "#666", 
        marginBottom: "15px",
        fontSize: "1.1rem",
        maxWidth: "500px",
        lineHeight: "1.5"
      }}>
        {defaultMessage}
      </p>

      {estimatedDate && (
        <p style={{ 
          color: "#155724", 
          marginBottom: "30px",
          fontSize: "1rem",
          fontWeight: "500",
          backgroundColor: "#d4edda",
          padding: "10px 20px",
          borderRadius: "8px",
          border: "1px solid #c3e6cb"
        }}>
          📅 Estimado de disponibilidad: <strong>{estimatedDate}</strong>
        </p>
      )}

      {!estimatedDate && (
        <p style={{ 
          color: "#6c757d", 
          marginBottom: "30px",
          fontSize: "0.9rem",
          fontStyle: "italic"
        }}>
          Estamos trabajando para que esté disponible pronto
        </p>
      )}
      
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
  );
}

export default ModuleNotAvailable;