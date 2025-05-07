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
  const { getSessionVariable } = useSessionStorage();
  const rol = getSessionVariable(KEY_ROL);

  const navigate = useNavigate();

  const traslados = [
    { id: 1, codigo: "TAS", descripcion: "Traslado de Salida" },
    { id: 2, codigo: "TAP", descripcion: "Traslados Pendientes" },
    { id: 3, codigo: "TAE", descripcion: "Traslados de Entrada" },
    { id: 4, codigo: "TPG", descripcion: "Traslados Pendientes por aprobar (GERENCIA)" },
    { id: 5, codigo: "TPAFA", descripcion: "Traslados Pendientes por aprobar (ACTIVOS FIJOS ADMIN)" }
  ];

  // Filtrar los traslados según el rol del usuario
  const trasladosFiltrados = traslados.filter((traslado) => {
    if (rol === 'gerencia') {
      return ['TAS', 'TAP', 'TAE', 'TPG'].includes(traslado.codigo);
    }
    if (rol === 'af-admin') {
      return ['TAS', 'TAP', 'TAE', 'TPAFA'].includes(traslado.codigo);
    }
    if (rol === 'administrador'){
      return ['TAS','TAP', 'TAE', 'TPG', 'TPAFA'].includes(traslado.codigo)
    }
    return ['TAP'].includes(traslado.codigo);
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
