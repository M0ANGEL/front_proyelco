/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { SelectedProduct } from "../../componentes/ModalProductos/types";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { validarAccesoDocumento } from "@/services/documentos/rqpAPI";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { CamposEstados, DataType, SummaryProps } from "./types";
import { KEY_BODEGA, KEY_EMPRESA, KEY_ROL } from "@/config/api";
import useSerialize from "@/modules/common/hooks/useUpperCase";
import React, { useEffect, useMemo, useState } from "react";
import { fetchUserProfile } from "@/services/auth/authAPI";
import { getBodega } from "@/services/maestras/bodegasAPI";
import {
  StyledFormItem,
  StyledCard,
} from "@/modules/common/layout/DashboardLayout/styled";
import { ModalProductos } from "../../componentes";
import {
  cambiarEstadoDevolucion,
  getInfoDevolucion,
  crearDevolucion,
  getDISxPACIENTE,
  searchPacientes,
  getPDF,
} from "@/services/documentos/devolucionDisAPI";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import {
  ArrowLeftOutlined,
  LoadingOutlined,
  DeleteOutlined,
  FilePdfFilled,
  PlusOutlined,
} from "@ant-design/icons";
import {
  DevolucionDispensacionCabecera,
  IDispensacion,
  Paciente,
  UserData,
  Bodega,
} from "@/services/types";
import {
  notification,
  DatePicker,
  Typography,
  Button,
  Input,
  Space,
  Table,
  Form,
  Spin,
  Col,
  Row,
  Select,
} from "antd";

let timeout: ReturnType<typeof setTimeout> | null;
const { Title, Text } = Typography;
const estadosVisibles = ["0", "2"];
const { TextArea } = Input;

