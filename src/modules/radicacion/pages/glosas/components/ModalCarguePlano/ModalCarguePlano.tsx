/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { ErroresGlosas, Props, ResponsePlanoGlosas } from "./types";
import { cargarPlano } from "@/services/radicacion/glosasAPI";
import { ModalErroresPlano } from "../ModalErroresPlano";
import { Controller, useForm } from "react-hook-form";
import { UploadOutlined } from "@ant-design/icons";
import { CustomUpload } from "./styled";
import { useEffect, useState } from "react";
import {
  notification,
  UploadProps,
  // DatePicker,
  UploadFile,
  Typography,
  GetProp,
  Button,
  // Select,
  Modal,
  Form,
  Spin,
  Col,
  Row,
} from "antd";
import dayjs from "dayjs";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
const { Text } = Typography;

export const ModalCarguePlano = ({ open, setOpen }: Props) => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [flagErrorUpload, setFlagErrorUpload] = useState<boolean>(false);
  const [erroresPlano, setErroresPlano] = useState<ErroresGlosas[]>([]);
  const [openModalErroresPlano, setOpenModalErroresPlano] =
    useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [file, setFile] = useState<UploadFile>();
  const control = useForm();

  useEffect(() => {
    if (open) {
      control.reset();
    }
  }, [open]);

  const uploadProps: UploadProps = {
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
      formData.append("etapa", data.etapa);
      formData.append("fecha", dayjs(data.fecha).format("YYYY-MM-DD"));
      formData.append("estados", file as FileType);
      cargarPlano(formData)
        .then(
          ({
            data: { status, message, errores },
          }: {
            data: ResponsePlanoGlosas;
          }) => {
            if (errores.length > 0) {
              setErroresPlano(errores);
              setOpenModalErroresPlano(true);
            }
            notificationApi.open({
              type: status,
              message,
              duration: 20,
            });
            clearValues(true);
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

  const clearValues = (reload_table = false) => {
    setOpen(false, reload_table);
    control.reset();
    setFile(undefined);
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
        title="Cargue de plano glosas"
        onCancel={() => {
          clearValues();
        }}
        destroyOnClose={true}
        maskClosable={false}
        keyboard={false}
        width={800}
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
              {/* <Col xs={24} sm={12}>
                <Controller
                  name="etapa"
                  control={control.control}
                  rules={{
                    required: {
                      value: true,
                      message: "Etapa del proceso es requerido",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => {
                    return (
                      <StyledFormItem label="Etapa:">
                        <Select
                          {...field}
                          status={error && "error"}
                          options={[
                            { label: "Glosa Inicial", value: "fecha_glosa" },
                            { label: "Devolución", value: "devolucion" },
                            { label: "Respuesta", value: "fecha_respuesta" },
                            {
                              label: "Ratificación",
                              value: "fecha_ratificacion",
                            },
                            {
                              label: "Respuesta Ratificación",
                              value: "fecha_rpta_ratificacion",
                            },
                            {
                              label: "Conciliación",
                              value: "fecha_conciliacion",
                            },
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
                  name="fecha"
                  control={control.control}
                  rules={{
                    required: {
                      value: true,
                      message: "Fecha de la etapa es requerida",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => {
                    return (
                      <StyledFormItem label="Fecha notificación:">
                        <DatePicker
                          {...field}
                          status={error && "error"}
                          placeholder="Seleccionar fecha"
                          style={{ width: "100%" }}
                          maxDate={dayjs()}
                        />
                        <Text type="danger">{error?.message}</Text>
                      </StyledFormItem>
                    );
                  }}
                />
              </Col> */}
              <Col xs={24} lg={12}>
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
              <Col xs={24} lg={{ offset: 4, span: 8 }}>
                <StyledFormItem label=" ">
                  <Button block type="primary" htmlType="submit">
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
