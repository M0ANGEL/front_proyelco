import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Col, Input, Row, Select, SelectProps, Spin, Typography } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Props } from "./types";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { getEmpleados } from "@/services/maestras/empleadosAPI";

const { Text } = Typography;
export const DatosBasicos = ({ retirarCesantias }: Props) => {
  const methods = useFormContext();
  const [selectEmpleado, setSelectEmpleado] = useState<SelectProps["options"]>([]);
  const [loader, setLoader] = useState<boolean>(true);
  const [valorAsunto, setValorAsunto] = useState<string>("");

  useEffect(() => {
    getEmpleados()
      .then(({ data: { data } }) => {
        const options = data.map((item) => {
          return {
            label: `${item.cedula} - ${item.nombre_completo} - ${
              item.estado === "1" ? "Activo" : "Inactivo"
            }`,
            value: item.id.toString(),
          };
        });
        setSelectEmpleado(options);
        setLoader(false);
      })
      .catch((error) => {
        setLoader(false);
        console.log("error", error);
      });
  }, []);

  useEffect(() => {
    if (retirarCesantias) {
      methods.setValue('empleado', retirarCesantias.empleado_id)
      methods.setValue('asunto', retirarCesantias.asunto);
      setValorAsunto(retirarCesantias.asunto);
      methods.setValue('concepto', retirarCesantias.concepto)
      methods.setValue('valor', parseInt(retirarCesantias.valor));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retirarCesantias, methods])

  const selectAsunto = [
    { label: "RETIRO DE CESANTIAS", value: "RETIRO DE CESANTIAS" },
    {
      label: "RETIRO DE CESANTÍAS POR TERMINACION",
      value: "RETIRO DE CESANTÍAS POR TERMINACION RENUNCIA VOLUNTARIA",
    },
  ];

  useEffect(() => {
    if (!retirarCesantias && valorAsunto == 'RETIRO DE CESANTÍAS POR TERMINACION RENUNCIA VOLUNTARIA' ) {
      methods.setValue('concepto',  null);
      methods.setValue('valor', null);
    }
  }, [valorAsunto, methods, retirarCesantias])

  useEffect(() => {
    if (valorAsunto == 'RETIRO DE CESANTÍAS POR TERMINACION RENUNCIA VOLUNTARIA' ) {
      methods.setValue('concepto',  null);
      methods.setValue('valor', null);
    }
  }, [valorAsunto, methods])

  const camposOpcionales = () => {
    return (
      <>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="concepto"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Concepto Retiro es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Concepto Retiro">
                <Input
                  {...field}
                  placeholder="Concepto Retiro"
                  maxLength={80}
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="valor"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Valor Retiro es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Valor Retiro">
                <Input
                  {...field}
                  placeholder="$"
                  maxLength={80}
                  status={error && "error"}
                  onChange={(e) => {
                    const { value } = e.target;
                    if (/^\d*$/.test(value)) {
                      field.onChange(value);
                    }
                  }}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
      </>
    );
  };

  return (
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
              <Spin spinning={loader} indicator={<LoadingOutlined spin />}>
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
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                />
              </Spin>
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="asunto"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Asunto Retiro requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Asunto Retiro">
              <Spin spinning={loader} indicator={<LoadingOutlined spin />}>
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
                  options={selectAsunto}
                  status={error && "error"}
                  onChange={(value) => {
                    field.onChange(value);
                    setValorAsunto(value);
                  }}
                />
              </Spin>
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      {valorAsunto == "RETIRO DE CESANTIAS"
        ? camposOpcionales()
        : null}
    </Row>
  );
};
