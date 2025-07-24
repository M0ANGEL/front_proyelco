// import React from 'react';

// interface ProgressBarProps {
//   percentage: number;
// }

// const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => {
//   return (
//     <div className="progress-bar-container">
//       <div 
//         className="progress-bar" 
//         style={{ width: `${percentage}%` }}
//       />
//     </div>
//   );
// };

// export default ProgressBar;

import React from 'react';

interface ProgressBarProps {
  percentage: number;
  height?: number;
  showLabel?: boolean;
  color?: string;
}

// Estilos para la barra de progreso
const progressBarStyles = {
  container: {
    width: '100%',
    backgroundColor: '#edf2f7',
    borderRadius: '999px',
    overflow: 'hidden',
    margin: '0.5rem 0'
  },
  bar: {
    height: '100%',
    borderRadius: 'inherit',
    transition: 'width 0.4s ease, background-color 0.3s ease',
    position: 'relative' as const
  },
  label: {
    fontSize: '0.75rem',
    color: '#4a5568',
    marginTop: '0.25rem',
    textAlign: 'right' as const
  },
  innerLabel: {
    position: 'absolute' as const,
    right: '4px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'white',
    fontSize: '0.65rem',
    fontWeight: 'bold' as const,
    textShadow: '0 1px 1px rgba(0,0,0,0.3)'
  }
};

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  percentage, 
  height = 8, 
  showLabel = true,
  color = ''
}) => {
  // Determinar color basado en el porcentaje si no se especifica
  const getColor = () => {
    if (color) return color;
    return percentage > 70 ? '#38a169' : 
           percentage > 40 ? '#3182ce' : '#e53e3e';
  };

  return (
    <div>
      <div style={{ ...progressBarStyles.container, height: `${height}px` }}>
        <div 
          style={{ 
            ...progressBarStyles.bar,
            width: `${Math.min(100, Math.max(0, percentage))}%`,
            backgroundColor: getColor()
          }}
        >
          {percentage > 30 && (
            <span style={progressBarStyles.innerLabel}>
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      </div>
      
      {showLabel && (
        <div style={progressBarStyles.label}>
          Progreso: {percentage.toFixed(2)}%
        </div>
      )}
    </div>
  );
};

export default ProgressBar;