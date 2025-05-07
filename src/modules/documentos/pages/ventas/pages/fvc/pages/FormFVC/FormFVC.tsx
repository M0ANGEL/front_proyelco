/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { useEffect, useState, useMemo, ChangeEvent } from "react";
import useSerialize from "@/modules/common/hooks/useUpperCase";
import { CamposEstados, DataType, FormProps, SummaryProps } from "./types";
import { KEY_BODEGA, KEY_EMPRESA, KEY_ROL } from "@/config/api";
import { getIvasProducto } from "@/services/maestras/ivasAPI";
import { getBodega } from "@/services/maestras/bodegasAPI";
import {
  StyledFormItem,
  StyledCard,
} from "@/modules/common/layout/DashboardLayout/styled";
import { StyledParagraph, StyledText } from "./styled";
import { Controller, useForm } from "react-hook-form";
import { ModalConceptos } from "../../components";
import { ColumnsType } from "antd/es/table";
import {
  getConvenioRelacionado,
  validarAccesoDocumento,
  cambiarEstadoFVC,
  searchTercero,
  getConvenios,
  deleteItem,
  getInfoFVC,
  updateFVC,
  crearFVC,
} from "@/services/documentos/fvcAPI";
import {
  ArrowLeftOutlined,
  QuestionCircleOutlined,
  LoadingOutlined,
  DeleteOutlined,
  SaveOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  FacturaConceptoCabecera,
  TipoDocumento,
  Convenio,
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
  Row,
  Col,
} from "antd";

const { Title, Text } = Typography;
let timeout: ReturnType<typeof setTimeout> | null;
const { TextArea } = Input;
const estadosVisibles = ["0", "2"];
const { RangePicker } = DatePicker;

