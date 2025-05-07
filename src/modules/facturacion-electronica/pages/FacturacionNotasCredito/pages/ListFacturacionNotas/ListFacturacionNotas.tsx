/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import {
  Input,
  Space,
  Table,
  Typography,
  Form,
  DatePicker,
  Button,
  Row,
  Col,
  Select,
  SelectProps,
  notification,
  Tooltip,
  RadioChangeEvent,
  Radio,
  Spin,
  Checkbox,
} from "antd";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SearchBar, StyledFormItem } from "./styled";
import { DataType, Pagination } from "./types";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";
import {
  SaveOutlined,
  FilePdfFilled,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  generacionCufe,
  getListaFacturaNotas,
  getRPGrafica,
  anulacionMasiva,
} from "@/services/facturacion/facturacionNotasCreditoAPI";
import { searchTerceros } from "@/services/facturacion/facturasAPI";
import { getConvenios } from "@/services/facturacion/facturacionFveAPI";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { FooterTable } from "../../components";

const { Text } = Typography;
const { RangePicker } = DatePicker;
let timeout: ReturnType<typeof setTimeout> | null;

const options = [
  { label: "NCE", value: "NCE", tooltip: "nota crédito dispensacion" },
  { label: "NCV", value: "NCV", tooltip: "nota crédito venta directa" },
  { label: "NCC", value: "NCC", tooltip: "nota crédito concepto" },
];

const optionsNd = [
  { label: "NDE", value: "NDE", tooltip: "nota débito dispensacion" },
  { label: "NDV", value: "NDV", tooltip: "nota débito venta directa" },
  { label: "NDC", value: "NDC", tooltip: "nota débito concepto" },
];

