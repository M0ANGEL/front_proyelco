/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
// import { SelectedProduct } from "../../componentes/ModalProductos/types";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { validarAccesoDocumento } from "@/services/documentos/rqpAPI";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import useSerialize from "@/modules/common/hooks/useUpperCase";
import { CamposEstados, DataType, SummaryProps } from "./types";
import React, { useEffect, useMemo, useState } from "react";
import { getBodega } from "@/services/maestras/bodegasAPI";
import {
  StyledFormItem,
  StyledCard,
} from "@/modules/common/layout/DashboardLayout/styled";
// import { ModalProductos } from "../../componentes";
import { KEY_BODEGA, KEY_EMPRESA } from "@/config/api";
import { ColumnsType } from "antd/es/table";
import {
  cambiarEstadoNCE,
  getInfoFactura,
  // deleteItem,
  searchTercero,
  getInfoNCE,
  updateNCE,
  crearNCE,
} from "@/services/documentos/nceAPI";
import {
  // QuestionCircleOutlined,
  ArrowLeftOutlined,
  // DeleteOutlined,
  LoadingOutlined,
  // PlusOutlined,
  SaveOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  NotaCreditoFVEDisCabecera,
  FacturaFVECabecera,
  FacturaFVEDetalle,
  TipoDocumento,
  Tercero,
  Bodega,
} from "@/services/types";
import dayjs from "dayjs";
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

const { Title, Text } = Typography;
const { TextArea } = Input;

let timeout: ReturnType<typeof setTimeout> | null;
const estadosVisibles = ["0", "2"];

