/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { ModalLotes, ModalProductos, TablaExpandida } from "../../componentes";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { getBodega } from "@/services/maestras/bodegasAPI";
import {
  StyledCard,
  StyledFormItem,
} from "@/modules/common/layout/DashboardLayout/styled";
import { KEY_BODEGA, KEY_EMPRESA, KEY_ROL } from "@/config/api";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState, useMemo } from "react";
import { ColumnsType } from "antd/es/table";
import { StyledText } from "./styled";
import {
  validarAccesoDocumento,
  cambiarEstadoCGN,
  searchTercero,
  deleteItem,
  getInfoCGN,
  updateCGN,
  crearCGN,
} from "@/services/documentos/cgnAPI";
import {
  QuestionCircleOutlined,
  ArrowLeftOutlined,
  LoadingOutlined,
  DeleteOutlined,
  SaveOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  ConsignacionCabecera,
  TipoDocumento,
  Tercero,
  Bodega,
} from "@/services/types";
import {
  DataTypeChildren,
  CamposEstados,
  SummaryProps,
  DataType,
} from "./types";
import {
  notification,
  InputNumber,
  DatePicker,
  Popconfirm,
  Typography,
  Tooltip,
  Button,
  Input,
  Space,
  Table,
  Form,
  Spin,
  Row,
  Col,
  Tag,
} from "antd";
import { fetchUserProfile } from "@/services/auth/authAPI";

let timeout: ReturnType<typeof setTimeout> | null;
const { Title, Text, Paragraph } = Typography;
const estadosVisibles = ["0", "2"];
const { TextArea } = Input;

