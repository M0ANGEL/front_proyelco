/* eslint-disable react-hooks/exhaustive-deps */
import { KEY_EMPRESA } from "@/config/api";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { getDocumentos } from "@/services/documentos/otrosAPI";
import {
  validarAccesoDocumento,
} from "@/services/documentos/rqpAPI";
import { IDocumentos, Privilegios } from "@/services/types";
import { Button, message, Space, Spin, Tabs, Typography } from "antd";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ListarDocumentos } from "../../components/ListarDocumentos/ListarDocumentos";



const { Text } = Typography;

export const ListPAT = () => {
  const { getSessionVariable } = useSessionStorage();
  const [documentosDis, setDocumentosDis] = useState<IDocumentos[]>([]);
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
          // console.log("docudata_", data)
          if (data) {
            setPrivilegios(data); // revisa los privilegios que tenga el usuario sobre el documento
            getDocumentos("13").then(( { data }) => {
              // Se recorren los documentos para hallar la cantidad total de la Requisicion de Pedido y la cantidad total
              // ingresada en las ORDENES DE COMPRA con el fin de mostrar una alerta de cantidades restantes
              console.log('List pat', data)
              setDocumentosDis(data);
            });
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
                label: "Pendientes",
                children: (
                  <ListarDocumentos
                    documentos={documentosDis.filter( // envia el documento de dispensaciones por estado 1
                      (item) => item.estado == "1"
                    )}
                    tab="pendientes" // pestana de informacion en la tabla
                    privilegios={privilegios} // privilegios de la funcion de arriba
                  />
                ),
              },
              {
                key: "2",
                label: "Abiertos",
                children: (
                  <ListarDocumentos
                    documentos={documentosDis.filter( // envia el documento de dispensaciones por estado 1
                      (item) => item.estado == "0"
                    )}
                    tab="abiertos" // pestana de informacion en la tabla
                    privilegios={privilegios} // privilegios de la funcion de arriba
                  />
                ),
              },
              {
                key: "3",
                label: "Cerrado",
                children: (
                  <ListarDocumentos
                    documentos={documentosDis.filter(
                      (item) => item.estado == "3"
                    )}
                    tab="cerrado"
                    privilegios={privilegios}
                  />
                ),
              },
              {
                key: "4",
                label: "Anulados",
                children: (
                  <ListarDocumentos
                    documentos={documentosDis.filter(
                      (item) => item.estado == "4"
                    )}
                    tab="anulados"
                    privilegios={privilegios}
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
