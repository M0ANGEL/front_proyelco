/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  SearchOutlined,
  EditOutlined,
  StopOutlined,
  FilePdfFilled,
  FileTextOutlined,
  FileExcelFilled,
} from "@ant-design/icons";
import {
  Button,
  Space,
  Tooltip,
  Typography,
  Input,
  notification,
  PaginationProps,
  Row,
  Col,
} from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useState, useEffect } from "react";
import { DataType, Pagination, Props } from "./types";
import { Link, useLocation } from "react-router-dom";
import { SearchBar } from "./styled";
import {
  getExcel,
  getListaOtrosDocumentos,
  getOtrosPdf,
} from "@/services/documentos/otrosAPI";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_BODEGA } from "@/config/api";
import dayjs from "dayjs";
import { ModalDocumentosVinculados } from "../ModalDocumentosVinculados/ModalDocumentosVinculados";
import { DocumentosCabecera } from "@/services/types";
import fileDownload from "js-file-download";

const { Text } = Typography;
let timeout: ReturnType<typeof setTimeout> | null;

export const ListarDocumentos = ({ privilegios, tab }: Props) => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [openModalPagos, setOpenModalPagos] = useState<boolean>(false);
  const [documentosVinculados, setDocumentosVinculados] = useState<
    DocumentosCabecera[]
  >([]);
  const [loaderTable, setLoaderTable] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [pagination, setPagination] = useState<Pagination>();
  const { getSessionVariable } = useSessionStorage();
  const [value, setValue] = useState<string>("");
  const location = useLocation();

  useEffect(() => {
    fetchDocumentos();
  }, []);

  const fetchDocumentos = (query = "", page = 1) => {
    let estado = "";
    switch (tab) {
      case "pendientes":
        estado = "1";
        break;
      case "abiertos":
        estado = "0";
        break;
      case "cerrados":
        estado = "3";
        break;
      case "anulados":
        estado = "4";
        break;
    }

    const url_split = location.pathname.split("/");
    const codigo_documento = url_split[url_split.length - 1];
    getListaOtrosDocumentos(
      page,
      getSessionVariable(KEY_BODEGA),
      estado,
      query,
      codigo_documento
    )
      .then(({ data: { data } }) => {
        setPagination(data);
        const documentos: DataType[] = data.data.map((item) => {
          return {
            key: item.id,
            consecutivo: item.consecutivo,
            tercero: item.tercero
              ? `${item.tercero.nit} - ${item.tercero.razon_soc}`
              : "",
            fecha: dayjs(item.created_at).format("YYYY-MM-DD HH:mm"),
            usuario: item.user.username,
            bodega: item.bodega.bod_nombre,
            documentos_vinculados: item.documentos_vinculados,
            tipo_documento_id: item.tipo_documento_id,
          };
        });
        setDataSource(documentos);
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
    }, 500);
  };

  const handlePdfClick = (key: React.Key) => {
    setLoaderTable(true);
    getOtrosPdf(key.toString())
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

  const generarExcel = (
    key: React.Key,
    tipo_documento_id = privilegios ? privilegios.id_tipoDocu : ""
  ) => {
    setLoaderTable(true);
    getExcel(key.toString(), getSessionVariable(KEY_BODEGA), tipo_documento_id)
      .then(({ data }) => {
        fileDownload(data, "PRESTAMOS.xlsx");
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
      title: "Consecutivo",
      dataIndex: "consecutivo",
      key: "consecutivo",
      sorter: true,
      align: "center",
      width: 120,
    },
    {
      title: "Tercero",
      dataIndex: "tercero",
      key: "tercero",
    },
    {
      title: "Bodega",
      dataIndex: "bodega",
      key: "bodega",
      align: "center",
      width: 150,
    },
    {
      title: "Fecha",
      dataIndex: "fecha",
      key: "fecha",
      align: "center",
      width: 150,
    },
    {
      title: "Usuario",
      dataIndex: "usuario",
      key: "usuario",
      align: "center",
      width: 100,
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      render: (_, { key, documentos_vinculados, tipo_documento_id }) => {
        return (
          <Space>
            <Tooltip title="Generar PDF">
              <Button size="small" onClick={() => handlePdfClick(key)}>
                <FilePdfFilled className="icono-rojo" />
              </Button>
            </Tooltip>
            <Tooltip title="Generar Excel">
              <Button
                size="small"
                key={key + "excel"}
                onClick={() => generarExcel(key, tipo_documento_id)}
              >
                <FileExcelFilled className="icono-verde" />
              </Button>
            </Tooltip>
            <Tooltip title="Ver documento">
              <Link to={`${location.pathname}/show/${key}`}>
                <Button key={key + "consultar"} size="small">
                  <SearchOutlined />
                </Button>
              </Link>
            </Tooltip>
            {privilegios?.modificar == "1" && tab == "pendientes" ? (
              <Tooltip title="Editar documento">
                <Link to={`${location.pathname}/edit/${key}`}>
                  <Button type="primary" size="small" key={key + "modificar"}>
                    <EditOutlined />
                  </Button>
                </Link>
              </Tooltip>
            ) : null}
            {privilegios?.anular == "1" && tab == "pendientes" ? (
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
            <Tooltip title="Ver Pagos">
              <Button
                key={key + "pagos"}
                size="small"
                onClick={() => {
                  setDocumentosVinculados(documentos_vinculados);
                  setOpenModalPagos(true);
                }}
                disabled={documentos_vinculados.length == 0}
              >
                <FileTextOutlined />
              </Button>
            </Tooltip>
          </Space>
        );
      },
      width: 70,
    },
  ];

  return (
    <>
      {contextHolder}
      <ModalDocumentosVinculados
        open={openModalPagos}
        setOpen={(value: boolean) => setOpenModalPagos(value)}
        documentos={documentosVinculados}
      />
      <Row gutter={12}>
        <Col span={18}>
          <SearchBar>
            <Input placeholder="Buscar" onChange={handleSearch} />
          </SearchBar>
        </Col>
        <Col span={6}>
          <Button
            type="dashed"
            icon={<FileExcelFilled className="icono-verde" />}
            block
            onClick={() => generarExcel(tab, privilegios?.id_tipoDocu)}
            disabled={dataSource.length == 0}
          >
            Descargar informe
          </Button>
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
              showTotal: () => {
                return (
                  <>
                    <Text>Total Registros: {pagination?.total}</Text>
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
