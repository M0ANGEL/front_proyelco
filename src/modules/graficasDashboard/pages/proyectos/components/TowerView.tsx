// import { Tower, TowerSummary } from '@/services/types';
// import React, { useState } from 'react';
// import FloorPlan from './FloorPlan';
// import ApartmentStatus from './ApartmentStatus';


// interface TowerViewProps {
//   tower: Tower;
//   towerSummary: TowerSummary;
//   selectedProcess: string | null;
// }

// const TowerView: React.FC<TowerViewProps> = ({ tower, towerSummary, selectedProcess }) => {
//   const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
//   const [currentFloor, setCurrentFloor] = useState<string>('1');

//   const processToShow = selectedProcess 
//     ? tower[selectedProcess] 
//     : Object.values(tower)[0];

//   const floorIds = Object.keys(processToShow.pisos);

//   return (
//     <div className="tower-view">
//       <div className="view-controls">
//         <button onClick={() => setViewMode('2d')}>Vista 2D</button>
//         <button onClick={() => setViewMode('3d')}>Vista 3D</button>
//       </div>

//       <h3>Torre {towerSummary.nombre_torre}</h3>
//       <p>Proceso: {processToShow.nombre_proceso}</p>
//       <p>Avance: {processToShow.porcentaje_avance}%</p>

//       <div className="floor-selector">
//         {floorIds.map(floorId => (
//           <button 
//             key={floorId} 
//             className={currentFloor === floorId ? 'active' : ''}
//             onClick={() => setCurrentFloor(floorId)}
//           >
//             Piso {floorId}
//           </button>
//         ))}
//       </div>

//       {viewMode === '2d' ? (
//         <FloorPlan 
//           apartments={processToShow.pisos[currentFloor]} 
//           floor={currentFloor}
//         />
//       ) : (
//         <div className="tower-3d">
//           {/* Aquí iría el componente 3D */}
//           <p>Vista 3D de la torre (implementación con Three.js u otra librería)</p>
//           <div className="apartment-statuses">
//             {processToShow.pisos[currentFloor].map(apt => (
//               <ApartmentStatus key={apt.id} apartment={apt} />
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TowerView;

import { Tower, TowerSummary } from '@/services/types';
import React, { useState } from 'react';
import FloorPlan from './FloorPlan';
import Tower3DView from './Tower3DView';

// Estilos para el componente
const towerViewStyles = {
  container: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '1.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    marginTop: '1.5rem'
  },
  header: {
    marginBottom: '1.5rem'
  },
  title: {
    fontSize: '1.5rem',
    color: '#2d3748',
    margin: '0 0 0.5rem 0',
    fontWeight: '600'
  },
  subtitle: {
    color: '#4a5568',
    margin: '0.25rem 0',
    fontSize: '0.95rem'
  },
  viewControls: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1rem'
  },
  viewButton: {
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    border: '1px solid #cbd5e0',
    backgroundColor: '#ffffff',
    color: '#4a5568',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontWeight: '500',
    '&:hover': {
      backgroundColor: '#f7fafc'
    }
  },
  activeViewButton: {
    backgroundColor: '#4299e1',
    color: 'white',
    borderColor: '#4299e1',
    '&:hover': {
      backgroundColor: '#3182ce'
    }
  },
  floorSelector: {
    display: 'flex',
    gap: '0.5rem',
    margin: '1.5rem 0',
    flexWrap: 'wrap'
  },
  floorButton: {
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    color: '#4a5568',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minWidth: '60px',
    '&:hover': {
      backgroundColor: '#f7fafc'
    }
  },
  activeFloorButton: {
    backgroundColor: '#4299e1',
    color: 'white',
    borderColor: '#4299e1'
  },
  threeDView: {
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    padding: '2rem',
    textAlign: 'center',
    marginTop: '1rem',
    color: '#718096'
  },
  apartmentStatuses: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginTop: '1rem',
    flexWrap: 'wrap'
  }
};

const TowerView: React.FC<TowerViewProps> = ({ tower, towerSummary, selectedProcess }) => {
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [currentFloor, setCurrentFloor] = useState<string>('1');

  const processToShow = selectedProcess 
    ? tower[selectedProcess] 
    : Object.values(tower)[0];

  const floorIds = Object.keys(processToShow.pisos);

  return (
    <div style={towerViewStyles.container}>
      <div style={towerViewStyles.header}>
        <h3 style={towerViewStyles.title}>Torre {towerSummary.nombre_torre}</h3>
        <p style={towerViewStyles.subtitle}>
          Proceso: {processToShow.nombre_proceso}
        </p>
        <p style={towerViewStyles.subtitle}>
          Avance: <strong>{processToShow.porcentaje_avance}%</strong> | 
          Apartamentos: {processToShow.apartamentos_realizados}/{processToShow.total_apartamentos}
        </p>
      </div>

      <div style={towerViewStyles.viewControls}>
        <button
          style={{
            ...towerViewStyles.viewButton,
            ...(viewMode === '2d' ? towerViewStyles.activeViewButton : {})
          }}
          onClick={() => setViewMode('2d')}
        >
          Vista 2D
        </button>
        <button
          style={{
            ...towerViewStyles.viewButton,
            ...(viewMode === '3d' ? towerViewStyles.activeViewButton : {})
          }}
          onClick={() => setViewMode('3d')}
        >
          Vista 3D
        </button>
      </div>

      <div style={towerViewStyles.floorSelector}>
        {floorIds.map(floorId => (
          <button
            key={floorId}
            style={{
              ...towerViewStyles.floorButton,
              ...(currentFloor === floorId ? towerViewStyles.activeFloorButton : {})
            }}
            onClick={() => setCurrentFloor(floorId)}
          >
            Piso {floorId}
          </button>
        ))}
      </div>

     {viewMode === '2d' ? (
  <FloorPlan apartments={processToShow.pisos[currentFloor]} floor={currentFloor} />
) : (
  <Tower3DView 
    apartments={processToShow.pisos[currentFloor]}
    floors={processToShow.pisos}
    currentFloor={currentFloor}
  />
)}
    </div>
  );
};

export default TowerView;