export const FormDVH = () => {
  const [dispensaciones, setDispensaciones] = useState<IDispensacion[]>([]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [camposEstados, setCamposEstados] = useState<CamposEstados[]>();
  const [documentoInfo, setDocumentoInfo] =
    useState<DevolucionDispensacionCabecera>();
  const { getSessionVariable } = useSessionStorage();
  const [user_rol] = useState<string>(getSessionVariable(KEY_ROL));
  const bodega_id = getSessionVariable(KEY_BODEGA);
  const [flagAcciones, setFlagAcciones] = useState<boolean>(false);
  const [loaderUser, setLoaderUser] = useState<boolean>(false);
  const [hasFuente, setHasFuente] = useState<boolean>(false);
  const [detalle, setDetalle] = useState<DataType[]>([]);
  const [bodegaInfo, setBodegaInfo] = useState<Bodega>();
  const [urlSplit, setUrlSplit] = useState<string[]>([]);
  const [paciente, setPaciente] = useState<Paciente>();
  const [loader, setLoader] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [accion, setAccion] = useState<string>("");
  const { transformToUpperCase } = useSerialize();
  const [user, setUser] = useState<UserData>();
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
      id_fuente: "",
      numero_servinte: "",
      numero_fuente: "",
    },
  });

  const summaryProps: SummaryProps = {
    firstCell: { index: 0, colSpan: hasFuente ? 4 : 2, align: "right" },
    secondCell: { index: 2, colSpan: id ? 8 : 9, align: "right" },
    thirdCell: { index: id ? 10 : 11, align: "center" },
    fourthCell: { index: id ? 11 : 12 },
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
            fuente: item.dis_detalle.dispensaciones.fuente
              ? item.dis_detalle.dispensaciones.fuente.prefijo
              : "",
            numero_servinte: item.dis_detalle.dispensaciones.numero_servinte,
            codigo_servinte: item.producto.cod_huv,
            producto_id: parseInt(item.producto_id),
            cod_barras: item.producto.cod_barra,
            desc_producto: item.producto.descripcion,
            // cantidad: parseInt(item.dis_detalle.cantidad_entregada),
            cantidad: parseInt(item.cantidad),
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
        control.setValue("id_fuente", data.id_fuente);
        control.setValue("numero_servinte", data.numero_servinte);
        control.setValue("observacion", data.observacion);
        control.setValue("bodega_id", data.bodega.id);
        control.setValue("subtotal", parseFloat(data.subtotal));
        control.setValue(
          "iva",
          parseFloat(data.total) - parseFloat(data.subtotal)
        );
        control.setValue("total", parseFloat(data.total));
        control.setValue("detalle", detalle);
        setDetalle(detalle);
        const nombre_completo = `${data.paciente.nombre_primero} ${data.paciente.nombre_segundo} ${data.paciente.apellido_primero} ${data.paciente.apellido_segundo}`;
        control.setValue(
          "numero_identificacion",
          data.paciente.numero_identificacion
        );
        form.setFieldValue("nombre_paciente", nombre_completo);
        form.setFieldValue("fecha", dayjs(data.created_at));
        setLoader(false);
      });
    } else {
      getBodega(getSessionVariable(KEY_BODEGA)).then(({ data: { data } }) => {
        setBodegaInfo(data);
        control.setValue("bodega_id", data.id);
        form.setFieldValue("fecha", dayjs(new Date()));
        setLoader(false);
      });
    }
    // Lógica para validar si el usuario tiene fuentes o no
    fetchUserProfile().then(({ data: { userData } }) => {
      setUser(userData);
    });
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

  useEffect(() => {
    if (user) {
      if (user.has_fuentes == "1") {
        setHasFuente(true);
        const fuentes =
          user.fuentes_info.filter(
            (item) => item.fuente.tipo_fuente == "devolucion"
          ) ?? [];
        if (fuentes.length == 1 && ["create"].includes(accion)) {
          control.setValue("id_fuente", fuentes[0].fuente_id);
        }
      } else {
        setHasFuente(false);
      }
    }
  }, [user]);

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

  const handleSearchUser = (event: any) => {
    const query = event.target.value.toString();
    setLoaderUser(true);
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (query.length > 0) {
      timeout = setTimeout(() => {
        searchPacientes(query)
          .then(({ data: { data } }) => {
            if (data) {
              setPaciente(data);
              control.setValue("paciente_id", data.id.toString());
              const nombre_completo = `${data.nombre_primero} ${
                data.nombre_segundo ? data.nombre_segundo + " " : ""
              }${data.apellido_primero}${
                data.apellido_segundo ? " " + data.apellido_segundo : ""
              }`;
              form.setFieldValue("nombre_paciente", nombre_completo);
            } else {
              setPaciente(undefined);
              form.setFieldValue("nombre_paciente", null);
              notificationApi.open({
                type: "error",
                message:
                  "No se encuentra paciente con el número de identificación digitado, por favor valida el número digitado.",
              });
            }
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
              clearValues();
            }
          )
          .finally(() => setLoaderUser(false));
      }, 500);
    } else {
      setDispensaciones([]);
      setLoaderUser(false);
    }
  };

  const clearValues = () => {
    control.setValue("paciente_id", "");
    form.setFieldValue("nombre_paciente", null);
    setPaciente(undefined);
  };

  const handleSearchDIS = () => {
    if (paciente) {
      setLoader(true);
      getDISxPACIENTE(
        urlSplit[3],
        getSessionVariable(KEY_BODEGA),
        paciente.id.toString()
      )
        .then(({ data: { data } }) => {
          setDispensaciones(data);
          setOpen(true);
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
        .finally(() => setLoader(false));
    }
  };

  const handleSelectProducts = (products: SelectedProduct[]) => {
    const newDetalle: DataType[] = [];

    products.forEach((product) => {
      const { key, cantidad } = product;
      const key_split = key.toString().split("_");

      const dispensacion = dispensaciones.find(
        (dis) => dis.id.toString() === key_split[0]
      );

      if (dispensacion) {
        const item = dispensacion.detalle.find(
          (item) => item.id.toString() === key_split[1]
        );

        if (item) {
          const subtotal = parseFloat(item.precio_venta) * cantidad;
          const iva =
            subtotal *
            (parseFloat(item.productos_lotes.productos.ivas.iva) / 100);
          const total = subtotal + iva;
          const newItem: DataType = {
            key: key,
            dispensacion_id: dispensacion.id,
            fuente: dispensacion.fuente ? dispensacion.fuente.prefijo : "",
            numero_servinte: dispensacion.numero_servinte,
            consec_dis: dispensacion.consecutivo,
            producto_id: item.productos_lotes.producto_id,
            cod_barras: item.productos_lotes.productos.cod_barra,
            desc_producto: item.productos_lotes.productos.descripcion,
            codigo_servinte: item.productos_lotes.productos.cod_huv,
            cantidad: parseInt(item.cantidad_entregada),
            cantidad_dev: parseInt(item.cantidad_dev),
            cantidad_devolver: cantidad,
            lote: item.productos_lotes.lote,
            f_vence: item.productos_lotes.fecha_vencimiento,
            precio_venta: parseFloat(item.precio_venta),
            precio_subtotal: subtotal,
            precio_iva: iva,
            precio_total: total,
          };
          newDetalle.push(newItem);
        }
      }
    });
    setDetalle(detalle.concat(newDetalle));
    control.setValue("detalle", detalle.concat(newDetalle));
  };

  const handlDeleteProducto = (key: React.Key) => {
    const newDetalle = detalle.filter((item) => item.key != key);
    setDetalle(newDetalle);
    control.setValue("detalle", newDetalle);
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
      title: "Código Servinte",
      dataIndex: "codigo_servinte",
      key: "codigo_servinte",
      align: "center",
      width: 80,
      fixed: "left",
    },
    {
      title: "REMISION",
      dataIndex: "consec_dis",
      key: "consec_dis",
      align: "center",
      width: 100,
      fixed: "left",
    },
    {
      title: "Fuente",
      dataIndex: "fuente",
      key: "fuente",
      align: "center",
      hidden: !hasFuente,
      width: 60,
      fixed: "left",
    },
    {
      title: "Nro. Serviente",
      dataIndex: "numero_servinte",
      key: "numero_servinte",
      align: "center",
      hidden: !hasFuente,
      width: 120,
      fixed: "left",
    },
    {
      title: "Descripción",
      dataIndex: "desc_producto",
      key: "desc_producto",
      width: 250,
    },
    {
      title: ["show"].includes(accion)
        ? "Cantidad Devuelta"
        : "Cantidad Entregada",
      dataIndex: "cantidad",
      key: "cantidad",
      align: "center",
      width: 80,
    },
    {
      title: "Cantidad Devuelta",
      dataIndex: "cantidad_dev",
      key: "cantidad_dev",
      hidden: ["show"].includes(accion),
      align: "center",
      width: 80,
    },
    {
      title: "Lote",
      dataIndex: "lote",
      key: "lote",
      align: "center",
      width: 90,
    },
    {
      title: "F. V.",
      dataIndex: "f_vence",
      key: "f_vence",
      align: "center",
      width: 90,
    },
  ];

  if (["compras", "administrador"].includes(user_rol)) {
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

  if (["create"].includes(accion)) {
    columns.splice(5, 0, {
      title: "Cant. a Devolver",
      dataIndex: "cantidad_devolver",
      key: "cantidad_devolver",
      align: "center",
      width: 80,
    });

    columns.push({
      title: "Acciones",
      key: "acciones",
      dataIndex: "acciones",
      align: "center",
      width: 70,
      fixed: "right",
      colSpan: 2,
      render(_, record) {
        return (
          <>
            <Button
              type="primary"
              size="small"
              danger
              onClick={() => {
                handlDeleteProducto(record.key);
              }}
            >
              <DeleteOutlined />
            </Button>
          </>
        );
      },
    });
  }

  const generarPDF = async (key: string) => {
    setLoader(true);
    notificationApi.open({
      type: "warning",
      message: "Generando pdf...",
      icon: <Spin spinning />,
    });
    await getPDF(key)
      .then((data) => {
        const file = new Blob([data.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        notificationApi.open({
          type: "success",
          message: "Documento generado con exito!",
        });
        window.open(fileURL);
        setTimeout(() => {
          navigate(`/${urlSplit[1]}/${urlSplit[2]}/${urlSplit[3]}/show/${key}`);
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
        }
      )
      .finally(() => setLoader(false));
  };

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
          if (hasFuente) {
            generarPDF(data.id);
          } else {
            setTimeout(() => {
              navigate(
                `/${urlSplit[1]}/${urlSplit[2]}/${urlSplit[3]}/show/${data.id}`
              );
            }, 800);
          }
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
    }
  };

  const anularDocumento = () => {
    const data = {
      dvd_id: id,
      accion: accion,
    };
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
      <ModalProductos
        open={open}
        setOpen={(value: boolean) => setOpen(value)}
        dispensaciones={dispensaciones}
        handleSelectProducts={(products: SelectedProduct[]) =>
          handleSelectProducts(products)
        }
        detalle={detalle.map((item) => item.key)}
        hasFuente={hasFuente}
      />
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
                  <Col xs={24} md={6} order={3}>
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
                  </Col>
                  <Col xs={24} md={18} order={4}>
                    <StyledFormItem label={"Nombre:"} name={"nombre_paciente"}>
                      <Input disabled placeholder="Nombre Usuario" />
                    </StyledFormItem>
                  </Col>
                  {hasFuente ? (
                    <>
                      <Col xs={24} sm={12} md={8} lg={6} order={5}>
                        <Controller
                          name="id_fuente"
                          control={control.control}
                          rules={{
                            required: {
                              value: true,
                              message: "Fuente es requerido",
                            },
                          }}
                          render={({ field, fieldState: { error } }) => (
                            <StyledFormItem required label={"Fuente:"}>
                              <Select
                                {...field}
                                options={
                                  !documentoInfo
                                    ? user?.fuentes_info
                                        .filter(
                                          (item) =>
                                            item.fuente.tipo_fuente ==
                                            "devolucion"
                                        )
                                        .map((item) => ({
                                          value: item.fuente_id,
                                          label: `${item.fuente.prefijo}`,
                                        }))
                                    : documentoInfo.fuente
                                    ? [
                                        {
                                          value: documentoInfo.id_fuente,
                                          label: `${documentoInfo.fuente.prefijo}`,
                                        },
                                      ]
                                    : []
                                }
                                popupMatchSelectWidth={false}
                                status={error && "error"}
                                disabled={
                                  id
                                    ? ["show", "anular"].includes(accion)
                                      ? true
                                      : false
                                    : false
                                }
                              />
                              <Text type="danger">{error?.message}</Text>
                            </StyledFormItem>
                          )}
                        />
                      </Col>
                      <Col xs={24} sm={24} md={8} lg={6} order={6}>
                        <Controller
                          name="numero_servinte"
                          control={control.control}
                          rules={{
                            required: {
                              value: true,
                              message: "Número de Servinte es requerido",
                            },
                          }}
                          render={({ field, fieldState: { error } }) => (
                            <StyledFormItem
                              required
                              label={"Número de Servinte:"}
                            >
                              <Input
                                {...field}
                                placeholder="Numero Servinte"
                                value={field.value}
                                onChange={(e) => {
                                  const onlyNums = e.target.value.replace(
                                    /[^0-9]/g,
                                    ""
                                  );
                                  field.onChange(onlyNums);
                                }}
                                status={error ? "error" : ""}
                                disabled={
                                  id
                                    ? ["show", "anular"].includes(accion)
                                      ? true
                                      : false
                                    : false
                                }
                              />
                              <Text type="danger">{error?.message}</Text>
                            </StyledFormItem>
                          )}
                        />
                      </Col>
                    </>
                  ) : null}

                  <Col span={24} order={hasFuente ? 7 : 5}>
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
                  {["create"].includes(accion) ? (
                    <Col
                      md={{ offset: 12, span: 12 }}
                      xs={{ span: 24 }}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <Button
                        type="primary"
                        htmlType="button"
                        block
                        icon={<PlusOutlined />}
                        onClick={handleSearchDIS}
                        disabled={!paciente ? true : false}
                      >
                        Agregar producto
                      </Button>
                    </Col>
                  ) : null}

                  <Col span={24}>
                    <Table
                      rowKey={(record) => record.key}
                      size="small"
                      scroll={{ y: 700, x: 1500 }}
                      pagination={{
                        simple: false,
                        pageSize: 10,
                      }}
                      dataSource={detalle}
                      columns={columns}
                      sticky
                      summary={() => (
                        <>
                          {detalle.length > 0 ? (
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
                                {["create"].includes(accion) ? (
                                  <Table.Summary.Cell
                                    {...summaryProps.fourthCell}
                                  ></Table.Summary.Cell>
                                ) : null}
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
                                {["create"].includes(accion) ? (
                                  <Table.Summary.Cell
                                    {...summaryProps.fourthCell}
                                  ></Table.Summary.Cell>
                                ) : null}
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
                                {["create"].includes(accion) ? (
                                  <Table.Summary.Cell
                                    {...summaryProps.fourthCell}
                                  ></Table.Summary.Cell>
                                ) : null}
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
                          disabled={detalle.length == 0 ? true : false}
                          icon={<FilePdfFilled />}
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
