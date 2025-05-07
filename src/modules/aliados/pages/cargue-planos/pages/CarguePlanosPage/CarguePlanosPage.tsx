/* eslint-disable react-hooks/exhaustive-deps */
import { ErroresAliados, ItemsAliados, ResponsePlanoAliados } from "./types";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { downloadTemplate } from "@/services/documentos/otrosAPI";
import useArrayBuffer from "@/modules/common/hooks/useArrayBuffer";
import { ModalErroresPlano } from "../../components";
import { useNavigate } from "react-router-dom";
import { UserAliados } from "@/services/types";
import { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { CustomUpload } from "./styled";
import { BASE_URL } from "@/config/api";
import {
  createDispensacionesAliados,
  getUserAliado,
} from "@/services/aliados/aliadosAPI";
import {
  DownloadOutlined,
  UploadOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Select,
  SelectProps,
  Space,
  Spin,
  Table,
  UploadProps,
  notification,
} from "antd";

const { info } = Modal;

export const CarguePlanosPage = () => {
  const [selectConvenio, setSelectConvenio] = useState<SelectProps["options"]>(
    []
  );
  const [notificationApi, contextHolder] = notification.useNotification();
  const [erroresPlano, setErroresPlano] = useState<ErroresAliados[]>([]);
  const [itemsAliados, setItemsAliados] = useState<ItemsAliados[]>([]);
  const [aliadoInfo, setAliadoInfo] = useState<UserAliados>();
  const [openModalErroresPlano, setOpenModalErroresPlano] =
    useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const { arrayBufferToString } = useArrayBuffer();
  const navigate = useNavigate();

  useEffect(() => {
    setLoader(true);
    getUserAliado()
      .then(({ data: { data } }) => {
        if (data) {
          setAliadoInfo(data);
          setSelectConvenio([
            {
              label: `${data.aliado.convenio.descripcion} - ${data.aliado.convenio.num_contrato}`,
              value: data.aliado.convenio_id,
            },
          ]);
        } else {
          info({
            title:
              "No tienes un aliado asignado, no puedes realizar ningun cargue",
            icon: <ExclamationCircleFilled />,
            content:
              "Tu usuario no tiene un aliado asignado, por lo tanto no tiene acceso a este módulo, por favor contacta con TI.",
            okText: "Ok",
            okType: "primary",
            keyboard: false,
            onOk() {
              navigate("/dashboard");
            },
          });
        }
      })
      .finally(() => setLoader(false));
  }, []);

  const uploadProps: UploadProps = {
    name: "dispensaciones",
    showUploadList: false,
    action: `${BASE_URL}aliados/cargar-plano`,
    data: { aliado_id: aliadoInfo?.id_aliado },
    method: "POST",
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    maxCount: 1,
    accept: ".xlsx",
    progress: {
      strokeColor: {
        "0%": "#108ee9",
        "100%": "#87d068",
      },
      size: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
    beforeUpload(file) {
      const isExcel =
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      if (!isExcel) {
        notificationApi.open({
          type: "error",
          message: "Solo se admite el formato .xlsx",
          duration: 20,
        });
      }
      return isExcel;
    },
    onChange(info) {
      setLoader(true);
      if (info.file.status !== "uploading") {
        // setDetalle([]);
        // setInitialData([]);
      }
      if (info.file.status === "removed") {
        setLoader(false);
      }
      if (info.file.status === "done") {
        const {
          file: { response },
        } = info;
        const data: ResponsePlanoAliados = response;
        if (data.errores.length > 0) {
          setErroresPlano(data.errores);
          setItemsAliados([]);
          setOpenModalErroresPlano(true);
          setLoader(false);
        } else {
          setItemsAliados(data.items);
          setLoader(false);
        }
        notificationApi.open({
          type: info.file.response.status,
          message: info.file.response.message,
          duration: 20,
        });
      } else if (info.file.status === "error") {
        setItemsAliados([]);
        setLoader(false);
        notificationApi.open({
          type: "error",
          message: info.file.response.message,
          duration: 20,
        });
      }
    },
  };

  const columns: ColumnsType<ItemsAliados> = [
    {
      key: "consecutivo",
      dataIndex: "consecutivo",
      title: "Consecutivo",
      width: 150,
      align: "center",
    },
    {
      key: "fecha_documento",
      dataIndex: "fecha_documento",
      title: "Fecha Documento",
    },
    {
      key: "punto_entrega",
      dataIndex: "punto_entrega",
      title: "Punto Entrega",
      width: 120,
    },
    {
      key: "observaciones",
      dataIndex: "observaciones",
      title: "Observaciones",
      width: 250,
    },
    {
      key: "autorizacion_cabecera",
      dataIndex: "autorizacion_cabecera",
      title: "Autorizacion Cabecera",
    },
    {
      key: "tipo_consulta",
      dataIndex: "tipo_consulta",
      title: "Tipo Consulta",
    },
    {
      key: "fecha_formula",
      dataIndex: "fecha_formula",
      title: "Fecha Formula",
      width: 120,
      align: "center",
    },
    {
      key: "numero_formula",
      dataIndex: "numero_formula",
      title: "Número Formula",
      width: 120,
      align: "center",
    },
    {
      key: "lugar_formula",
      dataIndex: "lugar_formula",
      title: "Lugar Formula",
      width: 200,
      align: "center",
    },
    {
      title: "Paciente",
      children: [
        {
          key: "tipo_documento_paciente",
          dataIndex: "tipo_documento_paciente",
          title: "Tipo Documento",
        },
        {
          key: "numero_documento_paciente",
          dataIndex: "numero_documento_paciente",
          title: "Número Documento",
        },
        {
          key: "nombre_paciente",
          dataIndex: "nombre_paciente",
          title: "Nombre",
        },
      ],
    },
    {
      title: "Médico",
      children: [
        {
          key: "tipo_documento_medico",
          dataIndex: "tipo_documento_medico",
          title: "Tipo Documento",
        },
        {
          key: "numero_documento_medico",
          dataIndex: "numero_documento_medico",
          title: "Número Documento",
        },
        {
          key: "nombre_medico",
          dataIndex: "nombre_medico",
          title: "Nombre",
        },
      ],
    },
    {
      title: "Diagnósticos",
      children: [
        {
          key: "codigo_diagnostico",
          dataIndex: "codigo_diagnostico",
          title: "Principal",
          width: 120,
          align: "center",
        },
        {
          key: "codigo_diagnostico_relacionado",
          dataIndex: "codigo_diagnostico_relacionado",
          title: "Relacionado",
          width: 120,
          align: "center",
        },
      ],
    },
    { key: "despacho", dataIndex: "despacho", title: "Despacho" },
    {
      key: "autorizacion_detalle",
      dataIndex: "autorizacion_detalle",
      title: "Autorizacion Detalle",
    },
    {
      title: "Código Producto",
      children: [
        {
          key: "codigo_producto",
          dataIndex: "codigo_producto",
          title: "Propio",
          width: 120,
          align: "center",
        },
        {
          key: "codigo_producto_sebthi",
          dataIndex: "codigo_producto_sebthi",
          title: "Sebthi",
          width: 120,
          align: "center",
        },
      ],
    },
    {
      key: "lote",
      dataIndex: "lote",
      title: "Lote",
      width: 150,
      align: "center",
    },
    {
      key: "fecha_vencimiento",
      dataIndex: "fecha_vencimiento",
      title: "Fecha Vencimiento",
      width: 150,
      align: "center",
    },
    {
      key: "dias_tratamiento",
      dataIndex: "dias_tratamiento",
      title: "Días Tratamiento",
      width: 120,
      align: "center",
    },
    {
      title: "Cantidades",
      children: [
        {
          key: "cant_solicitada",
          dataIndex: "cant_solicitada",
          title: "Cant. Solicitada",
          width: 120,
          align: "center",
        },
        {
          key: "cant_entregada",
          dataIndex: "cant_entregada",
          title: "Cant. Entregada",
          width: 120,
          align: "center",
        },
      ],
    },
    {
      key: "precio_unitario",
      dataIndex: "precio_unitario",
      title: "Precio Unitario",
      width: 120,
      align: "center",
      render(value) {
        return <>$ {parseFloat(value).toLocaleString("es-CO")}</>;
      },
    },
    {
      key: "precio_subtotal",
      dataIndex: "precio_subtotal",
      title: "Subtotal",
      width: 120,
      align: "center",
      render(value) {
        return <>$ {parseFloat(value).toLocaleString("es-CO")}</>;
      },
    },
    {
      key: "precio_iva",
      dataIndex: "precio_iva",
      title: "Precio Iva",
      width: 120,
      align: "center",
      render(value) {
        return <>$ {parseFloat(value).toLocaleString("es-CO")}</>;
      },
    },
    {
      key: "precio_total",
      dataIndex: "precio_total",
      title: "Total",
      width: 120,
      align: "center",
      render(value) {
        return <>$ {parseFloat(value).toLocaleString("es-CO")}</>;
      },
    },
    {
      key: "modalidad",
      dataIndex: "modalidad",
      title: "Modalidad",
      width: 120,
      align: "center",
    },
    {
      key: "tipo_entrega",
      dataIndex: "tipo_entrega",
      title: "Tipo Entrega",
      width: 120,
      align: "center",
    },
  ];

  const cargarDispensaciones = () => {
    setLoader(true);
    const data = {
      aliado_id: aliadoInfo?.id_aliado,
      convenio_id: aliadoInfo?.aliado.convenio_id,
      items: itemsAliados,
    };
    createDispensacionesAliados(data)
      .then(({ data: { message } }) => {
        notificationApi.success({ message });
        setItemsAliados([]);
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
  };

  return (
    <>
      {contextHolder}
      <ModalErroresPlano
        open={openModalErroresPlano}
        setOpen={(value: boolean) => setOpenModalErroresPlano(value)}
        errores={erroresPlano}
      />
      <StyledCard title={"Cargue Planos"}>
        <Spin spinning={loader}>
          <Row gutter={[12, 12]}>
            <Col span={24}>
              <Row gutter={12}>
                <Col xs={24} sm={12}>
                  <Form.Item>
                    <Select
                      value={aliadoInfo ? aliadoInfo.aliado.convenio_id : ""}
                      options={selectConvenio}
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Space.Compact style={{ width: "100%" }}>
                    <Button
                      icon={<DownloadOutlined />}
                      block
                      onClick={() => {
                        setLoader(true);
                        downloadTemplate(
                          `ExampleUploadPlanoDispensaciones.xlsx`
                        )
                          .then((response) => {
                            const url = window.URL.createObjectURL(
                              new Blob([response.data])
                            );
                            const link = document.createElement("a");
                            link.href = url;
                            link.setAttribute(
                              "download",
                              `ExampleUploadPlanoDispensaciones.xlsx`
                            ); // Utiliza el nombre del archivo proporcionado
                            document.body.appendChild(link);
                            link.click();
                          })
                          .catch(({ response: { data } }) => {
                            const message = arrayBufferToString(data).replace(
                              /[ '"]+/g,
                              " "
                            );
                            notificationApi.open({
                              type: "error",
                              message: message,
                            });
                          })
                          .finally(() => setLoader(false));
                      }}
                    >
                      Descargar
                    </Button>
                    <CustomUpload {...uploadProps}>
                      <Button
                        type="primary"
                        size="middle"
                        icon={<UploadOutlined />}
                        block
                      >
                        Cargar
                      </Button>
                    </CustomUpload>
                  </Space.Compact>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Table
                bordered
                columns={columns}
                scroll={{ x: 3200 }}
                dataSource={itemsAliados}
                rowKey={(record) =>
                  `${record.consecutivo}_${record.codigo_producto}_${record.lote}_${record.fecha_vencimiento}`
                }
                pagination={{
                  simple: false,
                  hideOnSinglePage: true,
                  showSizeChanger: true,
                }}
              />
            </Col>
            <Col
              xs={24}
              sm={{ offset: 4, span: 16 }}
              md={{ offset: 6, span: 12 }}
              lg={{ offset: 8, span: 8 }}
            >
              <Button
                block
                type="primary"
                onClick={() => cargarDispensaciones()}
                disabled={itemsAliados.length == 0}
              >
                Guardar Dispensaciones
              </Button>
            </Col>
          </Row>
        </Spin>
      </StyledCard>
    </>
  );
};
