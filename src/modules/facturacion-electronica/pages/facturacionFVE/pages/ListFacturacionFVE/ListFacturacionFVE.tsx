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
  Switch,
} from "antd";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { SearchBar, StyledFormItem } from "./styled";
import { DataType, Pagination, Convenios } from "./types";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";
import {
  SaveOutlined,
  FilePdfFilled,
  LoadingOutlined,
  StopOutlined,
} from "@ant-design/icons";
import {
  generacionCufe,
  getListaFacturaFVE,
  getRPGrafica,
  getConvenios,
  anularDoc,
  anulacionMasiva,
} from "@/services/facturacion/facturacionFveAPI";
import { searchTerceros } from "@/services/facturacion/facturasAPI";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { FooterTable } from "../../components";
import { getBodegasSebthi } from "@/services/maestras/bodegasAPI";
import useSessionStorage from "../../../../../common/hooks/useSessionStorage";
import { KEY_EMPRESA, KEY_ROL } from "@/config/api";

const { Text } = Typography;
const { RangePicker } = DatePicker;
let timeout: ReturnType<typeof setTimeout> | null;

const options = [
  { label: "Dispensacion", value: "DIS" },
  { label: "Venta Directa", value: "RVD" },
  { label: "Venta Concepto", value: "FVC" },
  { label: "Cuota Moderadora", value: "CUO" },
];

