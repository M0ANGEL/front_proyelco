/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { KEY_BODEGA, KEY_EMPRESA, KEY_ROL } from "@/config/api";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import {
  getInfoRQP,
  validarAccesoDocumento,
} from "@/services/documentos/rqpAPI";
import { useEffect, useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  CamposEstados,
  DataType,
  DataTypeModalPadre,
  DataTypeModalProductos,
} from "./types";
import {
  Alert,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Popover,
  Row,
  Select,
  SelectProps,
  Space,
  Spin,
  Tag,
  Tooltip,
  Typography,
  notification,
} from "antd";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getBodega, getBodegasSebthi } from "@/services/maestras/bodegasAPI";
import { OrdenCompraCabecera, ProductoLP, Rqp } from "@/services/types";
import Table, { ColumnsType } from "antd/es/table";
import {
  DeleteOutlined,
  LoadingOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  StyledCard,
  StyledFormItem,
} from "@/modules/common/layout/DashboardLayout/styled";
import {
  searchProductsxLP,
  searchTerceros,
} from "@/services/admin-terceros/tercerosAPI";
import { StyledText } from "../../components/ModalProductos/styled";
import {
  cambiarEstadoOC,
  crearOC,
  getInfoOC,
  updateOC,
} from "@/services/documentos/ocAPI";
import dayjs from "dayjs";
import { FaExchangeAlt } from "react-icons/fa";
import { ModalCambioProducto, ModalProductos } from "../../components";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const estadosVisibles = ["0", "2"];

let timeout: ReturnType<typeof setTimeout> | null;

