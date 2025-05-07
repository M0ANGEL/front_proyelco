/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { getTipoDocumentoByPrefijo } from "@/services/maestras/tiposDocumentosAPI";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { CamposEstados, DataType, Props, SummaryProps } from "./types";
import { validarAccesoDocumento } from "@/services/documentos/rqpAPI";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import useSerialize from "@/modules/common/hooks/useUpperCase";
import React, { useEffect, useMemo, useState } from "react";
import { getBodega } from "@/services/maestras/bodegasAPI";
import {
  StyledFormItem,
  StyledCard,
} from "@/modules/common/layout/DashboardLayout/styled";
import { KEY_BODEGA, KEY_EMPRESA } from "@/config/api";
import { ColumnsType } from "antd/es/table";
import {
  cambiarEstadoNCE,
  getInfoFactura,
  searchTercero,
  getInfoNCE,
  updateNCE,
  crearNCE,
} from "@/services/documentos/nceAPI";
import {
  ArrowLeftOutlined,
  LoadingOutlined,
  SearchOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  NotaCreditoFVEDisCabecera,
  FacturaFVECabecera,
  FacturaFVEDetalle,
  TipoDocumento,
  Tercero,
  Bodega,
} from "@/services/types";
import {
  notification,
  InputNumber,
  DatePicker,
  Typography,
  Button,
  Input,
  Radio,
  Space,
  Table,
  Form,
  Spin,
  Col,
  Row,
  Tag,
} from "antd";

let timeout: ReturnType<typeof setTimeout> | null;
const estadosVisibles = ["0", "2"];
const { Title, Text } = Typography;
const { TextArea } = Input;

