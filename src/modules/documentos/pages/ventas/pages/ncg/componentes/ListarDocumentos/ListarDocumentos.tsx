/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  // FilePdfFilled,
  StopOutlined,
  SearchOutlined,
  EditOutlined,
  FileExcelFilled,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Input,
  notification,
  PaginationProps,
  Row,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import Table, { ColumnsType } from "antd/es/table";
import React, { useState, useEffect } from "react";
import { DataType, Pagination, Props } from "./types";
import { Link, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_BODEGA } from "@/config/api";
import { SearchBar } from "./styled";
import fileDownload from "js-file-download";
import { getExcel, getListaPagNCE } from "@/services/documentos/nceAPI";

const { Text } = Typography;

export const ListarDocumentos = ({ privilegios, tab, setLoader }: Props) => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loaderTable, setLoaderTable] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [pagination, setPagination] = useState<Pagination>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentPaginate, setCurrentPaginate] = useState<number>(10);
  const [searchInput, setSearchInput] = useState<string>("");
  const { getSessionVariable } = useSessionStorage();

  const location = useLocation();

  useEffect(() => {
    fetchDocumentos();
  }, []);

  useEffect(() => {
    setLoaderTable(true);
    fetchDocumentos(searchInput, currentPage, currentPaginate);
  }, [currentPage, currentPaginate, searchInput]);

  const generarExcel = (key: React.Key) => {
    setLoaderTable(true);
    getExcel(key.toString())
      .then(({ data }) => {
        fileDownload(data, "NOTA CREDITO DISPENSACION.xlsx");
        notificationApi.open({
          type: "success",
          message: "Documento generado con exito!",
        });
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

  const fetchDocumentos = (query = "", page = 1, paginate = 10) => {
    let estado = 1;
    switch (tab) {
      case "abiertos":
        estado = 1;
        break;
      case "cerrados":
        estado = 4;
        break;
      case "anulados":
        estado = 5;
        break;
    }
    getListaPagNCE(
      page,
      getSessionVariable(KEY_BODEGA),
      estado,
      query,
      "NCG",
      paginate
    )
      .then(({ data: { data } }) => {
        setPagination(data);
        const documentos: DataType[] = data.data.map((item) => {
          let estado_dian = "";
          if ([null, ""].includes(item.status_code)) {
            estado_dian = "Pendiente";
          } else if (["99"].includes(item.status_code)) {
            estado_dian = "Rechazado";
          } else {
            estado_dian = "Emitido";
          }
          return {
            key: item.id,
            numero_factura: item.fve_cabecera.numero_fve,
            bodega: item.bodega.bod_nombre,
            usuario: item.usuario.username,
            cliente: `${item.convenio.tercero.nit} - ${item.convenio.tercero.razon_soc}`,
            fecha: dayjs(item.created_at).format("DD-MM-YYYY HH:mm"),
            numero_nota: item.numero_nota_credito,
            consecutivo: item.consecutivo,
            observacion: item.observacion,
            total: item.total.toString(),
            cufe: item.cufe,
            estado_dian,
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
        setLoader(false);
      });
  };

  const handleChangePagination: PaginationProps["onChange"] = (
    page,
    paginate
  ) => {
    setLoaderTable(true);
    setCurrentPage(page);
    setCurrentPaginate(paginate);
    fetchDocumentos(searchInput, page, paginate);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Fecha Creación",
      dataIndex: "fecha",
      key: "fecha",
      width: 150,
      align: "center",
    },
    {
      title: "Consecutivo",
      dataIndex: "consecutivo",
      key: "consecutivo",
      align: "center",
      width: 120,
    },
    {
      title: "Numero Nota Crédito",
      dataIndex: "numero_nota",
      key: "numero_nota",
      align: "center",
      width: 120,
    },
    {
      title: "Numero Factura",
      dataIndex: "numero_factura",
      key: "numero_factura",
      align: "center",
      width: 120,
    },
    {
      title: "Cliente",
      dataIndex: "cliente",
      key: "cliente",
      width: 300,
    },
    {
      title: "Valor",
      dataIndex: "total",
      key: "total",
      render(_, { total }) {
        return <>$ {parseFloat(total).toLocaleString("es-CO")}</>;
      },
      width: 200,
      align: "center",
    },
    {
      title: "Usuario",
      dataIndex: "usuario",
      key: "usuario",
      align: "center",
      width: 130,
    },
    {
      title: "Estado DIAN",
      dataIndex: "estado_dian",
      key: "estado_dian",
      align: "center",
      render(value, { cufe }) {
        let color = "";
        switch (value) {
          case "Pendiente":
            color = "orange";
            break;
          case "Rechazado":
            color = "error";
            break;
          case "Emitido":
            color = "success";
            break;
        }
        return (
          <Tooltip title={`CUFE: ${cufe}`}>
            <Tag color={color}>{value}</Tag>
          </Tooltip>
        );
      },
      width: 120,
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      fixed: "right",
      render: (_, { key, cufe }) => {
        return (
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
            <Tooltip title="Generar Excel">
              <Button
                size="small"
                key={key + "excel"}
                onClick={() => generarExcel(key)}
              >
                <FileExcelFilled className="icono-verde" />
              </Button>
            </Tooltip>
            {privilegios?.modificar == "1" &&
            ["abiertos"].includes(tab) &&
            ["", null].includes(cufe) ? (
              <Tooltip title="Editar documento">
                <Link to={`${location.pathname}/edit/${key}`}>
                  <Button type="primary" key={key + "modificar"} size="small">
                    <EditOutlined />
                  </Button>
                </Link>
              </Tooltip>
            ) : null}
            {privilegios?.anular == "1" &&
            tab == "abiertos" &&
            ["", null].includes(cufe) ? (
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
      width: 120,
    },
  ];

  const rowClassName = ({ estado_dian }: DataType) => {
    let clase = "";
    switch (estado_dian) {
      case "Pendiente":
        clase = "orange-row";
        break;
      case "Rechazado":
        clase = "red-row";
        break;
      case "Emitido":
        clase = "green-row";
        break;
    }
    return clase;
  };

  return (
    <>
      {contextHolder}
      <Row gutter={12}>
        <Col span={18}>
          <SearchBar>
            <Input
              placeholder="Buscar"
              onPressEnter={(event) => {
                const {
                  target: { value },
                }: any = event;
                setCurrentPage(1);
                setSearchInput(value);
              }}
            />
          </SearchBar>
        </Col>
        <Col span={6}>
          <Button
            type="dashed"
            icon={<FileExcelFilled className="icono-verde" />}
            block
            onClick={() => generarExcel(tab)}
            disabled={dataSource.length == 0}
          >
            Descargar informe
          </Button>
        </Col>
        <Col span={24}>
          <Table
            bordered
            rowKey={(record) => record.key}
            rowClassName={rowClassName}
            size="small"
            columns={columns}
            dataSource={dataSource}
            loading={loaderTable}
            scroll={{ x: 800 }}
            pagination={{
              total: pagination?.total,
              current: currentPage,
              pageSize: currentPaginate,
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
