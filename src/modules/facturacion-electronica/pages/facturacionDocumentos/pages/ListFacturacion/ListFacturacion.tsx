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
  RadioChangeEvent,
  Radio,
  Spin,
  Checkbox,
  Switch,
} from "antd";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SearchBar, StyledFormItem, GreenButton } from "./styled";
import { Convenios, DataType, Pagination } from "./types";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import useSessionStorage from "../../../../../common/hooks/useSessionStorage";
import { Controller, useForm } from "react-hook-form";
import fileDownload from "js-file-download";
import {
  getListaFacturaVtaDis,
  generarFVE,
  searchTerceros,
  getConvenios,
  generarInformeGeneral,
} from "@/services/facturacion/facturasAPI";
import { SaveOutlined, LoadingOutlined } from "@ant-design/icons";
import { getBodegasSebthi } from "@/services/maestras/bodegasAPI";
import { KEY_EMPRESA } from "@/config/api";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { FooterTable } from "../../components";
import { Bodega } from "@/services/types";
import TextArea from "antd/es/input/TextArea";

const { Text } = Typography;
const { RangePicker } = DatePicker;
let timeout: ReturnType<typeof setTimeout> | null;

const options = [
  { label: "Dispensacion", value: "DIS" },
  { label: "Venta Directa", value: "RVD" },
];

