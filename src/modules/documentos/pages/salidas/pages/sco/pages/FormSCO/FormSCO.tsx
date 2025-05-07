/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { validarAccesoDocumento } from "@/services/documentos/rqpAPI";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { CamposEstados, DataType } from "./types";
import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Space,
  Spin,
  Table,
  Typography,
  notification,
} from "antd";
import {
  cambiarEstadoSCO,
  crearSCO,
  getInfoSCO,
  getProveedor,
} from "@/services/documentos/scoAPI";
import { getBodega } from "@/services/maestras/bodegasAPI";
import {
  StyledFormItem,
  StyledCard,
} from "@/modules/common/layout/DashboardLayout/styled";
import { KEY_BODEGA, KEY_EMPRESA } from "@/config/api";
import { ColumnsType } from "antd/es/table";
import {
  ArrowLeftOutlined,
  LoadingOutlined,
  DeleteOutlined,
  SaveOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  TipoDocumento,
  Bodega,
  Tercero,
  SalidaConsignacionCabecera,
} from "@/services/types";
import { ModalProductos } from "../../components";
import { GlobalContext } from "@/router/GlobalContext";
import { DataTypeProductos } from "../../components/ModalProductos/types";

const { Title, Text } = Typography;
const { TextArea } = Input;
const estadosVisibles = ["0", "2"];

