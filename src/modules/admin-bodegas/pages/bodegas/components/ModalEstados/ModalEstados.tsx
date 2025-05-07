/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Form,
  Modal,
  notification,
  Select,
  Spin,
  Typography,
} from "antd";
import { Props } from "./types";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { changeEstadoInventario } from "@/services/maestras/bodegasAPI";

const { Text } = Typography;

export const ModalEstados = ({ open, setOpen, bodegas }: Props) => {
  const [searchValueSelect, setSearchValueSelect] = useState<string>("");
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loader, setLoader] = useState<boolean>(false);
  const control = useForm();

  const clearValues = () => {
    setOpen(false);
    control.reset();
  };

  const onFinish = (data: any) => {
    setLoader(true);
    changeEstadoInventario(data)
      .then(() => {
        notificationApi.open({
          type: "success",
          message: "Cambio de estado de inventario realizado con éxito!",
        });
        clearValues();
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
        width={800}
        destroyOnClose
        onCancel={() => {
          clearValues();
        }}
        title="Cambiar estado de inventario"
        maskClosable={false}
        keyboard={false}
      >
        <Spin spinning={loader}>
          <Form
            layout="vertical"
            size="large"
            onFinish={control.handleSubmit(onFinish)}
          >
            <Controller
              name="estado_inventario"
              control={control.control}
              rules={{
                required: {
                  value: true,
                  message: "Estado de inventario es requerido",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem required label="Estado Inventario:">
                  <Select
                    {...field}
                    allowClear
                    placeholder="Estado Inventario"
                    status={error && "error"}
                    options={[
                      { value: "0", label: "NO" },
                      { value: "1", label: "SI" },
                    ]}
                  />
                  <Text type="danger">{error?.message}</Text>
                </StyledFormItem>
              )}
            />
            <Controller
              name="bodegas"
              control={control.control}
              rules={{
                required: {
                  value: true,
                  message: "Debes seleccionar al menos una bodega",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem required label="Bodegas:">
                  <Select
                    {...field}
                    allowClear
                    mode="multiple"
                    placeholder="Bodegas"
                    maxTagCount={5}
                    status={error && "error"}
                    searchValue={searchValueSelect}
                    onSearch={(value: string) => {
                      setSearchValueSelect(value);
                    }}
                    onBlur={() => {
                      setSearchValueSelect("");
                    }}
                    options={bodegas.map((bodegas) => ({
                      value: bodegas.key,
                      label: bodegas.bod_nombre,
                    }))}
                    filterOption={(input, option) =>
                      (option?.label?.toString() ?? "")
                        .toLowerCase()
                        .includes(input.toString().toLowerCase())
                    }
                  />
                  <Text type="danger">{error?.message}</Text>
                </StyledFormItem>
              )}
            />
            <StyledFormItem label={" "}>
              <Button htmlType="submit" type="primary" block>
                Cambia estado
              </Button>
            </StyledFormItem>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};
