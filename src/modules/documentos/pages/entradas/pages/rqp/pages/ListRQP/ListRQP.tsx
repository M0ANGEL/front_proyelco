/* eslint-disable react-hooks/exhaustive-deps */
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { validarAccesoDocumento } from "@/services/documentos/rqpAPI";
import { Button, message, Space, Spin, Tabs, Typography } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { KEY_EMPRESA, KEY_ROL } from "@/config/api";
import { ListarDocumentos } from "../../components";
import { Privilegios } from "@/services/types";
import { useState, useEffect } from "react";

const { Text } = Typography;

export const ListRQP = () => {
  const [privilegios, setPrivilegios] = useState<Privilegios>();
  const [messageApi, contextHolder] = message.useMessage();
  const [loader, setLoader] = useState<boolean>(false);
  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    {
      key: "0",
      label: ["administrador", "quimico", "cotizaciones"].includes(user_rol)
        ? "Pendientes por aprobar"
        : "Sin aprobar",
      children: (
        <ListarDocumentos
          privilegios={privilegios}
          tab={"abiertos"}
          setLoader={(value: boolean) => setLoader(value)}
          user_rol={user_rol}
        />
      ),
    },
    {
      key: "1",
      label: "Aprobadas",
      children: (
        <ListarDocumentos
          privilegios={privilegios}
          tab={"pendientes"}
          setLoader={(value: boolean) => setLoader(value)}
          user_rol={user_rol}
        />
      ),
    },
    {
      key: "2",
      label: "En proceso",
      children: (
        <ListarDocumentos
          privilegios={privilegios}
          tab={"proceso"}
          setLoader={(value: boolean) => setLoader(value)}
          user_rol={user_rol}
        />
      ),
    },
    {
      key: "3",
      label: "Cerrados",
      children: (
        <ListarDocumentos
          privilegios={privilegios}
          tab={"cerrados"}
          setLoader={(value: boolean) => setLoader(value)}
          user_rol={user_rol}
        />
      ),
    },
    {
      key: "4",
      label: "Anulados",
      children: (
        <ListarDocumentos
          privilegios={privilegios}
          tab={"anulados"}
          setLoader={(value: boolean) => setLoader(value)}
          user_rol={user_rol}
        />
      ),
    },
  ];

  useEffect(() => {
    const url_split = location.pathname.split("/");
    const codigo_documento = url_split[url_split.length - 1];
    if (codigo_documento) {
      validarAccesoDocumento(
        codigo_documento.toUpperCase(),
        getSessionVariable(KEY_EMPRESA)
      ).then(({ data: { data } }) => {
        if (data) {
          setPrivilegios(data);
        } else {
          messageApi.open({
            type: "error",
            content: "No tienes permisos para acceder a este documento!",
          });
          setTimeout(() => {
            navigate(`/${url_split.at(1)}`);
          }, 1000);
        }
      });
    }
  }, []);

  return (
    <>
      {contextHolder}
      <StyledCard
        title={<Text>{privilegios?.documento_info.descripcion}</Text>}
        extra={
          privilegios?.crear == "1" ? (
            <Link to={`${location.pathname}/create`}>
              <Button type="primary">Crear</Button>
            </Link>
          ) : (
            <></>
          )
        }
      >
        {!loader ? (
          <Tabs items={tabs} animated />
        ) : (
          <Space style={{ width: "100%", textAlign: "center" }}>
            <Spin size="large" />
          </Space>
        )}
      </StyledCard>
    </>
  );
};
