import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Col, Collapse, Row, Space, Typography, Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { StyledCardGrid } from "./styles";

const { Panel } = Collapse;
const { Text } = Typography;

export const MenuMovimientosActivos = () => {
  const navigate = useNavigate();

  const traslados = [
    { id: 1, codigo: "MAEC", descripcion: "Movimientos Activos EQUIPO DE COMPUTO Y COMUNICACIÓN" },
    { id: 2, codigo: "MAA", descripcion: "Movimientos Activos MUEBLES Y ENSERES" },
    { id: 3, codigo: "MAV", descripcion: "Movimientos Activos EQUIPO DE TRANSPORTE" },
    { id: 4, codigo: "MAP", descripcion: "Movimientos Activos MAQUINA Y EQUIPO" },
    // { id: 5, codigo: "MAEI", descripcion: "Movimientos Activos Equipos Industrial" },


  ];

  return (
    <StyledCard title={"Movimientos Activos"}>
      <Collapse 
        accordion 
        expandIconPosition="end" 
        defaultActiveKey={["panel1"]} // Asegúrate de que esta clave esté aquí
      >
        <Panel style={{ width: "100%" }} header={"Movimientos"} key={"panel1"}>
          <Row gutter={[24, 24]}>
            {traslados.map((traslado) => (
              <Col xs={24} sm={6} key={traslado.id}>
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
                      icon={<PlusCircleOutlined style={{ fontSize: 24 }} />}
                      style={{ color: "#ffffff" }}
                    />
                  }
                >
                  <Space direction="horizontal" size={16}>
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
