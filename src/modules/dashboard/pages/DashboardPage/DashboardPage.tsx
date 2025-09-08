/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Col, Row, Space, Spin } from "antd";
import CountUp from "react-countup";
import { StadisticTitle, StyledCardDashBoard, StyledStadistic } from "./styled";
import { useEffect, useState } from "react";
import { DashboardInfo } from "./types";
import { infoCartDash } from "@/services/dashboard/statisticsAPI";
import { LoadingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { AiFillBank, AiOutlineTeam, AiTwotoneHome } from "react-icons/ai";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_ROL } from "@/config/api";

const cardsBgColors: Array<string> = [
  "#fc5d36",
  "#48b9ea",
  "#90c641",
  "#ffcd32",
  "#7ead1c",
];

export const DashboardPage = () => {
  const [cards, setCards] = useState<DashboardInfo[]>([]);
  const navigate = useNavigate();
  const { getSessionVariable } = useSessionStorage();

  const user_rol = getSessionVariable(KEY_ROL);

  useEffect(() => {
    infoCartDash().then(({ data: { data } }) => {
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

        case "Administrador":
          cardsArray = [
            {
              title: "PROYECTOS CREADOS",
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
          
          break;
      }

      setCards(cardsArray);
    });
  }, []);

  const goTo = (link: string, value: number, permiso: boolean) => {
    if (link && value > 0 && permiso) {
      navigate(link);
    }
  };

  return (
    <StyledCardDashBoard>
      {cards.length === 0 ? (
        <Space style={{ width: "100%", textAlign: "center" }}>
          <Spin size="large" indicator={<LoadingOutlined spin />} />
        </Space>
      ) : (
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
      )}
    </StyledCardDashBoard>
  );
};
