/* eslint-disable react-hooks/exhaustive-deps */
import { KEY_EMPRESA } from "@/config/api";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { validarAccesoDocumento } from "@/services/documentos/trsAPI";
import { Privilegios } from "@/services/types";
import { message, Tabs, Typography } from "antd";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ListarDocumentos } from "../../components/ListarDocumentos/ListarDocumentos";
import { ImportOutlined } from "@ant-design/icons";

const { Text } = Typography;

export const ListTRE = () => {
  const { getSessionVariable } = useSessionStorage();
  const [privilegios, setPrivilegios] = useState<Privilegios>();
  const [messageApi, contextHolder] = message.useMessage();
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
        title={<Text><ImportOutlined />{" "+privilegios?.documento_info.descripcion}</Text>}
      >
        <Tabs
          items={[
            {
              key: "0",
              label: "Aceptados",
              children: (
                <ListarDocumentos
                  privilegios={privilegios}
                  tab={"aceptados"}
                />
              ),
            },
            {
              key: "1",
              label: "Cerrados",
              children: (
                <ListarDocumentos
                  privilegios={privilegios}
                  tab={"cerrado"}
                />
              ),
            },
            {
              key: "2",
              label: "Anulados",
              children: (
                <ListarDocumentos
                  privilegios={privilegios}
                  tab={"anulados"}
                />
              ),
            },
          ]}
          animated
        />
      </StyledCard>
    </>
  );
};
