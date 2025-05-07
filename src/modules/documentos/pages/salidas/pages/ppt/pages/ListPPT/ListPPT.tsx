/* eslint-disable react-hooks/exhaustive-deps */
import { KEY_EMPRESA } from "@/config/api";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Privilegios } from "@/services/types";
import { message, Space, Spin, Tabs, Typography } from "antd";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ListarDocumentos } from "../../components/ListarDocumentos/ListarDocumentos";
import { validarAccesoDocumento } from "@/services/documentos/otrosAPI";

const { Text } = Typography;

export const ListPPT = () => {
  const { getSessionVariable } = useSessionStorage();

  const [privilegios, setPrivilegios] = useState<Privilegios>();
  const [messageApi, contextHolder] = message.useMessage();
  const [loader, setLoader] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const url_split = location.pathname.split("/");
    const codigo_documento = url_split[url_split.length - 1];
    if (codigo_documento) {
      validarAccesoDocumento(
        codigo_documento.toUpperCase(),
        getSessionVariable(KEY_EMPRESA) // valida si el usuario tiene permiso para el documento
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

  return (
    <>
      {contextHolder}
      <StyledCard title={<Text>Pago de Préstamo</Text>}>
        {!loader ? (
          <Tabs
            items={[
              {
                key: "1",
                label: "Préstamos por pagar",
                children: (
                  <ListarDocumentos
                    tab="pendientes"
                    privilegios={privilegios}
                  />
                ),
              },
              {
                key: "2",
                label: "Abiertos",
                children: (
                  <ListarDocumentos tab="abiertos" privilegios={privilegios} />
                ),
              },
              {
                key: "3",
                label: "Cerrados",
                children: (
                  <ListarDocumentos tab="cerrados" privilegios={privilegios} />
                ),
              },
              {
                key: "4",
                label: "Anulados",
                children: (
                  <ListarDocumentos tab="anulados" privilegios={privilegios} />
                ),
              },
            ]}
            animated
          />
        ) : (
          <Space style={{ width: "100%", textAlign: "center" }}>
            <Spin size="large" />
          </Space>
        )}
      </StyledCard>
    </>
  );
};
