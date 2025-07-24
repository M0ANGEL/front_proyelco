// import { Project } from '@/services/types';
// import React from 'react';
// import ProgressBar from './ProgressBar';


// interface ProjectCardProps {
//   project: Project;
//   onClick: () => void;
// }

// const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
//   return (
//     <div className="project-card" onClick={onClick}>
//       <h3>{project.descripcion_proyecto}</h3>
//       <p><strong>Cliente:</strong> {project.emp_nombre}</p>
//       <p><strong>Tipo:</strong> {project.nombre_tipo}</p>
//       <p><strong>Torres:</strong> {project.torres}</p>
//       <p><strong>Pisos:</strong> {project.cant_pisos}</p>
//       <p><strong>APT:</strong> {project.apt}</p>
//       <div className="progress-container">
//         <span>Avance: {project.avance.toFixed(2)}%</span>
//         <ProgressBar percentage={project.avance} />
//       </div>
//     </div>
//   );
// };

// export default ProjectCard;

import { Project } from '@/services/types';
import React from 'react';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

// Estilos para la tarjeta de proyecto
const cardStyles = {
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '1.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    borderLeft: '4px solid #3498db',
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)'
    }
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '0.75rem',
    marginTop: '0'
  },
  detail: {
    color: '#4a5568',
    fontSize: '0.9rem',
    margin: '0.5rem 0',
    lineHeight: '1.4'
  },
  strong: {
    color: '#2d3748',
    fontWeight: '600'
  },
  progressContainer: {
    marginTop: '1.5rem',
    width: '100%'
  },
  progressLabel: {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.85rem',
    color: '#4a5568'
  }
};

// Estilos para la barra de progreso
const progressBarStyles = {
  container: {
    height: '8px',
    backgroundColor: '#edf2f7',
    borderRadius: '4px',
    overflow: 'hidden',
    marginTop: '0.25rem'
  },
  bar: {
    height: '100%',
    borderRadius: '4px',
    backgroundColor: '#3498db',
    transition: 'width 0.4s ease'
  }
};

// Componente ProgressBar integrado
const ProgressBar = ({ percentage }: { percentage: number }) => {
  return (
    <div style={progressBarStyles.container}>
      <div 
        style={{ 
          ...progressBarStyles.bar, 
          width: `${percentage}%`,
          backgroundColor: percentage > 70 ? '#38a169' : 
                         percentage > 40 ? '#3182ce' : '#e53e3e'
        }} 
      />
    </div>
  );
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <div style={cardStyles.card} onClick={onClick}>
      <h3 style={cardStyles.title}>{project.descripcion_proyecto}</h3>
      
      <p style={cardStyles.detail}>
        <span style={cardStyles.strong}>Cliente:</span> {project.emp_nombre}
      </p>
      
      <p style={cardStyles.detail}>
        <span style={cardStyles.strong}>Tipo:</span> {project.nombre_tipo}
      </p>
      
      <p style={cardStyles.detail}>
        <span style={cardStyles.strong}>Torres:</span> {project.torres} | 
        <span style={cardStyles.strong}> Pisos:</span> {project.cant_pisos} | 
        <span style={cardStyles.strong}> APT:</span> {project.apt}
      </p>
      
      <div style={cardStyles.progressContainer}>
        <span style={cardStyles.progressLabel}>
          Avance: {project.avance.toFixed(2)}%
        </span>
        <ProgressBar percentage={project.avance} />
      </div>
    </div>
  );
};

export default ProjectCard;