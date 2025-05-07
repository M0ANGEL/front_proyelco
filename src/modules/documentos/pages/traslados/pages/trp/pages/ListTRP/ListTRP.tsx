/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Col, Row } from "@/../node_modules/antd/es/index";
import { KEY_EMPRESA } from "@/config/api";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import {
  getExcelTRP,
  validarAccesoDocumento,
} from "@/services/documentos/trsAPI";
import { Privilegios } from "@/services/types";
import { message, Spin, Tabs, Typography } from "antd";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ListarDocumentos } from "../../components/ListarDocumentos/ListarDocumentos";
import fileDownload from "js-file-download";
import { FaFileDownload } from "react-icons/fa";
import { LoadingOutlined, InboxOutlined } from "@ant-design/icons";

const { Text } = Typography;

export const ListTRP = () => {
  const { getSessionVariable } = useSessionStorage();
  const [privilegios, setPrivilegios] = useState<Privilegios>();
  const [messageApi, contextHolder] = message.useMessage();
  const [loader, setLoader] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  const exportExcel = () => {
    setLoader(true);
    getExcelTRP()
      .then(({ data }) => {
        fileDownload(data, "Trsalidas_pendientes.xlsx");
      })
      .finally(() => {
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

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

      <Spin
        spinning={loader}
        indicator={<LoadingOutlined spin style={{ color: "white" }} />}
      >
        <StyledCard
          title={<Text><InboxOutlined />{" "+privilegios?.documento_info.descripcion}</Text>}
        >
          <Tabs
            items={[
              {
                key: "1",
                label: "Pendientes",
                children: (
                  <ListarDocumentos
                    // documentos={documentos.filter((item) => item.estado == "1")}
                    privilegios={privilegios}
                    tab={"pendientes"}
                  />
                ),
              },
            ]}
            animated
          />
          <Row>
            <Col className="text-right">
              <Spin
                spinning={loader}
                indicator={<LoadingOutlined spin style={{ color: "white" }} />}
              >
                <Button
                  type="primary"
                  style={{
                    width: "fit-content",
                    marginLeft: "auto",
                    display: "block",
                    background: "green",
                  }}
                  icon={<FaFileDownload />}
                  block
                  onClick={exportExcel}
                >
                  Exportar a Excel
                </Button>
              </Spin>
            </Col>
          </Row>
        </StyledCard>
      </Spin>
    </>
  );
};
