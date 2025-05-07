/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { validarAccesoDocumento } from "@/services/documentos/rqpAPI";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { KEY_BODEGA, KEY_EMPRESA, KEY_ROL } from "@/config/api";
import { getBodega } from "@/services/maestras/bodegasAPI";
import { getInfoOC } from "@/services/documentos/ocAPI";
import {
  StyledFormItem,
  StyledCard,
} from "@/modules/common/layout/DashboardLayout/styled";
import { useEffect, useMemo, useState } from "react";
import { FaExchangeAlt } from "react-icons/fa";
import { ColumnsType } from "antd/es/table";
import { StyledText } from "./styled";
import {
  cambiarEstadoFP,
  crearFP,
  getActa,
  getInfoFP,
  updateFP,
} from "@/services/documentos/fpAPI";
import {
  ArrowLeftOutlined,
  LoadingOutlined,
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  FacturaProveedorCabecera,
  OrdenCompraCabecera,
  OrdenCompraDetalle,
  ProductoLP,
  Bodega,
} from "@/services/types";
import {
  ModalCambioProducto,
  ModalProductosOC,
  TablaExpandida,
  ModalLotes,
  ModalAdicionProductoPadre,
} from "../../components";
import {
  DataTypeModalPadre,
  DataTypeChildren,
  CamposEstados,
  DataType,
} from "./types";
import {
  notification,
  InputNumber,
  DatePicker,
  Typography,
  Tooltip,
  Button,
  Alert,
  Input,
  Space,
  Table,
  Form,
  Spin,
  Col,
  Row,
  Tag,
} from "antd";

const { Title, Text, Paragraph } = Typography;
const estadosVisibles = ["0", "2"];
const { TextArea } = Input;

