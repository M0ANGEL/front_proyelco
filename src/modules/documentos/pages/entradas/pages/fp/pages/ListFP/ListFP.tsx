/* eslint-disable react-hooks/exhaustive-deps */
import { KEY_EMPRESA } from "@/config/api";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { validarAccesoDocumento } from "@/services/documentos/rqpAPI";
import {
  Privilegios,
} from "@/services/types";
import { message, Space, Spin, Tabs, TabsProps, Typography } from "antd";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ListarDocumentos } from "../../components";

const { Text } = Typography;

export const ListFP = () => {
  const { getSessionVariable } = useSessionStorage();
  const [privilegios, setPrivilegios] = useState<Privilegios>();
  const [messageApi, contextHolder] = message.useMessage();
  const [loader, setLoader] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

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
            navigate(-1);
          }, 1000);
        }
      });
    }
  }, []);

  const tabs: TabsProps["items"] = [
    {
      key: "1",
      label: "OC pendientes",
      children: (
        <ListarDocumentos
          tab="pendientes"
          privilegios={privilegios}
          setLoader={(value: boolean) => setLoader(value)}
        />
      ),
    },
    {
      key: "2",
      label: "Facturas ingresadas",
      children: (
        <ListarDocumentos
          tab="proceso"
          privilegios={privilegios}
          setLoader={(value: boolean) => setLoader(value)}
        />
      ),
    },
    {
      key: "3",
      label: "Facturas abiertas",
      children: (
        <ListarDocumentos
          tab="abiertos"
          privilegios={privilegios}
          setLoader={(value: boolean) => setLoader(value)}
        />
      ),
    },
    {
      key: "4",
      label: "Cerrado",
      children: (
        <ListarDocumentos
          tab="cerrados"
          privilegios={privilegios}
          setLoader={(value: boolean) => setLoader(value)}
        />
      ),
    },
    {
      key: "5",
      label: "Anulado",
      children: (
        <ListarDocumentos
          tab="anulados"
          privilegios={privilegios}
          setLoader={(value: boolean) => setLoader(value)}
        />
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <StyledCard
        title={<Text>{privilegios?.documento_info.descripcion}</Text>}
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
