/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { validarAccesoDocumento } from "@/services/documentos/rqpAPI";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { CamposEstados, DataType, SummaryProps } from "./types";
import { KEY_BODEGA, KEY_EMPRESA, KEY_ROL } from "@/config/api";
import {
  ArrowLeftOutlined,
  LoadingOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import useSerialize from "@/modules/common/hooks/useUpperCase";
import { getBodega } from "@/services/maestras/bodegasAPI";
import {
  StyledFormItem,
  StyledCard,
} from "@/modules/common/layout/DashboardLayout/styled";
import { useEffect, useMemo, useState } from "react";
import {
  cambiarEstadoDevolucion,
  getInfoDevolucion,
  crearDevolucion,
  getDISxPACIENTE,
} from "@/services/documentos/devolucionDisAPI";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import {
  DevolucionDispensacionCabecera,
  IDispensacion,
  Bodega,
} from "@/services/types";
import {
  notification,
  SelectProps,
  DatePicker,
  Typography,
  Button,
  Select,
  Input,
  Space,
  Table,
  Form,
  Spin,
  Col,
  Row,
} from "antd";

const { Title, Text } = Typography;
const estadosVisibles = ["0", "2"];
const { TextArea } = Input;

export const FormDVD = () => {
  const { getSessionVariable } = useSessionStorage();
  const [dispensaciones, setDispensaciones] = useState<IDispensacion[]>([]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [camposEstados, setCamposEstados] = useState<CamposEstados[]>();
  const [selectDispensaciones, setSelectDispensaciones] = useState<
    SelectProps["options"]
  >([]);
  const [user_rol] = useState<string>(getSessionVariable(KEY_ROL));
  const [flagAcciones, setFlagAcciones] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [detalle, setDetalle] = useState<DataType[]>([]);
  const [bodegaInfo, setBodegaInfo] = useState<Bodega>();
  const [loaderDispensaciones, setLoaderDispensaciones] =
    useState<boolean>(false);
  const [urlSplit, setUrlSplit] = useState<string[]>([]);
  const [loader, setLoader] = useState<boolean>(true);
  const [accion, setAccion] = useState<string>("");
  const bodega_id = getSessionVariable(KEY_BODEGA);
  const { transformToUpperCase } = useSerialize();
  const [documentoInfo, setDocumentoInfo] =
    useState<DevolucionDispensacionCabecera>();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const control = useForm({
    mode: "onChange",
    defaultValues: {
      detalle: detalle,
      tipo_documento_id: 0,
      bodega_id: 0,
      paciente_id: "",
      numero_identificacion: "",
      observacion: "",
      subtotal: 0,
      iva: 0,
      total: 0,
      dispensacion_id: "",
    },
  });

  const summaryProps: SummaryProps = {
    firstCell: { index: 3, colSpan: 2, align: "right" },
    secondCell: { index: 4, colSpan: 7, align: "right" },
    thirdCell: { index: 5, align: "center" },
  };

  useEffect(() => {
    const url_split = location.pathname.split("/");
    setUrlSplit(url_split);

    const accion = id
      ? url_split[url_split.length - 2]
      : url_split[url_split.length - 1];

    setAccion(accion);

    const codigo_documento = id
      ? url_split[url_split.length - 3]
      : url_split[url_split.length - 2];
    setLoader(true);

    if (codigo_documento) {
      validarAccesoDocumento(
        codigo_documento.toUpperCase(),
        getSessionVariable(KEY_EMPRESA)
      ).then(({ data: { data } }) => {
        if (data) {
          const campos = data?.documento_info?.cabeceras?.map((item) => ({
            nombre_campo: item.campo.nombre_campo,
            id_campo: item.id_campo,
            estado: item.estado,
          }));
          setCamposEstados(campos);
          control.setValue("tipo_documento_id", data.documento_info.id);
          // Aqui se valida cada permiso y en caso de no contar con el permiso segun la accion se realiza el debido control
          if (data.crear !== "1" && accion == "create") {
            notificationApi.open({
              type: "error",
              message: "No tienes permisos para crear!",
            });
            setTimeout(() => {
              navigate(
                `/${url_split.at(1)}/${url_split.at(2)}/${codigo_documento}`
              );
            }, 1500);
            return;
          }
          if (data.modificar !== "1" && accion == "edit") {
            notificationApi.open({
              type: "error",
              message: "No tienes permisos para modificar!",
            });
            setTimeout(() => {
              navigate(
                `/${url_split.at(1)}/${url_split.at(2)}/${codigo_documento}`
              );
            }, 1500);
            return;
          }
          if (data.consultar !== "1" && accion == "show") {
            notificationApi.open({
              type: "error",
              message: "No tienes permisos para consultar!",
            });
            setTimeout(() => {
              navigate(
                `/${url_split.at(1)}/${url_split.at(2)}/${codigo_documento}`
              );
            }, 1500);
            return;
          }
          if (data.anular !== "1" && accion == "anular") {
            notificationApi.open({
              type: "error",
              message: "No tienes permisos para anular!",
            });
            setTimeout(() => {
              navigate(
                `/${url_split.at(1)}/${url_split.at(2)}/${codigo_documento}`
              );
            }, 1500);
            return;
          }
        } else {
          notificationApi.open({
            type: "error",
            message: "No tienes permisos para acceder a este documento!",
          });
          setTimeout(() => {
            navigate(`/${url_split.at(1)}`);
            setLoader(false);
          }, 1500);
        }
      });
    }
    if (id) {
      // Se valida que en la acciones EDIT, SHOW y ANULAR se capture el ID de la Orden de Compra ya creada para consultar su cabecera y detalle
      // e imprimirla en el formulario
      getInfoDevolucion(id).then(({ data: { data } }) => {
        setDocumentoInfo(data);
        // Esta condicion funciona para identificar si el documento se encuentra en estado cerrado (3) o en estado anulado (4), en
        // caso de estar en alguno de los estados setea en true un flag para no mostrar algunos botones
        if (["3", "4"].includes(data.estado)) {
          setFlagAcciones(true);
          const estado =
            data.estado == "2"
              ? "en proceso"
              : data.estado == "3"
              ? "cerrado"
              : "anulado";
          if (["create", "anular"].includes(accion)) {
            notificationApi.open({
              type: "error",
              message: `Este documento se encuentra ${estado}, no es posible realizar modificaciones, solo consulta.`,
            });
            setTimeout(() => {
              navigate(
                `/${url_split.at(1)}/${url_split.at(2)}/${codigo_documento}`
              );
            }, 2500);
            return;
          }
        }

        const detalle: DataType[] = data.detalle.map((item) => {
          return {
            key: item.numero_linea,
            dispensacion_id: item.dis_detalle.dispensaciones.id,
            consec_dis: item.dis_detalle.dispensaciones.consecutivo,
            producto_id: parseInt(item.producto_id),
            cod_barras: item.producto.cod_barra,
            desc_producto: item.producto.descripcion,
            cantidad: parseInt(item.dis_detalle.cantidad_entregada),
            cantidad_dev: parseInt(item.dis_detalle.cantidad_dev),
            cantidad_devolver: parseInt(item.cantidad),
            lote: item.lote,
            f_vence: item.fecha_vencimiento.toString(),
            precio_venta: parseFloat(item.precio_venta),
            precio_iva: parseFloat(item.precio_iva),
            precio_subtotal: parseFloat(item.precio_subtotal),
            precio_total: parseFloat(item.precio_total),
          };
        });
        setBodegaInfo(data.bodega);
        control.setValue("observacion", data.observacion);
        control.setValue("bodega_id", data.bodega.id);
        control.setValue("subtotal", parseFloat(data.subtotal));
        control.setValue(
          "iva",
          parseFloat(data.total) - parseFloat(data.subtotal)
        );
        control.setValue("total", parseFloat(data.total));
        control.setValue("detalle", detalle);
        setDataSource(detalle);
        setDetalle(detalle);
        const nombre_completo = `${data.paciente.nombre_primero} ${
          data.paciente.nombre_segundo ? data.paciente.nombre_segundo + " " : ""
        }${data.paciente.apellido_primero}${
          data.paciente.apellido_segundo
            ? " " + data.paciente.apellido_segundo
            : ""
        }`;
        control.setValue(
          "numero_identificacion",
          data.paciente.numero_identificacion
        );
        form.setFieldValue("nombre_paciente", nombre_completo);
        form.setFieldValue("fecha", dayjs(data.created_at));
        const dispensacion = data.detalle[0].dis_detalle.dispensaciones;
        setSelectDispensaciones([
          {
            value: dispensacion.id.toString(),
            label: dispensacion.consecutivo,
          },
        ]);
        control.setValue("dispensacion_id", dispensacion.id.toString());
        setLoader(false);
      });
    } else {
      getBodega(getSessionVariable(KEY_BODEGA)).then(({ data: { data } }) => {
        setBodegaInfo(data);
        control.setValue("bodega_id", data.id);
        form.setFieldValue("fecha", dayjs(new Date()));
        setLoader(false);
      });
      handleSearchDIS();
    }
  }, [id]);

  useEffect(() => {
    if (accion && !["show"].includes(accion)) {
      setLoader(true);
      getBodega(bodega_id).then(({ data: { data } }) => {
        if (data.estado_inventario == "1") {
          setLoader(true);
          notificationApi.error({
            message:
              "La bodega se encuentra en inventario, no es posible realizar ningún movimiento.",
          });
          setTimeout(() => {
            navigate(-1);
          }, 2000);
          return;
        }
      });
    }
  }, [accion]);

  useMemo(() => {
    let subtotal = 0;
    let iva = 0;
    let total = 0;
    detalle.forEach((item) => {
      subtotal += item.precio_subtotal;
      iva += item.precio_iva;
      total += item.precio_total;
    });

    control.setValue("subtotal", subtotal);
    control.setValue("iva", iva);
    control.setValue("total", total);
  }, [detalle]);

  useEffect(() => {
    control.setValue("detalle", dataSource);
  }, [dataSource]);

  const watchPaciente = control.watch("numero_identificacion");

  useEffect(() => {
    if (watchPaciente == "") {
      clearValues();
    }
  }, [watchPaciente]);

  const clearValues = () => {
    control.setValue("paciente_id", "");
    form.setFieldValue("nombre_paciente", null);
    setSelectDispensaciones([]);
    control.setValue("dispensacion_id", "");
    setDetalle([]);
    setDataSource([]);
  };

  const handleSearchDIS = () => {
    setLoaderDispensaciones(true);
    getDISxPACIENTE("DVD", getSessionVariable(KEY_BODEGA))
      .then(({ data: { data } }) => {
        setDispensaciones(data);
        if (data.length == 0) {
          notificationApi.open({
            type: "info",
            message:
              "No hay Dispensaciones disponibles para realizar Devoluciones",
          });
        }
        setSelectDispensaciones(
          data.map((item) => {
            const cant_entregada = item.detalle.reduce(
              (accumulador, value) =>
                accumulador + parseInt(value.cantidad_entregada),
              0
            );
            const cant_devuelta = item.detalle.reduce(
              (accumulador, value) =>
                accumulador + parseInt(value.cantidad_dev),
              0
            );
            const total_devuelta =
              cant_entregada == cant_devuelta ? true : false;
            return {
              value: item.id,
              label: total_devuelta
                ? `${item.consecutivo} (Devuelto en su totalidad)`
                : item.consecutivo,
              disabled: total_devuelta,
            };
          })
        );
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
      .finally(() => setLoaderDispensaciones(false));
  };

  const handleSelectDispensacion = (dis_id: string) => {
    const dispensacionSeleccionada = dispensaciones.find(
      (item) => item.id == parseInt(dis_id)
    );
    if (dispensacionSeleccionada) {
      control.setValue("paciente_id", dispensacionSeleccionada.paciente_id);
      const newDetalle: DataType[] = [];

      dispensacionSeleccionada.detalle.forEach((item) => {
        if (parseInt(item.cantidad_dev) == 0) {
          newDetalle.push({
            key: `${dis_id}_${item.id}`,
            dispensacion_id: parseInt(dis_id),
            consec_dis: dispensacionSeleccionada.consecutivo,
            producto_id: item.productos_lotes.producto_id,
            cod_barras: item.productos_lotes.productos.cod_barra,
            desc_producto: item.productos_lotes.productos.descripcion,
            cantidad: parseInt(item.cantidad_entregada),
            cantidad_dev: parseInt(item.cantidad_dev),
            cantidad_devolver: parseInt(item.cantidad_entregada),
            lote: item.productos_lotes.lote,
            f_vence: item.productos_lotes.fecha_vencimiento,
            precio_venta: parseFloat(item.precio_venta),
            precio_subtotal: parseFloat(item.precio_subtotal),
            precio_iva: parseFloat(item.precio_iva),
            precio_total: parseFloat(item.precio_venta_total),
          });
        }
      });

      setDataSource(newDetalle);
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Código",
      dataIndex: "producto_id",
      key: "producto_id",
      align: "center",
      width: 60,
      fixed: "left",
    },
    {
      title: "Descripción",
      dataIndex: "desc_producto",
      key: "desc_producto",
      width: 200,
    },
    {
      title: "Cantidad Entregada",
      dataIndex: "cantidad",
      key: "cantidad",
      align: "center",
      width: 80,
    },
    {
      title: ["create"].includes(accion)
        ? "Cant. a Devolver"
        : "Cant. Devuelta",
      dataIndex: "cantidad_devolver",
      key: "cantidad_devolver",
      align: "center",
      width: 80,
    },
    {
      title: "Lote",
      dataIndex: "lote",
      key: "lote",
      align: "center",
      width: 120,
    },
    {
      title: "F. V.",
      dataIndex: "f_vence",
      key: "f_vence",
      align: "center",
      width: 120,
    },
  ];

  if (["administrador", "regente", "regente_farmacia"].includes(user_rol)) {
    columns.push(
      {
        title: "Precio Unitario",
        dataIndex: "precio_venta",
        key: "precio_venta",
        align: "center",
        width: 110,
        render: (_, { precio_venta }) => {
          return (
            <>$ {parseFloat(precio_venta.toString()).toLocaleString("es-CO")}</>
          );
        },
      },
      {
        title: "SubTotal",
        dataIndex: "precio_subtotal",
        key: "precio_subtotal",
        align: "center",
        width: 90,
        render: (_, { precio_subtotal }) => {
          return (
            <>
              $ {parseFloat(precio_subtotal.toString()).toLocaleString("es-CO")}
            </>
          );
        },
      },
      {
        title: "IVA",
        dataIndex: "precio_iva",
        key: "precio_iva",
        align: "center",
        width: 90,
        render: (_, { precio_iva }) => {
          return (
            <>$ {parseFloat(precio_iva.toString()).toLocaleString("es-CO")}</>
          );
        },
      },
      {
        title: "Total",
        dataIndex: "precio_total",
        key: "precio_total",
        align: "center",
        width: 90,
        render: (_, { precio_total }) => {
          return (
            <>$ {parseFloat(precio_total.toString()).toLocaleString("es-CO")}</>
          );
        },
      }
    );
  }

  const onFinish: SubmitHandler<any> = async (data) => {
    setLoader(true);
    data = transformToUpperCase(data, ["observacion"]);
    if (!id) {
      crearDevolucion(data)
        .then(({ data: { data } }) => {
          notificationApi.open({
            type: "success",
            message: `Documento creado con exito!`,
          });
          setTimeout(() => {
            navigate(
              `/${urlSplit[1]}/${urlSplit[2]}/${urlSplit[3]}/show/${data.id}`
            );
          }, 800);
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
            setLoader(false);
          }
        )
        .finally(() => {
          setLoader(false);
        });
    }
  };

  const anularDocumento = () => {
    const data = {
      dvd_id: id,
      accion: accion,
    };
    setLoader(true);
    cambiarEstadoDevolucion(data)
      .then(() => {
        notificationApi.open({
          type: "success",
          message: `Se ha anulado el documento con exito!`,
        });
        setTimeout(() => {
          navigate(-1);
        }, 800);
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

          setLoader(false);
        }
      );
  };

  return (
    <>
      {contextHolder}
      <Spin
        spinning={loader}
        indicator={
          <LoadingOutlined spin style={{ fontSize: 40, color: "#f4882a" }} />
        }
        style={{ backgroundColor: "rgb(251 251 251 / 70%)" }}
      >
        <StyledCard
          className="styled-card-documents"
          title={
            <Title level={4}>
              Devolución de Dispensación{" "}
              {id && documentoInfo ? `- ${documentoInfo?.consecutivo}` : null}
            </Title>
          }
        >
          <Form
            layout="vertical"
            onFinish={control.handleSubmit(onFinish)}
            form={form}
          >
            <Row gutter={[12, 6]}>
              <Col span={24}>
                <Row gutter={12}>
                  <Col
                    xs={{ span: 24, order: 2 }}
                    sm={{ span: 12, order: 1 }}
                    md={{ offset: 8, span: 8, order: 1 }}
                  >
                    <StyledFormItem label={"Bodega:"}>
                      <Input disabled value={bodegaInfo?.bod_nombre} />
                    </StyledFormItem>
                  </Col>
                  <Col
                    xs={{ span: 24, order: 1 }}
                    sm={{ span: 12, order: 2 }}
                    md={{ span: 8, order: 2 }}
                  >
                    <StyledFormItem label={"Fecha :"} name={"fecha"}>
                      <DatePicker
                        disabled
                        format={"YYYY-MM-DD HH:mm"}
                        style={{ width: "100%" }}
                        suffixIcon={null}
                      />
                    </StyledFormItem>
                  </Col>
                  {/* <Col xs={24} md={8} order={3}>
                    <Controller
                      name="numero_identificacion"
                      control={control.control}
                      rules={{
                        required: {
                          value: true,
                          message: "Usuario es requerido",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem
                          label={"Usuario:"}
                          required
                          extra={
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              Digite el número de identificación del paciente y
                              presione Enter
                            </Text>
                          }
                        >
                          <Spin
                            spinning={loaderUser}
                            indicator={<LoadingOutlined spin />}
                            style={{
                              backgroundColor: "rgb(251 251 251 / 70%)",
                            }}
                          >
                            <Input
                              {...field}
                              placeholder="Usuario"
                              allowClear
                              onChange={(e) => {
                                if (e.target.value == "") {
                                  clearValues();
                                  control.setValue("numero_identificacion", "");
                                  control.setValue("paciente_id", "");
                                } else {
                                  control.setValue(
                                    "numero_identificacion",
                                    e.target.value
                                  );
                                }
                              }}
                              onPressEnter={(
                                event: React.KeyboardEvent<HTMLInputElement>
                              ) => handleSearchUser(event)}
                              onBlur={(event: any) => handleSearchUser(event)}
                              status={error && "error"}
                              disabled={detalle.length > 0 ? true : false}
                            />
                          </Spin>
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col> */}
                  {/* <Col xs={24} md={16} order={4}>
                    <StyledFormItem label={"Nombre:"} name={"nombre_paciente"}>
                      <Input disabled placeholder="Nombre Usuario" />
                    </StyledFormItem>
                  </Col> */}
                  <Col xs={24} md={12} order={5}>
                    <Controller
                      name="dispensacion_id"
                      control={control.control}
                      rules={{
                        required: {
                          value: true,
                          message: "Usuario es requerido",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem label={"Dispensaciones:"}>
                          <Spin
                            spinning={loaderDispensaciones}
                            indicator={<LoadingOutlined spin />}
                            style={{
                              backgroundColor: "rgb(251 251 251 / 70%)",
                            }}
                          >
                            <Select
                              {...field}
                              showSearch
                              filterOption={(input, option) =>
                                (option?.label?.toString() ?? "")
                                  .toLowerCase()
                                  .includes(input.toString().toLowerCase())
                              }
                              placeholder={"Buscar Dispensación"}
                              onSelect={handleSelectDispensacion}
                              options={selectDispensaciones}
                              disabled={!["create"].includes(accion)}
                            />
                          </Spin>
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col span={24} order={6}>
                    {estadosVisibles.includes(
                      camposEstados
                        ?.filter((item) => item.id_campo == "3")
                        .at(0)?.estado ?? ""
                    ) ? (
                      <Controller
                        name="observacion"
                        control={control.control}
                        rules={{
                          required: {
                            value:
                              camposEstados
                                ?.filter((item) => item.id_campo == "3")
                                .at(0)?.estado === "2",
                            message: "Observación es requerido",
                          },
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <StyledFormItem
                            required={
                              camposEstados
                                ?.filter((item) => item.id_campo == "3")
                                .at(0)?.estado === "2"
                            }
                            label={
                              camposEstados
                                ?.filter((item) => item.id_campo == "3")
                                .at(0)?.nombre_campo
                            }
                          >
                            <TextArea
                              {...field}
                              placeholder="Observación:"
                              status={error && "error"}
                              autoSize={{ minRows: 4, maxRows: 6 }}
                              maxLength={250}
                              showCount
                              disabled={
                                id
                                  ? ["show", "anular"].includes(accion)
                                    ? true
                                    : false
                                  : false
                              }
                              className="upperCaseText"
                            />
                            <Text type="danger">{error?.message}</Text>
                          </StyledFormItem>
                        )}
                      />
                    ) : (
                      <></>
                    )}
                  </Col>
                </Row>
              </Col>
              <Col span={24} style={{ marginTop: 15 }}>
                <Row gutter={[12, 12]}>
                  <Col span={24}>
                    <Table
                      rowKey={(record) => record.key}
                      size="small"
                      scroll={{ y: 700, x: 1500 }}
                      pagination={{
                        simple: false,
                        pageSize: 10,
                      }}
                      dataSource={dataSource}
                      columns={columns}
                      sticky
                      summary={() => (
                        <>
                          {dataSource.length > 0 &&
                          [
                            "administrador",
                            "regente",
                            "regente_farmacia",
                          ].includes(user_rol) ? (
                            <Table.Summary fixed={"bottom"}>
                              <Table.Summary.Row>
                                <Table.Summary.Cell
                                  {...summaryProps.firstCell}
                                ></Table.Summary.Cell>
                                <Table.Summary.Cell
                                  {...summaryProps.secondCell}
                                >
                                  <Text strong style={{ fontSize: 12 }}>
                                    Subtotal:
                                  </Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell {...summaryProps.thirdCell}>
                                  <Text strong style={{ fontSize: 12 }}>
                                    ${" "}
                                    {control
                                      .getValues("subtotal")
                                      .toLocaleString("es-CO")}
                                  </Text>
                                </Table.Summary.Cell>
                              </Table.Summary.Row>
                              <Table.Summary.Row>
                                <Table.Summary.Cell
                                  {...summaryProps.firstCell}
                                ></Table.Summary.Cell>
                                <Table.Summary.Cell
                                  {...summaryProps.secondCell}
                                >
                                  <Text strong style={{ fontSize: 12 }}>
                                    IVA:
                                  </Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell {...summaryProps.thirdCell}>
                                  <Text strong style={{ fontSize: 12 }}>
                                    ${" "}
                                    {control
                                      .getValues("iva")
                                      .toLocaleString("es-CO")}
                                  </Text>
                                </Table.Summary.Cell>
                              </Table.Summary.Row>
                              <Table.Summary.Row>
                                <Table.Summary.Cell
                                  {...summaryProps.firstCell}
                                ></Table.Summary.Cell>
                                <Table.Summary.Cell
                                  {...summaryProps.secondCell}
                                >
                                  <Text strong style={{ fontSize: 12 }}>
                                    Total:
                                  </Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell {...summaryProps.thirdCell}>
                                  <Text strong style={{ fontSize: 12 }}>
                                    ${" "}
                                    {control
                                      .getValues("total")
                                      .toLocaleString("es-CO")}
                                  </Text>
                                </Table.Summary.Cell>
                              </Table.Summary.Row>
                            </Table.Summary>
                          ) : (
                            <></>
                          )}
                        </>
                      )}
                    />
                  </Col>
                </Row>
              </Col>

              <Col
                span={24}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Space>
                  <Link
                    to={`/${urlSplit[1]}/${urlSplit[2]}/${urlSplit[3]}`}
                    relative="path"
                  >
                    <Button type="primary" icon={<ArrowLeftOutlined />} danger>
                      Volver
                    </Button>
                  </Link>
                  {!flagAcciones ? (
                    <>
                      {accion == "create" || accion == "edit" ? (
                        <Button
                          htmlType="submit"
                          type="primary"
                          disabled={dataSource.length == 0 ? true : false}
                          icon={<SaveOutlined />}
                        >
                          Guardar
                        </Button>
                      ) : null}
                      {accion == "anular" ? (
                        <Button
                          htmlType="button"
                          type="primary"
                          danger
                          onClick={anularDocumento}
                        >
                          Anular
                        </Button>
                      ) : null}
                    </>
                  ) : null}
                </Space>
              </Col>
            </Row>
          </Form>
        </StyledCard>
      </Spin>
    </>
  );
};
