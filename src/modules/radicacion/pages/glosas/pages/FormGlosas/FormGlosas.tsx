/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { StyledPanelFilter, GreenButton, CustomTag } from "./styled";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import useArrayBuffer from "@/modules/common/hooks/useArrayBuffer";
import { downloadTemplate } from "@/services/documentos/otrosAPI";
import { getFestivos } from "@/services/radicacion/festivosAPI";
import useHolidays from "@/modules/common/hooks/useHolidays";
import {
  StyledFormItem,
  StyledCard,
} from "@/modules/common/layout/DashboardLayout/styled";
import { Controller, useForm } from "react-hook-form";
import { FacturaRadicada } from "@/services/types";
import { KEY_ESTADOS_GLOSAS } from "@/config/api";
import { FormTypes, InfoFactura, Pagination } from "./types";
import { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import fileDownload from "js-file-download";
import {
  getInformeSeguimiento,
  getListadoFacturas,
  getInformeEstados,
  getEstadosGlosas,
} from "@/services/radicacion/glosasAPI";
import {
  ExclamationCircleFilled,
  DownloadOutlined,
  FileTextOutlined,
  HistoryOutlined,
  SearchOutlined,
  UploadOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  ModalTrazabilidad,
  ModalCarguePlano,
  ModalNotaCredito,
  ModalEstados,
} from "../..";
import {
  notification,
  SelectProps,
  DatePicker,
  Typography,
  Divider,
  Tooltip,
  Button,
  Select,
  Modal,
  Space,
  Table,
  Form,
  Spin,
  Col,
  Row,
} from "antd";

const { Text, Title } = Typography;
const { RangePicker } = DatePicker;
const { confirm } = Modal;

export const FormGlosas = () => {
  const [selectEstados, setSelectEstados] = useState<SelectProps["options"]>();
  const [allFVE, setAllFVE] = useState<
    { id: string; total: string; rad_id: string }[]
  >([]);
  const { getSessionVariable, setSessionVariable, clearSessionVariable } =
    useSessionStorage();
  const [notificationApi, contextHolder] = notification.useNotification();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchValueSelect, setSearchValueSelect] = useState<string>("");
  const [currentItemsPage, setCurrentItemsPage] = useState<number>(10);
  const [dataSource, setDataSource] = useState<FacturaRadicada[]>();
  const [totalSelected, setTotalSelected] = useState<number>(0);
  const [pagination, setPagination] = useState<Pagination>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openModalTrazabilidad, setOpenModalTrazabilidad] =
    useState<boolean>(false);
  const [openModalCarguePlano, setOpenModalCarguePlano] =
    useState<boolean>(false);
  const { getDiffBussinesDayWithHolidays } = useHolidays();
  const [idFactura, setIdFactura] = useState<React.Key>();
  const [infoFactura, setInfoFactura] = useState<InfoFactura>();
  const [festivos, setFestivos] = useState<string[]>([]);
  const [openModalNotaCredito, setOpenModalNotaCredito] =
    useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const { arrayBufferToString } = useArrayBuffer();
  const [open, setOpen] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const control = useForm<FormTypes>({
    defaultValues: {
      radicados: [],
      estados: [],
      facturas: [],
      fechas: undefined,
      searchInput: "",
      no_glosado: true,
    },
  });

  useEffect(() => {
    const handleBeforeUnload = () => {
      clearSessionVariable(KEY_ESTADOS_GLOSAS);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    setLoader(true);
    if (!getSessionVariable(KEY_ESTADOS_GLOSAS)) {
      getEstadosGlosas()
        .then(({ data: { data } }) => {
          const options = data
            .filter((item) => item.grupo != "1" || item.nombre == "RADICADO")
            .map((item) => {
              return {
                value: item.id.toString(),
                label: item.nombre,
                disabled: item.grupo == "1" && item.nombre != "RADICADO",
              };
            });
          setSelectEstados(options);
          setSessionVariable(KEY_ESTADOS_GLOSAS, JSON.stringify(options));
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
        .finally(() => setLoader(false));
    } else {
      setSelectEstados(JSON.parse(getSessionVariable(KEY_ESTADOS_GLOSAS)));
      setLoader(false);
    }

    getFestivos()
      .then(({ data: { data } }) => {
        const holidays = data.map((item) => item.festivo_fecha);
        setFestivos(holidays);
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
      .finally(() => setLoader(false));
  }, []);

  useEffect(() => {
    if (
      control.getFieldState("fechas").isTouched ||
      control.getFieldState("radicados").isDirty
    ) {
      setSelectedRowKeys([]);
      const data = control.getValues();
      setLoader(true);
      fecthData(data, false);
    }
  }, [currentPage, currentItemsPage]);

  useEffect(() => {
    let sum = 0;
    selectedRowKeys.forEach((key) => {
      const fve = allFVE.find((fve) => fve.id == key.toString());
      if (fve) {
        sum += parseFloat(fve.total);
      }
    });
    setTotalSelected(sum);
  }, [selectedRowKeys]);

  const clearValues = () => {
    setPagination(undefined);
    setSelectedRowKeys([]);
    setDataSource([]);
    setTotal(0);
  };

  const columns: ColumnsType<FacturaRadicada> = [
    {
      key: "nro_radicado",
      dataIndex: "nro_radicado",
      title: "Nro Radicado",
      align: "center",
      width: 120,
    },
    {
      key: "numero_factura_vta",
      dataIndex: "numero_factura_vta",
      title: "Nro Factura",
      align: "center",
      width: 120,
    },
    {
      key: "entidad",
      dataIndex: "entidad",
      title: "Entidad",
      align: "center",
      width: 250,
      render(_, { nit, razon_soc }) {
        return (
          <>
            {nit} - {razon_soc}
          </>
        );
      },
    },
    {
      key: "fecha_alerta",
      dataIndex: "fecha_alerta",
      title: "Fecha Alerta",
      align: "center",
      width: 250,
      render(
        _,
        {
          fecha_radicado,
          fecha_glosa,
          fecha_respuesta,
          fecha_rpta_ratificacion,
          estado_glosa_grupo,
          estado_glosa,
        }
      ) {
        let fecha_calculo = "";
        let dias_alerta = 0;
        let texto_alerta = "";
        if (estado_glosa_grupo == "1" && estado_glosa == "3") {
          fecha_calculo = fecha_radicado;
          dias_alerta = 20;
          texto_alerta = "la radicación";
        }

        if (estado_glosa_grupo == "2" && ["5", "6"].includes(estado_glosa)) {
          fecha_calculo = fecha_glosa;
          dias_alerta = 15;
          texto_alerta = "la glosa";
        }

        if (estado_glosa_grupo == "4") {
          fecha_calculo = fecha_respuesta;
          dias_alerta = 10;
          texto_alerta = ["9", "10"].includes(estado_glosa)
            ? "la aceptación"
            : "la no aceptación";
        }

        if (estado_glosa_grupo == "5") {
          fecha_calculo = fecha_respuesta;
          dias_alerta = 7;
          texto_alerta = ["11"].includes(estado_glosa)
            ? "la ratificación"
            : "la no ratificacion";
        }

        if (estado_glosa_grupo == "7") {
          fecha_calculo = fecha_rpta_ratificacion;
          dias_alerta = 5;
          texto_alerta = "la respuesta a la ratificación";
        }

        const diferenciasDias =
          getDiffBussinesDayWithHolidays(
            fecha_calculo,
            dayjs().format("YYYY-MM-DD"),
            festivos
          ) - 1;

        let color = "";
        if (estado_glosa_grupo == "2") {
          if (diferenciasDias <= 5) {
            color = "#87d068";
          } else if (diferenciasDias > 5 && diferenciasDias <= 10) {
            color = "#ffcc00";
          } else {
            color = "#ff4d4f";
          }
        } else {
          color =
            diferenciasDias <= dias_alerta
              ? "green-inverse"
              : "volcano-inverse";
        }
        if (dias_alerta > 0) {
          return (
            <Space direction="vertical" style={{ gap: 0, width: "100%" }}>
              <>{fecha_calculo}</>
              <CustomTag color={color}>
                {`Han pasado ${diferenciasDias} días desde ${texto_alerta}`}
              </CustomTag>
            </Space>
          );
        } else {
          return <CustomTag color="#108ee9">Sin alerta</CustomTag>;
        }
      },
    },
    {
      key: "fecha_facturacion",
      dataIndex: "fecha_facturacion",
      title: "Fecha Facturación",
      align: "center",
      width: 120,
    },
    {
      key: "total",
      dataIndex: "total",
      title: "Total",
      align: "center",
      width: 120,
      render(value: string) {
        return <>$ {parseFloat(value).toLocaleString("es-CO")}</>;
      },
    },
    {
      key: "estado_glosa_nombre",
      dataIndex: "estado_glosa_nombre",
      title: "Estado",
      align: "center",
      width: 250,
      render(value: string, { grupo_glosa }) {
        let color = "";
        switch (grupo_glosa) {
          case "2":
            color = "gold-inverse";
            break;
          case "3":
            color = "orange-inverse";
            break;
          case "4":
            color = "blue-inverse";
            break;
          case "5":
            color = "cyan-inverse";
            break;
          case "7":
            color = "purple-inverse";
            break;
        }
        return (
          <CustomTag color={color} bordered={false}>
            {value}
          </CustomTag>
        );
      },
    },
    {
      key: "acciones",
      dataIndex: "acciones",
      title: "Acciones",
      align: "center",
      width: 120,
      fixed: "right",
      render(
        _,
        { key, estado_glosa_grupo, numero_factura_vta, convenio_id, nit }
      ) {
        return (
          <>
            <Space>
              <Tooltip title="Cambiar Estado">
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    setIdFactura(key);
                    setOpen(true);
                  }}
                >
                  <SwapOutlined />
                </Button>
              </Tooltip>
              <Tooltip title="Ver Trazabilidad">
                <GreenButton
                  type="primary"
                  size="small"
                  onClick={() => {
                    setIdFactura(key);
                    setOpenModalTrazabilidad(true);
                  }}
                >
                  <HistoryOutlined />
                </GreenButton>
              </Tooltip>
              {["4", "5", "6", "7"].includes(estado_glosa_grupo) ? (
                <Tooltip title="Generar Nota Crédito">
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => {
                      setInfoFactura({
                        convenio_id,
                        numero_factura: numero_factura_vta,
                        cliente: nit,
                      });
                      setOpenModalNotaCredito(true);
                    }}
                  >
                    <FileTextOutlined />
                  </Button>
                </Tooltip>
              ) : null}
            </Space>
          </>
        );
      },
    },
  ];

  const handleSelectAll = (origin = "radicados") => {
    switch (origin) {
      case "estados":
        if (selectEstados) {
          if (
            selectEstados.filter((item) => item.disabled != true).length ===
            control.getValues("estados").length
          ) {
            control.setValue("estados", []);
          } else {
            const opcionesSeleccionadas: string[] = [];
            selectEstados.forEach((item) => {
              if (typeof item.value === "string" && item.disabled != true) {
                opcionesSeleccionadas.push(item.value);
              }
            });
            control.setValue("estados", opcionesSeleccionadas);
          }
        }
        break;
    }
  };

  const fetchInformeSeguimiento = (no_glosado = true) => {
    setLoader(true);
    const data = control.getValues();
    data.no_glosado = no_glosado;
    if (data.fechas) {
      data.fechas_string = [
        dayjs(data.fechas[0]).format("YYYY-MM-DD"),
        dayjs(data.fechas[1]).format("YYYY-MM-DD"),
      ];
    }
    data.radicados_id = allFVE.map((factura) => factura.rad_id);
    getInformeSeguimiento(data)
      .then(({ data }) => {
        fileDownload(data, "INFORME SEGUIMIENTO GLOSAS.xlsx");
        notificationApi.open({
          type: "success",
          message: "Informe generado correctamente",
        });
      })
      .catch(async ({ response: { data } }) => {
        const blob = new Blob([data], { type: "application/json" });
        const respuesta = JSON.parse(await blob.text());
        notificationApi.open({
          type: "error",
          message: respuesta.message,
        });
      })
      .finally(() => setLoader(false));
  };

  const fecthData = (data: any, from_form = true) => {
    if (
      data.radicados.length == 0 &&
      data.facturas.length == 0 &&
      data.estados.length == 0 &&
      !data.fechas
    ) {
      notificationApi.open({
        type: "warning",
        message: "Debe seleccionar al menos un filtro",
      });
      return;
    }
    setLoader(true);
    if (data.fecha) {
      data.fechas_string = [
        dayjs(data.fechas[0]).format("YYYY-MM-DD"),
        dayjs(data.fechas[1]).format("YYYY-MM-DD"),
      ];
    }
    data.page = from_form ? 1 : currentPage;
    data.paginate = currentItemsPage;
    getListadoFacturas(data)
      .then(({ data: { data, all, total } }) => {
        setPagination(data);
        setDataSource(data.data.map((item) => ({ ...item, key: item.id })));
        setAllFVE(all);
        setTotal(total);
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
      .finally(() => setLoader(false));
  };

  const onFinish = (data: any) => {
    fecthData(data);
  };

  return (
    <>
      {contextHolder}
      <ModalEstados
        open={open}
        setOpen={(value: boolean, flagEnvio: boolean) => {
          setOpen(value);
          setIdFactura(undefined);
          if (flagEnvio) {
            const data = control.getValues();
            fecthData(data, false);
          }
        }}
        facturas={selectedRowKeys}
        selectEstados={selectEstados}
        id_factura={idFactura}
      />
      <ModalTrazabilidad
        open={openModalTrazabilidad}
        setOpen={(value: boolean) => {
          setOpenModalTrazabilidad(value);
          setIdFactura(undefined);
        }}
        id_factura={idFactura}
      />
      <ModalNotaCredito
        open={openModalNotaCredito}
        setOpen={(value: boolean) => {
          setOpenModalNotaCredito(value);
          setInfoFactura(undefined);
        }}
        info_factura={infoFactura}
      />
      <ModalCarguePlano
        open={openModalCarguePlano}
        setOpen={(value: boolean, flag_reload: boolean) => {
          setOpenModalCarguePlano(value);
          if (flag_reload) {
            const data = control.getValues();
            fecthData(data);
          }
        }}
      />
      <StyledCard>
        <Spin spinning={loader}>
          <Row gutter={[12, 12]}>
            <Col xs={24} sm={{ offset: 2, span: 20 }}>
              <StyledPanelFilter>
                <Form
                  className="form-panel-filtro"
                  layout="vertical"
                  onKeyDown={(e: any) =>
                    e.key === "Enter" ? e.preventDefault() : null
                  }
                  onFinish={control.handleSubmit(onFinish)}
                >
                  <Row gutter={[12, 12]}>
                    <Col xs={24}>
                      <Title
                        level={4}
                        style={{
                          color: "#6c757d",
                          textAlign: "center",
                          marginBlock: "16px",
                        }}
                      >
                        <SearchOutlined style={{ marginRight: "8px" }} />
                        Filtros de Búsqueda
                      </Title>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
                      <Controller
                        control={control.control}
                        name="radicados"
                        render={({ field, fieldState: { error } }) => (
                          <StyledFormItem>
                            <div
                              onPaste={(
                                event: React.ClipboardEvent<HTMLDivElement>
                              ) => {
                                event.preventDefault();
                                const pastedText =
                                  event.clipboardData.getData("Text");

                                const values = pastedText
                                  .split(/\s+/)
                                  .filter(Boolean)
                                  .filter(
                                    (item) =>
                                      !control
                                        .getValues("radicados")
                                        .find((radicado) => radicado == item)
                                  );

                                field.onChange([
                                  ...(field.value || []),
                                  ...values,
                                ]);
                              }}
                            >
                              <Select
                                {...field}
                                allowClear
                                mode="tags"
                                maxTagCount={10}
                                status={error && "error"}
                                placeholder="Busqueda por Radicado"
                                notFoundContent={null}
                              />
                            </div>
                            <Text type="danger">{error?.message}</Text>
                          </StyledFormItem>
                        )}
                      />
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
                      <Controller
                        control={control.control}
                        name="facturas"
                        render={({ field }) => (
                          <StyledFormItem>
                            <div
                              onPaste={(
                                event: React.ClipboardEvent<HTMLDivElement>
                              ) => {
                                event.preventDefault();
                                const pastedText =
                                  event.clipboardData.getData("Text");

                                const values = pastedText
                                  .split(/\s+/)
                                  .filter(Boolean)
                                  .filter(
                                    (item) =>
                                      !control
                                        .getValues("facturas")
                                        .find((factura) => factura == item)
                                  );

                                field.onChange([
                                  ...(field.value || []),
                                  ...values,
                                ]);
                              }}
                            >
                              <Select
                                {...field}
                                allowClear
                                mode="tags"
                                maxTagCount={10}
                                placeholder="Busqueda por Factura"
                                notFoundContent={null}
                              />
                            </div>
                          </StyledFormItem>
                        )}
                      />
                    </Col>
                    <Col
                      xs={{ span: 24 }}
                      sm={{ span: 24 }}
                      md={{ span: 24 }}
                      lg={10}
                    >
                      <Controller
                        control={control.control}
                        name="estados"
                        render={({ field, fieldState: { error } }) => (
                          <StyledFormItem>
                            <Select
                              {...field}
                              showSearch
                              mode="multiple"
                              maxTagCount={2}
                              options={selectEstados}
                              status={error && "error"}
                              searchValue={searchValueSelect}
                              onBlur={() => {
                                setSearchValueSelect("");
                              }}
                              onSearch={(value: string) => {
                                setSearchValueSelect(value);
                              }}
                              filterOption={(input, option) =>
                                (option?.label ?? "")
                                  .toString()
                                  .toLowerCase()
                                  .includes(input.toLowerCase())
                              }
                              placeholder="Seleccionar Estados"
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
                    <Col
                      xs={{ span: 24 }}
                      sm={{ span: 24 }}
                      md={{ span: 24 }}
                      lg={10}
                    >
                      <Controller
                        control={control.control}
                        name="fechas"
                        render={({ field, fieldState: { error } }) => (
                          <StyledFormItem>
                            <RangePicker
                              {...field}
                              style={{ width: "100%" }}
                              status={error && "error"}
                              placeholder={["Fecha Inicial", "Fecha Final"]}
                            />
                            <Text type="danger">{error?.message}</Text>
                          </StyledFormItem>
                        )}
                      />
                    </Col>
                    <Col
                      xs={{ span: 24 }}
                      sm={{ span: 24 }}
                      md={{ span: 24 }}
                      lg={4}
                    >
                      <Button
                        htmlType="submit"
                        type="primary"
                        icon={<SearchOutlined />}
                        onClick={() => clearValues()}
                        block
                      />
                    </Col>
                  </Row>
                </Form>
              </StyledPanelFilter>
            </Col>
            {/* <Col span={24}>
              <Input
                placeholder={"Busqueda por Factura"}
                onPressEnter={(event) => {
                  setSearchInput(event.currentTarget.value);
                }}
                onChange={(event) => {
                  if (event.currentTarget.value == "") {
                    setSearchInput("");
                  }
                }}
              />
            </Col> */}
            <Col xs={24} sm={24} md={12} lg={4} xl={6}>
              <Button
                block
                type="primary"
                onClick={() => setOpen(true)}
                disabled={selectedRowKeys.length == 0}
              >
                Cambiar Estado
              </Button>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={6}>
              <Space.Compact style={{ width: "100%" }}>
                <Button
                  icon={<DownloadOutlined />}
                  block
                  onClick={() => {
                    setLoader(true);
                    downloadTemplate(`ExampleUploadEstadosGlosas.xlsx`)
                      .then((response) => {
                        const url = window.URL.createObjectURL(
                          new Blob([response.data])
                        );
                        const link = document.createElement("a");
                        link.href = url;
                        link.setAttribute(
                          "download",
                          `ExampleUploadEstadosGlosas.xlsx`
                        );
                        document.body.appendChild(link);
                        link.click();
                      })
                      .catch(({ response: { data } }) => {
                        const message = arrayBufferToString(data).replace(
                          /[ '"]+/g,
                          " "
                        );
                        notificationApi.open({
                          type: "error",
                          message: message,
                        });
                      })
                      .finally(() => setLoader(false));
                  }}
                >
                  Plantilla
                </Button>
                <Button
                  type="primary"
                  size="middle"
                  icon={<UploadOutlined />}
                  block
                  onClick={() => setOpenModalCarguePlano(true)}
                >
                  Cargar
                </Button>
              </Space.Compact>
            </Col>
            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <GreenButton
                block
                type="primary"
                onClick={() => {
                  confirm({
                    title: "¿Deseas incluir las facturas no glosadas?",
                    icon: <ExclamationCircleFilled />,
                    content:
                      "Si las deseas incluir se tendra en cuenta para la información acumulada y por detalle.",
                    okText: "Si",
                    onOk() {
                      fetchInformeSeguimiento();
                    },
                    cancelText: "No",
                    cancelButtonProps: { danger: true, type: "primary" },
                    onCancel() {
                      fetchInformeSeguimiento(false);
                    },
                  });
                }}
                disabled={allFVE.length == 0}
              >
                Informe Seguimiento
              </GreenButton>
            </Col>
            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <GreenButton
                type="primary"
                onClick={() => {
                  setLoader(true);
                  const data = control.getValues();
                  if (data.fechas) {
                    data.fechas_string = [
                      dayjs(data.fechas[0]).format("YYYY-MM-DD"),
                      dayjs(data.fechas[1]).format("YYYY-MM-DD"),
                    ];
                  }
                  data.radicados_id = allFVE.map((factura) => factura.rad_id);
                  getInformeEstados(data)
                    .then(({ data }) => {
                      fileDownload(data, "INFORME ESTADOS GLOSAS.xlsx");
                    })
                    .finally(() => setLoader(false));
                }}
                block
                disabled={allFVE.length == 0}
              >
                Informe Estados
              </GreenButton>
            </Col>
          </Row>
          <Row gutter={[12, 12]} style={{ marginBlock: 12 }}>
            <Col span={24}>
              <Table
                bordered
                size="small"
                rowKey={(record) => record.id}
                dataSource={dataSource}
                columns={columns}
                scroll={{ x: 1100 }}
                footer={() => (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                    >
                      <Text style={{ color: "#ffffff" }} strong>
                        SELECCIONADOS {selectedRowKeys.length} DE{" "}
                        {pagination?.total ?? 0}
                      </Text>
                      <Text style={{ color: "#ffffff" }} strong>
                        TOTAL $ {totalSelected.toLocaleString("es-CO")} DE
                        {" $ "}
                        {total.toLocaleString("es-CO")}
                      </Text>
                    </div>
                  </>
                )}
                rowSelection={{
                  preserveSelectedRowKeys: true,
                  selectedRowKeys,
                  onSelectAll: (value: boolean) => {
                    if (value) {
                      setSelectedRowKeys(allFVE.map((item) => item.id));
                    } else {
                      setSelectedRowKeys([]);
                    }
                  },
                  onSelect: (
                    { key, id }: FacturaRadicada,
                    selected: boolean
                  ) => {
                    let newSelectedRows: React.Key[] = [];
                    if (selected) {
                      if (selectedRowKeys.length == 0) {
                        newSelectedRows.push(key ?? id);
                      } else {
                        newSelectedRows = [...selectedRowKeys, key ?? id];
                      }
                    } else {
                      newSelectedRows = selectedRowKeys.filter(
                        (item: React.Key) => item != key
                      );
                    }
                    setSelectedRowKeys(newSelectedRows);
                  },
                }}
                pagination={{
                  current: currentPage,
                  total: pagination?.total,
                  showSizeChanger: true,
                  pageSize: currentItemsPage,
                  showTotal: (total, range) => (
                    <>
                      {`${range[0]}-${range[1]} de un total de `}
                      <Text type="warning" strong>
                        {total}
                      </Text>{" "}
                      registros
                    </>
                  ),
                  onChange: (page: number, pageSize: number) => {
                    setCurrentPage(page);
                    setCurrentItemsPage(pageSize);
                  },
                  locale: {
                    items_per_page: "/ página",
                    jump_to: "Ir a",
                    page: "Página",
                  },
                }}
              />
            </Col>
          </Row>
        </Spin>
      </StyledCard>
    </>
  );
};
