/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { SelectedProduct } from "../../componentes/ModalConceptos/types";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { validarAccesoDocumento } from "@/services/documentos/rqpAPI";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { CamposEstados, DataType, SummaryProps } from "./types";
import { getIvasProducto } from "@/services/maestras/ivasAPI";
import { getBodega } from "@/services/maestras/bodegasAPI";
import {
  StyledFormItem,
  StyledCard,
} from "@/modules/common/layout/DashboardLayout/styled";
import { StyledParagraph, StyledText } from "./styled";
import { KEY_BODEGA, KEY_EMPRESA, KEY_ROL } from "@/config/api";
import { ModalConceptos, ModalConceptosMaestra } from "../../componentes";
import { ColumnsType } from "antd/es/table";
import {
  cambiarEstadoNCC,
  searchTercero,
  deleteItem,
  getInfoNCC,
  updateNCC,
  crearNCC,
} from "@/services/documentos/nccAPI";
import dayjs from "dayjs";
import {
  QuestionCircleOutlined,
  ArrowLeftOutlined,
  LoadingOutlined,
  SearchOutlined,
  DeleteOutlined,
  SaveOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  NotaCreditoConceptoCabecera,
  FacturaConceptoCabecera,
  TipoDocumento,
  Tercero,
  Bodega,
} from "@/services/types";
import {
  notification,
  InputNumber,
  SelectProps,
  DatePicker,
  Popconfirm,
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
  Radio,
} from "antd";
import { getConvenios } from "@/services/documentos/fvcAPI";

let timeout: ReturnType<typeof setTimeout> | null;
const { Title, Text } = Typography;
const estadosVisibles = ["0", "2"];
const { TextArea } = Input;