export const FormCGN = () => {
  const [documentoInfo, setDocumentoInfo] = useState<ConsignacionCabecera>();
  const [notificationApi, contextHolder] = notification.useNotification();
  const [camposEstados, setCamposEstados] = useState<CamposEstados[]>();
  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumento>();
  const [loaderTercero, setLoaderTercero] = useState<boolean>(false);
  const [openModalLote, setOpenModalLote] = useState<boolean>(false);
  const [flagAcciones, setFlagAcciones] = useState<boolean>(false);
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [deletingRow, setDeletingRow] = useState<React.Key[]>([]);
  const [ellipsisRow, setEllipsisRow] = useState<React.Key[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [hasFuente, setHasFuente] = useState<boolean>(false);
  const [seePrices, setSeePrices] = useState<boolean>(false);
  const [productoId, setProductoId] = useState<React.Key>();
  const [bodegaInfo, setBodegaInfo] = useState<Bodega>();
  const [detalle, setDetalle] = useState<DataType[]>([]);
  const [loader, setLoader] = useState<boolean>(true);
  const { getSessionVariable } = useSessionStorage();
  const [tercero, setTercero] = useState<Tercero>();
  const [accion, setAccion] = useState<string>("");
  const [texto, setTexto] = useState<string>("");
  const [url, setUrl] = useState<string[]>([]);
  const user_rol = getSessionVariable(KEY_ROL);
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
      observacion: "",
      subtotal: 0,
      iva: 0,
      total: 0,
    },
  });
  const watchTercero = control.watch("tercero_id");

  const summaryProps: SummaryProps = {
    firstCell: { index: 0, colSpan: 2, align: "right" },
    secondCell: { index: 2, colSpan: 6, align: "right" },
    thirdCell: { index: 8, align: "center" },
    fourthCell: { index: 9 },
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
      getInfoCGN(id).then(({ data: { data } }) => {
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
          let total_ingreso = 0;
          let precio_subtotal = 0;
          let precio_iva = 0;
          let precio_total = 0;
          const lotes: DataTypeChildren[] = item.map((linea) => {
            const f_vencimiento = dayjs(linea.lote.fecha_vencimiento).format(
              "DD-MM-YYYY"
            );
            total_ingreso += parseInt(linea.cantidad);
            precio_subtotal += parseFloat(linea.precio_subtotal);
            precio_iva += parseFloat(linea.precio_iva);
            precio_total += parseFloat(linea.precio_total);
            return {
              key: `${linea.lote.producto_id}_${linea.lote.lote}_${f_vencimiento}`,
              cantidad: parseInt(linea.cantidad),
              lote: linea.lote.lote,
              f_vencimiento,
              itemFromModal: false,
            };
          });
          const producto = item[0];
          return {
            key: producto ? producto.lote.producto_id : "",
            descripcion: producto ? producto.lote.productos.descripcion : "",
            cod_padre: producto ? producto.lote.productos.cod_padre : "",
            cod_huv: producto ? producto.lote.productos.cod_huv : "",
            total_ingreso,
            precio: parseFloat(item[0].precio_unitario),
            iva: parseFloat(item[0].iva),
            precio_subtotal,
            precio_iva,
            precio_total,
            editablePrecio: false,
            itemFromModal: false,
            lotes: lotes,
          };
        });
        setBodegaInfo(data.bodega);
        control.setValue("observacion", data.observacion);
        control.setValue("bodega_id", data.bodega.id);
        control.setValue("tercero_id", data.tercero.nit);
        control.setValue("subtotal", parseFloat(data.subtotal));
        control.setValue(
          "iva",
          parseFloat(data.total) - parseFloat(data.subtotal)
        );
        control.setValue("total", parseFloat(data.total));
        setDetalle(detalle);
        console.log(detalle);
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

  useEffect(() => {
    fetchUserProfile().then(({ data: { userData } }) => {
      if (userData.has_fuentes == "1") {
        setHasFuente(true);
      } else {
        setHasFuente(false);
      }
    });
  }, []);

  useEffect(() => {
    if (hasFuente) {
      if (["administrador"].includes(user_rol)) {
        setSeePrices(true);
      } else {
        setSeePrices(false);
      }
    } else {
      setSeePrices(true);
    }
  }, [hasFuente, user_rol]);

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
        cgn_id: id,
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

  const handleChangeEdit = (key: React.Key) => {
    const newData = [...detalle];
    const target = newData.find((item) => item.key === key);
    if (target) {
      target.editablePrecio = target.editablePrecio ? false : true;
      setDetalle(newData);
    }
  };

  const handleChangeAmount = (precio: number, key: React.Key) => {
    const newDataFilter = detalle.map((item) => {
      const precio_subtotal = item.total_ingreso * precio;
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

  const setChildren = (key: React.Key, children: DataTypeChildren[]) => {
    // Se recorre el detalle para saber a que producto se le debe realizar la modificacion de lotes y se realiza una doble iteracion para
    // poder actuaizar el total de la cantidad ingresada
    const newData = detalle
      .map((item) => {
        if (item.key == key) {
          return { ...item, lotes: children };
        } else {
          return { ...item };
        }
      })
      .map((item) => {
        let total_ingreso = 0;
        item.lotes.forEach((lote) => {
          total_ingreso += lote.cantidad;
        });
        const precio_subtotal = total_ingreso * item.precio;
        const precio_iva = precio_subtotal * (item.iva / 100);
        const precio_total = precio_subtotal + precio_iva;
        return {
          ...item,
          total_ingreso,
          precio_subtotal,
          precio_iva,
          precio_total,
        };
      });

    setDetalle(newData);
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
      render: (_, { key, descripcion }) => {
        return (
          <Row>
            <Col span={24}>
              <Paragraph
                ellipsis={
                  !ellipsisRow.includes(key)
                    ? {
                        rows: 1,
                        expandable: true,
                        symbol: "ver más",
                        onExpand: () => {
                          setEllipsisRow([...ellipsisRow, key]);
                        },
                      }
                    : false
                }
              >
                {descripcion}
              </Paragraph>
            </Col>
          </Row>
        );
      },
    },
    {
      title: ["create", "edit"].includes(accion)
        ? "Cant. a Ingresar"
        : "Cant. Ingresada",
      key: "total_ingreso",
      dataIndex: "total_ingreso",
      align: "center",
      width: 100,
      render(_, { total_ingreso }) {
        return (
          <>
            <Space direction="vertical">
              {["create", "edit"].includes(accion) ? (
                <Tag color={"green"} style={{ fontSize: 15 }}>
                  {total_ingreso}
                </Tag>
              ) : (
                <Text>{total_ingreso}</Text>
              )}
            </Space>
          </>
        );
      },
    },
    {
      title: "IVA %",
      key: "iva",
      dataIndex: "iva",
      align: "center",
      width: 60,
      hidden: !seePrices,
    },
    {
      title: "Precio",
      key: "precio",
      dataIndex: "precio",
      align: "center",
      width: 130,
      hidden: !seePrices,
      render: (_, { key, precio, editablePrecio }) => {
        return (
          <>
            <Space direction="vertical">
              {["create", "edit"].includes(accion) ? (
                editablePrecio ? (
                  <InputNumber
                    autoFocus
                    min={0}
                    defaultValue={precio == 0 ? "" : precio}
                    controls={false}
                    keyboard={false}
                    formatter={(value) =>
                      `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    size="small"
                    onBlur={() => handleChangeEdit(key)}
                    onChange={(e: any) => handleChangeAmount(e, key)}
                  />
                ) : (
                  <StyledText
                    accion={accion}
                    onClick={() => handleChangeEdit(key)}
                  >
                    <Tag
                      color={precio == 0 ? "red" : "green"}
                      style={{ fontSize: 15 }}
                    >
                      $ {precio.toLocaleString("es-CO")}
                    </Tag>
                  </StyledText>
                )
              ) : (
                <Text>$ {precio.toLocaleString("es-CO")}</Text>
              )}
            </Space>
          </>
        );
      },
    },
    {
      title: "Subtotal",
      key: "precio_subtotal",
      dataIndex: "precio_subtotal",
      align: "center",
      width: 120,
      hidden: !seePrices,
      render: (_, { precio_subtotal }) => {
        return <>$ {precio_subtotal.toLocaleString("es-CO")}</>;
      },
    },
    {
      title: "IVA",
      key: "precio_iva",
      dataIndex: "precio_iva",
      align: "center",
      width: 120,
      hidden: !seePrices,
      render: (_, { precio_iva }) => {
        return <>$ {precio_iva.toLocaleString("es-CO")}</>;
      },
    },
    {
      title: "Total",
      key: "precio_total",
      dataIndex: "precio_total",
      align: "center",
      width: 120,
      hidden: !seePrices,
      render: (_, { precio_total }) => {
        return <>$ {precio_total.toLocaleString("es-CO")}</>;
      },
    },
  ];

  if (["create", "edit"].includes(accion)) {
    columns.push({
      title: "Acciones",
      key: "acciones",
      align: "center",
      width: 100,
      render: (_, { key, total_ingreso, itemFromModal }) => {
        return (
          <Space>
            <Tooltip title="Añadir Lote">
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  setOpenModalLote(true);
                  setProductoId(key);
                }}
              >
                <PlusOutlined />
              </Button>
            </Tooltip>
            <Popconfirm
              title="¿Desea eliminar este item?"
              open={deletingRow.includes(key)}
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              description={
                <Space direction="vertical" size={1}>
                  <Text>
                    {`Al eliminarlo se devolverá la cantidad de ${total_ingreso} en los lotes correspondientes`}
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
          </Space>
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
    let flagValoresCero = false;
    detalle.forEach(({ precio }) => {
      if (precio <= 0) {
        flagValoresCero = true;
        return;
      }
    });

    if (!flagValoresCero) {
      data.tercero_id = tercero?.id;
      if (id) {
        updateCGN(data, id)
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
        crearCGN(data)
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
      cgn_id: id,
      accion: accion,
    };
    cambiarEstadoCGN(data)
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
      <ModalLotes
        openModalLote={openModalLote}
        detalle={detalle}
        setOpenModalLote={(value: boolean) => setOpenModalLote(value)}
        producto_id={productoId}
        setDetalle={(value: DataType[]) => {
          setDetalle(value);
        }}
      />
      <ModalProductos
        open={openModal}
        setOpen={(value: boolean) => setOpenModal(value)}
        detalle={detalle}
        handleSelectProducto={(producto: DataType) => {
          setDetalle([...detalle, producto]);
          setProductoId(producto.key);
          setOpenModalLote(true);
        }}
        hasFuente={hasFuente}
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
                            onBlur={(event: any) => {
                              handleSearchTercero(event);
                            }}
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
                              maxLength={250}
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
                        onClick={() => setOpenModal(true)}
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
                      expandable={{
                        expandedRowRender: ({ key, lotes }) => {
                          return (
                            <TablaExpandida
                              data={lotes}
                              setChildren={(children: DataTypeChildren[]) =>
                                setChildren(key, children)
                              }
                              accion={accion}
                              cgn_id={id}
                            />
                          );
                        },
                      }}
                      summary={
                        seePrices
                          ? () => (
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
                                      <Table.Summary.Cell
                                        {...summaryProps.thirdCell}
                                      >
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
                                      <Table.Summary.Cell
                                        {...summaryProps.thirdCell}
                                      >
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
                                      <Table.Summary.Cell
                                        {...summaryProps.thirdCell}
                                      >
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
                            )
                          : undefined
                      }
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