export const FormOC = () => {
  const [selectBodegas, setSelectBodegas] = useState<SelectProps["options"]>(
    []
  );
  const [selectProveedor, setSelectProveedor] = useState<
    SelectProps["options"]
  >([]);
  const [productosLP, setProductosLP] = useState<ProductoLP[]>([]);
  const [camposEstados, setCamposEstados] = useState<CamposEstados[]>();
  const [flagAcciones, setFlagAcciones] = useState<boolean>(false);
  const [documentoInfo, setDocumentoInfo] = useState<OrdenCompraCabecera>();
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loader, setLoader] = useState<boolean>(true);
  const [loaderLP, setLoaderLP] = useState<boolean>(false);
  const [rqpInfo, setRqpInfo] = useState<Rqp>();
  const { getSessionVariable } = useSessionStorage();
  const [user_rol] = useState<string>(getSessionVariable(KEY_ROL));
  const [accion, setAccion] = useState<string>("");
  const { id, rqp_id } = useParams<{ id: string; rqp_id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [openModalCambioProducto, setOpenModalCambioProducto] =
    useState<boolean>(false);
  const [openModalProductos, setOpenModalProductos] = useState<boolean>(false);
  const [tipoPorcentaje, setTipokPorcentaje] = useState<string>("");
  const [oldItem, setOldItem] = useState<{
    cod_padre: string;
    key: React.Key;
  }>();
  // Se inicializan las variables que van dentro del formulario de cabecera y el detalle para posteriormente hacer el manejo de la información
  // que será enviada según la accion a realizar
  const control = useForm({
    mode: "onChange",
    defaultValues: {
      subtotal: 0,
      total: 0,
      detalle: dataSource,
      tipo_documento_id: 0,
      rqp_id: "",
      bodega_id: 0,
      bod_destino: 0,
      tercero_id: "",
      observacion: "",
      domicilio: 0,
      porc_descuento: 0,
      total_descuento: 0,
    },
  });
  const watchPorcDescuento = control.watch("porc_descuento");

  useMemo(() => {
    const porcentaje_detalle = dataSource.reduce(
      (accumulator, item) => accumulator + item.porc_descuento,
      0
    );
    if (watchPorcDescuento > 0) {
      setTipokPorcentaje("cabecera");
      let subtotal = 0;
      let total = 0;
      let descuento = 0;
      dataSource.forEach((item) => {
        subtotal += item.precio_subtotal;
        total +=
          item.precio_total -
          item.precio_subtotal * (control.getValues("porc_descuento") / 100);
        descuento +=
          item.precio_subtotal * (control.getValues("porc_descuento") / 100);
      });
      control.setValue("subtotal", subtotal);
      control.setValue("total", total);
      control.setValue("total_descuento", descuento);
    } else if (porcentaje_detalle > 0) {
      setTipokPorcentaje("detalle");
    } else {
      setTipokPorcentaje("");
      let subtotal = 0;
      let total = 0;
      let descuento = 0;
      dataSource.forEach((item) => {
        subtotal += item.precio_subtotal;
        total += item.precio_total;
        descuento += item.total_descuento;
      });
      control.setValue("subtotal", subtotal);
      control.setValue("total", total);
      control.setValue("total_descuento", descuento);
    }
  }, [watchPorcDescuento, dataSource]);

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
      id || rqp_id
        ? url_split[url_split.length - 2]
        : url_split[url_split.length - 1];

    setAccion(accion);

    const codigo_documento =
      id || rqp_id
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
    // Ya que para la creación de una Orden de Compra se requiere una Requisicion de Pedido se captura por medio de la url del create el
    // ID de la Requisicion para consultar el detalle e imprimirlo en el detalle de la Orden de Compra a crear
    if (rqp_id && accion == "create") {
      getInfoRQP(rqp_id).then(({ data: { data } }) => {
        setRqpInfo(data);
        // Se setea el ID de la Requisicion para enviarlo por medio del formulario de CREACION
        control.setValue("rqp_id", data.id.toString());
        control.setValue("observacion", data.observacion);

        // Entro al detalle de la Requisicion de Pedido para realizar las validacion necesarias por PRODUCTO
        const detalleRQP: DataType[] = data.detalle
          .map((item) => {
            let cantidad_pedida = 0;
            let flagCantidades = false;
            let cantidad_restante = 0;
            // Valida si la Requisicion de Pedido tiene ordenes de compra creadas para hallar la cantidades pendientes por item
            if (data.ordenes_compra.length > 0) {
              // En caso de tener ordenes de compra, verifico en el detalle de cada una el PRODCUTO que estoy recorriendo
              // del detalle de la Requisicion de Pedido, y se filtran las ordenes de compra que no tenga estado 3 (Cerrado) o 4 (Anulado) para
              // no contarlas como activas
              data.ordenes_compra
                .filter((orden) => !["4"].includes(orden.estado))
                .forEach((orden_compra) => {
                  const producto = orden_compra.detalle
                    .filter(
                      (product) =>
                        product.producto_id == item.producto_id ||
                        product.producto.cod_padre == item.producto.cod_padre
                    )
                    .at(0);
                  // Si encentra la coincidencia por PRODUCTO_ID va sumando la cantidad pedida en cada ORDEN DE COMPRA
                  if (producto) {
                    cantidad_pedida += parseFloat(producto.cantidad);
                  }
                });
              // Se valida que la cantidad pedida hallada en la iteracion de las ORDENES DE COMPRA sea igual a la cantidad de la
              // REQUISICION DE PEDIDO, en caso de ser igual se setea un flag para controlar el producto en el detalle de la ORDEN DE COMPRA
              if (cantidad_pedida >= parseFloat(item.cantidad)) {
                flagCantidades = true;
              } else {
                // Si se encuentra que la cantidad pedida es menor se realiza el calculo de la cantidad restante para validar cantidades en
                // el detalle de la ORDEN DE COMPRA
                cantidad_restante = parseFloat(item.cantidad) - cantidad_pedida;
              }
            } else {
              // En caso de no existir ORDENES DE COMPRA en la REQUISICION DE PEDIDO se asigna que la cantidad restante sigue siento
              // la cantidad pedida en la REQUISICION
              cantidad_pedida = parseFloat(item.cantidad);
              cantidad_restante = parseFloat(item.cantidad);
            }
            // Se valida si el flag de cantidades se encuentra en false, en caso de que asi sea, se setean los calores calculados
            // el ELSE es para filtar los PRODUCTOS que ya fueron pedidos
            if (!flagCantidades) {
              return {
                key: item.producto.id,
                descripcion: item.producto.descripcion,
                cod_padre: item.producto.cod_padre,
                cantidad: cantidad_restante,
                maxCantidad: cantidad_restante,
                iva: parseFloat("0" + item.producto.ivas.iva),
                precio_compra: 0,
                precio_subtotal: 0,
                porc_descuento: 0,
                total_descuento: 0,
                precio_total: 0,
                p_regulado_compra: parseFloat(item.producto.p_regulado_compra),
                editable: false,
                editablePrecio: false,
                editableDescuento: false,
              };
            } else {
              return {
                key: 0,
                descripcion: "",
                cod_padre: "",
                cantidad: 0,
                maxCantidad: 0,
                iva: 0,
                precio_compra: 0,
                precio_subtotal: 0,
                porc_descuento: 0,
                total_descuento: 0,
                precio_total: 0,
                p_regulado_compra: 0,
                editable: false,
                editablePrecio: false,
                editableDescuento: false,
              };
            }
          })
          // Con este filtro se descartan los productos que ya fueron pedidos en su totalidad
          .filter((item) => item.key != 0);

        setDataSource(detalleRQP);
        control.setValue("detalle", detalleRQP);
      });
    }

    if (id) {
      // Se valida que en la acciones EDIT, SHOW y ANULAR se capture el ID de la Orden de Compra ya creada para consultar su cabecera y detalle
      // e imprimirla en el formulario
      getInfoOC(id).then(({ data: { data } }) => {
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
            if (estado == "anulado") {
              notificationApi.open({
                type: "error",
                message: `Este documento se encuentra ${estado}, no es posible realizar modificaciones, solo consulta.`,
              });
            } else {
              notificationApi.open({
                type: "error",
                message: `Este documento tiene facturas ingresadas, no es posible realizar modificaciones, solo consulta.`,
              });
            }
            setTimeout(() => {
              navigate(
                `/${url_split.at(1)}/${url_split.at(2)}/${codigo_documento}`
              );
            }, 2500);
            return;
          }
        }
        control.setValue("observacion", data.observacion);
        control.setValue("domicilio", parseFloat(data.domicilio));
        control.setValue("porc_descuento", parseInt(data.porc_descuento));
        control.setValue("bodega_id", data.bodega.id);
        control.setValue(
          "bod_destino",
          data.bodega_destino ? data.bodega_destino.id : data.bodega.id
        );
        form.setFieldValue("fecha", dayjs(data.created_at));

        // En la consulta se trae la informacion del Proveedor que se escoge en el momento de la creación, pero al momento de editar se puede cambiar
        // el proveeedor, por lo que se necesita añadir valores por defecto al selector de proveedor y asignarle el proveedor que trae la Orden de Compra
        if (data) {
          const option = {
            value: data.tercero_id,
            label: `${data.tercero.nit} - ${data.tercero.razon_soc}`,
          };
          setSelectProveedor([option]);
          control.setValue("tercero_id", data.tercero_id);
        }
        let subtotal = 0;
        let total = 0;
        // Se recorre el detalle de la Orden de Compra para comparar cantidades iniciales de la Requisicion de Pedido y de las Ordenes de Compra
        // que se hayan ingresado anteriormente y encontrar la cantidad máxima a la que se puede modificar.
        const detalle: DataType[] = data.detalle.map((item) => {
          // Se encuentra la informacion del item almacenado en el detalle de la Requisicion de Pedido para encontrar la cantidad máxima inicial
          const rqp_item_detalle = data.rqp_cabecera.detalle
            .filter((rqp_item) => rqp_item.producto_id === item.producto_id)
            .at(0);
          // Se asigna la cantidad máxima de acuerdo a la información de la Requisicion, la validacion que hace es porque el valor puede que sea
          // indefinido, pero lo normal es que siempre se tenga referenciada la Requisicion en las Ordenes de Compra
          let maxCantidad = rqp_item_detalle
            ? parseFloat(rqp_item_detalle?.cantidad)
            : 0;
          // Se busca el producto dentro del detalle de cada Orden de Compra creada y se va restando las cantidades  a la cantidad máxima por pedir,
          // esto se hace condicionando que el producto de cada detalle coincida con el producto iterado
          if (data.rqp_cabecera) {
            data.rqp_cabecera.ordenes_compra
              .filter((orden) => !["3", "4"].includes(orden.estado))
              .forEach((orden) => {
                orden.detalle.forEach((oc_item) => {
                  if (oc_item.producto_id === item.producto_id) {
                    maxCantidad -= parseFloat(oc_item.cantidad);
                  }
                });
              });
          }

          const precio_compra = parseFloat(item.precio_compra);
          const precio_subtotal =
            parseFloat(item.precio_compra) * parseFloat(item.cantidad);
          const precio_total = parseFloat(item.precio_total);

          subtotal += precio_subtotal;
          total += precio_total;
          return {
            key: item.producto_id,
            descripcion: item.producto.descripcion,
            cod_padre: item.producto.cod_padre,
            cantidad: parseFloat(item.cantidad),
            maxCantidad: maxCantidad + parseFloat(item.cantidad),
            editable: false,
            editablePrecio: false,
            editableDescuento: false,
            iva: parseFloat(item.iva),
            precio_compra,
            precio_subtotal,
            precio_total,
            porc_descuento: parseInt(item.porc_descuento),
            total_descuento: parseFloat(item.total_descuento),
            p_regulado_compra: parseFloat(item.producto.p_regulado_compra),
          };
        });
        control.setValue("subtotal", subtotal);
        control.setValue("total", total);
        control.setValue("detalle", detalle);
        control.setValue("rqp_id", data.rqp_id);
        setDataSource(detalle);
        setLoader(false);
      });
    } else {
      getBodega(getSessionVariable(KEY_BODEGA)).then(({ data: { data } }) => {
        control.setValue("bodega_id", data.id);
        control.setValue("bod_destino", data.id);
        form.setFieldValue("fecha", dayjs(new Date()));
        setLoader(false);
      });
    }
  }, [id]);

  // Funcion para eliminar el item del detalle, es decir, del arreglo y se recalcula el subtotal y total del documento
  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key != key);
    let total = 0;
    let subtotal = 0;
    setDataSource(newData);
    newData.forEach((item) => {
      subtotal += item.precio_subtotal;
      total += item.precio_total;
    });
    control.setValue("detalle", newData);
    control.setValue("subtotal", subtotal);
    control.setValue("total", total);
  };

  // Funcion para realizar el cambio de texto a input en la tabla de detalle, ya sea en cantidades o en el valor
  const handleChangeEdit = (key: React.Key, accion: string) => {
    const newData = [...dataSource];
    const target = newData.find((item) => item.key === key);
    if (target) {
      switch (accion) {
        case "cantidad":
          target.editable = target.editable ? false : true;
          break;
        case "precio":
          target.editablePrecio = target.editablePrecio ? false : true;
          break;
        case "descuento":
          target.editableDescuento = target.editableDescuento ? false : true;
          break;
      }
      setDataSource(newData);
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
    let descuento = 0;
    const newDataFilter = dataSource.map((item) => {
      let item_subtotal = 0;
      let item_descuento = item.total_descuento;
      switch (accion) {
        case "cantidad":
          item_subtotal = item.precio_compra * valor;
          item_descuento = item_subtotal * (item.porc_descuento / 100);
          break;
        case "precio":
          item_subtotal = item.cantidad * valor;
          item_descuento = item_subtotal * (item.porc_descuento / 100);
          break;
        case "descuento":
          item_subtotal = item.cantidad * item.precio_compra;
          item_descuento = item_subtotal * (valor / 100);
          break;
      }
      const item_total =
        item_subtotal - item_descuento + item_subtotal * (item.iva / 100);
      if (item.key === key) {
        subtotal += item_subtotal;
        total += item_total;
        descuento += item_descuento;
        if (accion == "cantidad") {
          return {
            ...item,
            cantidad: valor ? valor : 0,
            total_descuento: item_descuento,
            precio_subtotal: item_subtotal,
            precio_total: item_total,
          };
        } else if (accion == "precio") {
          return {
            ...item,
            precio_compra: valor ? valor : 0,
            total_descuento: item_descuento,
            precio_subtotal: item_subtotal,
            precio_total: item_total,
          };
        } else if (accion == "descuento") {
          return {
            ...item,
            porc_descuento: valor ? valor : 0,
            total_descuento: item_descuento,
            precio_subtotal: item_subtotal,
            precio_total: item_total,
          };
        } else {
          return item;
        }
      } else {
        subtotal += item.precio_subtotal;
        total += item.precio_total;
        descuento += item.total_descuento;
        return item;
      }
    });
    control.setValue("subtotal", subtotal);
    control.setValue("total", total);
    control.setValue("total_descuento", descuento);
    setDataSource(newDataFilter);
    control.setValue("detalle", newDataFilter);
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
      width: 400,
      sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
      render: (_, { descripcion, cod_padre, key, p_regulado_compra }) => {
        return (
          <Row>
            <Col span={18}>
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
                  style={{ marginBottom: 0, fontSize: 11 }}
                >
                  {descripcion}
                </Paragraph>
              </Popover>
              {p_regulado_compra > 0 ? (
                <Tag color="volcano">Producto regulado</Tag>
              ) : null}
            </Col>
            {["create", "edit"].includes(accion) &&
            ["administrador", "usuario", "compras"].includes(user_rol) ? (
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
                      setOldItem({ cod_padre, key });
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
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
      align: "center",
      width: 130,
      render: (_, { key, cantidad, editable, maxCantidad }) => {
        return (
          <Space direction="vertical">
            {["create", "edit"].includes(accion) ? (
              <>
                {editable ? (
                  <>
                    <InputNumber
                      autoFocus
                      size="small"
                      defaultValue={cantidad == 0 ? "" : cantidad}
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
      title: "Valor",
      dataIndex: "precio_compra",
      key: "precio_compra",
      align: "center",
      width: 130,
      render: (
        _,
        { key, precio_compra, editablePrecio, p_regulado_compra }
      ) => {
        return (
          <>
            {["create", "edit"].includes(accion) ? (
              <>
                {editablePrecio ? (
                  <>
                    <InputNumber
                      autoFocus
                      size="small"
                      defaultValue={precio_compra == 0 ? null : precio_compra}
                      min={0}
                      max={p_regulado_compra > 0 ? p_regulado_compra : false}
                      formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      onBlur={() => handleChangeEdit(key, "precio")}
                      onChange={(e: any) =>
                        handleChangeAmount(e, key, "precio")
                      }
                    />
                  </>
                ) : (
                  <Space direction="vertical">
                    <Spin
                      size="small"
                      indicator={<LoadingOutlined spin />}
                      spinning={loaderLP}
                    >
                      <StyledText
                        onClick={() => handleChangeEdit(key, "precio")}
                        type={precio_compra == 0 ? "danger" : undefined}
                      >
                        <Tag color={precio_compra == 0 ? "red" : "green"}>
                          $ {precio_compra.toLocaleString("es-ES")}
                        </Tag>
                      </StyledText>
                    </Spin>
                    {p_regulado_compra > 0 ? (
                      <Text style={{ fontSize: 11, color: "red" }}>
                        Valor máx: $ {p_regulado_compra.toLocaleString("es-ES")}
                      </Text>
                    ) : null}
                  </Space>
                )}
              </>
            ) : (
              <Text>$ {precio_compra.toLocaleString("es-ES")}</Text>
            )}
          </>
        );
      },
    },
    {
      title: "Descuento",
      dataIndex: "porc_descuento",
      key: "porc_descuento",
      align: "center",
      width: 130,
      render: (_, { key, porc_descuento, editableDescuento }) => {
        return (
          <>
            {["create", "edit"].includes(accion) &&
            tipoPorcentaje != "cabecera" ? (
              <>
                {editableDescuento ? (
                  <>
                    <InputNumber
                      autoFocus
                      size="small"
                      defaultValue={porc_descuento == 0 ? 0 : porc_descuento}
                      min={0}
                      max={100}
                      onBlur={() => handleChangeEdit(key, "descuento")}
                      onChange={(e: any) =>
                        handleChangeAmount(e, key, "descuento")
                      }
                    />
                  </>
                ) : (
                  <Space direction="vertical">
                    <Spin
                      size="small"
                      indicator={<LoadingOutlined spin />}
                      spinning={loaderLP}
                    >
                      <StyledText
                        onClick={() => handleChangeEdit(key, "descuento")}
                      >
                        <Tag color={"green"}>
                          {porc_descuento.toLocaleString("es-ES")} %
                        </Tag>
                      </StyledText>
                    </Spin>
                  </Space>
                )}
              </>
            ) : (
              <Text>{porc_descuento.toLocaleString("es-ES")} %</Text>
            )}
          </>
        );
      },
    },
    {
      title: "Iva",
      dataIndex: "iva",
      key: "iva",
      width: 50,
      align: "center",
    },
    {
      title: "SubTotal",
      dataIndex: "precio_subtotal",
      key: "precio_subtotal",
      width: 130,
      align: "center",
      render: (_, { precio_subtotal }) => {
        return <Text>$ {precio_subtotal.toLocaleString("es-ES")}</Text>;
      },
    },
    {
      title: "Dscto",
      dataIndex: "total_descuento",
      key: "total_descuento",
      width: 130,
      align: "center",
      render: (_, { total_descuento }) => {
        return <Text>$ {total_descuento.toLocaleString("es-ES")}</Text>;
      },
    },
    {
      title: "Total",
      dataIndex: "precio_total",
      key: "precio_total",
      width: 130,
      align: "center",
      render: (_, { precio_total }) => {
        return <Text>$ {precio_total.toLocaleString("es-ES")}</Text>;
      },
    },
  ];

  if (accion == "create" || accion == "edit") {
    columns.push({
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      render: (_, record: { key: React.Key }) => {
        return (
          <>
            {accion == "create" || accion == "edit" ? (
              <Tooltip title="Editar">
                <Button
                  danger
                  type="primary"
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(record.key)}
                  disabled={control.getValues("tercero_id") == ""}
                />
              </Tooltip>
            ) : null}
          </>
        );
      },
      width: 70,
    });
  }

  const anularDocumento = () => {
    setLoader(true);
    const data = {
      oc_id: id,
      accion: accion,
    };
    cambiarEstadoOC(data)
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
        setLoaderLP(true);
        searchTerceros(query).then(({ data: { data } }) => {
          setLoaderLP(false);
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
    setLoaderLP(true);
    searchProductsxLP(value)
      .then(({ data: { data } }) => {
        setProductosLP(data);
        setLoaderLP(false);
        let subtotal = 0;
        let total = 0;
        let descuento = 0;
        const newData = dataSource.map((item) => {
          const productoLP = data
            .filter((producto) => producto.producto_id === item.key.toString())
            .at(0);
          if (productoLP) {
            let precio_compra = 0;
            const precioLP = parseFloat(productoLP.precio);
            if (item.p_regulado_compra > 0) {
              precio_compra =
                precioLP > item.p_regulado_compra
                  ? item.p_regulado_compra
                  : precioLP;
            } else {
              precio_compra = precioLP;
            }
            const item_subtotal = item.cantidad * precio_compra;
            const item_descuento = item_subtotal * (item.porc_descuento / 100);
            const item_iva = item_subtotal * (item.iva / 100);
            const item_total = item_subtotal - item_descuento + item_iva;
            subtotal += item_subtotal;
            total += item_total;
            descuento += item_descuento;
            return {
              ...item,
              precio_compra,
              total_descuento: item_descuento,
              precio_subtotal: item_subtotal,
              precio_total: item_total,
            };
          } else {
            return {
              ...item,
              total_descuento: 0,
              precio_compra: 0,
              precio_total: 0,
              precio_subtotal: 0,
            };
          }
        });
        control.setValue("subtotal", subtotal);
        control.setValue("total", total);
        control.setValue("total_descuento", descuento);
        setDataSource(newData);
        control.setValue("detalle", newData);
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
          setLoaderLP(false);
        }
      )
      .finally(() => {
        setLoaderLP(false);
      });
  };

  const handleSelectProductoPadre = ({
    key,
    cod_padre,
    descripcion,
    iva,
  }: DataTypeModalPadre) => {
    let subtotal = 0;
    let total = 0;
    let descuento = 0;
    const newData: DataType[] = dataSource.map((item) => {
      if (item.key === oldItem?.key) {
        const productoLP = productosLP.find((item) => item.producto_id == key);
        const precio = productoLP
          ? parseFloat(productoLP.precio)
          : item.precio_compra > 0
          ? item.precio_compra
          : 0;
        const precio_subtotal = item.cantidad * precio;
        const precio_iva = precio_subtotal * (iva / 100);
        const total_descuento = precio_subtotal * (item.porc_descuento / 100);
        const precio_total = precio_subtotal - total_descuento + precio_iva;
        subtotal += precio_subtotal;
        total += precio_total;
        descuento += total_descuento;
        return {
          ...item,
          key,
          cod_padre,
          descripcion,
          iva: iva,
          ivaValue: iva,
          precio_compra: precio,
          precio_subtotal,
          precio_total,
          total_descuento,
        };
      } else {
        subtotal += item.precio_subtotal;
        total += item.precio_total;
        descuento += item.total_descuento;
        return item;
      }
    });
    setDataSource(newData);
    control.setValue("detalle", newData);
    control.setValue("subtotal", subtotal);
    control.setValue("total", total);
    control.setValue("total_descuento", descuento);
  };

  const handleSelectProductos = (productos: DataTypeModalProductos[]) => {
    const newProducts: DataType[] = productos.map((producto) => {
      return {
        cantidad: producto.cantidad,
        cod_padre: producto.producto.cod_padre,
        descripcion: producto.descripcion,
        editable: false,
        editablePrecio: false,
        editableDescuento: false,
        iva: parseInt(producto.producto.ivas.iva),
        key: producto.key,
        maxCantidad: producto.cantidad,
        precio_compra: 0,
        precio_subtotal: 0,
        precio_total: 0,
        porc_descuento: 0,
        total_descuento: 0,
        precio_promedio: producto.precio_promedio,
        p_regulado_compra: parseFloat(producto.producto.p_regulado_compra),
      };
    });
    setDataSource(dataSource.concat(newProducts));
  };

  const onFinish: SubmitHandler<any> = async (data) => {
    let flagValorDetalle = false;
    for (let index = 0; index < data.detalle.length; index++) {
      if (data.detalle[index]["precio_total"] == 0) {
        flagValorDetalle = true;
        notificationApi.open({
          type: "error",
          message: `El producto ${data.detalle[index]["descripcion"]} tiene valor en cero, por favor ingresa el valor`,
        });
      }
    }

    if (!flagValorDetalle) {
      setLoader(true);
      if (id) {
        updateOC(data, id)
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
        crearOC(data)
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
      <ModalProductos
        open={openModalProductos}
        setOpen={(value: boolean) => setOpenModalProductos(value)}
        handleSelectProductos={(productos: DataTypeModalProductos[]) => {
          handleSelectProductos(productos);
        }}
        detalle={dataSource}
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
              Orden de Compra{" "}
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
                  {rqpInfo?.distribucion_id ||
                  documentoInfo?.distribucion_id ? (
                    <Col xs={24}>
                      <Alert
                        banner
                        type="info"
                        message={
                          "Esta orden de compra hace parte de una distribución de compra."
                        }
                      />
                    </Col>
                  ) : null}
                  <Col xs={{ span: 24, order: 3 }} md={{ span: 6, order: 1 }}>
                    <Controller
                      name="bod_destino"
                      control={control.control}
                      rules={{
                        required: {
                          value: true,
                          message: "Bodega Destino es requerido",
                        },
                      }}
                      render={({ field }) => (
                        <StyledFormItem required label={"Bodega Destino:"}>
                          <Select
                            {...field}
                            showSearch
                            defaultActiveFirstOption={false}
                            filterOption={(input, option) =>
                              (option?.label?.toString() ?? "")
                                .toLowerCase()
                                .includes(input.toString().toLowerCase())
                            }
                            options={selectBodegas}
                            disabled={!["create", "edit"].includes(accion)}
                          />
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={{ span: 24, order: 4 }} md={{ span: 6, order: 2 }}>
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
                          <Spin
                            size="small"
                            indicator={<LoadingOutlined spin />}
                            spinning={loaderLP}
                          >
                            <Select
                              {...field}
                              showSearch
                              suffixIcon={null}
                              filterOption={false}
                              placeholder={"Buscar proveedor"}
                              onSearch={handleSearchProveedor}
                              onSelect={handleSelectProveedor}
                              notFoundContent={null}
                              options={selectProveedor}
                              status={error && "error"}
                              disabled={
                                id && ["show", "anular"].includes(accion)
                                  ? true
                                  : false
                              }
                            />
                          </Spin>
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={{ span: 24, order: 2 }} md={{ span: 6, order: 3 }}>
                    <Controller
                      name="bodega_id"
                      control={control.control}
                      render={({ field }) => (
                        <StyledFormItem label={"Bodega OC:"}>
                          <Select
                            {...field}
                            suffixIcon={null}
                            defaultActiveFirstOption={false}
                            options={selectBodegas}
                            disabled={true}
                          />
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={{ span: 24, order: 1 }} md={{ span: 6, order: 4 }}>
                    <StyledFormItem label={"Fecha :"} name={"fecha"}>
                      <DatePicker
                        disabled
                        format={"YYYY-MM-DD HH:mm"}
                        style={{ width: "100%" }}
                        suffixIcon={null}
                      />
                    </StyledFormItem>
                  </Col>
                  <Col
                    xs={{ span: 24, order: 5 }}
                    md={{ span: 6, order: 5, offset: 12 }}
                  >
                    <Controller
                      name="porc_descuento"
                      control={control.control}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem
                          label={"Porcentaje Descuento:"}
                          required
                        >
                          <InputNumber
                            {...field}
                            placeholder="Porcentaje de Descuento"
                            defaultValue={0}
                            min={0}
                            max={100}
                            style={{ width: "100%" }}
                            status={error && "error"}
                            addonAfter={"%"}
                            disabled={
                              ["show", "anular"].includes(accion)
                                ? true
                                : tipoPorcentaje == "detalle"
                                ? true
                                : false
                            }
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={{ span: 24, order: 6 }} md={{ span: 6, order: 6 }}>
                    <Controller
                      name="domicilio"
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
                            placeholder="Domicilio"
                            min={0}
                            controls={false}
                            formatter={(value) =>
                              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                            style={{ width: "100%" }}
                            status={error && "error"}
                            disabled={
                              ["show", "anular"].includes(accion) ? true : false
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
                              disabled={
                                accion == "create" || accion == "edit"
                                  ? false
                                  : true
                              }
                              maxLength={250}
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
              {["create", "edit"].includes(accion) ? (
                <Col
                  md={{ offset: 15, span: 9 }}
                  sm={{ span: 24 }}
                  style={{ marginTop: 15 }}
                >
                  <Button
                    type="primary"
                    block
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setOpenModalProductos(true);
                    }}
                    disabled={control.getValues("tercero_id") == ""}
                  >
                    Agregar Productos
                  </Button>
                </Col>
              ) : null}

              <Col span={24} style={{ marginTop: 15 }}>
                <Row gutter={[12, 12]}>
                  <Col span={24}>
                    <Table
                      rowKey={(record) => record.key}
                      size="small"
                      pagination={{
                        simple: false,
                      }}
                      scroll={{ x: 1200 }}
                      bordered
                      dataSource={dataSource}
                      columns={columns}
                      summary={() => (
                        <Table.Summary fixed>
                          <Table.Summary.Row>
                            <Table.Summary.Cell
                              index={-2}
                              colSpan={8}
                              align="right"
                            >
                              <Text strong>Subtotal:</Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={-2} align="center">
                              <Text strong>
                                ${" "}
                                {control
                                  .getValues("subtotal")
                                  .toLocaleString("es-ES")}
                              </Text>
                            </Table.Summary.Cell>
                          </Table.Summary.Row>
                          <Table.Summary.Row>
                            <Table.Summary.Cell
                              index={-2}
                              colSpan={8}
                              align="right"
                            >
                              <Text strong>IVA:</Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={-2} align="center">
                              <Text strong>
                                ${" "}
                                {(tipoPorcentaje == "cabecera"
                                  ? dataSource.reduce(
                                      (accumulator, item) =>
                                        accumulator +
                                        (item.precio_total -
                                          item.precio_subtotal),
                                      0
                                    )
                                  : control.getValues("total") +
                                    control.getValues("total_descuento") -
                                    control.getValues("subtotal")
                                ).toLocaleString("es-ES")}
                              </Text>
                            </Table.Summary.Cell>
                          </Table.Summary.Row>
                          <Table.Summary.Row>
                            <Table.Summary.Cell
                              index={-2}
                              colSpan={8}
                              align="right"
                            >
                              <Text strong>Descuentos:</Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={-2} align="center">
                              <Text strong>
                                ${" "}
                                {control
                                  .getValues("total_descuento")
                                  .toLocaleString("es-ES")}
                              </Text>
                            </Table.Summary.Cell>
                          </Table.Summary.Row>
                          <Table.Summary.Row>
                            <Table.Summary.Cell
                              index={-2}
                              colSpan={8}
                              align="right"
                            >
                              <Text strong>Total:</Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={-2} align="center">
                              <Text strong>
                                ${" "}
                                {control
                                  .getValues("total")
                                  .toLocaleString("es-ES")}
                              </Text>
                            </Table.Summary.Cell>
                          </Table.Summary.Row>
                        </Table.Summary>
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