export const FormFVC = () => {
  const [documentoInfo, setDocumentoInfo] = useState<FacturaConceptoCabecera>();
  const [selectConvenio, setSelectConvenio] = useState<SelectProps["options"]>(
    []
  );
  const [convenioSeleccionado, setConvenioSeleccionado] = useState<Convenio>();
  const [openModalconceptos, setOpenModalConceptos] = useState<boolean>(false);
  const [selectConvenioRelcionado, setSelectConvenioRelacionado] = useState<
    SelectProps["options"]
  >([]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [selectIVA, setSelectIVA] = useState<SelectProps["options"]>([]);
  const [camposEstados, setCamposEstados] = useState<CamposEstados[]>();
  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumento>();
  const [loaderTercero, setLoaderTercero] = useState<boolean>(false);
  const [flagAcciones, setFlagAcciones] = useState<boolean>(false);
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [deletingRow, setDeletingRow] = useState<React.Key[]>([]);
  const [convenios, setConvenios] = useState<Convenio[]>([]);
  const [bodegaInfo, setBodegaInfo] = useState<Bodega>();
  const [detalle, setDetalle] = useState<DataType[]>([]);
  const [contador, setContador] = useState<number>(0);
  const [loader, setLoader] = useState<boolean>(true);
  const { getSessionVariable } = useSessionStorage();
  const [tercero, setTercero] = useState<Tercero>();
  const [accion, setAccion] = useState<string>("");
  const { transformToUpperCase } = useSerialize();
  const [texto, setTexto] = useState<string>("");
  const [url, setUrl] = useState<string[]>([]);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();

  const [user_rol] = useState<string>(getSessionVariable(KEY_ROL));

  const control = useForm<FormProps>({
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
      convenioRelacionado: [],
      fechaDis: undefined,
      fechaInicio: "",
      fechaFin: "",
    },
  });

  const watchTercero = control.watch("tercero_id");
  const watchConvenio = control.watch("convenio_id");

  const summaryProps: SummaryProps = {
    firstCell: { index: 0, align: "right" },
    secondCell: { index: 1, colSpan: 5, align: "right" },
    thirdCell: { index: 6, align: "center" },
    fourthCell: { index: 7 },
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
      getInfoFVC(id).then(({ data: { data } }) => {
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
            cantidad: parseInt(item.cantidad),
            concepto: item.concepto,
            iva: item.iva == ".00" ? "0" : parseInt(item.iva).toString(),
            precio_iva: parseFloat(item.precio_iva),
            precio_subtotal: parseFloat(item.precio_subtotal),
            precio_total: parseFloat(item.precio_total),
            precio_venta: parseFloat(item.precio_unitario),
            itemFromModal: false,
            editable: false,
            editableCant: false,
            editablePrecio: false,
            itemDev: item.notas_credito.length > 0 ? true : false,
          };
        });
        setBodegaInfo(data.bodega);
        control.setValue("observacion", data.observacion);
        control.setValue(
          "convenioRelacionado",
          JSON.parse(data.convenios_relacionados)
        );
        control.setValue("fechaDis", [
          dayjs(data.fecha_inicio_dis),
          dayjs(data.fecha_fin_dis),
        ]);
        // control.setValue("nro_factura", data.nro_factura);
        control.setValue("bodega_id", data.bodega.id);
        control.setValue("tercero_id", data.tercero.nit);
        control.setValue("convenio_id", data.convenio_id);
        control.setValue("subtotal", parseFloat(data.subtotal));
        control.setValue(
          "iva",
          parseFloat(data.total) - parseFloat(data.subtotal)
        );
        control.setValue("total", parseFloat(data.total));
        control.setValue("detalle", detalle);
        setDetalle(detalle);
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
      });
    }

    getConvenios(getSessionVariable(KEY_BODEGA))
      .then(({ data: { data } }) => {
        setConvenios(data);
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

    getIvasProducto().then(({ data: { data } }) => {
      setSelectIVA(
        data.map((item) => {
          return { label: `${item.iva} %`, value: item.iva };
        })
      );
    });
    getConvenioRelacionado().then(({ data: { data } }) => {
      setSelectConvenioRelacionado(
        data.map((item: any) => ({
          value: item.id,
          label: `${item.num_contrato} - ${item.descripcion}`,
        }))
      );
    });
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

  useEffect(() => {
    // despacho_id;
    if (
      !selectConvenio?.find(
        (item) => item.value == control.getValues("convenio_id")
      ) &&
      documentoInfo
    ) {
      setSelectConvenio([
        ...(selectConvenio ? selectConvenio : []),
        {
          value: documentoInfo.convenio_id,
          label: `${documentoInfo.convenio.num_contrato} - ${documentoInfo.convenio.descripcion}`,
        },
      ]);
    }
  }, [documentoInfo, selectConvenio]);

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

  useEffect(() => {
    if (control.getValues("convenio_id") && watchConvenio) {
      const convenioValues = JSON.parse(control.getValues("convenio_id"));
      const convenioFact = convenios.find((item) => item.id == convenioValues);
      setConvenioSeleccionado(convenioFact);
      if (convenioFact?.id_mod_contra != "3") {
        setConvenioSeleccionado(undefined);
        control.setValue("convenioRelacionado", []);
        control.setValue("fechaDis", null);
        control.setValue("fechaInicio", "");
        control.setValue("fechaFin", "");
      }
    }
  }, [watchConvenio]);

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
        fvc_id: id,
        id: key,
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

  const handleChangeEdit = (key: React.Key, column: string) => {
    const newData = [...detalle];
    const target = newData.find((item) => item.key === key);
    if (target) {
      switch (column) {
        case "cantidad":
          target.editableCant = target.editableCant ? false : true;
          break;
        case "precio":
          target.editablePrecio = target.editablePrecio ? false : true;
          break;
        case "concepto":
          target.editable = target.editable ? false : true;
          break;
      }
      setDetalle(newData);
    }
  };

  const handleChangeIVA = (key: React.Key, iva: string) => {
    const newDataFilter = detalle.map((item) => {
      const precio_subtotal = item.cantidad * item.precio_venta;
      const precio_iva = precio_subtotal * (parseFloat(iva) / 100);
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
      let precio_venta = item.precio_venta;
      let cantidad = item.cantidad;

      switch (column) {
        case "cantidad":
          cantidad = value ? value : 0;
          break;
        case "precio":
          precio_venta = value ? value : 0;
          break;

        default:
          break;
      }

      const precio_subtotal = cantidad * precio_venta;
      const precio_iva = precio_subtotal * (parseFloat(item.iva) / 100);
      const precio_total = precio_subtotal + precio_iva;
      if (item.key === key) {
        return {
          ...item,
          cantidad,
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
      title: "Concepto",
      dataIndex: "concepto",
      key: "concepto",
      width: 300,
      fixed: "left",
      render(_, { key, editable, concepto, itemDev }) {
        return (
          <>
            {editable && ["create", "edit"].includes(accion) && !itemDev ? (
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
                itemDev={itemDev}
              >
                {concepto}
              </StyledParagraph>
            )}
          </>
        );
      },
    },
    {
      title: "IVA %",
      dataIndex: "iva",
      key: "iva",
      align: "center",
      width: 90,
      render(_, { key, iva, itemDev }) {
        return (
          <>
            {["create", "edit"].includes(accion) ? (
              <Select
                size="small"
                options={selectIVA}
                defaultValue={iva.toString()}
                onSelect={(value: string) => {
                  handleChangeIVA(key, value);
                }}
                style={{ width: "100%" }}
                disabled={itemDev}
              />
            ) : (
              <Text>{iva} %</Text>
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
      width: 120,
      render(_, { key, editableCant, cantidad, itemDev }) {
        return (
          <Space direction="vertical">
            {editableCant && ["create", "edit"].includes(accion) && !itemDev ? (
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
                type={cantidad == 0 ? "danger" : undefined}
                accion={accion}
                itemDev={itemDev}
              >
                {cantidad}
              </StyledText>
            )}
          </Space>
        );
      },
    },
    {
      title: "Valor",
      dataIndex: "precio_venta",
      key: "precio_venta",
      align: "center",
      width: 170,
      render(_, { key, editablePrecio, precio_venta, itemDev }) {
        return (
          <Space direction="vertical">
            {editablePrecio &&
            ["create", "edit"].includes(accion) &&
            !itemDev ? (
              <InputNumber
                autoFocus
                defaultValue={precio_venta == 0 ? "" : precio_venta}
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
                type={precio_venta == 0 ? "danger" : undefined}
                accion={accion}
                itemDev={itemDev}
              >
                $ {precio_venta.toLocaleString("es-CO")}
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
      width: 170,
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
      width: 170,
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
      width: 170,
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
      colSpan: 1,
      render(_, { key, itemFromModal, itemDev }) {
        return (
          <>
            <Popconfirm
              title="¿Desea eliminar este item?"
              open={deletingRow.includes(key)}
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              description={
                <Space direction="vertical" size={1}>
                  <Text>{`Al eliminarlo se removerá por completo`}</Text>
                  {itemDev ? (
                    <Text
                      type="danger"
                      style={{ fontSize: 12 }}
                    >{`Item con nota crédito relacionada, no se puede eliminar`}</Text>
                  ) : null}
                </Space>
              }
              okButtonProps={{
                loading: deleteLoader,
                danger: true,
                disabled: itemDev,
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
              <Button
                type="primary"
                size="small"
                danger
                disabled={detalle.length == 1 && ["edit"].includes(accion)}
              >
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

  const onFinish = (data: any) => {
    setLoader(true);
    data.tercero_id = tercero?.id;
    let flagValoresCero = false;
    detalle.forEach(({ precio_venta, cantidad }) => {
      if (precio_venta <= 0 || cantidad <= 0) {
        flagValoresCero = true;
        return;
      }
    });
    // console.log(data);
    // setLoader(false);
    // return;
    if (!flagValoresCero) {
      data = transformToUpperCase(data, ["observacion"]);
      if (id) {
        updateFVC(data, id)
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
        crearFVC(data)
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
        message: "Validar valores y/o cantidades, deben ser mayores a cero.",
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
      fvc_id: id,
      accion: accion,
    };
    cambiarEstadoFVC(data)
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

  const handleAddConcepto = (concepto: string) => {
    const newItem: DataType = {
      cantidad: 0,
      concepto,
      editable: false,
      editableCant: false,
      editablePrecio: false,
      itemFromModal: true,
      iva: "0",
      key: `detail-${contador}`,
      precio_iva: 0,
      precio_subtotal: 0,
      precio_total: 0,
      precio_venta: 0,
      itemDev: false,
    };
    setContador(contador + 1);
    setDetalle([...detalle, newItem]);
  };
  console.log();

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
        style={{ backgroundColor: "rgb(251 251 251 / 70%)", marginTop: 200 }}
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
            onKeyDown={(e: any) => checkKeyDown(e)}
            form={form}
            disabled={
              !tercero || ["show", "anular"].includes(accion) ? true : false
            }
          >
            <Row gutter={[12, 6]}>
              <Col span={24}>
                <Row gutter={12}>
                  <Col
                    xs={{ span: 24, order: 2 }}
                    sm={{ span: 12, order: 1 }}
                    md={{ offset: 10, span: 6, order: 1 }}
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
                  <Col xs={24} sm={10} order={3}></Col>
                </Row>
                <Row gutter={12}>
                  <Col span={24}>
                    <Controller
                      name="convenio_id"
                      control={control.control}
                      rules={{
                        required: {
                          value: true,
                          message: "Convenio es requerido",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem label={"Convenio:"} required>
                          <Select
                            {...field}
                            placeholder="Convenio"
                            options={selectConvenio}
                            allowClear={tercero ? true : false}
                            status={error && "error"}
                            disabled={!["create", "edit"].includes(accion)}
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  {convenioSeleccionado &&
                  convenioSeleccionado.id_mod_contra === "3" ? (
                    <>
                      <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24, order: 4 }}
                        md={{ span: 16, order: 4 }}
                      >
                        <Controller
                          control={control.control}
                          name="convenioRelacionado"
                          rules={{
                            required: {
                              value: true,
                              message: "Convenio Relacionado es necesario",
                            },
                          }}
                          render={({ field, fieldState: { error } }) => (
                            <StyledFormItem
                              required
                              label={"Convenios Relacionado:"}
                              extra={
                                <Text type="secondary">
                                  Este selector listara los convenios
                                  relacionados de dispensacion
                                </Text>
                              }
                            >
                              <Select
                                {...field}
                                allowClear
                                placeholder="Convenios"
                                options={selectConvenioRelcionado}
                                mode="multiple"
                                maxTagCount={3}
                                filterOption={(input, option) =>
                                  (option?.label ?? "")
                                    .toString()
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                                }
                                popupMatchSelectWidth={false}
                                status={error && "error"}
                                disabled={!["create"].includes(accion)}
                              />
                              <Text type="danger">{error?.message}</Text>
                            </StyledFormItem>
                          )}
                        />
                      </Col>
                      <Col
                        xs={{ span: 24, order: 5 }}
                        sm={{ span: 24, order: 5 }}
                        md={{ span: 8, order: 5 }}
                      >
                        <Controller
                          control={control.control}
                          name="fechaDis"
                          rules={{
                            required: {
                              value: true,
                              message: "Rango de fechas es requerido",
                            },
                          }}
                          render={({ field, fieldState: { error } }) => (
                            <StyledFormItem required label="Rango de fechas:">
                              <RangePicker
                                {...field}
                                status={error && "error"}
                                style={{ width: "100%" }}
                                placeholder={["Inicio", "Fin"]}
                                onCalendarChange={(value: any) => {
                                  if (value) {
                                    control.setValue(
                                      "fechaInicio",
                                      dayjs(value[0]).format("YYYY-MM-DD")
                                    );
                                    control.setValue(
                                      "fechaFin",
                                      dayjs(value[1]).format("YYYY-MM-DD")
                                    );
                                  } else {
                                    control.setValue("fechaInicio", "");
                                    control.setValue("fechaFin", "");
                                  }
                                }}
                                disabled={!["create"].includes(accion)}
                              />
                              <Text type="danger">{error?.message}</Text>
                            </StyledFormItem>
                          )}
                        />
                      </Col>
                    </>
                  ) : null}
                </Row>
                <Row gutter={12}>
                  <Col xs={24} sm={{ span: 8 }} md={{ span: 6 }} order={4}>
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
                            onBlur={(event: any) => handleSearchTercero(event)}
                            status={error && "error"}
                            readOnly={loaderTercero}
                            disabled={!["create", "edit"].includes(accion)}
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={24} sm={16} md={18} order={5}>
                    <StyledFormItem
                      label={"Nombre Cliente:"}
                      name={"nombre_tercero"}
                    >
                      <Input disabled placeholder="Nombre Cliente" />
                    </StyledFormItem>
                  </Col>
                  <Col xs={24} sm={6} order={6}>
                    {/* <Controller
                      name="nro_factura"
                      control={control.control}
                      rules={{
                        required: {
                          value: true,
                          message: "Número de Factura es requerido",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem label={"Nro. Factura:"} required>
                          <Input
                            {...field}
                            placeholder="Nro. Factura"
                            allowClear={tercero ? true : false}
                            onPressEnter={(
                              event: React.KeyboardEvent<HTMLInputElement>
                            ) => handleSearchTercero(event)}
                            status={error && "error"}
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    /> */}
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
                        onClick={() => setOpenModalConceptos(true)}
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
