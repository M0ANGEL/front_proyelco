/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Col, Row, Space, Spin } from "antd";
import CountUp from "react-countup";
import { FaRegCalendarXmark } from "react-icons/fa6";
import { StadisticTitle, StyledCardDashBoard, StyledStadistic } from "./styled";
import { useEffect, useState } from "react";
import { DashboardInfo } from "./types";
import { infoCartDash } from "@/services/dashboard/statisticsAPI";
import { LoadingOutlined } from "@ant-design/icons";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { useNavigate } from "react-router-dom";
import { AiOutlineTeam, AiTwotoneHome } from "react-icons/ai";

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

  useEffect(() => {
    infoCartDash().then(({ data: { data } }) => {
      setCards([
        {
          title: "PROYECTOS CREADOS",
          icon: <AiTwotoneHome />,
          value: data.proyectosActivos,
          link: "/controldevencimientos/vencimientos",
          // permiso: data.permisos.vencimientos,
          bgColor: cardsBgColors[0],
        },
        {
          title: "PROYECTOS INACTIVOS",
          icon: <AiTwotoneHome />,
          value: data.proyectosInactivos,
          link: "/documentos/entradas/oc",
          // permiso: data.permisos.orden_compra,
          bgColor: cardsBgColors[1],
        },
        {
          title: "PROYECTOS TERMINADOS",
          icon: <AiTwotoneHome />,
          value: data.proyectosTerminados,
          link: "/documentos/entradas/oc",
          // permiso: data.permisos.orden_compra,
          bgColor: cardsBgColors[2],
        },
        {
          title: "CLIENTES ACTIVOS",
          icon: <AiOutlineTeam />,
          value: data.clientesActivos,
          link: "/documentos/entradas/oc",
          // permiso: data.permisos.orden_compra,
          bgColor: cardsBgColors[3],
        },
        {
          title: "CLIENTES INACTIVOS",
          icon: <AiOutlineTeam />,
          value: data.clientesInactivos,
          link: "/documentos/entradas/oc",
          // permiso: data.permisos.orden_compra,
          bgColor: cardsBgColors[4],
        },
      ]);
    });
  }, []);

  const goTo = (link: string, value: number, permiso: boolean) => {
    if (link && value > 0 && permiso) {
      navigate(link);
    }
  };

  return (
    <>
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
    </>
  );
};
