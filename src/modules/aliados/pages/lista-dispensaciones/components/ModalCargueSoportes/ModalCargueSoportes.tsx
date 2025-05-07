/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import useNotification from "antd/es/notification/useNotification";
import { Controller, useForm } from "react-hook-form";
import { InboxOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { BASE_URL } from "@/config/api";
import { Props } from "./types";
import {
  Col,
  Form,
  Modal,
  Row,
  Select,
  Upload,
  Typography,
  UploadProps,
  Spin,
  Table,
} from "antd";
import { ExportExcel } from "@/modules/common/components/ExportExcel/ExportExcel";

const { Text } = Typography;
const { Dragger } = Upload;

export const ModalCargueSoportes = ({
  open,
  setOpen,
  aliado_id,
  selectAliados,
}: Props) => {
  const [uploadDisabled, setUploadDisabled] = useState<boolean>(true);
  const [notificationApi, contextHolder] = useNotification();
  const controlSoportes = useForm();
  const watchAliado = controlSoportes.watch("aliado_id");
  const [loader, setLoader] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      if (aliado_id) {
        setUploadDisabled(false);
        controlSoportes.setValue("aliado_id", aliado_id);
      }
    }
  }, [aliado_id, open]);

  useEffect(() => {
    if (!["", undefined].includes(watchAliado)) {
      setUploadDisabled(false);
    }
  }, [watchAliado]);

  const clearValues = () => {
    setOpen(false);
    controlSoportes.reset();
    setUploadDisabled(true);
  };

  const uploadProps: UploadProps = {
    name: "zip",
    multiple: false,
    action: `${BASE_URL}aliados/upload-soportes-masivo`,
    data: { aliado_id: controlSoportes.getValues("aliado_id") },
    method: "POST",
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    maxCount: 1,
    accept: ".zip",
    progress: {
      strokeColor: {
        "0%": "#108ee9",
        "100%": "#87d068",
      },
      size: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
    onChange(info) {
      const { status } = info.file;
      setLoader(true);
      if (status !== "uploading") {
        // console.log(info.file, info.fileList);
      }
      if (status === "done") {
        if (info.file.response.consecutivos_sin_folder.length > 0) {
          Modal.info({
            title: "Dispensaciones que no existen o no partenecen al aliado",
            onOk() {
              clearValues();
            },
            content: (
              <>
                <Row gutter={[12, 2]}>
                  <Col xs={24}>
                    <Table
                      bordered
                      size="small"
                      dataSource={info.file.response.consecutivos_sin_folder}
                      columns={[{ title: "Consecutivo", align: "center" }]}
                      pagination={{
                        simple: false,
                        hideOnSinglePage: true,
                        showSizeChanger: false,
                      }}
                    />
                  </Col>
                  <Col xs={24}>
                    <ExportExcel
                      excelData={info.file.response.consecutivos_sin_folder.map(
                        (item: any) => ({
                          Consecutivo: item,
                        })
                      )}
                      fileName={"AlertasConsecutivos"}
                    />
                  </Col>
                </Row>
              </>
            ),
          });
        }
        if (info.file.response.consecutivos_sin_cargue.length > 0) {
          Modal.warning({
            title:
              "Dispensaciones que ya cambiaron de estado y no se puede volver a cargar soportes",
            onOk() {
              clearValues();
            },
            content: (
              <>
                <Row gutter={[12, 2]}>
                  <Col xs={24}>
                    <Table
                      bordered
                      size="small"
                      dataSource={info.file.response.consecutivos_sin_cargue}
                      columns={[{ title: "Consecutivo", align: "center" }]}
                      pagination={{
                        simple: false,
                        hideOnSinglePage: true,
                        showSizeChanger: false,
                      }}
                    />
                  </Col>
                  <Col xs={24}>
                    <ExportExcel
                      excelData={info.file.response.consecutivos_sin_cargue.map(
                        (item: any) => ({
                          Consecutivo: item,
                        })
                      )}
                      fileName={"ConsecutivosSinPermisos"}
                    />
                  </Col>
                </Row>
              </>
            ),
            style: { top: 10 },
          });
        }
        notificationApi.open({
          type: "success",
          message: `Archivo ${info.file.name} cargado correctamente.`,
        });
        clearValues();
        setLoader(false);
      } else if (status === "error") {
        notificationApi.open({
          type: "error",
          message: `Hubo un problema con la carga del archivo: ${info.file.name}`,
          description: info.file.response.message,
          duration: 4,
        });
        setLoader(false);
      }
    },
    style: {
      minHeight: 250,
    },
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        onCancel={() => clearValues()}
        footer={[]}
        title={"Cargue de soportes"}
        width={800}
      >
        <Spin spinning={loader}>
          <Form
            layout="vertical"
            onKeyDown={(e: any) =>
              e.key === "Enter" ? e.preventDefault() : null
            }
          >
            <Row gutter={[12, 12]}>
              {!aliado_id ? (
                <Col xs={24}>
                  <Controller
                    control={controlSoportes.control}
                    name="aliado_id"
                    rules={{
                      required: {
                        value: true,
                        message: "Debes seleccionar un aliado.",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => {
                      return (
                        <StyledFormItem>
                          <Select
                            {...field}
                            placeholder={"Aliado"}
                            style={{ width: "100%" }}
                            options={selectAliados}
                            status={error && "error"}
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      );
                    }}
                  />
                </Col>
              ) : null}

              <Col xs={24}>
                <StyledFormItem>
                  <Dragger {...uploadProps} disabled={uploadDisabled}>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      Haga clic o arrastre el archivo a esta área para cargarlo
                    </p>
                    <p className="ant-upload-hint">
                      Soporte para una carga única o masiva. <br />
                      Está estrictamente prohibido cargar datos personales.
                    </p>
                  </Dragger>
                </StyledFormItem>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};
