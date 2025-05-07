/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Col, Input, Row, Select, SelectProps, Spin, Typography, DatePicker, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Props } from "../types";
import dayjs from "dayjs";
import { getLocalidades } from "@/services/maestras/localidadesAPI";
import { getEmpleadosOn } from "@/services/maestras/empleadosAPI";
import { Empleado } from "@/services/types";

const { Text } = Typography;
const dateFormat = "DD/MM/YYYY";

export const DatosBasicos = ({ empleado }: Props) => {

  const [loaderEmp, setLoaderEmp] = useState<boolean>(true);
  const [selectLocalidad, setSelectLocalidad] = useState<SelectProps["options"]>([]);
  const methods = useFormContext();
  const [empleadosData, setEmpleadosData] = useState<Empleado[]>([]);

  const fetchEmpleados = () => {

    getEmpleadosOn().then(({ data: { data } }) => {
      setEmpleadosData(data)
      setLoaderEmp(false);
    })
      .catch((error) => {
        console.log("error", error)
      });
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        fetchEmpleados();
        // Si hay un empleado, setea los valores del formulario
        if (empleado) {
          methods.setValue('nombre', empleado?.nombre_completo);
          methods.setValue('cedula', empleado?.cedula);
          methods.setValue('ciudad_expedicion', empleado?.ciudad_expedicion);
          methods.setValue('telefono', empleado?.telefono);
          methods.setValue('correo', empleado?.correo);
          methods.setValue('fecha_nacimiento', dayjs(empleado?.fecha_nacimiento));
          methods.setValue('ciudad_nacimiento', empleado?.ciudad_nacimiento);
          methods.setValue('ciudad_residencia', empleado?.ciudad_residencia);
          methods.setValue('barrio', empleado?.barrio_residencia);
          methods.setValue('direccion', empleado?.direccion_residencia);
          methods.setValue('contacto_emergencia', empleado?.contacto_emergencia);
        } 

        // Obtiene las localidades y actualiza el select
        const { data: { data } } = await getLocalidades();
        const options = data.map((item) => ({
          label: item.municipio + '-' + item.departamento,
          value: item.id.toString(),
        }));
        setSelectLocalidad(options);

      } catch (error: any) {
        console.log("Error: ", error);

        if (error.response) {
          console.error("Error en la respuesta: ", error.response.data);
        } else if (error.request) {
          console.error("Error en la solicitud: ", error.request);
        } else {
          console.error("Error en el setup de la petición: ", error.message);
        }
      } finally {
        setLoaderEmp(false); // Desactiva el estado de carga al final, ya sea éxito o error
      }
    };

    fetchData();
  }, [empleado]);

  const handleCedulaChange = (cedulaIngresada: string) => {
    
    const existeCedula = empleadosData.some(empleado => empleado.cedula === cedulaIngresada);
  
    if (existeCedula) {
      message.warning("⚠️ Esta cédula cuenta con un contrato activo.");
    }
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
              message: "Nombre es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Nombre completo">
              <Input
                {...field}
                maxLength={80}
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
          name="cedula"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Cédula es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Cédula">
              <Input
                {...field}
                maxLength={15}
                placeholder="Cédula"
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
                onChange={(e) => {
                  field.onChange(e);
                  handleCedulaChange(e.target.value);
                }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="ciudad_expedicion"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Ciudad expedición es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Ciudad expedición">
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
                  options={selectLocalidad}
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
          name="telefono"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Teléfono es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Teléfono">
              <Input
                {...field}
                maxLength={15}
                placeholder="Teléfono"
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
          name="correo"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Correo es requerido",
            },
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Correo inválido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Correo">
              <Input
                {...field}
                maxLength={80}
                placeholder="Correo"
                status={error && "error"}
                type="text"
                style={{ textTransform: "lowercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="fecha_nacimiento"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Fecha nacimiento es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Fecha nacimiento">
              <DatePicker
                {...field}
                status={error && "error"}
                style={{ width: "100%" }}
                // defaultValue={dayjs("01-01-2000", dateFormat)}
                format={dateFormat}
                placeholder="Fecha Nacimiento"
              // disabledDate={disabledDate}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="ciudad_nacimiento"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Ciudad nacimiento es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Ciudad nacimiento">
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
                  options={selectLocalidad}
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
          name="ciudad_residencia"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Ciudad residencia es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Ciudad residencia">
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
                  options={selectLocalidad}
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
          name="barrio"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Barrio es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Barrio residencia">
              <Input
                {...field}
                maxLength={80}
                placeholder="Barrio residencia"
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
          name="direccion"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Dirección residencia es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Dirección residencia">
              <Input
                {...field}
                placeholder="Dirección"
                maxLength={80}
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
          name="contacto_emergencia"
          control={methods.control}
          // rules={{
          //   required: {
          //     value: false,
          //     message: "Contacto emergencia",
          //   },
          // }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem label="Contacto emergencia">
              <Input
                {...field}
                maxLength={80}
                placeholder="Contacto emergencia"
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
    </Row>
  );
}