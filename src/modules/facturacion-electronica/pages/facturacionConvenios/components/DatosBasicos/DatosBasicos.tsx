/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import {
  Col,
  Row,
  Select,
  SelectProps,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import {
  getConvenios,
  getUsers
} from "@/services/facturacion/facturacionConveniosAPI";
import { Controller, useFormContext } from "react-hook-form";
import { ConveniosFacturacion, UsuariosFacturacion } from "@/services/types";


const { Text } = Typography;
interface Props {
  onPushNotification: (data: Notification) => void;
  convenioFacturacion?: ConveniosFacturacion;
  // usuariosFacturacion?: UsuariosFacturacion
}

export const DatosBasicos = ({onPushNotification, convenioFacturacion }: Props) => {
  const [selectConvenios, setSelectConvenios] = useState<SelectProps["options"]>(
    []
  );
  const [selectUsers, setSelectUsers] = useState<SelectProps["options"]>(
    []
  );

  const methods = useFormContext();
  useEffect(() => {
    methods.reset(
      convenioFacturacion
        ? {
            convenio: convenioFacturacion.descripcion,
            convenio_id:convenioFacturacion.convenio_id,
            user_id:convenioFacturacion.user_id,
          }
        : {
          convenio: null,
          convenio_id: null,
          user_id: null,
          }
    );
    getConvenios()
    .then(({ data: { data } }) => {

      const options = data.map((item:any) => {
        return { label: item.descripcion, value: item.id.toString() };
      });
      setSelectConvenios(options);
      // setLoaderEmp(false);
    })
    .catch((error) => {
      onPushNotification({
        type: "error",
        title: error.code,
        description: error.message,
      });
      // setLoaderEmp(false);
    });

    getUsers()
    .then(({ data: { data } }) => {

      const options = data.map((item:any) => {
        return { label: item.nombre, value: item.id.toString() };
      });
      setSelectUsers(options);
      // setLoaderEmp(false);
    })
    .catch((error) => {
      onPushNotification({
        type: "error",
        title: error.code,
        description: error.message,
      });
      // setLoaderEmp(false);
    });

  }, [convenioFacturacion]);


  return (
    <>
      <Row gutter={24}>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="convenio_id"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Convenio es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Convenios :">
                <Select
                  {...field}
                  allowClear
                  showSearch
                  placeholder="Convenio"
                  status={error && "error"}
                  options={selectConvenios}
                  optionFilterProp="label"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toString()
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  disabled={convenioFacturacion !=null ? true:false}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="user_id"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Usuario es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Usuario :">
                <Select
                  {...field}
                  allowClear
                  showSearch
                  options={selectUsers}
                  placeholder="Usuario"
                  optionFilterProp="label"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toString()
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  status={error && "error"}
                  
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
      </Row>
    </>
  );
};
