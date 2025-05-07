/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import useSerialize from "@/modules/common/hooks/useUpperCase";
import { Bodega, DocumentosCabeceraEntradas } from "@/services/types";
import { getBodega } from "@/services/maestras/bodegasAPI";
import {
  StyledCard,
  StyledFormItem,
} from "@/modules/common/layout/DashboardLayout/styled";
import { KEY_EMPRESA, KEY_BODEGA } from "@/config/api";
import { useEffect, useState, useMemo } from "react";
import Table, { ColumnsType } from "antd/es/table";
import {
  CamposEstados,
  DataType,
  DataTypeChildren,
  // SummaryProps,
} from "./types";
import {
  anularDoc,
  anyTerceros,
  crearDocumento,
  deleteDetalle,
  getInfoEntrada,
  updateDocumentos,
  validarAccesoDocumento,
} from "@/services/documentos/otrosAPI";
import {
  LoadingOutlined,
  SaveOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  ArrowLeftOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  SelectProps,
  Space,
  Spin,
  Typography,
  notification,
  Popconfirm,
  Tooltip,
  Tag,
} from "antd";
import { ModalProductos, ModalLotes, TablaExpandida } from "../../components";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

let timeout: ReturnType<typeof setTimeout> | null;

export const FormPTE = () => {
  const [selectTercero, setSelectTercero] = useState<SelectProps["options"]>(
    []
  );
  const [notificationApi, contextHolder] = notification.useNotification();
  const [documentoInfo, setDocumentoInfo] =
    useState<DocumentosCabeceraEntradas>();
  const [camposEstados, setCamposEstados] = useState<CamposEstados[]>();
  const [openModalLote, setOpenModalLote] = useState<boolean>(false);
  const [loaderTercero, setLoaderTercero] = useState<boolean>(false);
  const [disableButton, setDisableButton] = useState<boolean>(true);
  const [flagAcciones, setFlagAcciones] = useState<boolean>(false);
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [deletingRow, setDeletingRow] = useState<React.Key[]>([]);
  const [ellipsisRow, setEllipsisRow] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [productoId, setProductoId] = useState<React.Key>();
  const [estadosVisibles] = useState<string[]>(["0", "2"]);
  const [bodegaInfo, setBodegaInfo] = useState<Bodega>();
  const [loader, setLoader] = useState<boolean>(true);
  const { getSessionVariable } = useSessionStorage();
  const [accion, setAccion] = useState<string>("");
  const { transformToUpperCase } = useSerialize();
  const [url, setUrl] = useState<string[]>([]);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const control = useForm({
    mode: "onChange",
  });

  // const summaryProps: SummaryProps = {
  //   firstCell: { index: 0, colSpan: 2, align: "right" },
  //   secondCell: { index: 2, colSpan: 6, align: "right" },
  //   thirdCell: { index: 8, align: "center" },
  //   fourthCell: { index: 9 },
  // };

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
      getInfoEntrada(id)
        .then(({ data: { data } }) => {
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
            let total_ingreso = 0;
            let precio_subtotal = 0;
            let precio_iva = 0;
            let precio_total = 0;
            const lotes: DataTypeChildren[] = item.map((linea) => {
              total_ingreso += parseInt(linea.cantidad);
              precio_subtotal += parseFloat(linea.subtotal);
              precio_iva +=
                parseFloat(linea.total) - parseFloat(linea.subtotal);
              precio_total += parseFloat(linea.total);
              return {
                key: `${linea.producto_id}_${linea.lote}_${linea.fecha_vencimiento}`,
                cantidad: parseInt(linea.cantidad),
                lote: linea.lote,
                f_vencimiento: linea.fecha_vencimiento,
                itemFromModal: false,
              };
            });
            const producto = item[0];
            return {
              key: producto ? producto.producto_id : "",
              descripcion: producto ? producto.producto.descripcion : "",
              cod_padre: producto ? producto.producto.cod_padre : "",
              total_ingreso,
              precio: parseFloat(item[0].precio_promedio),
              iva: parseFloat(item[0].iva),
              precio_subtotal,
              precio_iva,
              precio_total,
              editablePrecio: false,
              itemFromModal: false,
              lotes: lotes,
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
    itemFromModal: boolean,
    det_id?: string
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
      deleteDetalle({
        det_id,
        tipo_documento_id: documentoInfo?.tipo_documento_id,
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

    setDataSource(newData);
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
    // {
    //   title: "IVA %",
    //   key: "iva",
    //   dataIndex: "iva",
    //   align: "center",
    //   width: 60,
    // },
    // {
    //   title: "Precio",
    //   key: "precio",
    //   dataIndex: "precio",
    //   align: "center",
    //   width: 130,
    //   render: (_, { precio }) => {
    //     return <>$ {precio.toLocaleString("es-CO")}</>;
    //   },
    // },
    // {
    //   title: "Subtotal",
    //   key: "precio_subtotal",
    //   dataIndex: "precio_subtotal",
    //   align: "center",
    //   width: 120,
    //   render: (_, { precio_subtotal }) => {
    //     return <>$ {precio_subtotal.toLocaleString("es-CO")}</>;
    //   },
    // },
    // {
    //   title: "IVA",
    //   key: "precio_iva",
    //   dataIndex: "precio_iva",
    //   align: "center",
    //   width: 120,
    //   render: (_, { precio_iva }) => {
    //     return <>$ {precio_iva.toLocaleString("es-CO")}</>;
    //   },
    // },
    // {
    //   title: "Total",
    //   key: "precio_total",
    //   dataIndex: "precio_total",
    //   align: "center",
    //   width: 120,
    //   render: (_, { precio_total }) => {
    //     return <>$ {precio_total.toLocaleString("es-CO")}</>;
    //   },
    // },
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

  const onFinish: SubmitHandler<any> = async (data: any) => {
    setLoader(true);
    setDisableButton(true);
    data = transformToUpperCase(data, ["observacion"]);
    if (id) {
      updateDocumentos(data, id)
        .then(() => {
          notificationApi.open({
            type: "success",
            message: `El Préstamo de Tercero se creó exitosamente.`,
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
            message: `El Préstamo de Tercero se creó exitosamente.`,
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
      {contextHolder}
      <ModalLotes
        openModalLote={openModalLote}
        detalle={dataSource}
        setOpenModalLote={(value: boolean) => setOpenModalLote(value)}
        producto_id={productoId}
        setDetalle={(value: DataType[]) => {
          setDataSource(value);
        }}
      />
      <ModalProductos
        open={openModal}
        setOpen={(value: boolean) => setOpenModal(value)}
        detalle={dataSource}
        handleSelectProducto={(producto: DataType) => {
          setDataSource([...dataSource, producto]);
          setProductoId(producto.key);
          setOpenModalLote(true);
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
              Préstamo de Tercero{" "}
              {id && documentoInfo ? `- ${documentoInfo?.consecutivo}` : null}
            </Title>
          }
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
                  <Col xs={24} sm={24} md={6} lg={8} order={4}>
                    <Controller
                      name="doc_prestamo"
                      control={control.control}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem label={"Documento préstamo:"}>
                          <Input
                            {...field}
                            disabled={["show", "anular"].includes(accion)}
                          />
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
                        onClick={() => setOpenModal(true)}
                      >
                        <Text style={{ color: "white" }}>
                          <PlusOutlined /> Agregar Item
                        </Text>
                      </Button>
                    </Col>
                  )}
                </Row>
              </Col>
              <Col span={24}>
                <Row gutter={[12, 12]}>
                  <Col span={24}>
                    <Table
                      rowKey={(record) => record.key}
                      size="small"
                      scroll={{ y: 700, x: 1000 }}
                      pagination={{
                        simple: false,
                        pageSize: 10,
                      }}
                      dataSource={dataSource}
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
                              cabecera_id={id}
                            />
                          );
                        },
                      }}
                      // summary={() => (
                      //   <>
                      //     {dataSource.length > 0 ? (
                      //       <Table.Summary fixed={"bottom"}>
                      //         <Table.Summary.Row>
                      //           <Table.Summary.Cell
                      //             {...summaryProps.firstCell}
                      //           ></Table.Summary.Cell>
                      //           <Table.Summary.Cell
                      //             {...summaryProps.secondCell}
                      //           >
                      //             <Text strong style={{ fontSize: 12 }}>
                      //               Subtotal:
                      //             </Text>
                      //           </Table.Summary.Cell>
                      //           <Table.Summary.Cell {...summaryProps.thirdCell}>
                      //             <Text strong style={{ fontSize: 12 }}>
                      //               ${" "}
                      //               {control
                      //                 .getValues("subtotal")
                      //                 .toLocaleString("es-CO")}
                      //             </Text>
                      //           </Table.Summary.Cell>
                      //           {["create", "edit"].includes(accion) ? (
                      //             <Table.Summary.Cell
                      //               {...summaryProps.fourthCell}
                      //             ></Table.Summary.Cell>
                      //           ) : null}
                      //         </Table.Summary.Row>
                      //         <Table.Summary.Row>
                      //           <Table.Summary.Cell
                      //             {...summaryProps.firstCell}
                      //           ></Table.Summary.Cell>
                      //           <Table.Summary.Cell
                      //             {...summaryProps.secondCell}
                      //           >
                      //             <Text strong style={{ fontSize: 12 }}>
                      //               IVA:
                      //             </Text>
                      //           </Table.Summary.Cell>
                      //           <Table.Summary.Cell {...summaryProps.thirdCell}>
                      //             <Text strong style={{ fontSize: 12 }}>
                      //               ${" "}
                      //               {control
                      //                 .getValues("iva")
                      //                 .toLocaleString("es-CO")}
                      //             </Text>
                      //           </Table.Summary.Cell>
                      //           {["create", "edit"].includes(accion) ? (
                      //             <Table.Summary.Cell
                      //               {...summaryProps.fourthCell}
                      //             ></Table.Summary.Cell>
                      //           ) : null}
                      //         </Table.Summary.Row>
                      //         <Table.Summary.Row>
                      //           <Table.Summary.Cell
                      //             {...summaryProps.firstCell}
                      //           ></Table.Summary.Cell>
                      //           <Table.Summary.Cell
                      //             {...summaryProps.secondCell}
                      //           >
                      //             <Text strong style={{ fontSize: 12 }}>
                      //               Total:
                      //             </Text>
                      //           </Table.Summary.Cell>
                      //           <Table.Summary.Cell {...summaryProps.thirdCell}>
                      //             <Text strong style={{ fontSize: 12 }}>
                      //               ${" "}
                      //               {control
                      //                 .getValues("total")
                      //                 .toLocaleString("es-CO")}
                      //             </Text>
                      //           </Table.Summary.Cell>
                      //           {["create", "edit"].includes(accion) ? (
                      //             <Table.Summary.Cell
                      //               {...summaryProps.fourthCell}
                      //             ></Table.Summary.Cell>
                      //           ) : null}
                      //         </Table.Summary.Row>
                      //       </Table.Summary>
                      //     ) : (
                      //       <></>
                      //     )}
                      //   </>
                      // )}
                    />
                  </Col>
                </Row>
              </Col>
              <Col
                span={24}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Space>
                  {accion == "create" ? (
                    <Link to={".."} relative="path">
                      <Button
                        type="primary"
                        icon={<ArrowLeftOutlined />}
                        danger
                      >
                        Volver
                      </Button>
                    </Link>
                  ) : (
                    <Link to={"../.."} relative="path">
                      <Button
                        type="primary"
                        icon={<ArrowLeftOutlined />}
                        danger
                      >
                        Volver
                      </Button>
                    </Link>
                  )}
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
        </StyledCard>
      </Spin>
    </>
  );
};