export const FormNCE = () => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [detalleSelected, setDetalleSelected] = useState<DataType[]>([]);
  const [camposEstados, setCamposEstados] = useState<CamposEstados[]>();
  const [showLiberarDis, setShowLiberarDis] = useState<boolean>(false);
  // const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumento>();
  // const [deletingRow, setDeletingRow] = useState<React.Key[]>([]);
  const [flagAcciones, setFlagAcciones] = useState<boolean>(false);
  const [loaderUser, setLoaderUser] = useState<boolean>(false);
  const [factura, setFactura] = useState<FacturaFVECabecera>();
  const [bodegaInfo, setBodegaInfo] = useState<Bodega>();
  const [convenios, setConvenios] = useState<string[]>();
  const [detalle, setDetalle] = useState<DataType[]>([]);
  const [loader, setLoader] = useState<boolean>(true);
  // const [open, setOpen] = useState<boolean>(false);
  const { getSessionVariable } = useSessionStorage();
  const [tercero, setTercero] = useState<Tercero>();
  const { transformToUpperCase } = useSerialize();
  const [accion, setAccion] = useState<string>("");
  const [texto, setTexto] = useState<string>("");
  const [url, setUrl] = useState<string[]>([]);
  const { id } = useParams<{ id: string }>();
  const [documentoInfo, setDocumentoInfo] =
    useState<NotaCreditoFVEDisCabecera>();
  const [form] = Form.useForm();

  const navigate = useNavigate();
  const location = useLocation();

  const control = useForm({
    mode: "onChange",
    defaultValues: {
      detalle: detalle,
      tipo_documento_id: 0,
      bodega_id: 0,
      retorno_inventario: "No",
      libera_dis: "",
      fve_dis_id: "",
      factura: "",
      tercero_id: "",
      observacion: "",
      subtotal: 0,
      iva: 0,
      total: 0,
    },
  });

  const watchTercero = control.watch("tercero_id");
  const watchRetornoInventario = control.watch("retorno_inventario");

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
  }, []);

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
    // fourthCell: { index: id && ["show", "anular"].includes(accion) ? 11 : 12 },
  };

  const clearValues = () => {
    control.setValue("fve_dis_id", "");
    form.setFieldValue("nombre_tercero", null);
    setConvenios([]);
    setFactura(undefined);
  };

  const handleSelectProducts = (products: FacturaFVEDetalle[]) => {
    const newDetalle: DataType[] = [];

    // if (factura) {
    products.forEach((itemDetalle) => {
      // products.forEach(({ key, cantidad }) => {
      // const keySplit = key.toString().split("_");
      // const itemDetalle = factura.detalle.find(
      //   (item) =>
      //     item.codigo_producto === keySplit[0] &&
      //     item.lote === keySplit[1] &&
      //     item.fecha_vencimiento === keySplit[2]
      // );

      // if (itemDetalle) {
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
      // }
    });
    // }
    setDetalle(newDetalle);
    control.setValue("detalle", newDetalle);
  };

  const handleSearchTercero = (event: any /*, fromDeleteItem = false*/) => {
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
            // if (
            //   data &&
            //   data.facturas_fve_dis &&
            //   data.facturas_fve_dis.length > 0
            // ) {
            setTercero(data);
            setConvenios(data.convenios.map((item) => item.id.toString()));
            // setFacturas(data.facturas_fve_dis);
            form.setFieldValue("nombre_tercero", data.razon_soc);
            // const options: SelectProps["options"] = [];
            // data.facturas_fve_dis.forEach((factura) => {
            //   let notaCreditoFlag = false;
            //   factura.detalle.forEach((item) => {
            //     if (
            //       item.nce_dis_detalle &&
            //       item.nce_dis_detalle?.length > 0
            //     ) {
            //       notaCreditoFlag = true;
            //     }
            //   });
            //   if (!notaCreditoFlag) {
            //     options.push({
            //       value: factura.id,
            //       label: `${factura.numero_fve}`,
            //     });
            //   }
            // });
            // setSelectFacturas(options);
            // } else if (
            //   data.facturas_fve_dis &&
            //   data.facturas_fve_dis.length == 0
            // ) {
            //   clearValues();
            //   form.setFieldValue("nombre_tercero", data.razon_soc);
            //   notificationApi.open({
            //     type: "error",
            //     message: `No se encuentra Facturas creadas para el Cliente: ${data.razon_soc}.`,
            //   });
            // }
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

  // const handleDeleteProducto = (key: React.Key, itemFromModal: boolean) => {
  //   if (["edit"].includes(accion) && detalle.length == 1) {
  //     notificationApi.open({
  //       type: "error",
  //       message: "El detalle no debe quedar vacío",
  //     });
  //     return;
  //   }
  //   if (["create"].includes(accion) || itemFromModal) {
  //     setDetalle(detalle.filter((item) => item.key != key));
  //   } else {
  //     setDeleteLoader(true);
  //     deleteItem({
  //       nce_id: id,
  //       key,
  //     })
  //       .then(({ data: { data } }) => {
  //         notificationApi.open({
  //           type: "success",
  //           message: `Item removido del detalle!`,
  //         });
  //         setDetalle(detalle.filter((item) => item.key != key));
  //         setFactura(data.fve_cabecera);
  //         // handleSearchTercero({ target: { value: tercero?.nit } }, true);
  //       })
  //       .catch(
  //         ({
  //           response,
  //           response: {
  //             data: { errors },
  //           },
  //         }) => {
  //           if (errors) {
  //             const errores: string[] = Object.values(errors);
  //             for (const error of errores) {
  //               notificationApi.open({
  //                 type: "error",
  //                 message: error,
  //               });
  //             }
  //           } else {
  //             notificationApi.open({
  //               type: "error",
  //               message: response.data.message,
  //             });
  //           }
  //         }
  //       )
  //       .finally(() => {
  //         setDeleteLoader(false);
  //         setDeletingRow([]);
  //       });
  //   }
  // };

  // const handleOpenChange = (
  //   value: boolean,
  //   key: React.Key,
  //   itemFromModal: boolean
  // ) => {
  //   if (!value) {
  //     setDeletingRow([]);
  //   }
  //   if (["create"].includes(accion) || itemFromModal) {
  //     handleDeleteProducto(key, itemFromModal);
  //   } else {
  //     setDeletingRow([...deletingRow, key]);
  //   }
  // };

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
          ["create", "edit"].includes(accion) &&
          detalleSelected.some((item) => item.key == key)
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
      // render: (_, { precio }) => {
      //   return <>$ {parseFloat(precio.toString()).toLocaleString("es-CO")}</>;
      // },
      render(_, { key, editable_valor, precio }) {
        if (
          ["create", "edit"].includes(accion) &&
          detalleSelected.some((item) => item.key == key)
        ) {
          return (
            <Space direction="vertical">
              {editable_valor && ["create", "edit"].includes(accion) ? (
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
    setLoader(true);
    data = transformToUpperCase(data, ["observacion"]);
    data.tercero_id = tercero?.id;
    data.detalle = detalleSelected;
    data.fve_dis_id = factura?.id;
    if (!id) {
      crearNCE(data)
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
    getCheckboxProps: (record: DataType) => {
      return {
        disabled: record.nota_id != null ? true : false,
      };
    },
  };

  return (
    <>
      {contextHolder}
      {/* <ModalProductos
        open={open}
        setOpen={(value: boolean) => setOpen(value)}
        factura={factura}
        handleSelectProducts={(products: SelectedProduct[]) =>
          handleSelectProducts(products)
        }
        detalle={detalle.map((item) => item.key)}
      /> */}
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
                                setLoaderUser(true);
                                const factura = event.target.value.toString();
                                getInfoFactura(
                                  factura,
                                  JSON.stringify(convenios)
                                )
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
                                        const errores: string[] =
                                          Object.values(errors);
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
                            disabled={!["create"].includes(accion)}
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
                              disabled={!["create"].includes(accion)}
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
                  <Col span={24} order={8}>
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
                  {/* {["create", "edit"].includes(accion) ? ( */}
                  {/* <Col
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
                        disabled={!factura ? true : false}
                      >
                        Agregar producto
                      </Button>
                    </Col> */}
                  {/* ) : null} */}

                  <Col span={24}>
                    <Table
                      rowKey={(record) => record.key}
                      rowSelection={
                        ["create"].includes(accion)
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
