import { useEffect, useState } from "react";
import { Col, Input, Row, Select, SelectProps, Spin, Typography } from "antd";
import { Props } from "../types";
import { Controller, useFormContext } from "react-hook-form";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { LoadingOutlined, UploadOutlined } from "@ant-design/icons";
import { getEmpleados } from "@/services/maestras/empleadosAPI";
import { getEmpleadoSanciones } from "@/services/gestion-humana/empleadoSancionesAPI";

const { Text } = Typography;
const { TextArea } = Input;

export const DatosBasicos = ({ procesoDisciplinario }: Props) => {
  const [selectEmpleado, setSelectEmpleado] = useState<SelectProps["options"]>(
    []
  );
  const [selectEmpleadoSanciones, setSelectEmpleadoSanciones] = useState<
    SelectProps["options"]
  >([]);
  const [loaderEmp, setLoaderEmp] = useState<boolean>(true);
  const methods = useFormContext();

  useEffect(() => {
    if (procesoDisciplinario) {
      methods.setValue("empleado", procesoDisciplinario?.empleado_id);
      methods.setValue("observacion", procesoDisciplinario?.observacion);
      methods.setValue(
        "empleado_sancion",
        procesoDisciplinario?.empleado_sancione_id
      );
    }

    setLoaderEmp(false);
    fetchEmpleados();
    fetchEmpleadosSanciones();
  }, [procesoDisciplinario]);

  const fetchEmpleados = () => {
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
        setLoaderEmp(false);
      })
      .catch((error) => {
        console.log("error", error);
        setLoaderEmp(false);
      });
  };

  const fetchEmpleadosSanciones = () => {
    getEmpleadoSanciones()
      .then(({ data: { data } }) => {
        const options = data.map((item) => {
          return { label: item.nombre, value: item.id.toString() };
        });
        setSelectEmpleadoSanciones(options);
        setLoaderEmp(false);
      })
      .catch((error) => {
        console.log("error", error);
        setLoaderEmp(false);
      });
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
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="empleado_sancion"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Tipo sanción es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Tipo sanción">
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
                  options={selectEmpleadoSanciones}
                  status={error && "error"}
                />
              </Spin>
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="observacion"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "La observación es requerida",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Observación proceso disciplinario">
              <TextArea
                {...field}
                placeholder="Observación"
                status={error && "error"}
                autoSize={{ minRows: 4, maxRows: 6 }}
                maxLength={500}
                showCount
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
    </Row>
  );
};
