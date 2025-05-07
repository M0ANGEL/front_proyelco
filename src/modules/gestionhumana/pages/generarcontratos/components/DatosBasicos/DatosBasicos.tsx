import { Col, Row, Select, SelectProps, Spin, Typography } from "antd";
import { getEmpleados } from "@/services/maestras/empleadosAPI";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { LoadingOutlined, UploadOutlined } from "@ant-design/icons";

const { Text } = Typography

export const DatosBasicos = () => {

  const methods = useFormContext()
  const [selectEmpleado, setSelectEmpleado] = useState<SelectProps["options"]>([])
  const [loaderEmp, setLoaderEmp] = useState<boolean>(true)


  useEffect(() => {

    getEmpleados().then(({ data: { data } }) => {
      const options = data.map((item) => {
        return { label: item.nombre_completo, value: item.id.toString() };
      });
      setSelectEmpleado(options)
      setLoaderEmp(false);
    })
      .catch((error) => {
        setLoaderEmp(false);
        console.log("error", error)
      });
  }, [])

  return (
    <>
      <Row gutter={24}>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="empleado"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Empleado es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Empleado">
                <Spin spinning={loaderEmp} indicator={<LoadingOutlined spin />}>
                  <Select
                    {...field}
                    showSearch
                    allowClear
                    filterSort={(optionA, optionB) =>
                      (optionA?.label ?? "")
                        .toString()
                        .toLowerCase()
                        .localeCompare(
                          (optionB?.label ?? "").toString().toLowerCase()
                        )
                    }
                    filterOption={(input, option) =>
                      (option?.label?.toString() ?? "")
                        .toLowerCase()
                        .includes(input.toString().toLowerCase())
                    }
                    options={selectEmpleado}
                    status={error && "error"}
                  />
                </Spin>
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
      </Row>
    </>
  );
};
