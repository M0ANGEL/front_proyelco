/* eslint-disable react-hooks/exhaustive-deps */
import Table, { ColumnsType } from "antd/es/table";
import { DataType, Pagination, Props } from "./types";
import { EditOutlined, SearchOutlined, StopOutlined,FilePdfFilled } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import {
  Button,
  Col,
  Input,
  PaginationProps,
  Popover,
  Row,
  Space,
  Tooltip,
  Typography,
  notification,
} from "antd";
import { KEY_BODEGA } from "@/config/api";
import dayjs from "dayjs";
import { getPDF, getListaOtrDoc } from "@/services/documentos/otrosAPI";
import { SearchBar } from "./styled";

const { Paragraph, Text } = Typography;
let timeout: ReturnType<typeof setTimeout> | null;

export const ListarDocumentos = ({ privilegios, tab }: Props) => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [pagination, setPagination] = useState<Pagination | undefined>();
  const [loaderTable, setLoaderTable] = useState<boolean>(true);
  const location = useLocation();
  const { getSessionVariable } = useSessionStorage();
  const [value, setValue] = useState<string>("");

  const generarPDF = (keyd: string, key: React.Key) => {
    getPDF(keyd.toString(), key.toString()).then((data) => {
      const file = new Blob([data.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    });
  };

  useEffect(() => {
    if (privilegios) {
      fetchDocumentos();
    }
  }, [privilegios]);

  const fetchDocumentos = (query = "", page = 1) => {
    let estado = "";
    const tipo_documento = privilegios?.documento_info.codigo;
    switch (tab) {
      case "abiertos":
        estado = "0";
        break;
      case "cerrados":
        estado = "3";
        break;
      case "anulados":
        estado = "4";
        break;
      case "pendientes":
        estado = "1";
        break;
    }
    getListaOtrDoc(
      page,
      getSessionVariable(KEY_BODEGA),
      estado,
      query,
      tipo_documento
    )
      .then(({ data: { data } }) => {
        setPagination(data);
        const documentos: DataType[] = data.data.map((item) => {
          return {
            key: item.id,
            bodega: item.bodega.bod_nombre,
            fecha: dayjs(item.created_at).format("DD-MM-YYYY HH:mm"),
            consecutivo: item.consecutivo,
            observacion: item.observacion,
            tipo_documento: item.tipo_documento_id,
            estado: item.estado,
            motivos:item.motivos.descripcion,

          };
        });
        setDataSource(documentos);
        setLoaderTable(false);
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
                duration: 4,
              });
            }
          } else {
            notificationApi.open({
              type: "error",
              message: response.data.message,
              duration: 4,
            });
          }
        }
      )
      .finally(() => {
        setLoaderTable(false);
      });
  };

  const handleChangePagination: PaginationProps["onChange"] = (page) => {
    setLoaderTable(true);
    fetchDocumentos(value, page);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setValue(value);

    setLoaderTable(true);
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => {
      fetchDocumentos(value);
      setLoaderTable(false);
    }, 500);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Fecha Creación",
      dataIndex: "fecha",
      key: "fecha",
      sorter: (a, b) => a.fecha.localeCompare(b.fecha),
      width: 180,
      align: "center",
    },
    {
      title: "Consecutivo",
      dataIndex: "consecutivo",
      key: "consecutivo",
      sorter: true,
      align: "center",
      fixed: "left",
      width: 120,
    },
    {
      title: "Bodega solicitante",
      dataIndex: "bodega",
      key: "bodega",
      align: "center",
      sorter: (a, b) => a.bodega.localeCompare(b.bodega),
    },
    {
      title: "Observación",
      dataIndex: "observacion",
      key: "observacion",
      sorter: (a, b) => a.observacion.localeCompare(b.observacion),
      width: 700,
      render(_, { observacion,motivos }) {
        return (
          <Popover
            autoAdjustOverflow
            content={observacion ==null ? motivos:observacion}
            title="Observación"
            overlayStyle={{
              width: 500,
              border: "1px solid #d4d4d4",
              borderRadius: 5,
            }}
            placement="top"
          >
            <Paragraph ellipsis={{ rows: 2, expandable: false }}>
            {observacion ==null ? motivos:observacion}
            </Paragraph>
          </Popover>
        );
      },
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      fixed: "right",
      render: (_, record: { key: React.Key ,tipo_documento:string}) => {
        return (
          <Space>
            {privilegios?.consultar == "1" ? (
              <Tooltip title="Ver documento">
                <Link to={`${location.pathname}/show/${record.key}`}>
                  <Button key={record.key + "consultar"} size="small">
                    <SearchOutlined />
                  </Button>
                </Link>
              </Tooltip>
            ) : null}
            {(privilegios?.modificar == "1" && tab == "pendientes") ||
            tab == "abiertos" ? (
              <Tooltip title="Editar documento">
                <Link to={`${location.pathname}/edit/${record.key}`}>
                  <Button
                    type="primary"
                    size="small"
                    key={record.key + "modificar"}
                  >
                    <EditOutlined />
                  </Button>
                </Link>
              </Tooltip>
            ) : null}
            <Tooltip title="Generar PDF">
              <Button
                size="small"
                key={record.key + "pdf"}
                onClick={() => generarPDF(record.tipo_documento, record.key)}
              >
                <FilePdfFilled className="icono-rojo" />
              </Button>
            </Tooltip>
            {(privilegios?.anular == "1" && tab == "pendientes") ||
            tab == "abiertos" ? (
              <Tooltip title="Anular documento">
                <Link to={`${location.pathname}/anular/${record.key}`}>
                  <Button
                    danger
                    type="primary"
                    size="small"
                    key={record.key + "anular"}
                  >
                    <StopOutlined />
                  </Button>
                </Link>
              </Tooltip>
            ) : null}
          </Space>
        );
      },
      width: 70,
    },
  ];

  return (
    <>
    {contextHolder}
    <Row gutter={12}>
      <Col span={24}>
        <SearchBar>
          <Input placeholder="Buscar" onChange={handleSearch} />
        </SearchBar>
      </Col>
      <Col span={24}>
        <Table
          bordered
          rowKey={(record) => record.key}
          size="small"
          columns={columns}
          dataSource={dataSource}
          loading={loaderTable}
          pagination={{
            total: pagination?.total,
            pageSize: pagination?.per_page,
            simple: false,
            onChange: handleChangePagination,
            hideOnSinglePage: true,
            showTotal: (total: number) => {
              return (
                <>
                  <Text>Total Registros: {total}</Text>
                </>
              );
            },
          }}
        />
      </Col>
    </Row>
  </>
  );
};
