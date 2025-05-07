/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
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
  NotaDebitoCabecera,
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
import {
  crearND,
  getInfoND,
  searchTercero,
  updateND,
  deleteItem,
  cambiarEstadoND,
} from "@/services/documentos/ndAPI";
import { StyledParagraph, StyledText } from "./styled";
import { ModalConceptos } from "../../componentes";
import { getIvasProducto } from "@/services/maestras/ivasAPI";
// import { getIvasProducto } from "@/services/maestras/ivasAPI";

const { Title, Text } = Typography;
let timeout: ReturnType<typeof setTimeout> | null;
const { TextArea } = Input;
const estadosVisibles = ["0", "2"];

export const FormND = () => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [camposEstados, setCamposEstados] = useState<CamposEstados[]>();
  const [documentoInfo, setDocumentoInfo] = useState<NotaDebitoCabecera>();
  const [selectFactura, setSelectFactura] = useState<SelectProps["options"]>(
    []
  );
  const [selectIVA, setSelectIVA] = useState<SelectProps["options"]>([]);
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
  const [openModalconceptos, setOpenModalConceptos] = useState<boolean>(false);
  const [contador, setContador] = useState<number>(0);
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
      cabecera_id: "",
      observacion: "",
      tipo_nota_debito: "",
      subtotal: 0,
      impuesto: 0,
      total: 0,
    },
  });
  const watchTercero = control.watch("tercero_id");

  const summaryProps: SummaryProps = {
    firstCell: { index: 0, align: "right" },
    secondCell: {
      index: 1,
      colSpan: id && ["show", "anular"].includes(accion) ? 5 : 5,
      align: "right",
    },
    thirdCell: {
      index: id && ["show", "anular"].includes(accion) ? 6 : 6,
      align: "center",
    },
    fourthCell: { index: id && ["show", "anular"].includes(accion) ? 7 : 7 },
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
      getInfoND(id).then(({ data: { data } }) => {
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
            key: item.id,
            concepto: item.concepto,
            cantidad: parseInt(item.cantidad),
            iva: parseFloat(item.iva),
            precio_unitario: parseFloat(item.precio_venta),
            precio_subtotal: parseFloat(item.precio_subtotal),
            precio_iva: parseFloat(item.precio_iva),
            precio_total: parseFloat(item.precio_total),
            itemFromModal: false,
            editableConcepto: false,
            editablePrecio: false,
            editableCantidad: false,
          };
        });
        setBodegaInfo(data.bodega);
        setTercero(data.tercero);
        control.setValue("bodega_id", data.bodega.id);
        form.setFieldValue("fecha", dayjs(data.created_at));
        switch (data.tipo_nota_debito) {
          case "dispensacion":
            control.setValue(
              "tercero_id",
              data.fve_dis_cabecera.convenio.tercero.nit
            );
            form.setFieldValue(
              "nombre_tercero",
              data.fve_dis_cabecera.convenio.tercero.razon_soc
            );
            setSelectFactura([
              {
                label: data.fve_dis_cabecera.numero_factura_vta,
                value: data.fve_dis_cabecera.id.toString(),
              },
            ]);
            break;
          case "venta_directa":
            control.setValue(
              "tercero_id",
              data.fve_rvd_cabecera.convenio.tercero.nit
            );
            form.setFieldValue(
              "nombre_tercero",
              data.fve_rvd_cabecera.convenio.tercero.razon_soc
            );
            setSelectFactura([
              {
                label: data.fve_rvd_cabecera.numero_factura_vta,
                value: data.fve_rvd_cabecera.id.toString(),
              },
            ]);
            break;
          case "concepto":
            control.setValue("tercero_id", data.fvc_cabecera.tercero.nit);
            form.setFieldValue(
              "nombre_tercero",
              data.fvc_cabecera.tercero.razon_soc
            );
            setSelectFactura([
              {
                label: data.fvc_cabecera.nro_factura,
                value: data.fvc_cabecera.id.toString(),
              },
            ]);
            break;
        }
        control.setValue("cabecera_id", data.cabecera_id.toString());
        control.setValue("observacion", data.observacion);
        control.setValue("subtotal", parseFloat(data.subtotal));
        control.setValue(
          "impuesto",
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

    getIvasProducto().then(({ data: { data } }) => {
      setSelectIVA(
        data.map((item) => {
          return { label: `${item.iva} %`, value: item.iva };
        })
      );
    });
  }, [id]);

  useMemo(() => {
    let subtotal = 0;
    let impuesto = 0;
    let total = 0;
    detalle.forEach((item) => {
      subtotal += item.precio_subtotal;
      impuesto += item.precio_iva;
      total += item.precio_total;
    });

    control.setValue("subtotal", subtotal);
    control.setValue("impuesto", impuesto);
    control.setValue("total", total);
  }, [detalle]);

  useEffect(() => {
    if (watchTercero == "") {
      setTercero(undefined);
      form.setFieldValue("nombre_tercero", "");
      clearValues();
    }
  }, [watchTercero]);

  const handleSearchTercero = (event: any) => {
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
            if (data) {
              setTercero(data);
              form.setFieldValue("nombre_tercero", data.razon_soc);
              const options: SelectProps["options"] = [];
              if (data.facturas_fve_dis && data.facturas_fve_dis.length > 0) {
                data.facturas_fve_dis.forEach((factura) => {
                  options.push({
                    value: factura.id + "-dispensacion",
                    label: `${factura.numero_factura_vta}`,
                  });
                });
              }
              if (
                data.facturas_venta_directa &&
                data.facturas_venta_directa.length > 0
              ) {
                data.facturas_venta_directa.forEach((factura) => {
                  options.push({
                    value: factura.id + "-venta_directa",
                    label: `${factura.numero_factura_vta}`,
                  });
                });
              }
              if (data.facturas_concepto && data.facturas_concepto.length > 0) {
                data.facturas_concepto.forEach((factura) => {
                  options.push({
                    value: factura.id + "-concepto",
                    label: `${factura.nro_factura}`,
                  });
                });
              }
              setSelectFactura(options);
              if (options.length == 0) {
                notificationApi.open({
                  type: "info",
                  message:
                    "Actualmente el cliente " +
                    data.razon_soc +
                    " no tiene facturas relacionadas.",
                });
              }
            } else {
              clearValues();
              if (!data) {
                notificationApi.open({
                  type: "error",
                  message:
                    "No se encuentra cliente con el NIT digitado o no tiene Facturas abiertas.",
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
      setLoaderUser(false);
    }
  };

  const clearValues = () => {
    control.setValue("tercero_id", "");
    control.setValue("cabecera_id", "");
    form.setFieldValue("nombre_tercero", null);
    setTercero(undefined);
    // setSelectFacturaConcepto([]);
    // setFactura(undefined);
  };

  // const handleSelectProducts = (products: SelectedProduct[]) => {
  //   const newDetalle: DataType[] = [];

  //   if (factura) {
  //     products.forEach(({ key, cantidad }) => {
  //       const keySplit = key.toString().split("_");
  //       const itemDetalle = factura.detalle.find(
  //         (item) => item.id.toString() === keySplit[0]
  //       );

  //       if (itemDetalle) {
  //         const subtotal = parseFloat(itemDetalle.precio_unitario) * cantidad;
  //         const iva = subtotal * (parseFloat(itemDetalle.iva) / 100);
  //         const total = subtotal + iva;
  //         const newItem: DataType = {
  //           key: key,
  //           concepto: itemDetalle.concepto,
  //           cantidad: parseInt(itemDetalle.cantidad),
  //           cantidad_dev: parseInt(itemDetalle.cantidad_dev),
  //           cantidad_devolver: cantidad,
  //           iva: parseFloat(itemDetalle.iva),
  //           precio_unitario: parseFloat(itemDetalle.precio_unitario),
  //           precio_subtotal: subtotal,
  //           precio_iva: iva,
  //           precio_total: total,
  //           itemFromModal: true,
  //           editableConcepto: false,
  //           editableValor: false,
  //         };
  //         newDetalle.push(newItem);
  //       }
  //     });
  //   }
  //   setDetalle(detalle.concat(newDetalle));
  //   control.setValue("detalle", detalle.concat(newDetalle));
  // };

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
        nd_id: id,
        key,
      })
        .then(() => {
          notificationApi.open({
            type: "success",
            message: `Item removido del detalle!`,
          });
          setDetalle(detalle.filter((item) => item.key != key));
          handleSearchTercero({ target: { value: tercero?.nit } });
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
        case "cantidad":
          target.editableCantidad = target.editableCantidad ? false : true;
          break;
        case "precio":
          target.editablePrecio = target.editablePrecio ? false : true;
          break;
        case "concepto":
          target.editableConcepto = target.editableConcepto ? false : true;
          break;
      }
      setDetalle(newData);
      control.setValue("detalle", newData);
    }
  };

  const handleChangeConcepto = (
    e: ChangeEvent<HTMLInputElement>,
    key: React.Key
  ) => {
    const newDataFilter = detalle.map((item) => {
      const concepto = e.target.value;

      if (item.key === key) {
        return {
          ...item,
          concepto,
        };
      } else {
        return item;
      }
    });
    setDetalle(newDataFilter);
    control.setValue("detalle", newDataFilter);
  };

  const handleChangeIVA = (key: React.Key, iva: number) => {
    const newDataFilter = detalle.map((item) => {
      const precio_subtotal = item.cantidad * item.precio_unitario;
      const precio_iva = precio_subtotal * (iva / 100);
      const precio_total = precio_subtotal + precio_iva;
      if (item.key === key) {
        return {
          ...item,
          iva,
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

  const handleChangeAmount = (
    value: number,
    key: React.Key,
    column: string
  ) => {
    const newDataFilter = detalle.map((item) => {
      let precio_unitario = item.precio_unitario;
      let cantidad = item.cantidad;

      switch (column) {
        case "cantidad":
          cantidad = value ? value : 0;
          break;
        case "precio":
          precio_unitario = value ? value : 0;
          break;

        default:
          break;
      }

      const precio_subtotal = cantidad * precio_unitario;
      const precio_iva = precio_subtotal * (item.iva / 100);
      const precio_total = precio_subtotal + precio_iva;
      if (item.key === key) {
        return {
          ...item,
          cantidad,
          precio_unitario,
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
      title: "Concepto",
      dataIndex: "concepto",
      key: "concepto",
      width: 200,
      fixed: "left",
      render(_, { key, editableConcepto, concepto }) {
        return (
          <>
            {editableConcepto && ["create", "edit"].includes(accion) ? (
              <TextArea
                autoFocus
                defaultValue={concepto}
                size="small"
                onBlur={() => handleChangeEdit(key, "concepto")}
                style={{ width: "100%", textTransform: "uppercase" }}
                onChange={(e: any) => handleChangeConcepto(e, key)}
              />
            ) : (
              <StyledParagraph
                onClick={() => handleChangeEdit(key, "concepto")}
                accion={accion}
              >
                {concepto}
              </StyledParagraph>
            )}
          </>
        );
      },
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
      align: "center",
      width: 130,
      render(value, { key, editableCantidad }) {
        return (
          <Space direction="vertical">
            {editableCantidad && ["create", "edit"].includes(accion) ? (
              <InputNumber
                autoFocus
                defaultValue={value}
                size="small"
                min={0}
                controls={false}
                keyboard={false}
                onBlur={() => handleChangeEdit(key, "cantidad")}
                onChange={(e: any) => handleChangeAmount(e, key, "cantidad")}
              />
            ) : (
              <StyledText
                onClick={() => handleChangeEdit(key, "cantidad")}
                type={value == 0 ? "danger" : undefined}
                accion={accion}
              >
                {value}
              </StyledText>
            )}
          </Space>
        );
      },
    },
    {
      title: "IVA %",
      dataIndex: "iva",
      key: "iva",
      align: "center",
      width: 90,
      render(_, { key, iva }) {
        return (
          <>
            {["create", "edit"].includes(accion) ? (
              <Select
                size="small"
                options={selectIVA}
                defaultValue={iva.toString()}
                onSelect={(value: string) => {
                  handleChangeIVA(key, parseFloat(value));
                }}
                style={{ width: "100%" }}
              />
            ) : (
              <Text>{iva} %</Text>
            )}
          </>
        );
      },
    },
    {
      title: "Precio Unitario",
      dataIndex: "precio_unitario",
      key: "precio_unitario",
      align: "center",
      width: 130,
      render(_, { key, editablePrecio, precio_unitario }) {
        return (
          <Space direction="vertical">
            {editablePrecio && ["create", "edit"].includes(accion) ? (
              <InputNumber
                autoFocus
                defaultValue={precio_unitario == 0 ? "" : precio_unitario}
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
                type={precio_unitario == 0 ? "danger" : undefined}
                accion={accion}
              >
                $ {precio_unitario.toLocaleString("es-CO")}
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
    columns.push({
      title: "Acciones",
      key: "acciones",
      dataIndex: "acciones",
      align: "center",
      width: 70,
      fixed: "right",
      colSpan: 2,
      render(_, { key, itemFromModal }) {
        return (
          <>
            <Popconfirm
              title="¿Desea eliminar este item?"
              open={deletingRow.includes(key)}
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              description={
                <Space direction="vertical" size={1}>
                  <Text>
                    {`Al eliminarlo se eliminirá el item del detalle`}
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
    data.cabecera_id = data.cabecera_id.split("-")[0];
    if (!id) {
      crearND(data)
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
      updateND(data, id)
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
      nd_id: id,
      accion: accion,
    };
    cambiarEstadoND(data)
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

  const handleAddConcepto = (concepto: string) => {
    const newItem: DataType = {
      cantidad: 0,
      concepto,
      editableConcepto: false,
      editableCantidad: false,
      editablePrecio: false,
      itemFromModal: true,
      iva: 0,
      key: `detail-${contador}`,
      precio_iva: 0,
      precio_subtotal: 0,
      precio_total: 0,
      precio_unitario: 0,
    };
    setContador(contador + 1);
    setDetalle([...detalle, newItem]);
  };

  return (
    <>
      {contextHolder}
      <ModalConceptos
        open={openModalconceptos}
        setOpen={(value: boolean) => setOpenModalConceptos(value)}
        handleSelectConcepto={(concepto: string) => {
          handleAddConcepto(concepto);
        }}
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
                      name="cabecera_id"
                      control={control.control}
                      rules={{
                        required: {
                          value: true,
                          message: "Factura es requerido",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem label={"Factura:"} required>
                          <Select
                            {...field}
                            showSearch
                            options={selectFactura}
                            placeholder="Factura"
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
                              const keySplit = value.split("-");
                              control.setValue("tipo_nota_debito", keySplit[1]);
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
                        onClick={() => setOpenModalConceptos(true)}
                        // disabled={!factura ? true : false}
                      >
                        Agregar concepto
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
                                      .getValues("impuesto")
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