export const FormSCO = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error(
      "ModulosPerfil: No se encuentra en el contexto GlobalContext"
    );
  }

  const { userGlobal } = context;
  const [camposEstados, setCamposEstados] = useState<CamposEstados[]>();
  const [hasFuente, setHasFuente] = useState<boolean>(false);
  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumento>();
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [flagAcciones, setFlagAcciones] = useState<boolean>(false);
  const [documentoInfo, setDocumentoInfo] =
    useState<SalidaConsignacionCabecera>();
  const [bodegaInfo, setBodegaInfo] = useState<Bodega>();
  const [notificationApi, contextHolder] = notification.useNotification();
  const [accion, setAccion] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(true);
  const [openModalProductos, setOpenModalProductos] = useState<boolean>(false);
  const [tercero, setTercero] = useState<Tercero>();
  const { getSessionVariable } = useSessionStorage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const control = useForm({
    mode: "onChange",
    defaultValues: {
      subtotal: 0,
      iva: 0,
      total: 0,
      detalle: dataSource,
      tipo_documento_id: 0,
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
        })
        .finally(() => setLoader(false));
    }
    if (id) {
      console.log("id", id);
      // Se valida que en la acciones EDIT, SHOW y ANULAR se capture el ID de la Orden de Compra ya creada para consultar su cabecera y detalle
      // e imprimirla en el formulario
      getInfoSCO(id).then(({ data: { data } }) => {
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
        control.setValue("observacion", data.observacion);
        control.setValue("bodega_id", data.bodega.id);
        control.setValue("subtotal", parseFloat(data.subtotal));
        control.setValue("total", parseFloat(data.total));
        control.setValue("tercero_id", data.tercero.nit);
        setTercero(data.tercero);
        const detalle = data.detalle.map((item) => {
          return {
            key: item.id,
            descripcion: item.producto.descripcion,
            cantidad: parseInt(item.cantidad),
            precio_promedio: parseFloat(item.precio_promedio),
            precio_subtotal: parseFloat(item.precio_subtotal),
            precio_total: parseFloat(item.precio_total),
            precio_iva: parseFloat(item.precio_iva),
            iva: parseFloat(item.producto.ivas.iva),
            producto_id: item.producto_id,
            lote: item.lote,
            fvence: item.fecha_vencimiento,
            lote_id: item.producto_lote_id,
          };
        });
        control.setValue("detalle", detalle);
        setDataSource(detalle);
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

  useEffect(() => {
    if (userGlobal) {
      if (userGlobal.has_fuentes == "1") {
        setHasFuente(true);
      } else {
        setHasFuente(false);
      }
    }
  }, [userGlobal]);

  useEffect(() => {
    if (dataSource) {
      control.setValue("detalle", dataSource);
      const subtotal = dataSource.reduce(
        (acc, item) => acc + item.precio_subtotal,
        0
      );
      const iva = dataSource.reduce((acc, item) => acc + item.precio_iva, 0);
      const total = dataSource.reduce(
        (acc, item) => acc + item.precio_total,
        0
      );
      control.setValue("subtotal", subtotal);
      control.setValue("iva", iva);
      control.setValue("total", total);
    }
  }, [dataSource]);

  const columns: ColumnsType<DataType> = [
    {
      title: "Código",
      key: "producto_id",
      dataIndex: "producto_id",
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
      key: "cantidad",
      dataIndex: "cantidad",
      align: "center",
      width: 100,
    },
    {
      title: "Lote",
      key: "lote",
      dataIndex: "lote",
      align: "center",
      width: 140,
    },
    {
      title: "Fecha Vencimiento",
      key: "fvence",
      dataIndex: "fvence",
      align: "center",
      width: 140,
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

  const anularDocumento = () => {
    setLoader(true);
    const data = {
      sco_id: id,
      accion: accion,
    };
    cambiarEstadoSCO(data)
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

  const handleSearchTercero = (value: string) => {
    setLoader(true);
    getProveedor(value)
      .then(({ data: { data } }) => {
        setTercero(data);
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
        }
      )
      .finally(() => setLoader(false));
  };
  const handleAddProducts = (productos: DataTypeProductos[]) => {
    const newProducts = productos.map((item) => {
      const subtotal = item.precio_promedio * item.cantidad;
      const iva = (subtotal * item.iva) / 100;
      const total = subtotal + iva;
      return {
        key: item.key,
        descripcion: item.descripcion,
        cantidad: item.cantidad,
        precio_promedio: item.precio_promedio,
        precio_subtotal: subtotal,
        precio_iva: iva,
        precio_total: total,
        iva: item.iva,
        producto_id: item.producto_id,
        lote: item.lote,
        fvence: item.fvence,
        lote_id: item.id.toString(),
      };
    });

    const newData: DataType[] = [...dataSource, ...newProducts];
    setDataSource(newData);
  };

  const checkKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") e.preventDefault();
  };

  const onFinish: SubmitHandler<any> = async (data) => {
    setLoader(true);
    if (tercero) {
      data.tercero_id = tercero.id.toString();
    }
    if (!id) {
      crearSCO(data)
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
                style: { width: 700 },
              });
            }
            setLoader(false);
          }
        );
    }
  };

  return (
    <>
      <ModalProductos
        open={openModalProductos}
        setOpen={(value: boolean) => {
          setOpenModalProductos(value);
        }}
        hasFuente={hasFuente}
        addProducts={handleAddProducts}
        detalle={dataSource}
      />
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
              {tipoDocumento?.descripcion}{" "}
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
            <Row gutter={[12, 12]}>
              <Col span={24}>
                <Row gutter={12}>
                  <Col xs={24} md={7}>
                    <StyledFormItem label={"Bodega:"}>
                      <Input disabled value={bodegaInfo?.bod_nombre} />
                    </StyledFormItem>
                  </Col>
                  <Col xs={24} md={5}>
                    <Controller
                      name="tercero_id"
                      control={control.control}
                      rules={{
                        required: {
                          value: true,
                          message: "NIT Proveedor es requerido",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem label={"NIT Proveedor:"} required>
                          <Input
                            {...field}
                            allowClear
                            onChange={(e) => {
                              field.onChange(e);
                              setTercero(undefined);
                            }}
                            placeholder={"Buscar Proveedor"}
                            onKeyUp={(event: any) => {
                              if (
                                event.key == "Enter" &&
                                event.target.value != ""
                              ) {
                                handleSearchTercero(event.target.value);
                              }
                            }}
                            onKeyDown={(e) => {
                              if (
                                !/^[0-9]$/.test(e.key) &&
                                e.key != "Backspace" &&
                                e.key != "Ctrl" &&
                                !/^[v]$/.test(e.key)
                              ) {
                                e.preventDefault();
                              }
                            }}
                            disabled={
                              id && ["show", "anular"].includes(accion)
                                ? true
                                : false
                            }
                            status={error && "error"}
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <StyledFormItem label={"Proveedor:"}>
                      <Input
                        disabled
                        value={tercero ? `${tercero.razon_soc}` : ""}
                        placeholder={"Proveedor:"}
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
                    <Col sm={{ offset: 18, span: 6 }} xs={{ span: 24 }}>
                      <Button
                        type="primary"
                        htmlType="button"
                        block
                        icon={<PlusOutlined />}
                        onClick={() => {
                          setOpenModalProductos(true);
                        }}
                        disabled={!tercero ? true : false}
                      >
                        Agregar
                      </Button>
                    </Col>
                  ) : null}
                  <Col span={24}>
                    <Table
                      rowKey={(record) => record.key}
                      size="small"
                      scroll={{ y: 500 }}
                      pagination={{
                        simple: false,
                        hideOnSinglePage: true,
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