export const ListFacturacionNotas = () => {
  const [loadingRow, setLoadingRow] = useState<any>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [selectionType, setSelectionType] = useState<"checkbox">("checkbox");
  const [pagination, setPagination] = useState<Pagination>();
  const [loaderTable, setLoaderTable] = useState<boolean>(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationApi, contextHolder] = notification.useNotification();
  const [optionsConvenios, setOptionsConvenios] = useState<
    SelectProps["options"]
  >([]);
  const control = useForm();
  const [rowSelect, setRowselect] = useState<React.Key[]>([]);
  const [valueCheck, setValueCheck] = useState("");
  const [selectProveedor, setSelectProveedor] = useState<
    SelectProps["options"]
  >([]);
  const [botonDeshabilitado, setBotonDeshabilitado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loaderTerceros, setLoaderTerceros] = useState<boolean>(false);
  const [busquedaFve, setBusquedaFve] = useState<boolean>(false);
  const [rowSelectString, setRowselectString] = useState<number>();

  const generarPDF = (
    key: React.Key,
    numero_factura_vta: string,
    tipoDoc: string
  ) => {
    getRPGrafica(key.toString(), numero_factura_vta, tipoDoc).then((data) => {
      const file = new Blob([data.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    });
  };

  const onChangeCheck = ({ target: { value } }: RadioChangeEvent) => {
    setValueCheck(value);
    control.setValue("tipo_documento", value);
  };

  const onChange = (e: CheckboxChangeEvent) => {
    control.setValue("numero_nota", "");
    setBusquedaFve(e.target.checked);
  };

  const watchCliente = control.watch("tercero_id");
  const watchconvenio = control.watch("convenio");

  // Funcion para buscar el proveedor por medio de un query, esta consulta busca por NIT y nombre del proveedor
  const handleSearchProveedor = (event: any) => {
    const query = event.target.value.toString();
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (query.length > 0 && !busquedaFve) {
      setLoaderTerceros(true);
      timeout = setTimeout(() => {
        searchTerceros(query)
          .then(({ data: { data } }) => {
            control.setValue("tercero_id", data.nit);
            control.setValue("razon_soc", data.razon_soc);
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
          .finally(() => setLoaderTerceros(false));
      }, 500);
    }
  };
  useEffect(() => {
    if (watchCliente == "") {
      control.setValue("razon_soc", "");
      control.setValue("convenio", []);
      if (dataSource) {
        setInitialData([]);
        setDataSource([]);
      }
    }
  }, [watchCliente]);

  useEffect(() => {
    if (dataSource.length > 0) {
      setInitialData([]);
      setDataSource([]);
    }
  }, [watchconvenio]);

  const fetchFacturaVtaDis = (value: any) => {
    const data = {
      page: 1,
      data: value,
    };
    getListaFacturaNotas(data)
      .then(({ data }) => {
        setPagination(data);
        const responseData = data.data.length == 0;

        if (responseData) {
          notificationApi.open({
            type: "warning",
            message: `No hay datos en su busqueda!`,
          });
        }
        const listaNotaCredito: DataType[] = data.data.map((item) => {
          return {
            key: item.id,
            id: item.id,
            consecutivo: item.consecutivo,
            numero_factura_vta: item.numero_factura_vta,
            estado: item.estado,
            // convenio_id: item.,
            nit: item.nit,
            bod_nombre: item.bod_nombre,
            total: item.total,
            num_contrato: item.num_contrato,
            fecha: dayjs(item.created_at).format("DD-MM-YYYY HH:mm"),
            impuesto: item.impuesto,
            subtotal: item.subtotal,
            created_at: item.created_at,
          };
        });
        setInitialData(listaNotaCredito);
        setDataSource(listaNotaCredito);
        setLoaderTable(false);
        setLoadingRow([]);
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          const { status, message } = error.response.data;
          if (status === "error") {
            notificationApi.open({
              type: "error",
              message: message || "Ocurrió un error al obtener los datos.",
            });
          }
        } else {
          notificationApi.open({
            type: "error",
            message: "Ocurrió un error al obtener los datos.",
          });
        }
      })
      .finally(() => {
        
        setLoaderTable(false);
      });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const filterTable = initialData?.filter((o: any) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );

    setDataSource(filterTable);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Numero de Factura",
      dataIndex: "consecutivo",
      key: "consecutivo",
      width: 100,
    },
    {
      title: "Documento Origen",
      dataIndex: "numero_factura_vta",
      key: "numero_factura_vta",
      width: 100,
    },
    {
      title: "Convenio",
      dataIndex: "num_contrato",
      key: "num_contrato",
      width: 100,
    },
    {
      title: "Bodega",
      dataIndex: "bod_nombre",
      key: "bod_nombre",
      width: 80,
    },
    {
      title: "Fecha",
      dataIndex: "fecha",
      key: "fecha",
      width: 80,
    },
    {
      title: "SubTotal",
      dataIndex: "subtotal",
      key: "subtotal",
      width: 80,
      align: "center",
      fixed: "right",
      render(_, { subtotal }) {
        return <>$ {parseFloat(subtotal).toLocaleString("es-CO")}</>;
      },
    },
    {
      title: "Impuesto",
      dataIndex: "impuesto",
      key: "impuesto",
      width: 80,
      align: "center",
      fixed: "right",
      render(_, { impuesto }) {
        return <>$ {parseFloat(impuesto).toLocaleString("es-CO")}</>;
      },
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: 80,
      align: "center",
      render(_, { total }) {
        return <>$ {parseFloat(total).toLocaleString("es-CO")}</>;
      },
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      fixed: "right",
      render: (_, record: { key: React.Key; numero_factura_vta: string }) => {
        return (
          <Space>
            <Tooltip title="Ver Prefactura">
              <Button
                size="small"
                key={record.key + "pdf"}
                onClick={() =>
                  generarPDF(record.key, record.numero_factura_vta, valueCheck)
                }
              >
                <FilePdfFilled className="icono-rojo" />
              </Button>
            </Tooltip>
          </Space>
        );
      },
      width: 70,
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[] | any, selectedRows: any[]) => {
      const sum: number =
        selectedRows?.reduce(
          (accumulador: number, item: any) =>
            accumulador + parseFloat(item.total),
          0
        ) ?? 0;
      setRowselect(selectedRowKeys);
      setRowselectString(sum);
    },
    selections: [Table.SELECTION_ALL, Table.SELECTION_NONE],
    selectedRowKeys: rowSelect,
    selectedRows: rowSelectString,
  };

  const hasSelected = rowSelect.length > 0;
  // permite la seleccion multiple de todos los convenios con la opcion todos
  const handleChangeSelectConvenio = (value: string) => {
    value == "todos"
      ? control.setValue(
          "convenio",
          optionsConvenios
            ?.filter((item) => item.value !== "todos")
            .map((item) => item.value)
        )
      : control.setValue("convenio", value);
  };
  const envRowSelect = () => {
    setBotonDeshabilitado(true);
    setLoading(true);
    if (rowSelect.length == 0) {
      notificationApi.open({
        type: "error",
        message: "No has seleccionado ninguna fila!",
      });
      setLoading(false);
      setTimeout(() => {
        // navigate(
        //   `/${url_split.at(1)}/${url_split.at(2)}/${codigo_documento}`
        // );
      }, 1500);
      return;
    }

    const newData = [
      { seleccion: rowSelect },
      // { convenio: control.getValues("convenio") },
      { documento: control.getValues("tipo_documento") },
    ];
    generacionCufe(newData)
      .then(() => {
        notificationApi.open({
          type: "success",
          message: `Documento creado con exito!`,
        });
        setTimeout(() => {
          navigate(location.pathname);
          control.reset();
          setRowselect([]);
          setDataSource([]);
          setValueCheck("");
          setBotonDeshabilitado(false);
          setLoading(false);
        }, 1500);
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
          setLoaderTable(false);
          setBotonDeshabilitado(false);
          setLoading(false);
        }
      );
  };

  const handleAnulacionMasiva = () => {

    const data = {
      seleccion: rowSelect,
      documento: control.getValues("tipo_documento"),
      convenio: control.getValues("convenio"),
    };

    setLoading(true);
    setBotonDeshabilitado(true);

    anulacionMasiva(data)
      .then(() => {
        notificationApi.open({
          type: "success",
          message: `Documentos anulados con éxito!`,
        });

        setTimeout(() => {
          setRowselect([]);
          setDataSource([]);
          setBotonDeshabilitado(false);
          setLoading(false);
          setRowselectString(0);

          const dataControl = {
            convenio: control.getValues("convenio"),
            fechaFin: control.getValues("fechaFin"),
            fechaInicio: control.getValues("fechaInicio"),
            fechas: control.getValues("fechas"),
            razon_soc: control.getValues("razon_soc"),
            tercero_id: control.getValues("tercero_id"),
            tipo_documento: control.getValues("tipo_documento"),
          };
          fetchFacturaVtaDis(dataControl);
        }, 1500);
      })
      .catch(({ response }) => {
        if (response && response.data && response.data.errors) {
          const errores: string[] = Object.values(response.data.errors);
          for (const error of errores) {
            notificationApi.open({
              type: "error",
              message: error,
            });
          }
        } else if (response && response.data) {
          notificationApi.open({
            type: "error",
            message: response.data.message || "Error en la anulación masiva",
          });
        } else {
          notificationApi.open({
            type: "error",
            message: "Error en la anulación masiva",
          });
        }

        setBotonDeshabilitado(false);
        setLoading(false);
      });
  };


  const handleComboBoxChange = () => {
    const tercero = control.getValues("tercero_id");
    {
      !busquedaFve
        ? getConvenios().then(({ data }) => {
            const convenios = data.data
              .filter((item: any) => item.nit == tercero)
              .map((item: any) => {
                return { label: item.descripcion, value: item.id };
              });
            convenios.unshift({ label: "TODOS", value: "todos" });
            setOptionsConvenios(convenios);
          })
        : null;
    }
  };

  return (
    <>
      <Spin spinning={loading}>
        {contextHolder}
        <StyledCard title={"Solicitud Cufe NC"}>
          <Row>
            <Col span={24} style={{ marginBottom: 10 }}>
              <Form layout={"vertical"} form={form}>
                <Row gutter={[12, 6]}>
                  <Col span={24}>
                    <Row gutter={12}>
                      <Col
                        xs={{ span: 12, order: 1 }}
                        sm={{ span: 6, order: 2 }}
                      >
                        <Controller
                          name="tercero_id"
                          control={control.control}
                          rules={{
                            required: {
                              value: busquedaFve ? false : true,
                              message: "Cliente es requerido",
                            },
                          }}
                          render={({ field, fieldState: { error } }) => (
                            <StyledFormItem
                              label={"Cliente:"}
                              required={busquedaFve ? false : true}
                            >
                              <Spin
                                spinning={loaderTerceros}
                                indicator={<LoadingOutlined spin />}
                                style={{
                                  backgroundColor: "rgb(251 251 251 / 70%)",
                                }}
                              >
                                <Input
                                  {...field}
                                  placeholder={"Buscar Cliente"}
                                  allowClear
                                  onBlur={(event: any) => {
                                    handleSearchProveedor(event);
                                    handleComboBoxChange();
                                  }}
                                  status={error && "error"}
                                />
                              </Spin>
                              <Text type="danger">{error?.message}</Text>
                            </StyledFormItem>
                          )}
                        />
                      </Col>
                      <Col xs={24} sm={{ span: 8, order: 2 }}>
                        <Controller
                          control={control.control}
                          name={"razon_soc"}
                          render={({ field }) => (
                            <StyledFormItem label={"Razon Social :"}>
                              <Input {...field} disabled />
                            </StyledFormItem>
                          )}
                        />
                      </Col>
                      <Col
                        xs={{ span: 24, order: 3 }}
                        sm={{ span: 14, order: 4 }}
                      >
                        <Controller
                          name="convenio"
                          control={control.control}
                          rules={{
                            required: {
                              value: busquedaFve ? false : true,
                              message: "Convenio es requerido",
                            },
                          }}
                          render={({ field, fieldState: { error } }) => (
                            <StyledFormItem
                              required={busquedaFve ? false : true}
                              label="Convenio :"
                            >
                              <Select
                                {...field}
                                allowClear
                                mode="multiple"
                                options={optionsConvenios}
                                placeholder={"Buscar Convenio"}
                                onChange={handleChangeSelectConvenio}
                                filterOption={(input, option) =>
                                  (option?.label ?? "")
                                    .toString()
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                                }
                                status={error && "error"}
                              />
                              <Text type="danger">{error?.message}</Text>
                            </StyledFormItem>
                          )}
                        />
                      </Col>
                      <Col
                        xs={{ span: 24, order: 1 }}
                        sm={{ offset: 3, span: 6, order: 3 }}
                        // style={{ marginTop: 10 }}
                      >
                        <Controller
                          control={control.control}
                          name="fechas"
                          rules={{
                            required: {
                              value: busquedaFve ? false : true,
                              message: "Rango de fechas es requerido",
                            },
                          }}
                          render={({ field, fieldState: { error } }) => (
                            <StyledFormItem
                              required={busquedaFve ? false : true}
                              label="Rango de fechas:"
                            >
                              <RangePicker
                                {...field}
                                status={error && "error"}
                                style={{ width: "100%" }}
                                placeholder={["Inicio", "Fin"]}
                                onCalendarChange={(value: any) => {
                                  if (value) {
                                    control.setValue(
                                      "fechaInicio",
                                      dayjs(value[0]).format("YYYY-MM-DD")
                                    );
                                    control.setValue(
                                      "fechaFin",
                                      dayjs(value[1]).format("YYYY-MM-DD")
                                    );
                                  } else {
                                    control.setValue("fechaInicio", undefined);
                                    control.setValue("fechaFin", undefined);
                                  }
                                }}
                              />
                              <Text type="danger">{error?.message}</Text>
                            </StyledFormItem>
                          )}
                        />
                      </Col>
                      <Col
                        style={{ marginTop: 3 }}
                        sm={{ span: 6, order: 5, offset: 3 }}
                      >
                        <Checkbox onChange={onChange}>
                          Busqueda Por FVE
                        </Checkbox>
                        {busquedaFve ? (
                          <Controller
                            name="numero_nota"
                            control={control.control}
                            rules={{
                              required: {
                                value: busquedaFve ? true : false,
                                message: "Numero Nota es requerido",
                              },
                            }}
                            render={({ field, fieldState: { error } }) => (
                              <StyledFormItem>
                                <Input
                                  {...field}
                                  placeholder={"Número de Nota credito"}
                                  allowClear
                                  onBlur={(event: any) => {
                                    handleSearchProveedor(event);
                                    handleComboBoxChange();
                                  }}
                                  status={error && "error"}
                                />
                                <Text type="danger">{error?.message}</Text>
                              </StyledFormItem>
                            )}
                          />
                        ) : null}
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={{ span: 12, order: 4 }} sm={{ span: 24, order: 6 }}>
                    <Controller
                      control={control.control}
                      name="tipo_documento"
                      rules={{
                        required: {
                          value: busquedaFve ? false : true,
                          message: "Tipo Documento es requerido",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem label="Nota Crédito :">
                          <Radio.Group
                            {...field}
                            disabled={rowSelect.length > 0}
                            options={options.map((option) => ({
                              label: (
                                <Tooltip title={option.tooltip}>
                                  {option.label}
                                </Tooltip>
                              ),
                              value: option.value,
                            }))}
                            onChange={onChangeCheck}
                            value={valueCheck}
                            optionType="button"
                            buttonStyle="solid"
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={{ span: 12, order: 4 }} sm={{ span: 24, order: 6 }}>
                    <Controller
                      control={control.control}
                      name="tipo_documento"
                      rules={{
                        required: {
                          value: busquedaFve ? false : true,
                          message: "Tipo Documento es requerido",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem label="Nota Débito :">
                          <Radio.Group
                            {...field}
                            disabled={rowSelect.length > 0}
                            options={optionsNd.map((option) => ({
                              label: (
                                <Tooltip title={option.tooltip}>
                                  {option.label}
                                </Tooltip>
                              ),
                              value: option.value,
                            }))}
                            onChange={onChangeCheck}
                            value={valueCheck}
                            optionType="button"
                            buttonStyle="solid"
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={24} sm={8} order={7}>
                    <Button
                      danger
                      type="primary"
                      htmlType="submit"
                      onClick={handleAnulacionMasiva}
                      disabled={rowSelect.length === 0 || !valueCheck}
                    >
                      Anulación Masiva
                    </Button>
                  </Col>
                  <Col sm={{ span: 24, order: 7, offset: 11 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={
                        rowSelection.onChange.length == 0 ? true : false
                      }
                      onClick={control.handleSubmit(fetchFacturaVtaDis)}
                    >
                      Listar
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Col>
            <Col span={24}>
              <SearchBar>
                <Input placeholder="Buscar" onChange={handleSearch} />
              </SearchBar>
            </Col>
            <Col style={{ marginLeft: 8 }}>
              {hasSelected
                ? `Seleccionados ${rowSelect.length} documentos de ${dataSource.length} `
                : dataSource.length != 0
                ? `Documentos total : ${dataSource.length}`
                : ""}
            </Col>
            <Col span={24} style={{ marginBottom: 10 }}>
              <Table
                rowSelection={{
                  type: selectionType,
                  ...rowSelection,
                }}
                className="custom-table"
                rowKey={(record) => record.id}
                size="small"
                dataSource={dataSource}
                columns={columns}
                loading={loaderTable}
                footer={() => (
                  <FooterTable data={dataSource} selected={rowSelectString} />
                )}
                pagination={{
                  total: pagination?.total,
                  showSizeChanger: true,
                  defaultPageSize: 5,
                  showTotal: () => {
                    return (
                      <>
                        <Text>Total Registros: {pagination?.total}</Text>
                      </>
                    );
                  },
                }}
                locale={{
                  selectionAll: "Seleccionar todo",
                  selectNone: "Cancelar selección",
                }}
                bordered
              />
            </Col>
            <Col
              span={24}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Space>
                <>
                  <Button
                    // htmlType="submit"
                    type="primary"
                    disabled={rowSelect.length == 0 ? true : false}
                    icon={<SaveOutlined />}
                    onClick={envRowSelect}
                  >
                    Enviar Documento
                  </Button>
                </>
              </Space>
            </Col>
          </Row>
        </StyledCard>
      </Spin>
    </>
  );
};
