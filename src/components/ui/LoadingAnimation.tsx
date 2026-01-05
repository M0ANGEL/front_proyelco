import React from 'react';
import { useLottie } from '../../hooks/useLottie';

interface LoadingAnimationProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  width = 500, // Aumentado de 400 a 500
  height = 500, // Aumentado de 400 a 500
  className = ''
}) => {
  const { animationContainer } = useLottie({
    path: '/lotties/cargas.json', // Ruta en la carpeta public
    loop: true,
    autoplay: true
  });

  return (
    <div 
      ref={animationContainer}
      style={{ 
        width, 
        height,
        marginTop: "5%",
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%', // Cambiado de '100px' a '50%' para hacerlo completamente redondo
        overflow: 'hidden', // Asegura que el contenido se recorte dentro del borde redondo
        transform: 'scale(1.4)' // Añade un pequeño escalado para hacerlo aún más grande
      }}
      className={className}
    />
  );
};

export default LoadingAnimation;