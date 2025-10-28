import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Col, Collapse, Row, Space, Typography, Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { StyledCardGrid } from "./styled";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_ROL } from "@/config/api";


const { Panel } = Collapse;
const { Text } = Typography;

export const TrasladosActivosPage = () => {
  const navigate = useNavigate();
  const { getSessionVariable } = useSessionStorage();
  const rol = getSessionVariable(KEY_ROL);

  const traslados = [
    { id: 1, codigo: "RST", descripcion: "Realizar Traslado de mis activos" },
    { id: 2, codigo: "APT", descripcion: "Aceptar Traslado" },
    { id: 3, codigo: "SLA", descripcion: "Solicitar Activo" },
    { id: 4, codigo: "TRM", descripcion: "Traslados Logistica" },
    { id: 5, codigo: "TRSDM", descripcion: "Traslados Admin" },
    // { id: 6, codigo: "TRSDPM", descripcion: "Traslados Pendiente Admin" },
  ];

  // Filtrar los traslados según el rol del usuario
  const trasladosFiltrados = traslados.filter((traslado) => {
    if (rol === 'Administrador' || rol === 'Admin Activos' || rol === 'Directora Proyectos'||  rol === 'Administrador TI' || rol === 'Activos'){
      return ['RST','APT', 'SLA', 'TRSDM','TRM'].includes(traslado.codigo)
    }
    if (rol === 'Logistica'){
      return ['TRM','RST', 'APT','SLA'].includes(traslado.codigo)
    }
    return ['RST', 'APT','SLA'].includes(traslado.codigo);
  });

  return (
    <StyledCard title={"Traslados"}>
      <Collapse 
        accordion 
        expandIconPosition="end" 
        defaultActiveKey={["panel1"]} 
      >
        <Panel style={{ width: "100%" }} header={"Traslados"} key={"panel1"}>
          <Row gutter={[24, 24]}>
            {trasladosFiltrados.map((traslado) => (
              <Col xs={24} sm={8} key={traslado.id}>
                <StyledCardGrid
                  hoverable
                  title={<Text>{traslado.codigo}</Text>}
                  size="small"
                  key={"card" + traslado.id}
                  onClick={() => {
                    navigate(
                      `${traslado.codigo.toLowerCase()}`
                    );
                  }}
                  extra={
                    <Button
                      type="text"
                      icon={<PlusCircleOutlined style={{ fontSize: 20 }} />}
                      style={{ color: "#ffffff" }}
                    />
                  }
                >
                  <Space direction="horizontal" size={20}>
                    <Text style={{ color: "#ffffff" }}>
                      {traslado.descripcion}
                    </Text>
                  </Space>
                </StyledCardGrid>
              </Col>
            ))}
          </Row>
        </Panel>
      </Collapse>
    </StyledCard>
  );
  
};
