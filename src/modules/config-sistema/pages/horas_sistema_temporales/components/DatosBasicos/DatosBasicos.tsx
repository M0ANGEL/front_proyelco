import { useEffect, useState } from "react";
import {
  Col,
  DatePicker,
  Row,
  Select,
  SelectProps,
  Spin,
  Typography,
} from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Props } from "../DatosBasicos/types";
import TextArea from "antd/es/input/TextArea";
import { LoadingOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  getTkProcesosSub,
  getTkUsuariosProceso,
} from "@/services/tickets/subcategoriasAPI";

const { Text } = Typography;

export const DatosBasicos = ({ HorarioAdicional }: Props) => {
  const methods = useFormContext();
  const [selectProcesos, setSelectProcesos] = useState<SelectProps["options"]>(
    []
  );
  const [usuariosProceso, setUsuariosProceso] = useState<
    SelectProps["options"]
  >([]);
  const [loaderEmp, setLoaderEmp] = useState<boolean>(false);

  useEffect(() => {
    if (HorarioAdicional) {
      methods.setValue("observacion", HorarioAdicional?.observacion);
      methods.setValue("fecha_inicio", HorarioAdicional?.fecha_inicio);
      methods.setValue("fecha_final", HorarioAdicional?.fecha_final);
      methods.setValue(
        "proceso_autoriza_id",
        HorarioAdicional?.proceso_autoriza_id
      );
      methods.setValue(
        "usuarios_autorizados",
        JSON.parse(HorarioAdicional?.usuarios_autorizados)
      );
    } else {
      methods.setValue("observacion", "Autorizado por: ");
      getProceos();
    }
  }, [HorarioAdicional]);

  const getProceos = () => {
    setLoaderEmp(true);
  };

  useEffect(() => {
    getTkProcesosSub()
      .then(({ data: { data } }) => {
        const Procesos = data.map((item) => ({
          label: item.nombre_proceso,
          value: item.id,
        }));

        setSelectProcesos(Procesos);
        fetchUserProcesos(Number(HorarioAdicional?.proceso_autoriza_id));
      })
      .finally(() => {
        setLoaderEmp(false);
      });
  }, [HorarioAdicional]);

  //usuarios proceos
  const fetchUserProcesos = async (categoriaId: number) => {
    if (!categoriaId) {
      setUsuariosProceso([]);
      return;
    }
    try {
      const response = await getTkUsuariosProceso(categoriaId);
      const usuariosproce = response?.data?.data || [];
      setUsuariosProceso(
        usuariosproce.map((item) => ({
          label: item.name,
          value: item.id,
        }))
      );
    } catch (error) {
      console.error("Error al cargar subcategorías:", error);
    }
  };

  return (
    <Row gutter={24}>
      {/* campo de nombre de fecha inicio */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="fecha_inicio"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "La fecha y hora de inicio es requerida",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Fecha y Hora Incio">
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                {...field}
                value={field.value ? dayjs(field.value, "YYYY-MM-DD HH:mm:ss") : null}
                // value={field.value ? dayjs(field.value) : null} // Convierte el valor a dayjs
                onChange={(date) =>
                  field.onChange(date ? date.format("YYYY-MM-DD HH:mm:ss") : null)
                }
              />
              {error && <Text type="danger">{error.message}</Text>}
            </StyledFormItem>
          )}
        />
      </Col>

      {/* campo de fecha final */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="fecha_final"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "La fecha y hora final es requerida",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Fecha y Hora Final">
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                {...field}
                value={field.value ? dayjs(field.value, "YYYY-MM-DD HH:mm:ss") : null}
                onChange={(date) =>
                  field.onChange(date ? date.format("YYYY-MM-DD HH:mm:ss") : null)
                }
              />
              {error && <Text type="danger">{error.message}</Text>}
            </StyledFormItem>
          )}
        />
      </Col>

      {/* campo selecion de proceso */}
      <Col xs={24} sm={10} style={{ width: "100%" }}>
        <Controller
          name="proceso_autoriza_id"
          control={methods.control}
          rules={{
            required: {
              value: true, //validacion diamica si es o no olbigatoriaaa jaja
              message: "El proceso es requerido",
            },
          }}
          render={({ field }) => (
            <StyledFormItem required label="Proceso">
              <Select
                {...field}
                options={selectProcesos}
                onSelect={(value) => {
                  fetchUserProcesos(value);
                }}
              />
            </StyledFormItem>
          )}
        />
      </Col>
      {/* campo selecion de usuarios que van proceso y podran autorizar autoriza */}
      <Col xs={24} sm={14}>
        <Controller
          name="usuarios_autorizados"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Los usuarios son requeridos",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Usuarios Autorizados">
              <Spin spinning={loaderEmp} indicator={<LoadingOutlined spin />}>
                <Select
                  mode="multiple" // Permite seleccionar varios valores
                  {...field}
                  showSearch
                  allowClear
                  options={usuariosProceso} // Opciones predefinidas
                  placeholder={
                    usuariosProceso?.length
                      ? "Selecciona uno o más usuarios"
                      : "NO HAY USUARIOS PARA ESTE PROCESO"
                  }
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
              </Spin>
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      <Col xs={24} sm={24}>
        <Controller
          name="observacion"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "La observacion es obligatorio",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Información Detallada de la autorizacion">
              <TextArea
                {...field}
                maxLength={250}
                rows={4}
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
};
