/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getBodega, getBodegasSebthi } from "@/services/maestras/bodegasAPI";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { cambiarEstadoTRE } from "@/services/documentos/trsAPI";
import {
  StyledFormItem,
  StyledCard,
} from "@/modules/common/layout/DashboardLayout/styled";
import { KEY_BODEGA, KEY_EMPRESA } from "@/config/api";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useState, useEffect, useMemo } from "react";
import { CamposEstados, DataType } from "./types";
import Title from "antd/es/typography/Title";
import { ColumnsType } from "antd/es/table";
import {
  validarAccesoDocumento,
  getInfoTRE,
  crearTRE,
} from "@/services/documentos/trsAPI";
import {
  notification,
  SelectProps,
  Typography,
  Button,
  Input,
  Table,
  Form,
  Spin,
  Col,
  Row,
} from "antd";
import dayjs from "dayjs";

const { Text } = Typography;
const { TextArea } = Input;

export const FormTRE = () => {
  const [selectedProducts, setSelectedProducts] = useState<DataType[]>([]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [camposEstados, setCamposEstados] = useState<CamposEstados[]>();
  const [, setOptionsBodegas] = useState<SelectProps["options"]>([]);
  const [estadosVisibles] = useState<string[]>(["0", "2"]);
  const [loader, setLoader] = useState<boolean>(true);
  const { getSessionVariable } = useSessionStorage();
  const bodega_id = getSessionVariable(KEY_BODEGA);
  const [, setLoaderSave] = useState<boolean>(true);
  const [estadoBtn, setEstadoBtn] = useState(null);
  const [accion, setAccion] = useState<string>("");
  const [idcreado, setIdcreado] = useState("");
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
          if (data.modificar !== "1") {
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
          if (data.consultar !== "1") {
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
          if (data.anular !== "1") {
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
      control.setValue("id_trs", id);
      getInfoTRE(id).then(({ data: { data } }: any) => {
        setIdcreado(data.tre_id);
        if (["2", "3", "4"].includes(data.estado)) {
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
        control.setValue("observacion", data.observacion);
        control.setValue("bod_destino", data.bod_origen);
        control.setValue("bod_origen", data.bod_origen.bod_nombre);
        control.setValue("bod_des", data.bod_destino.bod_nombre);
        control.setValue("bod_des_id", data.bod_destino.id);
        control.setValue("estado", data.estado_label);
        control.setValue(
          "fecha",
          dayjs(data.created_at).format("YYYY-MM-DD HH:mm")
        );
        setEstadoBtn(data.estado_label);

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

        const detalle: DataType[] = data.detalle.map((item: any) => {
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
    if (accion && !["show"].includes(accion)) {
      setLoader(true);
      getBodega(bodega_id).then(({ data: { data } }) => {
        if (data.estado_inventario == "1") {
          setLoader(true);
          notificationApi.error({
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
    setLoaderSave(true);
    crearTRE(data)
      .then(() => {
        notificationApi.open({
          type: "success",
          message: "Traslado aceptado con exito!",
        });
        setTimeout(() => {
          navigate(-1);
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
            notificationApi.open({
              type: "error",
              message: error,
            });
          }

          setLoaderSave(false);
        }
      );
  };

  const anularDocumento = () => {
    const data = {
      tre_id: id,
      accion: "anular",
    };
    cambiarEstadoTRE(data)
      .then(() => {
        notificationApi.open({
          type: "success",
          message: `Se ha anulado el documento con éxito!`,
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

  return (
    <>
      {contextHolder}
      <Spin spinning={loader}>
        <StyledCard
          className="styled-card-documents"
          title={
            <Title level={4}>
              Traslados Entrada {id && idcreado ? `- ${idcreado}` : null}
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
                  <Col xs={24} sm={12}>
                    <Controller
                      name="bod_origen"
                      control={control.control}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem label={"Bodega Origen:"}>
                          <Input {...field} disabled />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={24} sm={12}>
                    <Controller
                      name="bod_des"
                      control={control.control}
                      rules={{
                        required: {
                          value: true,
                          message: "Nombre es requerido",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem required label="Bodega Entrada:">
                          <Input {...field} disabled />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={24} sm={12}>
                    <Controller
                      name="estado"
                      control={control.control}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem label={"Estado:"}>
                          <Input {...field} disabled />

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
                          <Input {...field} disabled />
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
              </Col>
              <Col span={24} style={{ marginTop: 15 }}>
                <Row gutter={[12, 12]}>
                  <Col span={24}>
                    <Table
                      rowKey={(record) => record.key}
                      size="small"
                      scroll={{ y: 300 }}
                      pagination={{
                        simple: false,
                        hideOnSinglePage: true,
                      }}
                      bordered
                      dataSource={selectedProducts}
                      columns={columns}
                    ></Table>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={[12, 6]}>
              <Col
                span={24}
                style={{
                  marginTop: "20px",
                  justifyContent: "center",
                }}
              >
                <Row gutter={[12, 12]} justify="center">
                  <Col span={6}>
                    <Button block danger type="primary" onClick={handleCancel}>
                      <ArrowLeftOutlined />
                      Volver
                    </Button>
                  </Col>
                </Row>
                {accion === "anular" && estadoBtn === "Aceptado" ? (
                  <Row gutter={[12, 12]} justify="center">
                    <Col span={24}>
                      <Button
                        type="primary"
                        danger
                        block
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
        </StyledCard>
      </Spin>
    </>
  );
};
