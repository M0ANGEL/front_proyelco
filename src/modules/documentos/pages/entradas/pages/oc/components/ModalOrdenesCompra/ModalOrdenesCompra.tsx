import {
  SearchOutlined,
  EditOutlined,
  StopOutlined,
  FilePdfFilled,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Modal,
  Popover,
  Row,
  Space,
  Tabs,
  Tooltip,
  Typography,
  notification,
} from "antd";
import { DataType, Props } from "./types";
import { useState, useEffect } from "react";
import Table, { ColumnsType } from "antd/es/table";
import { Link, useLocation } from "react-router-dom";
import { getPDF } from "@/services/documentos/ocAPI";

const { Text, Paragraph } = Typography;

export const ModalOrdenesCompra = ({
  open,
  setOpen,
  ordenes,
  rqpInfo,
  privilegios,
}: Props) => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loaderTable, setLoaderTable] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const location = useLocation();

  useEffect(() => {
    const data: DataType[] = ordenes?.map((item) => {
      return {
        key: item.id,
        bodega: `${item.bodega.prefijo} - ${item.bodega.bod_nombre}`,
        tercero: `${item.tercero.nit} - ${item.tercero.nombre}`,
        observacion: item.observacion,
        subtotal: `${item.subtotal}`,
        total: `${item.total}`,
        estado: item.estado,
        consecutivo: item.consecutivo,
        rqp_id: item.rqp_id,
      };
    });
    setLoaderTable(false);
    setDataSource(data);
  }, [ordenes]);

  const generarPDF = (key: React.Key) => {
    setLoaderTable(true);
    getPDF(key.toString())
      .then((data) => {
        const file = new Blob([data.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        notificationApi.open({
          type: "success",
          message: "Documento generado con exito!",
        });
        window.open(fileURL);
      })
      .catch(
        ({
          response,
          response: {
            data: { errors },
          },
        }) => {
          if (errors) {
            const errores: string[] = Object.values(errors);
            for (const error of errores) {
              notificationApi.open({
                type: "error",
                message: error,
              });
            }
          } else {
            notificationApi.open({
              type: "error",
              message: response.data.message,
            });
          }
        }
      )
      .finally(() => setLoaderTable(false));
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Código",
      dataIndex: "consecutivo",
      key: "consecutivo",
      sorter: (a, b) =>
        a.consecutivo.toString().localeCompare(b.consecutivo.toString()),
      align: "center",
      fixed: "left",
      width: 100,
    },
    {
      title: "Bodega",
      dataIndex: "bodega",
      key: "bodega",
      width: 120,
      sorter: (a, b) => a.bodega.localeCompare(b.bodega),
    },
    {
      title: "Tercero",
      dataIndex: "tercero",
      key: "tercero",
      width: 180,
      sorter: (a, b) => a.tercero.localeCompare(b.tercero),
    },
    {
      title: "Observación",
      dataIndex: "observacion",
      key: "observacion",
      sorter: (a, b) => a.observacion.localeCompare(b.observacion),
      render: (_, { observacion }) => {
        return (
          <Popover
            autoAdjustOverflow
            content={observacion}
            title="Observación"
            overlayStyle={{
              width: 500,
              border: "1px solid #d4d4d4",
              borderRadius: 10,
            }}
          >
            <Paragraph ellipsis={{ rows: 2, expandable: false }}>
              {observacion}
            </Paragraph>
          </Popover>
        );
      },
    },
    {
      title: "SubTotal",
      dataIndex: "subtotal",
      key: "subtotal",
      width: 100,
      align: "center",
      sorter: (a, b) => a.subtotal.localeCompare(b.subtotal),
      render: (_, record) => {
        return (
          <Text style={{ fontSize: 12 }}>
            $ {parseFloat(record.subtotal).toLocaleString("es-ES")}
          </Text>
        );
      },
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: 100,
      align: "center",
      sorter: (a, b) => a.total.localeCompare(b.total),
      render: (_, record) => {
        return (
          <Text style={{ fontSize: 12 }}>
            $ {parseFloat(record.total).toLocaleString("es-ES")}
          </Text>
        );
      },
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      width: 100,
      render: (_, { key, estado, rqp_id }) => {
        return (
          <>
            <Space>
              {privilegios?.consultar == "1" ? (
                <Tooltip title="Ver documento">
                  <Link to={`${location.pathname}/show/${key}`}>
                    <Button key={key + "consultar"} size="small">
                      <SearchOutlined />
                    </Button>
                  </Link>
                </Tooltip>
              ) : null}
              <Tooltip title="Generar PDF">
                <Button
                  size="small"
                  key={key + "pdf"}
                  onClick={() => generarPDF(key)}
                >
                  <FilePdfFilled className="icono-rojo" />
                </Button>
              </Tooltip>
              {privilegios?.modificar == "1" && ["1"].includes(estado) ? (
                <Tooltip title="Editar">
                  <Link
                    to={`${location.pathname}/edit/${key}/rqp_id/${rqp_id}`}
                  >
                    <Button type="primary" key={key + "editar"} size="small">
                      <EditOutlined />
                    </Button>
                  </Link>
                </Tooltip>
              ) : null}
              {privilegios?.anular == "1" && ["1"].includes(estado) ? (
                <Tooltip title="Anular documento">
                  <Link to={`${location.pathname}/anular/${key}`}>
                    <Button
                      danger
                      type="primary"
                      size="small"
                      key={key + "anular"}
                    >
                      <StopOutlined />
                    </Button>
                  </Link>
                </Tooltip>
              ) : null}
            </Space>
          </>
        );
      },
    },
  ];

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        footer={[
          <Button
            key={"btnCancelar"}
            type="primary"
            danger
            onClick={() => {
              setOpen(false);
              setDataSource([]);
            }}
          >
            Cerrar
          </Button>,
        ]}
        destroyOnClose
        maskClosable={false}
        closable={false}
        width={1200}
        style={{ top: 20 }}
        title={
          <Space direction="vertical">
            <Text type="secondary">
              Requisión: <Text>{rqpInfo?.key}</Text>
            </Text>
            <Text type="secondary">
              Bodega Solicitante: <Text>{rqpInfo?.bod_solicitante}</Text>
            </Text>
          </Space>
        }
      >
        <Row>
          <Col span={24}>
            <Tabs
              items={[
                {
                  key: "1",
                  label: "Pendientes",
                  children: (
                    <Row>
                      <Col span={24}>
                        <Table
                          size="small"
                          columns={columns}
                          dataSource={dataSource.filter(
                            (item) => item.estado == "1"
                          )}
                          loading={loaderTable}
                        />
                      </Col>
                    </Row>
                  ),
                },
                {
                  key: "2",
                  label: "En Proceso",
                  children: (
                    <Table
                      size="small"
                      columns={columns}
                      dataSource={dataSource.filter(
                        (item) => item.estado == "2"
                      )}
                      loading={loaderTable}
                    />
                  ),
                },
                {
                  key: "3",
                  label: "Cerrados",
                  children: (
                    <Table
                      size="small"
                      columns={columns}
                      dataSource={dataSource.filter(
                        (item) => item.estado == "3"
                      )}
                      loading={loaderTable}
                    />
                  ),
                },
                {
                  key: "4",
                  label: "Anulados",
                  children: (
                    <Table
                      size="small"
                      columns={columns}
                      dataSource={dataSource.filter(
                        (item) => item.estado == "4"
                      )}
                      loading={loaderTable}
                    />
                  ),
                },
              ]}
              animated
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};
