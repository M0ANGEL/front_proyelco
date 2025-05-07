/* eslint-disable react-hooks/exhaustive-deps */
import { KEY_EMPRESA } from "@/config/api";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { validarAccesoDocumento } from "@/services/documentos/rqpAPI";
import { Privilegios } from "@/services/types";
import { Button, notification, Space, Spin, Tabs, Typography } from "antd";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ListarDocumentos } from "../../components";

const { Text } = Typography;

export const ListSCO = () => {
  const [privilegios, setPrivilegios] = useState<Privilegios>();
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loader, setLoader] = useState<boolean>(false);
  const { getSessionVariable } = useSessionStorage();
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
          notificationApi.open({
            type: "error",
            message: "No tienes permisos para acceder a este documento!",
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
          <Tabs
            items={[
              {
                key: "1",
                label: "Abiertos",
                children: (
                  <ListarDocumentos
                    privilegios={privilegios}
                    tab={"abiertos"}
                    setLoader={(value: boolean) => setLoader(value)}
                  />
                ),
              },
              {
                key: "2",
                label: "Cerrados",
                children: (
                  <ListarDocumentos
                    privilegios={privilegios}
                    tab={"cerrados"}
                    setLoader={(value: boolean) => setLoader(value)}
                  />
                ),
              },
              {
                key: "3",
                label: "Anulados",
                children: (
                  <ListarDocumentos
                    privilegios={privilegios}
                    tab={"anulados"}
                    setLoader={(value: boolean) => setLoader(value)}
                  />
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
