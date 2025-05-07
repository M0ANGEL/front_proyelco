/* eslint-disable @typescript-eslint/no-explicit-any */
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import useDateFunctions from "@/modules/common/hooks/useDateFunctions";
import { LoadingOutlined, FileExcelFilled } from "@ant-design/icons";
import useArrayBuffer from "@/modules/common/hooks/useArrayBuffer";
import { getBodegasSebthi } from "@/services/maestras/bodegasAPI";
import { useContext, useEffect, useRef, useState } from "react";
import {
  StyledFormItem,
  StyledCard,
} from "@/modules/common/layout/DashboardLayout/styled";
import { GlobalContext } from "@/router/GlobalContext";
import { Controller, useForm } from "react-hook-form";
import fileDownload from "js-file-download";
import { Convenio } from "@/services/types";
import { GreenButton } from "./styled";
import { KEY_ROL } from "@/config/api";
import {
  generarReporteFacturacion,
  downloadRipsFile,
  getConveniosRep,
  generarInformePHPPuro,
  validarTotalRegistros,
} from "@/services/informes/reportesAPI";
import dayjs from "dayjs";
import {
  notification,
  SelectProps,
  DatePicker,
  Typography,
  Button,
  Select,
  Input,
  Radio,
  Form,
  Spin,
  Col,
  Row,
  Modal,
} from "antd";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export const RepFacturacionPage = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("No se encuentra el contexto GlobalContext");
  }
  const { userGlobal } = context;

  const [selectClientes, setSelectClientes] = useState<SelectProps["options"]>(
    []
  );
  const [selectBodegas, setSelectBodegas] = useState<SelectProps["options"]>(
    []
  );
  const [notificationApi, contextHolder] = notification.useNotification();
  const { arrayBufferToString, stringToArrayBuffer } = useArrayBuffer();
  const [showClientes, setShowClientes] = useState<boolean>(false);
  const [facturacion, setFacturacion] = useState<boolean>(false);
  const [aceptaGenerarReporte, setAceptaGenerarReporte] =
    useState<boolean>(false);
  const [ripsOption, setRipsOption] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [convenios, setConvenios] = useState<Convenio[]>([]);
  const [selectConvenios, setSelectConvenios] = useState<
    SelectProps["options"]
  >([]);
  const [selectConceptos, setSelectConceptos] = useState<
    SelectProps["options"]
  >([]);
  const [modal, contextHolderModal] = Modal.useModal();
  const [loader, setLoader] = useState<boolean>(true);
  const { getSessionVariable } = useSessionStorage();
  const { disabled62DaysDate } = useDateFunctions();
  const user_rol = getSessionVariable(KEY_ROL);

  const buttonRef = useRef<HTMLButtonElement>(null);

  const control = useForm({
    defaultValues: {
      tipo_reporte: "",
      bodegas: [],
      fechas_rango: undefined,
      consecutivos: [],
      productos: [],
      estados: [],
      convenios: [],
      conceptos: "",
      codigo_prestador: "",
      nombre_archivo: "",
      tipo_autorizacion: "detalle",
      terceros: [],
      clientes: [],
    },
  });

  const watchTipoReporte = control.watch("tipo_reporte");
  const watchConvenios = control.watch("convenios");

  const selectTipoReporte: SelectProps["options"] = [
    { label: "ANEXO A FACTURA", value: "fact_anexof" },
    { label: "ANEXO - DEVOLUCIONES", value: "anexoDev" },
    { label: "RIPS", value: "rips" },
    { label: "FACTURACION 1", value: "facturacion1" },
    { label: "FACTURACION PUTUMAYO", value: "facturacionp" },
    { label: "FACTURACION 2", value: "facturacion2" },
    { label: "FACTURACION TOTAL", value: "facturaciontotal" },
    { label: "FACTURACION TOTAL 2", value: "facturaciontotal2" },
    { label: "NOTAS CREDITO TOTAL", value: "notascreditototal" },
    { label: "FACTURAS ANULADAS", value: "facturasanuladas" },
    { label: "FACTURACIÓN1 ALIADOS", value: "facturacion1Aliados" },
    { label: "FACTURACIÓN2 ALIADOS", value: "facturacion2Aliados" },
    { label: "FACTURACIÓN TOTAL ALIADOS", value: "facturaciontotalAliados" },
    { label: "FACTURACIÓN COMFENALCO", value: "facturacionComfenalco" },
    { label: "REPORTE ICONECTA", value: "reporteIconeta" },
    { label: "INFORME GERENCIA", value: "informe_gerencia" },
  ];

  const selectEstados: SelectProps["options"] = [
    { label: "Abierto", value: "1" },
    { label: "Cerrado", value: "3" },
    { label: "Anulado", value: "4" },
  ];

  useEffect(() => {
    getBodegasSebthi().then(({ data: { data } }) => {
      setSelectBodegas(
        data.map((bodega) => {
          return { label: bodega.bod_nombre, value: bodega.id };
        })
      );
      setLoader(false);
    });
  }, []);

  useEffect(() => {
    ("");
    if (
      ["facturacion1", "rips", "informe_gerencia"].includes(watchTipoReporte)
    ) {
      setLoader(true);
      getConveniosRep()
        .then(({ data: { data } }) => {
          setConvenios(data);
          setSelectConvenios(
            data
              .filter((item) => item.estado == "1")
              .map((item: any) => ({
                value: item.id,
                label: `${item.num_contrato} - ${item.descripcion}`,
              }))
          );
          const conveniosAgrupados = Object.values(
            Object.groupBy(data, ({ nit }: any) => nit)
          );

          setSelectClientes(
            conveniosAgrupados.map((item) => {
              return {
                value: item ? item[0].nit : "",
                label: item
                  ? `${item[0].nit} - ${item[0].tercero.razon_soc}`
                  : "",
              };
            })
          );
        })
        .finally(() => setLoader(false));
      switch (watchTipoReporte) {
        case "rips":
          setRipsOption(true);
          break;
        case "facturacion1":
          setFacturacion(true);
          break;
      }
    } else {
      switch (watchTipoReporte) {
        case "rips":
          setRipsOption(false);
          break;
        case "facturacion1":
          setFacturacion(false);
          break;
        default:
          setFacturacion(false);
          setRipsOption(false);
          break;
      }
    }
    switch (watchTipoReporte) {
      case "informe_gerencia":
        setShowClientes(true);
        break;
      default:
        setShowClientes(false);
        break;
    }
  }, [watchTipoReporte]);

  useEffect(() => {
    const conceptos: SelectProps["options"] = [];
    watchConvenios.forEach((item) => {
      const convenio: any = convenios.find((convenio) => convenio.id == item);
      if (convenio) {
        convenio.conceptosInfo.forEach((concepto: any) => {
          if (!conceptos.some((value) => value.value == concepto.id)) {
            conceptos.push({ value: concepto.id, label: concepto.nombre });
          }
        });
      }
    });
    setSelectConceptos(conceptos);
  }, [watchConvenios, convenios]);

  useEffect(() => {
    if (aceptaGenerarReporte) {
      buttonRef.current?.click();
    }
  }, [aceptaGenerarReporte]);

  const checkKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") e.preventDefault();
  };

  const onFinish = (data: any) => {
    setLoader(true);
    data.fechas_rango = [
      dayjs(data.fechas_rango[0]).format("YYYY-MM-DD"),
      dayjs(data.fechas_rango[1]).format("YYYY-MM-DD"),
    ];
    const filename = selectTipoReporte
      .find((item) => item.value == data.tipo_reporte)
      ?.label?.toString()
      .toUpperCase();
    data.filename = filename;
    generarReporteFacturacion(data)
      .then(({ data }) => {
        if (
          ["fact_anexof", "anexoDev", "facturacion1"].includes(
            control.getValues("tipo_reporte")
          )
        ) {
          fileDownload(data, `${filename}.csv`);
        } else {
          fileDownload(data, `${filename}.xlsx`);
        }
        if (["rips"].includes(control.getValues("tipo_reporte"))) {
          const zipName = `RIPS-${control.getValues("nombre_archivo")}.zip`;
          downloadRipsFile(`RIPS/${zipName}`)
            .then((response) => {
              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", zipName);
              document.body.appendChild(link);
              link.click();
            })
            .catch(({ response: { data } }) => {
              const message = arrayBufferToString(data).replace(/[ '"]+/g, " ");
              notificationApi.open({
                type: "error",
                message: message,
              });
            });
        }
        notificationApi.open({
          type: "success",
          message: "Reporte generado con exito!",
        });
      })
      .catch(({ response: { data } }) => {
        const message = arrayBufferToString(data).replace(/[ '"]+/g, " ");
        notificationApi.open({
          type: "error",
          message: message,
        });
      })
      .finally(() => setLoader(false));
  };
  return (
    <>
      {contextHolder}
      {contextHolderModal}
      <Spin
        spinning={loader}
        indicator={
          <LoadingOutlined spin style={{ fontSize: 40, color: "#f4882a" }} />
        }
        style={{ backgroundColor: "rgb(251 251 251 / 70%)", marginTop: 200 }}
      >
        <StyledCard title={<Title level={4}>REPORTES DE FACTURACIÓN</Title>}>
          <Form
            layout="vertical"
            onFinish={control.handleSubmit(onFinish)}
            onKeyDown={(e: any) => checkKeyDown(e)}
          >
            <Row gutter={[12, 12]}>
              <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                <Controller
                  control={control.control}
                  name="tipo_reporte"
                  rules={{
                    required: {
                      value: true,
                      message: "Tipo de Reporte es necesario",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem label={"Tipo de Reporte:"} required>
                      <Select
                        {...field}
                        showSearch
                        allowClear
                        placeholder="Tipo Reporte"
                        options={selectTipoReporte}
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
              <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                <Controller
                  control={control.control}
                  name="fechas_rango"
                  rules={{
                    required: {
                      value: true,
                      message: "Rango de Fechas es necesario",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem label={"Rango de Fechas:"} required>
                      <RangePicker
                        {...field}
                        placeholder={["Inicio", "Fin"]}
                        status={error && "error"}
                        style={{ width: "100%" }}
                        disabledDate={disabled62DaysDate}
                        maxDate={dayjs()}
                        minDate={
                          userGlobal &&
                          [1, "1"].includes(userGlobal.has_limite_reportes)
                            ? dayjs().subtract(1, "day")
                            : undefined
                        }
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>
              {showClientes ? (
                <>
                  <Col xs={{ span: 24 }} md={{ span: 24 }}>
                    <Controller
                      control={control.control}
                      name="clientes"
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem label={"Clientes:"}>
                          <Select
                            {...field}
                            allowClear
                            mode="multiple"
                            placeholder="Clientes"
                            options={selectClientes}
                            filterOption={(input, option) =>
                              (option?.label ?? "")
                                .toString()
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            maxTagCount={3}
                            searchValue={searchValue}
                            onSearch={(value: string) => {
                              setSearchValue(value);
                            }}
                            onBlur={() => {
                              setSearchValue("");
                            }}
                            popupMatchSelectWidth={false}
                            status={error && "error"}
                            disabled={
                              control.getValues("tipo_reporte") ? false : true
                            }
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                </>
              ) : null}
              {facturacion ? (
                <Col xs={{ span: 24 }} md={{ span: 24 }}>
                  <Controller
                    control={control.control}
                    name="convenios"
                    rules={{
                      required: {
                        value: true,
                        message: "Convenios es necesario",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem required label={"Convenios:"}>
                        <Select
                          {...field}
                          allowClear
                          mode={
                            facturacion || ripsOption ? "multiple" : undefined
                          }
                          placeholder="Convenios"
                          options={selectConvenios}
                          searchValue={searchValue}
                          onSearch={(value: string) => {
                            setSearchValue(value);
                          }}
                          onBlur={() => {
                            setSearchValue("");
                          }}
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toString()
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          popupMatchSelectWidth={false}
                          status={error && "error"}
                        />
                        <Text type="danger">{error?.message}</Text>
                      </StyledFormItem>
                    )}
                  />
                </Col>
              ) : null}
              {ripsOption ? (
                <>
                  <Col xs={{ span: 24 }} md={{ span: 24 }}>
                    <Controller
                      control={control.control}
                      name="convenios"
                      rules={{
                        required: {
                          value: true,
                          message: "Convenios es necesario",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem required label={"Convenios:"}>
                          <Select
                            {...field}
                            allowClear
                            placeholder="Convenios"
                            mode="multiple"
                            options={selectConvenios}
                            searchValue={searchValue}
                            onSearch={(value: string) => {
                              setSearchValue(value);
                            }}
                            onBlur={() => {
                              setSearchValue("");
                            }}
                            filterOption={(input, option) =>
                              (option?.label ?? "")
                                .toString()
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            popupMatchSelectWidth={false}
                            status={error && "error"}
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={{ span: 24 }} md={{ span: 8 }}>
                    <Controller
                      control={control.control}
                      name="codigo_prestador"
                      rules={{
                        required: {
                          value: true,
                          message: "Código Prestador es necesario",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem required label={"Código Prestador:"}>
                          <Input
                            {...field}
                            placeholder="Código Prestador"
                            status={error && "error"}
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={{ span: 24 }} md={{ span: 8 }}>
                    <Controller
                      control={control.control}
                      name="nombre_archivo"
                      rules={{
                        required: {
                          value: true,
                          message: "Nombre del Archivo es necesario",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem required label={"Nombre del Archivo:"}>
                          <Input
                            {...field}
                            placeholder="Nombre del Archivo"
                            status={error && "error"}
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={{ span: 24 }} md={{ span: 8 }}>
                    <Controller
                      control={control.control}
                      name="tipo_autorizacion"
                      rules={{
                        required: {
                          value: true,
                          message: "Tipo de Autorizacion es necesario",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem
                          required
                          label={"Tipo de Autorizacion:"}
                        >
                          <Radio.Group {...field}>
                            <Radio value={"detalle"}>Detalle</Radio>
                            <Radio value={"cabecera"}>Cabecera</Radio>
                          </Radio.Group>
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={{ span: 24 }} md={{ span: 12 }}>
                    <Controller
                      control={control.control}
                      name="conceptos"
                      // rules={{
                      //   required: {
                      //     value: true,
                      //     message: "Conceptos es necesario",
                      //   },
                      // }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem label={"Conceptos:"}>
                          <Select
                            {...field}
                            allowClear
                            placeholder="Conceptos"
                            options={selectConceptos}
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
                </>
              ) : null}
              <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                <Controller
                  control={control.control}
                  name="bodegas"
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem label={"Bodegas:"}>
                      <Select
                        {...field}
                        allowClear
                        mode="multiple"
                        placeholder="Bodegas"
                        options={selectBodegas}
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
              {!ripsOption ? (
                <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                  <Controller
                    control={control.control}
                    name="estados"
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem label={"Estados:"}>
                        <Select
                          {...field}
                          allowClear
                          mode="multiple"
                          placeholder="Estados"
                          options={selectEstados}
                          status={error && "error"}
                        />
                        <Text type="danger">{error?.message}</Text>
                      </StyledFormItem>
                    )}
                  />
                </Col>
              ) : null}
              {["rips"].includes(control.getValues("tipo_reporte")) ? (
                <Col
                  xs={{ span: 24 }}
                  sm={{ offset: 7, span: 10 }}
                  md={{ offset: 9, span: 6 }}
                >
                  <Button type="primary" block htmlType="submit">
                    Generar Reporte
                  </Button>
                </Col>
              ) : null}
              {[
                "facturacion",
                "administrador",
                "auditoria",
                "revisor_compras",
                "cotizaciones",
                "contabilidad",
                "quimico",
              ].includes(user_rol) &&
              [
                "facturacion1",
                "facturacion2",
                "facturaciontotal",
                "facturaciontotal2",
                "notascreditototal",
                "facturacionp",
                "facturasanuladas",
                "facturacion1Aliados",
                "facturacion2Aliados",
                "facturacionComfenalco",
                "facturaciontotalAliados",
                "reporteIconeta",
                "informe_gerencia",
              ].includes(control.getValues("tipo_reporte")) ? (
                <Col
                  xs={{ span: 24 }}
                  sm={{ offset: 7, span: 10 }}
                  md={{ offset: 9, span: 6 }}
                >
                  <GreenButton
                    type="primary"
                    block
                    icon={<FileExcelFilled />}
                    ref={buttonRef}
                    onClick={() => {
                      if (control.getValues("fechas_rango")) {
                        const rango_fechas =
                          control.getValues("fechas_rango") ?? [];

                        const initialDate = dayjs(rango_fechas[0]).format(
                          "YYYY-MM-DD"
                        );
                        const endDate = dayjs(rango_fechas[1]).format(
                          "YYYY-MM-DD"
                        );

                        const convenios = JSON.stringify(
                          control.getValues("convenios")
                        );
                        let link = "";
                        switch (control.getValues("tipo_reporte")) {
                          case "facturacion1":
                            if (
                              ["auditoria", "administrador"].includes(user_rol)
                            ) {
                              link = `reporteFacturacion1AudSQL`;
                            } else {
                              link = `reporteFacturacion1SQL`;
                            }
                            break;
                          case "facturaciontotal":
                            link = `facturaciontotalSQL`;
                            break;
                          case "facturaciontotal2":
                            link = `repFacturacionTotal2SQL`;
                            break;
                          case "notascreditototal":
                            link = `NotasCreditototalSQL`;
                            break;
                          case "facturacionp":
                            link = `reporteFacturacionPutumayoSQL`;
                            break;
                          case "facturacion2":
                            link = `reporteFacturacion2SQL`;
                            break;
                          case "facturasanuladas":
                            link = `reporteFacturacionAnuladas`;
                            break;
                          case "facturacion1Aliados":
                            link = `reporteFacturacion1AliadosSQL`;
                            break;
                          case "facturacion2Aliados":
                            link = `reporteFacturacion2AliadosSQL`;
                            break;
                          case "facturacionComfenalco":
                            link = `reporteFacturacionComfenalcoSQL`;
                            break;
                          case "facturaciontotalAliados":
                            link = `reporteFacturaciontotalAliados`;
                            break;
                          case "reporteIconeta":
                            link = `reporteIconectaSQL`;
                            break;
                          case "informe_gerencia":
                            link = `generales/reporteGerenciaSQL`;
                            break;

                          default:
                            break;
                        }
                        if (
                          ["informe_gerencia"].includes(
                            control.getValues("tipo_reporte")
                          )
                        ) {
                          setLoader(true);
                          if (
                            ["informe_gerencia"].includes(
                              control.getValues("tipo_reporte")
                            ) &&
                            [
                              "administrador",
                              "compras",
                              "cotizaciones",
                              "facturacion",
                              "auditoria",
                            ].includes(user_rol) &&
                            !aceptaGenerarReporte
                          ) {
                            generarInformePHPPuro(
                              {
                                ...control.getValues(),
                                initialDate,
                                endDate,
                                only_sql: true,
                              },
                              link
                            ).then(({ data }) => {
                              const sql = data;
                              notificationApi.info({
                                message: "Validando registros...",
                              });
                              validarTotalRegistros({ sql })
                                .then(({ data: { data } }) => {
                                  modal.confirm({
                                    title: "Generar Reporte",
                                    content: `El reporte que estás intentando generar tiene ${data} filas, ¿Deseas generarlo?`,
                                    onOk: () => {
                                      setAceptaGenerarReporte(true);
                                    },
                                    onCancel: () => {
                                      setAceptaGenerarReporte(false);
                                    },
                                    okText: "Si",
                                    cancelText: "No",
                                  });
                                })
                                .catch(({ request: { response } }) => {
                                  notificationApi.open({
                                    type: "error",
                                    message: response,
                                  });
                                })
                                .finally(() => {
                                  setLoader(false);
                                });
                            });

                            return;
                          }
                          notificationApi.info({
                            message: "Generando reporte...",
                          });
                          if (
                            [
                              "facturacion",
                              "administrador",
                              "auditoria",
                              "contabilidad",
                            ].includes(user_rol)
                          ) {
                            generarInformePHPPuro(
                              {
                                ...control.getValues(),
                                initialDate,
                                endDate,
                                user_rol,
                              },
                              link
                            )
                              .then(({ data }) => {
                                const filename = selectTipoReporte
                                  .find(
                                    (item) =>
                                      item.value ==
                                      control.getValues("tipo_reporte")
                                  )
                                  ?.label?.toString()
                                  .toUpperCase();
                                fileDownload(
                                  stringToArrayBuffer(data),
                                  `${filename}.xls`
                                );
                                notificationApi.open({
                                  type: "success",
                                  message: "Reporte generado con exito!",
                                });
                              })
                              .catch(({ request: { response } }) => {
                                notificationApi.open({
                                  type: "error",
                                  message: response,
                                });
                              })
                              .finally(() => {
                                setLoader(false);
                              });
                          } else {
                            notificationApi.open({
                              type: "warning",
                              message:
                                "No tienes permisos para generar este reporte",
                            });
                          }
                        } else {
                          window
                            .open(
                              `https://farmartltda.com/reportes/${link}.php?initialDate=${initialDate}&endDate=${endDate}&convenios=${convenios}`,
                              "_blank"
                            )
                            ?.focus();
                        }
                      } else {
                        control.setError("fechas_rango", {
                          type: "required",
                          message: "Rango de Fechas es necesario",
                        });
                      }
                    }}
                  >
                    Reporte General
                  </GreenButton>
                </Col>
              ) : null}
            </Row>
          </Form>
        </StyledCard>
      </Spin>
    </>
  );
};
