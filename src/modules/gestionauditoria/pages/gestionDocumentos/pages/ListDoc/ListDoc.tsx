/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import useArrayBuffer from "@/modules/common/hooks/useArrayBuffer";
import { GreenButton, SearchBar, StyledFormItem } from "./styled";
import { getConvenios } from "@/services/facturacion/facturasAPI";
import { ModalUpLoad } from "../../components/Modal/Modal";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { Controller, useForm } from "react-hook-form";
import React, { useState, useEffect } from "react";
import {
  getListaFacturaVtaDis,
  downloadZip,
  getEstados,
} from "@/services/auditar/gestionDocumentosAPI";
import { DataType, TypesForm } from "./types";
import { ColumnsType } from "antd/es/table";
import { KEY_ROL } from "@/config/api";
import dayjs from "dayjs";
import {
  notification,
  SelectProps,
  DatePicker,
  Typography,
  Checkbox,
  Button,
  Select,
  Input,
  Table,
  Form,
  Spin,
  Row,
  Col,
  Divider,
} from "antd";

const { RangePicker } = DatePicker;
const { Text } = Typography;

export const ListDoc = () => {
  const [optionsEstados, setOptionsEstados] = useState<SelectProps["options"]>(
    []
  );
  const [notificationApi, contextHolder] = notification.useNotification();
  const [searchValueSelect, setSearchValueSelect] = useState<string>("");
  const [botonDeshabilitado, setBotonDeshabilitado] = useState(true);
  const [rowSelectString, setRowselectString] = useState<number>();
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [busquedaDoc, setBusquedaDoc] = useState<boolean>(false);
  const [loaderTable, setLoaderTable] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [rowSelect, setRowselect] = useState<React.Key[]>([]);
  const [optionsConvenios, setOptionsConvenios] = useState<
    SelectProps["options"]
  >([]);
  const { getSessionVariable } = useSessionStorage();
  const { arrayBufferToString } = useArrayBuffer();
  const [openFlag, setOpenFlag] = useState(false);
  const user_rol = getSessionVariable(KEY_ROL);
  const [form] = Form.useForm();
  const control = useForm<TypesForm>({
    defaultValues: { convenio: [], numero_doc: "", estado: [] },
  });

  const onChange = (e: CheckboxChangeEvent) => {
    control.setValue("numero_doc", "");
    setBusquedaDoc(e.target.checked);
  };

  useEffect(() => {
    getConvenios().then(({ data }) => {
      const convenios = data.data
        .filter((item) => item.id_tipo_conv == "1")
        .map((item) => {
          return { label: item.descripcion, value: item.id.toString() };
        });
      setOptionsConvenios(convenios);
    });
    getEstados().then(({ data }) => {
      const estados = data.data.map((item) => {
        return { label: item.nombre_estado, value: item.estado.toString() };
      });
      setOptionsEstados(estados);
    });
  }, []);

  const fetchFacturaVtaDis = (value: any) => {
    setLoaderTable(true);
    const data = {
      page: 1,
      data: value,
    };
    getListaFacturaVtaDis(data).then(({ data: { data } }) => {
      const responseData = data.length == 0;

      if (responseData) {
        notificationApi.open({
          type: "warning",
          message: `No hay Datos En su Busqueda!`,
        });
      }
      const listaConsultaDoc: DataType[] = data.map((item) => {
        return {
          id: item.id,
          created_at: dayjs(item.created_at).format("DD-MM-YYYY HH:mm"),
          consecutivo: item.consecutivo,
          total: item.total,
          nit: item.nit,
          num_contrato: item.num_contrato,
          descripcion: item.descripcion,
          bod_nombre: item.bod_nombre,
          nombre_estado: item.nombre_estado,
          estado_facturacion: item.estado_facturacion,
        };
      });
      setInitialData(listaConsultaDoc);
      setDataSource(listaConsultaDoc);
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
      title: "Documento",
      dataIndex: "consecutivo",
      key: "consecutivo",
      align: "center",
      width: 100,
    },
    {
      title: "Bodega",
      dataIndex: "bod_nombre",
      key: "bod_nombre",
      align: "center",
      width: 100,
    },
    {
      title: "Convenio",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "Fecha Remisión",
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      width: 100,
    },
    {
      title: "Estado",
      dataIndex: "nombre_estado",
      key: "nombre_estado",
      align: "center",
      width: 80,
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
      setRowselectString(sum);
      selectedRowKeys.length == 0
        ? setBotonDeshabilitado(true)
        : setBotonDeshabilitado(false);
    },
    selections: [Table.SELECTION_ALL, Table.SELECTION_NONE],
    selectedRowKeys: rowSelect,
    selectedRows: rowSelectString,
  };

  const handleSelectAll = (origin: string) => {
    switch (origin) {
      case "convenios":
        if (optionsConvenios) {
          if (
            optionsConvenios.filter((item) => item.disabled != true).length ===
            control.getValues("convenio").length
          ) {
            control.setValue("convenio", []);
          } else {
            const opcionesSeleccionadas: any[] = [];
            optionsConvenios.forEach((item) => {
              if (typeof item.value === "string" && item.disabled != true) {
                opcionesSeleccionadas.push(item.value);
              }
            });
            control.setValue("convenio", opcionesSeleccionadas);
          }
        }
        break;
      case "estados":
        if (optionsEstados) {
          if (
            optionsEstados.filter((item) => item.disabled != true).length ===
            control.getValues("estado").length
          ) {
            control.setValue("estado", []);
          } else {
            const opcionesSeleccionadas: any[] = [];
            optionsEstados.forEach((item) => {
              if (typeof item.value === "string" && item.disabled != true) {
                opcionesSeleccionadas.push(item.value);
              }
            });
            control.setValue("estado", opcionesSeleccionadas);
          }
        }
        break;
    }
  };

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

    const newData = [{ seleccion: rowSelect }];

    notificationApi.info({
      message: "Generando zip...",
    });

    downloadZip(newData)
      .then(({ data }) => {
        notificationApi.info({
          message: "Descargando zip...",
        });
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "dispensaciones.zip");
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
      })
      .catch(({ response: { data } }) => {
        const message = arrayBufferToString(data).replace(/[ '"]+/g, " ");
        notificationApi.open({
          type: "error",
          message: message,
        });
      })
      .finally(() => {
        setTimeout(() => {
          control.reset();
          setRowselect([]);
          setDataSource([]);
          setBotonDeshabilitado(false);
          setLoaderTable(false);
        }, 1500);
      });
  };
  return (
    <>
      {contextHolder}
      <StyledCard title={"Gestión de Documentos"}>
        {contextHolder}
        <ModalUpLoad
          open={openFlag}
          setOpen={(value: boolean) => setOpenFlag(value)}
        />
        <Spin spinning={loaderTable}>
          <Row gutter={[12, 12]}>
            <Col span={24}>
              <Form layout={"vertical"} form={form}>
                <Row gutter={[12, 12]}>
                  <Col xs={24} sm={{ span: 12 }}>
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
                          label="Convenio:"
                        >
                          <Select
                            {...field}
                            allowClear
                            mode="multiple"
                            options={optionsConvenios}
                            placeholder={"Buscar Convenio"}
                            // onChange={handleChangeSelectConvenio}
                            searchValue={searchValueSelect}
                            filterOption={(input, option) =>
                              (option?.label ?? "")
                                .toString()
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            onSearch={(value: string) => {
                              setSearchValueSelect(value);
                            }}
                            onBlur={() => {
                              setSearchValueSelect("");
                            }}
                            maxTagCount={4}
                            status={error && "error"}
                            dropdownRender={(menu) => (
                              <>
                                <div>
                                  <Button
                                    type="text"
                                    shape="round"
                                    onClick={() => handleSelectAll("convenios")}
                                  >
                                    Seleccionar todos
                                  </Button>
                                </div>
                                <Divider style={{ marginBlock: 5 }} />
                                {menu}
                              </>
                            )}
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={24} sm={{ span: 12 }}></Col>
                  <Col xs={24} sm={{ span: 12 }}>
                    <Controller
                      name="estado"
                      control={control.control}
                      rules={{
                        required: {
                          value: busquedaDoc ? false : true,
                          message: "Estado es requerido",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem
                          required={busquedaDoc ? false : true}
                          label="Estado Auditoria:"
                        >
                          <Select
                            {...field}
                            allowClear
                            mode="multiple"
                            options={optionsEstados}
                            maxTagCount={3}
                            placeholder={"Buscar Estado"}
                            // onChange={handleChangeSelectEstado}
                            filterOption={(input, option) =>
                              (option?.label ?? "")
                                .toString()
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            status={error && "error"}
                            dropdownRender={(menu) => (
                              <>
                                <div>
                                  <Button
                                    type="text"
                                    shape="round"
                                    onClick={() => handleSelectAll("estados")}
                                  >
                                    Seleccionar todos
                                  </Button>
                                </div>
                                <Divider style={{ marginBlock: 5 }} />
                                {menu}
                              </>
                            )}
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={24} sm={{ span: 12 }}>
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
                  <Col xs={24} sm={12}>
                    <Checkbox onChange={onChange}>Busqueda Documento</Checkbox>
                    {busquedaDoc ? (
                      <Controller
                        name="numero_doc"
                        control={control.control}
                        rules={{
                          required: {
                            value: busquedaDoc ? true : false,
                            message: "Numero Documento es requerido",
                          },
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <StyledFormItem required={busquedaDoc ? true : false}>
                            <Input
                              {...field}
                              placeholder={"Número de Documento"}
                              allowClear
                              status={error && "error"}
                            />
                            <Text type="danger">{error?.message}</Text>
                          </StyledFormItem>
                        )}
                      />
                    ) : null}
                  </Col>
                  <Col xs={24}>
                    <Row gutter={[12, 12]}>
                      <Col xs={24} sm={8}>
                        {" "}
                        <Button
                          type="primary"
                          htmlType="submit"
                          onClick={control.handleSubmit(fetchFacturaVtaDis)}
                          block
                        >
                          Listar
                        </Button>
                      </Col>
                      <Col xs={24} sm={8}>
                        <Button
                          block
                          type="primary"
                          htmlType="button"
                          onClick={() => setOpenFlag(true)}
                          icon={<UploadOutlined />}
                          disabled={
                            ![
                              "administrador",
                              "auditoria",
                              "regente_farmacia",
                            ].includes(user_rol)
                          }
                        >
                          UpLoad
                        </Button>
                      </Col>
                      <Col xs={24} sm={8}>
                        <GreenButton
                          block
                          icon={<DownloadOutlined />}
                          disabled={botonDeshabilitado}
                          onClick={envRowSelect}
                        >
                          Descargar zip
                        </GreenButton>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Form>
            </Col>
            <Col span={24}>
              <SearchBar style={{ marginBottom: 0 }}>
                <Input placeholder="Buscar" onChange={handleSearch} />
              </SearchBar>
            </Col>
            {dataSource.length > 0 ? (
              <Col span={24}>
                {`Seleccionados ${rowSelect.length} items de ${dataSource.length}`}
              </Col>
            ) : null}
            <Col span={24}>
              <Table
                rowSelection={{
                  type: "checkbox",
                  ...rowSelection,
                }}
                className="custom-table"
                rowKey={(record) => record.id}
                size="small"
                dataSource={dataSource}
                columns={columns}
                pagination={{
                  pageSize: 10,
                  simple: false,
                  hideOnSinglePage: true,
                }}
                locale={{
                  selectionAll: "Seleccionar todo",
                  selectNone: "Cancelar selección",
                }}
                bordered
              />
            </Col>
          </Row>
        </Spin>
      </StyledCard>
    </>
  );
};
