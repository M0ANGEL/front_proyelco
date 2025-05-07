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
  Spin,
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
  searchTerceros,
  getConvenios,
  generarInformeGeneral,
} from "@/services/facturacion/facturasAPI";
import {
  getListaDisCuotaModeradora,
  generarFVE,
} from "@/services/facturacion/cuotaModeradoraAPI";
import { SaveOutlined, LoadingOutlined } from "@ant-design/icons";
import { getBodegasSebthi } from "@/services/maestras/bodegasAPI";
import { KEY_EMPRESA } from "@/config/api";
import { FooterTable } from "../../components";
import { Bodega } from "@/services/types";

const { Text } = Typography;
const { RangePicker } = DatePicker;
let timeout: ReturnType<typeof setTimeout> | null;

export const ListCuotas = () => {
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
  const [selectedConvenio, setSelectedConvenio] = useState<Convenios[]>();
  const { getSessionVariable } = useSessionStorage();
  const [optionDisabled, setOptionDisabled] = useState(false);
  const [loaderTerceros, setLoaderTerceros] = useState<boolean>(false);
  const [busquedaFve, setBusquedaFve] = useState<boolean>(false);
  const [suma, setSuma] = useState<number>(0);
  const [totalSelection, setTotalSelection] = useState<any>(0);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [switchState, setSwitchState] = useState<boolean>(true);
  const [bodegas, setBodegas] = useState<Bodega[]>([]);
  const [bodegasConvenio, setBodegasConvenio] = useState<number[]>([]);
  const [filteredData, setFilteredData] = useState(dataSource);

  const TODOS_BODEGAS_VALUE = -1;

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
      setRowselectString(0);
      if (dataSource) {
        setInitialData([]);
        setDataSource([]);
        setRowselectString(0);
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
    control.setValue("bodega", []);
    const todosOption = { label: "TODOS", value: TODOS_BODEGAS_VALUE };
    const bodegasSelect = bodegas
      .filter(
        (item) =>
          item.id_empresa == getSessionVariable(KEY_EMPRESA) &&
          item.estado == (switchState ? "1" : "0")
      )
      .filter((item) => bodegasConvenio.includes(item.id))
      .map((item) => {
        return { label: item.bod_nombre, value: item.id };
      });
    const allOptions = [todosOption, ...bodegasSelect];
    setOptionsBodegas(allOptions);
  }, [switchState]);

  const handleSwitchChange = (checked: any) => {
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
    const data = {
      page: value.page,
      data: value,
    };
    getListaDisCuotaModeradora(data)
      .then(({ data }) => {
        console.log(data);
        setSuma(parseInt(data.suma));
        const responseData = data.data.data.length == 0;
        const validation = typeof data;
        if (responseData || validation === "string") {
          notificationApi.open({
            type: "warning",
            message: `No hay datos en su Busqueda!`,
          });
        } else {
          const listaDisCuota: DataType[] = data.data.data.map((item) => {
            return {
              key: item.id,
              created_at: dayjs(item.created_at).format("DD-MM-YYYY HH:mm"),
              consecutivo: item.consecutivo,
              consecutivo_recaudo: item.consecutivo_recaudo,
              tipo_identificacion: item.tipo_identificacion,
              numero_identificacion: item.numero_identificacion,
              nombre_completo: item.nombre_completo,
              valor_cuota: item.valor_cuota,
              num_contrato: item.num_contrato,
              descripcion: item.descripcion,
              bod_nombre: item.bod_nombre,
            };
          });
          setInitialData(listaDisCuota);
          setDataSource(listaDisCuota);
          setFilteredData(dataSource);
          checkSelectAll(listaDisCuota, selectAll);
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
      title: "consecutivo dispensacion",
      dataIndex: "consecutivo",
      key: "consecutivo",
      width: 60,
    },
    {
      title: "consecutivo recaudo",
      dataIndex: "consecutivo_recaudo",
      key: "consecutivo_recaudo",
      width: 60,
    },
    {
      title: "tipo",
      dataIndex: "tipo_identificacion",
      key: "tipo_identificacion",
      width: 40,
    },
    {
      title: "identificacion",
      dataIndex: "numero_identificacion",
      key: "numero_identificacion",
      width: 40,
    },
    {
      title: "nombre completo",
      dataIndex: "nombre_completo",
      key: "nombre_completo",
      width: 100,
    },
    {
      title: "valor cuota",
      dataIndex: "valor_cuota",
      key: "valor_cuota",
      width: 60,
    },
    {
      title: "numero contrato",
      dataIndex: "num_contrato",
      key: "num_contrato",
      width: 60,
    },
    {
      title: "fecha",
      dataIndex: "created_at",
      key: "created_at",
      width: 80,
    },
    {
      title: "descripcion",
      dataIndex: "descripcion",
      key: "descripcion",
      width: 80,
      render(_, { valor_cuota }) {
        return <>$ {parseFloat(valor_cuota).toLocaleString("es-CO")}</>;
      },
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
    },
    onSelectAll: (selected: boolean) => {
      checkSelectAll(dataSource, selected);
      setSelectAll(selected);
    },
    selectedRowKeys: rowSelect,
    selectedRows: rowSelectString,
  };

  const envRowSelect = () => {
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
      { seleccion: rowSelect },
    ];

    const dataControl: any = {
      bodega: control.getValues("bodega"),
      convenio: control.getValues("convenio"),
      fechaFin: control.getValues("fechaFin"),
      fechaInicio: control.getValues("fechaInicio"),
      fechas: control.getValues("fechas"),
      razon_soc: control.getValues("razon_soc"),
      tercero_id: control.getValues("tercero_id"),
      page: 1,
    };
    generarFVE(newData)
      .then(() => {
        notificationApi.open({
          type: "success",
          message: `Documento creado con exito!`,
        });
        setTimeout(() => {
          setRowselect([]);
          setDataSource([]);
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
      setBodegas(data);

      const bodegas = data
        .filter(
          (item) =>
            item.id_empresa == getSessionVariable(KEY_EMPRESA) &&
            item.estado == (switchState ? "1" : "0")
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

  return (
    <>
      {contextHolder}
      <StyledCard title={"Generación FVE Cuota Moderadora"}>
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
                              filterOption={(input, option) =>
                                (option?.label ?? "")
                                  .toString()
                                  .toLowerCase()
                                  .includes(input.toLowerCase())
                              }
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
                            label={
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <span style={{ marginRight: "8px" }}>
                                  Bodega:
                                </span>
                                <Switch
                                  checkedChildren="Activo"
                                  unCheckedChildren="Inactivo"
                                  onChange={handleSwitchChange}
                                  checked={switchState}
                                />
                              </div>
                            }
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
                  icon={<SaveOutlined />}
                  onClick={envRowSelect}
                >
                  Generar FVE Cuota Moderadora
                </Button>
              </>
            </Space>
          </Col>
        </Row>
      </StyledCard>
    </>
  );
};
