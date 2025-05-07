/* eslint-disable react-hooks/exhaustive-deps */
import { KEY_EMPRESA, KEY_ROL } from "@/config/api";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { validarAccesoDocumento } from "@/services/documentos/rqpAPI";
import { Privilegios } from "@/services/types";
import { Button, message, Space, Spin, Tabs, Typography } from "antd";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ListarDocumentos } from "../../components";

const { Text } = Typography;

export const ListDIS = () => {
  const [privilegios, setPrivilegios] = useState<Privilegios>();
  const [messageApi, contextHolder] = message.useMessage();
  const [loader, setLoader] = useState<boolean>(true);
  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const url_split = location.pathname.split("/");
    const codigo_documento = url_split[url_split.length - 1];
    if (codigo_documento) {
      validarAccesoDocumento(
        codigo_documento.toUpperCase(),
        getSessionVariable(KEY_EMPRESA)
      )
        .then(({ data: { data } }) => {
          if (data) {
            setPrivilegios(data);
          } else {
            messageApi.open({
              type: "error",
              content: "No tienes permisos para acceder a este documento!",
            });
            setTimeout(() => {
              navigate(-1);
            }, 1000);
          }
        })
        .finally(() => {
          setLoader(false);
        });
    }
  }, []);

  const tabs = [
    {
      key: "1",
      label: "Abiertos",
      children: <ListarDocumentos tab="abiertos" privilegios={privilegios} />,
    },
    {
      key: "3",
      label: "Cerrado",
      children: <ListarDocumentos tab="cerrados" privilegios={privilegios} />,
    },
    {
      key: "4",
      label: "Anulados",
      children: <ListarDocumentos tab="anulados" privilegios={privilegios} />,
    },
    {
      key: "0",
      label: "Auditoría",
      children: <ListarDocumentos tab="auditoria" privilegios={privilegios} />,
    },
  ];

  if (["regente", "administrador", "auditoria", "quimico", "regente_farmacia"].includes(user_rol)) {
    tabs.push({
      key: "5",
      label: "Domicilios",
      children: <ListarDocumentos tab="domicilios" privilegios={privilegios} />,
    });
  }

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
