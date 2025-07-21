import { Apartment } from '@/services/types';
import React from 'react';

interface ApartmentStatusProps {
  apartment: Apartment;
}

const ApartmentStatus: React.FC<ApartmentStatusProps> = ({ apartment }) => {
  const getStatusColor = () => {
    switch (apartment.estado) {
      case '2': return 'green'; // Completado
      case '1': return 'blue';  // En progreso
      default: return 'gray';   // No iniciado
    }
  };

  const getStatusText = () => {
    switch (apartment.estado) {
      case '2': return 'Completado';
      case '1': return 'En progreso';
      default: return 'No iniciado';
    }
  };

  return (
    <div className="apartment-status">
      <div 
        className="status-indicator" 
        style={{ backgroundColor: getStatusColor() }}
        title={getStatusText()}
      />
    </div>
  );
};

export default ApartmentStatus;