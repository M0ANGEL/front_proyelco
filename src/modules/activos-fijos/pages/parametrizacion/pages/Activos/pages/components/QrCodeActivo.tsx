import { useEffect, useState } from 'react';
import { Card, Spin } from 'antd';
import { getActivos } from '@/services/activos/activosAPI';
import { Activos } from '@/services/types';

const VisualizarActivo = (idActivo: number) => {
    const [activo, setActivo] = useState<Activos>();
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivo = async () => {
      try {
        const response = await getActivos(idActivo); // Llama a tu método para obtener el activo
        setActivo(response.data.data);
      } catch (error) {
        console.error('Error al obtener el activo:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivo();
  }, [idActivo]);

  if (loading) {
    return <Spin />;
  }

  if (!activo) {
    return <p>No se encontró el activo</p>;
  }

  return (
    <Card title={`Información del Activo - ${activo.nombre}`}>
      <p><strong>Nombre:</strong> {activo.nombre}</p>
      <p><strong>Usuario Encargado:</strong> {activo.usuarios?.nombre}</p>
      <p><strong>Ubicación:</strong> {activo.localizacion}</p>
      {/* Aquí puedes añadir más información según los campos que necesites */}
    </Card>
  );
};

export default VisualizarActivo;
