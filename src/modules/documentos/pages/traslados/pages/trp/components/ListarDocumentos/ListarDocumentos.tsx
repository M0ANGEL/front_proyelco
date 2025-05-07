/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { CheckOutlined, FilePdfFilled } from "@ant-design/icons";
import { getListaTRP } from "@/services/documentos/trsAPI";
import { getTrpPdf } from "@/services/documentos/trsAPI";
import { DataType, Pagination, Props } from "./types";
import { Link, useLocation } from "react-router-dom";
import Table, { ColumnsType } from "antd/es/table";
import { useState, useEffect } from "react";
import { KEY_BODEGA } from "@/config/api";
import { SearchBar } from "./styled";
import dayjs from "dayjs";
import {
  PaginationProps,
  notification,
  Typography,
  Tooltip,
  Button,
  Input,
  Space,
  Col,
  Row,
} from "antd";

let timeout: ReturnType<typeof setTimeout> | null;
const { Text } = Typography;

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

  const fetchDocumentos = (query = "", page = 1) => {
    let estado = "";
    switch (tab) {
      case "pendientes":
        estado = "1";
        break;
      case "cerrado":
        estado = "3";
        break;
      case "anulados":
        estado = "4";
        break;
    }
    getListaTRP(page, getSessionVariable(KEY_BODEGA), estado, query)
      .then(({ data: { data } }) => {
        setPagination(data);
        const documentos: DataType[] = data.data.map((item) => {
          return {
            key: item.id,
            trs_id: item.trs_id,
            bod_origen: item.bod_origen.bod_nombre,
            bod_destino: item.bod_destino.bod_nombre,
            user: item.user.username,
            fecha: dayjs(item.created_at).format("DD-MM-YYYY HH:mm"),
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

  const handleChangePagination: PaginationProps["onChange"] = (page) => {
    setLoaderTable(true);
    fetchDocumentos(value, page);
  };

  const handlePdfClick = async (id: any) => {
    try {
      const response = await getTrpPdf(id);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      // Abrir el PDF en una nueva pestaña
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error mostrando el PDF:", error);
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Consecutivo",
      dataIndex: "trs_id",
      key: "trs_id",
      sorter: true,
      align: "center",
      fixed: "left",
      width: 120,
    },
    {
      title: "Bodega Origen",
      dataIndex: "bod_origen",
      key: "bod_origen",
      sorter: (a, b) => a.bod_origen.localeCompare(b.bod_origen),
    },
    {
      title: "Bodega Destino",
      dataIndex: "bod_destino",
      key: "bod_destino",
      sorter: (a, b) => a.bod_destino.localeCompare(b.bod_destino),
    },
    {
      title: "Usuario Elaboró",
      dataIndex: "user",
      key: "user",
      sorter: (a, b) => a.user.localeCompare(b.user),
    },
    {
      title: "Fecha Realizado",
      dataIndex: "fecha",
      key: "fecha",
      sorter: (a, b) => a.fecha.localeCompare(b.fecha),
    },
    // {
    //   title: "Usuario",
    //   dataIndex: "user",
    //   key: "user",
    //   sorter: (a, b) => a.user.localeCompare(b.user),
    // },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      fixed: "right",
      render: (_, record: { key: React.Key }) => {
        return (
          <Space>
            {privilegios?.consultar == "1" ? (
              <>
                <Tooltip title="Aceptar">
                  <Link to={`${location.pathname}/show/${record.key}`}>
                    <Button
                      key={record.key + "consultar"}
                      size="small"
                      type="primary"
                    >
                      <CheckOutlined />
                    </Button>
                  </Link>
                </Tooltip>
                <Tooltip title="Descargar Pdf">
                  <Button
                    size="small"
                    onClick={() => handlePdfClick(record.key)}
                  >
                    <FilePdfFilled className="icono-rojo" />
                  </Button>
                </Tooltip>
              </>
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
