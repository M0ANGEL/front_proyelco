/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { KEY_EMPRESA } from "@/config/api";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { validarAccesoDocumento } from "@/services/documentos/ocAPI";
import { Privilegios } from "@/services/types";
import { Form, message, Tabs, Typography } from "antd";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ListarDocumentos } from "../../components";
import { CustomSegment } from "./styled";

const { Text } = Typography;

export const ListOC = () => {
  const { getSessionVariable } = useSessionStorage();
  const [privilegios, setPrivilegios] = useState<Privilegios>();
  const [messageApi, contextHolder] = message.useMessage();
  const [loader, setLoader] = useState<boolean>(false);
  const [selectedDoc, setSelectedDoc] = useState<string | number>("rqp");
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

  const handleChangeDoc = (value: string | number) => {
    setSelectedDoc(value);
  };

  return (
    <>
      {contextHolder}
      <StyledCard
        title={<Text>{privilegios?.documento_info.descripcion}</Text>}
      >
        <>
          <Form layout="vertical">
            <Form.Item label={"Documento:"} style={{ marginBottom: 0 }}>
              <CustomSegment
                options={[
                  { label: "Requisiones de Pedido", value: "rqp" },
                  { label: "Ordenes de Compra", value: "oc" },
                ]}
                value={selectedDoc}
                onChange={(value: any) => {
                  handleChangeDoc(value);
                }}
                disabled={loader}
              />
            </Form.Item>
          </Form>
          <Tabs
            items={[
              {
                key: "1",
                label: "Pendientes",
                children: (
                  <ListarDocumentos
                    selectedDoc={selectedDoc}
                    tab="pendientes"
                    privilegios={privilegios}
                    setLoader={(value: boolean) => setLoader(value)}
                  />
                ),
              },
              {
                key: "2",
                label: "En proceso",
                children: (
                  <ListarDocumentos
                    selectedDoc={selectedDoc}
                    tab="proceso"
                    privilegios={privilegios}
                    setLoader={(value: boolean) => setLoader(value)}
                  />
                ),
              },
              {
                key: "3",
                label: "Cerrado",
                children: (
                  <ListarDocumentos
                    selectedDoc={selectedDoc}
                    tab="cerrados"
                    privilegios={privilegios}
                    setLoader={(value: boolean) => setLoader(value)}
                  />
                ),
              },
              {
                key: "4",
                label: "Anulados",
                children: (
                  <ListarDocumentos
                    selectedDoc={selectedDoc}
                    tab="anulados"
                    privilegios={privilegios}
                    setLoader={(value: boolean) => setLoader(value)}
                  />
                ),
              },
            ]}
            animated
          />
        </>
      </StyledCard>
    </>
  );
};
