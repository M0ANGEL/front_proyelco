import { Col, Row, Select, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { Props } from "./types";
import { StyledFormItem } from "@/components/layout/styled";

const { Text } = Typography;

export const DatosGestionCasa = ({
  selectUSuarios,
  selectIngeniero,
}: Props) => {
  const methods = useFormContext();

  return (
    <Row gutter={[12, 6]}>
      {/* usuario asignado */}
      <Col xs={24} sm={12}>
        <Controller
          name="encargado_id"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Usuario asignado de proyecto es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Encargado Proyecto:">
              <Select
                mode="multiple"
                {...field}
                status={error && "error"}
                options={selectUSuarios}
                placeholder="Encargado"
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
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/*  ingeniero encargado del proyecto  */}
      <Col xs={24} sm={12}>
        <Controller
          name="ingeniero_id"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Usuario asignado de proyecto es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Ingeniero Encargado:">
              <Select
                mode="multiple"
                {...field}
                status={error && "error"}
                options={selectIngeniero}
                placeholder="Ingeniero Encargado"
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
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
    </Row>
  );
};
