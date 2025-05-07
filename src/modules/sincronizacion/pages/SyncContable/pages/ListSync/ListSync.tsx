/* eslint-disable react-hooks/exhaustive-deps */
import { KEY_EMPRESA } from "@/config/api";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import {
  validarAccesoDocumento,
} from "@/services/documentos/otrosAPI";
import { Privilegios, DocumentosCabecera } from "@/services/types";
import { Button, message, Tabs, Typography } from "antd";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ListarDocumentos } from "../../components";

const { Text } = Typography;

export const ListSync = () => {
  const [privilegios, setPrivilegios] = useState<Privilegios>();
  const [messageApi, contextHolder] = message.useMessage();
  const [documentos, setDocumentos] = useState<DocumentosCabecera[]>([]);
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
            <Link to={`${location.pathname}/create`}>
              <Button type="primary">Crear</Button>
            </Link>
        }
      >
          <Tabs
            items={[
              {
                key: "1",
                label: "Abiertos",
                children: (
                  <ListarDocumentos
                    privilegios={privilegios}
                    tab={"abiertos"}
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
