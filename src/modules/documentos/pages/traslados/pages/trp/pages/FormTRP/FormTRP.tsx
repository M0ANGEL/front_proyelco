/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { DatePicker, InputNumber } from "@/../node_modules/antd/es/index";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getBodega, getBodegasSebthi } from "@/services/maestras/bodegasAPI";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { CheckOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import {
  StyledFormItem,
  StyledCard,
} from "@/modules/common/layout/DashboardLayout/styled";
import { KEY_BODEGA, KEY_EMPRESA } from "@/config/api";
import { useState, useEffect, useMemo } from "react";
import { CamposEstados, DataType } from "./types";
import Title from "antd/es/typography/Title";
import { ColumnsType } from "antd/es/table";
import { Bodega } from "@/services/types";
import {
  validarAccesoDocumento,
  getEstadoTRP,
  getInfoTRP,
  crearTRE,
} from "@/services/documentos/trsAPI";
import dayjs from "dayjs";
import {
  SelectProps,
  notification,
  Typography,
  Tooltip,
  Button,
  Input,
  Table,
  Spin,
  Form,
  Col,
  Row,
} from "antd";
import { fetchUserProfile } from "@/services/auth/authAPI";

const { Text } = Typography;
const { TextArea } = Input;

export const FormTRP = () => {
  const [selectedProducts, setSelectedProducts] = useState<DataType[]>([]);
  const [camposEstados, setCamposEstados] = useState<CamposEstados[]>();
  const [, setOptionsBodegas] = useState<SelectProps["options"]>([]);
  const [api, contextHolder] = notification.useNotification();
  const [hasFuente, setHasFuente] = useState<boolean>(false);
  const [disAccept, setDisAccept] = useState<boolean>(false);
  const [estadosVisibles] = useState<string[]>(["0", "2"]);
  const [bodegaInfo, setBodegaInfo] = useState<Bodega>();
  const [btnBack, setBtnBack] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(true);
  const { getSessionVariable } = useSessionStorage();
  const bodega_id = getSessionVariable(KEY_BODEGA);
  const [accion, setAccion] = useState<string>("");
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const control = useForm({
    mode: "onChange",
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
      ).then(({ data: { data } }) => {
        if (data) {
          const campos = data?.documento_info?.cabeceras?.map((item) => ({
            nombre_campo: item.campo.nombre_campo,
            id_campo: item.id_campo,
            estado: item.estado,
          }));
          setCamposEstados(campos);
          control.setValue("tipo_documento_id", data.documento_info.id);
          if (data.crear !== "1") {
            api.open({
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
          if (data.modificar !== "1") {
            api.open({
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
          if (data.consultar !== "1") {
            api.open({
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
          if (data.anular !== "1") {
            api.open({
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
          api.open({
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
      control.setValue("id_trs", id);
      getInfoTRP(id).then(({ data: { data } }) => {
        if (["2", "3", "4"].includes(data.estado)) {
          const estado =
            data.estado == "2"
              ? "en proceso"
              : data.estado == "3"
              ? "cerrado"
              : "anulado";
          if (["create", "edit", "anular"].includes(accion)) {
            api.open({
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

        if (data.user_acepta !== null) {
          setDisAccept(true);
        }
        setBodegaInfo(data.bod_destino);
        control.setValue("observacion", data.observacion);
        control.setValue("bod_destino", data.bod_origen.bod_nombre);
        control.setValue("bod_origen", data.bod_origen);
        control.setValue("bod_des", data.bod_destino.bod_nombre);
        control.setValue("bod_des_id", data.bod_destino.id);
        control.setValue("bod_ori_id", data.bod_origen.id);
        control.setValue("valor_total", parseInt(data.total));
        control.setValue(
          "fecha",
          dayjs(data.created_at).format("YYYY-MM-DD HH:mm")
        );

        const detalle: any[] = data.detalle.map((item: any) => {
          return {
            key: item.producto.id,
            cantidad: parseInt(item.cantidad),
            descripcion: item.producto.descripcion,
            precio_promedio: item.producto.precio_promedio,
            stock: item.stock,
            lote: item.lote,
            fvence: item.fecha_vencimiento,
            valor: item.valor,
          };
        });

        control.setValue("detalle", detalle);
        setSelectedProducts(detalle);
        setLoader(false);
      });
    } else {
      getBodega(getSessionVariable(KEY_BODEGA)).then(({ data: { data } }) => {
        setBodegaInfo(data);
        control.setValue("bod_origen", data.id);
      });

      getBodegasSebthi().then(({ data: { data } }) => {
        const bodegas = data
          .filter((item) => item.id_empresa == getSessionVariable(KEY_EMPRESA))
          .map((item) => {
            return { label: item.bod_nombre, value: item.id };
          });
        setOptionsBodegas(bodegas);
      });
    }
  }, []);

  useEffect(() => {
    if (accion && ["show"].includes(accion)) {
      setLoader(true);
      getBodega(bodega_id).then(({ data: { data } }) => {
        if (data.estado_inventario == "1") {
          setLoader(true);
          api.error({
            message:
              "La bodega se encuentra en inventario, no es posible realizar ningún movimiento.",
          });
          setTimeout(() => {
            navigate(-1);
          }, 2000);
          return;
        }
      });
    }
  }, [accion]);

  useEffect(() => {
    fetchUserProfile().then(({ data: { userData } }) => {
      if (userData.has_fuentes == "1") {
        setHasFuente(true);
      } else {
        setHasFuente(false);
      }
    });
  }, []);

  useMemo(
    () => control.setValue("detalle", selectedProducts),
    [selectedProducts]
  );

  const columns: ColumnsType<DataType> = [
    {
      title: "Código",
      dataIndex: "key",
      key: "key",
      sorter: (a, b) => a.key.toString().localeCompare(b.key.toString()),
      align: "center",
      fixed: "left",
      width: 100,
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
      sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
      align: "center",
      fixed: "right",
      width: 100,
    },
    {
      title: "Lote",
      dataIndex: "lote",
      key: "lote",
      align: "center",
      fixed: "right",
      width: 90,
    },
    {
      title: "Fecha Vencimiento",
      dataIndex: "fvence",
      key: "fvence",
      sorter: (a, b) => a.fvence.localeCompare(b.fvence),
      align: "center",
      fixed: "right",
      width: 150,
    },
  ];

  const handleCancel = () => {
    navigate(-1);
  };

  const onFinish: SubmitHandler<any> = async (data) => {
    setLoader(true);
    setDisAccept(true);
    setBtnBack(true);
    const dataTRP = await getEstadoTRP(data.id_trs);
    const estadoTRP = dataTRP?.data?.dataEstado;

    if (estadoTRP === "1") {
      crearTRE(data)
        .then(({ data: { id } }) => {
          api.success({ message: "Traslado aceptado con éxito!" });
          setTimeout(() => {
            const url_split = location.pathname.split("/");

            const codigo_documento = id
              ? url_split[url_split.length - 3]
              : url_split[url_split.length - 2];

            codigo_documento.toUpperCase(), getSessionVariable(KEY_EMPRESA);

            navigate(`/${url_split.at(1)}/${url_split.at(2)}/tre/show/${id}`);
          }, 800);
        })
        .catch(
          ({
            response: {
              data: { errors },
            },
          }) => {
            const errores: string[] = Object.values(errors);

            for (const error of errores) {
              api.error({
                message: error,
              });
            }

            setLoader(false);
            setDisAccept(false);
          }
        );
    } else {
      let estado = "";
      switch (estadoTRP) {
        case "3":
          estado = "aceptado";
          break;
        case "4":
          estado = "anulado";
          break;

        default:
          break;
      }
      api.open({
        type: "warning",
        message:
          "No se puede aceptar el traslado ya que se encuentra " +
          estado +
          ", por favor validar.",
      });
      setLoader(false);
      setBtnBack(false);
      return;
    }
  };

  return (
    <>
      <StyledCard
        className="styled-card-documents"
        title={<Title level={4}>Traslados Pendientes Por Aceptar </Title>}
      >
        {contextHolder}

        <Spin spinning={loader}>
          <Form
            layout={"vertical"}
            form={form}
            onFinish={control.handleSubmit(onFinish)}
          >
            <Row gutter={[12, 12]}>
              <Col xs={24}>
                <Row gutter={12}>
                  <Col xs={24} sm={12}>
                    <Controller
                      name="bod_destino"
                      control={control.control}
                      rules={{
                        required: {
                          value: true,
                          message: "Nombre es requerido",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem required label="Bodega Origen:">
                          <Input {...field} disabled />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={24} sm={12}>
                    <Controller
                      name="bod_origen"
                      control={control.control}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem label={"Bodega Ingresa:"}>
                          <Input
                            {...field}
                            disabled
                            value={bodegaInfo?.bod_nombre}
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={24} sm={12}>
                    <Controller
                      name="estado1"
                      control={control.control}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem label={"Estado:"}>
                          <Input
                            {...field}
                            value="Pendiente por aceptar"
                            disabled
                          />

                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={24} sm={12}>
                    <Controller
                      name="fecha"
                      control={control.control}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem required label="Fecha Realizado:">
                          {accion === "show" ? (
                            <Input {...field} disabled />
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
                  {!hasFuente ? (
                    <>
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
                              />
                              <Text type="danger">{error?.message}</Text>
                            </StyledFormItem>
                          )}
                        />
                      </Col>
                      <Col xs={24} md={8}>
                        <Controller
                          control={control.control}
                          name="observacion_Trp"
                          rules={{
                            required: {
                              value: true,
                              message: "Observación trp es requerido",
                            },
                          }}
                          render={({ field, fieldState: { error } }) => (
                            <StyledFormItem
                              required={true}
                              label="Observacion de la Recepcion:"
                            >
                              <TextArea
                                {...field}
                                placeholder="Observación de la Recepcion:"
                                status={error && "error"}
                                autoSize={{ minRows: 2, maxRows: 2 }}
                                maxLength={50}
                                showCount
                              />
                              <Text type="danger">{error?.message}</Text>
                            </StyledFormItem>
                          )}
                        />
                      </Col>
                    </>
                  ) : null}
                  <Col span={24} style={{ marginTop: 15 }}>
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
                              disabled
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
                <Row gutter={12}>
                  <Col span={24} style={{ marginTop: 15 }}>
                    <Table
                      bordered
                      size="small"
                      columns={columns}
                      dataSource={selectedProducts}
                      rowKey={(_record, index) =>
                        index !== undefined ? index.toString() : ""
                      }
                      pagination={{
                        simple: false,
                        hideOnSinglePage: true,
                      }}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={[12, 6]}>
              <Col
                span={24}
                style={{
                  marginTop: "20px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Row gutter={[12, 12]} justify="center">
                  <Col span={24}>
                    <Tooltip
                      title={disAccept ? "El traslado ya fué aceptado" : ""}
                    >
                      <Button
                        type="primary"
                        block
                        htmlType="submit"
                        disabled={disAccept}
                      >
                        <CheckOutlined />
                        Aceptar Traslado
                      </Button>
                    </Tooltip>
                  </Col>
                  <Col span={12}>
                    <Button
                      block
                      onClick={handleCancel}
                      icon={<ArrowLeftOutlined />}
                      type="primary"
                      disabled={btnBack}
                      danger
                    >
                      Volver
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Spin>
      </StyledCard>
    </>
  );
};
