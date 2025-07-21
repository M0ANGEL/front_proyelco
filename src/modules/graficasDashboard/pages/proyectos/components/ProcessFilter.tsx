// import React from 'react';

// interface Process {
//   id: string;
//   name: string;
// }

// interface ProcessFilterProps {
//   processes: Process[];
//   onSelect: (processId: string | null) => void;
// }

// const ProcessFilter: React.FC<ProcessFilterProps> = ({ processes, onSelect }) => {
//   return (
//     <div className="process-filter">
//       <label>Filtrar por proceso: </label>
//       <select onChange={(e) => onSelect(e.target.value || null)}>
//         <option value="">Todos los procesos</option>
//         {processes.map(process => (
//           <option key={process.id} value={process.id}>
//             {process.name}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// };

// export default ProcessFilter;

import React from 'react';

interface Process {
  id: string;
  name: string;
}

interface ProcessFilterProps {
  processes: Process[];
  onSelect: (processId: string | null) => void;
}

// Estilos para el componente
const filterStyles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    margin: '1.5rem 0',
    backgroundColor: '#ffffff',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
  },
  label: {
    fontSize: '0.95rem',
    fontWeight: '500',
    color: '#4a5568',
    whiteSpace: 'nowrap'
  },
  select: {
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    border: '1px solid #cbd5e0',
    backgroundColor: '#ffffff',
    color: '#2d3748',
    fontSize: '0.9rem',
    minWidth: '250px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: '#a0aec0'
    },
    '&:focus': {
      outline: 'none',
      borderColor: '#4299e1',
      boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.2)'
    }
  },
  option: {
    padding: '0.5rem'
  }
};

const ProcessFilter: React.FC<ProcessFilterProps> = ({ processes, onSelect }) => {
  return (
    <div style={filterStyles.container}>
      <label style={filterStyles.label}>Filtrar por proceso:</label>
      <select 
        style={filterStyles.select}
        onChange={(e) => onSelect(e.target.value || null)}
        defaultValue=""
      >
        <option value="" style={filterStyles.option}>
          Todos los procesos
        </option>
        {processes.map(process => (
          <option 
            key={process.id} 
            value={process.id}
            style={filterStyles.option}
          >
            {process.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProcessFilter;