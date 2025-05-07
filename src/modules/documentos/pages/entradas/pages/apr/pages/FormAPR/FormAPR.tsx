/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
    StyledCard,
    StyledFormItem,
  } from "@/modules/common/layout/DashboardLayout/styled";
  import {
    cambiarEstadoOtrDoc,
    crearOtrDoc,
    getInfoSOB,
    updateOtrDoc,
    validarAccesoDocumento,
    deleteItem,
    anyTerceros,
    getMotivos,
  } from "@/services/documentos/otrosAPI";
  import { useEffect, useMemo, useState } from "react";
  import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
//   import useSessionStorage from "../../hooks/useSessionStorage";
  import { KEY_BODEGA, KEY_EMPRESA, KEY_ROL, BASE_URL } from "@/config/api";
  import { CamposEstados, DataType } from "./types";
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
    UploadProps,
  } from "antd";
  import { ModalProductos } from "../../components/ModalProductos";
  import { ColumnsType } from "antd/es/table";
  import {
    LoadingOutlined,
    ArrowLeftOutlined,
    SaveOutlined,
    PlusOutlined,
    DeleteOutlined,
    QuestionCircleOutlined,
    SearchOutlined,
  } from "@ant-design/icons";
  import { DocumentosCabecera } from "@/services/types";
  import { getBodega, getBodegasSebthi } from "@/services/maestras/bodegasAPI";
  import { StyledText } from "./styled";
  import { searchTerceros } from "@/services/admin-terceros/tercerosAPI";
  import dayjs from "dayjs";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
 
  
  const { Title, Text } = Typography;
  const { TextArea } = Input;
  
  let timeout: ReturnType<typeof setTimeout> | null;
  
  export const FormAPR = () => {
    const { id } = useParams<{ id: string; sun_id: string }>();
    const [selectTercero, setSelectTercero] = useState<SelectProps["options"]>(
        []
      );
    const [dataSource, setDataSource] = useState<DataType[]>([]);
    const [accion, setAccion] = useState<string>("");
    const [loader, setLoader] = useState<boolean>(true);
    const { getSessionVariable } = useSessionStorage();
    const user_rol = getSessionVariable(KEY_ROL);
    const [camposEstados, setCamposEstados] = useState<CamposEstados[]>();
    const [detalle, setDetalle] = useState<DataType[]>([]);
    const [detalleErrorMsg, setDetalleErrorMsg] = useState<string>("");
    const [flagAcciones, setFlagAcciones] = useState<boolean>(false);
    const [initialData, setInitialData] = useState<DataType[]>([]);
    const [notificationApi, contextHolder] = notification.useNotification();
    const [deletingRow, setDeletingRow] = useState<React.Key[]>([]);
    const [contadorMaster, setContadorMaster] = useState<number>(0);
    const navigate = useNavigate();
    const location = useLocation();
    const [estadosVisibles] = useState<string[]>(["0", "2"]);
    const [title, setTitle] = useState<string>("");
    const [codigoDocumento, setCodigoDocumento] = useState<string>("");
    const [documentoInfo, setDocumentoInfo] = useState<DocumentosCabecera>();
    const [openFlag, setOpenFlag] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
    const [loaderTercero, setLoaderTercero] = useState<boolean>(false);
    const [optionsBodegas, setOptionsBodegas] = useState<SelectProps["options"]>(
      []
    );

    const [texto, setTexto] = useState<string>("");
    const [, setFlagLote] = useState<boolean>(false);
    const control = useForm({
      mode: "onChange",
      defaultValues: {
        detalle: detalle,
        tipo_documento_id: 0,
        bodega_id: "",
        observacion: "",
        subtotal: 0,
        iva: 0,
        total: 0,
        documento: "",
        bodega: "",
        tercero_id: "",
        fechaCierre: dayjs() || undefined || "",
        motivo_id: "",
      },
    });
  
    useEffect(() => {
      const url_split = location.pathname.split("/");
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
            setTitle(data.documento_info.descripcion);
            const campos = data?.documento_info?.cabeceras?.map((item) => ({
              nombre_campo: item.campo.nombre_campo,
              id_campo: item.id_campo,
              estado: item.estado,
            }));
            setCamposEstados(campos);
            control.setValue("tipo_documento_id", data.documento_info.id);
            control.setValue("documento", data.documento_info.descripcion);
  
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
        getInfoSOB(id).then(({ data: { data } }) => {
          setDocumentoInfo(data);
          // Esta condicion funciona para identificar si el documento se encuentra en estado cerrado (3) o en estado anulado (4), en
          // caso de estar en alguno de los estados setea en true un flag para no mostrar algunos botones
          if (["2", "3", "4"].includes(data.estado)) {
            setFlagAcciones(true);
            const estado =
              data.estado == "2"
                ? "en proceso"
                : data.estado == "3"
                ? "cerrado"
                : "anulado";
            if (["create", "edit", "anular"].includes(accion)) {
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
  
          form.setFieldValue("fecha", dayjs(data.created_at));
          control.setValue("observacion", data.observacion);
          control.setValue("bodega_id", data.bodega.id.toString());
          control.setValue("bodega", data.bodega.bod_nombre);
          control.setValue("tercero_id", data.tercero?.nit);
          control.setValue("fechaCierre", dayjs(data.fecha_cierre_contable));
          control.setValue(
            "motivo_id",
            data.motivos != null ? data.motivos.descripcion : ""
          );

          getBodegasSebthi().then(({ data: { data } }) => {
            const bodegas = data
              .filter(
                (item) => item.id_empresa == getSessionVariable(KEY_EMPRESA)
              )
              .map((item) => {
                return { label: item.bod_nombre, value: item.id };
              });
            setOptionsBodegas(bodegas);
          });
  
          const detalle: DataType[] = data.detalle.map((item) => {
            const precio_iva =
              parseFloat(item.subtotal) * (parseFloat(item.iva) / 100);
            const precio_total = parseFloat(item.subtotal) + precio_iva;
            const key = `${item.producto_id}_${item.lote}_${item.fecha_vencimiento}`;
            return {
              key,
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
  
          control.setValue("detalle", detalle);
          control.setValue("subtotal", parseFloat(data.subtotal));
          control.setValue(
            "iva",
            parseFloat(data.total) - parseFloat(data.subtotal)
          );
          setSelectTercero([
            {
              value: data.tercero.nit,
              label: `${data.tercero.nit} - ${data.tercero.razon_soc}`,
            },
          ]);
          control.setValue("total", parseFloat(data.total));
          setDataSource(detalle);
          setInitialData(detalle);
          setLoader(false);
        });
      } else {
        getBodega(getSessionVariable(KEY_BODEGA)).then(({ data: { data } }) => {
          control.setValue("bodega_id", data.id.toString());
          control.setValue("bodega", data.bod_nombre);
          form.setFieldValue("fecha", dayjs(new Date()));
          setLoader(false);
        });
  
        getBodegasSebthi().then(({ data: { data } }) => {
          const bodegas = data
            .filter((item) => item.id_empresa == getSessionVariable(KEY_EMPRESA))
            .map((item) => {
              return { label: item.bod_nombre, value: item.id.toString() };
            });
          setOptionsBodegas(bodegas);
        });
      }
    }, []);
  
    useMemo(() => {
      let subtotal = 0;
      let iva = 0;
      let total = 0;
      dataSource.forEach((item) => {
        subtotal += item.precio_subtotal;
        iva += item.precio_iva;
        total += item.precio_total;
      });
  
      control.setValue("subtotal", subtotal);
      control.setValue("iva", iva);
      control.setValue("total", total);
    }, [dataSource]);
  
    useEffect(() => {
      control.setValue("detalle", dataSource);
    }, [dataSource]);
  
    const handleSetDetalle = (productos: DataType[]) => {
      let contador = contadorMaster;
      const data: DataType[] = [];
  
      for (let x = 0; x < productos.length; x++) {
        dataSource.find((item) => item.key == productos[x].key);
        data.push({ ...productos[x], key: `${productos[x].key}_${contador}` });
        contador++;
      }
      setContadorMaster(contador);
      setDataSource(dataSource.concat(data));
      setInitialData(dataSource.concat(data));
      control.setValue("detalle", dataSource.concat(data));
    };
  
    const handleChangeAmount = (value: any, key: React.Key, origen: string) => {
      const newDataFilter = dataSource.map((item) => {
        let llave;
        if (item.itemFromModal) {
          llave = key;
        } else {
          llave = key.toString().split("_")[0];
        }
  
        if (item.key === llave) {
          let cantidad = item.cantidad;
          let lote = item.lote;
          let fvence = item.fvence;
          switch (origen) {
            case "cantidad":
              cantidad = parseInt(value) > 0 ? parseInt(value) : cantidad;
              break;
            case "lote":
              lote = value.target.value.replace(/[^A-Za-z0-9-]/g, "");
              break;
            case "vencimiento":
              fvence = dayjs(value).format("YYYY-MM-DD");
              handleChangeEdit(key, "vencimiento");
  
              break;

          }
          return { ...item, cantidad, lote, fvence };
        } else {
          return item;
        }
      });
  
      setDataSource(newDataFilter);
      setInitialData(newDataFilter);
    };
  
    const handleChangeEdit = (key: React.Key, origen: string) => {
      const newData = [...dataSource];
  
      let target;
      if (["create", "edit"].includes(accion)) {
        target = newData.find((item) => item.key === key);
      } else {
        target = newData.find(
          (item) => item.key === key.toString().split("_")[0]
        );
      }
  
      if (target) {
        if (origen == "cantidad") {
          target.editable = target.editable ? false : true;
        } else if (origen == "lote") {
          target.editableLote = target.editableLote ? false : true;
        } else if (origen == "vencimiento") {
          target.editableVen = target.editableVen ? false : true;
        }
  
        setDataSource(newData);
        setInitialData(newData);
      }
    };
  
    const handleDeleteProducto = (key: React.Key, itemFromModal: boolean) => {
      if (["create"].includes(accion) || itemFromModal) {
        setDataSource(dataSource.filter((item) => item.key != key));
      } else {
        setDeleteLoader(true);
        deleteItem({
          doc_id: id,
          producto_id: key.toString().split("_")[0],
        })
          .then(() => {
            notificationApi.open({
              type: "success",
              message: `Item removido del detalle!`,
            });
            setDataSource(dataSource.filter((item) => item.key != key));
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
        title: "Código", // titulo del encabezado de la columna
        dataIndex: "id", // nombre del campo en el arreglo datsource
        key: "id", // nombre del identificador unico
        sorter: (a, b) => a.id.toString().localeCompare(b.id.toString()),
        align: "center",
        fixed: "left",
        width: 70,
      },
      {
        title: "Descripción",
        dataIndex: "descripcion",
        key: "descripcion",
        sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
        width: 70,
      },
      {
        title: "Cantidad",
        dataIndex: "cantidad",
        key: "cantidad",
        align: "center",
        fixed: "right",
        width: 100,
        render: (_, record) => {
          return (
            <>
              {
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
              {
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
              {
              record.itemFromModal ? (
                record.editableVen && ["create", "edit"].includes(accion) ? (
                  <DatePicker
                    inputReadOnly={true}
                    defaultValue={
                      record.fvence == ""
                        ? dayjs(new Date())
                        : dayjs(record.fvence)
                    }
                    allowClear={false}
                    format={"YYYY-MM-DD"}
                    placeholder="Vencimiento"
                    style={{ width: "100%" }}
                    defaultOpen={true}
                    onChange={(fecha: any) => {
                      setFlagLote(false);
                      handleChangeAmount(fecha, record.key, "vencimiento");
                    }}
                    // onBlur={() => handleChangeEdit(record.key, "vencimiento")}
                    disabledDate={
                      !["cotizaciones"].includes(user_rol)
                        ? (current) =>
                            current < dayjs().endOf("day").subtract(1, "day")
                        : undefined
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

  
    const onFinish: SubmitHandler<any> = async (data) => {
      let flagCantidadDetalle;
      const keyProducto: React.Key[] = [];
      for (let index = 0; index < data.detalle.length; index++) {
        const producto = `${data.detalle[index]["descripcion"]}`;
        const lote = `${data.detalle[index]["lote"]}`;
        const fechavence = `${data.detalle[index]["fvence"]}`;
        const idkey = `${producto}_${lote}_${fechavence}`;
        data.fechaCierre = dayjs(data.fechaCierre).format("YYYY-MM-DD");
  
        if (data.detalle[index]["cantidad"] <= 0) {
          flagCantidadDetalle = true;
          notificationApi.open({
            type: "error",
            message: `El producto ${producto} tiene cantidad menor o igual a cero, por favor ingresa el valor`,
          });
        } else if (data.detalle[index]["lote"] == "") {
          notificationApi.open({
            type: "error",
            message: `El producto ${producto} no registra lote, por favor ingresa el valor`,
          });
        } else if (
          keyProducto.find(
            (element) =>
              element.toString().toUpperCase() === idkey.toString().toUpperCase()
          )
        ) {
          flagCantidadDetalle = true;
          notificationApi.open({
            type: "error",
            message: `El producto ${producto}, con lote ${lote} y fecha vencimiento ${fechavence} se encuentra duplicado`,
          });
        }
        keyProducto.push(idkey);
      }
  
      if (!flagCantidadDetalle) {
        setDetalleErrorMsg("");
        setLoader(true);
        if (id) {
          updateOtrDoc(data, id)
            .then(() => {
              notificationApi.open({
                type: "success",
                message: `Documento modificado con exito!`,
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
        } else {
          crearOtrDoc(data)
            .then(() => {
              notificationApi.open({
                type: "success",
                message: `Documento creado con exito!`,
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
        }
      }
    };
  
    const anularDocumento = () => {
      const data = {
        doc_id: id,
        accion: accion,
      };
      cambiarEstadoOtrDoc(data)
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
  

    /*** Funcion que permite la validacion de expresiones regulares en el campo observacion */
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const nuevoTexto = e.target.value;
      // Expresión regular que permite solo letras, números y espacios
      const regex = /^[a-zA-Z0-9\s]+$/;
  
      if (regex.test(nuevoTexto) || nuevoTexto == "") {
        setTexto(nuevoTexto);
        control.setValue("observacion", nuevoTexto);
      }
    };
    const handleSearchTercero = (searchText: string) => {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
    
        if (searchText.length > 0) {
          setLoaderTercero(true);
          timeout = setTimeout(() => {
            anyTerceros(searchText)
              .then(({ data: { data } }) => {
                setSelectTercero(
                  data.map((item) => ({
                    value: item.nit,
                    label: `${item.nit} - ${item.razon_soc}`,
                  }))
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
              .finally(() => setLoaderTercero(false));
          }, 500);
        } else {
          setLoaderTercero(false);
        }
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
              <Title level={4}>
                {title}
                {id && documentoInfo ? ` - ${documentoInfo?.consecutivo}` : null}
              </Title>
            }
          >
            {contextHolder}
            <ModalProductos
              open={openFlag}
              setOpen={(value: boolean) => setOpenFlag(value)}
              key="modalProductos"
              onSetDataSource={(productos: DataType[]) =>
                handleSetDetalle(productos)
              }
            />
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
                    sm={{ span: 12, order: 1 }}
                    md={{ span: 10, offset: 4, order: 1 }}
                    lg={{ span: 6, offset: 12, order: 1 }}
                  >
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
                          {
                            <Select
                              {...field}
                              allowClear
                              options={optionsBodegas}
                              disabled
                            />
                          }
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col
                    xs={{ span: 24, order: 1 }}
                    sm={{ span: 12, order: 2 }}
                    md={{ span: 10, order: 2 }}
                    lg={{ span: 6, order: 2 }}
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
                  <Col xs={24} sm={24} md={18} lg={16} order={3}>
                    <Controller
                      name="tercero_id"
                      control={control.control}
                      rules={{
                        required: {
                          value: true,
                          message: "Tercero es requerido",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem
                          required
                          label={"Tercero:"}
                          extra={
                            "Introduce NIT o RAZON SOCIAL del tercero y presiona la tecla 'Enter'"
                          }
                        >
                          <Spin
                            spinning={loaderTercero}
                            indicator={<LoadingOutlined spin />}
                            style={{
                              backgroundColor: "rgb(251 251 251 / 70%)",
                            }}
                          >
                            <Select
                              {...field}
                              showSearch
                              allowClear
                              suffixIcon={<SearchOutlined />}
                              placeholder="Tercero"
                              onKeyDown={(e: any) => {
                                if (e.key === "Enter") {
                                  handleSearchTercero(e.target.value);
                                }
                              }}
                              filterOption={(input, option) =>
                                (option?.label?.toString() ?? "")
                                  .toLowerCase()
                                  .includes(input.toString().toLowerCase())
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
                              notFoundContent={null}
                              options={selectTercero}
                              status={error && "error"}
                              disabled={accion === "edit" || accion === "show"}
                            />
                          </Spin>
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col span={24} order={5}>
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
                            required
                            label={'Observacion'}
                          >
                            <TextArea
                              {...field}
                              placeholder="Observación"
                              status={error && "error"}
                              autoSize={{ minRows: 4, maxRows: 6 }}
                              maxLength={250}
                              className="upperCaseText"
                              showCount
                              disabled={
                                accion === "show" || accion === "anular"
                              }
                            />
                            <Text type="danger">{error?.message}</Text>
                          </StyledFormItem>
                        )}
                      />
                  </Col>
                  </Row>
                </Col>
                <Col span={24} style={{ marginTop: 15 }}>
                  <Row gutter={[12, 12]}>
                        <Col
                          sm={{ offset: 14, span: 8 }}
                          xs={{ span: 24 }}
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <Space>
                            <Button
                              type="primary"
                              htmlType="button"
                              block
                              icon={<PlusOutlined />}
                              onClick={() => {
                                  setOpenFlag(true);
                              }}
                            >
                              Agregar Producto
                            </Button>
                          </Space>
                        </Col>
                    <Col span={24}>
                      {detalleErrorMsg != "" ? (
                        <Text type="danger">{detalleErrorMsg}</Text>
                      ) : null}
                      <Table
                        rowKey={(record) => record.key}
                        size="small"
                        scroll={{ y: 700 }}
                        pagination={{
                          simple: false,
                          pageSize: 10,
                        }}
                        bordered
                        dataSource={dataSource == null ? initialData : dataSource}
                        columns={columns}
                        style={{
                          border:
                            detalleErrorMsg.length > 0 ? "1px solid red" : "none",
                        }}
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
                            disabled={dataSource.length == 0 ? true : false}
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