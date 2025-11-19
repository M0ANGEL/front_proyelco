
// export default Dashboard;
import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Space, Spin, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AiFillBank, AiOutlineTeam, AiTwotoneHome } from 'react-icons/ai';
import CountUp from 'react-countup';

import { dashboardService } from '../../../services/dashboard.service';
import { DashboardInfo } from '../../../types/dashboard.types';
import useSessionStorage from '../../../hooks/useSessionStorage';
import { StyledCardDashBoard, StyledStadistic, StadisticTitle } from '../components/styled';
import LoadingAnimation from '../../../components/ui/LoadingAnimation';
import { KEY_ROL } from '@/config/api';

const { Title } = Typography;

const cardsBgColors: string[] = [
  "#fc5d36",
  "#48b9ea", 
  "#90c641",
  "#ffcd32",
  "#7ead1c",
];

const Dashboard: React.FC = () => {
  const [cards, setCards] = useState<DashboardInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { getSessionVariable } = useSessionStorage();

  const user_rol = getSessionVariable(KEY_ROL) || 'Administrador';

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await dashboardService.getDashboardStats();
      
      let cardsArray: DashboardInfo[] = [];

      switch (user_rol) {
        case "Encargado Obras":
          cardsArray = [
            {
              title: "PROYECTOS ASIGNADOS",
              icon: <AiTwotoneHome />,
              value: data.proyectosActivos,
              link: "/proyectos/gestion-encargado-obra",
              permiso: true,
              bgColor: cardsBgColors[0],
            },
            {
              title: "ACTIVOS POR ACEPTAR",
              icon: <AiFillBank />,
              value: data.activos_pendinetes,
              link: "/activosfijos/traslados-activos/apt",
              permiso: true,
              bgColor: cardsBgColors[0],
            },
          ];
          break;
          
        case "Ingeniero Obra":
          cardsArray = [
            {
              title: "PROYECTOS ASIGNADOS",
              icon: <AiTwotoneHome />,
              value: data.proyectosActivos,
              link: "/proyectos/gestion-proyectos",
              permiso: true,
              bgColor: cardsBgColors[0],
            },
            {
              title: "ACTIVOS POR ACEPTAR",
              icon: <AiFillBank />,
              value: data.activos_pendinetes,
              link: "/activosfijos/traslados-activos/apt",
              permiso: true,
              bgColor: cardsBgColors[0],
            },
          ];
          break;

        case "Directora Proyectos":
          cardsArray = [
            {
              title: "PROYECTOS ACTIVOS",
              icon: <AiTwotoneHome />,
              value: data.proyectosActivos,
              link: "/proyectos/administrar-proyectos",
              permiso: true,
              bgColor: cardsBgColors[0],
            },
            {
              title: "PROYECTOS INACTIVOS",
              icon: <AiTwotoneHome />,
              value: data.proyectosInactivos,
              link: "/proyectos/administrar-proyectos",
              permiso: true,
              bgColor: cardsBgColors[1],
            },
            {
              title: "CLIENTES ACTIVOS",
              icon: <AiOutlineTeam />,
              value: data.clientesActivos,
              link: "/clientes/administrar-clientes",
              permiso: true,
              bgColor: cardsBgColors[3],
            },
            {
              title: "CLIENTES INACTIVOS",
              icon: <AiOutlineTeam />,
              value: data.clientesInactivos,
              link: "/clientes/administrar-clientes",
              permiso: true,
              bgColor: cardsBgColors[4],
            },
            {
              title: "ACTIVOS POR ACEPTAR",
              icon: <AiFillBank />,
              value: data.activos_pendinetes,
              link: "/activosfijos/traslados-activos/apt",
              permiso: true,
              bgColor: cardsBgColors[0],
            },
          ];
          break;

        case "Activos":
          cardsArray = [
            {
              title: "ACTIVOS POR ACEPTAR",
              icon: <AiFillBank />,
              value: data.activos_pendinetes,
              link: "/activosfijos/traslados-activos/apt",
              permiso: true,
              bgColor: cardsBgColors[0],
            },
          ];
          break;

        case "Administrativo":
          cardsArray = [
            {
              title: "ACTIVOS POR ACEPTAR",
              icon: <AiFillBank />,
              value: data.activos_pendinetes,
              link: "/activosfijos/traslados-activos/apt",
              permiso: true,
              bgColor: cardsBgColors[0],
            },
          ];
          break;

        case "Administrador":
          cardsArray = [
            {
              title: "PROYECTOS ACTIVOS",
              icon: <AiTwotoneHome />,
              value: data.proyectosActivos,
              link: "/proyectos/administrar-proyectos",
              permiso: true,
              bgColor: cardsBgColors[0],
            },
            {
              title: "PROYECTOS INACTIVOS",
              icon: <AiTwotoneHome />,
              value: data.proyectosInactivos,
              link: "/proyectos/administrar-proyectos",
              permiso: true,
              bgColor: cardsBgColors[1],
            },
            {
              title: "CLIENTES ACTIVOS",
              icon: <AiOutlineTeam />,
              value: data.clientesActivos,
              link: "/clientes/administrar-clientes",
              permiso: true,
              bgColor: cardsBgColors[3],
            },
            {
              title: "CLIENTES INACTIVOS",
              icon: <AiOutlineTeam />,
              value: data.clientesInactivos,
              link: "/clientes/administrar-clientes",
              permiso: true,
              bgColor: cardsBgColors[4],
            },
            {
              title: "ACTIVOS POR ACEPTAR",
              icon: <AiFillBank />,
              value: data.activos_pendinetes,
              link: "/activosfijos/traslados-activos/apt",
              permiso: true,
              bgColor: cardsBgColors[0],
            },
          ];
          break;
        default:
          cardsArray = [
            {
              title: "ACTIVOS POR ACEPTAR",
              icon: <AiFillBank />,
              value: data.activos_pendinetes,
              link: "/activosfijos/traslados-activos/apt",
              permiso: true,
              bgColor: cardsBgColors[0],
            },
          ];
          break;
      }

      setCards(cardsArray);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const goTo = (link: string, value: number, permiso: boolean) => {
    if (link && value > 0 && permiso) {
      navigate(link);
    }
  };

  if (error) {
    return (
      <div>
        <Title style={{marginLeft: "20px"}} level={4}>Dashboard Principal</Title>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Error: {error}</p>
          <button onClick={loadDashboardData}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Title style={{marginLeft: "20px"}} level={4}>Dashboard Principal</Title>
      
      <StyledCardDashBoard>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Space direction="vertical" size="large">
              <Spin size="large" indicator={<LoadingOutlined spin />} />
              <div>Cargando estadísticas...</div>
            </Space>
          </div>
        ) : (
          <>
            <Row justify={"start"} gutter={[16, 16]} style={{ marginInline: 12 }}>
              {cards.map(
                ({ title, icon, value, bgColor, link, permiso }, index) => (
                  <Col
                    xs={24}
                    md={index >= 2 ? 8 : 12}
                    lg={index <= 2 ? 8 : 12}
                    xl={index === 2 ? 4 : 5}
                    key={`Col-${index}`}
                  >
                    <Card
                      bordered={false}
                      style={{
                        backgroundColor: bgColor,
                        cursor: link && value > 0 && permiso ? "pointer" : "auto",
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      }}
                      key={`Card-${index}`}
                      onClick={() => goTo(link, value, permiso)}
                    >
                      <StyledStadistic
                        title={<StadisticTitle>{title}</StadisticTitle>}
                        value={value}
                        formatter={(value: any) => <CountUp end={value} />}
                        prefix={icon}
                        key={`Stats-${index}`}
                      />
                    </Card>
                  </Col>
                )
              )}
            </Row>

            {/* Animación debajo de las cartas */}
            <div style={{ marginTop: '30px', textAlign: 'center' }}>
              <LoadingAnimation width={300} height={250} />
            </div>
          </>
        )}
      </StyledCardDashBoard>
    </div>
  );
};

export default Dashboard;