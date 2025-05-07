/* eslint-disable react-hooks/exhaustive-deps */
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { getMotivosAud } from "@/services/maestras/motivosAuditoriaAPI";
import useNotification from "antd/es/notification/useNotification";
import useArrayBuffer from "@/modules/common/hooks/useArrayBuffer";
import { KEY_MOTIVOS_AUDITORIA, KEY_ROL } from "@/config/api";
import { DownloadOutlined } from "@ant-design/icons";
import { StyledPanelFilter } from "./styled";
import { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { DataType, Props } from "./types";
import {
  cambiarEstadoAliados,
  downloadSoporte,
  getDispensacionAliado,
} from "@/services/aliados/aliadosAPI";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  SelectProps,
  Space,
  Spin,
  Table,
} from "antd";

const { TextArea } = Input;

export const ModalDetalle = ({
  open,
  setOpen,
  dispensacionId,
  consecutivo,
}: Props) => {
  const [watchCambioEstado, setWatchCambioEstado] = useState<boolean>(false);
  const [selectMotivos, setSelectMotivos] = useState<SelectProps["options"]>(
    []
  );
  const [searchValueSelect, setSearchValueSelect] = useState<string>("");
  const { getSessionVariable } = useSessionStorage();
  const [user_rol] = useState<string>(getSessionVariable(KEY_ROL));
  const [loaderTable, setLoaderTable] = useState<boolean>(false);
  const [notificationApi, contextHolder] = useNotification();
  const [files, setFiles] = useState<{ url: string }[]>([]);
  const [detalle, setDetalle] = useState<DataType[]>([]);
  const { arrayBufferToString } = useArrayBuffer();
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && dispensacionId) {
      setLoaderTable(true);
      getDispensacionAliado(dispensacionId)
        .then(({ data: { data } }) => {
          form.setFieldsValue(data);
          data.estado_auditoria == "PAGADO"
            ? setWatchCambioEstado(false)
            : null;
          if (data.files.length > 0) {
            setFiles(data.files.map((item) => ({ url: item })));
          }
          setDetalle(
            data.detalle.map((item) => {
              return {
                key: item.id,
                codigo_producto: item.codigo_producto,
                codigo_sebthi: item.producto_id,
                descripcion: item.producto.descripcion,
                dias_tratamiento: parseInt(item.dias_tratamiento),
                cant_solicitada: parseInt(item.cant_solicitada),
                cant_entregada: parseInt(item.cant_entregada),
                lote: item.lote,
                fecha_vencimiento: item.fecha_vencimiento,
                precio_unitario: parseFloat(item.precio_unitario),
                precio_iva: parseFloat(item.precio_iva),
                precio_subtotal: parseFloat(item.precio_subtotal),
                precio_total: parseFloat(item.precio_total),
                motivo_id: item.motivo_id,
              };
            })
          );
        })
        .finally(() => setLoaderTable(false));

      if (!getSessionVariable(KEY_MOTIVOS_AUDITORIA)) {
        getMotivosAud().then(({ data: { data } }) => {
          setSelectMotivos(
            data.map((item) => ({
              label: `${item.codigo} - ${item.motivo}`,
              value: item.id.toString(),
            }))
          );
        });
      } else {
        setSelectMotivos(JSON.parse(getSessionVariable(KEY_MOTIVOS_AUDITORIA)));
      }
    }
  }, [open, dispensacionId]);

  const columns: ColumnsType<DataType> = [
    {
      key: "codigo_producto",
      dataIndex: "codigo_producto",
      title: "Código Producto",
      align: "center",
      fixed: "left",
      width: 150,
    },
    {
      key: "codigo_sebthi",
      dataIndex: "codigo_sebthi",
      title: "Código Sebthi",
      align: "center",
      fixed: "left",
      width: 100,
    },
    {
      key: "descripcion",
      dataIndex: "descripcion",
      title: "Desc. Sebthi",
      width: 500,
    },
    {
      key: "dias_tratamiento",
      dataIndex: "dias_tratamiento",
      title: "Días Tratamiento",
      align: "center",
      width: 100,
    },
    {
      key: "cant_solicitada",
      dataIndex: "cant_solicitada",
      title: "Cant. Solicitada",
      align: "center",
      width: 100,
    },
    {
      key: "cant_entregada",
      dataIndex: "cant_entregada",
      title: "Cant. Entregada",
      align: "center",
      width: 100,
    },
    {
      key: "lote",
      dataIndex: "lote",
      title: "Lote",
      align: "center",
      width: 120,
    },
    {
      key: "fecha_vencimiento",
      dataIndex: "fecha_vencimiento",
      title: "Fecha Vencimiento",
      align: "center",
      width: 120,
    },
    {
      key: "precio_unitario",
      dataIndex: "precio_unitario",
      title: "Precio Unitario",
      align: "center",
      width: 120,
      render(value: number) {
        return <>$ {value.toLocaleString("es-CO")}</>;
      },
    },
    {
      key: "precio_subtotal",
      dataIndex: "precio_subtotal",
      title: "Subtotal",
      align: "center",
      width: 120,
      render(value: number) {
        return <>$ {value.toLocaleString("es-CO")}</>;
      },
    },
    {
      key: "precio_iva",
      dataIndex: "precio_iva",
      title: "IVA",
      align: "center",
      width: 120,
      render(value: number) {
        return <>$ {value.toLocaleString("es-CO")}</>;
      },
    },
    {
      key: "precio_total",
      dataIndex: "precio_total",
      title: "Total",
      align: "center",
      width: 120,
      render(value: number) {
        return <>$ {value.toLocaleString("es-CO")}</>;
      },
    },
  ];
  if (["administrador", "auditoria"].includes(user_rol)) {
    columns.push({
      key: "motivo_id",
      dataIndex: "motivo_id",
      title: "Motivo",
      align: "center",
      width: 500,
      render(_, { motivo_id }, index) {
        return (
          <StyledFormItem>
            <Select
              showSearch
              placeholder="Motivo"
              options={selectMotivos}
              defaultValue={motivo_id}
              searchValue={searchValueSelect}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              onChange={(value: string) => {
                setDetalle(
                  detalle.map((item, indexDetalle) => {
                    if (index == indexDetalle) {
                      return { ...item, motivo_id: value };
                    } else {
                      return item;
                    }
                  })
                );
              }}
              onBlur={() => {
                setSearchValueSelect("");
              }}
              onSearch={(value: string) => {
                setSearchValueSelect(value);
              }}
              disabled={form.getFieldValue("estado_auditoria") === "PAGADO"}
            />
          </StyledFormItem>
        );
      },
    });
  }

  const cambiarEstado = () => {
    const data = {
      dispensacion_id: form.getFieldValue("id"),
      estado: form.getFieldValue("estado_auditoria"),
      observacion: form.getFieldValue("observacion_auditoria"),
      motivo_id: form.getFieldValue("motivo_id"),
      tipo_cambio: "individual",
      detalle,
    };
    setLoaderTable(true);
    cambiarEstadoAliados(data)
      .then(() => {
        notificationApi.success({ message: "Cambio de estado exitoso." });
        setOpen(false, true);
        setWatchCambioEstado(false);
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
      .finally(() => setLoaderTable(false));
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        footer={[]}
        width={1200}
        title={`Detalle de la dispensación - ${consecutivo}`}
        onCancel={() => {
          setOpen(false, false);
          setWatchCambioEstado(false);
          setDetalle([]);
          form.resetFields();
          setFiles([]);
        }}
        style={{ top: 20 }}
      >
        <Spin spinning={loaderTable}>
          <Form layout="vertical" form={form}>
            <Row gutter={12}>
              <Col xs={24} sm={4}>
                <StyledFormItem name={"consecutivo"} label={"Consecutivo:"}>
                  <Input disabled />
                </StyledFormItem>
              </Col>
              <Col xs={24} sm={8}>
                <StyledFormItem
                  name={"autorizacion_cabecera"}
                  label={"Autorizacion Cabecera:"}
                >
                  <Input disabled />
                </StyledFormItem>
              </Col>
              <Col xs={24} sm={6}>
                <StyledFormItem name={"punto_entrega"} label={"Punto Entrega:"}>
                  <Input disabled />
                </StyledFormItem>
              </Col>
              <Col xs={24} sm={6}>
                <StyledFormItem
                  name={"fecha_documento"}
                  label={"Fecha Documento:"}
                >
                  <Input disabled />
                </StyledFormItem>
              </Col>
              <Col xs={24} sm={6}>
                <StyledFormItem
                  name={"tipo_documento_paciente"}
                  label={"Tipo Documento Paciente:"}
                >
                  <Input disabled style={{ textAlign: "center" }} />
                </StyledFormItem>
              </Col>
              <Col xs={24} sm={6}>
                <StyledFormItem
                  name={"numero_documento_paciente"}
                  label={"Número Documento Paciente:"}
                >
                  <Input disabled />
                </StyledFormItem>
              </Col>
              <Col xs={24} sm={12}>
                <StyledFormItem
                  name={"nombre_paciente"}
                  label={"Nombre Paciente:"}
                >
                  <Input disabled />
                </StyledFormItem>
              </Col>
              <Col xs={24} sm={6}>
                <StyledFormItem
                  name={"tipo_documento_medico"}
                  label={"Tipo Documento Médico:"}
                >
                  <Input disabled style={{ textAlign: "center" }} />
                </StyledFormItem>
              </Col>
              <Col xs={24} sm={6}>
                <StyledFormItem
                  name={"numero_documento_medico"}
                  label={"Número Documento Médico:"}
                >
                  <Input disabled />
                </StyledFormItem>
              </Col>
              <Col xs={24} sm={12}>
                <StyledFormItem name={"nombre_medico"} label={"Nombre Médico:"}>
                  <Input disabled />
                </StyledFormItem>
              </Col>
              <Col xs={24} sm={8}>
                <StyledFormItem
                  name={"codigo_diagnostico"}
                  label={"Código Diagnóstico:"}
                >
                  <Input disabled />
                </StyledFormItem>
              </Col>
              <Col xs={24} sm={8}>
                <StyledFormItem
                  name={"codigo_diagnostico_relacionado"}
                  label={"Código Diagnóstico Relacionado:"}
                >
                  <Input disabled />
                </StyledFormItem>
              </Col>
              <Col xs={24} sm={8}>
                <StyledFormItem name={"tipo_consulta"} label={"Tipo Consulta:"}>
                  <Input disabled />
                </StyledFormItem>
              </Col>
              <Col xs={24} sm={6}>
                <StyledFormItem name={"fecha_formula"} label={"Fecha Formula:"}>
                  <Input disabled />
                </StyledFormItem>
              </Col>
              <Col xs={24} sm={6}>
                <StyledFormItem
                  name={"numero_formula"}
                  label={"Número Formula:"}
                >
                  <Input disabled />
                </StyledFormItem>
              </Col>
              <Col xs={24} sm={6}>
                <StyledFormItem name={"lugar_formula"} label={"Lugar Formula:"}>
                  <Input disabled />
                </StyledFormItem>
              </Col>
              <Col xs={24} sm={6}>
                <StyledFormItem name={"despacho"} label={"Despacho:"}>
                  <Input disabled />
                </StyledFormItem>
              </Col>
              <Col xs={24} sm={12}>
                <StyledFormItem name={"modalidad"} label={"Modalidad:"}>
                  <Input disabled />
                </StyledFormItem>
              </Col>
              <Col xs={24} sm={12}>
                <StyledFormItem name={"tipo_entrega"} label={"Tipo Entrega:"}>
                  <Input disabled />
                </StyledFormItem>
              </Col>
              <Col xs={24} sm={24}>
                <StyledFormItem name={"observaciones"} label={"Observaciones:"}>
                  <TextArea disabled autoSize={{ minRows: 3, maxRows: 4 }} />
                </StyledFormItem>
              </Col>
            </Row>
            {["administrador", "auditoria"].includes(user_rol) ? (
              <StyledPanelFilter>
                <Row gutter={[12, 12]}>
                  <Col xs={24} md={4}>
                    <StyledFormItem
                      name={"estado_auditoria"}
                      label={"Estado Auditoria:"}
                    >
                      <Select
                        options={[
                          {
                            label: "CARGADO",
                            value: "CARGADO",
                            disabled: true,
                          },
                          {
                            label: "RECARGADO",
                            value: "RECARGADO",
                            disabled: true,
                          },
                          { label: "RECHAZADO", value: "RECHAZADO" },
                          { label: "PROCESADO", value: "PROCESADO" },
                          // {
                          //   label: "PAGADO",
                          //   value: "PAGADO",
                          //   disabled:
                          //     form.getFieldValue("estado_auditoria") !=
                          //     "FACTURADO",
                          // },
                        ]}
                        onChange={() => {
                          setWatchCambioEstado(true);
                        }}
                        disabled={
                          form.getFieldValue("estado_auditoria") === "PAGADO"
                        }
                      />
                    </StyledFormItem>
                  </Col>
                  <Col xs={24} md={10}>
                    <StyledFormItem
                      name={"observacion_auditoria"}
                      label={"Observacion Auditoría:"}
                    >
                      <TextArea
                        placeholder={"Observación auditoría"}
                        autoSize={{ minRows: 3, maxRows: 4 }}
                        disabled={
                          form.getFieldValue("estado_auditoria") === "PAGADO"
                        }
                      />
                    </StyledFormItem>
                  </Col>
                  <Col xs={24} md={10}>
                    <StyledFormItem name={"motivo_id"} label={"Motivo:"}>
                      <Select
                        showSearch
                        placeholder="Motivo"
                        options={selectMotivos}
                        searchValue={searchValueSelect}
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toString()
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        onBlur={() => {
                          setSearchValueSelect("");
                        }}
                        onSearch={(value: string) => {
                          setSearchValueSelect(value);
                        }}
                        disabled={
                          form.getFieldValue("estado_auditoria") === "PAGADO"
                        }
                      />
                    </StyledFormItem>
                  </Col>
                  <Col xs={24} md={{ offset: 8, span: 8 }}>
                    <Button
                      block
                      type="primary"
                      htmlType="button"
                      onClick={cambiarEstado}
                      disabled={!watchCambioEstado}
                    >
                      Cambiar estado
                    </Button>
                  </Col>
                </Row>
              </StyledPanelFilter>
            ) : null}
            {files.length > 0 ? (
              <Row>
                <Col
                  xs={24}
                  md={{ offset: 6, span: 12 }}
                  lg={{ offset: 7, span: 10 }}
                >
                  <Table
                    bordered
                    dataSource={files}
                    columns={[
                      {
                        title: "Soporte",
                        key: "url",
                        dataIndex: "url",
                        render(value) {
                          const urlSplit = value.split("/");
                          const name = urlSplit[urlSplit.length - 1];

                          return <>{name}</>;
                        },
                      },
                      {
                        title: "Acciones",
                        dataIndex: "acciones",
                        key: "acciones",
                        align: "center",
                        width: 100,
                        render(_, { url }) {
                          const urlSplit = url.split("/");
                          const name = urlSplit[urlSplit.length - 1];
                          return (
                            <>
                              <Space>
                                <Button
                                  key={`button-${url}`}
                                  type="primary"
                                  icon={<DownloadOutlined />}
                                  onClick={() => {
                                    setLoaderTable(true);
                                    downloadSoporte(url)
                                      .then((response) => {
                                        const url = window.URL.createObjectURL(
                                          new Blob([response.data])
                                        );
                                        const link =
                                          document.createElement("a");
                                        link.href = url;
                                        link.setAttribute("download", name);
                                        document.body.appendChild(link);
                                        link.click();
                                      })
                                      .catch(({ response: { data } }) => {
                                        const message = arrayBufferToString(
                                          data
                                        ).replace(/[ '"]+/g, " ");
                                        notificationApi.open({
                                          type: "error",
                                          message: message,
                                        });
                                      })
                                      .finally(() => setLoaderTable(false));
                                  }}
                                />
                              </Space>
                            </>
                          );
                        },
                      },
                    ]}
                    size="small"
                    title={() => <>Soportes Cargados</>}
                    pagination={false}
                  />
                </Col>
              </Row>
            ) : null}
            <Table
              bordered
              size="small"
              columns={columns}
              dataSource={detalle}
              // loading={loaderTable}
              scroll={{ x: 1900 }}
              pagination={{ hideOnSinglePage: true, simple: false }}
              style={{ marginTop: 10 }}
            />
          </Form>
        </Spin>
      </Modal>
    </>
  );
};
