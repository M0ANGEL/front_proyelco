/* eslint-disable react-hooks/exhaustive-deps */
import { TrasladosGenerados } from "../FormDistribucionCompra/types";
import generating from "@/modules/common/lotties/generating.json";
import { getTrasladosPdf } from "@/services/documentos/trsAPI";
import { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { Props } from "./types";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  LoadingOutlined,
  FilePdfFilled,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Modal,
  Row,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd";
import Lottie from "react-lottie";

const { Text } = Typography;

export const ModalGeneracionPDF = ({ open, setOpen, traslados }: Props) => {
  const [dataSource, setDataSource] = useState<TrasladosGenerados[]>([]);
  const [generateAll, setGenerateAll] = useState<boolean>(false);
  const [indexGlobal, setIndexGlobal] = useState<number>(0);
  const [closable, setClosable] = useState<boolean>(false);

  useEffect(() => {
    if (open && traslados.length > 0) {
      setDataSource(traslados);
      setIndexGlobal(0);
    }
  }, [open, traslados]);

  useEffect(() => {
    if (open) {
      let cantClose = true;
      dataSource.forEach((item) => {
        if (item.estado_pdf == "wait") {
          cantClose = false;
          return false;
        }
      });
      setClosable(cantClose);
    }
  }, [open, dataSource]);

  useEffect(() => {
    if (
      indexGlobal >= 0 &&
      indexGlobal < traslados.length &&
      open &&
      generateAll
    ) {
      generarPDF(traslados[indexGlobal].id, false);
    }
  }, [open, indexGlobal, generateAll]);

  const generarPDF = (id: number, is_individual: boolean) => {
    setDataSource(
      dataSource.map((element) => {
        if (element.id == id) {
          return { ...element, estado_pdf: "generating" };
        } else {
          return element;
        }
      })
    );
    getTrasladosPdf(id.toString()).then((data) => {
      const file = new Blob([data.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
      if (!is_individual) {
        const newIndexGlobal = indexGlobal + 1;
        setDataSource(
          dataSource.map((element, index) => {
            if (index == indexGlobal) {
              return { ...element, estado_pdf: "done" };
            } else {
              return element;
            }
          })
        );
        setIndexGlobal(newIndexGlobal);
      } else {
        setDataSource(
          dataSource.map((element) => {
            if (element.id == id) {
              return { ...element, estado_pdf: "done" };
            } else {
              return element;
            }
          })
        );
      }
    });
  };

  const columns: ColumnsType<TrasladosGenerados> = [
    {
      title: "Consecutivo",
      dataIndex: "consecutivo",
      key: "consecutivo",
      align: "center",
    },
    {
      title: "Estado Generación",
      dataIndex: "estado_pdf",
      key: "estado_pdf",
      align: "center",
      render(estado_pdf) {
        switch (estado_pdf) {
          case "generating":
            return <LoadingOutlined />;
          case "wait":
            return <ClockCircleOutlined />;
          case "done":
            return <CheckCircleOutlined />;
        }
      },
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      render(_, { id }) {
        return (
          <Tooltip title="Descargar Pdf">
            <Button size="small" onClick={() => generarPDF(id, true)}>
              <FilePdfFilled className="icono-rojo" />
            </Button>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <>
      <Modal
        open={open}
        footer={[]}
        keyboard={false}
        closable={closable}
        maskClosable={false}
        title={"Traslados Generados"}
        onCancel={() => {
          setOpen(false);
          setDataSource([]);
          setIndexGlobal(0);
          setGenerateAll(false);
          setClosable(false);
        }}
      >
        <Row gutter={[12, 12]}>
          <Col span={24}>
            <Space
              direction="vertical"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Lottie
                options={{
                  loop: true,
                  autoplay: true,
                  animationData: generating,
                }}
                height={200}
                width={200}
              />
              <Text>{closable ? "PDF generados!" : "Generando PDF..."}</Text>
            </Space>
          </Col>
          {!closable && indexGlobal == 0 ? (
            <Col span={24}>
              <Button
                block
                type="link"
                onClick={() => {
                  setGenerateAll(true);
                  setIndexGlobal(0);
                }}
              >
                Generar todos los PDF
              </Button>
            </Col>
          ) : null}
        </Row>
        <Table
          size="small"
          dataSource={dataSource}
          columns={columns}
          pagination={{ hideOnSinglePage: true, pageSize: 100 }}
        />
      </Modal>
    </>
  );
};
