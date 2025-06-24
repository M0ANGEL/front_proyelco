import { useEffect, useState } from "react";
import {
  Col,
  DatePicker,
  Row,
  Select,
  SelectProps,
  Tooltip,
  Typography,
} from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Props } from "./types";
import { InfoCircleOutlined } from "@ant-design/icons";
import {
  getTkEmpleados,
  getTkProyectos,
} from "@/services/talento-humano/asistenciasAPI";
import dayjs from "dayjs";

const { Text } = Typography;
const { RangePicker } = DatePicker;

export const DatosBasicos = ({ TkCategoria }: Props) => {
  const methods = useFormContext();
  const [empleados, setEmpleados] = useState<SelectProps["options"]>([]);
  const [proyectos, setProyectos] = useState<SelectProps["options"]>([]);

  useEffect(() => {
    fetchEmpleados();
    fetchProyectos();
    //si tenemos datos en categoria agregamos a metho los datos
    if (TkCategoria) {
      methods.setValue("personal_id", TkCategoria?.personal_id.toString());
      methods.setValue("proyecto_id", TkCategoria?.proyecto_id.toString());
      methods.setValue("fecha_programacion", TkCategoria?.fecha_programacion);
    } else {
      /*  methods.setValue('estado', '1') */
    }
  }, [TkCategoria]);

  //llamada de los proyectos activos
  const fetchProyectos = async () => {
    const response = await getTkProyectos();
    const usuariosproce = response?.data?.data || [];
    setProyectos(
      usuariosproce.map((item) => ({
        label: item.descripcion_proyecto,
        value: item.id.toString(),
      }))
    );
  };

  //llamada de empleados para asistencia
  const fetchEmpleados = async () => {
    const response = await getTkEmpleados();
    const usuariosproce = response?.data?.data || [];
    setEmpleados(
      usuariosproce.map((item) => ({
        label: `${item.nombres} - ${item.apellidos} (${item.cedula})`,
        value: item.id.toString(),
      }))
    );
  };

  return (
    <Row gutter={24}>
      {/* fecha de programacion */}

      {TkCategoria ? (
        <Controller
          name="fecha_programacion"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Fecha de programacion es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Fecha Programacion:">
              <DatePicker
                {...field}
                status={error && "error"}
                placeholder="10/01/01"
                style={{ width: "100%" }}
                value={field.value ? dayjs(field.value) : null} // Asegura que sea dayjs
                onChange={(date) => {
                  if (date && date.isValid && date.isValid()) {
                    field.onChange(date.toISOString()); // Puedes guardar el ISO o el objeto completo
                  } else {
                    field.onChange(null); // Limpiar si es inválido
                  }
                }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      ) : (
        <Col xs={24} sm={12} md={8}>
          <Controller
            name="fecha_programacion"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Fecha de programacion es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Rango de Programacion:">
                <RangePicker
                  {...field}
                  status={error && "error"}
                  format="DD-MM-YYYY"
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
      )}

      {/* proyecto */}
      <Col xs={24} sm={8}>
        <Controller
          name="proyecto_id"
          control={methods.control}
          rules={{
            required: {
              value: true, // Validación dinámica
              message: "El proyecto es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem label={"Proyecto"}>
              <Select
                {...field}
                showSearch
                allowClear
                options={proyectos} // Opciones predefinidas
                placeholder={"Seleccione un proyecto"}
                status={error ? "error" : ""}
                style={{ width: "100%" }}
                tokenSeparators={[","]}
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

      {/* Empleados */}
      <Col xs={24} sm={8}>
        <Controller
          name="personal_id"
          control={methods.control}
          rules={{
            required: {
              value: true, // Validación dinámica
              message: "El usuario es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem
              label={
                <span>
                  Usuarios{" "}
                  <Tooltip title="Aquí seleccionas los usuarios que depende el cronograma seran en asistencias">
                    <InfoCircleOutlined
                      style={{ color: "#faad14", cursor: "pointer" }}
                    />
                  </Tooltip>
                </span>
              }
            >
              <Select
                mode="multiple" // Permite seleccionar varios valores
                {...field}
                showSearch
                allowClear
                options={empleados} // Opciones predefinidas
                placeholder={"Selecciona uno o más usuarios"}
                status={error ? "error" : ""}
                style={{ width: "100%" }}
                onChange={(value) => {
                  field.onChange(value); //acomular valores
                }}
                tokenSeparators={[","]}
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
