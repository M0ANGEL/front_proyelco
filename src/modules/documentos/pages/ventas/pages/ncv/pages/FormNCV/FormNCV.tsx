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
  InputNumber,
  Popconfirm,
  Radio,
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
  FacturaFVERvdCabecera,
  NotaCreditoFVERvdCabecera,
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
  cambiarEstadoNCV,
  crearNCV,
  deleteItem,
  getInfoNCV,
  searchTercero,
  updateNCV,
} from "@/services/documentos/ncvAPI";
import useSerialize from "@/modules/common/hooks/useUpperCase";
import { StyledText } from "./styled";

const { Title, Text } = Typography;
let timeout: ReturnType<typeof setTimeout> | null;
const { TextArea } = Input;
const estadosVisibles = ["0", "2"];

export const FormNCV = () => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [camposEstados, setCamposEstados] = useState<CamposEstados[]>();
  const [documentoInfo, setDocumentoInfo] =
    useState<NotaCreditoFVERvdCabecera>();
  const [selectFacturas, setSelectFacturas] = useState<SelectProps["options"]>(
    []
  );
  const [tercero, setTercero] = useState<Tercero>();
  const [factura, setFactura] = useState<FacturaFVERvdCabecera>();
  const [facturas, setFacturas] = useState<FacturaFVERvdCabecera[]>();
  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumento>();
  const { getSessionVariable } = useSessionStorage();
  const { transformToUpperCase } = useSerialize();
  const [flagAcciones, setFlagAcciones] = useState<boolean>(false);
  const [detalle, setDetalle] = useState<DataType[]>([]);
  const [bodegaInfo, setBodegaInfo] = useState<Bodega>();
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
      retorno_inventario: "No",
      fve_rvd_id: "",
      tercero_id: "",
      observacion: "",
      subtotal: 0,
      iva: 0,
      total: 0,
    },
  });
  const watchTercero = control.watch("tercero_id");
  useEffect(() => {
    if (watchTercero == "") {
      setTercero(undefined);
      form.setFieldValue("nombre_tercero", "");
    }
  }, [watchTercero]);

  const summaryProps: SummaryProps = {
    firstCell: { index: 0, colSpan: 2, align: "right" },
    secondCell: {
      index: 2,
      colSpan: id && ["show", "anular"].includes(accion) ? 9 : 9,
      align: "right",
    },
    thirdCell: {
      index: id && ["show", "anular"].includes(accion) ? 10 : 11,
      align: "center",
    },
    fourthCell: { index: id && ["show", "anular"].includes(accion) ? 11 : 12 },
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
      getInfoNCV(id).then(({ data: { data } }) => {
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

          return {
            key: `${item.codigo_producto}_${item.lote}_${item.fecha_vencimiento}`,
            codigo_producto: item.codigo_producto,
            descripcion: item.producto.descripcion,
            lote: item.lote,
            fecha_vencimiento: item.fecha_vencimiento,
            cantidad_entregada: parseInt(item.fve_detalle.cantidad_entregada),
            cantidad_devuelta: parseInt(item.fve_detalle.cantidad_entregada),
            cantidad_devolver: parseInt(item.cantidad),
            iva,
            precio: parseFloat(item.precio_venta),
            precio_subtotal: parseFloat(item.precio_subtotal),
            precio_iva: parseFloat(item.precio_iva),
            precio_total: parseFloat(item.precio_venta_total),
            itemFromModal: false,
            id_detalle: item.fve_rvd_detalle_id,
            editableValor: false,
          };
        });
        setBodegaInfo(data.bodega);
        setTercero(data.convenio.tercero);
        setFactura(data.fve_cabecera);
        control.setValue("bodega_id", data.bodega.id);
        form.setFieldValue("fecha", dayjs(data.created_at));
        control.setValue("tercero_id", data.convenio.tercero.nit);
        form.setFieldValue("nombre_tercero", data.convenio.tercero.razon_soc);
        control.setValue("fve_rvd_id", data.fve_rvd_id);
        control.setValue("retorno_inventario", data.retorno_inventario);
        setSelectFacturas([
          {
            label: data.fve_cabecera.numero_fve,
            value: data.fve_cabecera.id.toString(),
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
    detalle.forEach((item) => {
      subtotal += item.precio_subtotal;
      iva += item.precio_iva;
      total += item.precio_total;
    });
    control.setValue("subtotal", subtotal);
    control.setValue("iva", iva);
    control.setValue("total", total);
  }, [detalle]);

  const clearValues = () => {
    control.setValue("fve_rvd_id", "");
    form.setFieldValue("nombre_tercero", null);
    setFactura(undefined);
  };

  const handleSelectProducts = (products: SelectedProduct[]) => {
    const newDetalle: DataType[] = [];

    if (factura) {
      products.forEach(({ key, cantidad }) => {
        const keySplit = key.toString().split("_");
        const itemDetalle = factura.detalle.find(
          (item) =>
            item.codigo_producto === keySplit[0] &&
            item.lote === keySplit[1] &&
            item.fecha_vencimiento === keySplit[2]
        );

        if (itemDetalle) {
          let cantidad_total_devuelta = 0;
          itemDetalle.ncv_rvd_detalle?.forEach((item) => {
            cantidad_total_devuelta += parseInt(item.cantidad);
          });

          const iva = Math.round(
            ((parseFloat(itemDetalle.precio_venta_total) -
              parseFloat(itemDetalle.precio_subtotal)) /
              parseFloat(itemDetalle.precio_subtotal)) *
              100
          );
          const precio_subtotal =
            parseFloat(itemDetalle.precio_venta) * cantidad;
          const precio_iva = precio_subtotal * (iva / 100);
          const precio_total = precio_subtotal + precio_iva;
          const newItem: DataType = {
            key: key,
            codigo_producto: itemDetalle.codigo_producto,
            descripcion: itemDetalle.descripcion,
            lote: itemDetalle.lote,
            fecha_vencimiento: itemDetalle.fecha_vencimiento,
            cantidad_entregada: parseInt(itemDetalle.cantidad_entregada),
            cantidad_devuelta: cantidad_total_devuelta,
            cantidad_devolver: cantidad,
            iva,
            precio: parseFloat(itemDetalle.precio_venta),
            precio_subtotal,
            precio_iva,
            precio_total,
            itemFromModal: true,
            id_detalle: itemDetalle.id,
            editableValor: false,
          };
          newDetalle.push(newItem);
        }
      });
    }
    setDetalle(detalle.concat(newDetalle));
    control.setValue("detalle", detalle.concat(newDetalle));
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
            if (
              data &&
              data.facturas_fve_rvd &&
              data.facturas_fve_rvd.length > 0
            ) {
              setTercero(data);
              setFacturas(data.facturas_fve_rvd);
              form.setFieldValue("nombre_tercero", data.razon_soc);
              const options: SelectProps["options"] = [];
              data.facturas_fve_rvd.forEach((factura) => {
                const notaCreditoFlag = false;
                // factura.detalle.forEach((item)=>{
                //   if(item.ncv_rvd_detalle &&  item.ncv_rvd_detalle?.length > 0){
                //     notaCreditoFlag = true;
                //   }
                // })
                if (!notaCreditoFlag) {
                  options.push({
                    value: factura.id,
                    label: `${factura.numero_fve}`,
                  });
                }
              });
              setSelectFacturas(options);
            } else if (
              data.facturas_fve_rvd &&
              data.facturas_fve_rvd.length == 0
            ) {
              clearValues();
              form.setFieldValue("nombre_tercero", data.razon_soc);
              notificationApi.open({
                type: "error",
                message: `No se encuentra Facturas creadas para el Cliente: ${data.razon_soc}.`,
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
      clearValues();
      setLoaderUser(false);
    }
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
      deleteItem({
        ncv_id: id,
        key,
      })
        .then(() => {
          notificationApi.open({
            type: "success",
            message: `Item removido del detalle!`,
          });
          setDetalle(detalle.filter((item) => item.key != key));
          // handleSearchTercero({ target: { value: tercero?.nit } }, true);
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

  const handleChangeEdit = (key: React.Key, column: string) => {
    const newData = [...detalle];
    const target = newData.find((item) => item.key === key);
    if (target) {
      switch (column) {
        case "precio":
          target.editableValor = target.editableValor ? false : true;
          break;
      }
      setDetalle(newData);
      control.setValue("detalle", newData);
    }
  };

  const handleChangeAmount = (
    value: number,
    key: React.Key,
    column: string
  ) => {
    const newDataFilter = detalle.map((item) => {
      let precio = item.precio;
      const cantidad = item.cantidad_devolver;
      const iva = item.iva;

      switch (column) {
        case "precio":
          precio = value ? value : 0;
          break;

        default:
          break;
      }

      const precio_subtotal = cantidad * precio;
      const precio_iva = precio_subtotal * (iva / 100);
      const precio_total = precio_subtotal + precio_iva;
      if (item.key === key) {
        return {
          ...item,
          iva,
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
      title: "Cantidad Entregada",
      dataIndex: "cantidad_entregada",
      key: "cantidad_entregada",
      align: "center",
      width: 80,
    },
    {
      title: "Cantidad Devuelta",
      dataIndex: "cantidad_devuelta",
      key: "cantidad_devuelta",
      align: "center",
      width: 80,
    },
    {
      title: "Cantidad a Devolver",
      dataIndex: "cantidad_devolver",
      key: "cantidad_devolver",
      align: "center",
      width: 80,
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
      width: 110,
      // render: (_, { precio }) => {
      //   return <>$ {parseFloat(precio.toString()).toLocaleString("es-CO")}</>;
      // },
      render(_, { key, editableValor, precio }) {
        return (
          <Space direction="vertical">
            {editableValor && ["create", "edit"].includes(accion) ? (
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
              <StyledText
                onClick={() => handleChangeEdit(key, "precio")}
                type={precio == 0 ? "danger" : undefined}
                accion={accion}
              >
                $ {precio.toLocaleString("es-CO")}
              </StyledText>
            )}
          </Space>
        );
      },
    },
    {
      title: "SubTotal",
      dataIndex: "precio_subtotal",
      key: "precio_subtotal",
      align: "center",
      width: 110,
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
      width: 110,
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
      width: 110,
      render: (_, { precio_total }) => {
        return (
          <>$ {parseFloat(precio_total.toString()).toLocaleString("es-CO")}</>
        );
      },
    },
  ];

  if (["create", "edit"].includes(accion)) {
    // columns.splice(3, 0, {
    //   title: "Cant. a Devolver",
    //   dataIndex: "cantidad_devolver",
    //   key: "cantidad_devolver",
    //   align: "center",
    //   width: 80,
    // });

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
                    {`Al eliminarlo se devolverá al inventario la cantidad de ${cantidad_devolver}`}
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
    data = transformToUpperCase(data, ["observacion"]);
    data.tercero_id = tercero?.id;
    if (!id) {
      crearNCV(data)
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
      updateNCV(data, id)
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
      ncv_id: id,
      accion: accion,
    };
    cambiarEstadoNCV(data)
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
        factura={factura}
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
                              onBlur={(event: any) =>
                                handleSearchTercero(event)
                              }
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
                      name="fve_rvd_id"
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
                            <Select
                              {...field}
                              showSearch
                              options={selectFacturas}
                              placeholder="Factura Electrónica"
                              status={error && "error"}
                              filterOption={(input, option) =>
                                (option?.label ?? "")
                                  .toString()
                                  .toLowerCase()
                                  .includes(input.toLowerCase())
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
                                setFactura(
                                  facturas?.find((item) => item.id == value)
                                );
                              }}
                              disabled={
                                !["create"].includes(accion) ||
                                (tercero && detalle.length > 0)
                              }
                            />
                          </Spin>
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={24} sm={16} order={6}>
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
                  <Col span={24} order={7}>
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
                        disabled={!factura ? true : false}
                      >
                        Agregar producto
                      </Button>
                    </Col>
                  ) : null}

                  <Col span={24}>
                    <Table
                      rowKey={(record) => record.key}
                      size="small"
                      scroll={{ y: 700, x: 1200 }}
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