export const FormFP = () => {
  const [ordenCompraInfo, setOrdenCompraInfo] = useState<OrdenCompraCabecera>();
  const [openModalAdicionProductoPadre, setOpenModalAdicionProductoPadre] =
    useState<boolean>(false);
  const [productosOC, setProductosOC] = useState<OrdenCompraDetalle[]>([]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [camposEstados, setCamposEstados] = useState<CamposEstados[]>();
  const [openModalLote, setOpenModalLote] = useState<boolean>(false);
  const [flagAcciones, setFlagAcciones] = useState<boolean>(false);
  const { id, oc_id } = useParams<{ id: string; oc_id: string }>();
  const [productosLP, setProductosLP] = useState<ProductoLP[]>([]);
  const [ellipsisRow, setEllipsisRow] = useState<React.Key[]>([]);
  const [openModalCambioProducto, setOpenModalCambioProducto] =
    useState<boolean>(false);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [productoId, setProductoId] = useState<React.Key>();
  const [bodegaInfo, setBodegaInfo] = useState<Bodega>();
  const [urlSplit, setUrlSplit] = useState<string[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [loader, setLoader] = useState<boolean>(true);
  const { getSessionVariable } = useSessionStorage();
  const [accion, setAccion] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [user_rol] = useState<string>(getSessionVariable(KEY_ROL));
  const [documentoInfo, setDocumentoInfo] =
    useState<FacturaProveedorCabecera>();
  const [oldItem, setOldItem] = useState<{
    cod_padre: string;
    key: React.Key;
    total_cantidad: number;
  }>();
  const [total, setTotal] = useState<number>(0);
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
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
      temperatura: 0,
      nro_guia: "",
      nro_cajas: 0,
    },
  });

  useEffect(() => {
    const url_split = location.pathname.split("/");
    setUrlSplit(url_split);

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
            // setLoader(false);
          }, 1500);
        }
      });
    }
    // Ya que para la creación de una Orden de Compra se requiere una Requisicion de Pedido se captura por medio de la url del create el
    // ID de la Requisicion para consultar el detalle e imprimirlo en el detalle de la Orden de Compra a crear
    if (oc_id && ["create", "edit"].includes(accion)) {
      getInfoOC(oc_id).then(({ data: { data } }) => {
        // setDocumentoInfo(data);
        // Se setea el ID de la Requisicion para enviarlo por medio del formulario de CREACION
        control.setValue("oc_id", data.id.toString());
        control.setValue("tercero_id", data.tercero_id);
        control.setValue("observacion", data.observacion);
        // control.setValue("bodega_id", parseInt(getSessionVariable(KEY_BODEGA)));
        form.setFieldValue("fecha", dayjs(new Date()));
        setProductosOC(data.detalle);
        // setBodegaInfo(data.bodega);
        if (data.tercero.lista_precios) {
          setProductosLP(data.tercero.lista_precios.detalle);
        }
        setOrdenCompraInfo(data);
        setLoader(false);
      });
    }

    if (id) {
      // Se valida que en la acciones EDIT, SHOW y ANULAR se capture el ID de la Orden de Compra ya creada para consultar su cabecera y detalle
      // e imprimirla en el formulario
      getInfoFP(id).then(({ data: { data } }) => {
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
        setBodegaInfo(data.bodega);
        setProductosOC(data.oc_cabecera.detalle);
        setOrdenCompraInfo(data.oc_cabecera);

        const detalle: DataType[] = data.detalle.map((item) => {
          let total_cantidad = 0;
          let total_ingreso = 0;
          const lotes: DataTypeChildren[] = item.map((linea) => {
            const f_vencimiento = dayjs(linea.fecha_vencimiento).format(
              "DD-MM-YYYY"
            );
            total_cantidad += parseInt(linea.cantidad);
            total_ingreso += parseInt(linea.cantidad);
            return {
              key: `${linea.producto_id}_${linea.lote}_${f_vencimiento}`,
              cantidad: parseInt(linea.cantidad),
              lote: linea.lote,
              f_vencimiento,
              editable: false,
            };
          });
          const producto = item[0];
          return {
            key: producto ? producto.producto_id : "",
            cod_padre: producto ? producto.producto.cod_padre : "",
            descripcion: producto ? producto.producto.descripcion : "",
            editablePrecio: false,
            iva: producto ? parseFloat(producto.iva) : 0,
            precio_compra: producto ? parseFloat(producto.precio_compra) : 0,
            lotes: lotes,
            total_cantidad,
            total_ingreso,
            circular: producto.producto.circular_regulacion,
            p_compra_regulado: parseFloat(producto.producto.p_regulado_compra),
          };
        });
        control.setValue("observacion", data.observacion);
        control.setValue("bodega_id", data.bodega.id);
        form.setFieldValue("fecha", dayjs(data.created_at));

        control.setValue("factura_nro", data.factura_nro);
        control.setValue("temperatura", parseInt(data.temperatura));
        control.setValue("nro_guia", data.nro_guia);
        control.setValue("nro_cajas", parseInt(data.nro_cajas));
        control.setValue("ipoconsumo", parseFloat(data.ipoconsumo));
        control.setValue("subtotal", parseFloat(data.subtotal));
        control.setValue("total", parseFloat(data.total));
        control.setValue("oc_id", data.oc_id);
        control.setValue("tercero_id", data.tercero_id);
        control.setValue("detalle", detalle);
        setDataSource(detalle);
        setLoader(false);
      });
    } else {
      getBodega(getSessionVariable(KEY_BODEGA)).then(({ data: { data } }) => {
        setBodegaInfo(data);
        control.setValue("bodega_id", data.id);
      });
    }
  }, []);

  const calculateTotal = () => {
    let subtotal_general = 0;
    let total_general = 0;
    const newData: DataType[] = control.getValues("detalle").map((producto) => {
      let subtotal_producto = 0;
      let total_producto = 0;
      const valor = producto.precio_compra;
      const iva = producto.iva;
      let cantidad = 0;
      if (producto.lotes.length > 0) {
        producto.lotes.forEach((lote) => {
          cantidad += lote.cantidad;
        });
        subtotal_producto += valor * cantidad;
        total_producto += subtotal_producto * (iva / 100) + subtotal_producto;
      }
      subtotal_general += subtotal_producto;
      total_general += total_producto;
      return { ...producto, precio_total: total_producto };
    });
    control.setValue("detalle", newData);
    total_general += control.getValues("ipoconsumo");
    control.setValue("total", total_general);
    control.setValue("subtotal", subtotal_general);
    setTotal(total_general);
    setSubtotal(subtotal_general);
  };

  useMemo(() => {
    calculateTotal();
  }, [dataSource, control.getValues("ipoconsumo")]);

  const handleSelectProductoPadre = ({
    key,
    cod_padre,
    descripcion,
    iva,
  }: DataTypeModalPadre) => {
    const newData: DataType[] = dataSource.map((item) => {
      if (item.key === oldItem?.key) {
        const cantidad = item.lotes.reduce(
          (accumulator, item) => accumulator + item.cantidad,
          0
        );
        const productoLP = productosLP.find((item) => item.producto_id == key);
        const precio = productoLP
          ? parseFloat(productoLP.precio)
          : item.precio_compra > 0
          ? item.precio_compra
          : 0;
        const ivaValue = productoLP ? parseFloat(productoLP.precio) : iva;
        const precio_subtotal = cantidad * precio;
        const precio_iva = precio_subtotal * (ivaValue / 100);
        const precio_total = precio_subtotal + precio_iva;
        return {
          ...item,
          key,
          cod_padre,
          descripcion,
          precio_compra: precio,
          precio_subtotal,
          precio_total,
        };
      } else {
        return item;
      }
    });
    setDataSource(newData);
    control.setValue("detalle", newData);
  };

  // Esta funcion se usa al seleccionar un producto desde la maestra de productos o desde la ORDEN DE COMPRA
  const handleSelectProducto = (
    producto: OrdenCompraDetalle,
    cantidad_pendiente: number
  ) => {
    if (!dataSource.find((item) => item.key === producto.producto_id)) {
      const data: DataType = {
        key: producto.producto_id,
        descripcion: producto.producto.descripcion,
        total_cantidad: cantidad_pendiente,
        total_ingreso: 0,
        precio_compra: parseFloat(producto.precio_compra),
        cod_padre: producto.producto.cod_padre,
        editablePrecio: false,
        iva: parseFloat(producto.iva),
        lotes: [],
      };
      const newDataSource: DataType[] = [...dataSource, data];
      setDataSource(newDataSource);
      control.setValue("detalle", newDataSource);
      setOpenModalLote(true);
      setProductoId(producto.producto_id);
    } else {
      notificationApi.open({
        type: "error",
        message: `El producto ${producto.producto.descripcion} ya se encuentra en el detalle`,
      });
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
      render: (_, { key, descripcion, cod_padre, total_cantidad }) => {
        return (
          <Row>
            <Col span={["create", "edit"].includes(accion) ? 18 : 24}>
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
            {["create", "edit"].includes(accion) ? (
              <Col
                span={6}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Space direction="horizontal">
                  <Tooltip title="Cambiar producto">
                    <Button
                      size="small"
                      type="primary"
                      shape="round"
                      onClick={() => {
                        setOpenModalCambioProducto(true);
                        setOldItem({ cod_padre, key, total_cantidad });
                      }}
                      style={{ fontSize: 16 }}
                      disabled={control.getValues("tercero_id") == ""}
                    >
                      <FaExchangeAlt />
                    </Button>
                  </Tooltip>
                  {/* {[
                    "administrador",
                    "regente",
                    "cotizaciones",
                    "auxiliar_bodega",
                  ].includes(user_rol) ? ( */}
                  <Tooltip title="Adicionar producto padre">
                    <Button
                      size="small"
                      type="primary"
                      shape="round"
                      onClick={() => {
                        setOpenModalAdicionProductoPadre(true);
                        setOldItem({ cod_padre, key, total_cantidad });
                      }}
                      disabled={control.getValues("tercero_id") == ""}
                    >
                      <PlusOutlined />
                    </Button>
                  </Tooltip>
                  {/* ) : null} */}
                </Space>
              </Col>
            ) : null}
          </Row>
        );
      },
    },
    {
      title: "Orden Compra",
      key: "total_cantidad",
      dataIndex: "total_cantidad",
      align: "center",
      width: 100,
      render: (_, { total_cantidad }) => {
        let alertaOC: string;
        if (total_cantidad > 0) {
          alertaOC = `Cantidad pedida en la OC: ${total_cantidad}`;
        } else {
          alertaOC = `Producto fuera de la OC`;
        }
        return <>{alertaOC}</>;
      },
    },
    {
      title: "Cant. a Ingresar",
      key: "total_ingreso",
      dataIndex: "total_ingreso",
      align: "center",
      width: 200,
      render(_, { total_cantidad, total_ingreso }) {
        const validCantIngreso = total_ingreso > total_cantidad ? true : false;
        return (
          <Space direction="vertical">
            <Tag
              color={validCantIngreso ? "red" : "green"}
              style={{ fontSize: 15 }}
            >
              {total_ingreso}
            </Tag>
            <Text
              type={validCantIngreso ? "danger" : undefined}
              style={{ fontSize: 11 }}
            >
              {validCantIngreso
                ? "La cantidad ingresada excede la pedida en la OC"
                : null}
            </Text>
          </Space>
        );
      },
    },
  ];

  if (
    ["create", "edit", "show"].includes(accion) &&
    ["revisor_compras", "administrador", "quimico"].includes(user_rol)
  ) {
    columns.push({
      title: "Precio Compra",
      key: "precio_compra",
      dataIndex: "precio_compra",
      align: "center",
      width: 200,
      render: (
        _,
        {
          key,
          precio_compra,
          editablePrecio,
          circular = "",
          p_compra_regulado = 0,
        }
      ) => {
        if (!["edit"].includes(accion)) {
          return <>$ {precio_compra.toLocaleString("es-CO")}</>;
        } else {
          return (
            <>
              <Space direction="vertical">
                {editablePrecio ? (
                  <>
                    <Text type="danger" style={{ fontSize: 10 }}>
                      Recordar que el punto (.) es el separador decimal y la
                      coma (,) las milesimas
                    </Text>
                    <InputNumber
                      autoFocus
                      min={0}
                      defaultValue={precio_compra == 0 ? "" : precio_compra}
                      controls={false}
                      formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      size="small"
                      onBlur={() => handleChangeEdit(key)}
                      onChange={(e: any) => handleChangeAmount(e, key)}
                    />
                  </>
                ) : (
                  <StyledText
                    onClick={() => handleChangeEdit(key)}
                    type={
                      ["administrador", "revisor_compras"].includes(user_rol) &&
                      !["0", ""].includes(circular) &&
                      precio_compra > p_compra_regulado
                        ? "danger"
                        : undefined
                    }
                  >
                    $ {precio_compra.toLocaleString("es-CO")}
                  </StyledText>
                )}
                {["administrador", "revisor_compras"].includes(user_rol) &&
                !["0", ""].includes(circular) &&
                precio_compra > p_compra_regulado ? (
                  <Text type="danger" style={{ fontSize: 12 }}>
                    Por encima del precio regulado{" "}
                    <Tag icon={"$ "} color="red">
                      {p_compra_regulado.toLocaleString("es-CO")}
                    </Tag>
                  </Text>
                ) : null}
              </Space>
            </>
          );
        }
      },
    });
  }
  if (
    ["create", "edit", "show"].includes(accion) &&
    [
      "revisor_compras",
      "administrador",
      "quimico",
      "regente",
      "regente_farmacia",
    ].includes(user_rol)
  ) {
    columns.push({
      title: "Subtotal",
      key: "subtotal",
      dataIndex: "subtotal",
      align: "center",
      width: 100,
      render: (_, { precio_compra, lotes }) => {
        const cantidad = lotes.reduce(
          (counter, value) => counter + value.cantidad,
          0
        );
        const subtotal = precio_compra * cantidad;
        return <>$ {subtotal.toLocaleString("es-CO")}</>;
      },
    });
    columns.push({
      title: "Total",
      key: "total",
      dataIndex: "total",
      align: "center",
      width: 100,
      render: (_, { precio_compra, iva, lotes }) => {
        const cantidad = lotes.reduce(
          (counter, value) => counter + value.cantidad,
          0
        );
        const subtotal = precio_compra * cantidad;
        const total = subtotal * (iva / 100) + subtotal;
        return <>$ {total.toLocaleString("es-CO")}</>;
      },
    });
  }

  if (
    ["edit", "create"].includes(accion) &&
    [
      "administrador",
      "usuario",
      "regente",
      "regente_farmacia",
      "quimico",
      "auxiliar_bodega",
    ].includes(user_rol)
  ) {
    columns.push({
      title: "Acciones",
      key: "acciones",
      align: "center",
      width: 100,
      render: (_, record) => {
        return (
          <Space>
            <Button
              type="primary"
              size="small"
              danger
              onClick={() => {
                handleDelete(record.key);
              }}
            >
              <DeleteOutlined />
            </Button>
            <Tooltip title="Añadir Lote">
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  setOpenModalLote(true);
                  setProductoId(record.key);
                }}
              >
                <PlusOutlined />
              </Button>
            </Tooltip>
          </Space>
        );
      },
    });
  }

  const handleChangeEdit = (key: React.Key) => {
    const newData = [...dataSource];
    const target = newData.find((item) => item.key === key);
    if (target) {
      target.editablePrecio = target.editablePrecio ? false : true;
      setDataSource(newData);
    }
  };

  const handleChangeAmount = (valor: number, key: React.Key) => {
    // Aqui actualiza si o si el arreglo principal
    let subtotal = 0;
    let total = 0;
    const newDataFilter = dataSource.map((item) => {
      let item_subtotal = 0;
      item_subtotal = item.precio_compra * valor;

      const item_total = item_subtotal + item_subtotal * item.iva;
      if (item.key === key) {
        subtotal += item_subtotal;
        total += item_total;

        return {
          ...item,
          precio_compra: valor ? valor : 0,
          precio_subtotal: item_subtotal,
          precio_total: item_total,
        };
      } else {
        return item;
      }
    });
    control.setValue("subtotal", subtotal);
    control.setValue("total", total);
    setDataSource(newDataFilter);
    control.setValue("detalle", newDataFilter);
  };

  const handleDelete = (key: React.Key) => {
    const newData = dataSource
      .filter((item) => item.key != key)
      .map((detalle) => {
        let total_ingreso = 0;
        detalle.lotes.forEach((lote) => {
          total_ingreso += lote.cantidad;
        });

        return { ...detalle, total_ingreso };
      });
    setDataSource(newData);
    control.setValue("detalle", newData);
  };

  // Esta funcion se usa para modificar el detalle de lotes por producto en la tabla del detalle y se ejecuta cada que el detalle de lotes
  // por producto sufre una modificacion, ya sea ingresando un nuevo lote o eliminarlo
  const setChildren = (key: React.Key, children: DataTypeChildren[]) => {
    // Se recorre el detalle para saber a que producto se le debe realizar la modificacion de lotes y se realiza una doble iteracion para
    // poder actuaizar el total de la cantidad ingresada
    const newData = dataSource
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
        return { ...item, total_ingreso };
      });

    setDataSource(newData);
    control.setValue("detalle", newData);
  };

  const anularDocumento = () => {
    setLoader(true);
    const data = {
      fp_id: id,
      accion: accion,
    };
    cambiarEstadoFP(data)
      .then(() => {
        notificationApi.open({
          type: "success",
          message: `Se ha anulado el documento con exito!`,
          style: { width: 700 },
        });
        setTimeout(() => {
          navigate(`/${urlSplit[1]}/${urlSplit[2]}/${urlSplit[3]}`);
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
                style: { width: 700 },
              });
            }
          } else {
            notificationApi.open({
              type: "error",
              message: response.data.message,
              style: { width: 700 },
            });
          }

          setLoader(false);
        }
      );
  };

  const onFinish: SubmitHandler<any> = async (data) => {
    let flagLotes = false;
    for (let index = 0; index < data.detalle.length; index++) {
      if (data.detalle[index]["lotes"].length == 0) {
        flagLotes = true;
        notificationApi.open({
          type: "warning",
          message: `El producto ${data.detalle[index]["descripcion"]} no tiene lotes`,
          duration: 5,
        });
      }
    }

    if (!flagLotes) {
      setLoader(true);
      if (id) {
        updateFP(data, id)
          .then(() => {
            notificationApi.open({
              type: "success",
              message: `Documento modificado con exito con exito!`,
            });
            setTimeout(() => {
              navigate(`/${urlSplit[1]}/${urlSplit[2]}/${urlSplit[3]}`);
            }, 800);
            setLoader(false);
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
        crearFP(data)
          .then(({ data: { data } }) => {
            notificationApi.open({
              type: "success",
              message: `Documento creado con exito!`,
            });
            const fp_id = data.id;
            getActa(fp_id)
              .then((data) => {
                const file = new Blob([data.data], { type: "application/pdf" });
                const fileURL = URL.createObjectURL(file);
                notificationApi.open({
                  type: "success",
                  message: "Documento generado con exito!",
                });
                window.open(fileURL);
                setTimeout(() => {
                  navigate(`/${urlSplit[1]}/${urlSplit[2]}/${urlSplit[3]}`);
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
                }
              )
              .finally(() => setLoader(false));
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
                  style: { width: 700 },
                });
              }
              setLoader(false);
            }
          );
      }
    }
  };

  const checkKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") e.preventDefault();
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
      <ModalProductosOC
        open={open}
        setOpen={(value: boolean) => setOpen(value)}
        productosOC={productosOC}
        detalle={dataSource}
        handleSelectProducto={(
          producto: OrdenCompraDetalle,
          cantidad_pendiente: number
        ) => handleSelectProducto(producto, cantidad_pendiente)}
        facturas={ordenCompraInfo?.facturas_abiertas}
      />
      {/* <ModalProductos
        open={openModal}
        setOpen={(value: boolean) => setOpenModal(value)}
        handleSelectProducto={(producto: OrdenCompraDetalle) =>
          handleSelectProducto(producto)
        }
      /> */}
      <ModalCambioProducto
        open={openModalCambioProducto}
        setOpen={(value: boolean) => setOpenModalCambioProducto(value)}
        oldItem={oldItem}
        handleSelectProductoPadre={(producto: DataTypeModalPadre) => {
          if (!dataSource.find((item) => item.key === producto.key)) {
            handleSelectProductoPadre(producto);
          } else {
            notificationApi.open({
              type: "error",
              message: `El producto ${producto.descripcion} ya se encuentra en el detalle`,
            });
          }
        }}
      />
      <ModalAdicionProductoPadre
        open={openModalAdicionProductoPadre}
        setOpen={(value: boolean) => setOpenModalAdicionProductoPadre(value)}
        oldItem={oldItem}
        handleSelectProductoPadre={(
          producto: DataTypeModalPadre,
          total_cantidad: number
        ) => {
          if (!dataSource.find((item) => item.key === producto.key)) {
            const data: DataType = {
              key: producto.key,
              descripcion: producto.descripcion,
              total_cantidad: total_cantidad,
              total_ingreso: 0,
              precio_compra: producto.precio_compra,
              cod_padre: producto.cod_padre,
              editablePrecio: false,
              iva: producto.iva,
              lotes: [],
            };
            const newDataSource: DataType[] = [...dataSource, data];
            setDataSource(newDataSource);
            control.setValue("detalle", newDataSource);
            setOpenModalLote(true);
            setProductoId(producto.key);
          } else {
            notificationApi.open({
              type: "error",
              message: `El producto ${producto.descripcion} ya se encuentra en el detalle`,
            });
          }
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
              Factura de Proveedor{" "}
              {id && documentoInfo ? `- ${documentoInfo?.consecutivo}` : null}
            </Title>
          }
        >
          <Form
            layout={"vertical"}
            form={form}
            onKeyDown={(e: any) => checkKeyDown(e)}
            onFinish={control.handleSubmit(onFinish)}
          >
            <Row gutter={[12, 6]}>
              <Col span={24}>
                <Row gutter={12}>
                  {ordenCompraInfo?.distribucion_id ? (
                    <Col xs={24} sm={24}>
                      <Alert
                        banner
                        type="info"
                        message={
                          "Esta factura hace parte de una distribución de compra."
                        }
                      />
                    </Col>
                  ) : null}
                  <Col
                    xs={{ span: 24 }}
                    sm={{
                      offset: 16,
                      span: 8,
                    }}
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
                  <Col xs={24} md={3}>
                    <StyledFormItem label={"Bodega:"}>
                      <Input disabled value={bodegaInfo?.bod_nombre} />
                    </StyledFormItem>
                  </Col>
                  <Col xs={24} md={5}>
                    <StyledFormItem label={"Orden de Compra:"}>
                      <Input
                        disabled
                        value={
                          ordenCompraInfo
                            ? ordenCompraInfo?.consecutivo
                            : documentoInfo?.oc_cabecera.consecutivo
                        }
                      />
                    </StyledFormItem>
                  </Col>
                  <Col xs={24} md={6}>
                    <StyledFormItem label={"Proveedor:"}>
                      <Input
                        disabled
                        value={
                          ordenCompraInfo
                            ? ordenCompraInfo?.tercero.nit +
                              " - " +
                              ordenCompraInfo?.tercero.razon_soc
                            : documentoInfo?.tercero.nit +
                              " - " +
                              documentoInfo?.tercero.razon_soc
                        }
                      />
                    </StyledFormItem>
                  </Col>
                  <Col xs={24} md={6}>
                    <Controller
                      name="factura_nro"
                      control={control.control}
                      rules={{
                        required: {
                          value: true,
                          message: "Nro. Factura es requerido",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem label={"Nro. Factura:"} required>
                          <Input
                            {...field}
                            maxLength={20}
                            placeholder="Nro. Factura"
                            status={error && "error"}
                            disabled={
                              id
                                ? [
                                    "regente",
                                    "regente_farmacia",
                                    "quimico",
                                    "auxiliar_bodega",
                                  ].includes(user_rol)
                                  ? true
                                  : ["show", "anular"].includes(accion)
                                  ? true
                                  : false
                                : false
                            }
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={24} md={4}>
                    <Controller
                      name="ipoconsumo"
                      control={control.control}
                      rules={{
                        required: {
                          value: true,
                          message: "Domicilio es requerido",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem label={"Domicilio:"} required>
                          <InputNumber
                            {...field}
                            placeholder="Domicilio o Ipoconsumo"
                            min={0}
                            controls={false}
                            formatter={(value) =>
                              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                            style={{ width: "100%" }}
                            status={error && "error"}
                            onChange={(e: any) => {
                              control.setValue("ipoconsumo", e ? e : 0);
                              calculateTotal();
                            }}
                            disabled={
                              id
                                ? [
                                    "regente",
                                    "regente_farmacia",
                                    "quimico",
                                    "auxiliar_bodega",
                                  ].includes(user_rol)
                                  ? true
                                  : ["show", "anular"].includes(accion)
                                  ? true
                                  : false
                                : false
                            }
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={24} md={4}>
                    <Controller
                      name="temperatura"
                      control={control.control}
                      rules={{
                        required: {
                          value: true,
                          message: "Temperatura es requerido",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem label={"Temperatura:"} required>
                          <InputNumber
                            {...field}
                            placeholder="Temperatura"
                            min={0}
                            controls={false}
                            style={{ width: "100%", textAlign: "end" }}
                            status={error && "error"}
                            addonAfter="°C"
                            onChange={(e: any) => {
                              control.setValue("temperatura", e ? e : 0);
                            }}
                            disabled={
                              ["show", "anular"].includes(accion)
                                ? true
                                : [
                                    "regente",
                                    "regente_farmacia",
                                    "quimico",
                                    "auxiliar_bodega",
                                    "revisor_compras",
                                  ].includes(user_rol)
                                ? false
                                : ["show", "anular"].includes(accion)
                                ? true
                                : false

                              // id
                              //   ? [
                              //       "regente",
                              //       "regente_farmacia",
                              //       "quimico",
                              //       "auxiliar_bodega",
                              //     ].includes(user_rol)
                              //     ? false
                              //     : ["show", "anular"].includes(accion)
                              //     ? true
                              //     : true
                              //   : false
                            }
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={24} md={8}>
                    <Controller
                      name="nro_guia"
                      control={control.control}
                      rules={{
                        required: {
                          value: true,
                          message: "Nro. Guía es requerido",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem label={"Nro. Guía:"} required>
                          <Input
                            {...field}
                            maxLength={30}
                            placeholder="Nro. Guía"
                            status={error && "error"}
                            disabled={
                              ["show", "anular"].includes(accion)
                                ? true
                                : [
                                    "regente",
                                    "regente_farmacia",
                                    "quimico",
                                    "auxiliar_bodega",
                                    "revisor_compras",
                                  ].includes(user_rol)
                                ? false
                                : ["show", "anular"].includes(accion)
                                ? true
                                : false

                              // id
                              //   ? [
                              //       "regente",
                              //       "regente_farmacia",
                              //       "quimico",
                              //       "auxiliar_bodega",
                              //     ].includes(user_rol)
                              //     ? false
                              //     : ["show", "anular"].includes(accion)
                              //     ? true
                              //     : true
                              //   : false
                            }
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={24} md={4}>
                    <Controller
                      name="nro_cajas"
                      control={control.control}
                      rules={{
                        required: {
                          value: true,
                          message: "Número Cajas es requerido",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem label={"Número Cajas:"} required>
                          <InputNumber
                            {...field}
                            placeholder="Número Cajas"
                            min={0}
                            controls={false}
                            style={{ width: "100%", textAlign: "end" }}
                            status={error && "error"}
                            onChange={(e: any) => {
                              control.setValue("nro_cajas", e ? e : 0);
                            }}
                            disabled={
                              ["show", "anular"].includes(accion)
                                ? true
                                : [
                                    "regente",
                                    "regente_farmacia",
                                    "quimico",
                                    "auxiliar_bodega",
                                    "revisor_compras",
                                  ].includes(user_rol)
                                ? false
                                : ["show", "anular"].includes(accion)
                                ? true
                                : false

                              // id
                              //   ? [
                              //       "regente",
                              //       "regente_farmacia",
                              //       "quimico",
                              //       "auxiliar_bodega",
                              //     ].includes(user_rol)
                              //     ? false
                              //     : ["show", "anular"].includes(accion)
                              //     ? true
                              //     : true
                              //   : false
                            }
                          />
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
                              placeholder="Observación:"
                              status={error && "error"}
                              autoSize={{ minRows: 4, maxRows: 6 }}
                              maxLength={250}
                              showCount
                              disabled={
                                id
                                  ? [
                                      "regente",
                                      "regente_farmacia",
                                      "quimico",
                                      "auxiliar_bodega",
                                    ].includes(user_rol)
                                    ? true
                                    : ["show", "anular"].includes(accion)
                                    ? true
                                    : false
                                  : false
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
              <Col span={24} style={{ marginTop: 15 }}>
                <Row gutter={[12, 12]}>
                  {["create", "edit"].includes(accion) &&
                  [
                    "administrador",
                    "usuario",
                    "regente",
                    "regente_farmacia",
                    "quimico",
                    "auxiliar_bodega",
                  ].includes(user_rol) ? (
                    <>
                      {/* <Col
                        sm={{ offset: 12, span: 6 }}
                        xs={{ span: 24 }}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <Button
                          type="primary"
                          htmlType="button"
                          block
                          icon={<PlusOutlined />}
                          onClick={() => setOpenModal(true)}
                          // disabled={["revisor_compras", "administrador"].includes(user_rol)}
                        >
                          Agregar desde Productos
                        </Button>
                      </Col> */}
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
                          // disabled={["revisor_compras", "administrador"].includes(user_rol)}
                        >
                          Agregar desde OC
                        </Button>
                      </Col>
                    </>
                  ) : null}
                  <Col span={24}>
                    <Table
                      className="expanded-table"
                      rowKey={(record) => record.key}
                      size="small"
                      scroll={{ y: 700 }}
                      pagination={{
                        simple: false,
                      }}
                      bordered
                      dataSource={dataSource}
                      columns={columns}
                      expandable={{
                        expandedRowRender: (record) => {
                          return (
                            <TablaExpandida
                              data={record.lotes}
                              setChildren={(children: DataTypeChildren[]) =>
                                setChildren(record.key, children)
                              }
                              accion={accion}
                            />
                          );
                        },
                        defaultExpandedRowKeys: ["1"],
                      }}
                      summary={() => (
                        <>
                          {["edit", "show", "create"].includes(accion) &&
                          [
                            "revisor_compras",
                            "administrador",
                            "regente",
                            "regente_farmacia",
                            "quimico",
                            "auxiliar_bodega",
                          ].includes(user_rol) ? (
                            <Table.Summary fixed>
                              <Table.Summary.Row>
                                <Table.Summary.Cell
                                  index={-2}
                                  colSpan={
                                    ["edit", "create"].includes(accion) &&
                                    ![
                                      "revisor_compras",
                                      "administrador",
                                      "regente",
                                      "regente_farmacia",
                                      "quimico",
                                      "auxiliar_bodega",
                                    ].includes(user_rol)
                                      ? 5
                                      : 7
                                  }
                                  align="right"
                                >
                                  <Text strong style={{ fontSize: 12 }}>
                                    Subtotal:
                                  </Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={-2} align="center">
                                  <Text strong style={{ fontSize: 12 }}>
                                    $ {subtotal.toLocaleString("es-CO")}
                                  </Text>
                                </Table.Summary.Cell>
                              </Table.Summary.Row>
                              <Table.Summary.Row>
                                <Table.Summary.Cell
                                  index={-2}
                                  colSpan={
                                    ["edit", "create"].includes(accion) &&
                                    ![
                                      "revisor_compras",
                                      "administrador",
                                      "regente",
                                      "regente_farmacia",
                                      "quimico",
                                      "auxiliar_bodega",
                                    ].includes(user_rol)
                                      ? 5
                                      : 7
                                  }
                                  align="right"
                                >
                                  <Text strong style={{ fontSize: 12 }}>
                                    Domicilio:
                                  </Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={-2} align="center">
                                  <Text strong style={{ fontSize: 12 }}>
                                    ${" "}
                                    {control
                                      .getValues("ipoconsumo")
                                      .toLocaleString("es-CO")}
                                  </Text>
                                </Table.Summary.Cell>
                              </Table.Summary.Row>
                              <Table.Summary.Row>
                                <Table.Summary.Cell
                                  index={-2}
                                  colSpan={
                                    ["edit", "create"].includes(accion) &&
                                    ![
                                      "revisor_compras",
                                      "administrador",
                                      "regente",
                                      "regente_farmacia",
                                      "quimico",
                                      "auxiliar_bodega",
                                    ].includes(user_rol)
                                      ? 5
                                      : 7
                                  }
                                  align="right"
                                >
                                  <Text strong style={{ fontSize: 12 }}>
                                    IVA:
                                  </Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={-2} align="center">
                                  <Text strong style={{ fontSize: 12 }}>
                                    ${" "}
                                    {(
                                      total -
                                      subtotal -
                                      control.getValues("ipoconsumo")
                                    ).toLocaleString("es-CO")}
                                  </Text>
                                </Table.Summary.Cell>
                              </Table.Summary.Row>
                              <Table.Summary.Row>
                                <Table.Summary.Cell
                                  index={-2}
                                  colSpan={
                                    ["edit", "create"].includes(accion) &&
                                    ![
                                      "revisor_compras",
                                      "administrador",
                                      "regente",
                                      "regente_farmacia",
                                      "quimico",
                                      "auxiliar_bodega",
                                    ].includes(user_rol)
                                      ? 5
                                      : 7
                                  }
                                  align="right"
                                >
                                  <Text strong style={{ fontSize: 12 }}>
                                    Total:
                                  </Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={-2} align="center">
                                  <Text strong style={{ fontSize: 12 }}>
                                    $ {total.toLocaleString("es-CO")}
                                  </Text>
                                </Table.Summary.Cell>
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
                  <Button
                    type="primary"
                    icon={<ArrowLeftOutlined />}
                    danger
                    onClick={() =>
                      navigate(`/${urlSplit[1]}/${urlSplit[2]}/${urlSplit[3]}`)
                    }
                  >
                    Volver
                  </Button>
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