export const FormNCG = ({ info_factura, setNotaCreditoID }: Props) => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [detalleSelected, setDetalleSelected] = useState<DataType[]>([]);
  const [camposEstados, setCamposEstados] = useState<CamposEstados[]>();
  const [showLiberarDis, setShowLiberarDis] = useState<boolean>(false);
  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumento>();
  const [flagAcciones, setFlagAcciones] = useState<boolean>(false);
  const [loaderUser, setLoaderUser] = useState<boolean>(false);
  const [factura, setFactura] = useState<FacturaFVECabecera>();
  const [bodegaInfo, setBodegaInfo] = useState<Bodega>();
  const [convenios, setConvenios] = useState<string[]>([]);
  const [detalle, setDetalle] = useState<DataType[]>([]);
  const [loader, setLoader] = useState<boolean>(true);
  const { getSessionVariable } = useSessionStorage();
  const [tercero, setTercero] = useState<Tercero>();
  const [accion, setAccion] = useState<string>("");
  const { transformToUpperCase } = useSerialize();
  const [texto, setTexto] = useState<string>("");
  const [url, setUrl] = useState<string[]>([]);
  const { id } = useParams<{ id: string }>();
  const [documentoInfo, setDocumentoInfo] =
    useState<NotaCreditoFVEDisCabecera>();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const control = useForm({
    mode: "onChange",
    defaultValues: {
      retorno_inventario: "No",
      libera_dis: "",
      tipo_documento_id: 0,
      detalle: detalle,
      observacion: "",
      fve_dis_id: "",
      tercero_id: "",
      bodega_id: 0,
      factura: "",
      subtotal: 0,
      iva: 0,
      total: 0,
      dispensacion: "",
    },
  });

  const watchRetornoInventario = control.watch("retorno_inventario");
  const watchTercero = control.watch("tercero_id");

  useEffect(() => {
    if (watchTercero == "") {
      setTercero(undefined);
      form.setFieldValue("nombre_tercero", "");
    }
  }, [watchTercero]);

  useEffect(() => {
    if (watchRetornoInventario == "No") {
      setShowLiberarDis(true);
      control.setValue("libera_dis", "");
    } else {
      setShowLiberarDis(false);
      control.setValue("libera_dis", "No");
    }
  }, [watchRetornoInventario]);

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
    if (!info_factura) {
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
    }
    if (id) {
      // Se valida que en la acciones EDIT, SHOW y ANULAR se capture el ID de la Orden de Compra ya creada para consultar su cabecera y detalle
      // e imprimirla en el formulario
      getInfoNCE(id).then(({ data: { data } }) => {
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
          const iva =
            ((parseFloat(item.precio_venta_total) -
              parseFloat(item.precio_venta)) /
              parseFloat(item.precio_venta)) *
            100;

          let cantidad_devuelta = 0;

          if (item.fve_detalle.nce_dis_detalle) {
            item.fve_detalle.nce_dis_detalle.forEach((nce_item) => {
              cantidad_devuelta += parseInt(nce_item.cantidad);
            });
          }

          return {
            key: `${item.codigo_producto}_${item.lote}_${item.fecha_vencimiento}_${item.fve_dis_detalle_id}`,
            codigo_producto: item.codigo_producto,
            descripcion: item.producto.descripcion,
            lote: item.lote,
            fecha_vencimiento: item.fecha_vencimiento,
            cantidad_entregada: parseInt(item.fve_detalle.cantidad_entregada),
            cantidad_devuelta,
            cantidad_devolver: parseInt(item.cantidad),
            iva,
            precio: parseFloat(item.precio_venta),
            precio_subtotal: parseFloat(item.precio_subtotal),
            precio_iva: parseFloat(item.precio_iva),
            precio_total: parseFloat(item.precio_venta_total),
            itemFromModal: false,
            id_detalle: item.fve_dis_detalle_id,
            editable_cant: false,
            editable_valor: false,
          };
        });
        setBodegaInfo(data.bodega);
        setTercero(data.convenio.tercero);
        setFactura(data.fve_cabecera);
        control.setValue("bodega_id", data.bodega.id);
        form.setFieldValue("fecha", dayjs(data.created_at));
        control.setValue("tercero_id", data.convenio.tercero.nit);
        form.setFieldValue("nombre_tercero", data.convenio.tercero.razon_soc);
        control.setValue("fve_dis_id", data.fve_dis_id);
        control.setValue("factura", data.fve_cabecera.numero_factura_vta);
        control.setValue(
          "dispensacion",
          data.fve_cabecera.dispensacion.consecutivo
        );
        control.setValue("retorno_inventario", data.retorno_inventario);
        control.setValue("libera_dis", data.libera_dis);
        control.setValue("observacion", data.observacion);
        control.setValue("subtotal", parseFloat(data.subtotal));
        control.setValue(
          "iva",
          parseFloat(data.total) - parseFloat(data.subtotal)
        );
        control.setValue("total", parseFloat(data.total));
        control.setValue("detalle", detalle);
        setDetalle(detalle);
        setDetalleSelected(detalle.filter((row) => row.nota_id == null));
        setLoader(false);
      });
    } else {
      getBodega(getSessionVariable(KEY_BODEGA))
        .then(({ data: { data } }) => {
          setBodegaInfo(data);
          control.setValue("bodega_id", data.id);
          form.setFieldValue("fecha", dayjs(new Date()));
        })
        .finally(() => setLoader(false));
    }
  }, [info_factura]);

  useEffect(() => {
    if (info_factura) {
      setLoader(true);
      control.setValue("tercero_id", info_factura.cliente);
      control.setValue("factura", info_factura.numero_factura);

      const fetchData = async () => {
        await getFactura(
          info_factura.numero_factura,
          `[${info_factura.convenio_id}]`
        );
        await handleSearchTercero({ target: { value: info_factura.cliente } });
        await getTipoDocumentoByPrefijo("ncg").then(({ data: { data } }) => {
          control.setValue("tipo_documento_id", data.id);
        });
      };

      fetchData()
        .catch((error) => {
          console.error(error);
        })
        .finally(() => setLoader(false));
    }
  }, [info_factura]);

  useMemo(() => {
    let subtotal = 0;
    let iva = 0;
    let total = 0;
    detalleSelected.forEach((item) => {
      subtotal += item.precio_subtotal;
      iva += item.precio_iva;
      total += item.precio_total;
    });

    control.setValue("subtotal", subtotal);
    control.setValue("iva", iva);
    control.setValue("total", total);
  }, [detalleSelected]);

  const summaryProps: SummaryProps = {
    firstCell: { index: 3, colSpan: 2, align: "right" },
    secondCell: {
      index: 4,
      colSpan: id && ["show", "anular", "edit"].includes(accion) ? 9 : 10,
      align: "right",
    },
    thirdCell: {
      index: id && ["show", "anular", "edit"].includes(accion) ? 10 : 11,
      align: "center",
    },
  };

  const clearValues = () => {
    control.setValue("fve_dis_id", "");
    form.setFieldValue("nombre_tercero", null);
    setConvenios([]);
    setFactura(undefined);
  };

  const getFactura = async (
    factura: string,
    conveniosString: string = JSON.stringify(convenios)
  ) => {
    setLoaderUser(true);
    getInfoFactura(factura, conveniosString)
      .then(({ data: { data } }) => {
        setFactura(data);
        handleSelectProducts(data.detalle);
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
  };

  const handleSelectProducts = (products: FacturaFVEDetalle[]) => {
    const newDetalle: DataType[] = [];

    products.forEach((itemDetalle) => {
      let cantidad_total_devuelta = 0;
      itemDetalle.nce_dis_detalle?.forEach((item) => {
        cantidad_total_devuelta += parseInt(item.cantidad);
      });

      const iva = Math.round(
        ((parseFloat(itemDetalle.precio_venta_total) -
          parseFloat(itemDetalle.precio_subtotal)) /
          parseFloat(itemDetalle.precio_subtotal)) *
          100
      );
      const precio_subtotal =
        parseFloat(itemDetalle.precio_venta) *
        parseInt(itemDetalle.cantidad_entregada);
      const precio_iva = precio_subtotal * (iva / 100);
      const precio_total = precio_subtotal + precio_iva;
      const newItem: DataType = {
        key: `${itemDetalle.codigo_producto}_${itemDetalle.lote}_${itemDetalle.fecha_vencimiento}_${itemDetalle.id}`,
        codigo_producto: itemDetalle.codigo_producto,
        descripcion: itemDetalle.descripcion,
        lote: itemDetalle.lote,
        fecha_vencimiento: itemDetalle.fecha_vencimiento,
        cantidad_entregada: parseInt(itemDetalle.cantidad_entregada),
        cantidad_devuelta: cantidad_total_devuelta,
        cantidad_devolver: parseInt(itemDetalle.cantidad_entregada),
        iva,
        precio: parseFloat(itemDetalle.precio_venta),
        precio_subtotal,
        precio_iva,
        precio_total,
        itemFromModal: true,
        id_detalle: itemDetalle.id,
        editable_cant: false,
        editable_valor: false,
        nota_id: itemDetalle.nota_id,
      };
      newDetalle.push(newItem);
    });
    setDetalle(newDetalle);
    control.setValue("detalle", newDetalle);
  };

  const handleSearchTercero = async (event: any) => {
    const query = event.target.value.toString();
    setLoaderUser(true);
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (query.length > 0) {
      timeout = setTimeout(() => {
        searchTercero(query)
          .then(({ data: { data } }) => {
            setTercero(data);
            setConvenios(data.convenios.map((item) => item.id.toString()));
            form.setFieldValue("nombre_tercero", data.razon_soc);
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
      setLoaderUser(false);
    }
  };

  const handleChangeEdit = (key: React.Key, type: string) => {
    const newData = [...detalle];
    const target = newData.find((item) => item.key === key);
    if (target) {
      switch (type) {
        case "cantidad":
          target.editable_cant = target.editable_cant ? false : true;
          break;
        case "precio":
          target.editable_valor = target.editable_valor ? false : true;
          break;
      }
      setDetalle(newData);
    }
  };

  const handleChangeAmount = (
    value: number,
    key: React.Key,
    column: string
  ) => {
    const newDataFilter = detalle.map((item) => {
      let precio = item.precio;
      let cantidad = item.cantidad_devolver;

      switch (column) {
        case "cantidad":
          cantidad = value ? value : 0;
          break;
        case "precio":
          precio = value ? value : 0;
          break;

        default:
          break;
      }

      const precio_subtotal = cantidad * precio;
      const precio_iva = precio_subtotal * (item.iva / 100);
      const precio_total = precio_subtotal + precio_iva;
      if (item.key === key) {
        setDetalleSelected(
          detalleSelected.map((itemSelected) => {
            if (itemSelected.key == key) {
              return {
                ...itemSelected,
                cantidad_devolver: cantidad,
                precio,
                precio_subtotal,
                precio_iva,
                precio_total,
              };
            } else {
              return itemSelected;
            }
          })
        );
        return {
          ...item,
          cantidad_devolver: cantidad,
          precio,
          precio_subtotal,
          precio_iva,
          precio_total,
        };
      } else {
        return item;
      }
    });
    setDetalle(newDataFilter);
    control.setValue("detalle", newDataFilter);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Código",
      dataIndex: "codigo_producto",
      key: "codigo_producto",
      width: 100,
      fixed: "left",
      align: "center",
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
      width: 400,
      fixed: "left",
    },
    {
      title: "Lote",
      dataIndex: "lote",
      key: "lote",
      align: "center",
      width: 100,
    },
    {
      title: "Fecha Vencimiento",
      dataIndex: "fecha_vencimiento",
      key: "fecha_vencimiento",
      align: "center",
      width: 100,
    },
    {
      title: "Cantidad Facturada",
      dataIndex: "cantidad_entregada",
      key: "cantidad_entregada",
      align: "center",
      width: 80,
    },
    {
      title: "Cantidad Total Devuelta",
      dataIndex: "cantidad_devuelta",
      key: "cantidad_devuelta",
      align: "center",
      width: 80,
    },
    {
      title: ["edit", "show", "anular"].includes(accion)
        ? "Cantidad Devuelta"
        : "Cantidad a Devolver",
      dataIndex: "cantidad_devolver",
      key: "cantidad_devolver",
      align: "center",
      width: 130,
      render(value, { key, editable_cant, cantidad_entregada }) {
        if (
          ["create", "edit"].includes(accion) ||
          (info_factura && detalleSelected.some((item) => item.key == key))
        ) {
          if (editable_cant) {
            return (
              <Space direction="vertical">
                <InputNumber
                  autoFocus
                  defaultValue={value}
                  size="small"
                  max={cantidad_entregada}
                  onBlur={() => handleChangeEdit(key, "cantidad")}
                  onChange={(e: any) => handleChangeAmount(e, key, "cantidad")}
                />
                <Text style={{ color: "red", fontSize: 9 }}>
                  Cantidad maxima: {cantidad_entregada}
                </Text>
              </Space>
            );
          } else {
            return (
              <Tag
                color="success"
                onClick={() => handleChangeEdit(key, "cantidad")}
                style={{ cursor: "pointer" }}
              >
                {value}
              </Tag>
            );
          }
        } else {
          return <Tag>{value}</Tag>;
        }
      },
    },
    {
      title: "IVA %",
      dataIndex: "iva",
      key: "iva",
      align: "center",
      width: 80,
    },
    {
      title: "Precio",
      dataIndex: "precio",
      key: "precio",
      align: "center",
      width: 130,
      render(_, { key, editable_valor, precio }) {
        if (
          ["create", "edit"].includes(accion) ||
          (info_factura && detalleSelected.some((item) => item.key == key))
        ) {
          return (
            <Space direction="vertical">
              {editable_valor &&
              (["create", "edit"].includes(accion) || info_factura) ? (
                <InputNumber
                  autoFocus
                  defaultValue={precio == 0 ? "" : precio}
                  size="small"
                  min={0}
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  controls={false}
                  keyboard={false}
                  onBlur={() => handleChangeEdit(key, "precio")}
                  onChange={(e: any) => handleChangeAmount(e, key, "precio")}
                />
              ) : (
                <Tag
                  color="success"
                  onClick={() => handleChangeEdit(key, "precio")}
                  style={{ cursor: "pointer" }}
                >
                  $ {precio.toLocaleString("es-CO")}
                </Tag>
              )}
            </Space>
          );
        } else {
          return <Tag>$ {precio.toLocaleString("es-CO")}</Tag>;
        }
      },
    },
    {
      title: "SubTotal",
      dataIndex: "precio_subtotal",
      key: "precio_subtotal",
      align: "center",
      width: 130,
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
      width: 130,
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
      width: 130,
      render: (_, { precio_total }) => {
        return (
          <>$ {parseFloat(precio_total.toString()).toLocaleString("es-CO")}</>
        );
      },
    },
  ];

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
    data = transformToUpperCase(data, ["observacion"]);
    data.tercero_id = tercero?.id;
    data.detalle = detalleSelected;
    data.fve_dis_id = factura?.id;
    setLoader(true);
    if (!id) {
      crearNCE(data)
        .then(({ data: { data } }) => {
          notificationApi.open({
            type: "success",
            message: `Documento creado con exito!`,
          });
          if (info_factura) {
            if (setNotaCreditoID) {
              setNotaCreditoID(data.id);
            }
          } else {
            setTimeout(() => {
              navigate(`/${url[1]}/${url[2]}/${url[3]}`);
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
    } else {
      updateNCE(data, id)
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
    setLoader(true);
    const data = {
      nce_id: id,
      accion: accion,
    };
    cambiarEstadoNCE(data)
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

  const rowSelection = {
    preserveSelectedRowKeys: true,
    onChange: (
      _selectedRowKeys: React.Key[],
      selectedRows: DataType[],
      info: { type: string }
    ) => {
      switch (info.type) {
        case "all":
          if (selectedRowKeys.length == 0) {
            setDetalleSelected(detalle.filter((row) => row.nota_id == null));
            control.setValue(
              "detalle",
              detalle.filter((row) => row.nota_id == null)
            );
            setSelectedRowKeys(
              detalle.filter((row) => row.nota_id == null).map((row) => row.key)
            );
          } else {
            setDetalleSelected([]);
            control.setValue("detalle", []);
            setSelectedRowKeys([]);
          }
          break;
        case "single":
          setSelectedRowKeys(_selectedRowKeys);
          setDetalleSelected(selectedRows);
          control.setValue("detalle", selectedRows);
          break;
      }
    },
    selectedRowKeys,
    // getCheckboxProps: (record: DataType) => {
    //   return {
    //     disabled: record.nota_id != null ? true : false,
    //   };
    // },
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
            !info_factura ? (
              <Title level={4}>
                {tipoDocumento?.descripcion}{" "}
                {id && documentoInfo ? `- ${documentoInfo?.consecutivo}` : null}
              </Title>
            ) : null
          }
          style={{ marginTop: !info_factura ? 0 : 20 }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={control.handleSubmit(onFinish)}
            onKeyDown={(e: any) =>
              e.key === "Enter" ? e.preventDefault() : null
            }
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
                  <Col xs={24} sm={18} order={4}>
                    <StyledFormItem
                      label={"Nombre Cliente:"}
                      name={"nombre_tercero"}
                    >
                      <Input disabled placeholder="Nombre Cliente" />
                    </StyledFormItem>
                  </Col>
                  <Col xs={24} sm={8} order={5}>
                    <Controller
                      name="factura"
                      control={control.control}
                      rules={{
                        required: {
                          value: true,
                          message: "Factura Electrónica es requerido",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem label={"Factura Electrónica:"} required>
                          <Spin
                            spinning={loaderUser}
                            indicator={<LoadingOutlined spin />}
                            style={{
                              backgroundColor: "rgb(251 251 251 / 70%)",
                            }}
                          >
                            <Input
                              {...field}
                              placeholder="Factura Electrónica"
                              status={error && "error"}
                              onPressEnter={(event: any) => {
                                const factura = event.target.value.toString();
                                getFactura(factura);
                              }}
                              disabled={
                                !["create"].includes(accion) ||
                                (tercero && detalle.length > 0) ||
                                !tercero
                              }
                            />
                          </Spin>
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={24} sm={8} order={6}>
                    <Controller
                      name="retorno_inventario"
                      control={control.control}
                      rules={{
                        required: {
                          value: true,
                          message:
                            "Escoger si Retorna al Inventario es requerido",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem
                          required={
                            camposEstados
                              ?.filter((item) => item.id_campo == "3")
                              .at(0)?.estado === "2"
                          }
                          label={"¿Productos retornan al inventario?"}
                        >
                          <Radio.Group
                            {...field}
                            disabled={["show"].includes(accion)}
                          >
                            <Radio value={"Si"}>Si</Radio>
                            <Radio value={"No"}>No</Radio>
                          </Radio.Group>
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  {showLiberarDis ? (
                    <Col xs={24} sm={8} order={7}>
                      <Controller
                        name="libera_dis"
                        control={control.control}
                        rules={{
                          required: {
                            value: true,
                            message:
                              "Escoger si Libera Dispensacion es requerido",
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
                              "¿Liberar dispensación para generar nueva factura?"
                            }
                          >
                            <Radio.Group
                              {...field}
                              disabled={["show"].includes(accion)}
                            >
                              <Radio value={"Si"}>Si</Radio>
                              <Radio value={"No"}>No</Radio>
                            </Radio.Group>
                            <Text type="danger">{error?.message}</Text>
                          </StyledFormItem>
                        )}
                      />
                    </Col>
                  ) : null}
                  {["show"].includes(accion) ? (
                    <Col span={8} order={8}>
                      <Controller
                        name={"dispensacion"}
                        control={control.control}
                        render={({ field }) => (
                          <StyledFormItem label={"Dispensación:"}>
                            <Input {...field} disabled />
                          </StyledFormItem>
                        )}
                      />
                    </Col>
                  ) : null}
                  <Col span={24} order={9}>
                    {estadosVisibles.includes(
                      camposEstados
                        ?.filter((item) => item.id_campo == "3")
                        .at(0)?.estado ?? ""
                    ) || info_factura ? (
                      <Controller
                        name="observacion"
                        control={control.control}
                        rules={{
                          required: {
                            value:
                              camposEstados
                                ?.filter((item) => item.id_campo == "3")
                                .at(0)?.estado === "2"
                                ? true
                                : info_factura
                                ? true
                                : false,
                            message: "Observación es requerido",
                          },
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <StyledFormItem
                            required={
                              camposEstados
                                ?.filter((item) => item.id_campo == "3")
                                .at(0)?.estado === "2"
                                ? true
                                : info_factura
                                ? true
                                : false
                            }
                            label={
                              camposEstados
                                ?.filter((item) => item.id_campo == "3")
                                .at(0)?.nombre_campo ?? "Observación"
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
                      rowSelection={
                        ["create"].includes(accion) || info_factura
                          ? {
                              type: "checkbox",
                              ...rowSelection,
                            }
                          : undefined
                      }
                      size="small"
                      scroll={{ y: 700, x: 1200 }}
                      pagination={{
                        simple: false,
                        pageSize: 20,
                        hideOnSinglePage: true,
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
                  {!info_factura ? (
                    <Link to={id ? "../.." : ".."} relative="path">
                      <Button
                        type="primary"
                        icon={<ArrowLeftOutlined />}
                        danger
                      >
                        Volver
                      </Button>
                    </Link>
                  ) : null}

                  {!flagAcciones ? (
                    <>
                      {accion == "create" ||
                      accion == "edit" ||
                      info_factura ? (
                        <Button
                          htmlType="submit"
                          type="primary"
                          disabled={detalleSelected.length == 0 ? true : false}
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
