import { Apartment } from '@/services/types';

const ApartmentModal = ({ apt, onClose }: { apt: Apartment, onClose: () => void }) => {
  if (!apt) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      width: '400px',
      maxWidth: '90%'
    }}>
      <h3>Información del Apartamento</h3>
      <div style={{ marginBottom: '15px' }}>
        <p><strong>Consecutivo:</strong> {apt.consecutivo}</p>
        <p><strong>Torre:</strong> {apt.torre}</p>
        <p><strong>Piso:</strong> {apt.piso}</p>
        <p><strong>Apartamento:</strong> {apt.apartamento}</p>
        <p><strong>Estado:</strong> {getStatusText(apt.estado)}</p>
        <p><strong>Fecha habilitado:</strong> {apt.fecha_habilitado}</p>
      </div>
      <button 
        onClick={onClose}
        style={{
          padding: '8px 16px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Cerrar
      </button>
    </div>
  );
};

function getStatusText(status: string): string {
  switch(status) {
    case '2': return 'Completado';
    case '1': return 'En progreso';
    default: return 'No iniciado';
  }
}

export default ApartmentModal;