/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { getFacturasProveedorDistribucion } from "@/services/documentos/trsAPI";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { SearchBar } from "../ListarDocumentos/styled";
import { DataType, Pagination, Props } from "./types";
import { Link, useLocation } from "react-router-dom";
import { RiFileTransferLine } from "react-icons/ri";
import { SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { KEY_BODEGA } from "@/config/api";
import dayjs from "dayjs";
import {
  notification,
  Typography,
  Tooltip,
  Button,
  Input,
  Space,
  Table,
  Col,
  Row,
} from "antd";

const { Text } = Typography;

export const TablaDistribuciones = ({ tab }: Props) => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [currentItemsPage, setCurrentItemsPage] = useState<number>(10);
  const [loaderTable, setLoaderTable] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [dataSource, setDataSource] = useState<DataType[]>();
  const [pagination, setPagination] = useState<Pagination>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { getSessionVariable } = useSessionStorage();
  const location = useLocation();

  useEffect(() => {
    fetchFacturas();
  }, [tab]);

  useEffect(() => {
    const data = {
      estado: tab,
      page: currentPage,
      paginate: currentItemsPage,
      searchInput: searchInput,
      bodega_id: getSessionVariable(KEY_BODEGA),
    };
    fetchFacturas(data);
  }, [currentPage, currentItemsPage]);

  const fetchFacturas = (datos?: any) => {
    setLoaderTable(true);
    let data;
    if (datos) {
      data = datos;
    } else {
      data = {
        estado: tab,
        page: currentPage,
        paginate: currentItemsPage,
        searchInput: searchInput,
        bodega_id: getSessionVariable(KEY_BODEGA),
      };
    }
    getFacturasProveedorDistribucion(data)
      .then(({ data: { data } }) => {
        setPagination(data);
        setDataSource(
          data.data.map((item) => {
            return {
              key: item.id,
              consecutivo: item.consecutivo,
              factura: item.factura_nro,
              fecha: dayjs(item.created_at).format("YYYY-MM-DD HH:mm:ss"),
              proveedor: item.tercero.razon_soc,
            };
          })
        );
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

  const columns: ColumnsType<DataType> = [
    {
      key: "cosecutivo",
      dataIndex: "consecutivo",
      title: "Consecutivo",
      align: "center",
      width: 120,
    },
    {
      key: "factura",
      dataIndex: "factura",
      title: "Nro Factura",
      align: "center",
      width: 120,
    },
    {
      key: "fecha",
      dataIndex: "fecha",
      title: "Fecha",
      align: "center",
      width: 120,
    },
    {
      key: "proveedor",
      dataIndex: "proveedor",
      title: "Proveedor",
      align: "center",
      width: 120,
    },
    {
      key: "acciones",
      title: "Acciones",
      align: "center",
      width: 120,
      render(_, { key }) {
        return (
          <>
            <Space>
              <Tooltip title="Ver Factura">
                <Link
                  to={`/documentos/entradas/fp/show/${key}`}
                  target="_blank"
                >
                  <Button key={key + "consultar"} size="small">
                    <SearchOutlined />
                  </Button>
                </Link>
              </Tooltip>
              {["pendientes"].includes(tab) ? (
                <Tooltip title="Crear Traslados">
                  <Link to={`${location.pathname}/distribuir/${key}`}>
                    <Button
                      type="primary"
                      key={key + "distribuir"}
                      size="small"
                    >
                      <Text
                        style={{ fontSize: 15, marginTop: 2, color: "#FFFFFF" }}
                      >
                        <RiFileTransferLine />
                      </Text>
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
      <Row gutter={12}>
        <Col span={24}>
          <SearchBar>
            <Input
              placeholder="Buscar"
              onPressEnter={(event) => {
                setSearchInput(event.currentTarget.value);
              }}
              onChange={(event) => {
                if (event.currentTarget.value == "") {
                  setSearchInput("");
                }
              }}
            />
          </SearchBar>
        </Col>
        <Col span={24}>
          <Table
            bordered
            rowKey={(record) => record.consecutivo}
            size="small"
            columns={columns}
            dataSource={dataSource}
            loading={loaderTable}
            pagination={{
              simple: false,
              total: pagination?.total,
              pageSize: pagination?.per_page,
              onChange: (page: number, pageSize: number) => {
                setCurrentPage(page);
                setCurrentItemsPage(pageSize);
              },
              hideOnSinglePage: true,
            }}
          />
        </Col>
      </Row>
    </>
  );
};
