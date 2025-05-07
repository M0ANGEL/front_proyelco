/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Popconfirm,
  Row,
  Select,
  SelectProps,
  Space,
  Spin,
  Typography,
  notification,
} from "antd";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Bodega,
  DocumentosCabecera,
  DocumentosCabeceraEntradas,
} from "@/services/types";
import Table, { ColumnsType } from "antd/es/table";
import {
  LoadingOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  StyledCard,
  StyledFormItem,
} from "@/modules/common/layout/DashboardLayout/styled";
import { CamposEstados, DataType } from "./types";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_EMPRESA, KEY_BODEGA } from "@/config/api";
import dayjs from "dayjs";
import {
  anularDoc,
  crearDocumento,
  getInfoEntrada,
  getInfoSalida,
  updateDocumentos,
  validarAccesoDocumento,
} from "@/services/documentos/otrosAPI";
import { getBodega } from "@/services/maestras/bodegasAPI";
import { ModalPagoProductos } from "../../components";
import { DataTypeLote } from "../../components/ModalPagoProductos/types";
import useSerialize from "@/modules/common/hooks/useUpperCase";

const { Title, Text } = Typography;
const { TextArea } = Input;

export const FormPPT = () => {
  const [selectTercero, setSelectTercero] = useState<SelectProps["options"]>(
    []
  );
  const [notificationApi, contextHolder] = notification.useNotification();
  const [camposEstados, setCamposEstados] = useState<CamposEstados[]>();
  const [documentoInfo, setDocumentoInfo] = useState<DocumentosCabecera>();
  const [documentoInfoEntrada, setDocumentoInfoEntrada] =
    useState<DocumentosCabeceraEntradas>();
  const { id, pte_id } = useParams<{ id: string; pte_id: string }>();
  const [disableButton, setDisableButton] = useState<boolean>(true);
  const [flagAcciones, setFlagAcciones] = useState<boolean>(false);
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [deletingRow, setDeletingRow] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [estadosVisibles] = useState<string[]>(["0", "2"]);
  const [bodegaInfo, setBodegaInfo] = useState<Bodega>();
  const [loader, setLoader] = useState<boolean>(true);
  const { getSessionVariable } = useSessionStorage();
  const [accion, setAccion] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const { transformToUpperCase } = useSerialize();
  const [url, setUrl] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const control = useForm({
    mode: "onChange",
  });

  useEffect(() => {
    const url_split = location.pathname.split("/");
    setUrl(url_split);

    const accion = url_split[url_split.length - 2];
    setAccion(accion);
    const codigo_documento = url_split[url_split.length - 3];
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

          if (data.crear !== "1" && accion == "create") {
            notificationApi.open({
              type: "error",
              message: "No tienes permisos para crear documento!",
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
      getInfoSalida(id)
        .then(({ data: { data } }) => {
          setDocumentoInfo(data);
          if (["3", "4"].includes(data.estado)) {
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
          const detalle: DataType[] = data.detalle.map((item) => {
            const precio_iva =
              parseFloat(item.total) - parseFloat(item.subtotal);
            return {
              key: item.id,
              producto_id: item.producto_id,
              descripcion: item.descripcion,
              cod_padre: item.producto.cod_padre,
              detalle_id: item.produ_vinculado_id,
              lote: item.lote,
              fecha_vencimiento: item.fecha_vencimiento,
              cantidad: parseInt(item.cantidad),
              iva: item.iva == ".00" ? 0 : parseInt(item.iva),
              precio_promedio: parseFloat(item.precio_promedio),
              precio_subtotal: parseFloat(item.subtotal),
              precio_iva,
              precio_total: parseFloat(item.total),
              itemFromModal: false,
            };
          });
          setDataSource(detalle);
          setBodegaInfo(data.bodega);
          control.setValue("doc_prestamo", data.docu_prestamo);
          control.setValue("observacion", data.observacion);
          control.setValue("bodega_id", data.bodega.id);
          control.setValue("tercero_id", data.tercero.nit);
          setSelectTercero([
            {
              value: data.tercero.nit,
              label: `${data.tercero.nit} - ${data.tercero.razon_soc}`,
            },
          ]);
          control.setValue("subtotal", parseFloat(data.subtotal));
          control.setValue("total", parseFloat(data.total));
          form.setFieldValue("fecha", dayjs(data.created_at));
        })
        .finally(() => setLoader(false));
    } else if (pte_id) {
      getInfoEntrada(pte_id)
        .then(({ data: { data } }) => {
          setDocumentoInfoEntrada(data);
          control.setValue("tercero_id", data.tercero.nit);
          setSelectTercero([
            {
              value: data.tercero.nit,
              label: `${data.tercero.nit} - ${data.tercero.razon_soc}`,
            },
          ]);
          control.setValue("doc_prestamo", data.docu_prestamo);
          control.setValue("docu_vinculado_id", pte_id);
        })
        .finally(() => setLoader(false));
      getBodega(getSessionVariable(KEY_BODEGA)).then(({ data: { data } }) => {
        setBodegaInfo(data);
        form.setFieldValue("fecha", dayjs(new Date()));
        control.setValue("bodega_id", data.id);
        setLoader(false);
      });
    }
  }, [id, pte_id]);

  useEffect(() => {
    control.setValue("detalle", dataSource);
    if (dataSource.length > 0) {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }
  }, [dataSource]);

  useMemo(() => {
    let subtotal = 0;
    let iva = 0;
    let total = 0;
    dataSource.forEach(({ precio_subtotal, precio_iva, precio_total }) => {
      subtotal += precio_subtotal;
      iva += precio_iva;
      total += precio_total;
    });
    control.setValue("subtotal", subtotal);
    control.setValue("iva", iva);
    control.setValue("total", total);
  }, [dataSource]);

  const anularDocumento = () => {
    setLoader(true);
    const data = {
      cabecera_id: id,
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

  const handleSetDetalle = (productos: DataTypeLote[]) => {
    const data: DataType[] = [];
    productos.forEach((producto) => {
      const precio_subtotal = producto.cantidad * producto.precio_promedio;
      const precio_iva = precio_subtotal * (producto.iva / 100);
      const precio_total = precio_subtotal + precio_iva;
      data.push({
        key: producto.key,
        producto_id: producto.producto_id,
        cantidad: producto.cantidad,
        cod_padre: producto.cod_padre,
        descripcion: producto.desc_producto,
        detalle_id: producto.detalle_id,
        fecha_vencimiento: producto.fecha_vencimiento,
        iva: producto.iva,
        lote: producto.lote,
        precio_iva,
        precio_subtotal,
        precio_total,
        precio_promedio: producto.precio_promedio,
        itemFromModal: true,
      });
    });
    setDataSource(dataSource.concat(data));
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

  const handleDeleteProducto = (
    key: React.Key,
    itemFromModal: boolean
    // det_id?: string
  ) => {
    if (["edit"].includes(accion) && dataSource.length == 1) {
      notificationApi.open({
        type: "error",
        message: "El detalle no debe quedar vacío",
      });
      return;
    }
    if (["create"].includes(accion) || itemFromModal) {
      setDataSource(dataSource.filter((item) => item.key != key));
    } else {
      setDeleteLoader(true);
      // deleteDetalle({
      //   det_id,
      //   tipo_documento_id: documentoInfo?.tipo_documento_id,
      // })
      //   .then(() => {
      //     notificationApi.open({
      //       type: "success",
      //       message: `Item removido del detalle!`,
      //     });
      //     setDataSource(dataSource.filter((item) => item.key != key));
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
      //     }
      //   )
      //   .finally(() => {
      //     setDeleteLoader(false);
      //     setDeletingRow([]);
      //   });
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Código",
      dataIndex: "producto_id",
      key: "producto_id",
      align: "center",
      fixed: "left",
      width: 80,
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
      fixed: "left",
      width: 250,
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
      align: "center",
      width: 60,
    },
    {
      title: "Lote",
      dataIndex: "lote",
      key: "lote",
      align: "center",
      width: 80,
    },
    {
      title: "Fecha Vencimiento",
      dataIndex: "fecha_vencimiento",
      key: "fecha_vencimiento",
      align: "center",
      width: 90,
    },
    // {
    //   title: "IVA",
    //   dataIndex: "iva",
    //   key: "iva",
    //   align: "center",
    //   width: 60,
    //   render(value) {
    //     return value + "%";
    //   },
    // },
    // {
    //   title: "Precio Unitario",
    //   dataIndex: "precio_promedio",
    //   key: "precio_promedio",
    //   align: "center",
    //   width: 100,
    //   render(value: number) {
    //     return <>$ {value.toLocaleString("es-CO")}</>;
    //   },
    // },
    // {
    //   title: "Subtotal",
    //   dataIndex: "precio_subtotal",
    //   key: "precio_subtotal",
    //   align: "center",
    //   width: 100,
    //   render(value: number) {
    //     return <>$ {value.toLocaleString("es-CO")}</>;
    //   },
    // },
    // {
    //   title: "Total",
    //   dataIndex: "precio_total",
    //   key: "precio_total",
    //   align: "center",
    //   width: 100,
    //   render(value: number) {
    //     return <>$ {value.toLocaleString("es-CO")}</>;
    //   },
    // },
  ];

  if (["create", "edit"].includes(accion)) {
    columns.push({
      title: "Acciones",
      key: "acciones",
      align: "center",
      width: 100,
      render: (_, { key, cantidad, itemFromModal }) => {
        return (
          <Space>
            <Popconfirm
              title="¿Desea eliminar este item?"
              open={deletingRow.includes(key)}
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              description={
                <Space direction="vertical" size={1}>
                  <Text>
                    {`Al eliminarlo se devolverá la cantidad de ${cantidad} en los lotes correspondientes`}
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

  const onFinish: SubmitHandler<any> = async (data: any) => {
    setLoader(true);
    setDisableButton(true);
    data = transformToUpperCase(data, ["observacion"]);
    if (id) {
      updateDocumentos(data, id)
        .then(() => {
          notificationApi.open({
            type: "success",
            message: `El Pago de Préstamo se creó exitosamente.`,
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
            setDisableButton(false);
          }
        );
    } else {
      crearDocumento(data)
        .then(() => {
          notificationApi.open({
            type: "success",
            message: `El Pago de Préstamo se creó exitosamente.`,
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
            setDisableButton(false);
          }
        );
    }
  };

  return (
    <>
      <ModalPagoProductos
        open={open}
        setOpen={(value: boolean) => setOpen(value)}
        handleSetDetalle={(productos: DataTypeLote[]) =>
          handleSetDetalle(productos)
        }
        documento_vinculado={documentoInfoEntrada}
        detalle={dataSource}
      />
      <Spin
        spinning={loader}
        indicator={
          <LoadingOutlined spin style={{ fontSize: 40, color: "#f4882a" }} />
        }
        style={{ backgroundColor: "rgb(251 251 251 / 70%)" }}
      >
        {contextHolder}
        <StyledCard
          className="styled-card-documents"
          title={
            <Title level={4}>
              Pago de Préstamo{" "}
              {id && documentoInfo ? `- ${documentoInfo?.consecutivo}` : null}
            </Title>
          }
        >
          <Spin
            spinning={loader}
            indicator={
              <LoadingOutlined
                spin
                style={{ fontSize: 40, color: "#f4882a" }}
              />
            }
            style={{ backgroundColor: "rgb(251 251 251 / 70%)" }}
          >
            <Form
              layout={"vertical"}
              form={form}
              onFinish={control.handleSubmit(onFinish)}
            >
              <Row gutter={[12, 12]}>
                <Col span={24}>
                  <Row gutter={12}>
                    <Col
                      xs={{ span: 24, order: 2 }}
                      sm={{ span: 12, order: 1 }}
                      md={{ span: 10, offset: 4, order: 1 }}
                      lg={{ span: 6, offset: 12, order: 1 }}
                    >
                      <StyledFormItem label={"Bodega:"}>
                        <Input disabled value={bodegaInfo?.bod_nombre} />
                      </StyledFormItem>
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
                        render={({ field, fieldState: { error } }) => (
                          <StyledFormItem required label={"Tercero:"}>
                            <Select
                              {...field}
                              showSearch
                              notFoundContent={null}
                              options={selectTercero}
                              status={error && "error"}
                              disabled
                            />
                            <Text type="danger">{error?.message}</Text>
                          </StyledFormItem>
                        )}
                      />
                    </Col>
                    <Col xs={24} sm={24} md={6} lg={8} order={4}>
                      <Controller
                        name="doc_prestamo"
                        control={control.control}
                        render={({ field, fieldState: { error } }) => (
                          <StyledFormItem label={"Documento préstamo:"}>
                            <Input {...field} disabled />
                            <Text type="danger">{error?.message}</Text>
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
                      ) : (
                        <></>
                      )}
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row gutter={[12, 12]}>
                    {accion === "show" || accion === "anular" ? (
                      <></>
                    ) : (
                      <Col
                        lg={{ span: 12, offset: 12 }}
                        xs={24}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          marginTop: 12,
                        }}
                      >
                        <Button
                          type="primary"
                          block
                          onClick={() => setOpen(true)}
                        >
                          <Text style={{ color: "white" }}>
                            <PlusOutlined /> Agregar Productos
                          </Text>
                        </Button>
                      </Col>
                    )}

                    <Col span={24}>
                      <Table
                        rowKey={(record) => record.key}
                        size="small"
                        scroll={{ y: 300, x: 1200 }}
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
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Space>
                    <Link to={"../.."} relative="path">
                      <Button
                        type="primary"
                        icon={<ArrowLeftOutlined />}
                        danger
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
                            disabled={disableButton}
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
          </Spin>
        </StyledCard>
      </Spin>
    </>
  );
};
