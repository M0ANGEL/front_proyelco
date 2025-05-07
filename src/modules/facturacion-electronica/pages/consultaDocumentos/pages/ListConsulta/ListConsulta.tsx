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
  Spin,
  Checkbox,
} from "antd";
import React, { useState, useEffect } from "react";
import { GreenButton, SearchBar, StyledFormItem } from "./styled";
import { Convenios, DataType, Pagination } from "./types";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";
import {
  getListaConsultaDoc,
  downloadZip,
  getRPGrafica,
  getRPGraficaLocal,
} from "@/services/facturacion/consultaDocumentosAPI";
import {
  LoadingOutlined,
  DownloadOutlined,
  FilePdfFilled,
} from "@ant-design/icons";
import {
  getBodegas,
  getConvenios,
  searchTerceros,
} from "@/services/facturacion/facturasAPI";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { FooterTable } from "../../components";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_EMPRESA } from "@/config/api";

const { Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
let timeout: ReturnType<typeof setTimeout> | null;

export const ListConsulta = () => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loaderTable, setLoaderTable] = useState<boolean>(false);

  const [form] = Form.useForm();
  const [notificationApi, contextHolder] = notification.useNotification();
  const [optionsConvenios, setOptionsConvenios] = useState<
    SelectProps["options"]
  >([]);
  const [pagination, setPagination] = useState<Pagination>();
  const { getSessionVariable } = useSessionStorage();

  const control = useForm();
  const [loaderTerceros, setLoaderTerceros] = useState<boolean>(false);
  const [rowSelect, setRowselect] = useState<React.Key[]>([]);
  const [botonDeshabilitado, setBotonDeshabilitado] = useState(true);
  const [busquedaDoc, setBusquedaDoc] = useState<boolean>(false);
  const [rowSelectString, setRowselectString] = useState<number>();
  const [value, setValue] = useState<string>("");
  const [allSelect, setAllSelect] = useState<boolean>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [optionsBodegas, setOptionsBodegas] = useState<SelectProps["options"]>(
    []
  );
  const [selectedConvenio, setSelectedConvenio] = useState<Convenios[]>();

  const optionsTipoDoc = [
    { label: "Factura Dispensación", value: "FVE" },
    { label: "Factura Por Concepto", value: "FVC" },
    { label: "Factura Venta Directa", value: "RVD" },
    { label: "Factura Cuota Moderadora", value: "CUO" },
    { label: "Nota Crédito por Concepto", value: "NCC" },
    { label: "Nota Crédito Dispensación", value: "NCE" },
    { label: "Nota Crédito Venta Directa", value: "NCV" },
    { label: "Nota Débito por Concepto", value: "NDC" },
    { label: "Nota Débito Dispensación", value: "NDE" },
    { label: "Nota Débito Venta Directa", value: "NDV" },
  ];

  useEffect(() => {
    const dataControl: any = {
      bodega: control.getValues("bodega"),
      convenio: control.getValues("convenio"),
      fechaFin: control.getValues("fechaFin"),
      fechaInicio: control.getValues("fechaInicio"),
      fechas: control.getValues("fechas"),
      razon_soc: control.getValues("razon_soc"),
      tercero_id: control.getValues("tercero_id"),
      tipo_documento: control.getValues("tipo_documento"),
      rowSelect,
      rowSelectString,
      page: currentPage,
      search: value,
    };

    if (dataControl.tipo_documento) {
      fetchFacturaVtaDis(dataControl);
    }
  }, [currentPage, value]);

  const generarPDF = (
    key: React.Key,
    cufe: string,
    keyd: string,
    tipoDoc: string,
    stado_id: string
  ) => {
    if (
      (stado_id != "5" && !["FVC", "NCV"].includes(tipoDoc)) ||
      (stado_id != "4" && ["FVC", "NCV"].includes(tipoDoc))
    ) {
      getRPGrafica(cufe).then((data) => {
        const file = new Blob([data.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      });
    } else {
      getRPGraficaLocal(keyd.toString(), key.toString(), tipoDoc).then(
        (data) => {
          const file = new Blob([data.data], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        }
      );
    }
  };

  const onChange = (e: CheckboxChangeEvent) => {
    control.setValue("numero_fve", "");
    setBusquedaDoc(e.target.checked);
  };

  const handleSearchProveedor = (event: any) => {
    const query = event.target.value.toString();
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (query.length > 0 && !busquedaDoc) {
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

  const watchCliente = control.watch("tercero_id");

  useEffect(() => {
    if (watchCliente == "") {
      control.setValue("razon_soc", "");
      control.setValue("convenio", []);
      control.setValue("bodega", []);
      if (dataSource) {
        setDataSource([]);
        setRowselect([]);
        setRowselectString(0);
        control.setValue("tipo_documento", "");
      }
    }
  }, [watchCliente]);

  const watchbodega = control.watch("bodega");

  useEffect(() => {
    if (dataSource.length > 0) {
      setDataSource([]);
      setRowselect([]);
      setRowselectString(0);
    }
  }, [watchbodega]);

  const fetchFacturaVtaDis = (value: any) => {
    setLoaderTable(true);
    (value.page = value.page ? value.page : 1),
      (value.search = value.search ? value.search : "");
    const data = {
      data: value,
    };
    getListaConsultaDoc(data).then(({ data: { data } }) => {
      setPagination(data);
      const responseData = data.data.length == 0;
      if (responseData) {
        notificationApi.open({
          type: "warning",
          message: `No hay Datos En su Busqueda!`,
        });
      }
      const listaConsultaDoc: DataType[] = data.data.map((item) => {
        return {
          key: item.id,
          id: item.id,
          dispensaciones_id: item.dispensaciones_id,
          consecutivo: item.consecutivos
            ? Object.values(item.consecutivos).join(", ")
            : "",
          estado_id: item.estado_id,
          fecha_emision: item.fecha_emision,
          fecha_vencimiento: item.fecha_vencimiento,
          fecha_facturacion: item.fecha_facturacion,
          impuesto: item.impuesto,
          nit: item.nit,
          num_contrato: item.num_contrato,
          numero_factura_vta: item.numero_factura_vta,
          numero_fve: item.numero_fve,
          subtotal: item.subtotal,
          total: item.total,
          cufe: item.cufe,
          respuesta: item.respuesta,
          nota: item.nota ? item.nota : "",
        };
      });
      setDataSource(listaConsultaDoc);
      setLoaderTable(false);
      setRowselect([]);
      setRowselectString(0);
    });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Numero de Factura",
      dataIndex: "numero_factura_vta",
      key: "numero_factura_vta",
      width: 80,
    },
    {
      title: "Documento Origen",
      dataIndex: "consecutivo",
      key: "consecutivo",
      width: 80,
      render: (_, { nota, consecutivo, numero_fve }) => {
        let response;
        if (consecutivo) {
          response = consecutivo;
        } else if (consecutivo == "") {
          response = numero_fve;
        } else {
          response = nota;
        }
        return response;
      },
    },
    {
      title: "Nit Cliente",
      dataIndex: "nit",
      key: "nit",
      width: 80,
    },
    {
      title: "Contrato",
      dataIndex: "num_contrato",
      key: "num_contrato",
      width: 80,
      align: "center",
    },
    {
      title: "Fecha Emision DIAN",
      dataIndex: "fecha_emision",
      key: "fecha_emision",
      width: 80,
      align: "center",
    },
    {
      title: "Fecha Facturación DIAN",
      dataIndex: "fecha_facturacion",
      key: "fecha_facturacion",
      align: "center",
      width: 80,
    },
    {
      title: "Fecha Vencimiento DIAN",
      dataIndex: "fecha_vencimiento",
      key: "fecha_vencimiento",
      align: "center",
      width: 80,
    },
    {
      title: "CUFE",
      dataIndex: "cufe",
      key: "cufe",
      align: "center",
      width: 180,
      render: (text, record) => {
        record.cufe;
        return (
          <Space>
            <Input.TextArea
              autoSize={{ minRows: 3, maxRows: 5 }}
              value={text}
            />
          </Space>
        );
      },
    },
    {
      title: "Estado",
      dataIndex: "respuesta",
      key: "respuesta",
      align: "center",
      width: 120,
      render: (_, record: { key: React.Key; respuesta: string }) => {
        return (
          <Paragraph
            ellipsis={{
              rows: 3,
              expandable: true,
              symbol: "Expandir",
            }}
          >
            {record.respuesta}
          </Paragraph>
        );
      },
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      fixed: "right",
      render: (
        _,
        record: {
          key: React.Key;
          cufe: string;
          numero_fve: string;
          estado_id: string;
        }
      ) => {
        return (
          <Space>
            <Tooltip title="Ver Prefactura">
              <Button
                size="small"
                key={record.key + "pdf"}
                onClick={() =>
                  generarPDF(
                    record.key,
                    record.cufe,
                    record.numero_fve,
                    control.getValues("tipo_documento"),
                    record.estado_id
                  )
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

  const handleComboBoxChange = () => {
    const tercero = control.getValues("tercero_id");
    {
      !busquedaDoc
        ? getConvenios().then(({ data }) => {
            const convenios = data.data
              .filter((item: any) => item.nit == tercero)
              .map((item: any) => {
                return { label: item.descripcion, value: item.id.toString() };
              });
            convenios.unshift({ label: "TODOS", value: "todos" });
            setOptionsConvenios(convenios);
            const bodegaxConvenio = data.data.map((item: any) => {
              return { idConvenio: item.id, bodega: item.bodegas };
            });
            setSelectedConvenio(bodegaxConvenio);
          })
        : null;
    }
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      const sum: number =
        selectedRows?.reduce(
          (accumulador: number, item: any) =>
            accumulador + parseFloat(item.total),
          0
        ) ?? 0;
      setRowselect(selectedRowKeys);
      setRowselectString(sum);
      selectedRowKeys.length == 0
        ? setBotonDeshabilitado(true)
        : setBotonDeshabilitado(false);
    },
    // selections: [Table.SELECTION_ALL, Table.SELECTION_NONE],
    selectedRowKeys: rowSelect,
    selectedRows: rowSelectString,
  };
  const hasSelected = rowSelect.length > 0;

  const envRowSelect = () => {
    setLoaderTable(true);
    setBotonDeshabilitado(true);
    if (rowSelect.length == 0) {
      notificationApi.open({
        type: "error",
        message: "No has seleccionado ninguna fila!",
      });
      return;
    }

    const newData = [
      { seleccion: rowSelect },
      { documento: control.getValues("tipo_documento") },
    ];

    if (allSelect) {
      const dataControl: any = {
        bodega: control.getValues("bodega"),
        convenio: control.getValues("convenio"),
        fechaFin: control.getValues("fechaFin"),
        fechaInicio: control.getValues("fechaInicio"),
        tercero_id: control.getValues("tercero_id"),
        tipo_documento: control.getValues("tipo_documento"),
        search: value,
      };
      newData.push(dataControl);
    }

    downloadZip(newData)
      .then(() => {
        notificationApi.open({
          type: "success",
          message: `Documento creado con exito!`,
        });
        setTimeout(() => {
          setRowselect([]);
          setDataSource([]);
          setRowselectString(0);
          setBotonDeshabilitado(false);
          setLoaderTable(false);
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
          setBotonDeshabilitado(false);
        }
      )
      .finally(() => setLoaderTable(false));
  };

  const checkCondition = ({ estado_id }: DataType) => {
    if (estado_id == "5") {
      return "red-row";
    } else {
      return "";
    }
  };
  const handleSelectAll = (selected: any) => {
    setAllSelect(selected);
  };

  const TODOS_BODEGAS_VALUE = -1;

  const handleComboBoxChangeConv = (convenios: string[]) => {
    const Bodegas: number[] = [];
    let conveniosSelect: string[] | any = convenios;
    if (convenios.includes("todos")) {
      conveniosSelect = optionsConvenios
        ?.filter((item) => item.value !== "todos")
        .map((item) => item.value);
      control.setValue("convenio", conveniosSelect);
    } else {
      control.setValue("convenio", convenios);
    }

    if (selectedConvenio && dataSource.length > 0) {
      setDataSource([]);
    }

    conveniosSelect.forEach((convenio: string) => {
      const filterCon = selectedConvenio?.find(
        (item) => item.idConvenio.toString() == convenio
      );

      const BodegasConv = filterCon ? JSON.parse(filterCon?.bodega) : "";
      BodegasConv.forEach((bodega: number) => {
        if (!Bodegas.includes(bodega)) {
          Bodegas.push(bodega);
        }
      });
    });

    getBodegas().then(({ data: { data } }) => {
      const todosOption = { label: "TODOS", value: TODOS_BODEGAS_VALUE };
      const bodegas = data
        .filter(
          (item) =>
            item.id_empresa == getSessionVariable(KEY_EMPRESA) &&
            item.estado == "1"
        )
        .filter((item) => Bodegas.includes(item.id))
        .map((item) => {
          return { label: item.bod_nombre, value: item.id };
        });
      // Combine "TODOS" option with sorted bodegas
      const allOptions = [todosOption, ...bodegas];

      setOptionsBodegas(allOptions);
    });
  };

  const handleComboBoxChangeBodega = (bodegas: number[]) => {
    if (bodegas.includes(TODOS_BODEGAS_VALUE)) {
      const allBodegasExceptTodos = optionsBodegas
        ?.filter((item) => item.value !== TODOS_BODEGAS_VALUE)
        .map((item) => item.value as number);
      control.setValue("bodega", allBodegasExceptTodos);
    } else {
      control.setValue("bodega", bodegas);
    }

    // Additional logic if needed when bodega selection changes
    if (dataSource.length > 0) {
      setDataSource([]);
    }
  };

  return (
    <>
      {contextHolder}
      <StyledCard title={"Consulta Documentos"}>
        <Row>
          <Col span={24} style={{ marginBottom: 10 }}>
            <Form layout={"vertical"} form={form}>
              <Row gutter={[12, 6]}>
                <Col span={24}>
                  <Row gutter={12}>
                    <Col xs={{ span: 24, order: 2 }} sm={{ span: 6, order: 1 }}>
                      <Controller
                        name={"tercero_id"}
                        control={control.control}
                        rules={{
                          required: {
                            value: busquedaDoc ? false : true,
                            message: "Cliente es requerido",
                          },
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <StyledFormItem
                            label={"Cliente:"}
                            required={busquedaDoc ? false : true}
                          >
                            {/* Este Select lo que hace es buscar el proveedor de acuerdo a lo que se digita en el Input, asi mismo alimenta el select 
                        y permite seleccionar un proveedor dentro de los resultados */}
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
                    <Col xs={{ span: 24, order: 2 }} sm={{ span: 8, order: 2 }}>
                      <Controller
                        control={control.control}
                        name={"razon_soc"}
                        render={({ field }) => (
                          <StyledFormItem label={"Razon Social :"}>
                            {/* <Space.Compact style={{ width: "100%" }}> */}
                            <Input {...field} disabled />
                            {/* </Space.Compact> */}
                          </StyledFormItem>
                        )}
                      />
                    </Col>
                    <Col
                      xs={{ span: 24, order: 4 }}
                      sm={{ span: 14, order: 4 }}
                    >
                      <Controller
                        name="convenio"
                        control={control.control}
                        rules={{
                          required: {
                            value: busquedaDoc ? false : true,
                            message: "Convenio es requerido",
                          },
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <StyledFormItem
                            required={busquedaDoc ? false : true}
                            label="Convenio :"
                          >
                            <Select
                              {...field}
                              allowClear
                              mode="multiple"
                              options={optionsConvenios}
                              placeholder={"Buscar Convenio"}
                              optionFilterProp="children"
                              maxTagCount={4}
                              // onChange={handleChangeSelectConvenio}
                              filterOption={(input, option) =>
                                (option?.label ?? "")
                                  .toString()
                                  .toLowerCase()
                                  .includes(input.toLowerCase())
                              }
                              // filterSort={(optionA, optionB) =>
                              //   (optionA?.label ?? "")
                              //     .toString()
                              //     .toLowerCase()
                              //     .localeCompare(
                              //       (optionB?.label ?? "")
                              //         .toString()
                              //         .toLowerCase()
                              //     )
                              // }
                              status={error && "error"}
                              onChange={handleComboBoxChangeConv}
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
                            value: busquedaDoc ? false : true,
                            message: "Rango de fechas es requerido",
                          },
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <StyledFormItem
                            required={busquedaDoc ? false : true}
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
                      xs={{ span: 12, order: 4 }}
                      sm={{ offset: 3, span: 6, order: 4 }}
                    >
                      <Controller
                        control={control.control}
                        name="bodega"
                        rules={{
                          required: {
                            value: busquedaDoc ? false : true,
                            message: "Bodega es requerido",
                          },
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <StyledFormItem
                            required={busquedaDoc ? false : true}
                            label={"Bodega:"}
                          >
                            <Select
                              {...field}
                              allowClear
                              mode="multiple"
                              placeholder="Bodega"
                              options={optionsBodegas}
                              maxTagCount={4}
                              filterOption={(input, option) =>
                                option?.value === TODOS_BODEGAS_VALUE
                                  ? true
                                  : (option?.label ?? "")
                                      .toString()
                                      .toLowerCase()
                                      .includes(input.toLowerCase())
                              }
                              filterSort={(optionA, optionB) =>
                                optionA.value === TODOS_BODEGAS_VALUE
                                  ? -1
                                  : optionB.value === TODOS_BODEGAS_VALUE
                                  ? 1
                                  : (optionA?.label ?? "")
                                      .toString()
                                      .toLowerCase()
                                      .localeCompare(
                                        (optionB?.label ?? "")
                                          .toString()
                                          .toLowerCase()
                                      )
                              }
                              status={error && "error"}
                              onChange={handleComboBoxChangeBodega}
                            />
                            <Text type="danger">{error?.message}</Text>
                          </StyledFormItem>
                        )}
                      />
                    </Col>
                    <Col
                      style={{ marginTop: 16 }}
                      sm={{ span: 6, order: 6, offset: 3 }}
                    >
                      <Checkbox onChange={onChange}>
                        Busqueda Documento
                      </Checkbox>
                      {busquedaDoc ? (
                        <Controller
                          name="numero_fve"
                          control={control.control}
                          rules={{
                            required: {
                              value: busquedaDoc ? true : false,
                              message: "Numero Documento es requerido",
                            },
                          }}
                          render={({ field, fieldState: { error } }) => (
                            <StyledFormItem
                              required={busquedaDoc ? true : false}
                            >
                              <Input
                                {...field}
                                placeholder={"Número de Documento"}
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
                    <Col xs={{ span: 6, order: 6 }} sm={{ span: 14, order: 5 }}>
                      <Controller
                        control={control.control}
                        name="tipo_documento"
                        rules={{
                          required: {
                            value: true,
                            message: "Tipo Documento es requerido",
                          },
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <StyledFormItem
                            required={true}
                            label="Tipo Documento :"
                          >
                            <Select {...field} options={optionsTipoDoc} />
                            <Text type="danger">{error?.message}</Text>
                          </StyledFormItem>
                        )}
                      />
                    </Col>
                    <Col
                      sm={{ span: 16, order: 7, offset: 4 }}
                      xs={{ span: 24, order: 7 }}
                    >
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Button
                          type="primary"
                          htmlType="submit"
                          onClick={control.handleSubmit(fetchFacturaVtaDis)}
                        >
                          Listar
                        </Button>
                        <GreenButton
                          style={{ marginLeft: 24 }}
                          icon={<DownloadOutlined />}
                          disabled={botonDeshabilitado}
                          onClick={envRowSelect}
                        >
                          Descargar zip
                        </GreenButton>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Form>
          </Col>
          <Col span={24}>
            <SearchBar>
              <Input
                placeholder="Buscar"
                onPressEnter={(event) => setValue(event.currentTarget.value)}
              />
            </SearchBar>
          </Col>
          <Col style={{ marginLeft: 8 }}>
            {hasSelected
              ? `Seleccionados ${
                  allSelect ? pagination?.total : rowSelect.length
                } items de ${pagination?.total} `
              : dataSource.length != 0
              ? `items total : ${pagination?.total}`
              : ""}
          </Col>
          <Col span={24} style={{ marginBottom: 10 }}>
            <Table
              rowSelection={{
                type: "checkbox",
                ...rowSelection,
                onSelectAll: handleSelectAll,
              }}
              className="custom-table"
              rowKey={(record) => record.id}
              size="small"
              dataSource={dataSource}
              columns={columns}
              loading={loaderTable}
              scroll={{ x: 1200 }}
              footer={() => (
                <FooterTable data={dataSource} selected={rowSelectString} />
              )}
              pagination={{
                onChange: (page: number) => {
                  setCurrentPage(page);
                },
                total: pagination?.total,
                pageSize: pagination?.per_page,
                hideOnSinglePage: true,
                simple: false,
                showTotal: () => {
                  return (
                    <>
                      <Text>Total Registros: {pagination?.total}</Text>
                    </>
                  );
                },
              }}
              rowClassName={checkCondition}
              locale={{
                selectionAll: "Seleccionar todo",
                selectNone: "Cancelar selección",
              }}
              bordered
            />
          </Col>
        </Row>
      </StyledCard>
    </>
  );
};
