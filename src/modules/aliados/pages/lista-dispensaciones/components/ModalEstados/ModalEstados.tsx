/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Select,
  Typography,
  Input,
  Spin,
} from "antd";
import { Props } from "./types";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { KEY_MOTIVOS_AUDITORIA } from "@/config/api";
import { Controller, useForm } from "react-hook-form";
import { cambiarEstadoAliados } from "@/services/aliados/aliadosAPI";
import useNotification from "antd/es/notification/useNotification";
import { useEffect, useState } from "react";

const { Text } = Typography;
const { TextArea } = Input;

export const ModalEstados = ({ open, setOpen, dispensaciones }: Props) => {
  const [notificationApi, contextHolder] = useNotification();
  const [loader, setLoader] = useState<boolean>(false);
  const [btnDisable, setBtnDisable] = useState<boolean>(true);
  const { getSessionVariable } = useSessionStorage();
  const control = useForm();
  const watchEstado = control.watch("estado");

  useEffect(() => {
    if (watchEstado) {
      setBtnDisable(false);
    } else {
      setBtnDisable(true);
    }
  }, [watchEstado]);

  const clearValues = (flagEnvio = false) => {
    setOpen(false, flagEnvio);
    control.reset();
  };

  const onFinish = (data: any) => {
    setLoader(true);
    cambiarEstadoAliados({
      ...data,
      ids: dispensaciones,
      tipo_cambio: "masivo",
    })
      .then(() => {
        notificationApi.success({ message: "Cambio de estado exitoso." });
        clearValues(true);
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
      <Modal
        open={open}
        footer={[]}
        onCancel={() => {
          clearValues();
        }}
      >
        <Spin spinning={loader}>
          <Form
            layout="vertical"
            onKeyDown={(e: any) =>
              e.key === "Enter" ? e.preventDefault() : null
            }
            onFinish={control.handleSubmit(onFinish)}
          >
            <Controller
              control={control.control}
              name="estado"
              rules={{
                required: {
                  value: true,
                  message: "Debes seleccionar el estado",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem label={"Estado:"}>
                  <Select
                    {...field}
                    placeholder={"Estados"}
                    style={{ width: "100%" }}
                    status={error && "error"}
                    options={[
                      { label: "RECHAZADO", value: "RECHAZADO" },
                      { label: "PROCESADO", value: "PROCESADO" },
                      // { label: "PAGADO", value: "PAGADO" }, 
                    ]}
                  />
                  <Text type="danger">{error?.message}</Text>
                </StyledFormItem>
              )}
            />
            <Controller
              control={control.control}
              name="observacion"
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem label={"Observación:"}>
                  <TextArea
                    {...field}
                    placeholder={"Observación"}
                    autoSize={{ minRows: 3, maxRows: 4 }}
                  />
                  <Text type="danger">{error?.message}</Text>
                </StyledFormItem>
              )}
            />
            <Controller
              control={control.control}
              name="motivo_id"
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem label={"Motivo:"}>
                  <Select
                    {...field}
                    placeholder={"Motivo"}
                    style={{ width: "100%" }}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toString()
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={JSON.parse(
                      getSessionVariable(KEY_MOTIVOS_AUDITORIA)
                    )}
                  />
                  <Text type="danger">{error?.message}</Text>
                </StyledFormItem>
              )}
            />
            <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
              <Col xs={24} md={{ offset: 5, span: 14 }}>
                <Button
                  block
                  type="primary"
                  htmlType="submit"
                  disabled={btnDisable}
                >
                  Cambiar estados
                </Button>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};
