/* eslint-disable react-hooks/exhaustive-deps */
import { ListarActivosSalidas } from "../ListarActivosSalidas";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { TabsProps, Button, Tabs, Layout, Row, Col } from "antd";
import { PlusOutlined} from "@ant-design/icons";
import {useNavigate } from "react-router-dom";


export const ListTrasladosActivos = () => {
  // const [openModalAlertas, setOpenModalAlertas] = useState<boolean>(false);
  const navigate = useNavigate();




  const tabs: TabsProps["items"] = [
    {
      key: "pendiente",
      label: "Pendientes",
      children: (
        <ListarActivosSalidas tab={"pendientes"} />
      ),
    },
    {
      key: "cerrado",
      label: "Cerrado",
      children: <ListarActivosSalidas tab={"cerrado"} />,
    },
    {
      key: "anulado",
      label: "Anulados",
      children: <ListarActivosSalidas tab={"anulados"} />,
    },
  ];



  return (
    <>
    <Layout>
    <StyledCard title="Traslado Activos">
    <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>

    <Col xs={24} sm={12} md={8}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("crear")} 
            >
              Crear Traslado Activo
            </Button>
          </Col>

          <Tabs items={tabs} animated />

    
    </Row> 
    </StyledCard>
    </Layout>
    </>
  );
};