export const ListFacturacion = () => {
  const [loadingRow, setLoadingRow] = useState<any>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [selectionType, setSelectionType] = useState<"checkbox">("checkbox");
  const [pagination, setPagination] = useState<Pagination>({
    data: [],
    per_page: 10,
    total: 0,
    page: 1,
  });
  const [loaderTable, setLoaderTable] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [notificationApi, contextHolder] = notification.useNotification();
  const [optionsConvenios, setOptionsConvenios] = useState<
    SelectProps["options"]
  >([]);
  const [optionsBodegas, setOptionsBodegas] = useState<SelectProps["options"]>(
    []
  );
  const control = useForm();
  const [rowSelect, setRowselect] = useState<React.Key[]>([]);
  const [rowSelectString, setRowselectString] = useState<number>(0);
  const [valueCheck, setValueCheck] = useState("");
  const [valueTodos, setValueTodos] = useState("");
  const [check, setCheck] = useState(false);
  const [selectedConvenio, setSelectedConvenio] = useState<Convenios[]>();
  const { getSessionVariable } = useSessionStorage();
  const [botonDeshabilitado, setBotonDeshabilitado] = useState(false);
  const [optionDisabled, setOptionDisabled] = useState(false);
  const [loaderTerceros, setLoaderTerceros] = useState<boolean>(false);
  const [busquedaFve, setBusquedaFve] = useState<boolean>(false);
  const [suma, setSuma] = useState<number>(0);
  const [totalSelection, setTotalSelection] = useState<any>(0);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [switchState, setSwitchState] = useState<boolean>(true);
  const [bodegas, setBodegas] = useState<Bodega[]>([]);
  const [bodegasConvenio, setBodegasConvenio] = useState<number[]>([]);
  const [textoFiltro, setTextoFiltro] = useState("");
  const [filteredData, setFilteredData] = useState(dataSource);


  const plainOptions = [
    { label: "Documento a Documento", value: 0 },
    { label: "Documento Único nuevo", value: 1 },
  ];

  const TODOS_BODEGAS_VALUE = -1;

  const onChangeCheck = ({ target: { value } }: RadioChangeEvent) => {
    setValueCheck(value);
    control.setValue("tipo_documento", value);
  };

  const onChangeTodos = ({ target: { value, checked } }: RadioChangeEvent) => {
    setValueTodos(value);
    setCheck(checked);
    if (checked) {
      setBotonDeshabilitado(false);
    }
  };

  const onChange = (e: CheckboxChangeEvent) => {
    control.setValue("numero_doc", "");
    setBusquedaFve(e.target.checked);
  };

  const watchCliente = control.watch("tercero_id");
  const watchconvenio = control.watch("convenio");
  const watchbodega = control.watch("bodega");


  // Funcion para buscar el proveedor por medio de un query, esta consulta busca por NIT y nombre del proveedor
  const handleSearchProveedor = (event: any) => {
    const query = event.target.value.toString();
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (query.length > 0) {
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
      control.setValue("bodega", []);
      setOptionsBodegas([]);
      setRowselect([]);
      setValueCheck("");
      setValueTodos("");
      setRowselectString(0);
      if (dataSource) {
        setInitialData([]);
        setDataSource([]);
        setRowselectString(0);
        control.setValue("tipo_documento", "");
      }
    }
  }, [watchCliente]);

  useEffect(() => {
    if (watchconvenio == "") {
      control.setValue("bodega", []);
      setOptionsBodegas([]);
    }
    setRowselect([]);
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
    console.log(data);
    setRowselect(data);
  };

  //  const seleccionados=(select:boolean)=>{
  //   let value=0;
  //   select? value=pagination.total: value = rowSelect.length
  //      return{value}
  //  }
  const fetchFacturaVtaDis = (value: any) => {
    
    const data = {
      page: value.page,
      data: value,
    };
    getListaFacturaVtaDis(data)
      .then(({ data }) => {
        setSuma(parseInt(data.suma));
        const responseData = data.data.data.length == 0;
        const validation = typeof data;
        if (responseData || validation === "string") {
          notificationApi.open({
            type: "warning",
            message: `No hay datos en su Busqueda!`,
          });
        } else {
          const listaFactVdis: DataType[] = data.data.data.map((item) => {
            return {
              key: item.id,
              consecutivo: item.consecutivo,
              created_at: dayjs(item.created_at).format("DD-MM-YYYY HH:mm"),
              nombre_estado: item.nombre_estado
                ? item.nombre_estado
                : "PARA FACTURAR",
              nit: item.nit,
              num_contrato: item.num_contrato,
              observacion: item.observacion,
              bodega: item.bod_nombre,
              codigo: "",
              total: item.total,
              tercero: item.nit + " - " + item.razon_soc,
            };
          });
          setInitialData(listaFactVdis);
          setDataSource(listaFactVdis);
          setFilteredData(dataSource);
          checkSelectAll(listaFactVdis, selectAll);
          setLoaderTable(false);
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
          // setRowselect(value?.rowSelect);
          // setTotalSelection(value?.totalSelection);
          setPagination(data.data);
        }
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

  const columns: ColumnsType<DataType> = [
    {
      title: "consecutivo",
      dataIndex: "consecutivo",
      key: "consecutivo",
      width: 60,
    },
    {
      title: "Contrato",
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
      title: "Bodega",
      dataIndex: "bodega",
      key: "bodega",
      width: 100,
    },
    {
      title: "Fecha",
      dataIndex: "created_at",
      key: "created_at",
      width: 80,
    },
    {
      title: "Valor",
      dataIndex: "total",
      key: "total",
      width: 80,
      render(_, { total }) {
        return <>$ {parseFloat(total).toLocaleString("es-CO")}</>;
      },
    },
    {
      title: "Estado Auditoria",
      dataIndex: "nombre_estado",
      key: "nombre_estado",
      align: "center",
      width: 120,
    },
  ];

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
      setValueTodos("");
      setCheck(false);
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
    if (rowSelect.length == 0) {
      notificationApi.open({
        type: "error",
        message: "No has seleccionado ninguna fila!",
      });
      setTimeout(() => {
        // navigate(
        //   `/${url_split.at(1)}/${url_split.at(2)}/${codigo_documento}`
        // );
      }, 1500);
      return;
    }

    const newData = [
      { UnoAuno: valueTodos },
      { seleccion: rowSelect },
      { convenio: control.getValues("convenio").toString() },
      { documento: control.getValues("tipo_documento") },
      { bodega: control.getValues("bodega") },
    ];

    const dataControl: any = {
      bodega: control.getValues("bodega"),
      convenio: control.getValues("convenio"),
      fechaFin: control.getValues("fechaFin"),
      fechaInicio: control.getValues("fechaInicio"),
      fechas: control.getValues("fechas"),
      razon_soc: control.getValues("razon_soc"),
      tercero_id: control.getValues("tercero_id"),
      tipo_documento: control.getValues("tipo_documento"),
      page: 1,
    };
    generarFVE(newData)
      .then(() => {
        setBotonDeshabilitado(true);
        notificationApi.open({
          type: "success",
          message: `Documento creado con exito!`,
        });
        setTimeout(() => {
          // navigate(location.pathname);
          // control.reset();
          // fetchFacturaVtaDis(dataControl);
          setRowselect([]);
          setDataSource([]);
          // setValueCheck("");
          // setValueTodos("");
          // setBotonDeshabilitado(false);
          setRowselectString(0);
        }, 1000);
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
        }
      );
  };

  const handleComboBoxChange = () => {
    const tercero = control.getValues("tercero_id");
    getConvenios().then(({ data }) => {
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
    });
  };

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

  useEffect(() => {
    setFilteredData(dataSource);
  }, [dataSource]);

  const filtrarData = (filtro:any) => {
    if (!filtro) {
      setFilteredData(dataSource);
      return;
    }

    const filtros = filtro.split(";").map(item => item.trim().toLowerCase());

    const filtrados = dataSource.filter(item =>
      filtros.some(f =>
        Object.values(item).some(value =>
          value?.toString().toLowerCase().includes(f)
        )
      )
    );

    setFilteredData(filtrados);
  };

  return (
    <>
      {contextHolder}
      <StyledCard title={"Generación FVE"}>
        <Row>
          <Col span={24} style={{ marginBottom: 10 }}>
            <Form layout={"vertical"} form={form}>
              <Row gutter={[12, 6]}>
                <Col span={24}>
                  <Row gutter={12}>
                    <Col xs={{ span: 24, order: 1 }} sm={{ span: 6, order: 2 }}>
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
                            {/* <Space.Compact style={{ width: "100%" }}> */}
                            <Input {...field} disabled />
                            {/* </Space.Compact> */}
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
                            label="Convenio:"
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
                            label={ <div style={{ display: "flex", alignItems: "center" }}>
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
                    {rowSelect?.length > 0 ? (
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
                      </Col>
                    ) : null}
                    <Col xs={{ span: 6, order: 4 }} sm={{ span: 6, order: 6 }}>
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
                              disabled={rowSelect?.length > 0}
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
                    {/* <Col sm={{ span: 6, order: 6 }} xs={{ span: 24, order: 6 }}>
                      <Checkbox onChange={onChange}>
                        Busqueda Por Documento
                      </Checkbox>
                      {busquedaFve ? (
                        <Controller
                          name="numero_doc"
                          control={control.control}
                          // rules={{
                          //   required: {
                          //     value: busquedaFve ? true : false,
                          //     message: "Numero Documento es requerido",
                          //   },
                          // }}
                          render={({ field, fieldState: { error } }) => (
                            <StyledFormItem>
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
                    </Col> */}
                    <Col sm={{ span: 16, order: 7, offset:1 }} xs={{ span: 24, order: 7 }}>
                      <Checkbox onChange={onChange}>
                        Busqueda Por Lista
                      </Checkbox>
                      {busquedaFve ? (
                        <Controller
                          name="numero_doc"
                          control={control.control}
                          render={({ field, fieldState: { error } }) => (
                            <StyledFormItem>
                              <TextArea 
                                rows={4}
                                {...field}
                                placeholder={"Número de Documento"}
                                allowClear
                                value={textoFiltro}
                                onChange={(e) => {
                                  setTextoFiltro(e.target.value);
                                  filtrarData(e.target.value);
                                }}
                              />
                            </StyledFormItem>
                          )}
                        />
                      ) : null}
                    </Col>
                    <Col sm={{ span: 16, order: 7, offset: 4 }}>
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
                          disabled={
                            rowSelection.onChange.length == 0 ? true : false
                          }
                          onClick={control.handleSubmit(fetchFacturaVtaDis)}
                        >
                          Listar
                        </Button>
                        <GreenButton
                          onClick={() => {
                            setLoaderTable(true);
                            const data = {
                              bodega: control.getValues("bodega"),
                              convenio: control.getValues("convenio"),
                              fechaFin: control.getValues("fechaFin"),
                              fechaInicio: control.getValues("fechaInicio"),
                              fechas: control.getValues("fechas"),
                              razon_soc: control.getValues("razon_soc"),
                              tercero_id: control.getValues("tercero_id"),
                              tipo_documento:
                                control.getValues("tipo_documento"),
                            };
                            generarInformeGeneral(data)
                              .then(({ data }) => {
                                fileDownload(
                                  data,
                                  "INFORME CONVERTIR DISPENSACION A FVE.xlsx"
                                );
                              })
                              .finally(() => setLoaderTable(false));
                          }}
                        >
                          Generar Informe
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
              <Input placeholder="Buscar" onChange={handleSearch} />
            </SearchBar>
          </Col>
          {/* <Col style={{ marginLeft: 8 }}>
            {hasSelected
              ? `Seleccionados ${seleccionados(selectAll)} documentos de ${pagination.total} `
              : pagination.total != 0
              ? `Documentos total : ${pagination.total}`
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
              dataSource={filteredData}
              columns={columns}
              loading={loaderTable}
              footer={() => (
                <FooterTable data={suma} selected={rowSelectString} />
              )}
              pagination={{
                onChange: handlePageChange,
                total: pagination?.total,
                pageSize: pagination?.per_page,
                hideOnSinglePage: true,
                simple: false,
                showTotal: (total = pagination?.total) => {
                  return (
                    <>
                      <Text>Total Registros: {total}</Text>
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
          <Col span={24} style={{ display: "flex", justifyContent: "center" }}>
            <Space>
              <>
                <Button
                  // htmlType="submit"
                  type="primary"
                  disabled={
                    check == false || botonDeshabilitado == true ? true : false
                  }
                  icon={<SaveOutlined />}
                  onClick={envRowSelect}
                >
                  Generar FVE
                </Button>
              </>
            </Space>
          </Col>
        </Row>
      </StyledCard>
    </>
  );
};
