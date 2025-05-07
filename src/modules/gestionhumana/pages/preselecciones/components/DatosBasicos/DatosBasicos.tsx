import { useEffect, useState } from "react";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import {
  Col,
  Input,
  Row,
  Select,
  SelectProps,
  Spin,
  Typography,
  Checkbox,
} from "antd";
import type { CheckboxProps } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { LoadingOutlined } from "@ant-design/icons";
import { getCargos } from "@/services/maestras/cargosAPI";
import { getRhConvenios } from "@/services/gestion-humana/rh-conveniosAPI";
import { getEstadosPreseleccion } from "@/services/gestion-humana/preseleccionesAPI";
import { Props } from "../types";

const { TextArea } = Input;

export const DatosBasicos = ({ preseleccion }: Props) => {
  const methods = useFormContext();
  const { Text } = Typography;
  const [selectCargos, setSelectCargos] = useState<SelectProps["options"]>([]);
  const [selectConvenio, setSelectConvenio] = useState<SelectProps["options"]>(
    []
  );
  const [selectEstadoPreseleccion, setSelectEstadoPreseleccion] = useState<
    SelectProps["options"]
  >([]);
  const [loaderEmp, setLoaderEmp] = useState<boolean>(true);

  useEffect(() => {
    fetchCargos();
    fetchConvenios();
    fetchEstadosPreseleccion();
  }, []);

  useEffect(() => {
    if (preseleccion) {
      methods.setValue("nombre", preseleccion.nombre);
      methods.setValue("documento", preseleccion.documento);
      methods.setValue("cargo", preseleccion.cargo_id);
      methods.setValue("convenio", preseleccion.convenio_id);
      methods.setValue("examen_medico", preseleccion.examen_medico);
      methods.setValue("estado", preseleccion.estado_preseleccione_id);
      methods.setValue("observacion", preseleccion.observacion);
    } else {
      methods.reset();
    }

    setLoaderEmp(false);
  }, [preseleccion]);

  const fetchCargos = () => {
    getCargos()
      .then(({ data: { data } }) => {
        const options = data.map((item) => {
          return { label: item.nombre, value: item.id.toString() };
        });
        setSelectCargos(options);
        setLoaderEmp(false);
      })
      .catch((error) => {
        console.log("Error: " + error);
      });
  };

  const fetchConvenios = () => {
    getRhConvenios()
      .then(({ data: { data } }) => {
        const options = data.map((item: any) => {
          return {
            label: item.nombre_convenio + "-" + item.numero_contrato,
            value: item.id.toString(),
          };
        });
        setSelectConvenio(options);
      })
      .catch((error) => {
        console.log("Error: " + error);
      });
  };

  const fetchEstadosPreseleccion = () => {
    getEstadosPreseleccion()
      .then(({ data: { data } }) => {
        const options = data.map((item) => {
          return { label: item.nombre, value: item.id.toString() };
        });
        setSelectEstadoPreseleccion(options);
      })
      .catch((error) => {
        console.log("Error: " + error);
      });
  };

  const handleChange = (e: any, onChange: any) => {
    const upperCaseValue = e.target.value.toUpperCase();
    onChange(upperCaseValue);
    e.target.value = upperCaseValue;
  };

  const onChange: CheckboxProps["onChange"] = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };

  return (
    <Row gutter={24}>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="nombre"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Nombre completo es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Nombre completo">
              <Input
                {...field}
                placeholder="Nombre completo"
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="documento"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Documento es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Documento">
              <Input
                {...field}
                placeholder="Documento"
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="cargo"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Cargo es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Cargo">
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
                  options={selectCargos}
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
          name="convenio"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Convenio es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Convenio">
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
                  options={selectConvenio}
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
          name="examen_medico"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Examen medico es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Examen medico">
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
                  options={[
                    { value: "0", label: "NO" },
                    { value: "1", label: "SI" },
                  ]}
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
          name="estado"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Estado es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Estado">
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
                  options={selectEstadoPreseleccion}
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
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem label="Observación">
              <TextArea
                {...field}
                placeholder="Observación"
                status={error && "error"}
                autoSize={{ minRows: 4, maxRows: 6 }}
                maxLength={250}
                showCount
                onChange={(e) => handleChange(e, field.onChange)}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      {preseleccion && (
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="habilitar_link"
            control={methods.control}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem label="Habilitar Link">
                <Checkbox
                  checked={field.value} // Aquí mapeamos `field.value` a `checked`
                  onChange={(e) => {
                    field.onChange(e.target.checked); // Actualizamos el valor en el form
                    onChange(e); // Llamamos a tu `onChange` personalizado
                  }}
                >
                  Habilitar link para envió de documentos
                </Checkbox>
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
      )}
    </Row>
  );
};
