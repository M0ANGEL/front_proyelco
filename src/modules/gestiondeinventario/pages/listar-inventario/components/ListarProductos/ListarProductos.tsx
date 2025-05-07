/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import useArrayBuffer from "@/modules/common/hooks/useArrayBuffer";
import { getBodegasSebthi } from "@/services/maestras/bodegasAPI";
import { fetchUserProfile } from "@/services/auth/authAPI";
import { Controller, useForm } from "react-hook-form";
import { Bodega, UserData } from "@/services/types";
import { SortOrder } from "antd/es/table/interface";
import { KEY_BODEGA, KEY_ROL } from "@/config/api";
import Table, { ColumnsType } from "antd/es/table";
import { DataType, Pagination } from "./types";
import { useState, useEffect } from "react";
import fileDownload from "js-file-download";
import {
  getReportInventario,
  productosInventario,
} from "@/services/maestras/productosAPI";
import { GreenButton } from "./styled";
import {
  MedicineBoxOutlined,
  BarcodeOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import {
  notification,
  SelectProps,
  Typography,
  Select,
  Input,
  Form,
  Spin,
  Col,
  Row,
} from "antd";

let timeout: ReturnType<typeof setTimeout> | null;
const { Text } = Typography;

export const ListarProductos = () => {
  const [optionsBodegas, setOptionsBodegas] = useState<SelectProps["options"]>(
    []
  );
  const [notificationApi, contextHolder] = notification.useNotification();
  const control = useForm<{
    bodegaSelect: string | null;
    value: string;
    lote: string;
  }>({ defaultValues: { bodegaSelect: null, lote: "", value: "" } });
  const [loaderTable, setLoaderTable] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [pagination, setPagination] = useState<Pagination>();
  const [hasFuente, setHasFuente] = useState<boolean>(false);
  const [orderBy, setOrderBy] = useState<SortOrder>("ascend");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [userInfo, setUserInfo] = useState<UserData>();
  const [bodegas, setBodegas] = useState<Bodega[]>([]);
  const { getSessionVariable } = useSessionStorage();
  const watchBodega = control.watch("bodegaSelect");
  const { arrayBufferToString } = useArrayBuffer();
  const watchProducto = control.watch("value");
  const userRole = getSessionVariable(KEY_ROL);
  const watchLote = control.watch("lote");

  useEffect(() => {
    fetchUserProfile().then(({ data: { userData } }) => {
      setUserInfo(userData);
      if (userData.has_fuentes == "1") {
        setHasFuente(true);
      } else {
        setHasFuente(false);
      }
      if (
        !["usuario", "calidad", "regente_farmacia", "auxiliar_bodega"].includes(
          userData.rol
        )
      ) {
        onFinish(control.getValues());
      }
    });
  }, []);

  useEffect(() => {
    if (
      ["usuario", "calidad", "regente_farmacia", "auxiliar_bodega"].includes(
        userRole
      ) &&
      userInfo?.has_bodegas == "1"
    ) {
      const bodegasHabilitadas = optionsBodegas?.filter(
        (item: any) =>
          userInfo?.bodegas_habilitadas.includes(parseInt(item.value)) ||
          item.value == getSessionVariable(KEY_BODEGA)
      );
      setOptionsBodegas(bodegasHabilitadas);
    } else {
      control.setValue("bodegaSelect", getSessionVariable(KEY_BODEGA));
    }
  }, [userInfo, userRole, bodegas]);

  useEffect(() => {
    if (userInfo) {
      if (
        userInfo.has_bodegas == "0" &&
        ["usuario", "regente_farmacia", "calidad", "auxiliar_bodega"].includes(
          userInfo.rol
        )
      ) {
        control.setValue("bodegaSelect", getSessionVariable(KEY_BODEGA));
      }
    }
    getBodegasSebthi()
      .then(({ data: { data } }) => {
        setBodegas(data);
        setOptionsBodegas(
          data
            .filter((item) => item.estado == "1")
            .map((item) => {
              return { label: item.bod_nombre, value: item.id.toString() };
            })
        );
      })
      .catch((error) => {
        notificationApi.error({
          message: error.message,
        });
      });
  }, [userInfo]);

  useEffect(() => {
    setLoaderTable(true);
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => {
      onFinish(control.getValues(), "page");
    }, 500);
  }, [watchProducto, watchLote, watchBodega, currentPage, orderBy]);

  const exportToExcel = () => {
    const data = {
      query: control.getValues("value"),
      bodegaLogin: parseInt(getSessionVariable(KEY_BODEGA)),
      bodegaSelect: control.getValues("bodegaSelect"),
      lote: control.getValues("lote"),
    };
    setLoaderTable(true);
    getReportInventario(data)
      .then(({ data }) => {
        fileDownload(data, "ReporteInventario.xlsx");
      })
      .catch(({ response: { data } }) => {
        const message = arrayBufferToString(data).replace(/[ '"]+/g, " ");
        notificationApi.open({
          type: "error",
          message: message,
        });
      })
      .finally(() => {
        setLoaderTable(false);
      });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Código",
      dataIndex: "codigoInterno",
      key: "codigoInterno",
      width: 100,
      align: "center",
    },
    {
      title: "Código Servinte",
      dataIndex: "codigo_servinte",
      key: "codigo_servinte",
      width: 100,
      align: "center",
      hidden: !hasFuente,
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
      sortOrder: orderBy,
      sorter: true,
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
    },
    {
      title: "Bodega",
      dataIndex: "bodega",
      key: "bodega",
      width: 120,
      align: "center",
    },
    {
      title: "Zona",
      dataIndex: "zona",
      key: "zona",
      width: 120,
      align: "center",
    },
  ];

  const onFinish = (data: any, origin = "fetch") => {
    data.page = currentPage;
    data.order_by = orderBy;
    setLoaderTable(true);
    if (origin == "fetch") {
      setDataSource([]);
    }
    productosInventario(data)
      .then(({ data: { data } }) => {
        setPagination(data);
        const productos: DataType[] = data.data.map((producto) => {
          // Actualiza el estado con los resultados de la consulta
          const uniqueKey = `${producto.id}-${producto.lote}-${producto.fecha_vencimiento}`;
          return {
            key: uniqueKey,
            id: producto.producto_id,
            codigoInterno: producto.producto_id.toString(),
            nombreProducto: producto.productos.descripcion,
            cantidad: producto.stock,
            lotes: producto.lote,
            vencimientos: producto.fecha_vencimiento,
            bodega: producto.bodegas.bod_nombre,
            zona: producto.zona,
            codigo_servinte: producto.productos.cod_huv,
          };
        });
        setDataSource(productos);
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

  return (
    <>
      {contextHolder}
      <Form
        layout="vertical"
        onKeyDown={(e: any) => (e.key === "Enter" ? e.preventDefault() : null)}
      >
        <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
          <Col xs={24} md={12}>
            <Controller
              control={control.control}
              name="value"
              render={({ field, fieldState: { error } }) => {
                return (
                  <StyledFormItem>
                    <Spin spinning={loaderTable}>
                      <Input
                        {...field}
                        allowClear
                        status={error && "error"}
                        prefix={<MedicineBoxOutlined />}
                        placeholder={`Ingrese Código o Nombre del Producto${
                          hasFuente ? " o Código Servinte" : ""
                        }`}
                      />
                    </Spin>
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                );
              }}
            />
          </Col>
          <Col xs={24} md={6}>
            <Controller
              control={control.control}
              name="lote"
              render={({ field, fieldState: { error } }) => {
                return (
                  <StyledFormItem>
                    <Spin spinning={loaderTable}>
                      <Input
                        {...field}
                        allowClear
                        status={error && "error"}
                        placeholder="Buscar por Lote"
                        prefix={<BarcodeOutlined />}
                      />
                    </Spin>
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                );
              }}
            />
          </Col>
          <Col xs={24} md={6}>
            <Controller
              control={control.control}
              name="bodegaSelect"
              render={({ field, fieldState: { error } }) => {
                return (
                  <StyledFormItem>
                    <Spin spinning={loaderTable}>
                      <Select
                        {...field}
                        showSearch
                        allowClear
                        options={optionsBodegas}
                        placeholder="Buscar Bodega"
                        suffixIcon={<HomeOutlined />}
                        popupMatchSelectWidth={false}
                        filterOption={(input, option) =>
                          (option?.label?.toString() ?? "")
                            .toLowerCase()
                            .includes(input.toString().toLowerCase())
                        }
                        filterSort={(optionA, optionB) =>
                          (optionA?.label ?? "")
                            .toString()
                            .toLowerCase()
                            .localeCompare(
                              (optionB?.label ?? "").toString().toLowerCase()
                            )
                        }
                        disabled={
                          ![
                            "administrador",
                            "regente",
                            "juridico",
                            "quimico",
                            "compras",
                            "cotizaciones",
                          ].includes(userRole) &&
                          !(userInfo?.has_bodegas == "1")
                        }
                      />
                    </Spin>
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                );
              }}
            />
          </Col>
          <Col xs={24}>
            <Spin spinning={loaderTable}>
              <GreenButton onClick={exportToExcel} block>
                Exportar a Excel
              </GreenButton>
            </Spin>
          </Col>
        </Row>
      </Form>
      <Table
        bordered
        rowKey={(record) => record.key}
        size="small"
        columns={columns}
        dataSource={dataSource}
        loading={loaderTable}
        onChange={(_pagination, _filters, _sorter, { action }) => {
          if (action == "sort")
            setOrderBy(orderBy == "ascend" ? "descend" : "ascend");
        }}
        pagination={{
          total: pagination?.total,
          pageSize: pagination?.per_page,
          simple: false,
          defaultCurrent: currentPage,
          onChange: (page: number) => {
            setCurrentPage(page);
          },
          hideOnSinglePage: true,
          showSizeChanger: false,
        }}
      />
    </>
  );
};
