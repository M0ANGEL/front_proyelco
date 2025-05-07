/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Bodega, DocumentosCabecera, ProductoLP } from "@/services/types";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { getBodega, getBodegasSebthi } from "@/services/maestras/bodegasAPI";
import { CamposEstados, DataType, DataTypeModalPadre } from "./types";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { KEY_BODEGA, KEY_EMPRESA, KEY_ROL } from "@/config/api";
import {
  StyledFormItem,
  StyledCard,
} from "@/modules/common/layout/DashboardLayout/styled";
import { useEffect, useMemo, useState } from "react";
import Table, { ColumnsType } from "antd/es/table";
import { ModalCambioProducto } from "../../components";
import {
  searchProductsxLP,
  searchTerceros,
} from "@/services/admin-terceros/tercerosAPI";
import { FaExchangeAlt } from "react-icons/fa";
import {
  validarAccesoDocumento,
  cambiarEstadoOtrDoc,
  updateOtrDoc,
  crearOtrDoc,
  getInfoSOB,
  deleteItem,
} from "@/services/documentos/otrosAPI";
import { StyledText } from "./styled";
import {
  QuestionCircleOutlined,
  ArrowLeftOutlined,
  LoadingOutlined,
  DeleteOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  notification,
  InputNumber,
  SelectProps,
  DatePicker,
  Popconfirm,
  Typography,
  Popover,
  Tooltip,
  Button,
  Select,
  Input,
  Space,
  Form,
  Spin,
  Col,
  Row,
} from "antd";

let timeout: ReturnType<typeof setTimeout> | null;
const { Title, Text, Paragraph } = Typography;
const estadosVisibles = ["0", "2"];
const { TextArea } = Input;

