/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { KEY_BODEGA, KEY_EMPRESA, KEY_ROL } from "@/config/api";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import {
  cambiarEstadoRVD,
  crearRVD,
  deleteItem,
  getInfoRVD,
  searchConvenios,
  searchTercero,
  updateRVD,
  validarAccesoDocumento,
} from "@/services/documentos/rvdAPI";
import { useEffect, useState, useMemo } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { CamposEstados, DataType, SummaryProps } from "./types";
import { Controller, useForm } from "react-hook-form";
import {
  Form,
  Spin,
  notification,
  Typography,
  Input,
  Row,
  Col,
  DatePicker,
  Button,
  Table,
  Space,
  Select,
  SelectProps,
  InputNumber,
  Tag,
  Popover,
  Popconfirm,
} from "antd";
import { getBodega } from "@/services/maestras/bodegasAPI";
import dayjs from "dayjs";
import {
  Bodega,
  Convenio,
  RemisionVentaDirectaCabecera,
  Tercero,
} from "@/services/types";
import {
  LoadingOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  PlusOutlined,
  UserOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import {
  StyledCard,
  StyledFormItem,
} from "@/modules/common/layout/DashboardLayout/styled";
import { ColumnsType } from "antd/es/table";
import {
  daysUntilExpiration,
  porcentajeEjecucionConvenio,
  porcentajeEjecucionConvenioRVDCercano,
} from "@/modules/common/constants/constants";
import { ModalProductos } from "../../components";
import { StyledText } from "./styled";

const { Title, Text, Paragraph } = Typography;
let timeout: ReturnType<typeof setTimeout> | null;
const { TextArea } = Input;
const estadosVisibles = ["0", "2"];

export const FormRVD = () => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [camposEstados, setCamposEstados] = useState<CamposEstados[]>();
  const { getSessionVariable } = useSessionStorage();
  const [user_rol] = useState<string>(getSessionVariable(KEY_ROL));
  const [loaderConvenio, setLoaderConvenio] = useState<boolean>(false);
  const [loaderTercero, setLoaderTercero] = useState<boolean>(false);
  const [flagAcciones, setFlagAcciones] = useState<boolean>(false);
  const [selectConvenio, setSelectConvenio] = useState<SelectProps["options"]>(
    []
  );
  const [documentoInfo, setDocumentoInfo] =
    useState<RemisionVentaDirectaCabecera>();
  const [bodegaInfo, setBodegaInfo] = useState<Bodega>();
  const [detalle, setDetalle] = useState<DataType[]>([]);
  const [convenio, setConvenio] = useState<Convenio>();
  const [convenios, setConvenios] = useState<Convenio[]>();
  const [tercero, setTercero] = useState<Tercero>();
  const [loader, setLoader] = useState<boolean>(true);
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [openModalProductos, setOpenModalProductos] = useState<boolean>(false);
  const [deletingRow, setDeletingRow] = useState<React.Key[]>([]);
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
      convenio_id: "",
      observacion: "",
      subtotal: 0,
      iva: 0,
      total: 0,
    },
  });
  const watchTercero = control.watch("tercero_id");

  const summaryProps: SummaryProps = {
    firstCell: { index: 0, colSpan: 2, align: "right" },
    secondCell: { index: 2, colSpan: 7, align: "right" },
    thirdCell: { index: 9, align: "center" },
    fourthCell: { index: 10 },
  };

  useEffect(() => {
    const url_split = location.pathname.split("/");
    setUrl(url_split);

    const accion = url_split[4];

    setAccion(accion);

    const codigo_documento = url_split[3];
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
      getInfoRVD(id).then(({ data: { data } }) => {
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
            key: item.producto_lote_id,
            cantidad: parseInt(item.cantidad),
            circular: item.lote.productos.circular_regulacion,
            desc_producto: item.lote.productos.descripcion,
            editable: false,
            fecha_vencimiento: item.lote.fecha_vencimiento,
            iva: [".00"].includes(item.iva) ? 0 : parseInt(item.iva),
            lote: item.lote.lote,
            precio_iva: parseFloat(item.precio_iva),
            precio_promedio: parseFloat(item.costo_unitario),
            precio_regulado: parseFloat(item.lote.productos.p_regulado_venta),
            precio_subtotal: parseFloat(item.precio_subtotal),
            precio_total: parseFloat(item.precio_total),
            precio_venta: parseFloat(item.precio_unitario),
            producto_id: item.lote.producto_id,
            stock: parseInt(item.lote.stock),
            itemFromModal: false,
          };
        });
        setBodegaInfo(data.bodega);
        control.setValue("observacion", data.observacion);
        control.setValue("bodega_id", data.bodega.id);
        control.setValue("tercero_id", data.tercero.nit);
        setSelectConvenio([
          {
            value: data.convenio.id.toString(),
            label: `${data.convenio.num_contrato} - ${data.convenio.descripcion}`,
          },
        ]);
        control.setValue("convenio_id", data.convenio_id);
        control.setValue("subtotal", parseFloat(data.subtotal));
        control.setValue(
          "iva",
          parseFloat(data.total) - parseFloat(data.subtotal)
        );
        control.setValue("total", parseFloat(data.total));
        control.setValue("detalle", detalle);
        setDetalle(detalle);
        setConvenio(data.convenio);
        setTercero(data.tercero);
        form.setFieldValue("nombre_tercero", data.tercero.razon_soc);
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
  }, []);

  useEffect(() => {
    control.setValue("detalle", detalle);
  }, [detalle]);

  useEffect(() => {
    if (watchTercero == "") {
      setTercero(undefined);
      form.setFieldValue("nombre_tercero", "");
    }
  }, [watchTercero]);

  useMemo(() => {
    let subtotal = 0;
    let iva = 0;
    let total = 0;
    detalle.forEach(({ precio_subtotal, precio_iva, precio_total }) => {
      subtotal += precio_subtotal;
      iva += precio_iva;
      total += precio_total;
    });
    control.setValue("subtotal", subtotal);
    control.setValue("iva", iva);
    control.setValue("total", total);
  }, [detalle]);

  const handleSearchConvenios = (value: string) => {
    const query = value;
    setLoaderConvenio(true);
    setSelectConvenio([]);
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (query.length > 0) {
      timeout = setTimeout(() => {
        searchConvenios(query, getSessionVariable(KEY_BODEGA))
          .then(({ data: { data } }) => {
            if (data.length > 0) {
              setLoaderConvenio(false);
              setConvenios(data);
              setSelectConvenio(
                data.map((convenio) => {
                  return {
                    value: convenio.id,
                    label: `${convenio.num_contrato} - ${convenio.descripcion}`,
                  };
                })
              );
            } else {
              setConvenios(undefined);
              setSelectConvenio([]);
              notificationApi.open({
                type: "error",
                message:
                  "No se encuentran convenios activos o vigentes que coincidan con código ingresado",
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
          .finally(() => setLoaderConvenio(false));
      }, 500);
    }
  };

  const handleSelectConvenio = (value: string | number) => {
    const convenio = convenios?.find((item) => item.id == value);
    setConvenio(convenio);
    setLoaderConvenio(false);
    if (convenio) {
      const today = dayjs().format("YYYY-MM-DD");
      const fecFin = dayjs(convenio.fec_fin).format("YYYY-MM-DD");
      const vencimiento = dayjs(fecFin).diff(today, "day");
      // Notificación y bloqueo del formulario si el convenio ya cumplió con la totalidad de su valor
      if (
        (parseFloat(convenio.remisiones_sum_total) - parseFloat(convenio.nc_rvd_sum_total)) >=
        parseFloat(convenio.valor_total)
      ) {
        notificationApi.open({
          type: "error",
          message: "El convenio se ejecuto en su totalidad.",
        });
        clearValues();
        return;
      }
      // Notificación y bloqueo del formulario si el convenio se ha vencido
      if (vencimiento < 0) {
        notificationApi.open({
          type: "error",
          message: "El convenio ya se encuentra vencido.",
        });
        clearValues();
        return;
      }
      // Notificación y bloqueo si el convenio ha cumplido con el 95% de se totalidad
      if (
        (parseFloat(convenio.remisiones_sum_total)- parseFloat(convenio.nc_rvd_sum_total)) >=
        parseFloat(convenio.valor_total) *
          (porcentajeEjecucionConvenioRVDCercano / 100)
      ) {
        notificationApi.open({
          type: "error",
          message:
            "El convenio se encuentra ejecutado en un 95% o mas de su totalidad.",
        });
        clearValues();
        return;
      }
      // Notificación si el convenio ha cumplido con el 80% de se totalidad
      if (
        (parseFloat(convenio.remisiones_sum_total) - parseFloat(convenio.nc_rvd_sum_total)) >=
        parseFloat(convenio.valor_total) * (porcentajeEjecucionConvenio / 100)
      ) {
        notificationApi.open({
          type: "warning",
          message:
            "El convenio se encuentra ejecutado en un " +
            porcentajeEjecucionConvenio +
            "% o mas de su totalidad.",
        });
      }
      // Notificación si el convenio vence el día de hoy
      if (vencimiento == 0) {
        notificationApi.open({
          type: "warning",
          message: "El convenio tiene fecha de vencimiento el día de hoy.",
        });
      }
      // Notificación si el convenio vence en menos de 1 semana
      if (vencimiento <= daysUntilExpiration && vencimiento > 0) {
        notificationApi.open({
          type: "warning",
          message: `Faltan ${vencimiento} ${
            vencimiento == 1 ? "día" : "días"
          } para que el convenio expire.`,
        });
      }
      handleSearchTercero({ target: { value: convenio?.nit } });
    }
  };

  const handleSearchTercero = (event: any) => {
    const query = event.target.value.toString();
    setLoaderTercero(true);
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (query.length > 0) {
      timeout = setTimeout(() => {
        searchTercero(query)
          .then(({ data: { data } }) => {
            if (data) {
              setTercero(data);
              control.setValue("tercero_id", data.nit);
              form.setFieldValue("nombre_tercero", data.razon_soc);
            } else {
              setTercero(undefined);
              form.setFieldValue("nombre_tercero", null);
              notificationApi.open({
                type: "error",
                message:
                  "No se encuentra cliente con el NIT digitado, por favor valida el NIT digitado.",
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
              form.setFieldValue("nombre_tercero", null);
              setTercero(undefined);
            }
          )
          .finally(() => setLoaderTercero(false));
      }, 500);
    } else {
      form.setFieldValue("nombre_tercero", null);
      setTercero(undefined);
    }
  };

  const clearValues = () => {
    control.setValue("convenio_id", "");
    form.resetFields();
    control.setValue("tercero_id", "");
    setConvenio(undefined);
    setTercero(undefined);
    setConvenios([]);
    setSelectConvenio([]);
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
        rvd_id: id,
        lote_id: key,
      })
        .then(() => {
          notificationApi.open({
            type: "success",
            message: `Item removido del detalle!`,
          });
          setDetalle(detalle.filter((item) => item.key != key));
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

  const handleChangeEdit = (key: React.Key) => {
    const newData = [...detalle];
    const target = newData.find((item) => item.key === key);
    if (target) {
      target.editable = target.editable ? false : true;
      setDetalle(newData);
    }
  };

  const handleChangeAmount = (precio_venta: number, key: React.Key) => {
    const newDataFilter = detalle.map((item) => {
      const precio_subtotal = item.cantidad * precio_venta;
      const precio_iva =
        convenio?.iva == "1" ? precio_subtotal * (item.iva / 100) : 0;
      const precio_total = precio_subtotal + precio_iva;
      if (item.key === key) {
        return {
          ...item,
          precio_venta,
          precio_subtotal,
          precio_iva,
          precio_total,
        };
      } else {
        return item;
      }
    });
    setDetalle(newDataFilter);
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
      title: "Cód.",
      dataIndex: "producto_id",
      key: "producto_id",
      align: "center",
      width: 50,
      fixed: "left",
    },
    {
      title: "Descripción",
      dataIndex: "desc_producto",
      key: "desc_producto",
      width: 300,
      fixed: "left",
      render(_, { desc_producto, precio_regulado }) {
        return (
          <Space
            direction="horizontal"
            size={0}
            align="center"
            style={{ justifyContent: "center", width: "100%" }}
          >
            <Popover autoAdjustOverflow content={desc_producto} placement="top">
              <Paragraph
                style={{ fontSize: 12, marginBlock: 0 }}
                ellipsis={{ rows: 2, expandable: false }}
              >
                {desc_producto}
              </Paragraph>
            </Popover>
            {precio_regulado > 0 && !convenio!.lista_precli ? (
              <Tag
                color="red"
                style={{
                  fontSize: 12,
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                Producto regulado
              </Tag>
            ) : null}
          </Space>
        );
      },
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
      dataIndex: "fecha_vencimiento",
      key: "fecha_vencimiento",
      align: "center",
      width: 90,
    },
    {
      title: "IVA %",
      dataIndex: "iva",
      key: "iva",
      align: "center",
      width: 90,
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
      align: "center",
      width: 90,
    },
    {
      title: "Precio Unitario",
      dataIndex: "precio_venta",
      key: "precio_venta",
      align: "center",
      width: 150,
      render(_, { key, editable, precio_venta, precio_regulado }) {
        return (
          <Space direction="vertical">
            {editable && convenio && ["create", "edit"].includes(accion) ? (
              <InputNumber
                autoFocus
                defaultValue={precio_venta}
                size="small"
                min={0}
                max={precio_regulado > 0 ? precio_regulado : null}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                controls={false}
                keyboard={false}
                onBlur={() => handleChangeEdit(key)}
                onChange={(e: any) => handleChangeAmount(e, key)}
              />
            ) : (
              <StyledText
                onClick={() => handleChangeEdit(key)}
                type={precio_venta == 0 ? "danger" : undefined}
                accion={accion}
              >
                $ {precio_venta.toLocaleString("es-CO")}
              </StyledText>
            )}
            {precio_regulado > 0 && convenio ? (
              <>
                <Text type="danger" style={{ fontSize: 12 }}>
                  Valor máx. $ {precio_regulado.toLocaleString("es-CO")}
                </Text>
              </>
            ) : null}
          </Space>
        );
      },
    },
    {
      title: "SubTotal",
      dataIndex: "precio_subtotal",
      key: "precio_subtotal",
      align: "center",
      width: 120,
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
      width: 120,
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
      width: 120,
      render: (_, { precio_total }) => {
        return (
          <>$ {parseFloat(precio_total.toString()).toLocaleString("es-CO")}</>
        );
      },
    },
  ];

  if (["create", "edit"].includes(accion)) {
    columns.push({
      title: "Acciones",
      key: "acciones",
      dataIndex: "acciones",
      align: "center",
      width: 70,
      fixed: "right",
      colSpan: 2,
      render(_, { key, cantidad, itemFromModal }) {
        return (
          <>
            <Popconfirm
              title="¿Desea eliminar este item?"
              open={deletingRow.includes(key)}
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              description={
                <Space direction="vertical" size={1}>
                  <Text>
                    {`Al eliminarlo se devolverá al inventario la cantidad de ${cantidad}`}
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
    const regex = /^[a-zA-Z0-9\s-]+$/;
    if (regex.test(nuevoTexto) || nuevoTexto == "") {
      setTexto(nuevoTexto);
      control.setValue("observacion", nuevoTexto);
    }
  };

  const onFinish = (data: any) => {
    setLoader(true);
    let flagValoresCero = false;
    detalle.forEach(({ precio_venta }) => {
      if (precio_venta <= 0) {
        flagValoresCero = true;
        return;
      }
    });

    if (!flagValoresCero) {
      data.tercero_id = tercero?.id;
      if (id) {
        updateRVD(data, id)
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
      } else {
        crearRVD(data)
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
      }
    } else {
      notificationApi.error({
        message: "Validar precios unitarios, deben ser mayores a cero.",
        placement: "bottomRight",
      });
      setLoader(false);
    }
  };

  const checkKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") e.preventDefault();
  };

  const anularDocumento = () => {
    setLoader(true);
    const data = {
      rvd_id: id,
      accion: accion,
    };
    cambiarEstadoRVD(data)
      .then(() => {
        notificationApi.open({
          type: "success",
          message: `Se ha anulado el documento con exito!`,
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
  };

  return (
    <>
      {contextHolder}
      {convenio ? (
        <ModalProductos
          listaPrecios={convenio ? convenio.lista_precli : null}
          open={openModalProductos}
          setOpen={(value: boolean) => setOpenModalProductos(value)}
          handleAddProducts={(selectedProducts: DataType[]) => {
            setDetalle([...detalle, ...selectedProducts]);
          }}
          detalle={detalle}
          flagGravado={convenio.iva == "1" ? true : false}
        />
      ) : null}

      <Spin
        spinning={loader}
        indicator={
          <LoadingOutlined spin style={{ fontSize: 40, color: "#f4882a" }} />
        }
        style={{ backgroundColor: "rgb(251 251 251 / 70%)", marginTop: 200 }}
      >
        <StyledCard
          className="styled-card-documents"
          title={
            <Title level={4}>
              Remisión Venta Directa{" "}
              {id && documentoInfo ? `- ${documentoInfo?.consecutivo}` : null}
            </Title>
          }
        >
          <Form
            layout="vertical"
            onFinish={control.handleSubmit(onFinish)}
            onKeyDown={(e: any) => checkKeyDown(e)}
            form={form}
            disabled={
              (!convenio && !tercero) || ["show", "anular"].includes(accion)
                ? true
                : false
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
                  <Col xs={24} sm={10} order={3}>
                    <Controller
                      name="convenio_id"
                      control={control.control}
                      rules={{
                        required: {
                          value: true,
                          message: "Código Convenio es requerido",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem label={"Código Convenio:"} required>
                          <Select
                            {...field}
                            placeholder="Codigo Convenio"
                            allowClear
                            showSearch
                            options={selectConvenio}
                            onSearch={handleSearchConvenios}
                            onSelect={handleSelectConvenio}
                            defaultActiveFirstOption={true}
                            filterOption={false}
                            notFoundContent={null}
                            popupMatchSelectWidth={false}
                            loading={loaderConvenio}
                            status={error && "error"}
                            onClear={() => {
                              setConvenio(undefined);
                              control.setValue("tercero_id", "");
                            }}
                            disabled={detalle.length > 0 ? true : false}
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                </Row>
                <Row gutter={12}>
                  <Col xs={24} sm={{ span: 6 }} order={4}>
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
                        <StyledFormItem
                          label={"Cliente:"}
                          required
                          extra={"Digita el NIT del cliente y presiona Enter"}
                        >
                          <Input
                            {...field}
                            placeholder="Cliente"
                            allowClear={tercero ? true : false}
                            prefix={
                              loaderTercero ? (
                                <LoadingOutlined spin />
                              ) : (
                                <UserOutlined />
                              )
                            }
                            onPressEnter={(
                              event: React.KeyboardEvent<HTMLInputElement>
                            ) => handleSearchTercero(event)}
                            status={error && "error"}
                            disabled={["show", "anular"].includes(accion)}
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={24} sm={12} order={5}>
                    <StyledFormItem
                      label={"Nombre Cliente:"}
                      name={"nombre_tercero"}
                    >
                      <Input disabled placeholder="Nombre Cliente" />
                    </StyledFormItem>
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
                        onClick={() => setOpenModalProductos(true)}
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
                          {detalle.length > 0 &&
                          ["compras", "administrador"].includes(user_rol) ? (
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
                    <Button
                      type="primary"
                      icon={<ArrowLeftOutlined />}
                      danger
                      disabled={false}
                    >
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
                          disabled={false}
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
