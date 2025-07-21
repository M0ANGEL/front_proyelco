// import { Project, ProjectDetailResponse } from '@/services/types';
// import React, { useState } from 'react';
// import TowerView from './TowerView';
// import ProcessFilter from './ProcessFilter';


// interface ProjectDetailProps {
//   project: Project;
//   detail: ProjectDetailResponse | null;
//   onBack: () => void;
// }

// const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, detail, onBack }) => {
//   const [selectedTower, setSelectedTower] = useState<string | null>(null);
//   const [selectedProcess, setSelectedProcess] = useState<string | null>(null);

//   if (!detail) {
//     return <div>Loading project details...</div>;
//   }

//   const towerIds = Object.keys(detail.data);
//   const processes = towerIds.length > 0 ? Object.keys(detail.data[towerIds[0]]) : [];

//   return (
//     <div className="project-detail">
//       <button className="back-button" onClick={onBack}>
//         Volver a proyectos
//       </button>
      
//       <h2>{project.descripcion_proyecto}</h2>
//       <div className="project-info">
//         <p><strong>Código:</strong> {project.codigo_proyecto}</p>
//         <p><strong>Cliente:</strong> {project.emp_nombre}</p>
//         <p><strong>Avance general:</strong> {project.avance}%</p>
//       </div>

//       <ProcessFilter 
//         processes={processes.map(pid => ({
//           id: pid,
//           name: detail.data[towerIds[0]][pid].nombre_proceso
//         }))} 
//         onSelect={setSelectedProcess}
//       />

//       <div className="towers-overview">
//         {towerIds.map(towerId => (
//           <div 
//             key={towerId} 
//             className={`tower-summary ${selectedTower === towerId ? 'selected' : ''}`}
//             onClick={() => setSelectedTower(towerId)}
//           >
//             <h3>Torre {detail.torreResumen[towerId].nombre_torre}</h3>
//             <p>Avance: {detail.torreResumen[towerId].porcentaje_avance}%</p>
//             <p>{detail.torreResumen[towerId].serial_avance}</p>
//           </div>
//         ))}
//       </div>

//       {selectedTower && (
//         <TowerView 
//           tower={detail.data[selectedTower]} 
//           towerSummary={detail.torreResumen[selectedTower]}
//           selectedProcess={selectedProcess}
//         />
//       )}
//     </div>
//   );
// };

// export default ProjectDetail;
import { Project, ProjectDetailResponse } from '@/services/types';
import React, { useState } from 'react';
import TowerView from './TowerView';
import ProcessFilter from './ProcessFilter';

interface ProjectDetailProps {
  project: Project;
  detail: ProjectDetailResponse | null;
  onBack: () => void;
}

// Estilos para el componente
const detailStyles = {
  container: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '2rem',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  backButton: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#2980b9',
      transform: 'translateY(-1px)'
    }
  },
  title: {
    fontSize: '1.8rem',
    color: '#2c3e50',
    margin: '0 0 1rem 0',
    fontWeight: '600'
  },
  projectInfo: {
    backgroundColor: '#f8fafc',
    padding: '1rem',
    borderRadius: '8px',
    margin: '1.5rem 0',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1rem'
  },
  infoItem: {
    margin: '0',
    fontSize: '0.95rem',
    color: '#4a5568'
  },
  infoStrong: {
    fontWeight: '600',
    color: '#2d3748'
  },
  towersOverview: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1.2rem',
    margin: '2rem 0'
  },
  towerSummary: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '1.2rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
  },
  selectedTower: {
    border: '2px solid #3498db',
    backgroundColor: '#f0f7ff',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  towerTitle: {
    fontSize: '1.1rem',
    color: '#2c3e50',
    margin: '0 0 0.5rem 0'
  },
  towerDetail: {
    fontSize: '0.9rem',
    color: '#4a5568',
    margin: '0.3rem 0'
  },
  loading: {
    textAlign: 'center',
    padding: '2rem',
    color: '#718096'
  }
};

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, detail, onBack }) => {
  const [selectedTower, setSelectedTower] = useState<string | null>(null);
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);

  if (!detail) {
    return <div style={detailStyles.loading}>Cargando detalles del proyecto...</div>;
  }

  const towerIds = Object.keys(detail.data);
  const processes = towerIds.length > 0 ? Object.keys(detail.data[towerIds[0]]) : [];

  return (
    <div style={detailStyles.container}>
      <button 
        style={detailStyles.backButton}
        onClick={onBack}
      >
        ← Volver a proyectos
      </button>
      
      <h2 style={detailStyles.title}>{project.descripcion_proyecto}</h2>
      
      <div style={detailStyles.projectInfo}>
        <p style={detailStyles.infoItem}>
          <span style={detailStyles.infoStrong}>Código:</span> {project.codigo_proyecto}
        </p>
        <p style={detailStyles.infoItem}>
          <span style={detailStyles.infoStrong}>Cliente:</span> {project.emp_nombre}
        </p>
        <p style={detailStyles.infoItem}>
          <span style={detailStyles.infoStrong}>Avance general:</span> {project.avance}%
        </p>
      </div>

      <ProcessFilter 
        processes={processes.map(pid => ({
          id: pid,
          name: detail.data[towerIds[0]][pid].nombre_proceso
        }))} 
        onSelect={setSelectedProcess}
      />

      <div style={detailStyles.towersOverview}>
        {towerIds.map(towerId => (
          <div 
            key={towerId} 
            style={{
              ...detailStyles.towerSummary,
              ...(selectedTower === towerId ? detailStyles.selectedTower : {})
            }}
            onClick={() => setSelectedTower(towerId)}
          >
            <h3 style={detailStyles.towerTitle}>
              Torre {detail.torreResumen[towerId].nombre_torre}
            </h3>
            <p style={detailStyles.towerDetail}>
              Avance: {detail.torreResumen[towerId].porcentaje_avance}%
            </p>
            <p style={detailStyles.towerDetail}>
              {detail.torreResumen[towerId].serial_avance}
            </p>
          </div>
        ))}
      </div>

      {selectedTower && (
        <TowerView 
          tower={detail.data[selectedTower]} 
          towerSummary={detail.torreResumen[selectedTower]}
          selectedProcess={selectedProcess}
        />
      )}
    </div>
  );
};

export default ProjectDetail;