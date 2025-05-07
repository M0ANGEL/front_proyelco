/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { cargarPlanoRadicacion } from "@/services/radicacion/radicacionAPI";
import { ModalErroresPlano } from "../ModalErroresPlano";
import { Controller, useForm } from "react-hook-form";
import { UploadOutlined } from "@ant-design/icons";
import { ErroresPlano } from "@/services/types";
import { Props, ResponsePlano } from "./types";
import { useEffect, useState } from "react";
import { CustomUpload } from "./styled";
import {
  notification,
  UploadProps,
  UploadFile,
  Typography,
  GetProp,
  Button,
  Select,
  Modal,
  Form,
  Spin,
  Col,
  Row,
} from "antd";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
const { Text } = Typography;

export const ModalCarguePlano = ({
  open,
  setOpen,
  data_formulario,
  setDetalle,
  setFacturas,
}: Props) => {
  const [showMessageCargue, setShowMessageCargue] = useState<boolean>(false);
  const [disabledInputFile, setDisabledInputFile] = useState<boolean>(true);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [flagErrorUpload, setFlagErrorUpload] = useState<boolean>(false);
  const [erroresPlano, setErroresPlano] = useState<ErroresPlano[]>([]);
  const [openModalErroresPlano, setOpenModalErroresPlano] =
    useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [file, setFile] = useState<UploadFile>();
  const control = useForm();

  const watchTipoCargue = control.watch("tipo_cargue");

  useEffect(() => {
    if (open) {
      control.reset();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      switch (watchTipoCargue) {
        case "factura":
          setDisabledInputFile(false);
          setShowMessageCargue(false);
          break;
        case "cuenta":
          setDisabledInputFile(true);
          setShowMessageCargue(true);
          if ([null, undefined, ""].includes(data_formulario.cta_radicado)) {
            control.setError("upload", {
              type: "required",
              message:
                "Es necesario digitar el Número de Cuenta en el formulario anterior",
            });
            return;
          }
          if ([null, undefined, ""].includes(data_formulario.nro_radicado)) {
            control.setError("upload", {
              type: "required",
              message:
                "Es necesario digitar el Número de Radicado en el formulario anterior",
            });
            return;
          }
          if ([null, undefined, ""].includes(data_formulario.fecha_radicado)) {
            control.setError("upload", {
              type: "required",
              message:
                "Es necesario digitar la Fecha de Radicación en el formulario anterior",
            });
            return;
          }
          setDisabledInputFile(false);
          break;
      }
    }
  }, [open, data_formulario, watchTipoCargue]);

  const uploadProps: UploadProps = {
    maxCount: 1,
    accept: ".csv",
    progress: {
      strokeColor: {
        "0%": "#108ee9",
        "100%": "#87d068",
      },
      size: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
    onRemove: () => {
      setFile(undefined);
    },
    beforeUpload: (file) => {
      setFlagErrorUpload(false);
      control.clearErrors("upload");
      setFile(file);
      return false;
    },
  };

  const onFinish = (data: any) => {
    if (!file) {
      setFlagErrorUpload(true);
      control.setError("upload", {
        type: "required",
        message: "Es necesario cargar un archivo",
      });
      return;
    } else {
      setLoader(true);
      const formData = new FormData();
      formData.append("tipo_cargue", data.tipo_cargue);
      formData.append("archivo", file as FileType);
      Object.entries(data_formulario).forEach((item: any[]) => {
        formData.append(item[0], item[1]);
      });
      cargarPlanoRadicacion(formData)
        .then(
          ({
            data: { status, message, errores, items },
          }: {
            data: ResponsePlano;
          }) => {
            if (errores.length > 0) {
              setErroresPlano(errores);
              setOpenModalErroresPlano(true);
            } else {
              switch (data.tipo_cargue) {
                case "cuenta":
                  setDetalle(
                    items.map((item) => {
                      return {
                        key: item.factura_info.id,
                        fecha_facturacion: item.factura_info.fecha_facturacion,
                        numero_factura_vta:
                          item.factura_info.numero_factura_vta,
                        consecutivo: item.factura_info.dispensacion.consecutivo,
                        cta_radicado: item.cuenta_radicado,
                        descripcion: item.factura_info.convenio.descripcion,
                        total: (
                          parseFloat(item.factura_info.total) -
                          (item.factura_info.dispensacion.valor
                            ? parseFloat(item.factura_info.dispensacion.valor)
                            : 0)
                        ).toString(),
                        nit: item.factura_info.convenio.nit,
                      };
                    })
                  );
                  break;
                case "factura":
                  setFacturas(items);
                  clearValues();
                  break;
              }
            }
            notificationApi.open({
              type: status,
              message,
              duration: 4,
            });
            clearValues();
          }
        )
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
    }
  };

  const clearValues = () => {
    setOpen(false);
    control.reset();
    setFile(undefined);
    control.clearErrors("upload");
    setShowMessageCargue(false);
    setDisabledInputFile(true);
  };

  return (
    <>
      {contextHolder}
      <ModalErroresPlano
        open={openModalErroresPlano}
        setOpen={(value: boolean) => {
          setErroresPlano([]);
          setOpenModalErroresPlano(value);
        }}
        errores={erroresPlano}
      />
      <Modal
        open={open}
        footer={[]}
        title="Cargue de plano radicación"
        onCancel={() => {
          clearValues();
        }}
        destroyOnClose={true}
        maskClosable={false}
        keyboard={false}
        width={800}
        style={{ top: 5 }}
      >
        <Spin spinning={loader}>
          <Form
            layout="vertical"
            onKeyDown={(e: any) =>
              e.key === "Enter" ? e.preventDefault() : null
            }
            onFinish={control.handleSubmit(onFinish)}
          >
            <Row gutter={[12, 12]}>
              <Col xs={24} sm={12}>
                <Controller
                  name="tipo_cargue"
                  control={control.control}
                  rules={{
                    required: {
                      value: true,
                      message: "Tipo de Cargue es requerido",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => {
                    return (
                      <StyledFormItem
                        label="Tipo de Cargue:"
                        extra={
                          showMessageCargue ? (
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              Recuerda que al seleccionar tipo de cargue 'Por
                              cuenta', los campos 'Numero de Cuenta', 'Numero de
                              Radicado' y 'Fecha de Radicado' deben estar
                              diligenciados previamente
                            </Text>
                          ) : null
                        }
                      >
                        <Select
                          {...field}
                          status={error && "error"}
                          options={[
                            { label: "Por Factura", value: "factura" },
                            { label: "Por Cuenta", value: "cuenta" },
                          ]}
                        />
                        <Text type="danger">{error?.message}</Text>
                      </StyledFormItem>
                    );
                  }}
                />
              </Col>
              <Col xs={24} sm={12}>
                <Controller
                  name="upload"
                  control={control.control}
                  render={({ fieldState: { error } }) => {
                    return (
                      <StyledFormItem label="Plano:">
                        <CustomUpload {...uploadProps}>
                          <Button
                            block
                            ghost
                            disabled={disabledInputFile}
                            danger={flagErrorUpload}
                            type="primary"
                            icon={<UploadOutlined />}
                          >
                            Seleccionar archivo
                          </Button>
                        </CustomUpload>
                        <Text type="danger">{error?.message}</Text>
                      </StyledFormItem>
                    );
                  }}
                />
              </Col>
              <Col xs={24} lg={{ offset: 8, span: 8 }}>
                <StyledFormItem label=" ">
                  <Button
                    block
                    type="primary"
                    htmlType="submit"
                    disabled={disabledInputFile}
                  >
                    Subir plano
                  </Button>
                </StyledFormItem>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};
