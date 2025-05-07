/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Col, Row, Space, Spin } from "antd";
import CountUp from "react-countup";
import { GiHandTruck } from "react-icons/gi";
import { FaRegCalendarXmark } from "react-icons/fa6";
import { StadisticTitle, StyledCardDashBoard, StyledStadistic } from "./styled";
import { useEffect, useState } from "react";
import { DashboardInfo } from "./types";
import { getStatistics } from "@/services/dashboard/statisticsAPI";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { LoadingOutlined } from "@ant-design/icons";
import { KEY_BODEGA, KEY_EMPRESA } from "@/config/api";
import { BsCapsulePill } from "react-icons/bs";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getTotalAlertas } from "@/services/gestion-humana/alertasContratosAPI";
import { KEY_ROL } from "@/config/api";
import { BsEmojiSunglassesFill } from "react-icons/bs";
import { MdWorkHistory } from "react-icons/md";
import { FaHospital } from "react-icons/fa";
import { IoDocumentAttach } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";

const cardsBgColors: Array<string> = [
  "#fc5d36",
  "#48b9ea",
  "#90c641",
  "#ffcd32",
  "#bd79e7",
];

export const DashboardPage = () => {
  const [cards, setCards] = useState<DashboardInfo[]>([]);
  const { getSessionVariable } = useSessionStorage(); 
  const user_rol = getSessionVariable(KEY_ROL);
  const navigate = useNavigate();

  const fetchTotalAlertas = () => {

    getTotalAlertas().then(({ data: { data } }) => {

      if (['gh_bienestar'].includes(user_rol)) {
        setCards([
          {
            title: "DOTACIÓN ANUAL",
            icon: <FaUsers />,
            value: data.totalEmpleadosPorDotacion,
            link: "/gestionhumana/dotaciones/empleados",
            permiso: true,
            bgColor: cardsBgColors[0],
          },
          {
            title: "DOTACIÓN PERIODO PRUEBA",
            icon: <MdWorkHistory />,
            value: data.totalPeriodoPruebaDotacion,
            link: "/gestionhumana/dotaciones/empleados",
            permiso: true,
            bgColor: cardsBgColors[1],
          },
          {
            title: "INCAPACIDADES SIN RADICAR",
            icon: <FaHospital />,
            value: data.totalIncapacidadesSinRadicar,
            link: "/gestionhumana/incapacidades",
            permiso: true,
            bgColor: cardsBgColors[2],
          },
          {
            title: "INCAPACIDADES SIN PAGAR",
            icon: <FaHospital />,
            value: data.totalIcapacidadesSinPagar,
            link: "/gestionhumana/incapacidades",
            permiso: true,
            bgColor: cardsBgColors[4],
          },
        ])
      } else {
        setCards([
          {
            title: "VACACIONES PENDIENTES",
            icon: <BsEmojiSunglassesFill />,
            value: data.totalVacaciones,
            link: "/gestionhumana/vacaciones",
            permiso: true,
            bgColor: cardsBgColors[0],
          },
          {
            title: "PERIODOS DE PRUEBA",
            icon: <MdWorkHistory />,
            value: data.totalPeriodosDeprueba,
            link: "/gestionhumana/empleados",
            permiso: true,
            bgColor: cardsBgColors[1],
          },
          {
            title: "CONTRATOS POR FINALIZAR",
            icon: <IoDocumentAttach />,
            value: data.totalContratosPorFianalizar,
            link: "/gestionhumana/empleados",
            permiso: ['gh_admin',].includes(user_rol),
            bgColor: cardsBgColors[3],
          },
          {
            title: "INCAPACIDADES SIN RADICAR",
            icon: <FaHospital />,
            value: data.totalIncapacidadesSinRadicar,
            link: "/gestionhumana/incapacidades",
            permiso: true,
            bgColor: cardsBgColors[2],
          },
          {
            title: "INCAPACIDADES SIN PAGAR",
            icon: <FaHospital />,
            value: data.totalIcapacidadesSinPagar,
            link: "/gestionhumana/incapacidades",
            permiso: true,
            bgColor: cardsBgColors[4],
          },
        ]);
      }
    });
  }
  
  useEffect(() => {

    if (['gh_admin', 'gh_auxiliar', 'gh_consulta', 'gh_bienestar'].includes(user_rol)) {
      fetchTotalAlertas();
    } else {
      getStatistics(
        getSessionVariable(KEY_BODEGA),
        getSessionVariable(KEY_EMPRESA)
      ).then(({ data: { data } }) => {
        setCards([
          {
            title: "VENCIMIENTOS",
            icon: <FaRegCalendarXmark />,
            value: data.productos,
            link: "/controldevencimientos/vencimientos",
            permiso: data.permisos.vencimientos,
            bgColor: cardsBgColors[0],
          },
          {
            title: "OC PENDIENTES",
            icon: <LiaFileInvoiceDollarSolid />,
            value: data.ordenes_compra,
            link: "/documentos/entradas/oc",
            permiso: data.permisos.orden_compra,
            bgColor: cardsBgColors[3],
          },
          {
            title: "PENDIENTES DISPENSACIÓN",
            icon: <BsCapsulePill />,
            value: data.dis_pendientes,
            link: "/documentos/salidas/pen",
            permiso: data.permisos.pendientes,
            bgColor: cardsBgColors[2],
          },
          {
            title: "TRASLADOS SIN ACEPTAR",
            icon: (
              <>
                <GiHandTruck />
                <span style={{ fontSize: 30 }}>
                  <FaArrowUp />
                </span>
              </>
            ),
            value: data.traslados_destino,
            link: "/documentos/traslados/trs",
            permiso: data.permisos.traslado_salida,
            bgColor: cardsBgColors[3],
          },
          {
            title: "TRASLADOS POR ACEPTAR",
            icon: (
              <>
                <GiHandTruck />
                <span style={{ fontSize: 30 }}>
                  <FaArrowDown />
                </span>
              </>
            ),
            value: data.traslados_origen,
            link: "/documentos/traslados/trp",
            permiso: data.permisos.traslado_pendiente,
            bgColor: cardsBgColors[1],
          },
        ]);
      });
    }
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