export const FormEUN = () => {
  const { getSessionVariable } = useSessionStorage();
  const [selectBodegas, setSelectBodegas] = useState<SelectProps["options"]>(
    []
  );
  const [documentoInfo, setDocumentoInfo] = useState<DocumentosCabecera>();
  const [notificationApi, contextHolder] = notification.useNotification();
  const [camposEstados, setCamposEstados] = useState<CamposEstados[]>();
  const { id, sun_id } = useParams<{ id: string; sun_id: string }>();
  const [flagAcciones, setFlagAcciones] = useState<boolean>(false);
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [productosLP, setProductosLP] = useState<ProductoLP[]>([]);
  const [user_rol] = useState<string>(getSessionVariable(KEY_ROL));
  const [deletingRow, setDeletingRow] = useState<React.Key[]>([]);
  const [openModalCambioProducto, setOpenModalCambioProducto] =
    useState<boolean>(false);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [selectProveedor, setSelectProveedor] = useState<
    SelectProps["options"]
  >([]);
  const [loader, setLoader] = useState<boolean>(true);
  const [accion, setAccion] = useState<string>("");
  const [, setBodegaInfo] = useState<Bodega>();
  const [oldItem, setOldItem] = useState<{
    laboratorio: string;
    cod_padre: string;
    key: React.Key;
  }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const control = useForm({
    mode: "onChange",
    defaultValues: {
      tipo_documento_id: 0,
      detalle: dataSource,
      observacion: "",
      tercero_id: "",
      documento: "",
      bodega_id: 0,
      subtotal: 0,
      sun_id: "",
      total: 0,
      iva: 0,
    },
  });

  useEffect(() => {
    getBodegasSebthi().then(({ data: { data } }) => {
      setSelectBodegas(
        data.map((item) => ({
          value: item.id,
          label: `${item.prefijo} - ${item.bod_nombre}`,
        }))
      );
    });
  }, []);

  useEffect(() => {
    const url_split = location.pathname.split("/");

    const accion =
      id || sun_id
        ? url_split[url_split.length - 2]
        : url_split[url_split.length - 1];

    setAccion(accion);

    const codigo_documento =
      id || sun_id
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
    // Ya que para la creación se requiere una Requisicion de Pedido se captura por medio de la url del create el
    // ID de la Requisicion para consultar el detalle e imprimirlo en el detalle de la Orden de Compra a crear
    if (sun_id && accion == "create") {
      getInfoSOB(sun_id).then(({ data: { data } }) => {
        // setDocumentoInfo(data);
        // Se setea el ID de la Requisicion para enviarlo por medio del formulario de CREACION
        control.setValue("sun_id", data.id.toString());
        control.setValue("observacion", data.observacion);
        control.setValue("tercero_id", data.tercero.nit);

        // Entro al detalle de la Requisicion de Pedido para realizar las validacion necesarias por PRODUCTO
        const detalleSUN: DataType[] = data.detalle
          .map((item) => {
            // let cantidad_pedida = 0;
            // Se valida si el flag de cantidades se encuentra en false, en caso de que asi sea, se setean los calores calculados
            // el ELSE es para filtar los PRODUCTOS que ya fueron pedidos
            // if (!flagCantidades) {
            const maxCant =
              parseInt(item.cantidad) -
              (item.cantidad_retorno == null
                ? 0
                : parseInt(item.cantidad_retorno));
            return {
              key: item.producto.id,
              oldId: 0,
              descripcion: item.producto.descripcion,
              cod_padre: item.producto.cod_padre,
              laboratorio: item.producto.laboratorio,
              cantidad: parseInt("0"),
              maxCantidad: maxCant,
              cantidad_retorno:
                item.cantidad_retorno == null
                  ? 0
                  : parseInt(item.cantidad_retorno),
              iva: parseFloat(item.iva),
              precio_compra: 0,
              precio_subtotal: 0,
              precio_total: 0,
              editable: false,
              editablePrecio: false,
              id: item.producto.id,
              precio_promedio: parseFloat(item.precio_promedio),
              lote: item.lote,
              fvence: dayjs(item.fecha_vencimiento).format("YYYY-MM-DD"),
              precio_iva: parseFloat(item.iva),
              itemFromModal: false,
            };
          })
          // Con este filtro se descartan los productos que ya fueron pedidos en su totalidad
          .filter((item) => item.key != 0);

        setDataSource(detalleSUN);
        control.setValue("detalle", detalleSUN);
      });
    }

    if (id) {
      // Se valida que en la acciones EDIT, SHOW y ANULAR se capture el ID de la Orden de Compra ya creada para consultar su cabecera y detalle
      // e imprimirla en el formulario
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
        setBodegaInfo(data.bodega);
        control.setValue("observacion", data.observacion);
        control.setValue("bodega_id", data.bodega.id);
        form.setFieldValue("fecha", dayjs(data.created_at));

        const detalle: DataType[] = data.detalle.map((item) => {
          const precio_iva =
            parseFloat(item.subtotal) * (parseFloat(item.iva) / 100);
          const precio_total = parseFloat(item.subtotal) + precio_iva;
          return {
            key: item.producto.id,
            id: item.producto.id,
            oldId: 0,
            descripcion: item.producto.descripcion,
            cantidad: parseInt(item.cantidad),
            cantidad_retorno:
              item.cantidad_retorno == null
                ? 0
                : parseInt(item.cantidad_retorno),
            cod_padre: item.producto.cod_padre,
            laboratorio: item.producto.laboratorio,
            precio_promedio: parseFloat(item.precio_promedio),
            lote: item.lote,
            fvence: dayjs(item.fecha_vencimiento).format("YYYY-MM-DD"),
            maxCantidad: parseInt(item.cantidad),
            iva: parseFloat(item.iva),
            precio_iva: precio_iva,
            precio_subtotal: parseFloat(item.subtotal),
            precio_total: precio_total,
            itemFromModal: false,
            cantidad_devolver: item.cantidad,
          };
        });

        // En la consulta se trae la informacion del Proveedor que se escoge en el momento de la creación, pero al momento de editar se puede cambiar
        // el proveeedor, por lo que se necesita añadir valores por defecto al selector de proveedor y asignarle el proveedor que trae la Orden de Compra
        if (data) {
          const option = {
            value: data.tercero.id,
            label: `${data.tercero.nit} - ${data.tercero.razon_soc}`,
          };
          setSelectProveedor([option]);
          control.setValue("tercero_id", data.tercero.nit);
        }
        // let subtotal = 0;
        // let total = 0;
        // Se recorre el detalle de la Orden de Compra para comparar cantidades iniciales de la Requisicion de Pedido y de las Ordenes de Compra
        // que se hayan ingresado anteriormente y encontrar la cantidad máxima a la que se puede modificar.

        control.setValue("detalle", detalle);
        setDataSource(detalle);
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

  // Funcion para realizar el cambio de texto a input en la tabla de detalle, ya sea en cantidades o en el valor
  const handleChangeEdit = (key: React.Key, accion: string) => {
    const newData = [...dataSource];
    const target = newData.find((item) => item.key === key);
    if (target) {
      switch (accion) {
        case "cantidad":
          target.editable = target.editable ? false : true;
          break;
      }
      setDataSource(newData);
    }
  };

  const handleDeleteProducto = (key: React.Key, itemFromModal: boolean) => {
    if (["create"].includes(accion) || itemFromModal) {
      setDataSource(dataSource.filter((item) => item.key != key));
    } else {
      setDeleteLoader(true);
      deleteItem({
        doc_id: id,
        sun_id: documentoInfo?.docu_vinculado_id,
        producto_id: key,
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

  // Funcion para detectar cambios en el input de cantidades y de valor, se captura el valor y se realizan los calculos se subtotal y total
  // en la linea que se está modificando y el subtotal y total del documento.
  const handleChangeAmount = (
    valor: number,
    key: React.Key,
    accion: string
  ) => {
    // Aqui actualiza si o si el arreglo principal
    let subtotal = 0;
    let total = 0;
    const newDataFilter = dataSource.map((item) => {
      let item_subtotal = 0;
      if (accion == "cantidad") {
        item_subtotal = item.precio_promedio * valor;
      } else {
        item_subtotal = item.cantidad * valor;
      }
      const item_total = item_subtotal + item_subtotal * (item.iva / 100);
      if (item.key === key) {
        subtotal += item_subtotal;
        total += item_total;
        if (accion == "cantidad") {
          return {
            ...item,
            cantidad: valor ? valor : 0,
            precio_subtotal: item_subtotal,
            precio_total: item_total,
          };
        } else if (accion == "precio") {
          return {
            ...item,
            precio_compra: valor ? valor : 0,
            precio_subtotal: item_subtotal,
            precio_total: item_total,
          };
        } else {
          return item;
        }
      } else {
        subtotal += item.precio_subtotal;
        total += item.precio_total;
        return item;
      }
    });
    control.setValue("subtotal", subtotal);
    control.setValue("total", total);
    setDataSource(newDataFilter);
    control.setValue("detalle", newDataFilter);
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
      dataIndex: "key",
      key: "key",
      sorter: (a, b) => a.key.toString().localeCompare(b.key.toString()),
      align: "center",
      fixed: "left",
      width: 80,
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
      fixed: "left",
      sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
      render: (
        _,
        { descripcion, cod_padre, key, laboratorio, itemFromModal }
      ) => {
        return (
          <Row>
            <Col span={16}>
              <Popover
                autoAdjustOverflow
                content={descripcion}
                title="Descripción"
                overlayStyle={{
                  width: 500,
                  border: "1px solid #d4d4d4",
                  borderRadius: 10,
                }}
              >
                <Paragraph
                  ellipsis={{ rows: 2, expandable: false }}
                  style={{ marginBottom: 0 }}
                >
                  {descripcion}
                </Paragraph>
              </Popover>
            </Col>
            {["create"].includes(accion) &&
            ["administrador", "usuario", "regente_farmacia"].includes(
              user_rol
            ) &&
            !itemFromModal ? (
              <Col
                span={6}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Tooltip title="Cambiar producto">
                  <Button
                    size="small"
                    type="primary"
                    shape="round"
                    onClick={() => {
                      setOpenModalCambioProducto(true);
                      setOldItem({ cod_padre, key, laboratorio });
                    }}
                    style={{ fontSize: 16 }}
                    disabled={control.getValues("tercero_id") == ""}
                  >
                    <FaExchangeAlt />
                  </Button>
                </Tooltip>
              </Col>
            ) : (
              <></>
            )}
          </Row>
        );
      },
    },
    {
      title: "Cantidad Retornada",
      dataIndex: "cantidad_retorno",
      key: "cantidad_retorno",
      align: "center",
      width: 90,
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
      align: "center",
      width: 130,
      render: (_, { key, cantidad, editable, maxCantidad }) => {
        return (
          <Space direction="vertical">
            {["create"].includes(accion) ? (
              <>
                {editable ? (
                  <>
                    <InputNumber
                      autoFocus
                      size="small"
                      defaultValue={cantidad == 0}
                      onBlur={() => handleChangeEdit(key, "cantidad")}
                      onChange={(e: any) =>
                        handleChangeAmount(e, key, "cantidad")
                      }
                    />
                  </>
                ) : (
                  <StyledText
                    onClick={() => handleChangeEdit(key, "cantidad")}
                    type={cantidad > maxCantidad ? "danger" : undefined}
                  >
                    {cantidad}
                  </StyledText>
                )}

                <Text type="danger" style={{ fontSize: 11 }}>
                  Max: {maxCantidad}
                </Text>
              </>
            ) : (
              <Text> {cantidad}</Text>
            )}
          </Space>
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
            {record.itemFromModal ? ( //["SOB", "AEN"].includes(codigoDocumento) &&
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
            {record.itemFromModal ? ( //["SOB", "AEN"].includes(codigoDocumento)
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
                    // setFlagLote(false);
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

  if (accion == "edit") {
    columns.push({
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      fixed: "right",
      render(_, { key, itemFromModal, cantidad }) {
        return (
          <>
            {accion == "edit" ? (
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

  const anularDocumento = () => {
    const data = {
      doc_id: id,
      sun_id: documentoInfo?.docu_vinculado_id,
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

  // Funcion para buscar el proveedor por medio de un query, esta consulta busca por NIT y nombre del proveedor
  const handleSearchProveedor = (query: string) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (query.length > 0) {
      timeout = setTimeout(() => {
        searchTerceros(query).then(({ data: { data } }) => {
          setSelectProveedor(
            data.map((item) => ({
              value: item.id,
              label: `${item.nit} - ${item.razon_soc}`,
            }))
          );
        });
      }, 500);
    }
  };

  // Esta funcion lo que hace es modificar los valores del precio segun el proveedor seleccionado, en caso de encontrar precios segun la
  // LISTA DE PRECIOS los modifica segun el item, en caso de encontrar el PRODUCTO se setea en CERO (0)
  const handleSelectProveedor = (value: string) => {
    searchProductsxLP(value).then(({ data: { data } }) => {
      setProductosLP(data);
      let subtotal = 0;
      let total = 0;
      const newData = dataSource.map((item) => {
        const productoLP = data
          .filter((producto) => producto.producto_id === item.key.toString())
          .at(0);
        if (productoLP) {
          const item_subtotal = item.cantidad * parseFloat(productoLP.precio);
          const item_total = item_subtotal + item_subtotal * item.iva;
          subtotal += item_subtotal;
          total += item_total;
          return {
            ...item,
            precio_compra: parseFloat(productoLP.precio),
            precio_subtotal: item_subtotal,
            precio_total: item_total,
          };
        } else {
          return {
            ...item,
            precio_compra: 0,
            precio_total: 0,
            precio_subtotal: 0,
          };
        }
      });
      control.setValue("subtotal", subtotal);
      control.setValue("total", total);
      setDataSource(newData);
      control.setValue("detalle", newData);
    });
  };

  const handleSelectProductoPadre = ({
    key,
    cod_padre,
    laboratorio,
    descripcion,
    iva,
  }: DataTypeModalPadre) => {
    let subtotal = 0;
    let total = 0;
    const newData: DataType[] = dataSource.map((item) => {
      if (item.key === oldItem?.key) {
        const productoLP = productosLP.find((item) => item.producto_id == key);
        const precio = productoLP
          ? parseFloat(productoLP.precio)
          : item.precio_promedio > 0
          ? item.precio_promedio
          : 0;
        const ivaValue = productoLP ? parseFloat(productoLP.precio) : iva;
        const precio_subtotal = item.cantidad * precio;
        const precio_iva = precio_subtotal * (ivaValue / 100);
        const precio_total = precio_subtotal + precio_iva;
        subtotal += precio_subtotal;
        total += precio_total;
        let oldId = item.oldId;

        oldId == 0 ? (oldId = parseInt(oldItem.key.toString())) : 0;
        return {
          ...item,
          key,
          oldId,
          cod_padre,
          laboratorio,
          descripcion,
          ivaValue,
          precio_compra: precio,
          precio_subtotal,
          precio_total,
        };
      } else {
        subtotal += item.precio_subtotal;
        total += item.precio_total;
        return item;
      }
    });
    setDataSource(newData);
    control.setValue("detalle", newData);
    control.setValue("subtotal", subtotal);
    control.setValue("total", total);
  };

  const onFinish: SubmitHandler<any> = async (data) => {
    let flagCantidadDetalle = false;
    for (let index = 0; index < data.detalle.length; index++) {
      if (data.detalle[index]["cantidad"] <= 0) {
        flagCantidadDetalle = true;
        notificationApi.open({
          type: "error",
          message: `El producto ${data.detalle[index]["descripcion"]} tiene cantidad menor o igual a cero, por favor ingresa el valor`,
        });
      }

      if (
        data.detalle[index]["maxCantidad"] < data.detalle[index]["cantidad"]
      ) {
        flagCantidadDetalle = true;
        notificationApi.open({
          type: "error",
          message: `El producto ${data.detalle[index]["descripcion"]} supera la cantidad maxima a ingresar, por favor verifique.`,
        });
      }

      if (data.detalle[index]["oldId"] == 0) {
        flagCantidadDetalle = true;
        notificationApi.open({
          type: "error",
          message: `El producto ${data.detalle[index]["descripcion"]}, no se ha realizado cambio de producto, por favor verifique.`,
        });
      }
    }

    if (!flagCantidadDetalle) {
      setLoader(true);
      if (id) {
        updateOtrDoc(data, id)
          .then(() => {
            notificationApi.open({
              type: "success",
              message: `Documento modificado con exito con exito!`,
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

  return (
    <>
      <ModalCambioProducto
        open={openModalCambioProducto}
        setOpen={(value: boolean) => setOpenModalCambioProducto(value)}
        oldItem={oldItem}
        handleSelectProductoPadre={(producto: DataTypeModalPadre) =>
          handleSelectProductoPadre(producto)
        }
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
              Entrada Unidosis{" "}
              {id && documentoInfo ? `- ${documentoInfo?.consecutivo}` : null}
            </Title>
          }
        >
          {contextHolder}
          <Form
            layout={"vertical"}
            form={form}
            onFinish={control.handleSubmit(onFinish)}
          >
            <Row gutter={[12, 6]}>
              <Col span={24}>
                <Row gutter={12}>
                  <Col xs={{ span: 24, order: 2 }} sm={{ span: 6, order: 1 }}>
                    <Controller
                      name="bodega_id"
                      control={control.control}
                      render={({ field }) => (
                        <StyledFormItem label={"Bodega:"}>
                          <Select
                            {...field}
                            defaultActiveFirstOption={false}
                            options={selectBodegas}
                            disabled
                          />
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={{ span: 24, order: 3 }} sm={{ span: 6, order: 2 }}>
                    {/* xs={{ span: 24, order: 3 }} sm={{ span: 6, order: 2 }} */}
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
                          {/* Este Select lo que hace es buscar el proveedor de acuerdo a lo que se digita en el Input, asi mismo alimenta el select 
                        y permite seleccionar un proveedor dentro de los resultados */}
                          <Select
                            {...field}
                            showSearch
                            // showArrow={false}
                            filterOption={false}
                            placeholder={"Buscar proveedor"}
                            onSearch={handleSearchProveedor}
                            onSelect={handleSelectProveedor}
                            notFoundContent={null}
                            options={selectProveedor}
                            status={error && "error"}
                            disabled
                            // {
                            //   id && ["show", "anular"].includes(accion)
                            //     ? true
                            //     : false
                            // }
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col
                    xs={{ span: 24, order: 1 }}
                    sm={{ offset: 6, span: 6, order: 3 }}
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
                  <Col xs={24} sm={6} order={4}>
                    <Controller
                      name="documento"
                      control={control.control}
                      render={({ field }) => (
                        <StyledFormItem label="Documento :">
                          <Input disabled {...field} />
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col span={24} order={5}>
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
                              disabled={
                                accion == "create" || accion == "edit"
                                  ? false
                                  : true
                              }
                              maxLength={500}
                              showCount
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
                  <Col span={24}>
                    <Table
                      rowKey={(record) => record.key}
                      size="small"
                      pagination={{
                        simple: false,
                      }}
                      scroll={{ x: 800 }}
                      bordered
                      dataSource={dataSource}
                      columns={columns}
                    />
                  </Col>
                </Row>
              </Col>
              <Col
                span={24}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Space>
                  <Link to={"../.."} relative="path">
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
