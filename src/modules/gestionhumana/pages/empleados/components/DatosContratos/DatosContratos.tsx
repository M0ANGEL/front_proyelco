import { Col, Input, Row, Select, SelectProps, Spin, Typography, DatePicker } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { getCargos } from "@/services/maestras/cargosAPI";
import { getBodegas } from "@/services/maestras/bodegasAPI";
import { getContratosLaborales } from "@/services/gestion-humana/contratosLaboralesAPI";
import { Props } from "../types";
import dayjs from "dayjs";
import { getBancoOn } from "@/services/gestion-humana/bancosAPI";
import { getRhConvenios } from "@/services/gestion-humana/rh-conveniosAPI";

const { Text } = Typography;
const dateFormat = "DD/MM/YYYY";

export const DatosContratos = ({ empleado }: Props) => {
  const methods = useFormContext();
  const [loaderEmp, setLoaderEmp] = useState<boolean>(true);
  const [selectCargos, setSelectCargos] = useState<SelectProps["options"]>([]);
  const [selectBodegas, setSelectBodegas] = useState<SelectProps["options"]>([]);
  const [selectConvenio, setSelectConvenio] = useState<SelectProps["options"]>([]);
  const [selectBancos, setSelectBancos] = useState<SelectProps["options"]>([]);
  const [selectContrato, setSelectContrato] = useState<SelectProps["options"]>([]);
  const [contratoSeleccionado, setContratoSeleccionado] = useState("");
  const [cargoSeleccionado, setCargoSeleccionado] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (empleado) {
          methods.setValue('contrato', empleado?.contrato_id);
          methods.setValue('convenio', empleado?.convenio_id);
          methods.setValue('cargo', empleado?.cargo_id);
          methods.setValue('salario', parseInt(empleado?.salario));
          methods.setValue('banco', empleado?.banco_id);
          methods.setValue('numero_cuenta', empleado?.numero_cuenta);
          methods.setValue('sede', empleado?.sede_id);
          methods.setValue('fecha_inicio', dayjs(empleado?.fecha_inicio));
          setContratoSeleccionado(empleado?.contrato_id);
          setCargoSeleccionado(empleado?.cargo);
        }
        // Ejecutar todas las peticiones en paralelo
        const [cargos, bodegas, convenios, bancos, contratos] = await Promise.all([
          getCargos(),
          getBodegas(),
          getRhConvenios(),
          getBancoOn(),
          getContratosLaborales()
        ]);

        // Mapear y setear los valores de cada respuesta
        setSelectCargos(cargos.data.data.map(item => ({ label: item.nombre, value: item.id.toString() })));
        setSelectBodegas(bodegas.data.data.map(item => ({ label: item.bod_nombre, value: item.id.toString() })));
        setSelectConvenio(convenios.data.data.map(item => ({ label: item.nombre_convenio + '-' + item.numero_contrato, value: item.id.toString() })));
        setSelectBancos(bancos.data.data.map(item => ({ label: item.nombre, value: item.id.toString() })));
        setSelectContrato(contratos.data.data.map(item => ({ label: item.nombre, value: item.id.toString() })));

      } catch (error: any) {
        console.log("Error: ", error);
        // Manejo de errores, puedes agregar una notificación aquí si es necesario
        if (error.response) {
          console.error("Error en la respuesta: ", error.response.data);
        } else if (error.request) {
          console.error("Error en la solicitud: ", error.request);
        } else {
          console.error("Error en el setup de la petición: ", error.message);
        }
      } finally {
        setLoaderEmp(false); // Asegúrate de que el loader se desactiva
      }
    };

    fetchData();
  }, [empleado]);

  const addFechaFin = () => {

    if (contratoSeleccionado === "2" || contratoSeleccionado === "5") {
      return (
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="fecha_fin"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Fecha fin es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Fecha fin">
                <DatePicker
                  {...field}
                  status={error && "error"}
                  style={{ width: "100%" }}
                  format={dateFormat}
                  placeholder="Fecha Fin"
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
      )
    } else {
      return null;
    }
  }

  const addProgramaDeFormacion = () => {

    if (contratoSeleccionado == "5") {
      return (
        <>
          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <Controller
              name="estrato"
              control={methods.control}
              rules={{
                required: {
                  value: true,
                  message: "Estrato es requerido",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem required label="Estrato">
                  <Input
                    {...field}
                    placeholder="Estrato"
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
              name="especialidad_curso"
              control={methods.control}
              rules={{
                required: {
                  value: true,
                  message: "Especialidad o curso es requerido",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem required label="Especialidad o curso">
                  <Input
                    {...field}
                    placeholder="Especialidad o curso"
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
              name="num_grupo"
              control={methods.control}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem label="N° Grupo">
                  <Input
                    {...field}
                    placeholder="N° Grupo"
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
              name="instituto_formacion"
              control={methods.control}
              rules={{
                required: {
                  value: true,
                  message: "Especialidad o curso es requerido",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem required label="Institución de formación">
                  <Input
                    {...field}
                    placeholder="Institución de formación"
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
              name="nit_instituto_formacion"
              control={methods.control}
              rules={{
                required: {
                  value: true,
                  message: "Nit instituto formación es requerido",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem required label="Nit instituto formación">
                  <Input
                    {...field}
                    placeholder="Nit instituto formación"
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
              name="centro_formacion"
              control={methods.control}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem label="SI ES SENA: Centro formación">
                  <Input
                    {...field}
                    placeholder="SI ES SENA: Centro formación"
                    status={error && "error"}
                    style={{ textTransform: "uppercase" }}
                  />
                  <Text type="danger">{error?.message}</Text>
                </StyledFormItem>
              )}
            />
          </Col>
        </>
      )
    } else {
      return null;
    }

  }

  const addAuxilioDeMovilidad = () => {

    if (cargoSeleccionado == "MENSAJERO" || cargoSeleccionado == "CONDUCTOR") {
      return (
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="auxilio"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Auxilio rodamiento o viáticos es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Auxilio rodamiento o viáticos">
                <Input
                  {...field}
                  placeholder="$"
                  status={error && "error"}
                  // style={{ textTransform: "uppercase" }}
                  onChange={(e) => {
                    const { value } = e.target;
                    if (/^\d*$/.test(value)) { // Permite solo dígitos
                      field.onChange(value);  // Llama a onChange solo si es numérico
                    }
                  }}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
      )
    } else {
      return null
    }

  }

  useEffect(() => {
    if (contratoSeleccionado === "5") {
      methods.setValue('estrato', empleado?.estrato);
      methods.setValue('especialidad_curso', empleado?.especialidad_curso);
      methods.setValue('num_grupo', empleado?.num_grupo);
      methods.setValue('instituto_formacion', empleado?.instituto_formacion);
      methods.setValue('nit_instituto_formacion', empleado?.nit_instituto_formacion);
      methods.setValue('centro_formacion', empleado?.centro_formacion);
    } else {
      methods.setValue('estrato', null);
      methods.setValue('especialidad_curso', null);
      methods.setValue('num_grupo', null);
      methods.setValue('instituto_formacion', null);
      methods.setValue('nit_instituto_formacion', null);
      methods.setValue('centro_formacion', null);
    }

    if (contratoSeleccionado === "5" || contratoSeleccionado === "2") {
      if (empleado?.fecha_fin) {
        methods.setValue('fecha_fin', dayjs(empleado?.fecha_fin));
      }
    } else {
      methods.setValue('fecha_fin', null);
    }

    if (cargoSeleccionado === "MENSAJERO" || cargoSeleccionado === "CONDUCTOR") {
      methods.setValue('auxilio', empleado?.auxilio);
    } else {
      methods.setValue('auxilio', null);
    }
    
  }, [contratoSeleccionado, cargoSeleccionado])

  return (

    <Row gutter={24}>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="contrato"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Contrato es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Contrato">
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
                  options={selectContrato}
                  status={error && "error"}
                  onChange={(value) => {
                    field.onChange(value); // Actualiza el valor del formulario
                    setContratoSeleccionado(value); // Actualiza el estado con el contrato seleccionado
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
                  onChange={(value) => {
                    field.onChange(value);
                    // Encuentra el label correspondiente al valor seleccionado
                    const selectedOption = selectCargos?.find(option => option.value === value);
                    const selectedLabel = selectedOption ? selectedOption.label : null;
                    const label = selectedLabel?.toString() || ''; // Obtiene el label seleccionado
                    setCargoSeleccionado(label);
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
          name="salario"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Salario es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Salario">
              <Input
                {...field}
                placeholder="$"
                status={error && "error"}
                type="text"
                maxLength={20}
                onChange={(e) => {
                  const { value } = e.target;
                  if (/^\d*$/.test(value)) { // Permite solo dígitos
                    field.onChange(value);  // Llama a onChange solo si es numérico
                  }
                }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="banco"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Banco es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Banco">
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
                  options={selectBancos}
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
          name="numero_cuenta"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Número de cuenta es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Número de cuenta ">
              <Input
                {...field}
                placeholder="Número de cuenta"
                maxLength={50}
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
          name="sede"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Sede es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Sede">
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
                  options={selectBodegas}
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
          name="fecha_inicio"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Fecha inicio es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Fecha inicio">
              <DatePicker
                {...field}
                status={error && "error"}
                style={{ width: "100%" }}
                // defaultValue={dayjs("01-01-2000", dateFormat)}
                format={dateFormat}
                placeholder="Fecha Inicio"
              // disabledDate={disabledDate}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      {addFechaFin()}
      {addProgramaDeFormacion()}
      {addAuxilioDeMovilidad()}
    </Row>
  )
}