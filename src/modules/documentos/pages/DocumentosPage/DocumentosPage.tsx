/* eslint-disable react-hooks/exhaustive-deps */
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import {
  Button,
  Col,
  Collapse,
  Row,
  Skeleton,
  Space,
  Typography,
} from "antd";
import { fetchUserDocuments } from "@/services/auth/authAPI";
import { getGrupos } from "@/services/maestras/gruposAPI";
import { GrupoDocumentos, UserDocumentos } from "./types";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { StyledCardGrid } from "./styled";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_EMPRESA } from "@/config/api";

const { Panel } = Collapse;
const { Text } = Typography;

export const DocumentosPage = () => {
  const [documentos, setDocumentos] = useState<UserDocumentos[]>([]);
  const [grupos, setGrupos] = useState<GrupoDocumentos[]>([]);
  const [loader, setLoader] = useState<boolean>(true);
  const { getSessionVariable } = useSessionStorage();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocumentos();
  }, []);

  useEffect(() => {
    if (documentos.length > 0) {
      getGrupos().then(({ data }) => {
        const gruposData = data.map((item) => {
          const filterDocumentos = documentos.filter(
            (documento) =>
              documento.id_grupo == item.id.toString() &&
              documento.id_empresa === getSessionVariable(KEY_EMPRESA) &&
              documento.estado === "1"
          );
          return {
            desc: item.nombre,
            documentos: filterDocumentos.length > 0 ? filterDocumentos : [],
          };
        });
        console.log(gruposData)
        setGrupos(gruposData);
        setLoader(false);
      });
    }
  }, [documentos]);

  const fetchDocumentos = () => {
    fetchUserDocuments().then(({ data: { data } }) => {
      setDocumentos(data.tipos_documentos);
    });
  };
  return (
    <>
      <StyledCard title={"Lista de documentos"}>
        {!loader ? (
          <Collapse accordion expandIconPosition="end" defaultActiveKey={0}>
            {grupos.map((grupo, index) => {
              if (grupo.documentos && grupo.documentos.length > 0) {
                return (
                  <Panel
                    style={{ width: "100%" }}
                    header={grupo.desc}
                    key={"panel" + index}
                  >
                    <Row gutter={[24, 24]}>
                      {grupo.documentos?.map((documento) => {
                        return (
                          <Col xs={24} sm={6} key={documento.id}>
                            <StyledCardGrid
                              hoverable
                              title={<Text>{documento.codigo}</Text>}
                              size="small"
                              key={"card" + documento.id}
                              onClick={() => {
                                navigate(
                                  `${grupo.desc.toLowerCase()}/${documento.codigo.toLowerCase()}`
                                );
                                // console.log(documento.descripcion);
                              }}
                              extra={
                                <Button
                                  type="text"
                                  icon={
                                    <PlusCircleOutlined
                                      style={{ fontSize: 24 }}
                                    />
                                  }
                                  style={{ color: "#ffffff" }}
                                />
                              }
                            >
                              <Space direction="horizontal" size={16}>
                                <Text style={{ color: "#ffffff" }}>
                                  {documento.descripcion}
                                </Text>
                              </Space>
                            </StyledCardGrid>
                          </Col>
                        );
                      })}
                    </Row>
                  </Panel>
                );
              }
            })}
          </Collapse>
        ) : (
          <Space style={{ width: "100%", textAlign: "center" }}>
            <Skeleton active />
          </Space>
        )}
      </StyledCard>
    </>
  );
};
