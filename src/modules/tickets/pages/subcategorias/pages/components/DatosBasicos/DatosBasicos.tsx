import { useEffect, useState } from "react";
import { Col, Input, Row, Select, SelectProps, Spin, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { LoadingOutlined } from "@ant-design/icons";
import { Props } from "../DatosBasicos/types";
import {
  getTkCategoriasPadres,
  getTkProcesosSub,
  getTkUsuariosProceso,
} from "@/services/tickets/subcategoriasAPI";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

const { Text } = Typography;

dayjs.extend(customParseFormat);

export const DatosBasicos = ({ TkSubCategoria }: Props) => {
  const methods = useFormContext();
  const [loaderEmp, setLoaderEmp] = useState<boolean>(false);
  const [selectCategorias, setSelectCategorias] = useState<
    SelectProps["options"]
  >([]);
  const [selectProcesos, setSelectProcesos] = useState<SelectProps["options"]>(
    []
  );
  const [usuariosProceso, setUsuariosProceso] = useState<
    SelectProps["options"]
  >([]);

  const autorizacion = methods.watch("autorizacion");

  useEffect(() => {
    //si tenemos datos en categoria agregamos a metho los datos
    if (TkSubCategoria) {
      methods.setValue("created_at", TkSubCategoria?.created_at);
      methods.setValue("name", TkSubCategoria?.name);
      methods.setValue("prioridad", TkSubCategoria?.prioridad);
      methods.setValue("autorizacion", TkSubCategoria?.autorizacion);
      methods.setValue("tk_categoria_id", TkSubCategoria?.tk_categoria_id);
      methods.setValue(
        "proceso_autoriza_id",
        TkSubCategoria?.proceso_autoriza_id
      );
      methods.setValue("tiempo_gestion", TkSubCategoria?.tiempo_gestion);
      methods.setValue("puntosTicket", TkSubCategoria?.puntosTicket);
      methods.setValue(
        "tiempo_gestion",
        convertirMinutosAHHMMSS(TkSubCategoria?.tiempo_gestion)
      );
      methods.setValue(
        "usuarios_autorizados",
        JSON.parse(TkSubCategoria?.usuarios_autorizados)
      ); //forma de convertir texto a array
    } else {
      fetchCategorias();
      setLoaderEmp(false);
    }
  }, [TkSubCategoria]);

  //llamada  categoria padre
  const fetchCategorias = () => {
    getTkCategoriasPadres().then(({ data: { data } }) => {
      const categoriasPadres = data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setSelectCategorias(categoriasPadres);
    });
  };

  function convertirMinutosAHHMMSS(minutos: any) {
    if (minutos == null || isNaN(minutos)) return "00:00:00";

    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;
    const segundos = 0; // Si no hay segundos, se pueden dejar en 0

    return `${String(horas).padStart(2, "0")}:${String(
      minutosRestantes
    ).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
  }

  //llamada para los usuarios del proceso
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

  //rese formato de hora input
  const formatTime = (value: any) => {
    const cleanValue = value.replace(/\D/g, ""); // Solo permite números

    let hh = cleanValue.slice(0, 2); // Horas (2 dígitos)
    let mm = cleanValue.slice(2, 4);
    let ss = cleanValue.slice(4, 6);

    // Validar que las horas no sean mayores a 99
    if (hh.length === 2 && parseInt(hh) > 99) hh = "99";

    // Validar que los minutos sean <= 59
    if (mm.length === 2 && parseInt(mm) > 59) mm = "59";

    // Validar que los segundos sean <= 59
    if (ss.length === 2 && parseInt(ss) > 59) ss = "59";

    if (cleanValue.length <= 2) return hh; // Solo horas
    if (cleanValue.length <= 4) return `${hh}:${mm}`; // HH:mm
    return `${hh}:${mm}:${ss}`; // HH:mm:ss
  };

  //servicio de procesos
  useEffect(() => {
    if (autorizacion === "1") {
      getTkProcesosSub().then(({ data: { data } }) => {
        const Procesos = data.map((item) => ({
          label: item.nombre_proceso,
          value: item.id,
        }));

        setSelectProcesos(Procesos);
        fetchUserProcesos(Number(TkSubCategoria?.proceso_autoriza_id));
      });
    } else {
      setSelectProcesos([]);
      setUsuariosProceso([]);
      methods.setValue("proceso_autoriza_id", null);
      methods.setValue("usuarios_autorizados", null);
    }
  }, [autorizacion]);

  return (
    <Row gutter={24}>
      {/* campo de nombre de la categorias padre para la seleccion*/}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="tk_categoria_id"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Estado requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Categoria Padre">
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
                  options={selectCategorias}
                  status={error && "error"}
                />
              </Spin>
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      {/* campo de sub categoria */}
      <Col xs={24} sm={8} style={{ width: "100%" }}>
        <Controller
          name="name"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "La subcategoria es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Subcategoria">
              <Input
                {...field}
                maxLength={80}
                placeholder="SubCategoria"
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      {/* campo de puntos */}
      <Col xs={24} sm={4} style={{ width: "100%" }}>
        <Controller
          name="puntosTicket"
          control={methods.control}
          rules={{
            required: {
              value: false,
              message: "La subcategoria es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Puntos">
              <Input
                {...field}
                placeholder="98"
                status={error && "error"}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // Elimina cualquier letra o símbolo
                  field.onChange(value); // Actualiza el estado con solo números
                }}
              />

              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      {/* campo de prioridad  numero*/}
      <Col xs={24} sm={4} style={{ width: "100%" }}>
        <Controller
          name="prioridad"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Prioridad requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Prioridad">
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
                    { value: "3", label: "ALTA" },
                    { value: "2", label: "MEDIA" },
                    { value: "1", label: "BAJA" },
                  ]}
                  status={error && "error"}
                />
              </Spin>
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      {/* campo de si requier autorizacion autorizacion */}
      <Col xs={24} sm={3} style={{ width: "100%" }}>
        <Controller
          name="autorizacion"
          control={methods.control}
          rules={{ required: { value: true, message: "Estado requerido" } }}
          render={({ field }) => (
            <StyledFormItem required label="Autorizacion">
              <Select
                {...field}
                options={[
                  { value: "0", label: "NO" },
                  { value: "1", label: "SI" },
                ]}
                // onChange={(value) => {
                //   field.onChange(value);
                //   // setAutorizacion(value);
                // }}
              />
            </StyledFormItem>
          )}
        />
      </Col>
      {/* campo selecion de proceso */}
      <Col xs={24} sm={5} style={{ width: "100%" }}>
        <Controller
          name="proceso_autoriza_id"
          control={methods.control}
          rules={{
            required: {
              value: autorizacion === "1" ? true : false, //validacion diamica si es o no olbigatoriaaa jaja
              message: "El usuario es requerido",
            },
          }}
          render={({ field }) => (
            <StyledFormItem required label="Proceso">
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
                options={selectProcesos}
                disabled={autorizacion !== "1"}
                onSelect={(value) => {
                  fetchUserProcesos(value);
                }}
              />
            </StyledFormItem>
          )}
        />
      </Col>
      {/* campo selecion de usuarios que van proceso y podran autorizar autoriza */}
      <Col xs={24} sm={8}>
        <Controller
          name="usuarios_autorizados"
          control={methods.control}
          rules={{
            required: {
              value: autorizacion === "1" ? true : false, //validacion diamica si es o no olbigatoriaaa jaja
              message: "El usuario es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Usuario Autoriza">
              <Spin spinning={loaderEmp} indicator={<LoadingOutlined spin />}>
                <Select
                  mode="multiple" // Permite seleccionar varios valores
                  {...field}
                  showSearch
                  allowClear
                  options={usuariosProceso} // Opciones predefinidas
                  disabled={autorizacion !== "1"}
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
      
      {/* campo de tiempo en ejecucion */}
      <Col xs={24} sm={4} style={{ width: "100%" }}>
        <Controller
          name="tiempo_gestion"
          control={methods.control}
          rules={{
            required: {
              value: false,
              message: "El tiempo es requerido",
            },
            pattern: {
              value: /^([0-9]{2}):([0-5][0-9]):([0-5][0-9])$/,
              message: "Formato inválido (HH:mm:ss)",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Tiempo Para Gestión">
              <Input
                {...field}
                placeholder="hh:mm:ss"
                maxLength={8}
                value={field.value}
                onChange={(e) => field.onChange(formatTime(e.target.value))}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
    </Row>
  );
};
