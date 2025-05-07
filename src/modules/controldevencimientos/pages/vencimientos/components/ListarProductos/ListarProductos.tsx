/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { LoadingOutlined, FileExcelFilled } from "@ant-design/icons";
import { SortOrder } from "antd/es/table/interface";
import Table, { ColumnsType } from "antd/es/table";
import { DataType, Pagination } from "./types";
import { useState, useEffect } from "react";
import fileDownload from "js-file-download";
import {
  productosLoteCodVence,
  getReportVencimiento,
} from "@/services/maestras/productosAPI";
import { KEY_BODEGA } from "@/config/api";
import { SearchBar } from "./styled";
import {
  PaginationProps,
  notification,
  Typography,
  Button,
  Input,
  Spin,
  Row,
  Col,
} from "antd";

let timeout: ReturnType<typeof setTimeout> | null;
const { Text } = Typography;
enum SemaphorStatus {
  RED = "red",
  YELLOW = "yellow",
  GREEN = "green",
}

export const ListarProductos = () => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [semaphorStatus, setSemaphorStatus] = useState<SemaphorStatus>(
    SemaphorStatus.RED
  );
  const [loaderTable, setLoaderTable] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [pagination, setPagination] = useState<Pagination>();
  const { getSessionVariable } = useSessionStorage();
  const [value, setValue] = useState<string>("");
  const [sorterState, setSorterState] = useState<
    { field: string; order: SortOrder }[]
  >([{ field: "vencimientos", order: "ascend" }]);

  const id_bodega = parseInt(getSessionVariable(KEY_BODEGA));

  useEffect(() => {
    fetchProductos(semaphorStatus, value, 1);
  }, [sorterState]);

  const handleTableChange = (_pagination: any, _filters: any, sorter: any) => {
    if (sorter.field) {
      const newSorterState = [{ field: sorter.field, order: sorter.order }];
      setSorterState(newSorterState);
    }
  };

  const fetchProductos = (colorValue: SemaphorStatus, query = "", page = 1) => {
    setLoaderTable(true);
    const sortParams = sorterState
      .map(
        (sort) => `${sort.field}=${sort.order === "ascend" ? "asc" : "desc"}`
      )
      .join("&");
    productosLoteCodVence(page, query, colorValue, id_bodega, sortParams)
      .then(({ data: { data } }) => {
        setPagination({ ...data, current: page });
        const productos: DataType[] = data.data.map((producto) => {
          const uniqueKey = `${producto.id}-${producto.lote}-${producto.fecha_vencimiento}`;
          return {
            key: uniqueKey,
            id: producto.producto_id,
            codigoInterno: producto.producto_id.toString(),
            nombreProducto: producto.descripcion,
            cantidad: producto.stock,
            lotes: producto.lote,
            vencimientos: producto.fecha_vencimiento,
            bodega: producto.bod_nombre,
          };
        });
        setDataSource(productos);
        setSemaphorStatus(colorValue);
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
      fetchProductos(semaphorStatus, value);
    }, 500);
  };

  const handleChangePagination: PaginationProps["onChange"] = (page) => {
    setLoaderTable(true);
    fetchProductos(semaphorStatus, value, page);
  };

  const handleSemaphorClick = (status: SemaphorStatus) => {
    setLoaderTable(true);
    fetchProductos(status);
  };

  const handleExport = () => {
    const color = semaphorStatus;
    setLoaderTable(true);
    getReportVencimiento(color, id_bodega)
      .then(({ data }) => {
        fileDownload(data, "ReporteVencimientos.xlsx");
      })
      .finally(() => {
        setLoaderTable(false);
      });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Código Interno",
      dataIndex: "codigoInterno",
      key: "codigoInterno",
      width: 100,
      align: "center",
    },
    {
      title: "Nombre del Producto",
      dataIndex: "nombreProducto",
      key: "nombreProducto",
      align: "center",
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
      width: 100,
      align: "center",
    },
    {
      title: "Lotes",
      dataIndex: "lotes",
      key: "lotes",
      width: 120,
      align: "center",
    },
    {
      title: "Fecha Vencimiento",
      dataIndex: "vencimientos",
      key: "vencimientos",
      align: "center",
      sorter: true,
      sortOrder: sorterState.find((item) => item.field === "vencimientos")
        ?.order,
    },
    {
      title: "Bodega",
      dataIndex: "bodega",
      key: "bodega",
      width: 120,
      align: "center",
      sorter: true,
      sortOrder: sorterState.find((item) => item.field === "bodega")?.order,
    },
  ];

  const tableClassName =
    semaphorStatus === SemaphorStatus.RED
      ? "red-row"
      : semaphorStatus === SemaphorStatus.YELLOW
      ? "yellow-row"
      : "green-row";

  return (
    <>
      {contextHolder}

      <Row gutter={12}>
        <Col xs={24} sm={18}>
          <SearchBar>
            <Input placeholder="Buscar" onChange={handleSearch} allowClear />
          </SearchBar>
        </Col>
        <Col xs={24} sm={6} style={{ marginBottom: 20 }}>
          <Spin
            spinning={loaderTable}
            indicator={<LoadingOutlined spin style={{ color: "white" }} />}
          >
            <Button
              type="primary"
              ghost
              onClick={() => {
                handleExport();
              }}
              icon={<FileExcelFilled className="icono-verde" />}
              block
              style={{ color: "orange", borderColor: "#057705de" }}
            >
              Descargar Vencimientos
            </Button>
          </Spin>
        </Col>
      </Row>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "12vh",
        }}
      >
        <Button
          type="primary"
          style={{ backgroundColor: "#ff0000af", margin: "5px" }}
          onClick={() => {
            handleSemaphorClick(SemaphorStatus.RED);
          }}
        >
          0 - 6 MESES
        </Button>
        <Button
          type="primary"
          style={{ backgroundColor: "#ffbb00e1", margin: "5px" }}
          onClick={() => {
            handleSemaphorClick(SemaphorStatus.YELLOW);
          }}
        >
          7 - 12 MESES
        </Button>
        <Button
          type="primary"
          style={{ backgroundColor: "#057705de", margin: "5px" }}
          onClick={() => {
            handleSemaphorClick(SemaphorStatus.GREEN);
          }}
        >
          MAYOR A 12 MESES
        </Button>
      </div>
      <Table
        bordered
        rowKey={(record) => record.key}
        size="small"
        columns={columns}
        dataSource={dataSource}
        loading={loaderTable}
        onChange={handleTableChange}
        pagination={{
          total: pagination?.total,
          pageSize: pagination?.per_page,
          simple: false,
          onChange: handleChangePagination,
          current: pagination?.current,
          hideOnSinglePage: true,
          showTotal: (total: number) => {
            return (
              <>
                <Text>Total Registros: {total}</Text>
              </>
            );
          },
        }}
        rowClassName={tableClassName}
      />
    </>
  );
};