export const FormNCC = () => {
  const [openModalConceptos, setOpenModalConceptos] = useState<boolean>(false);
  const [selectConvenio, setSelectConvenio] = useState<SelectProps["options"]>(
    []
  );
  const [notificationApi, contextHolder] = notification.useNotification();
  const [camposEstados, setCamposEstados] = useState<CamposEstados[]>();
  const [documentoInfo, setDocumentoInfo] =
    useState<NotaCreditoConceptoCabecera>();
  const [selectFacturaConcepto, setSelectFacturaConcepto] = useState<
    SelectProps["options"]
  >([]);
  const [selectIVA, setSelectIVA] = useState<SelectProps["options"]>([]);
  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumento>();
  const [factura, setFactura] = useState<FacturaConceptoCabecera>();
  const [flagAcciones, setFlagAcciones] = useState<boolean>(false);
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [deletingRow, setDeletingRow] = useState<React.Key[]>([]);
  const [loaderUser, setLoaderUser] = useState<boolean>(false);
  const [bodegaInfo, setBodegaInfo] = useState<Bodega>();
  const [detalle, setDetalle] = useState<DataType[]>([]);
  const [loader, setLoader] = useState<boolean>(true);
  const [contador, setContador] = useState<number>(0);
  const { getSessionVariable } = useSessionStorage();
  const [tercero, setTercero] = useState<Tercero>();
  const [open, setOpen] = useState<boolean>(false);
  const [accion, setAccion] = useState<string>("");
  const [texto, setTexto] = useState<string>("");
  const [url, setUrl] = useState<string[]>([]);
  const { id } = useParams<{ id: string }>();
  const user_rol = getSessionVariable(KEY_ROL);
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
      fvc_id: "",
      observacion: "",
      subtotal: 0,
      iva: 0,
      total: 0,
      convenio_id: "",
      isFinanciera: "No",
      cod_concepto_nc: "2",
      desc_concepto_nc: "",
    },
  });
  const watchTercero = control.watch("tercero_id");
  const watchIsFinanciera = control.watch("isFinanciera");
  const watchConcepto = control.watch("cod_concepto_nc");

  const selectConceptosNC: SelectProps["options"] = [
    {
      value: "1",
      label:
        "Devolución parcial de los bienes y/o no aceptación parcial del servicio.",
    },
    {
      value: "2",
      label: "Anulación de factura electrónica.",
      disabled: watchIsFinanciera == "Si",
    },
    { value: "3", label: "Rebaja o descuento parcial o total." },
    { value: "4", label: "Ajuste de precio." },
    { value: "5", label: "Descuento comercial por pronto pago." },
    { value: "6", label: "Descuento comercial por volumen de ventas." },
  ];

  const summaryProps: SummaryProps = {
    firstCell: { index: 0, align: "right" },
    secondCell: {
      index: 1,
      colSpan:
        control.getValues("isFinanciera") == "Si"
          ? 3
          : id && ["show", "anular"].includes(accion)
          ? 5
          : 6,
      align: "right",
    },
    thirdCell: {
      index:
        control.getValues("isFinanciera") == "Si"
          ? 3
          : id && ["show", "anular"].includes(accion)
          ? 6
          : 7,
      align: "center",
    },
    fourthCell: {
      index:
        control.getValues("isFinanciera") == "Si"
          ? 5
          : id && ["show", "anular"].includes(accion)
          ? 7
          : 8,
    },
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
      getInfoNCC(id).then(({ data: { data } }) => {
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

        const dataDetalle: DataType[] = data.detalle.map((item) => {
          return {
            key:
              data.fvc_cabecera != null
                ? `${item.det_fvc_id}_${item.id}`
                : `${item.id}`,
            concepto: item.concepto,
            cantidad: data.fvc_cabecera
              ? parseInt(item.fvc_detalle.cantidad)
              : parseInt(item.cantidad),
            cantidad_dev: data.fvc_cabecera
              ? parseInt(item.fvc_detalle.cantidad_dev)
              : parseInt(item.cantidad),
            valor_dev: data.fvc_cabecera
              ? parseInt(item.fvc_detalle.valor_dev)
              : 0,
            cantidad_devolver: parseInt(item.cantidad),
            iva: parseFloat(item.iva),
            precio_unitario: parseFloat(item.precio_unitario),
            precio_subtotal: parseFloat(item.precio_subtotal),
            precio_iva: parseFloat(item.precio_iva),
            precio_total: parseFloat(item.precio_total),
            itemFromModal: false,
            editableConcepto: false,
            editableValor: false,
            editableCant: false,
            precio_maximo:
              parseFloat(item.precio_unitario) -
              (data.fvc_cabecera ? parseFloat(item.fvc_detalle.valor_dev) : 0),
          };
        });

        setBodegaInfo(data.bodega);
        setTercero(data.tercero);
        if (data.fvc_cabecera) {
          setFactura(data.fvc_cabecera);
          control.setValue("fvc_id", data.fvc_cabecera.id.toString());
          setSelectFacturaConcepto([
            {
              label: data.fvc_cabecera.nro_factura,
              value: data.fvc_cabecera.id.toString(),
            },
          ]);
          control.setValue("isFinanciera", "No");
        } else {
          control.setValue("isFinanciera", "Si");
          control.setValue("convenio_id", data.convenio_id);
        }
        control.setValue("cod_concepto_nc", data.cod_concepto_nc);
        control.setValue("desc_concepto_nc", data.desc_concepto_nc);
        control.setValue("bodega_id", data.bodega.id);
        form.setFieldValue("fecha", dayjs(data.created_at));
        control.setValue("tercero_id", data.tercero.nit);
        form.setFieldValue("nombre_tercero", data.tercero.razon_soc);
        control.setValue("observacion", data.observacion);
        control.setValue("subtotal", parseFloat(data.subtotal));
        control.setValue(
          "iva",
          parseFloat(data.total) - parseFloat(data.subtotal)
        );
        control.setValue("total", parseFloat(data.total));
        control.setValue("detalle", dataDetalle);
        setDetalle(dataDetalle);
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
    getConvenios(getSessionVariable(KEY_BODEGA))
      .then(({ data: { data } }) => {
        setSelectConvenio(
          data.map((item) => {
            return {
              value: item.id.toString(),
              label: `${item.num_contrato} - ${item.descripcion}`,
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
      .finally(() => setLoader(false));
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
    if (watchTercero == "") {
      setTercero(undefined);
      form.setFieldValue("nombre_tercero", "");
      clearValues();
    }
  }, [watchTercero]);

  useEffect(() => {
    if (["create"].includes(accion)) {
      clearValues();
      if (watchIsFinanciera == "Si") {
        control.setValue("cod_concepto_nc", "");
        control.setValue("desc_concepto_nc", "");
      } else if (watchIsFinanciera == "No") {
        control.setValue("cod_concepto_nc", "2");
        control.setValue(
          "desc_concepto_nc",
          "Anulación de factura electrónica."
        );
      }
    }
  }, [watchIsFinanciera]);

  useEffect(() => {
    if (watchConcepto) {
      const concepto = selectConceptosNC.find(
        (item) => item.value == watchConcepto
      );
      if (concepto) {
        control.setValue(
          "desc_concepto_nc",
          concepto.label ? concepto.label.toString() : ""
        );
      }
    }
  }, [watchConcepto]);

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
            if (data) {
              if (control.watch("isFinanciera") == "No") {
                if (
                  data &&
                  data.facturas_concepto &&
                  data.facturas_concepto.length > 0
                ) {
                  setTercero(data);
                  form.setFieldValue("nombre_tercero", data.razon_soc);
                  const options: SelectProps["options"] = [];
                  data.facturas_concepto.forEach((factura) => {
                    let valor_devuelto = 0;
                    factura.detalle.forEach((itemDetalle) => {
                      valor_devuelto += parseInt(itemDetalle.valor_dev) || 0;
                    });

                    if (parseInt(factura.total) > valor_devuelto) {
                      options.push({
                        value: factura.id,
                        label: `${factura.nro_factura}`,
                      });
                    }
                  });
                  setSelectFacturaConcepto(options);
                  if (fromDeleteItem) {
                    setFactura(
                      data.facturas_concepto.find(
                        (item) =>
                          item.id == parseInt(control.getValues("fvc_id"))
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
              } else {
                setTercero(data);
                form.setFieldValue("nombre_tercero", data.razon_soc);
              }
            } else {
              notificationApi.open({
                type: "error",
                message: "No se encontró el cliente con el NIT digitado.",
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

  const clearValues = () => {
    control.setValue("tercero_id", "");
    control.setValue("fvc_id", "");
    form.setFieldValue("nombre_tercero", null);
    setTercero(undefined);
    setSelectFacturaConcepto([]);
    setFactura(undefined);
    setContador(0);
    setDetalle([]);
    control.setValue("detalle", []);
  };

  const handleSelectProducts = (products: SelectedProduct[]) => {
    const newDetalle: DataType[] = [];

    if (factura) {
      products.forEach(({ key, cantidad }) => {
        const keySplit = key.toString().split("_");
        const itemDetalle = factura.detalle.find(
          (item) => item.id.toString() === keySplit[0]
        );

        if (itemDetalle) {
          const subtotal = parseFloat(itemDetalle.precio_unitario) * cantidad;
          const iva = subtotal * (parseFloat(itemDetalle.iva) / 100);
          const total = subtotal + iva;
          const newItem: DataType = {
            key: key,
            concepto: itemDetalle.concepto,
            cantidad: parseInt(itemDetalle.cantidad),
            cantidad_dev: parseInt(itemDetalle.cantidad_dev),
            cantidad_devolver: cantidad,
            iva: parseFloat(itemDetalle.iva),
            valor_dev: parseFloat(itemDetalle.valor_dev),
            precio_unitario: parseFloat(itemDetalle.precio_unitario),
            precio_maximo:
              parseFloat(itemDetalle.precio_unitario) -
              parseFloat(itemDetalle.valor_dev),
            precio_subtotal: subtotal,
            precio_iva: iva,
            precio_total: total,
            itemFromModal: true,
            editableConcepto: false,
            editableValor: false,
            editableCant: false,
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
      deleteItem({
        ncc_id: id,
        key,
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

  const handleChangeEdit = (key: React.Key, column: string) => {
    const newData = [...detalle];
    const target = newData.find((item) => item.key === key);
    if (target) {
      switch (column) {
        case "cantidad":
          target.editableCant = target.editableCant ? false : true;
          break;
        case "precio":
          target.editableValor = target.editableValor ? false : true;
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

  const handleChangeAmount = (
    value: number,
    key: React.Key,
    column: string
  ) => {
    const newDataFilter = detalle.map((item) => {
      let precio_unitario = item.precio_unitario;
      let cantidad = item.cantidad_devolver;
      let iva = item.iva;

      switch (column) {
        case "cantidad":
          cantidad = value ? value : 0;
          break;
        case "precio":
          precio_unitario = value ? value : 0;
          break;
        case "iva":
          iva = value ? value : 0;
          break;

        default:
          break;
      }

      const precio_subtotal = cantidad * precio_unitario;
      const precio_iva = precio_subtotal * (iva / 100);
      const precio_total = precio_subtotal + precio_iva;
      if (item.key === key) {
        return {
          ...item,
          iva,
          cantidad_devolver: cantidad,
          cantidad:
            control.getValues("isFinanciera") == "No"
              ? item.cantidad
              : cantidad,
          cantidad_dev:
            control.getValues("isFinanciera") == "No"
              ? item.cantidad_dev
              : cantidad,
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
      width: 80,
      render(value, { key, editableCant, cantidad }) {
        return control.getValues("isFinanciera") == "Si" ? (
          <Space direction="vertical">
            {editableCant && ["create", "edit"].includes(accion) ? (
              <InputNumber
                autoFocus
                defaultValue={cantidad == 0 ? "" : cantidad}
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
                accion={accion}
              >
                {cantidad}
              </StyledText>
            )}
          </Space>
        ) : (
          <>{value}</>
        );
      },
    },
    {
      title: "Cantidad Devuelta",
      dataIndex: "cantidad_dev",
      key: "cantidad_dev",
      align: "center",
      hidden: control.watch("isFinanciera") == "Si",
      width: 80,
    },
    {
      title: "Precio Unitario",
      dataIndex: "precio_unitario",
      key: "precio_unitario",
      align: "center",
      width: 150,
      render(_, { key, editableValor, precio_unitario, precio_maximo }) {
        return (
          <Space direction="vertical">
            {editableValor && ["create", "edit"].includes(accion) ? (
              <InputNumber
                autoFocus
                defaultValue={precio_unitario == 0 ? "" : precio_unitario}
                size="small"
                min={0}
                max={watchIsFinanciera == "Si" ? undefined : precio_maximo}
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
            {watchIsFinanciera != "Si" ? (
              <Text type="danger" style={{ fontSize: 11 }}>
                Valor máx: $ {precio_maximo.toLocaleString("es-CO")}
              </Text>
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
      // render: (_, { precio_iva }) => {
      //   return (
      //     <>$ {parseFloat(precio_iva.toString()).toLocaleString("es-CO")}</>
      //   );
      // },
      render(_, { key, iva }) {
        return (
          <>
            {["create", "edit"].includes(accion) ? (
              <Select
                size="small"
                options={selectIVA}
                defaultValue={iva.toString()}
                onSelect={(value: string) => {
                  handleChangeAmount(parseFloat(value), key, "iva");
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

  if (
    ["create", "edit"].includes(accion) &&
    control.watch("isFinanciera") == "No"
  ) {
    columns.splice(3, 0, {
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
    data.tercero_id = tercero?.id;
    if (!id) {
      crearNCC(data)
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
      updateNCC(data, id)
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
      ncc_id: id,
      accion: accion,
    };
    cambiarEstadoNCC(data)
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
      key: `detail-${contador}`,
      concepto,
      cantidad: 0,
      cantidad_dev: 0,
      cantidad_devolver: 0,
      iva: 0,
      valor_dev: 0,
      precio_unitario: 0,
      precio_subtotal: 0,
      precio_iva: 0,
      precio_total: 0,
      itemFromModal: true,
      editableConcepto: false,
      editableValor: false,
      editableCant: false,
      precio_maximo: 0,
    };
    setContador(contador + 1);
    setDetalle([...detalle, newItem]);
  };

  return (
    <>
      {contextHolder}
      <ModalConceptos
        open={open}
        setOpen={(value: boolean) => setOpen(value)}
        factura={factura}
        handleSelectProducts={(products: SelectedProduct[]) =>
          handleSelectProducts(products)
        }
        detalle={detalle.map((item) => item.concepto)}
      />

      <ModalConceptosMaestra
        open={openModalConceptos}
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
                  <Col xs={24} sm={12} order={1}>
                    {["facturacion", "administrador"].includes(user_rol) ? (
                      <Controller
                        name="isFinanciera"
                        control={control.control}
                        rules={{
                          required: {
                            value: true,
                            message: "Escoger si Es Financiera es requerido",
                          },
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <StyledFormItem
                            required={
                              camposEstados
                                ?.filter((item) => item.id_campo == "3")
                                .at(0)?.estado === "2"
                            }
                            label={"¿La Nota Crédito es Financiera?"}
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
                    ) : (
                      <></>
                    )}
                  </Col>
                  <Col xs={{ span: 24, order: 3 }} sm={{ span: 4, order: 2 }}>
                    <StyledFormItem label={"Bodega:"}>
                      <Input disabled value={bodegaInfo?.bod_nombre} />
                    </StyledFormItem>
                  </Col>
                  <Col xs={{ span: 24, order: 2 }} sm={{ span: 8, order: 3 }}>
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
                  {control.watch("isFinanciera") === "No" ? (
                    <Col xs={24} sm={8} order={5}>
                      <Controller
                        name="fvc_id"
                        control={control.control}
                        rules={{
                          required: {
                            value: true,
                            message: "Factura Concepto es requerido",
                          },
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <StyledFormItem label={"Factura Concepto:"} required>
                            <Select
                              {...field}
                              showSearch
                              options={selectFacturaConcepto}
                              placeholder="Factura Concepto"
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
                                setFactura(
                                  tercero?.facturas_concepto?.find(
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
                  ) : (
                    <>
                      <Col xs={24} sm={8} order={5}>
                        <Controller
                          control={control.control}
                          name="convenio_id"
                          render={({ field, fieldState: { error } }) => (
                            <StyledFormItem label={"Convenio:"} required>
                              <Select
                                {...field}
                                showSearch
                                options={selectConvenio}
                                placeholder="Convenio"
                                status={error && "error"}
                                filterOption={(input, option) =>
                                  (option?.label ?? "")
                                    .toString()
                                    .includes(input)
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
                                disabled={
                                  !tercero ||
                                  !["create", "edit"].includes(accion) ||
                                  detalle.length > 0
                                }
                              />
                            </StyledFormItem>
                          )}
                        />
                      </Col>
                      <Col xs={24} sm={10} order={5}>
                        <Controller
                          control={control.control}
                          name="cod_concepto_nc"
                          render={({ field, fieldState: { error } }) => (
                            <StyledFormItem
                              label={"Concepto Nota Crédito:"}
                              required
                            >
                              <Select
                                {...field}
                                showSearch
                                options={selectConceptosNC}
                                placeholder="Concepto Nota Crédito"
                                status={error && "error"}
                                filterOption={(input, option) =>
                                  (option?.label ?? "")
                                    .toString()
                                    .includes(input)
                                }
                                disabled={
                                  !tercero ||
                                  !["create", "edit"].includes(accion) ||
                                  detalle.length > 0
                                }
                              />
                            </StyledFormItem>
                          )}
                        />
                      </Col>
                    </>
                  )}
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
                      {control.watch("isFinanciera") === "No" ? (
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
                      ) : (
                        <Button
                          type="primary"
                          htmlType="button"
                          block
                          icon={<PlusOutlined />}
                          onClick={() => setOpenModalConceptos(true)}
                        >
                          Agregar concepto
                        </Button>
                      )}
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