export const ListFacturacionFVE = () => {
  const [loadingRow, setLoadingRow] = useState<any>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [selectionType, setSelectionType] = useState<"checkbox">("checkbox");
  const [pagination, setPagination] = useState<Pagination>();
  const [loaderTable, setLoaderTable] = useState<boolean>(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [notificationApi, contextHolder] = notification.useNotification();
  const [optionsConvenios, setOptionsConvenios] = useState<
    SelectProps["options"]
  >([]);
  const location = useLocation();
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
  const [rowSelectString, setRowselectString] = useState<number>(0);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [totalSelection, setTotalSelection] = useState<any>(0);
  const [optionsBodegas, setOptionsBodegas] = useState<SelectProps["options"]>(
    []
  );
  const [selectedConvenio, setSelectedConvenio] = useState<Convenios[]>();
  const [optionDisabled, setOptionDisabled] = useState(false);
  const { getSessionVariable } = useSessionStorage();
  const [valueTodos, setValueTodos] = useState("");
  const [check, setCheck] = useState(false);
  const [switchState, setSwitchState] = useState<boolean>(true);
  const [bodegas, setBodegas] = useState<Bodega[]>([]);
  const [bodegasConvenio, setBodegasConvenio] = useState<number[]>([]);

  const generarPDF = (keyd: string, key: React.Key, tipoDoc: string) => {
    getRPGrafica(keyd.toString(), key.toString(), tipoDoc).then((data) => {
      const file = new Blob([data.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    });
  };

  const plainOptions = [
    { label: "Documento a Documento", value: 0 },
    { label: "Documento Único nuevo", value: 1 },
  ];

  const onChangeTodos = ({ target: { value, checked } }: RadioChangeEvent) => {
    setValueTodos(value);
    setCheck(checked);
  };

  const onChangeCheck = ({ target: { value } }: RadioChangeEvent) => {
    setValueCheck(value);
    control.setValue("tipo_documento", value);
  };

  const onChange = (e: CheckboxChangeEvent) => {
    control.setValue("numero_fve", "");
    setBusquedaFve(e.target.checked);
  };

  const watchCliente = control.watch("tercero_id");
  const watchconvenio = control.watch("convenio");
  const watchbodega = control.watch("bodega");

  const handleAnulacionMasiva = () => {
    if (rowSelect.length === 0) {
      notificationApi.open({
        type: "error",
        message: "No has seleccionado ninguna fila!",
      });
      return;
    }
  
    if (!valueCheck) {
      notificationApi.open({
        type: "error",
        message: "Debes seleccionar un tipo de documento!",
      });
      return;
    }
  
    const data = {
      seleccion: rowSelect,
      documento: control.getValues("tipo_documento"),
      UnoAuno: valueTodos, 
      convenio: control.getValues("convenio")
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
          setSelectAll(false);
          
          const dataControl = {
            bodega: control.getValues("bodega"),
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
  const rol = getSessionVariable(KEY_ROL);

  useEffect(() => {
    if (watchCliente == "") {
      control.setValue("razon_soc", "");
      control.setValue("convenio", []);
      control.setValue("bodega", []);
      if (dataSource) {
        setOptionsBodegas([]);
        setInitialData([]);
        setDataSource([]);
        setRowselect([]);
        setRowselectString(0);
      }
    }
  }, [watchCliente]);

  useEffect(() => {
    if (watchconvenio == "") {
      control.setValue("bodega", []);
      setOptionsBodegas([]);
    }
    if (dataSource.length > 0) {
      setInitialData([]);
      setDataSource([]);
      setRowselect([]);
      setRowselectString(0);
    }
  }, [watchconvenio]);

  useEffect(() => {
    if (dataSource.length > 0) {
      setInitialData([]);
      setDataSource([]);
      setRowselect([]);
      setRowselectString(0);
    }
  }, [watchbodega]);

  useEffect(() => {

    control.setValue("bodega",[])
        const todosOption = { label: "TODOS", value: TODOS_BODEGAS_VALUE };
        const bodegasSelect = bodegas
            .filter(
              (item) =>
                item.id_empresa == getSessionVariable(KEY_EMPRESA) &&
                item.estado == (switchState ?  "1": "0")
            )
            .filter((item) => bodegasConvenio.includes(item.id))
            .map((item) => {
              return { label: item.bod_nombre, value: item.id };
            });
            const allOptions = [todosOption, ...bodegasSelect];
            setOptionsBodegas(allOptions);
            
      }, [switchState]);

  const handleSwitchChange = (checked:any) => {
    setSwitchState(checked);
    
  };

  //seleccionar todos las filas sin importar el paginado
  const checkSelectAll = (items: DataType[], selected: boolean) => {
    const newItems: React.Key[] = [];
    selected
      ? items.forEach((item: DataType) => {
          if (!rowSelect.some((row) => row == item.key)) {
            newItems.push(item.key);
          }
        })
      : null;
    const data = !selected ? [] : rowSelect.concat(newItems);
    setRowselect(data);
  };

  const fetchFacturaVtaDis = (value: any) => {
    value.page = value.page ? value.page : 1;
    const data = {
      data: value,
      UnoAuno: valueTodos,
    };
    getListaFacturaFVE(data)
      .then(({ data: { data } }) => {
        setPagination(data);
        const responseData = data.data.length == 0;

        if (responseData) {
          notificationApi.open({
            type: "warning",
            message: `No hay Datos En su Busqueda!`,
          });
        }
        const listaFactVdis: DataType[] = data.data.map((item) => {
          return {
            key: item.id,
            id: item.id,
            consecutivos: item.consecutivos
              ? Object.values(item.consecutivos).join(", ")
              : "",
            estado_id: item.estado_id,
            fecha_emision: item.fecha_emision,
            fecha_vencimiento: item.fecha_vencimiento,
            impuesto: item.impuesto,
            nit: item.nit,
            bodega: item.bod_nombre,
            num_contrato: item.num_contrato,
            numero_factura_vta: item.numero_factura_vta,
            numero_fve: item.numero_fve,
            subtotal: item.subtotal,
            total: item.total,
            tercero: item.nit + " - " + item.razon_soc,
            conveni_nit: item.conveni_nit,
          };
        });
        setInitialData(listaFactVdis);
        setDataSource(listaFactVdis);
        setLoaderTable(false);
        checkSelectAll(listaFactVdis, selectAll);
        setLoadingRow([]);
        if (value.rowSelectString) {
          setRowselectString(value?.rowSelectString);
        }
        if (value.rowSelect && !selectAll) {
          setRowselect(value?.rowSelect);
        }
        if (value.totalSelection) {
          setTotalSelection(value?.totalSelection);
        }

        // setPagination(data);
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

  const handlePageChange = (page: any) => {
    const dataControl: any = {
      bodega: control.getValues("bodega"),
      convenio: control.getValues("convenio"),
      fechaFin: control.getValues("fechaFin"),
      fechaInicio: control.getValues("fechaInicio"),
      fechas: control.getValues("fechas"),
      razon_soc: control.getValues("razon_soc"),
      tercero_id: control.getValues("tercero_id"),
      tipo_documento: control.getValues("tipo_documento"),
      documento_a_documento: control.getValues("documento_a_documento"),
      rowSelect,
      rowSelectString,
      page,
    };
    fetchFacturaVtaDis(dataControl);
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

  const columns: ColumnsType<DataType | any> = [
    {
      title: "Numero FVE",
      dataIndex: "numero_fve",
      key: "numero_fve",
      width: 100,
      sorter: (a, b) => a.numero_fve - b.numero_fve,
      render: (
        _,
        record: {
          key: React.Key;
          numero_fve: string;
          tipoDoc: string;
          numero_factura_vta: string;
        }
      ) => {
        const partes: string[] = record.numero_fve.split("-");
        const doc: string = partes[0];
        let documento = "";
        doc == "FVC"
          ? (documento = record.numero_factura_vta)
          : (documento = record.numero_fve);
        return <>{documento}</>;
      },
    },
    {
      title: "Documento Origen",
      dataIndex: "consecutivos",
      key: "consecutivos",
      width: 100,
      render: (
        _,
        record: {
          key: React.Key;
          numero_fve: string;
          tipoDoc: string;
          consecutivos: string;
        }
      ) => {
        const partes: string[] = record.numero_fve.split("-");
        const doc: string = partes[0];
        let documento = "";
        doc === "FVC"
          ? (documento = record.numero_fve)
          : (documento = record.consecutivos);
        return <>{documento}</>;
      },
    },
    {
      title: "Convenio",
      dataIndex: "num_contrato",
      key: "num_contrato",
      width: 100,
    },
    {
      title: "Cliente",
      dataIndex: "tercero",
      key: "tercero",
      width: 100,
    },
    {
      title: "Fecha Emision",
      dataIndex: "fecha_emision",
      key: "fecha_emision",
      width: 80,
      sorter: (a, b) => a.fecha_emision - b.fecha_emision,
    },
    {
      title: "Fecha Vencimiento",
      dataIndex: "fecha_vencimiento",
      key: "fecha_vencimiento",
      width: 80,
      sorter: (a, b) => a.fecha_vencimiento - b.fecha_vencimiento,
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
      render(_, { impuesto, subtotal, total }) {
        return (
          <>
            ${" "}
            {parseFloat(
              impuesto === undefined ? total - subtotal : impuesto
            ).toLocaleString("es-CO")}
          </>
        );
      },
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: 80,
      align: "center",
      fixed: "right",
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
      render: (
        _,
        record: {
          key: React.Key;
          numero_fve: string;
          tipoDoc: string;
          conveni_nit: string;
        }
      ) => {
        return (
          <Space>
            <Tooltip title="Ver Prefactura">
              <Button
                size="small"
                key={record.key + "pdf"}
                onClick={() =>
                  generarPDF(record.numero_fve, record.key, valueCheck)
                }
              >
                <FilePdfFilled className="icono-rojo" />
              </Button>
            </Tooltip>
            {[
              "revisor_compras",
              "administrador",
              "facturacion",
              "cotizaciones",
            ].includes(rol) ? (
              <Tooltip title="Anular documento">
                <Button
                  danger
                  type="primary"
                  size="small"
                  key={record.key + "anular"}
                  onClick={() =>
                    anularDoc(
                      record.key,
                      control.getValues("tipo_documento"),
                      control.getValues("convenio")
                    ).then(() => {
                      notificationApi.open({
                        type: "success",
                        message: `Documento Anulado con exito!`,
                      });
                      setTimeout(() => {
                        setRowselect([]);
                        setDataSource([]);
                        setBotonDeshabilitado(false);
                        setLoading(false);
                        setRowselectString(0);
                      }, 1500);
                    })
                  }
                >
                  <StopOutlined />
                </Button>
              </Tooltip>
            ) : null}
          </Space>
        );
      },
      width: 70,
    },
  ];

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
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      const sum: number =
        selectedRows?.reduce(
          (accumulador: number, item: any) =>
            accumulador + parseFloat(item.total),
          0
        ) ?? 0;
      setRowselect(selectedRowKeys);
      setTotalSelection(selectedRows);
      setRowselectString(sum);
    },
    onSelectAll: (selected: boolean) => {
      checkSelectAll(dataSource, selected);
      setSelectAll(selected);
      // seleccionados(selected);
    },
    selectedRowKeys: rowSelect,
    selectedRows: rowSelectString,
  };
  // const hasSelected = rowSelect.length > 0;
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
      { documento: control.getValues("tipo_documento") },
    ];

    const dataControl: any = {
      convenio: control.getValues("convenio"),
      fechaFin: control.getValues("fechaFin"),
      fechaInicio: control.getValues("fechaInicio"),
      fechas: control.getValues("fechas"),
      razon_soc: control.getValues("razon_soc"),
      tercero_id: control.getValues("tercero_id"),
      tipo_documento: control.getValues("tipo_documento"),
    };

    generacionCufe(newData)
      .then(() => {
        setBotonDeshabilitado(true);
        notificationApi.open({
          type: "success",
          message: `Documento creado con exito!`,
        });
        setTimeout(() => {
          setRowselect([]);
          setDataSource([]);
          setBotonDeshabilitado(false);
          setLoading(false);
          setRowselectString(0);
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

            const bodegaxConvenio = data.data.map((item: any) => {
              return { idConvenio: item.id, bodega: item.bodegas };
            });
            setSelectedConvenio(bodegaxConvenio);
          })
        : null;
    }
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
    setOptionDisabled(control.getValues("convenio").length > 1 ? true : false);

    if (selectedConvenio && dataSource.length > 0) {
      setInitialData([]);
      setDataSource([]);
      // setRowselectString(0);
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
    setBodegasConvenio(Bodegas);
    getBodegasSebthi().then(({ data: { data } }) => {
      const todosOption = { label: "TODOS", value: TODOS_BODEGAS_VALUE };
      setBodegas(data)
      const bodegas = data
        .filter(
          (item) =>
            item.id_empresa == getSessionVariable(KEY_EMPRESA) &&
            item.estado == (switchState ?  "1": "0")
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
      setInitialData([]);
      setDataSource([]);
    }
  };

  return (
    <>
      <Spin spinning={loading}>
        {contextHolder}
        <StyledCard title={"Solicitud Cufe FVE"}>
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
                                maxTagCount={4}
                                mode="multiple"
                                options={optionsConvenios}
                                placeholder={"Buscar Convenio"}
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
                        xs={{ span: 12, order: 3 }}
                        sm={{ offset: 3, span: 6, order: 5 }}
                      >
                        <Controller
                          control={control.control}
                          name="bodega"
                          rules={{
                            required: {
                              value: busquedaFve ? false : true,
                              message: "Bodega es requerido",
                            },
                          }}
                          render={({ field, fieldState: { error } }) => (
                            <StyledFormItem
                              required={busquedaFve ? false : true}
                              label={<div style={{ display: "flex", alignItems: "center" }}>
                              <span style={{ marginRight: "8px" }}>Bodega:</span>
                              <Switch checkedChildren="Activo" unCheckedChildren="Inactivo" 
                                       onChange={handleSwitchChange} checked={switchState}
                                       />
                            </div>}
                            >
                              <Select
                                {...field}
                                allowClear
                                maxTagCount={4}
                                mode="multiple"
                                placeholder="Bodega"
                                options={optionsBodegas}
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
                        style={{ marginTop: 3 }}
                        sm={{ span: 6, order: 5, offset: 3 }}
                      >
                        <Checkbox onChange={onChange}>
                          Busqueda Por FVE
                        </Checkbox>
                        {busquedaFve ? (
                          <Controller
                            name="numero_fve"
                            control={control.control}
                            rules={{
                              required: {
                                value: busquedaFve ? true : false,
                                message: "Numero FVE es requerido",
                              },
                            }}
                            render={({ field, fieldState: { error } }) => (
                              <StyledFormItem>
                                <Input
                                  {...field}
                                  placeholder={"Número de FVE"}
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
                      <Col
                        xs={{ span: 24, order: 4 }}
                        sm={{ offset: 17, span: 6, order: 6 }}
                        // style={{ marginTop: -12}}
                      >
                        <Radio.Group
                          options={plainOptions}
                          onChange={onChangeTodos}
                          value={valueTodos}
                        />
                        <Button
                          danger
                          type="primary"
                          htmlType="submit"
                          disabled={rowSelect.length === 0 || !valueCheck}
                          onClick={handleAnulacionMasiva}
                        >
                          Anulación Masiva
                        </Button>
                      </Col>
                      <Col
                        xs={{ span: 12, order: 4 }}
                        sm={{ span: 24, order: 6 }}
                      >
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
                            <StyledFormItem>
                              <Radio.Group
                                {...field}
                                disabled={rowSelect.length > 0}
                                options={options}
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
                    </Row>
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
            {/* <Col style={{ marginLeft: 8 }}>
              {hasSelected
                ? `Seleccionados ${rowSelect.length} items de ${dataSource.length} `
                : dataSource.length != 0
                ? `items total : ${dataSource.length}`
                : ""}
            </Col> */}
            <Col span={24} style={{ marginBottom: 10 }}>
              <Table
                rowSelection={{
                  type: selectionType,
                  preserveSelectedRowKeys: true,
                  ...rowSelection,
                }}
                className="custom-table"
                rowKey={(record) => record.key}
                size="small"
                dataSource={dataSource}
                columns={columns}
                loading={loaderTable}
                footer={() => (
                  <FooterTable data={dataSource} selected={rowSelectString} />
                )}
                pagination={{
                  onChange: handlePageChange,
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
                    disabled={
                      rowSelect.length == 0 || botonDeshabilitado == true
                        ? true
                        : false
                    }
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
