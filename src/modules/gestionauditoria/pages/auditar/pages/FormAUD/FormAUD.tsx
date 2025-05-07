/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { getAudObservaciones } from "@/services/maestras/audObservacionesAPI";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { getMotivosAud } from "@/services/maestras/motivosAuditoriaAPI";
import { EditOutlined, DownloadOutlined } from "@ant-design/icons";
import useArrayBuffer from "@/modules/common/hooks/useArrayBuffer";
import {
  AudObservacion,
  IDispensacion,
  EstadosAuditoria,
} from "@/services/types";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  StyledFormItem,
  StyledCard,
} from "@/modules/common/layout/DashboardLayout/styled";
import { Controller, useForm } from "react-hook-form";
import Table, { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { DataType, Props } from "./types";
import {
  updateAuditoria,
  getArchivosDis,
  getEstadosAud,
  downloadFile,
  getInfoDis,
} from "@/services/auditar/auditarAPI";
import { KEY_ROL } from "@/config/api";
import dayjs from "dayjs";
import {
  notification,
  SelectProps,
  Typography,
  Collapse,
  Divider,
  message,
  Button,
  Select,
  Input,
  Space,
  Form,
  Spin,
  Col,
  Row,
  InputNumber,
} from "antd";
import { CustomSelect } from "@/modules/common/components/CustomSelect/CustomSelect";

dayjs.extend(customParseFormat);

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;

export const FormAUD = ({
  estadosBloqueados,
  updateDataSource,
  documentId,
  upModal,
}: Props) => {
  const { getSessionVariable } = useSessionStorage();
  const { arrayBufferToString } = useArrayBuffer();
  const [estadosAuditoria, setEstadosAuditoria] = useState<EstadosAuditoria[]>(
    []
  );
  const [notificationApi, contextHolder] = notification.useNotification();
  const [observacionesAuditoria, setObservacionesAuditoria] = useState<
    AudObservacion[]
  >([]);
  const [_selectObservacionesAud, setSelectObservacionesAud] = useState<
    SelectProps["options"]
  >([]);
  const [loaderArchivos, setLoaderArchivos] = useState<boolean>(true);
  const [documentoInfo, setDocumentoInfo] = useState<IDispensacion>();
  const [selectedMotivosProdu, setSelectedMotivosProdu] = useState<
    { motivo_prod: string; id_prod: string }[]
  >([]);
  const [user_rol] = useState<string>(getSessionVariable(KEY_ROL));
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [disabledEstado, setDisabledEstado] = useState(true);
  const [motivosAuditoria, setMotivosAuditoria] = useState<
    SelectProps["options"]
  >([]);
  const [estadosModalDet, setEstadosModalDet] = useState<
    SelectProps["options"]
  >([]);
  const [disabledAud, setDisabledAud] = useState(true);
  const [disabledMot, setDisabledMot] = useState(true);
  const [loader, setLoader] = useState<boolean>(true);
  const [archivos, setArchivos] = useState([]);

  const controlEstado = useForm();
  const control = useForm();

  const watchMotivos = controlEstado.watch("motivo_auditoria");
  const watchEstado = controlEstado.watch("auditoria_id");

  useEffect(() => {
    if (watchEstado === "3" || watchEstado === "8") {
      setDisabledMot(false);
    } else {
      setDisabledMot(true);
      controlEstado.clearErrors();
      controlEstado.setValue("motivo_auditoria", []);
      controlEstado.setValue("id_aud_observacion", undefined);
    }

    if (documentoInfo) {
      if (watchEstado != documentoInfo.estado_auditoria.id.toString()) {
        setDisabledAud(false);
      } else {
        setDisabledAud(true);
      }

      if (
        !estadosModalDet?.find(
          (item) => documentoInfo.estado_auditoria.id.toString() == item.value
        )
      ) {
        if (estadosModalDet) {
          setEstadosModalDet([
            ...estadosModalDet,
            {
              value: documentoInfo.estado_auditoria.id.toString(),
              label: documentoInfo.estado_auditoria.nombre_estado,
              disabled: true,
            },
          ]);
        }
      }
    }
  }, [watchEstado, documentoInfo]);

  useEffect(() => {
    if (documentoInfo) {
      if (
        watchMotivos &&
        documentoInfo.id_motivo_aud != null &&
        JSON.stringify(watchMotivos) != documentoInfo.id_motivo_aud
      ) {
        setDisabledAud(false);
      }
    }
  }, [watchMotivos, documentoInfo]);

  useEffect(() => {
    if (watchMotivos && ["3", "8"].includes(watchEstado)) {
      const observacionesOptions: SelectProps["options"] =
        observacionesAuditoria
          .filter((observacion) => {
            return JSON.parse(observacion.aud_motivos).find((motivo: any) =>
              watchMotivos.find(
                (motivoSelect: any) => motivoSelect == motivo.toString()
              )
            );
          })
          .map((item) => ({
            value: item.id.toString(),
            label: item.aud_observacion,
          }));
      setSelectObservacionesAud(observacionesOptions);
      if (
        !observacionesOptions
          .map((item) => item.value)
          .includes(controlEstado.getValues("id_aud_observacion"))
      ) {
        controlEstado.setValue("id_aud_observacion", undefined);
      }
    }
  }, [watchEstado, watchMotivos, observacionesAuditoria]);

  useEffect(() => {
    getEstadosAud().then(({ data: { data } }) => {
      setEstadosAuditoria(data);
    });

    getMotivosAud().then(({ data: { data } }) => {
      const opcionesMotivos1 = data
        ?.filter((item) => {
          return item.estado == "1";
        })
        .map((item) => {
          return {
            label: `${item.codigo.toString()} - ${item.motivo}${
              ![null, ""].includes(item.codigo_homologado)
                ? ` Código homologado: ${item.codigo_homologado}`
                : ""
            }`,
            value: item.id,
          };
        });
      setMotivosAuditoria(opcionesMotivos1);
    });

    getAudObservaciones().then(({ data: { data } }) => {
      setObservacionesAuditoria(data.filter((item) => item.estado == "1"));
    });
  }, []);

  useEffect(() => {
    setDataSource([]);
    setLoader(true);
    if (documentId) {
      getInfoDis(documentId.toString())
        .then(({ data: { data } }) => {
          setDocumentoInfo(data);
          control.setValue("id_aud_observacion", undefined);
          control.setValue("observacion", data.observacion);
          control.setValue(
            "convenio_id",
            data.convenios.num_contrato + " - " + data.convenios.descripcion
          );
          control.setValue("cuota_moderadora", data.cuota_moderadora);
          control.setValue("autorizacion_cabecera", data.autorizacion_cabecera);
          control.setValue(
            "tipo_documento",
            data.pacientes.tipo_identificacion
          );
          control.setValue(
            "numero_identificacion",
            data.pacientes.numero_identificacion
          );
          control.setValue("concepto_id", data.conceptos.nombre);
          control.setValue(
            "fecha_formula",
            dayjs(data.fecha_formula).format("YYYY-MM-DD")
          );
          control.setValue("numero_formula", data.numero_formula);
          control.setValue("lugar_formula", data.lugar_formula_info.entidad);
          control.setValue("tipo_consulta", data.tipo_consulta.nombre);
          control.setValue("medico_id", data.medico_id);
          control.setValue(
            "diagnostico_id",
            `${data.diagnosticos.codigo} - ${data.diagnosticos.descripcion}`
          );
          control.setValue("entidad", data.pacientes.eps.entidad);
          control.setValue("categoria", data.regimen_info.categoria);
          control.setValue("regimen", data.regimen_info.regimen);
          control.setValue(
            "tipo_regimen",
            data.tipo_regimen_info ? data.tipo_regimen_info.nombre : ""
          );
          control.setValue("valor", parseFloat(data.valor));
          control.setValue("valor_cuota", parseFloat(data.valor_cuota));
          control.setValue("bodega_id", data.bodega_id);
          const nombre_completo = `${data.pacientes.nombre_primero} ${
            data.pacientes.nombre_segundo
              ? data.pacientes.nombre_segundo + " "
              : ""
          }${data.pacientes.apellido_primero}${
            data.pacientes.apellido_segundo
              ? " " + data.pacientes.apellido_segundo
              : ""
          }`;
          control.setValue("despacho_id", data.despachos.despacho);
          control.setValue("nombre_completo", nombre_completo);
          control.setValue(
            "tipo_identificacion_m",
            data.medicos.tipo_identificacion
          );
          control.setValue(
            "numero_identificacion_m",
            data.medicos.numero_identificacion
          );
          control.setValue(
            "nombre_medico",
            `${data.medicos.nombre_primero} ${
              data.medicos.nombre_segundo
                ? data.medicos.nombre_segundo + " "
                : ""
            }${data.medicos.apellido_primero} ${
              data.medicos.apellido_segundo
                ? data.medicos.apellido_segundo + " "
                : ""
            }`
          );
          control.setValue("bodega_id", data.bodega_id);

          control.setValue("genero_paciente", data.pacientes.genero);
          control.setValue(
            "fecha_nacimiento_paciente",
            data.pacientes.fecha_nacimiento
          );

          if (estadosBloqueados.includes(data.estado_auditoria.id)) {
            setDisabledEstado(true);
          } else {
            setDisabledEstado(false);
          }

          const fecha = new Date(data.created_at);
          const dia = fecha.getDate();
          const mes = fecha.getMonth() + 1;
          const año = fecha.getFullYear();

          const fechaFormateada = `${dia < 10 ? "0" + dia : dia}/${
            mes < 10 ? "0" + mes : mes
          }/${año}`;
          control.setValue("fecha", fechaFormateada);

          const detalle: any[] = data.detalle.map((item, index) => {
            return {
              key: index,
              id: item.producto_id,
              descripcion: item.producto.descripcion,
              cantSol: item.cantidad_solicitada,
              dias_tratamiento: item.dias_tratamiento,
              cantidad: item.cantidad_entregada,
              cantDev: item.cantidad_dev,
              fvence: item.productos_lotes.fecha_vencimiento,
              lote: item.productos_lotes.lote,
              precio_lista: item.precio_venta,
              precio_subtotal: item.precio_subtotal,
              iva: item.precio_iva,
              precio_total: item.precio_venta_total,
              aut_detalle: item.autorizacion_detalle,
              motivo_produ:
                isNaN(parseInt(item.id_motivo_detalle)) ||
                item.id_motivo_detalle === null
                  ? ""
                  : parseInt(item.id_motivo_detalle),
              editable: true,
            };
          });
          setDataSource(detalle);
          if (
            data.estado_auditoria.id === 3 ||
            data.estado_auditoria.id === 8
          ) {
            controlEstado.setValue(
              "id_aud_observacion",
              data.ultimo_estado_aud.id_aud_observacion
            );
          }
          controlEstado.setValue(
            "motivo_auditoria",
            JSON.parse(data.id_motivo_aud)
          );
          controlEstado.setValue(
            "auditoria_id",
            data.estado_auditoria.id.toString()
          );

          getArchivosDis(data.consecutivo)
            .then(({ data: { data } }) => {
              setArchivos(data);
            })
            .catch((error) => {
              console.error("Error al obtener la lista de archivos:", error);
            })
            .finally(() => setLoaderArchivos(false));
        })
        .finally(() => setLoader(false));
    }
  }, [documentId, upModal]);

  // Validacion para saber si muestra los estados de auditoria en el modal de cambio de estado
  useEffect(() => {
    if (
      documentoInfo &&
      estadosModalDet &&
      estadosModalDet.length > 0 &&
      estadosAuditoria.length > 0 &&
      user_rol
    ) {
      // console.log(documentoInfo.convenios.reg_conv)
      const estadosReales = estadosAuditoria
        .filter((estado) => estado.rol_estado?.includes(user_rol))
        .filter((estado) =>
          parseFloat(documentoInfo.total) < parseFloat(documentoInfo.valor)
            ? ["3", "8", "11", "12"].includes(estado.id.toString())
            : parseFloat(documentoInfo.total) > 0 &&
              parseFloat(documentoInfo.valor) > 0 &&
              documentoInfo.convenios.id_mod_contra == "3"
            ? !["5"].includes(estado.id.toString())
            : true
        )
        .map((item) => ({
          value: item.id.toString(),
          label: item.nombre_estado,
        }));

      setEstadosModalDet(estadosReales);
    }
  }, [documentoInfo, estadosModalDet, estadosAuditoria, user_rol]);

  const columnsArchivos: ColumnsType<any> = [
    {
      title: "Nombre del Archivo",
      dataIndex: "image",
      key: "image",
      render: (value: string) => {
        const urlSplit = value.split("/");
        const name = urlSplit[urlSplit.length - 1];
        return name;
      },
    },
    {
      title: "Fecha Cargue",
      dataIndex: "fecha_cargue",
      key: "fecha_cargue",
      align: "center",
      width: 150,
      render(value) {
        return value ? (
          <Text>{dayjs(value).format("YYYY-MM-DD HH:mm")}</Text>
        ) : (
          <Text>Sin fecha</Text>
        );
      },
    },
    {
      title: "Acciones",
      key: "acciones",
      align: "center",
      width: 150,
      render: (_, { image: url, consecutivo }) => {
        const urlSplit = url.split("/");
        const name = urlSplit[urlSplit.length - 1];
        return (
          <Button
            type="primary"
            onClick={() => download(name, consecutivo)}
            icon={<DownloadOutlined />}
          >
            Descargar
          </Button>
        );
      },
    },
  ];

  const download = (name: any, consecutivo: any) => {
    setLoaderArchivos(true);
    downloadFile(name, consecutivo)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", name);
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
      .finally(() => setLoaderArchivos(false));
  };

  const calcularTotalAcumulado = () => {
    const totalAcumulado = dataSource.reduce((total, producto) => {
      const precioTotal = parseFloat(producto.precio_total);
      return isNaN(precioTotal) ? total : total + precioTotal;
    }, 0);

    return `${totalAcumulado.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handleMotivoSelectChange = (value: string, record: DataType) => {
    setSelectedMotivosProdu((prevSelectedMotivos) => [
      ...prevSelectedMotivos,
      {
        motivo_prod: value,
        id_prod: record.id,
      },
    ]);

    // setDisabledAud(false);
  };

  const columnsProds: ColumnsType<DataType> = [
    {
      title: "Código",
      dataIndex: "id",
      key: "id",
      align: "center",
      fixed: "left",
      width: 80,
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
      fixed: "left",
      width: 150,
    },
    {
      title: "Motivo",
      dataIndex: "motivo_produ",
      key: "motivo_produ",
      align: "center",
      fixed: "left",
      width: 200,
      render: (_, record) => {
        return (
          <>
            <CustomSelect
              style={{ width: "100%" }}
              options={motivosAuditoria?.map((item) => ({
                value: item.value,
                label: item.label,
              }))}
              placeholder="Motivo por detalle"
              onChange={(value) => handleMotivoSelectChange(value, record)}
              disabled={disabledMot}
              defaultValue={record.motivo_produ}
              listHeight={400}
            />
          </>
        );
      },
    },
  ];

  const columns: ColumnsType<DataType> = [
    {
      title: "Código",
      dataIndex: "id",
      key: "id",
      align: "center",
      fixed: "left",
      width: 80,
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
      fixed: "left",
      width: 250,
    },
    {
      title: "Días Tratamiento",
      dataIndex: "dias_tratamiento",
      key: "dias_tratamiento",
      align: "center",
      width: 100,
    },
    {
      title: "Cant. Solicitada",
      dataIndex: "cantSol",
      key: "cantSol",
      align: "center",
      width: 100,
    },
    {
      title: "Cant. Entregada",
      dataIndex: "cantidad",
      key: "cantidad",
      align: "center",
      width: 100,
    },
    {
      title: "Autorización",
      dataIndex: "aut_detalle",
      key: "aut_detalle",
      align: "center",
      width: 130,
    },
    {
      title: "Vence",
      dataIndex: "fvence",
      key: "fvence",
      align: "center",
      width: 90,
    },
    {
      title: "Lote",
      dataIndex: "lote",
      key: "lote",
      align: "center",
      width: 100,
    },
    {
      title: "Precio",
      dataIndex: "precio_lista",
      key: "precio_lista",
      align: "center",
      width: 100,
      render: (_, record) => {
        return <>$ {parseFloat(record.precio_lista).toLocaleString("es-CO")}</>;
      },
    },
    {
      title: "SubTotal",
      dataIndex: "precio_subtotal",
      key: "precio_subtotal",
      width: 110,
      align: "center",
      render: (_, record) => {
        return (
          <>$ {parseFloat(record.precio_subtotal).toLocaleString("es-CO")}</>
        );
      },
    },
    {
      title: "IVA",
      dataIndex: "iva",
      key: "iva",
      width: 90,
      align: "center",
      render: (_, record) => {
        return <>$ {parseFloat(record.iva).toLocaleString("es-CO")}</>;
      },
    },
    {
      title: "Total",
      dataIndex: "precio_total",
      key: "precio_total",
      width: 100,
      align: "center",
      render: (_, record) => {
        return <>$ {parseFloat(record.precio_total).toLocaleString("es-CO")}</>;
      },
    },
  ];

  const cambiarEstadoAuditoria = (data: any) => {
    setLoader(true);
    updateAuditoria(
      {
        idEstado: data.auditoria_id,
        selectedMotivos: data.motivo_auditoria,
        motivosProducto: selectedMotivosProdu,
        id_aud_observacion: data.id_aud_observacion,
      },
      documentId
    )
      .then(() => {
        message.open({
          type: "success",
          content: "Estado actualizado exitosamente!",
        });
        updateDataSource();
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

  return (
    <>
      {contextHolder}
      <StyledCard
        className="styled-card-documents"
        title={
          <Title level={4}>
            {"Documento  "}
            {documentId && documentoInfo
              ? ` ${documentoInfo?.consecutivo}`
              : null}
          </Title>
        }
        style={{ marginTop: 25 }}
      >
        <Spin spinning={loader}>
          <div
            style={{
              background: "#f0f0f0",
              padding: "16px",
              marginBottom: "16px",
              textAlign: "center",
            }}
          >
            <Divider
              children={
                <>
                  <Text>Cambio de Estado Consecutivo:</Text>
                  <Text type="secondary">
                    {" "}
                    {documentId && documentoInfo
                      ? ` ${documentoInfo?.consecutivo}`
                      : null}
                  </Text>
                </>
              }
            />
            <Form onFinish={controlEstado.handleSubmit(cambiarEstadoAuditoria)}>
              <Col span={12} style={{ width: "100%", alignItems: "center" }}>
                <Controller
                  name="auditoria_id"
                  control={controlEstado.control}
                  rules={{
                    required: {
                      value: !disabledMot,
                      message: "Estado de Auditoria es necesario",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem
                      label="Estado:"
                      required
                      extra={
                        documentoInfo?.devolucion_dis == "1" ? (
                          <Text type="danger">
                            Esta dispensación ya tuvo una Devolución, no se
                            puede cambiar el estado
                          </Text>
                        ) : null
                      }
                    >
                      <Select
                        {...field}
                        placeholder="Seleccionar Estado"
                        optionLabelProp="label"
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toString()
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        status={error && "error"}
                        options={estadosModalDet}
                        disabled={
                          disabledEstado || documentoInfo?.devolucion_dis == "1"
                        }
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>
              <Col span={24} style={{ width: "100%" }}>
                <Controller
                  name="motivo_auditoria"
                  rules={{
                    required: {
                      value: !disabledMot,
                      message:
                        "Se requiere un motivo para el estado seleccionado.",
                    },
                  }}
                  control={controlEstado.control}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem required={!disabledMot} label="Motivo:">
                      <CustomSelect
                        {...field}
                        mode="multiple"
                        placeholder="Seleccionar Motivo(s)"
                        error={error}
                        options={motivosAuditoria}
                        disabled={disabledMot}
                        listHeight={400}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>
              {/* <Col xs={24}>
                  <Controller
                    name="id_aud_observacion"
                    control={controlEstado.control}
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem label="Observación:">
                        <Select
                          {...field}
                          placeholder="Observación"
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toString()
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={selectObservacionesAud}
                          disabled={disabledMot}
                          status={error && "error"}
                        />
                        <Text type="danger">{error?.message}</Text>
                      </StyledFormItem>
                    )}
                  />
                </Col> */}
              <Divider
                children={
                  <>
                    <Text>Cambio de Estado por Producto Remisión:</Text>
                    <Text type="secondary">
                      {" "}
                      {documentId && documentoInfo
                        ? ` ${documentoInfo?.consecutivo}`
                        : null}
                    </Text>
                  </>
                }
              />
              <Col span={24} style={{ marginTop: 15 }}>
                <Row gutter={[12, 12]}>
                  <Col span={24}>
                    <Table
                      rowKey={(record) => record.key}
                      size="small"
                      scroll={{ y: 700 }}
                      pagination={{
                        simple: false,
                        hideOnSinglePage: true,
                      }}
                      bordered
                      dataSource={dataSource}
                      columns={columnsProds}
                    />
                  </Col>
                  <Col span={24}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={disabledAud}
                    >
                      <EditOutlined /> Actualizar Auditoría
                    </Button>
                  </Col>
                  <Col span={24}>
                    {archivos.length > 0 ? (
                      <Table
                        rowKey={(record) => record.id}
                        dataSource={archivos}
                        columns={columnsArchivos}
                        loading={loaderArchivos}
                        size="small"
                        pagination={{
                          hideOnSinglePage: true,
                        }}
                      />
                    ) : (
                      <Title level={3} type="danger">
                        Sin soportes
                      </Title>
                    )}
                  </Col>
                </Row>
              </Col>
            </Form>
          </div>
          <div className="custom-collapse-container">
            <Collapse defaultActiveKey={["1"]}>
              <Panel header="Ver Dispensación" key="1">
                <Form layout={"vertical"}>
                  <Row gutter={[12, 6]}>
                    <Col span={24}>
                      <Row gutter={12}>
                        <Col xs={24} sm={12}>
                          <Controller
                            name="convenio_id"
                            control={control.control}
                            render={({ field }) => (
                              <StyledFormItem label={"Código convenio:"}>
                                <Input {...field} disabled />
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                        <Col xs={24} sm={6}>
                          <Controller
                            name="cuota_moderadora"
                            control={control.control}
                            render={({ field }) => (
                              <StyledFormItem label={"Recaudo de moderadora:"}>
                                <Input {...field} disabled />
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                        <Col xs={24} sm={6}>
                          {control.getValues("autorizacion_cabecera") ? (
                            <Controller
                              name="autorizacion_cabecera"
                              control={control.control}
                              render={({ field }) => (
                                <StyledFormItem
                                  label={"Autorización de cabecera:"}
                                >
                                  <Input {...field} disabled />
                                </StyledFormItem>
                              )}
                            />
                          ) : null}
                        </Col>
                      </Row>
                      <Row gutter={12}>
                        <Col xs={24} md={4}>
                          <Controller
                            name="tipo_documento"
                            control={control.control}
                            render={({ field }) => (
                              <StyledFormItem label={"Tipo Documento:"}>
                                <Input {...field} disabled />
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                        <Col xs={24} sm={6}>
                          <Controller
                            name="numero_identificacion"
                            control={control.control}
                            render={({ field }) => (
                              <StyledFormItem label={"Documento paciente:"}>
                                <Input {...field} disabled />
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                        <Col xs={24} sm={14}>
                          <Controller
                            name="nombre_completo"
                            control={control.control}
                            render={({ field }) => (
                              <StyledFormItem
                                label={"Paciente Completo Paciente:"}
                              >
                                <Input {...field} disabled />
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                      </Row>
                      <Row gutter={12}>
                        <Col xs={24} md={12}>
                          <Controller
                            name="genero_paciente"
                            control={control.control}
                            render={({ field }) => (
                              <StyledFormItem label={"Genero:"}>
                                <Input {...field} disabled />
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                        <Col xs={24} md={12}>
                          <Controller
                            name="fecha_nacimiento_paciente"
                            control={control.control}
                            render={({ field }) => (
                              <StyledFormItem label={"Fecha Nacimiento:"}>
                                <Input {...field} disabled />
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                      </Row>
                      <Row gutter={12}>
                        <Col xs={24} sm={5}>
                          <Controller
                            name="regimen"
                            control={control.control}
                            render={({ field }) => (
                              <StyledFormItem label={"Regimen:"}>
                                <Input {...field} disabled />
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                        <Col xs={24} sm={5}>
                          <Controller
                            name="tipo_regimen"
                            control={control.control}
                            render={({ field }) => (
                              <StyledFormItem label={"Tipo Regimen:"}>
                                <Input {...field} disabled />
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                        <Col xs={24} sm={2}>
                          <Controller
                            name="categoria"
                            control={control.control}
                            render={({ field }) => (
                              <StyledFormItem label={"Categoria:"}>
                                <Input {...field} disabled />
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                        <Col xs={24} sm={4}>
                          <Controller
                            name="valor"
                            control={control.control}
                            render={({ field, fieldState: { error } }) => (
                              <StyledFormItem label={"Cuota Moderadora:"}>
                                <Space.Compact style={{ width: "100%" }}>
                                  <InputNumber
                                    {...field}
                                    status={error && "error"}
                                    disabled
                                    prefix={"$"}
                                    formatter={(value) =>
                                      `${value}`.replace(
                                        /\B(?=(\d{3})+(?!\d))/g,
                                        ","
                                      )
                                    }
                                    style={{ width: "100%" }}
                                  />
                                </Space.Compact>
                                <Text type="danger">{error?.message}</Text>
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                        <Col xs={24} sm={3}>
                          <Controller
                            name="valor_cuota"
                            control={control.control}
                            render={({ field, fieldState: { error } }) => (
                              <StyledFormItem label={"Cuota Cobrada:"}>
                                <Space.Compact style={{ width: "100%" }}>
                                  <InputNumber
                                    {...field}
                                    status={error && "error"}
                                    disabled
                                    prefix={"$"}
                                    formatter={(value) =>
                                      `${value}`.replace(
                                        /\B(?=(\d{3})+(?!\d))/g,
                                        ","
                                      )
                                    }
                                    style={{ width: "100%" }}
                                  />
                                </Space.Compact>
                                <Text type="danger">{error?.message}</Text>
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                        <Col xs={24} sm={5}>
                          <Controller
                            name="entidad"
                            control={control.control}
                            render={({ field }) => (
                              <StyledFormItem label={"Eps:"}>
                                <Input {...field} disabled />
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                      </Row>
                      <Row gutter={12}>
                        <Col xs={24} sm={4}>
                          <Controller
                            name="tipo_identificacion_m"
                            control={control.control}
                            render={({ field, fieldState: { error } }) => (
                              <StyledFormItem label={"Tipo documento:"}>
                                <Input
                                  {...field}
                                  status={error && "error"}
                                  disabled
                                />
                                <Text type="danger">{error?.message}</Text>
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                        <Col xs={24} sm={6}>
                          <Controller
                            name="numero_identificacion_m"
                            control={control.control}
                            render={({ field, fieldState: { error } }) => (
                              <StyledFormItem
                                label={"Numero documento medico:"}
                              >
                                <Input
                                  {...field}
                                  status={error && "error"}
                                  disabled
                                />
                                <Text type="danger">{error?.message}</Text>
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                        <Col xs={24} sm={14}>
                          <Controller
                            name="nombre_medico"
                            control={control.control}
                            render={({ field }) => (
                              <StyledFormItem
                                label={"Medico nombres - apellidos:"}
                              >
                                <Input {...field} disabled />
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                      </Row>
                      <Row gutter={12}>
                        <Col xs={24} sm={24}>
                          <Controller
                            name="diagnostico_id"
                            control={control.control}
                            render={({ field, fieldState: { error } }) => (
                              <StyledFormItem label={"Diagnostico medico:"}>
                                <Select
                                  {...field}
                                  showSearch
                                  filterOption={false}
                                  placeholder={"Buscar diagnostico medico"}
                                  notFoundContent={null}
                                  status={error && "error"}
                                  disabled
                                />
                                <Text type="danger">{error?.message}</Text>
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                      </Row>
                      <Row gutter={12}>
                        <Col xs={24} sm={6}>
                          <Controller
                            name="fecha_formula"
                            control={control.control}
                            render={({ field }) => (
                              <StyledFormItem label={"Fecha formula:"}>
                                <Input {...field} disabled />
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                        <Col xs={24} sm={6}>
                          <Controller
                            name="numero_formula"
                            control={control.control}
                            render={({ field }) => (
                              <StyledFormItem label={"Numero formula:"}>
                                <Input {...field} disabled />
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                        <Col xs={24} sm={6}>
                          <Controller
                            name="lugar_formula"
                            control={control.control}
                            render={({ field }) => (
                              <StyledFormItem
                                label={"Centro - clinico formula:"}
                              >
                                <Input {...field} disabled />
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                        <Col xs={24} sm={6}>
                          <Controller
                            name="despacho_id"
                            control={control.control}
                            render={({ field }) => (
                              <StyledFormItem label="Despacho medicamentos:">
                                <Input {...field} disabled />
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col span={24}>
                      <Row gutter={12}>
                        <Col xs={24} sm={12}>
                          <Controller
                            name="concepto_id"
                            control={control.control}
                            render={({ field }) => (
                              <StyledFormItem label={"Concepto medico:"}>
                                <Input {...field} disabled />
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                        <Col xs={24} sm={12}>
                          <Controller
                            name="tipo_consulta"
                            control={control.control}
                            render={({ field }) => (
                              <StyledFormItem label={"Tipo consulta:"}>
                                <Input {...field} disabled />
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col span={24}>
                      <Row gutter={12}>
                        <Col xs={24} sm={24}>
                          <Controller
                            name="observacion"
                            control={control.control}
                            render={({ field }) => (
                              <StyledFormItem label={"Observaciones:"}>
                                <TextArea
                                  {...field}
                                  placeholder="Observación"
                                  autoSize={{ minRows: 4, maxRows: 6 }}
                                  maxLength={500}
                                  showCount
                                  disabled
                                />
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col span={24} style={{ marginTop: 15 }}>
                      <Row gutter={[12, 12]}>
                        <Col span={24}>
                          <Table
                            rowKey={(record) => record.key}
                            size="small"
                            scroll={{ y: 700 }}
                            pagination={{
                              simple: false,
                              hideOnSinglePage: true,
                            }}
                            bordered
                            dataSource={dataSource}
                            columns={columns}
                          />
                        </Col>
                      </Row>
                      <Row justify="end">
                        <Col>
                          <Text strong>Total: ${calcularTotalAcumulado()}</Text>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Form>
              </Panel>
            </Collapse>
          </div>
        </Spin>
      </StyledCard>
    </>
  );
};
