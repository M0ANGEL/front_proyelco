import { useParams } from "react-router-dom";
import { Card, Typography, Tag } from "antd";

const { Title, Text } = Typography;

export const ShowProyeccion = () => {
  const { codigo_proyecto } = useParams<{ codigo_proyecto: string }>();

  // //cargo de infromacion de proyeccion
  //   getAmcliente(id).then(({ data }) => {
  //         setCategoria(data);
  //         setLoaderSave(false);
  //       });

  return (
    <div style={{ padding: '20px' }}>
      <Card>
        <Title level={2}>Detalles de la Proyección</Title>
        
        <div style={{ marginTop: '20px' }}>
          <Text strong>Código del Proyecto: </Text>
          <Tag color="blue" style={{ fontSize: '16px', padding: '8px' }}>
            {codigo_proyecto}
          </Tag>
        </div>

        <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#f0f8ff', borderRadius: '6px' }}>
          <Text>
            Estás viendo los detalles del proyecto con código: <strong>{codigo_proyecto}</strong>
          </Text>
        </div>
      </Card>
    </div>
  );
};