/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Spin,
  Tooltip,
  Typography,
  message,
  notification,
  Popconfirm,
  Modal,
  List,
  Divider,
} from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Bodega, IDocumentos, IDocumentosDetalle } from "@/services/types";
import Table, { ColumnsType } from "antd/es/table";
import {
  LoadingOutlined,
  SaveOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  StyledCard,
  StyledFormItem,
} from "@/modules/common/layout/DashboardLayout/styled";
import { ModalProductosPadre } from "../../components";
import { CamposEstados, DataType } from "./types";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_EMPRESA, KEY_BODEGA, KEY_ROL } from "@/config/api";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import { anyTerceros, searchTercero } from "@/services/maestras/prestamosAPI";
import {
  anularDoc,
  crearDocumento,
  getInfoSalida,
  updateDocumentos,
  validarAccesoDocumento,
} from "@/services/documentos/otrosAPI";
import { getBodega } from "@/services/maestras/bodegasAPI";
import "./styles.css";
import { ModalLotes } from "../../components/ModalLotes";
import { ModalProductsPAT } from "../../components/ModalProductsPAT";

dayjs.extend(customParseFormat);

const { Title, Text } = Typography;
const { TextArea } = Input;

export const FormRET = () => {
  const [estadosVisibles] = useState<string[]>(["0", "2"]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [notificationApi, contextHolder] =
    notification.useNotification();
  const [loader, setLoader] = useState<boolean>(false);
  const [form] = Form.useForm();
  const { getSessionVariable } = useSessionStorage();
  const [accion, setAccion] = useState<string>("");
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedProducts, setSelectedProducts] = useState<DataType[]>([]);
  const [total, setTotal] = useState(0);
  const [messageApi] = message.useMessage();
  const [camposEstados, setCamposEstados] = useState<CamposEstados[]>();
  const [terceroSeleccionado, setTerceroSeleccionado] = useState(false);
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const [bodegaInfo, setBodegaInfo] = useState<Bodega>();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTercero, setSelectedTercero] = useState(null);
  const [terceros, setTerceros] = useState<any[]>([]);
  const [documentoInfo, setDocumentoInfo] = useState<IDocumentos>();
  const [openModalLote, setOpenModalLote] = useState<boolean>(false);
  const [productoId, setProductoId] = useState<React.Key>("");
  const [productosPAT, setProductosPAT] = useState<IDocumentosDetalle[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [openModalPro, setOpenModalPro] = useState<boolean>(false);
  const [variableCompartida, setVariableCompartida] = useState("");
  const [user_rol] = useState<string>(getSessionVariable(KEY_ROL));
  const control = useForm({
    mode: "onChange",
    defaultValues: {
      subtotal: 0,
      total: 0,
      detalle: dataSource,
      tipo_documento_id: 0,
      oc_id: "",
      bodega_id: 0,
      tercero_id: "",
      observacion: "",
      factura_nro: "",
      ipoconsumo: 0,
    },
  });

  useEffect(() => {
    const url_split = location.pathname.split("/");
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
      )
        .then(({ data: { data } }) => {
          if (data) {
            const campos = data?.documento_info?.cabeceras?.map((item) => ({
              nombre_campo: item.campo.nombre_campo,
              id_campo: item.id_campo,
              estado: item.estado,
            }));
            setCamposEstados(campos);
            control.setValue("tipo_documento_id", data.documento_info.id);

            if (data.crear !== "1" && accion == "create") {
              messageApi.open({
                type: "error",
                content: "No tienes permisos para crear documento!",
              });
              setTimeout(() => {
                navigate(
                  `/${url_split.at(1)}/${url_split.at(2)}/${codigo_documento}`
                );
              }, 1500);
              return;
            }
            if (data.modificar !== "1" && accion == "edit") {
              messageApi.open({
                type: "error",
                content: "No tienes permisos para modificar!",
              });
              setTimeout(() => {
                navigate(
                  `/${url_split.at(1)}/${url_split.at(2)}/${codigo_documento}`
                );
              }, 1500);
              return;
            }
            if (data.consultar !== "1" && accion == "show") {
              messageApi.open({
                type: "error",
                content: "No tienes permisos para consultar!",
              });
              setTimeout(() => {
                navigate(
                  `/${url_split.at(1)}/${url_split.at(2)}/${codigo_documento}`
                );
              }, 1500);
              return;
            }
            if (data.anular !== "1" && accion == "anular") {
              messageApi.open({
                type: "error",
                content: "No tienes permisos para anular!",
              });
              setTimeout(() => {
                navigate(
                  `/${url_split.at(1)}/${url_split.at(2)}/${codigo_documento}`
                );
              }, 1500);
              return;
            }
          } else {
            messageApi.open({
              type: "error",
              content: "No tienes permisos para acceder a este documento!",
            });
            setTimeout(() => {
              navigate(`/${url_split.at(1)}`);
              setLoader(false);
            }, 1500);
          }
          setLoader(false);
        })
        .finally(() => {
          setLoader(false);
        });
    }

    getBodega(getSessionVariable(KEY_BODEGA)).then(({ data: { data } }) => {
      setBodegaInfo(data);
      control.setValue("bodega_id", data.bod_nombre);
    });
    // if (!isMounted.current) {
    if (id) {
      getInfoSalida(id).then(({ data: { data } }) => {
        setDocumentoInfo(data);
        if (["2", "3", "4"].includes(data.estado)) {
          const estado =
            data.estado == "2"
              ? "en proceso"
              : data.estado == "3"
              ? "cerrado"
              : "anulado";
          if (["create", "edit", "anular"].includes(accion)) {
            messageApi.open({
              type: "error",
              content: `Este documento se encuentra ${estado}, no es posible realizar modificaciones, solo consulta.`,
            });
            setTimeout(() => {
              navigate(
                `/${url_split.at(1)}/${url_split.at(2)}/${codigo_documento}`
              );
            }, 2500);
            return;
          }
        }

        control.setValue("observacion", data.observacion);
        control.setValue("tercero_id", data.tercero.nit);
        control.setValue("nombre_tercero", data.tercero.razon_soc);
        control.setValue("doc_prestamo", data.docu_prestamo);
        control.setValue("bodega_id", data.bodega.bod_nombre);

        const fecha = new Date(data.created_at);
        const dia = fecha.getDate();
        const mes = fecha.getMonth() + 1;
        const año = fecha.getFullYear();

        const fechaFormateada = `${dia < 10 ? "0" + dia : dia}/${
          mes < 10 ? "0" + mes : mes
        }/${año}`;
        control.setValue("fecha", fechaFormateada);
        //RECORDAR: formatear DataType, y campos
        // if (!detalleProcesado) {
        const detalle: DataType[] = data.detalle.map((item, index) => {
          return {
            key: index,
            id: item.producto_id,
            descripcion: item.descripcion,
            //cantSol: item.cantidad_solicitada,
            cantidad: item.cantidad,
            //cantDev: item.cantidad_dev,
            fvence: item.fecha_vencimiento,
            lote: item.lote,
            precio_promedio: item.precio_promedio,
            precio_subtotal: item.precio_subtotal,
            iva: item.precio_iva,
            precio_total: item.precio_venta_total,
            editable: true,
          };
        });

        // Marcamos que el detalle ha sido procesado
        if (id && ["show", "anular"].includes(accion)) {
          setDataSource(detalle);
          handleSetDetalle(detalle);
        }

        setProductosPAT(data.detalle);
        // }
      });
    }

    // isMounted.current = true;
    // }
  }, [id]);

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedTercero(null);
  };

  const handleCancel = () => {
    // Lógica para cancelar y restablecer el formulario o redirigir a otra página.
    navigate(-1);
  };

  const handleSearchTercero = (searchText) => {
    try {
      anyTerceros(searchText).then(({ data: { data } }) => {
        setModalVisible(true);
        setSelectedTercero(true);
        setTerceros(data);
      });
    } catch (error) {
      console.error("Error fetching terceros:", error);
    }
  };

  const handleSelectTercero = (tercero) => {
    setSelectedTercero(tercero);

    try {
      searchTercero(tercero).then(({ data }) => {
        if (data) {
          const nomTer = data.nombre;
          const idTer = data.nit;
          setTerceros(data);
          control.setValue("tercero_id", idTer);
          control.setValue("nombre_tercero", nomTer);
          setTerceroSeleccionado(true);
        }
      });
      setModalVisible(false);
    } catch (error) {
      console.error("Error fetching dispensaciones:", error);
    }
  };

  // Funcion para eliminar el item del detalle, es decir, del arreglo y se recalcula el subtotal y total del documento
  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key != key);
    setDataSource(newData);
    setSelectedProducts(selectedProducts.filter((item) => item.key !== key));
  };

  const calcularSubtotal = (cantidad, precio_lista) => {
    return cantidad * precio_lista;
  };

  const calcularIva = (cantidad, precio_lista, valorIva, agravado) => {
    let suma = 0;
    if (agravado === 1 || agravado === "1") {
      suma = cantidad * precio_lista * (valorIva / 100);
    }
    return suma;
  };

  const calcularTotal = (cantidad: any, precio_lista: any, valorIva: any) => {
    valorIva = 19;
    const sumaTotal =
      cantidad * precio_lista + cantidad * precio_lista * (valorIva / 100);
    setTotal(sumaTotal);
    return parseFloat(
      cantidad * precio_lista + cantidad * precio_lista * (valorIva / 100)
    );
  };

  const anularDocumento = () => {
    const data = {
      doc_id: id,
      accion: accion,
    };
    anularDoc(data)
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

  const handleSetDetalle = (productos: DataType[]) => {
    const data: DataType[] = [];
    const duplicateProducts: DataType[] = [];
    productos.forEach((producto) => {
      const existingProduct = selectedProducts.find(
        (p) =>
          p.id === producto.id &&
          p.lote === producto.lote &&
          p.fvence === producto.fvence
      );

      if (existingProduct) {
        duplicateProducts.push(producto);
      } else {
        const iva = calcularIva(
          producto.cantidad,
          producto.precio_promedio,
          19,
          1
        );
        const subtotal = calcularSubtotal(
          producto.cantidad,
          producto.precio_promedio
        );
        const total = calcularTotal(
          producto.cantidad,
          producto.precio_promedio,
          producto.iva
        );
        const precio = producto.precio_promedio;
        const lot = producto.lote;
        const fv = producto.fvence;
        data.push({
          ...producto,
          iva,
          precio_subtotal: subtotal,
          precio_total: total,
          precio,
          lote: lot.toString(),
          fvence: fv.toString(),
        });
      }
    });

    if (duplicateProducts.length > 0) {
      notification.open({
        type: "warning",
        description: (
          <div>
            El/los siguiente(s) producto(s) ya se encuentra(n) en el detalle:{" "}
            <br />
            {duplicateProducts
              .map((producto) => `${producto.key} / ${producto.descripcion}`)
              .join(", ")}
          </div>
        ),
      });
      return;
    }

    setDataSource((prevDataSource) => {
      const newData = prevDataSource.concat(data);
      control.setValue("detalle", newData);

      return newData;
    });

    setSelectedProducts((prevSelectedProducts) => {
      const newSelectedProducts = [...prevSelectedProducts, ...productos];
      return newSelectedProducts;
    });
  };

  const onFinish: SubmitHandler<any> = async (data: any) => {
    const url_split = location.pathname.split("/");
    const accion = id
      ? url_split[url_split.length - 2]
      : url_split[url_split.length - 1];

    data.bodega_id = getSessionVariable(KEY_BODEGA);
    data.empresa = getSessionVariable(KEY_EMPRESA);
    data.total = total;

    if (accion === "crear") {
      updateDocumentos(data, id)
        .then(() => {
          message.open({
            type: "success",
            content: "Documento actualizado exitosamente!",
          });
          setTimeout(() => {
            navigate("..");
          }, 800);
        })
        .catch((error) => {
          if (error.response) {
            // Error de respuesta del servidor (código de estado HTTP fuera del rango 2xx)
            const responseData = error.response.data;
            const errorMessage = responseData.message;
            // Cerrar la alerta después de 3 segundos (3000 milisegundos)
            setTimeout(() => {
              // Mostrar la alerta con el mensaje de error
              message.open({
                type: "error",
                content: errorMessage,
              });
            }, 3000);
          } else {
            // Error general
            console.error("Error:", error.message);
          }
        });
    } else if (accion === "edit") {
      data.bodega_id = getSessionVariable(KEY_BODEGA);
      data.empresa = getSessionVariable(KEY_EMPRESA);
      data.flagRET = 1;
      crearDocumento(data)
        .then(() => {
          setDisableButton(true); // Deshabilitar el botón

          const message = `El retorno préstamo se creó exitosamente.`;
          notificationApi.open({
            type: "success",
            message: message,
          });
          setTimeout(() => {
            const url_split = location.pathname.split("/");

            const codigo_documento = id
              ? url_split[url_split.length - 3]
              : url_split[url_split.length - 2];
            codigo_documento.toUpperCase(), getSessionVariable(KEY_EMPRESA);
            navigate(`/${url_split.at(1)}/${url_split.at(2)}/ret`);
          }, 800);
        })

        .catch(({ response: { data } }) => {
          notificationApi.open({
            type: "error",
            message: data.message,
          });
        });
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Código",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id.toString().localeCompare(b.id.toString()),
      align: "center",
      fixed: "left",
      width: 80, // Reducir el ancho de esta columna
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
      sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
      fixed: "left",
      width: 250, // Reducir el ancho de esta columna
      render: (_, record) => {
        return (
          <>
            <Space>
              <Text style={{ fontSize: 12 }}>{record.descripcion}</Text>
            </Space>
          </>
        );
      },
    },
    {
      title: "Cantidad Retornada",
      dataIndex: "cantidad",
      key: "cantidad",
      align: "center",
      width: 80, // Reducir el ancho de esta columna
    },
    {
      title: "Vence",
      dataIndex: "fvence",
      key: "fvence",
      sorter: (a, b) => a.fvence.localeCompare(b.fvence),
      align: "center",
      width: 90, // Reducir el ancho de esta columna
    },
    {
      title: "Lote",
      dataIndex: "lote",
      key: "lote",
      align: "center",
      width: 80, // Reducir el ancho de esta columna
    },

    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      fixed: "right",
      render: (_, record: { key: React.Key }) => {
        const canDelete =
          record.cantSol === record.cantidad && record.cantDev == 0;

        if (accion === "edit" && record.editable == true) {
          return (
            <Space>
              <Popconfirm
                title="¿Desea eliminar este item?"
                // onConfirm={() =>
                //   handleUpLote(
                //     record.id,
                //     record.lote,
                //     record.fvence,
                //     record.cantidad,
                //     record.key
                //   )
                // }
                placement="left"
              >
                <Tooltip title="Retornar Item">
                  <Button
                    danger
                    type="primary"
                    icon={<DeleteOutlined />}
                    disabled={!canDelete}
                  />
                </Tooltip>
              </Popconfirm>
            </Space>
          );
        } else if (accion === "edit" && record.editable == false) {
          return (
            <Tooltip title="Retornar Item">
              <Button
                danger
                type="primary"
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record.key)}
                disabled={record.editable}
              />
            </Tooltip>
          );
        } else {
          return (
            <Tooltip title="Eliminar Item">
              <Button
                danger
                type="primary"
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record.key)}
                disabled={accion === "show" || accion === "anular"}
              />
            </Tooltip>
          );
        }
      },
      width: 80,
    },
  ];

  // const handleUpLote = (id_pro, lote, fvence, cantidad, key: React.Key) => {
  //   const data = {
  //     id: id_pro,
  //     lote: lote,
  //     fvence: fvence,
  //     bodega_id: getSessionVariable(KEY_BODEGA),
  //     cantidad: cantidad,
  //     dispensacion_id: id,
  //   };

  //   const newDataSource = dataSource.filter((item) => item.key !== id_pro);
  //   if (newDataSource.length > 1) {
  //     updateDisLote(data, id)
  //       .then(() => {
  //         message.open({
  //           type: "success",
  //           content: "Item eliminado correctamente!",
  //         });
  //       })
  //       .catch((error) => {
  //         if (error.response) {
  //           // Error de respuesta del servidor (código de estado HTTP fuera del rango 2xx)
  //           const responseData = error.response.data;
  //           const errorMessage = responseData.message;

  //           // Cerrar la alerta después de 3 segundos (3000 milisegundos)
  //           setTimeout(() => {
  //             // Mostrar la alerta con el mensaje de error
  //             message.open({
  //               type: "error",
  //               content: errorMessage,
  //             });
  //           }, 3000);
  //         } else {
  //           // Error general
  //           console.error("Error:", error.message);
  //         }
  //       });

  //     handleDelete(key);
  //   } else {
  //     message.open({
  //       type: "error",
  //       content: "No puedes eliminar el último producto de la dispensación.",
  //     });
  //   }
  // };

  // Esta funcion se usa al seleccionar un producto desde la maestra de productos o desde la ORDEN DE COMPRA
  const handleSelectProducto = (producto: IDocumentosDetalle) => {
    console.log(producto)
    const productoSeleccionado = { ...producto };
    setProductoId(productoSeleccionado.producto_id);
    setVariableCompartida(productoSeleccionado.cantidad);

    setOpenModalPro(true);
  };

  const handleSelectPadre = (producto: IDocumentosDetalle) => {
    if (!dataSource.find((item) => item.key === producto.producto_id)) {
      const data: DataType = {
        key: producto.producto_id,
        descripcion: producto.producto.descripcion,
        total_cantidad: parseInt(producto.cantidad),
        total_ingreso: 0,
        precio_compra: parseFloat(producto.precio_compra),
        cod_padre: producto.producto.cod_padre,
        editablePrecio: false,
        iva: parseFloat(producto.iva),
        lotes: [],
      };
      setOpenModalPro(true);
      setProductoId(producto.producto_id);
    } else {
      notificationApi.open({
        type: "error",
        message: `El producto ${producto.producto.descripcion} ya se encuentra en el detalle`,
      });
    }
  };

  return (
    <>
      {contextHolder}
      <ModalLotes
        detalle={dataSource}
        openModalLote={openModalLote}
        setOpenModalLote={(value: boolean) => setOpenModalLote(value)}
        producto_id={productoId}
        setDetalle={(value: DataType[]) => {
          setDataSource(value);
          control.setValue("detalle", value);
        }}
      />
      <ModalProductsPAT
        open={open}
        setOpen={(value: boolean) => setOpen(value)}
        productosPAT={productosPAT}
        detalle={dataSource}
        handleSelectProducto={(producto: IDocumentosDetalle) =>
          handleSelectProducto(producto)
        }
        setVariableCompartida={setVariableCompartida}
      />
      <ModalProductosPadre
        openModalPro={openModalPro}
        setOpenModalPro={(value: boolean) => {
          setOpenModalPro(value);
          setProductoId("");
        }}
        onSetDataSource={(productos: DataType[]) => handleSetDetalle(productos)}
        idProducto={productoId}
        handleSelectPadre={(producto: IDocumentosDetalle) =>
          handleSelectPadre(producto)
        }
        variableCompartida={variableCompartida}
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
              <span className="color-card-title">
                {accion === "show" ? "Consecutivo: " : null}
              </span>
              {accion === "create" ? "Nuevo " : null}
              {accion === "anular" ? "Anular " : null}
              {accion === "edit" ? "Editar " : null}
              {accion !== "show" ? "Retorno de Préstamo " : null}
              {id && documentoInfo ? ` ${documentoInfo?.consecutivo}` : null}
            </Title>
          }
        >
          {contextHolder}

          {!loader ? (
            <Form
              layout={"vertical"}
              form={form}
              onFinish={control.handleSubmit(onFinish)}
            >
              <Row gutter={[12, 6]}>
                <Col span={24}>
                  <Row gutter={[24, 12]}>
                    <Col xs={24} sm={12} style={{ marginBottom: "12px" }}></Col>
                    <Col xs={24} sm={6} style={{ marginBottom: "12px" }}>
                      <Controller
                        name="bodega_id"
                        control={control.control}
                        render={({ field, fieldState: { error } }) => (
                          <StyledFormItem label={"Punto Entrega:"}>
                            {accion === "show" ? (
                              <Input {...field} readOnly />
                            ) : (
                              <Input
                                {...field}
                                disabled
                                value={bodegaInfo?.bod_nombre}
                              />
                            )}
                            <Text type="danger">{error?.message}</Text>
                          </StyledFormItem>
                        )}
                      />
                    </Col>
                    <Col xs={24} sm={6} style={{ marginBottom: "12px" }}>
                      <Controller
                        name="fecha"
                        control={control.control}
                        render={({ field, fieldState: { error } }) => (
                          <StyledFormItem required label="Fecha:">
                            {accion === "show" ? (
                              <Input {...field} readOnly />
                            ) : (
                              <DatePicker
                                {...field}
                                showTime
                                format="YYYY-MM-DD HH:mm:ss"
                                value={dayjs()}
                                disabled
                              />
                            )}
                            <Text type="danger">{error?.message}</Text>
                          </StyledFormItem>
                        )}
                      />
                    </Col>
                    <Col xs={24} sm={12} style={{ marginBottom: "12px" }}>
                      <Controller
                        name="tercero_id"
                        control={control.control}
                        render={({ field, fieldState: { error } }) => (
                          <StyledFormItem required label={"Tercero Id:"}>
                            {accion === "edit" || accion === "anular" ? (
                              <Input {...field} disabled />
                            ) : (
                              <Select
                                {...field}
                                showSearch
                                //showArrow={false}
                                suffixIcon={null}
                                filterOption={false}
                                placeholder={
                                  "Introduce nit o Id. de tercero y presiona 'Enter'"
                                }
                                onKeyDown={(e: any) => {
                                  if (e.key === "Enter") {
                                    handleSearchTercero(e.target.value);
                                  }
                                }}
                                notFoundContent={null}
                                status={error && "error"}
                                disabled={
                                  terceroSeleccionado ||
                                  accion === "edit" ||
                                  accion === "show"
                                }
                              />
                            )}
                            <Text type="danger">{error?.message}</Text>
                          </StyledFormItem>
                        )}
                      />
                    </Col>
                    <Modal
                      title="Resultados de Terceros:"
                      open={modalVisible}
                      onCancel={handleModalClose}
                      footer={null}
                    >
                      {selectedTercero ? (
                        <List
                          bordered
                          dataSource={terceros}
                          renderItem={(tercero) => (
                            <List.Item
                              onClick={() => handleSelectTercero(tercero.nit)}
                              className={
                                selectedTercero ===
                                tercero.numero_identificacion
                                  ? "selected hovered-row"
                                  : "hovered-row"
                              }
                              style={{ cursor: "pointer" }}
                            >
                              <Text>
                                {tercero.nit} - {tercero.razon_soc}
                              </Text>
                            </List.Item>
                          )}
                        />
                      ) : (
                        <List
                          bordered
                          renderItem={() => (
                            <List.Item>
                              <Text>Sin resultados</Text>
                            </List.Item>
                          )}
                        />
                      )}
                    </Modal>
                    <Col xs={24} sm={12} style={{ marginBottom: "12px" }}>
                      <Controller
                        name="nombre_tercero"
                        control={control.control}
                        render={({ field, fieldState: { error } }) => (
                          <StyledFormItem label={"Nombre:"}>
                            {accion == "create" || accion == "edit" ? (
                              <Input {...field} disabled={true} />
                            ) : (
                              <Input {...field} readOnly />
                            )}
                            <Text type="danger">{error?.message}</Text>
                          </StyledFormItem>
                        )}
                      />
                    </Col>
                    <Col span={24}>
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
                                placeholder="Escribe una observación"
                                status={error && "error"}
                                autoSize={{ minRows: 4, maxRows: 6 }}
                                maxLength={500}
                                showCount
                                disabled={
                                  accion === "show" || accion === "anular"
                                }
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
                {/*Inicia detalle*/}
                <Divider children={<Text type="secondary">Detalle</Text>} />
                <Col span={24} style={{ marginTop: 15 }}>
                  <Row gutter={[12, 12]}>
                    {["create", "edit"].includes(accion) &&
                    [
                      "administrador",
                      "regente",
                      "regente_farmacia",
                      "quimico",
                    ].includes(user_rol) ? (
                      <>
                        <Col
                          md={{ span: 7, offset: 17 }}
                          sm={{ span: 10, offset: 14 }}
                          xs={{ span: 24 }}
                        >
                          <Button
                            type="primary"
                            htmlType="button"
                            block
                            icon={<PlusOutlined />}
                            onClick={() => setOpen(true)}
                          >
                            Agregar desde PAT
                          </Button>
                        </Col>
                      </>
                    ) : null}
                    <Col span={24}>
                      <Table
                        rowKey={(record) => record.key}
                        size="small"
                        scroll={{ y: 700 }}
                        pagination={{
                          simple: false,
                        }}
                        bordered
                        dataSource={dataSource}
                        columns={columns}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col
                  span={24}
                  style={{
                    marginTop: "20px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {accion === "show" || accion === "anular" ? (
                    <Row gutter={[12, 12]} justify="center">
                      <Col span={24}>
                        <Button type="primary" block onClick={handleCancel}>
                          Volver
                        </Button>
                      </Col>
                    </Row>
                  ) : (
                    <Row gutter={[12, 12]} justify="center">
                      <Col span={12}>
                        <Button
                          type="primary"
                          block
                          htmlType="submit"
                          icon={<SaveOutlined />}
                          disabled={
                            selectedProducts.length == 0 || disableButton
                          }
                        >
                          Guardar
                        </Button>
                      </Col>
                      <Col span={12}>
                        <Button block onClick={handleCancel}>
                          Cancelar
                        </Button>
                      </Col>
                    </Row>
                  )}
                  {accion == "anular" ? (
                    <Row gutter={[12, 12]} justify="center">
                      <Col span={12}>
                        <Button
                          htmlType="button"
                          type="primary"
                          danger
                          onClick={anularDocumento}
                        >
                          Anular
                        </Button>
                      </Col>
                    </Row>
                  ) : null}
                </Col>
              </Row>
            </Form>
          ) : (
            <Space style={{ width: "100%", textAlign: "center" }}>
              <Spin size="large" />
            </Space>
          )}
        </StyledCard>
      </Spin>
    </>
  );
};
