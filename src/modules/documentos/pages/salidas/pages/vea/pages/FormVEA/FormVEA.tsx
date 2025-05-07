/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { KEY_BODEGA, KEY_EMPRESA } from "@/config/api";
import { useEffect, useState, useMemo } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { CamposEstados, DataType } from "./types";
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
  InputNumber,
  Popconfirm,
  Select,
  SelectProps,
} from "antd";
import { getBodega } from "@/services/maestras/bodegasAPI";
import dayjs from "dayjs";
import {
  Bodega,
  DocumentosCabecera,
  Tercero,
  TipoDocumento,
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
import { StyledText } from "./styled";
import { searchTercero } from "@/services/documentos/obpAPI";
import {
  cambiarEstadoOtrDoc,
  crearOtrDoc,
  getInfoSOB,
  updateOtrDoc,
  validarAccesoDocumento,
  deleteItem,
} from "@/services/documentos/otrosAPI";
import { ModalProductosLotes } from "@/modules/common/components/ModalProductosLotes";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";

const { Title, Text, Paragraph } = Typography;
let timeout: ReturnType<typeof setTimeout> | null;
const { TextArea } = Input;
const estadosVisibles = ["0", "2"];

export const FormVEA = () => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumento>();
  const [camposEstados, setCamposEstados] = useState<CamposEstados[]>();
  const { getSessionVariable } = useSessionStorage();
  const [loaderTercero, setLoaderTercero] = useState<boolean>(false);
  const [flagAcciones, setFlagAcciones] = useState<boolean>(false);
  const [documentoInfo, setDocumentoInfo] = useState<DocumentosCabecera>();
  const [openModalLote, setOpenModalLote] = useState<boolean>(false);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [bodegaInfo, setBodegaInfo] = useState<Bodega>();
  const [detalle, setDetalle] = useState<DataType[]>([]);
  const [tercero, setTercero] = useState<Tercero>();
  const [loader, setLoader] = useState<boolean>(true);
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [deletingRow, setDeletingRow] = useState<React.Key[]>([]);
  const [ellipsisRow, setEllipsisRow] = useState<React.Key[]>([]);
  const [productoId, setProductoId] = useState<React.Key>();
  const [accion, setAccion] = useState<string>("");
  const [texto, setTexto] = useState<string>("");
  const [url, setUrl] = useState<string[]>([]);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [codigoDocumento, setCodigoDocumento] = useState<string>("");
  const [optionsBodegas, setOptionsBodegas] = useState<SelectProps["options"]>(
    []
  );
  const control = useForm({
    mode: "onChange",
    defaultValues: {
      detalle: detalle,
      tipo_documento_id: 0,
      bodega_id: "",
      tercero_id: "",
      observacion: "",
      subtotal: 0,
      iva: 0,
      total: 0,
    },
  });
  const watchTercero = control.watch("tercero_id");

  useEffect(() => {
    const url_split = location.pathname.split("/");
    setUrl(url_split);

    const accion = url_split[4];

    setAccion(accion);

    const codigo_documento = url_split[3];
    setLoader(true);
    setCodigoDocumento(codigo_documento.toUpperCase());

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
      getInfoSOB(id).then(({ data: { data } }) => {
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
          const precio_iva =
            parseFloat(item.subtotal) * (parseFloat(item.iva) / 100);
          const precio_total = parseFloat(item.subtotal) + precio_iva;
          return {
            key: item.producto.id,
            id: item.producto.id,
            descripcion: item.producto.descripcion,
            cantidad: parseInt(item.cantidad),
            precio_promedio: parseFloat(item.precio_promedio),
            lote: item.lote,
            fvence: dayjs(item.fecha_vencimiento).format("YYYY-MM-DD"),
            iva: parseFloat(item.iva),
            precio_iva: precio_iva,
            precio_subtotal: parseFloat(item.subtotal),
            precio_total: precio_total,
            itemFromModal: false,
            cantidad_devolver: item.cantidad,
          };
        });

        setBodegaInfo(data.bodega);
        control.setValue("observacion", data.observacion);
        control.setValue("bodega_id", data.bodega_id);
        control.setValue("tercero_id", data.tercero.nit);
        setDetalle(detalle);
        form.setFieldValue("fecha", dayjs(data.created_at));
        setLoader(false);
      });
    } else {
      getBodega(getSessionVariable(KEY_BODEGA)).then(({ data: { data } }) => {
        setBodegaInfo(data);
        control.setValue("bodega_id", data.bod_nombre);
        form.setFieldValue("fecha", dayjs(new Date()));
        setLoader(false);
      });
    }
  }, []);

  useEffect(() => {
    control.setValue("detalle", detalle);
  }, [detalle]);

  const handleSetDetalle = (productos: DataType[]) => {
    const data: DataType[] = [];
    for (let x = 0; x < productos.length; x++) {
      const validarProducto = detalle.find(
        (item) => item.key == productos[x].key
      );
      if (!validarProducto) {
        data.push({ ...productos[x] });
      } else {
        notificationApi.open({
          type: "warning",
          message: `El item ${productos[x].key} / ${productos[x].descripcion} ya se encuentra en el detalle`,
        });
      }
    }

    setDetalle(detalle.concat(data));
    setInitialData(detalle.concat(data));
    control.setValue("detalle", detalle.concat(data));
  };

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
                  "No se encuentra proveedor con el NIT digitado, por favor valida el NIT digitado.",
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
        obp_id: id,
        producto_id: key,
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

  const handleChangeEdit = (key: React.Key, origen: string) => {
    const newData = [...detalle];
    const target = newData.find((item) => item.key === key);
    if (target) {
      if (origen == "cantidad") {
        target.editable = target.editable ? false : true;
      } else if (origen == "lote") {
        target.editableLote = target.editableLote ? false : true;
      } else if (origen == "vencimiento") {
        target.editableVen = target.editableVen ? false : true;
      }
      setDetalle(newData);
      setInitialData(newData);
    }
  };

  const handleChangeAmount = (
    precio: number,
    key: React.Key,
    origen: string
  ) => {
    const newDataFilter = detalle.map((item) => {
      const precio_subtotal = item.precio_promedio * precio;
      const precio_iva = precio_subtotal * (item.iva / 100);
      const precio_total = precio_subtotal + precio_iva;
      if (item.key === key) {
        return {
          ...item,
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
      key: "key",
      dataIndex: "key",
      align: "center",
      width: 60,
    },
    {
      title: "Producto",
      key: "descripcion",
      dataIndex: "descripcion",
      width: 400,
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
      align: "center",
      fixed: "right",
      width: 90,
      render: (_, record) => {
        return (
          <>
            {["SOB", "AEN"].includes(codigoDocumento) &&
            record.itemFromModal ? (
              record.editable && ["create", "edit"].includes(accion) ? (
                <InputNumber
                  autoFocus
                  defaultValue={record.cantidad == 0 ? "" : record.cantidad}
                  size="small"
                  onBlur={() => handleChangeEdit(record.key, "cantidad")}
                  onChange={(e: any) =>
                    handleChangeAmount(e, record.key, "cantidad")
                  }
                />
              ) : (
                <StyledText
                  onClick={() => handleChangeEdit(record.key, "cantidad")}
                >
                  {record.cantidad}
                </StyledText>
              )
            ) : (
              <Text>{record.cantidad}</Text>
            )}
          </>
        );
      },
    },
    {
      title: "Lote",
      dataIndex: "lote",
      key: "lote",
      align: "center",
      fixed: "right",
      width: 130,
      render: (_, record) => {
        return (
          <>
            {["SOB", "AEN"].includes(codigoDocumento) &&
            record.itemFromModal ? (
              record.editableLote && ["create", "edit"].includes(accion) ? (
                <Input
                  autoFocus
                  defaultValue={record.lote == "" ? "" : record.lote}
                  size="small"
                  onBlur={() => handleChangeEdit(record.key, "lote")}
                  onChange={(e: any) => {
                    handleChangeAmount(e, record.key, "lote");
                  }}
                />
              ) : (
                <StyledText
                  onClick={() => handleChangeEdit(record.key, "lote")}
                >
                  {record.lote}
                </StyledText>
              )
            ) : (
              <Text>{record.lote}</Text>
            )}
          </>
        );
      },
    },
    {
      title: "Vencimiento",
      dataIndex: "fvence",
      key: "fvence",
      align: "center",
      fixed: "right",
      width: 170,
      render: (_, record) => {
        return (
          <>
            {["SOB", "AEN"].includes(codigoDocumento) &&
            record.itemFromModal ? (
              record.editableVen && ["create", "edit"].includes(accion) ? (
                <DatePicker
                  inputReadOnly={true}
                  defaultValue={
                    record.fvence == ""
                      ? dayjs(new Date())
                      : dayjs(record.fvence)
                  }
                  format={"YYYY-MM-DD"}
                  placeholder="Vencimiento"
                  style={{ width: "100%" }}
                  defaultOpen={true}
                  onChange={(fecha: any) => {
                    handleChangeAmount(fecha, record.key, "vencimiento");
                  }}
                  onBlur={() => handleChangeEdit(record.key, "vencimiento")}
                  disabledDate={(current) =>
                    current < dayjs().endOf("day").subtract(1, "day")
                  }
                />
              ) : (
                <StyledText
                  onClick={() => handleChangeEdit(record.key, "vencimiento")}
                >
                  {record.fvence}
                </StyledText>
              )
            ) : (
              <Text>{record.fvence}</Text>
            )}
          </>
        );
      },
    },
  ];

  if (accion == "create" || accion == "edit") {
    columns.push({
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      fixed: "right",
      render(_, { key, itemFromModal, cantidad }) {
        return (
          <>
            {accion == "create" || accion == "edit" ? (
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
            ) : null}
          </>
        );
      },
      width: 70,
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
    let flagValoresCero = false;
    detalle.forEach(({ precio_promedio }) => {
      if (precio_promedio <= 0) {
        flagValoresCero = true;
        return;
      }
    });

    if (!flagValoresCero) {
      data.tercero_id = tercero?.nit;
      if (id) {
        updateOtrDoc(data, id)
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
        crearOtrDoc(data)
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
      obp_id: id,
      accion: accion,
    };

    cambiarEstadoOtrDoc(data)
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
      <ModalProductosLotes
        open={openModalLote}
        setOpen={(value: boolean) => setOpenModalLote(value)}
        key="modalProductosLotes"
        detalle={detalle}
        handleAddProducts={(productos: DataType[]) =>
          handleSetDetalle(productos)
        }
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
                <Col xs={{ span: 24, order: 2 }} sm={{ span: 6, order: 1 }}>
                    <Controller
                      name="bodega_id"
                      control={control.control}
                      rules={{
                        required: {
                          value: true,
                          message: "Bodega es requerido",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem required label="Bodega :">
                          {accion !== "create" ||
                          ["VEA"].includes(codigoDocumento) ? (
                            <Input {...field} readOnly />
                          ) : (
                            <Select
                              {...field}
                              allowClear
                              options={optionsBodegas}
                            />
                          )}
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
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
                </Row>
                <Row gutter={12}>
                  <Col xs={24} sm={{ span: 6 }} order={4}>
                    <Controller
                      name="tercero_id"
                      control={control.control}
                      rules={{
                        required: {
                          value: true,
                          message: "Proveedor es requerido",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem label={"Proveedor:"} required>
                          <Input
                            {...field}
                            placeholder="Proveedor"
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
                            disabled={!["create", "edit"].includes(accion)}
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
                              maxLength={500}
                              showCount
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
                        onClick={() => setOpenModalLote(true)}
                      >
                        Agregar productos
                      </Button>
                    </Col>
                  ) : null}

                  <Col span={24}>
                    <Table
                      rowKey={(record) => record.key}
                      size="small"
                      scroll={{ y: 700, x: 1000 }}
                      pagination={{
                        simple: false,
                        pageSize: 10,
                      }}
                      dataSource={detalle}
                      columns={columns}
                      bordered
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
