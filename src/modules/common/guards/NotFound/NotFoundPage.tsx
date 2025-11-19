import Lottie from 'lottie-react';
import animation404 from '../../../../components/animations/lottie/403.json';

const NotFoundPage = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

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
          animationData={animation404}
          loop={true}
          autoplay={true}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      
      <h1 style={{ 
        color: "#333", 
        marginBottom: "10px",
        fontSize: "2rem",
        fontWeight: "bold"
      }}>
        404 - Página no encontrada
      </h1>
      
      <p style={{ 
        color: "#666", 
        marginBottom: "30px",
        fontSize: "1.1rem",
        maxWidth: "500px",
        lineHeight: "1.5"
      }}>
        La página que estás buscando no existe o ha sido movida a otra ubicación.
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
        
        <button 
          onClick={handleGoHome}
          style={{
            padding: "12px 24px",
            backgroundColor: "#007bff",
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
            e.currentTarget.style.backgroundColor = "#0056b3";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#007bff";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Ir al inicio
        </button>
      </div>
    </div>
  );
}

export default NotFoundPage;