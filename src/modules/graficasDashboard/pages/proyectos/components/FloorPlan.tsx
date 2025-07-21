// import React from 'react';
// import ApartmentStatus from './ApartmentStatus';
// import { Apartment } from '@/services/types';

// interface FloorPlanProps {
//   apartments: Apartment[];
//   floor: string;
// }

// const FloorPlan: React.FC<FloorPlanProps> = ({ apartments, floor }) => {
//   return (
//     <div className="floor-plan">
//       <h4>Plano del Piso {floor}</h4>
//       <div className="apartments-grid">
//         {apartments.map(apartment => (
//           <div key={apartment.id} className="apartment-container">
//             <ApartmentStatus apartment={apartment} />
//             <span>{apartment.consecutivo}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default FloorPlan;

import React from 'react';
import { Apartment } from '@/services/types';

// Estilos para el componente FloorPlan
const floorPlanStyles = {
  container: {
    backgroundColor: '#f8fafc',
    borderRadius: '10px',
    padding: '1.5rem',
    marginBottom: '2rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
  },
  title: {
    fontSize: '1.2rem',
    color: '#2d3748',
    margin: '0 0 1rem 0',
    fontWeight: '600',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '0.5rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: '1rem'
  },
  apartmentContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem'
  },
  apartmentNumber: {
    fontSize: '0.85rem',
    color: '#4a5568',
    fontWeight: '500'
  }
};

// Estilos para ApartmentStatus (integrado directamente)
const apartmentStatusStyles = {
  container: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  statusIndicator: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    border: '2px solid white',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },
  tooltip: {
    position: 'absolute',
    bottom: '100%',
    backgroundColor: '#2d3748',
    color: 'white',
    padding: '0.3rem 0.6rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    marginBottom: '0.5rem',
    opacity: '0',
    transition: 'opacity 0.2s',
    pointerEvents: 'none',
    whiteSpace: 'nowrap'
  }
};

// Componente ApartmentStatus integrado
const ApartmentStatus = ({ apartment }: { apartment: Apartment }) => {
  const getStatusInfo = () => {
    switch (apartment.estado) {
      case '2': return { color: '#38a169', text: 'Completado' };
      case '1': return { color: '#3182ce', text: 'En progreso' };
      default: return { color: '#e2e8f0', text: 'No iniciado' };
    }
  };

  const status = getStatusInfo();

  return (
    <div style={apartmentStatusStyles.container}>
      <div 
        style={{ 
          ...apartmentStatusStyles.statusIndicator,
          backgroundColor: status.color
        }}
        onMouseEnter={(e) => {
          const tooltip = e.currentTarget.nextSibling as HTMLDivElement;
          tooltip.style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          const tooltip = e.currentTarget.nextSibling as HTMLDivElement;
          tooltip.style.opacity = '0';
        }}
      />
      <div style={apartmentStatusStyles.tooltip}>
        {apartment.consecutivo}: {status.text}
      </div>
    </div>
  );
};

interface FloorPlanProps {
  apartments: Apartment[];
  floor: string;
}

const FloorPlan: React.FC<FloorPlanProps> = ({ apartments, floor }) => {
  return (
    <div style={floorPlanStyles.container}>
      <h4 style={floorPlanStyles.title}>Plano del Piso {floor}</h4>
      <div style={floorPlanStyles.grid}>
        {apartments.map(apartment => (
          <div key={apartment.id} style={floorPlanStyles.apartmentContainer}>
            <ApartmentStatus apartment={apartment} />
            <span style={floorPlanStyles.apartmentNumber}>{apartment.consecutivo}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FloorPlan;