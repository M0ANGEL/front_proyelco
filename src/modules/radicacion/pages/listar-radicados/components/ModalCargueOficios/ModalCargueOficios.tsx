/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Controller, useForm } from "react-hook-form";
import { UploadOutlined } from "@ant-design/icons";
import { CustomUpload } from "./styled";
import { useState } from "react";
import { Props } from "./types";
import {
  notification,
  UploadProps,
  Typography,
  UploadFile,
  GetProp,
  Select,
  Button,
  Modal,
  Form,
  Spin,
  Col,
  Row,
} from "antd";
import { uploadOficios } from "@/services/radicacion/glosasAPI";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
const { Text } = Typography;

export const ModalCargueOficios = ({ open, setOpen, radicadoId }: Props) => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [flagErrorUpload, setFlagErrorUpload] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [file, setFile] = useState<UploadFile>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const control = useForm();

  const uploadProps: UploadProps = {
    maxCount: 1,
    accept: ".xlsx, .pdf",
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
      setFileList([file]);
      setFlagErrorUpload(false);
      control.clearErrors("upload");
      setFile(file);
      return false;
    },
    fileList,
  };

  const limpiarModal = () => {
    setOpen(false);
    setFlagErrorUpload(false);
    control.clearErrors("upload");
    control.reset({});
    setFileList([]);
    setFile(undefined);
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
      formData.append("oficio", file as FileType);
      if (radicadoId) {
        formData.append("id", radicadoId.toString());
      }
      uploadOficios(formData)
        .then(() => {
          notificationApi.open({
            type: "success",
            message: `Archivo cargado con exito!`,
          });
          limpiarModal();
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
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        destroyOnClose
        onCancel={() => limpiarModal()}
        title={"Cargue de Oficios"}
        key={`modal-oficios-cargue`}
        footer={[]}
        width={800}
        style={{ top: 10 }}
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
                          placeholder="Etapa"
                          options={[
                            { label: "Glosa Inicial", value: "Glosa Inicial" },
                            { label: "No Glosado", value: "No Glosado" },
                            { label: "Devolución", value: "Devolucion" },
                            { label: "Respuesta", value: "Respuesta" },
                            {
                              label: "Ratificación",
                              value: "Ratificacion",
                            },
                            {
                              label: "Conciliación",
                              value: "Conciliacion",
                            },
                          ]}
                        />
                        <Text type="danger">{error?.message}</Text>
                      </StyledFormItem>
                    );
                  }}
                />
              </Col>
              <Col xs={24} lg={12}>
                <Controller
                  name="upload"
                  control={control.control}
                  render={({ fieldState: { error } }) => {
                    return (
                      <StyledFormItem
                        label="Plano:"
                        extra={
                          <Text type="danger">
                            Recordar subir el archivo con el nombre o código del
                            oficio, por ejemplo, 'ORG-V-001.pdf'
                          </Text>
                        }
                      >
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
              <Col xs={24}>
                <StyledFormItem label=" ">
                  <Button block type="primary" htmlType="submit">
                    Subir oficio
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
