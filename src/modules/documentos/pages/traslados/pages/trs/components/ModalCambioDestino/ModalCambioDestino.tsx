/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { getBodegasSebthi } from "@/services/maestras/bodegasAPI";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Props } from "./types";
import {
  SelectProps,
  Typography,
  Button,
  Select,
  Modal,
  Form,
  Col,
  Row,
  notification,
  Spin,
} from "antd";
import { cambiarBodegaDestino } from "@/services/documentos/trsAPI";

const { Text } = Typography;

export const ModalCambioDestino = ({
  consecutivo,
  userData,
  setOpen,
  trsID,
  open,
}: Props) => {
  const [optionsBodegas, setOptionsBodegas] = useState<SelectProps["options"]>(
    []
  );
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loader, setLoader] = useState<boolean>(false);
  const control = useForm();

  useEffect(() => {
    if (userData && userData.has_bodegas == "1" && trsID) {
      setLoader(true);
      getBodegasSebthi()
        .then(({ data: { data } }) => {
          const selectBodegas: SelectProps["options"] = [];
          data.forEach((bodega) => {
            if (userData.bodegas_habilitadas.includes(bodega.id)) {
              selectBodegas.push({
                value: bodega.id,
                label: bodega.bod_nombre,
              });
            }
          });
          setOptionsBodegas(selectBodegas);
          control.setValue("trs_id", trsID);
        })
        .finally(() => setLoader(false));
    }
  }, [userData, trsID]);

  const clearValues = () => {
    setOpen(false);
    control.reset();
    setOptionsBodegas([]);
  };

  const checkKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") e.preventDefault();
  };

  const onFinish = (data: any) => {
    setLoader(true);
    cambiarBodegaDestino(data)
      .then(() => {
        clearValues();
        notificationApi.open({
          type: "success",
          message: "Bodega cambiada con exito!",
        });
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
      <Modal
        open={open}
        footer={[]}
        onCancel={() => clearValues()}
        title={`Cambio de destinatario para ${consecutivo}`}
      >
        <Spin spinning={loader}>
          <Form
            layout="vertical"
            onFinish={control.handleSubmit(onFinish)}
            onKeyDown={(e: any) => checkKeyDown(e)}
          >
            <Row gutter={[12, 12]}>
              <Col span={24}>
                <Controller
                  control={control.control}
                  name="bod_destino"
                  rules={{
                    required: {
                      value: true,
                      message: "Debes seleccionar la bodega destino.",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem required label={"Bodega Destino:"}>
                      <Select
                        {...field}
                        options={optionsBodegas}
                        status={error && "error"}
                        placeholder="Seleccione la bodega destino"
                        disabled={!userData || !userData.has_bodegas}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>
              <Col span={24}>
                <Button type="primary" htmlType="submit" block>
                  Cambiar bodega
                </Button>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};
