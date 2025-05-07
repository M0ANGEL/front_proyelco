/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  StopOutlined,
  FilePdfFilled,
  EditOutlined,
  SearchOutlined,
  FileExcelFilled,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Input,
  PaginationProps,
  Row,
  Space,
  Tooltip,
  Typography,
  notification,
} from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useState, useEffect } from "react";
import { DataType, Pagination, Props } from "./types";
import { Link, useLocation } from "react-router-dom";
import {
  getExcel,
  getListaOtrosDocumentos,
  getOtrosPdf,
} from "@/services/documentos/otrosAPI";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import dayjs from "dayjs";
import { KEY_BODEGA } from "@/config/api";
import { SearchBar } from "@/modules/common/components/FormDocuments/styled";
import fileDownload from "js-file-download";

const { Text } = Typography;
let timeout: ReturnType<typeof setTimeout> | null;

export const ListarDocumentos = ({ privilegios, tab }: Props) => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loaderTable, setLoaderTable] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [pagination, setPagination] = useState<Pagination>();
  const { getSessionVariable } = useSessionStorage();
  const [value, setValue] = useState<string>("");
  const location = useLocation();

  useEffect(() => {
    fetchDocumentos();
  }, []);

  const fetchDocumentos = (query = "", currentPage = 1) => {
    let estado = "";
    switch (tab) {
      case "abiertos":
      case "pendientes":
        estado = "1";
        break;
      case "cerrados":
        estado = "3";
        break;
      case "anulados":
        estado = "4";
        break;
    }

    const url_split = location.pathname.split("/");
    const codigo_documento =
      tab == "pendientes" ? "pte" : url_split[url_split.length - 1];
    getListaOtrosDocumentos(
      currentPage,
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
            consecutivo_docu_vinculado: item.documento_vinculado
              ? item.documento_vinculado.consecutivo
              : "",
            tercero: item.tercero
              ? `${item.tercero.nit} - ${item.tercero.razon_soc}`
              : "",
            bodega: item.bodega.bod_nombre,
            fecha: dayjs(item.created_at).format("YYYY-MM-DD HH:mm"),
            usuario: item.user.username,
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
      align: "center",
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
      render: (_, { key, tipo_documento_id }) => {
        return (
          <Space>
            {tab != "pendientes" ? (
              <>
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
              </>
            ) : null}
            {tab == "pendientes" ? (
              <Tooltip title="Pagar Préstamo">
                <Link to={`${location.pathname}/create/${key}`}>
                  <Button type="primary" size="small" key={key + "modificar"}>
                    Pagar
                  </Button>
                </Link>
              </Tooltip>
            ) : null}
            {privilegios?.modificar == "1" && tab == "abiertos" ? (
              <Tooltip title="Editar documento">
                <Link to={`${location.pathname}/edit/${key}`}>
                  <Button type="primary" size="small" key={key + "modificar"}>
                    <EditOutlined />
                  </Button>
                </Link>
              </Tooltip>
            ) : null}
            {privilegios?.anular == "1" && tab == "abiertos" ? (
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
        );
      },
      width: 70,
    },
  ];

  if (!["pendientes"].includes(tab)) {
    columns.splice(1, 0, {
      title: "Documento Vinculado",
      dataIndex: "consecutivo_docu_vinculado",
      key: "consecutivo_docu_vinculado",
      sorter: true,
      align: "center",
      width: 120,
    });
  }

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

  return (
    <>
      {contextHolder}
      <Row gutter={12}>
        <Col span={!["pendientes"].includes(tab) ? 18 : 24}>
          <SearchBar>
            <Input placeholder="Buscar" onChange={handleSearch} />
          </SearchBar>
        </Col>
        {!["pendientes"].includes(tab) ? (
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
        ) : null}

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
              showTotal: (total, range) => {
                return (
                  <>
                    <Text>
                      Mostrando {range[0]}-{range[1]} de {total} registros
                    </Text>
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
