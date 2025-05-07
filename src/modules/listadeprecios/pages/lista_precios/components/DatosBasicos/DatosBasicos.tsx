/* eslint-disable react-hooks/exhaustive-deps */
import { Notification } from "@/modules/auth/pages/LoginPage/types";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { getEmpresas } from "@/services/maestras/empresasAPI";
import { Col, Input, Row, Select, SelectProps, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { LoadingOutlined } from "@ant-design/icons";
import { ListaPrecios } from "@/services/types";

const { Text } = Typography;

interface Props {
  onPushNotification: (data: Notification) => void;
  listapre?: ListaPrecios;
}

export const DatosBasicos = ({ onPushNotification, listapre }: Props) => {
  const [loaderEmp, setLoaderEmp] = useState<boolean>(false);
  const [selectEmpresa, setSelectEmpresas] = useState<SelectProps["options"]>(
    []
  );
  const methods = useFormContext();

  useEffect(() => {
    methods.reset(
      listapre
        ? {
          codigo: listapre.codigo,
          descripcion: listapre.descripcion,
          estado: listapre.estado,
          nit: listapre.nit,
        }
        : {
          codigo: 'listaprecios',
          descripcion: null,
          estado: 1,
          tercero_id: null,
        }
    );
    setLoaderEmp(false);
    /*
    getEmpresas()
      .then(({ data: { data } }) => {
        const options = data.map((item) => {
          return { label: item.emp_nombre, value: item.id.toString() };
        });
        setSelectEmpresas(options);
        setLoaderEmp(false);
      })
      .catch((error) => {
        onPushNotification({
          type: "error",
          title: error.code,
          description: error.message,
        });
        setLoaderEmp(false);
      });
      */
  }, [listapre]);

  return (
    <>
      <Row gutter={24}>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          {/* <Controller
            name="cod_perfil"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Codigo es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Codigo de perfil">
                <Input
                  {...field}
                  placeholder="Codigo de perfil"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          /> */}
          <Controller
            name="nom_perfil"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Nombre es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Nombre de perfil">
                <Input
                  {...field}
                  placeholder="Nombre de perfil"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="desc_perfil"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Descripcion es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Descripcion">
                <Input
                  {...field}
                  placeholder="Descripcion de perfil"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="id_empresa"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Empresa es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Empresa">
                <Spin spinning={loaderEmp} indicator={<LoadingOutlined spin />}>
                  <Select
                    {...field}
                    options={selectEmpresa}
                    status={error && "error"}
                  />
                </Spin>
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="estado"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Estado es requerido",
              },
            }}
            defaultValue={"1"}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Estado">
                <Select
                  {...field}
                  options={[
                    { value: "0", label: "INACTIVO" },
                    { value: "1", label: "ACTIVO" },
                  ]}
                  status={error && "error"}
                  disabled={!listapre ? true : false}
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
