/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useMemo, useState } from "react";
import { validarAccesoDocumento } from "@/services/documentos/rqpAPI";
import { KEY_BODEGA, KEY_EMPRESA } from "@/config/api";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { CamposEstados, DataType, SummaryProps } from "./types";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Popconfirm,
  Row,
  Select,
  SelectProps,
  Space,
  Spin,
  Table,
  Typography,
  notification,
} from "antd";
import {
  Bodega,
  DevolucionVentaDirectaCabecera,
  RemisionVentaDirectaCabecera,
  Tercero,
  TipoDocumento,
} from "@/services/types";
import {
  LoadingOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import {
  StyledCard,
  StyledFormItem,
} from "@/modules/common/layout/DashboardLayout/styled";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { getBodega } from "@/services/maestras/bodegasAPI";
import { ModalProductos } from "../../componentes";
import { SelectedProduct } from "../../componentes/ModalProductos/types";
import {
  cambiarEstadoDRV,
  crearDRV,
  deleteItem,
  getInfoDRV,
  searchTercero,
  updateDRV,
} from "@/services/documentos/drvAPI";

const { Title, Text } = Typography;
let timeout: ReturnType<typeof setTimeout> | null;
const { TextArea } = Input;
const estadosVisibles = ["0", "2"];

export const FormDRV = () => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [camposEstados, setCamposEstados] = useState<CamposEstados[]>();
  const [documentoInfo, setDocumentoInfo] =
    useState<DevolucionVentaDirectaCabecera>();
  const [selectRemision, setSelectRemision] = useState<SelectProps["options"]>(
    []
  );
  const [remision, setRemision] = useState<RemisionVentaDirectaCabecera>();
  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumento>();
  const { getSessionVariable } = useSessionStorage();
  const [flagAcciones, setFlagAcciones] = useState<boolean>(false);
  const [detalle, setDetalle] = useState<DataType[]>([]);
  const [bodegaInfo, setBodegaInfo] = useState<Bodega>();
  const [tercero, setTercero] = useState<Tercero>();
  const [loader, setLoader] = useState<boolean>(true);
  const [loaderUser, setLoaderUser] = useState<boolean>(false);
  const [deletingRow, setDeletingRow] = useState<React.Key[]>([]);
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [accion, setAccion] = useState<string>("");
  const [texto, setTexto] = useState<string>("");
  const [url, setUrl] = useState<string[]>([]);
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
      tercero_id: "",
      rvd_id: "",
      observacion: "",
      subtotal: 0,
      iva: 0,
      total: 0,
    },
  });
  const watchTercero = control.watch("tercero_id");

  const summaryProps: SummaryProps = {
    firstCell: { index: 0, colSpan: 2, align: "right" },
    secondCell: {
      index: 2,
      colSpan: id && ["show", "anular"].includes(accion) ? 7 : 8,
      align: "right",
    },
    thirdCell: {
      index: id && ["show", "anular"].includes(accion) ? 9 : 10,
      align: "center",
    },
    fourthCell: { index: id && ["show", "anular"].includes(accion) ? 10 : 11 },
  };

  useEffect(() => {
    const url_split = location.pathname.split("/");
    setUrl(url_split);

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
          setTipoDocumento(data.documento_info);
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
      getInfoDRV(id).then(({ data: { data } }) => {
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
            key: `${item.det_rvd_id}_${item.producto_lote_id}`,
            producto_id: item.lote.producto_id,
            desc_producto: item.lote.productos.descripcion,
            cantidad: parseInt(item.rvd_detalle.cantidad),
            cantidad_dev: parseInt(item.rvd_detalle.cantidad_dev),
            cantidad_devolver: parseInt(item.cantidad),
            lote: item.lote.lote,
            iva: parseFloat(item.iva),
            f_vence: item.lote.fecha_vencimiento,
            precio_venta: parseFloat(item.precio_venta),
            precio_unitario: parseFloat(item.precio_unitario),
            precio_subtotal: parseFloat(item.precio_subtotal),
            precio_iva: parseFloat(item.precio_iva),
            precio_total: parseFloat(item.precio_total),
            itemFromModal: false,
          };
        });
        setBodegaInfo(data.bodega);
        setTercero(data.tercero);
        setRemision(data.rvd_cabecera);
        control.setValue("bodega_id", data.bodega.id);
        form.setFieldValue("fecha", dayjs(data.created_at));
        control.setValue("tercero_id", data.tercero.nit);
        form.setFieldValue("nombre_tercero", data.tercero.razon_soc);
        control.setValue("rvd_id", data.rvd_cabecera.id.toString());
        setSelectRemision([
          {
            label: data.rvd_cabecera.consecutivo,
            value: data.rvd_cabecera.id.toString(),
          },
        ]);
        control.setValue("observacion", data.observacion);
        control.setValue("subtotal", parseFloat(data.subtotal));
        control.setValue(
          "iva",
          parseFloat(data.total) - parseFloat(data.subtotal)
        );
        control.setValue("total", parseFloat(data.total));
        control.setValue("detalle", detalle);
        setDetalle(detalle);
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
  }, []);

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
    control.setValue("detalle", detalle);
  }, [detalle]);

  useEffect(() => {
    if (watchTercero == "") {
      setTercero(undefined);
      form.setFieldValue("nombre_tercero", "");
      clearValues();
    }
  }, [watchTercero]);

  const handleSearchTercero = (event: any, fromDeleteItem = false) => {
    const query = event.target.value.toString();
    setLoaderUser(true);
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (query.length > 0) {
      timeout = setTimeout(() => {
        searchTercero(query, getSessionVariable(KEY_BODEGA))
          .then(({ data: { data } }) => {
            if (
              data &&
              data.remisiones_venta_directa &&
              data.remisiones_venta_directa.length > 0
            ) {
              setTercero(data);
              form.setFieldValue("nombre_tercero", data.razon_soc);
              const options: SelectProps["options"] = [];
              data.remisiones_venta_directa.forEach((remision) => {
                let cant_vendida = 0;
                let cant_devuelta = 0;
                remision.detalle.forEach((itemDetalle) => {
                  cant_vendida += parseInt(itemDetalle.cantidad);
                  cant_devuelta += parseInt(itemDetalle.cantidad_dev);
                });

                if (cant_devuelta < cant_vendida) {
                  options.push({
                    value: remision.id,
                    label: `${remision.consecutivo}`,
                  });
                }
              });
              setSelectRemision(options);
              if (fromDeleteItem) {
                setRemision(
                  data.remisiones_venta_directa.find(
                    (item) => item.id == parseInt(control.getValues("rvd_id"))
                  )
                );
              }
            } else {
              clearValues();
              if (!data) {
                notificationApi.open({
                  type: "error",
                  message:
                    "No se encuentra cliente con el NIT digitado o no tiene Remisiones de Venta Directa abiertas.",
                });
              }
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
      clearValues();
    }
  };

  const clearValues = () => {
    control.setValue("tercero_id", "");
    control.setValue("rvd_id", "");
    form.setFieldValue("nombre_paciente", null);
    setTercero(undefined);
    setSelectRemision([]);
    setRemision(undefined);
  };

  const handleSelectProducts = (products: SelectedProduct[]) => {
    const newDetalle: DataType[] = [];

    if (remision) {
      products.forEach(({ key, cantidad }) => {
        const keySplit = key.toString().split("_");
        const itemDetalle = remision.detalle.find(
          (item) => item.id.toString() === keySplit[0]
        );

        if (itemDetalle) {
          const subtotal = parseFloat(itemDetalle.precio_unitario) * cantidad;
          const iva = subtotal * (parseFloat(itemDetalle.iva) / 100);
          const total = subtotal + iva;
          const newItem: DataType = {
            key: key,
            producto_id: itemDetalle.lote.producto_id,
            desc_producto: itemDetalle.lote.productos.descripcion,
            cantidad: parseInt(itemDetalle.cantidad),
            cantidad_dev: parseInt(itemDetalle.cantidad_dev),
            cantidad_devolver: cantidad,
            lote: itemDetalle.lote.lote,
            iva: parseFloat(itemDetalle.iva),
            f_vence: itemDetalle.lote.fecha_vencimiento,
            precio_venta: parseFloat(itemDetalle.costo_unitario),
            precio_unitario: parseFloat(itemDetalle.precio_unitario),
            precio_subtotal: subtotal,
            precio_iva: iva,
            precio_total: total,
            itemFromModal: true,
          };
          newDetalle.push(newItem);
        }
      });
    }
    setDetalle(detalle.concat(newDetalle));
    control.setValue("detalle", detalle.concat(newDetalle));
  };

  const handleDeleteProducto = (key: React.Key, itemFromModal: boolean) => {
    if (["edit"].includes(accion) && detalle.length == 1) {
      notificationApi.open({
        type: "error",
        message: "El detalle no debe quedar vacío",
      });
      return;
    }
    if (["create"].includes(accion) || itemFromModal) {
      setDetalle(detalle.filter((item) => item.key != key));
    } else {
      setDeleteLoader(true);
      const splitKey = key.toString().split("_");
      deleteItem({
        drv_id: id,
        det_rvd_id: splitKey[0],
        lote_id: splitKey[1],
      })
        .then(() => {
          notificationApi.open({
            type: "success",
            message: `Item removido del detalle!`,
          });
          setDetalle(detalle.filter((item) => item.key != key));
          handleSearchTercero({ target: { value: tercero?.nit } }, true);
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
        .finally(() => {
          setDeleteLoader(false);
          setDeletingRow([]);
        });
    }
  };

  const handleOpenChange = (
    value: boolean,
    key: React.Key,
    itemFromModal: boolean
  ) => {
    if (!value) {
      setDeletingRow([]);
    }
    if (["create"].includes(accion) || itemFromModal) {
      handleDeleteProducto(key, itemFromModal);
    } else {
      setDeletingRow([...deletingRow, key]);
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
      width: 250,
      fixed: "left",
    },
    {
      title: "Cantidad Entregada",
      dataIndex: "cantidad",
      key: "cantidad",
      align: "center",
      width: 80,
    },
    {
      title: "Cantidad Devuelta",
      dataIndex: "cantidad_dev",
      key: "cantidad_dev",
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
    {
      title: "Precio Unitario",
      dataIndex: "precio_unitario",
      key: "precio_unitario",
      align: "center",
      width: 110,
      render: (_, { precio_unitario }) => {
        return (
          <>
            $ {parseFloat(precio_unitario.toString()).toLocaleString("es-CO")}
          </>
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
    },
  ];

  if (["create", "edit"].includes(accion)) {
    columns.splice(4, 0, {
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
      render(_, { key, cantidad_devolver, itemFromModal }) {
        return (
          <>
            <Popconfirm
              title="¿Desea eliminar este item?"
              open={deletingRow.includes(key)}
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              description={
                <Space direction="vertical" size={1}>
                  <Text>
                    {`Al eliminarlo se restará al inventario la cantidad de ${cantidad_devolver}`}
                  </Text>
                </Space>
              }
              okButtonProps={{
                loading: deleteLoader,
                danger: true,
              }}
              okText="Si"
              cancelText="No"
              onConfirm={() => handleDeleteProducto(key, itemFromModal)}
              onCancel={() => setDeletingRow([])}
              onOpenChange={(value: boolean) =>
                handleOpenChange(value, key, itemFromModal)
              }
              disabled={deletingRow.length > 0}
            >
              <Button type="primary" size="small" danger>
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </>
        );
      },
    });
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nuevoTexto = e.target.value;
    // Expresión regular que permite solo letras, números y espacios
    const regex = /^[a-zA-Z0-9\s]+$/;
    if (regex.test(nuevoTexto) || nuevoTexto == "") {
      setTexto(nuevoTexto);
      control.setValue("observacion", nuevoTexto);
    }
  };

  const onFinish: SubmitHandler<any> = async (data) => {
    setLoader(true);
    data.tercero_id = tercero?.id;
    if (!id) {
      crearDRV(data)
        .then(() => {
          notificationApi.open({
            type: "success",
            message: `Documento creado con exito!`,
          });
          setTimeout(() => {
            navigate(`/${url[1]}/${url[2]}/${url[3]}`);
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
    } else {
      updateDRV(data, id)
        .then(() => {
          notificationApi.open({
            type: "success",
            message: `Documento actualizado con exito!`,
          });
          setTimeout(() => {
            navigate(`/${url[1]}/${url[2]}/${url[3]}`);
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
    }
  };

  const anularDocumento = () => {
    const data = {
      drv_id: id,
      accion: accion,
    };
    cambiarEstadoDRV(data)
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
        remision={remision}
        handleSelectProducts={(products: SelectedProduct[]) =>
          handleSelectProducts(products)
        }
        detalle={detalle.map((item) => item.key)}
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
              {tipoDocumento?.descripcion}{" "}
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
                    sm={{ offset: 12, span: 4, order: 1 }}
                  >
                    <StyledFormItem label={"Bodega:"}>
                      <Input disabled value={bodegaInfo?.bod_nombre} />
                    </StyledFormItem>
                  </Col>
                  <Col xs={{ span: 24, order: 1 }} sm={{ span: 8, order: 2 }}>
                    <StyledFormItem label={"Fecha :"} name={"fecha"}>
                      <DatePicker
                        disabled
                        format={"YYYY-MM-DD HH:mm"}
                        style={{ width: "100%" }}
                        suffixIcon={null}
                      />
                    </StyledFormItem>
                  </Col>
                  <Col xs={24} sm={6} order={3}>
                    <Controller
                      name="tercero_id"
                      control={control.control}
                      rules={{
                        required: {
                          value: true,
                          message: "Cliente es requerido",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem label={"Cliente:"} required>
                          <Spin
                            spinning={loaderUser}
                            indicator={<LoadingOutlined spin />}
                            style={{
                              backgroundColor: "rgb(251 251 251 / 70%)",
                            }}
                          >
                            <Input
                              {...field}
                              placeholder="Nit Cliente"
                              allowClear
                              onPressEnter={(
                                event: React.KeyboardEvent<HTMLInputElement>
                              ) => handleSearchTercero(event)}
                              status={error && "error"}
                              prefix={<SearchOutlined />}
                              disabled={detalle.length > 0 ? true : false}
                            />
                          </Spin>
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={24} sm={12} order={4}>
                    <StyledFormItem
                      label={"Nombre Cliente:"}
                      name={"nombre_tercero"}
                    >
                      <Input disabled placeholder="Nombre Cliente" />
                    </StyledFormItem>
                  </Col>
                  <Col xs={24} sm={8} order={5}>
                    <Controller
                      name="rvd_id"
                      control={control.control}
                      rules={{
                        required: {
                          value: true,
                          message: "Remision es requerido",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem label={"Remisión:"} required>
                          <Select
                            {...field}
                            showSearch
                            options={selectRemision}
                            placeholder="Remisión"
                            status={error && "error"}
                            filterOption={(input, option) =>
                              (option?.label ?? "").toString().includes(input)
                            }
                            filterSort={(optionA, optionB) =>
                              (optionA?.label ?? "")
                                .toString()
                                .toLowerCase()
                                .localeCompare(
                                  (optionB?.label ?? "")
                                    .toString()
                                    .toLowerCase()
                                )
                            }
                            onSelect={(value: string) => {
                              setRemision(
                                tercero?.remisiones_venta_directa?.find(
                                  (item) => item.id == parseInt(value)
                                )
                              );
                            }}
                            disabled={
                              !tercero ||
                              !["create", "edit"].includes(accion) ||
                              detalle.length > 0
                            }
                          />
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
                              onChange={handleInputChange}
                              defaultValue={texto}
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
                  {["create", "edit"].includes(accion) ? (
                    <Col
                      sm={{ offset: 16, span: 8 }}
                      xs={{ span: 24 }}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <Button
                        type="primary"
                        htmlType="button"
                        block
                        icon={<PlusOutlined />}
                        onClick={() => setOpen(true)}
                        disabled={!remision ? true : false}
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
                                {["create", "edit"].includes(accion) ? (
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
                                {["create", "edit"].includes(accion) ? (
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
                                {["create", "edit"].includes(accion) ? (
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
                  <Link to={id ? "../.." : ".."} relative="path">
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
