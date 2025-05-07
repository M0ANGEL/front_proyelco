/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useMemo, useState } from "react";
import { validarAccesoDocumento } from "@/services/documentos/rqpAPI";
import { KEY_BODEGA, KEY_EMPRESA } from "@/config/api";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { CamposEstados, DataType, DataTypeChildren } from "./types";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Button,
  Col,
  Form,
  Input,
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
  DevolucionProveedorCabecera,
  FacturaProveedorCabecera,
} from "@/services/types";
import {
  LoadingOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  StyledCard,
  StyledFormItem,
} from "@/modules/common/layout/DashboardLayout/styled";
import { ModalProductosFP, TablaExpandida } from "../../components";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { searchFacturaProveedor } from "@/services/documentos/fpAPI";
import { getBodega } from "@/services/maestras/bodegasAPI";
import {
  cambiarEstadoDP,
  crearDP,
  getInfoDP /*updateDP*/,
} from "@/services/documentos/dpAPI";

let timeout: ReturnType<typeof setTimeout> | null;

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const estadosVisibles = ["0", "2"];

export const FormDP = () => {
  const [selectProveedor, setSelectProveedor] = useState<
    SelectProps["options"]
  >([]);
  const [ellipsisRow, setEllipsisRow] = useState<React.Key[]>([]);
  const [camposEstados, setCamposEstados] = useState<CamposEstados[]>();
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [facturas, setFacturas] = useState<FacturaProveedorCabecera[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [productosFP, setProductosFP] = useState<DataType[]>([]);
  const [flagAcciones, setFlagAcciones] = useState<boolean>(false);
  const [documentoInfo, setDocumentoInfo] =
    useState<DevolucionProveedorCabecera>();
  const [facturaInfo, setFacturaInfo] = useState<FacturaProveedorCabecera>();
  const [bodegaInfo, setBodegaInfo] = useState<Bodega>();
  const [notificationApi, contextHolder] = notification.useNotification();
  const [accion, setAccion] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(true);
  const { getSessionVariable } = useSessionStorage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [total, setTotal] = useState<number>(0);
  const [subtotal, setSubtotal] = useState<number>(0);
  const control = useForm({
    mode: "onChange",
    defaultValues: {
      subtotal: 0,
      total: 0,
      detalle: dataSource,
      tipo_documento_id: 0,
      fp_id: "",
      bodega_id: 0,
      tercero_id: "",
      observacion: "",
    },
  });
  // Este useEffect permite validar los distintos permisos que tenga el usuario sobre el documento, el prefijo del documento se obtiene a traves de la URL
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
        })
        .finally(() => setLoader(false));
    }
    if (id) {
      // Se valida que en la acciones EDIT, SHOW y ANULAR se capture el ID de la Orden de Compra ya creada para consultar su cabecera y detalle
      // e imprimirla en el formulario
      getInfoDP(id).then(({ data: { data } }) => {
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

        const detalle: DataType[] = data.detalle.map((item) => {
          let total_cantidad = 0;
          const lotes: DataTypeChildren[] = item.map((linea) => {
            const f_vencimiento = dayjs(linea.fecha_vencimiento).format(
              "DD-MM-YYYY"
            );
            total_cantidad += parseInt(linea.cantidad);
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
          };
        });
        control.setValue("observacion", data.observacion);
        control.setValue("bodega_id", data.bodega.id);
        control.setValue("subtotal", parseFloat(data.subtotal));
        control.setValue("total", parseFloat(data.total));
        control.setValue("tercero_id", data.tercero_id);
        control.setValue("detalle", detalle);
        handleSearchFactura(data.fp_cabecera.factura_nro);
        setSelectProveedor([
          {
            value: data.fp_id,
            label: `${data.fp_cabecera.factura_nro}`,
          },
        ]);
        control.setValue("fp_id", data.fp_id);
        setDataSource(detalle);
        setFacturaInfo(data.fp_cabecera);
        const productos: DataType[] = data.fp_cabecera.detalle.map((item) => {
          let total_cantidad = 0;
          const lotes: DataTypeChildren[] = item.map((linea) => {
            const f_vencimiento = dayjs(linea.fecha_vencimiento).format(
              "DD-MM-YYYY"
            );
            total_cantidad += parseInt(linea.cantidad);
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
          };
        });
        setProductosFP(productos);
        setLoader(false);
      });
    } else {
      getBodega(getSessionVariable(KEY_BODEGA)).then(({ data: { data } }) => {
        setBodegaInfo(data);
        control.setValue("bodega_id", data.id);
        setLoader(false);
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
    control.setValue("total", total_general);
    control.setValue("subtotal", subtotal_general);
    setTotal(total_general);
    setSubtotal(subtotal_general);
  };

  useMemo(() => {
    calculateTotal();
  }, [dataSource]);

  // Esta funcion se usa al seleccionar un producto desde la maestra de productos o desde la ORDEN DE COMPRA
  const handleSelectProducto = (producto: DataType, loteKey: React.Key) => {
    const newLote = producto.lotes.filter((item) => item.key === loteKey)[0];
    let newDataSource: DataType[];
    if (
      dataSource.find((item) => {
        return item.key === producto.key;
      })
    ) {
      newDataSource = dataSource.map((item) => {
        if (!item.lotes.find((item) => item.key === loteKey)) {
          setOpen(false);
          return { ...item, lotes: [...item.lotes, newLote] };
        } else {
          notificationApi.open({
            type: "error",
            message: `Este lote ya se encuentra en el detalle`,
          });
          return item;
        }
      });
    } else {
      setOpen(false);
      newDataSource = [
        ...dataSource,
        {
          ...producto,
          lotes: producto.lotes.filter((item) => item.key === loteKey),
        },
      ];
    }
    setDataSource(newDataSource);
    control.setValue("detalle", newDataSource);
    calculateTotal();
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
            <Col span={20}>
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
      title: "Total cantidad",
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
      title: "Precio Compra",
      key: "precio_compra",
      dataIndex: "precio_compra",
      align: "center",
      width: 150,
      render: (_, { precio_compra }) => {
        return <>$ {precio_compra.toLocaleString("es-CO")}</>;
      },
    },
    {
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
    },
    {
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
    },
  ];

  if (["create", "edit"].includes(accion)) {
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
          </Space>
        );
      },
    });
  }

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key != key);
    setDataSource(newData);
    control.setValue("detalle", newData);
  };

  // Esta funcion se usa para modificar el detalle de lotes por producto en la tabla del detalle y se ejecuta cada que el detalle de lotes
  // por producto sufre una modificacion, ya sea ingresando un nuevo lote o eliminarlo
  const setChildren = (key: React.Key, children: DataTypeChildren[]) => {
    // Se recorre el detalle para saber a que producto se le debe realizar la modificacion de lotes
    const newData = dataSource.map((item) => {
      if (item.key == key) {
        return { ...item, lotes: children };
      } else {
        return item;
      }
    });
    setDataSource(newData);
    control.setValue("detalle", newData);
  };

  const setCantidadLote = (
    cantidad: number,
    key: React.Key,
    loteKey: React.Key
  ) => {
    // Se recorre el detalle para saber a que producto se le debe realizar la modificacion de lotes
    const newData = dataSource.map((item) => {
      if (item.key == key) {
        const lotes = item.lotes.map((lote) => {
          if (lote.key === loteKey) {
            return { ...lote, cantidad: cantidad };
          } else {
            return lote;
          }
        });
        return { ...item, lotes: lotes };
      } else {
        return item;
      }
    });
    calculateTotal();
    setDataSource(newData);
    control.setValue("detalle", newData);
  };

  const anularDocumento = () => {
    setLoader(true);
    const data = {
      dp_id: id,
      accion: accion,
    };
    cambiarEstadoDP(data)
      .then(() => {
        notificationApi.open({
          type: "success",
          message: `Se ha anulado el documento con exito!`,
          style: { width: 700 },
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

  const handleSearchFactura = (query: string) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => {
      if (query.length > 0) {
        searchFacturaProveedor(query).then(({ data: { data } }) => {
          setFacturas(data);
          setSelectProveedor(
            data.map((item) => ({
              value: item.id,
              label: `${item.factura_nro} (${item.tercero.nit} - ${item.tercero.nombre})`,
            }))
          );
        });
      }
    }, 500);
  };

  const handleSelectFactura = (value: string) => {
    let factura: FacturaProveedorCabecera;
    if (value) {
      factura = facturas.filter((item) => item.id.toString() == value)[0];
      setFacturaInfo(factura);
      control.setValue("tercero_id", factura.tercero_id);
      const productos: DataType[] = factura.detalle.map((item) => {
        let total_cantidad = 0;
        const lotes: DataTypeChildren[] = item.map((linea) => {
          const f_vencimiento = dayjs(linea.fecha_vencimiento).format(
            "DD-MM-YYYY"
          );
          total_cantidad += parseInt(linea.cantidad);
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
        };
      });
      setProductosFP(productos);
      if (!id) {
        setDataSource([]);
      }
    }
  };

  const onFinish: SubmitHandler<any> = async (data) => {
    // console.log(data);
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
        // updateDP(data, id)
        //   .then(() => {
        //     notificationApi.open({
        //       type: "success",
        //       message: `Documento modificado con exito con exito!`,
        //     });
        //     setTimeout(() => {
        //       navigate(-1);
        //     }, 800);
        //     setLoader(false);
        //   })
        //   .catch(
        //     ({
        //       response,
        //       response: {
        //         data: { errors },
        //       },
        //     }) => {
        //       if (errors) {
        //         const errores: string[] = Object.values(errors);
        //         for (const error of errores) {
        //           notificationApi.open({
        //             type: "error",
        //             message: error,
        //           });
        //         }
        //       } else {
        //         notificationApi.open({
        //           type: "error",
        //           message: response.data.message,
        //         });
        //       }
        //       setLoader(false);
        //     }
        //   );
      } else {
        crearDP(data)
          .then(() => {
            notificationApi.open({
              type: "success",
              message: `Documento creado con exito!`,
            });
            setTimeout(() => {
              navigate(-1);
            }, 800);
            // setLoader(false);
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

  return (
    <>
      {contextHolder}
      <ModalProductosFP
        open={open}
        setOpen={(value: boolean) => setOpen(value)}
        productosFP={productosFP}
        detalle={dataSource}
        handleSelectProducto={(producto: DataType, loteKey: React.Key) =>
          handleSelectProducto(producto, loteKey)
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
              Devolucion al Proveedor{" "}
              {id && documentoInfo ? `- ${documentoInfo?.consecutivo}` : null}
            </Title>
          }
        >
          <Form
            layout={"vertical"}
            form={form}
            onFinish={control.handleSubmit(onFinish)}
          >
            <Row gutter={[12, 6]}>
              <Col span={24}>
                <Row gutter={12}>
                  <Col xs={24} sm={3}>
                    <StyledFormItem label={"Bodega:"}>
                      <Input disabled value={bodegaInfo?.bod_nombre} />
                    </StyledFormItem>
                  </Col>
                  <Col xs={24} sm={6}>
                    <Controller
                      name="fp_id"
                      control={control.control}
                      rules={{
                        required: {
                          value: true,
                          message: "Nro. Factura es requerido",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem label={"Nro. Factura:"} required>
                          <Select
                            {...field}
                            showSearch
                            showArrow={false}
                            filterOption={false}
                            placeholder={"Buscar proveedor"}
                            onSearch={handleSearchFactura}
                            onSelect={handleSelectFactura}
                            notFoundContent={null}
                            options={selectProveedor}
                            status={error && "error"}
                            disabled={
                              id && ["show", "anular"].includes(accion)
                                ? true
                                : false
                            }
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={24} sm={6}>
                    <StyledFormItem label={"Proveedor:"}>
                      <Input
                        disabled
                        value={
                          id
                            ? documentoInfo?.tercero.nit +
                              " - " +
                              documentoInfo?.tercero.nombre
                            : facturaInfo
                            ? facturaInfo?.tercero.nit +
                              " - " +
                              facturaInfo?.tercero.nombre
                            : ""
                        }
                      />
                    </StyledFormItem>
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
                              disabled={id ? true : false}
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
                    <Col sm={{ offset: 19, span: 5 }} xs={{ span: 24 }}>
                      <Button
                        type="primary"
                        htmlType="button"
                        block
                        icon={<PlusOutlined />}
                        onClick={() => setOpen(true)}
                        disabled={!facturaInfo ? true : false}
                      >
                        Agregar
                      </Button>
                    </Col>
                  ) : null}
                  <Col span={24}>
                    <Table
                      className="expanded-table"
                      rowKey={(record) => record.key}
                      size="small"
                      scroll={{ y: 500 }}
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
                              accion={accion}
                              data={record.lotes}
                              setChildren={(children: DataTypeChildren[]) =>
                                setChildren(record.key, children)
                              }
                              setCantidadLote={(
                                cantidad: number,
                                key: React.Key,
                                loteKey
                              ) => setCantidadLote(cantidad, key, loteKey)}
                            />
                          );
                        },
                        defaultExpandedRowKeys: ["0"],
                      }}
                      summary={() => (
                        <>
                          <Table.Summary fixed>
                            <Table.Summary.Row>
                              <Table.Summary.Cell
                                index={-2}
                                colSpan={
                                  ["show", "anular"].includes(accion) ? 6 : 7
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
                            {/* <Table.Summary.Row>
                              <Table.Summary.Cell
                                index={-2}
                                colSpan={6}
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
                            </Table.Summary.Row> */}
                            <Table.Summary.Row>
                              <Table.Summary.Cell
                                index={-2}
                                colSpan={
                                  ["show", "anular"].includes(accion) ? 6 : 7
                                }
                                align="right"
                              >
                                <Text strong style={{ fontSize: 12 }}>
                                  IVA:
                                </Text>
                              </Table.Summary.Cell>
                              <Table.Summary.Cell index={-2} align="center">
                                <Text strong style={{ fontSize: 12 }}>
                                  $ {(total - subtotal).toLocaleString("es-CO")}
                                </Text>
                              </Table.Summary.Cell>
                            </Table.Summary.Row>
                            <Table.Summary.Row>
                              <Table.Summary.Cell
                                index={-2}
                                colSpan={
                                  ["show", "anular"].includes(accion) ? 6 : 7
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
