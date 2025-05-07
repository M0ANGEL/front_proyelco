import { useEffect, useState } from "react";
import {
  Col,
  DatePicker,
  Input,
  Row,
  Select,
  SelectProps,
  Spin,
  Typography,
  UploadFile,
  message 
} from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { LoadingOutlined } from "@ant-design/icons";
import { Props } from "../types";
import dayjs from "dayjs";
import { getEmpleados } from "@/services/maestras/empleadosAPI";
import { getDiagnosticos } from "@/services/maestras/diagnosticosAPI";
import { getPorcentajes } from "@/services/gestion-humana/porcentajesAPI";
import { Empleado } from "@/services/types";

const { Text } = Typography;
const dateFormat = "DD/MM/YYYY";
const { TextArea } = Input;

export const DatosBasicos = ({ incapacidad }: Props) => {
  const methods = useFormContext();
  const [selectEmpleado, setSelectEmpleado] = useState<SelectProps["options"]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [selectSexo, setSelectSexo] = useState<SelectProps["options"]>([]);
  const [selectOrigenIncapacidad, setSelectOrigenIncapacidad] = useState<
    SelectProps["options"]
  >([]);
  const [selectDiagnosticos, setSelectDiagnosticos] = useState<
    SelectProps["options"]
  >([]);
  const [loaderEmp, setLoaderEmp] = useState<boolean>(true);
  const [fileList, setFileList] = useState<UploadFile<any>[]>([]);
  const [isDisabled, setIsDisabled] = useState(false);
  // Observar cambios en las fechas
  const fechaInicio = methods.watch("fecha_inicio");
  const fechaFin = methods.watch("fecha_fin");
  const diasIncapacidad = methods.watch("dias");

  const handleChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };

  useEffect(() => {
    setLoaderEmp(false);
    setSelectSexo([
      { value: "M", label: "M" },
      { value: "F", label: "F" },
    ]);

    if (incapacidad) {
      methods.setValue("fecha_inicio", dayjs(incapacidad.fecha_inicio));
      methods.setValue("fecha_fin", dayjs(incapacidad.fecha_fin));
      methods.setValue("empleado", incapacidad.empleado_id);
      methods.setValue("salario", incapacidad.salario);
      methods.setValue("sexo", incapacidad.sexo);
      methods.setValue("origen", incapacidad?.origen_incapacidade_id);
      methods.setValue("diagnostico", incapacidad.diagnostico_id);
      methods.setValue("mesInicio", incapacidad.mes_inicio_incapacidad);
      methods.setValue("radicado", incapacidad.radicado);
      methods.setValue("pagada", incapacidad.pagada);
      methods.setValue("pagado_valor", incapacidad?.pagado_valor);
      methods.setValue(
        "fecha_pago",
        incapacidad.fecha_pago ? dayjs(incapacidad.fecha_pago) : null
      );
      methods.setValue("valor", incapacidad.pagado_valor);

      methods.setValue("observacion", incapacidad?.observaciones);
    }

    fetchEmpleados();
    fetchOrigenIncapacidades();
    fetchDiagnosticos();
  }, [incapacidad]);

  useEffect(() => {
    if (fechaInicio && fechaFin) {
      const inicio = dayjs(fechaInicio);
      const fin = dayjs(fechaFin);
      const diff = fin.diff(inicio, "day");
      methods.setValue("dias", diff >= 0 ? diff + 1 : "");
    }
  }, [fechaInicio, fechaFin, methods.setValue]);

  useEffect(() => {
    if (!incapacidad) {
      if (diasIncapacidad > 0 && diasIncapacidad < 3) {
        methods.setValue("pagada", "FARMART");
        methods.setValue("radicado", "NO SE RADICA")
        setIsDisabled(true)
      } else {
        methods.setValue("pagada", null);
        methods.setValue("radicado", null);
        setIsDisabled(false)
      }
    }
  }, [diasIncapacidad, incapacidad])

  const fetchEmpleados = () => {
    getEmpleados()
      .then(({ data: { data } }) => {
        const options = data.map((item) => {
          return {
            label: `${item.cedula} - ${item.nombre_completo} - ${item.estado === '1' ? 'Activo' : 'Inactivo'}`,
            value: item.id.toString(),
          };
        });
        setEmpleados(data);
        setSelectEmpleado(options);
        setLoaderEmp(false);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const fetchOrigenIncapacidades = () => {
    getPorcentajes()
      .then(({ data: { data } }) => {
        const options = data.map((item) => {
          return { label: item.tipo_incapacidad, value: item.id.toString() };
        });
        setSelectOrigenIncapacidad(options);
        setLoaderEmp(false);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const fetchDiagnosticos = () => {
    getDiagnosticos()
      .then(({ data: { data } }) => {
        const options = data.map((item) => {
          return {
            label: item.codigo + "-" + item.descripcion,
            value: item.id.toString(),
          };
        });
        setSelectDiagnosticos(options);
        setLoaderEmp(false);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        message.success("Texto copiado al portapapeles");
      })
      .catch(err => {
        message.error("Error al copiar");
        console.error("Error al copiar: ", err);
      });
  };

  const validateFileType = (file: File, allowedTypes: string[]): boolean => {
    return allowedTypes.includes(file.type);
  };

  return (
    <Row gutter={24}>
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
                // defaultValue={dayjs("01-01-2000", dateFormat)}
                format={dateFormat}
                placeholder="Fecha fin"
                // disabledDate={disabledDate}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="dias"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Salario es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Dias">
              <Input
                {...field}
                maxLength={20}
                placeholder="dias"
                status={error && "error"}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); 
                  field.onChange(value);
                }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
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
                  onSelect={(value) => {
                    // Buscar la opción seleccionada por su valor
                    const selectedOption = selectEmpleado?.find(option => option.value === value);
                    if (selectedOption?.label) {
                      const labelAsString = String(selectedOption.label);
                      copyToClipboard(labelAsString);
                    }

                    const empleado = empleados.find(e => e.id === value);
                    if (empleado) {
                      const salario = empleado.salario; 
                      methods.setValue('salario', salario);
                    }

                  }}

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
                maxLength={20}
                placeholder="$"
                status={error && "error"}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); 
                  field.onChange(value);
                }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="sexo"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Sexo es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Sexo">
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
                  options={selectSexo}
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
          name="origen"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Origen es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Origen">
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
                  options={selectOrigenIncapacidad}
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
          name="diagnostico"
          control={methods.control}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem label="Diagnostico">
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
                  options={selectDiagnosticos}
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
          name="radicado"
          control={methods.control}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem label="Radicado">
              <Input
                {...field}
                disabled={isDisabled}
                maxLength={80}
                placeholder="Radicado"
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
          name="pagada"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Pagada es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Pagada">
              <Spin spinning={loaderEmp} indicator={<LoadingOutlined spin />}>
                <Select
                  {...field}
                  disabled={isDisabled}
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
                    { value: "SI", label: "SI" },
                    { value: "NO", label: "NO" },
                    { value: "FARMART", label: "FARMART" },
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
          name="pagado_valor"
          control={methods.control}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem label="Pagado valor">
              <Input
                {...field}
                maxLength={80}
                placeholder="Pagado valor"
                status={error && "error"}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  field.onChange(value);
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  const paste = e.clipboardData.getData("text").replace(/\D/g, "");
                  field.onChange(paste);
                }}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="fecha_pago"
          control={methods.control}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem label="Fecha pago">
              <DatePicker
                {...field}
                status={error && "error"}
                style={{ width: "100%" }}
                // defaultValue={dayjs("01-01-2000", dateFormat)}
                format={dateFormat}
                placeholder="Fecha pago"
                // disabledDate={disabledDate}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
    
      {/* <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="documento"
          control={methods.control}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem label="Documento incapacidad (PDF)">
              <Upload
                fileList={fileList}
                beforeUpload={(file) => {
                  const isPDF = file.type === "application/pdf";
                  if (!isPDF) {
                    message.error("Solo puedes subir archivos PDF.");
                  }
                  return isPDF || Upload.LIST_IGNORE; 
                }}
                maxCount={1}
                onChange={(info) => {
                  handleChange(info);
                  field.onChange(info.fileList);
                }}
                onRemove={() => {
                  setFileList([]);
                  field.onChange([]); 
                }}
                accept=".pdf"
              >
                <Button icon={<UploadOutlined />}>Seleccionar archivo</Button>
              </Upload>
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col> */}

      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="documento"
          control={methods.control}
          rules={{
            validate: {
              fileType: (files) => {
                if (!files || files.length === 0) return true; // Permite vacío
                return validateFileType(files[0], ["application/pdf"])
                  ? true
                  : "Archivo no válido. Solo se permiten PDF";
              },
              fileSize: (files) => {
                if (!files || files.length === 0) return true; // Permite vacío
                return files[0].size <= 2 * 1024 * 1024
                  ? true
                  : "El archivo no debe superar los 2 MB.";
              },
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem label="Incapacidad (PDF)">
              <Input
                status={error && "error"}
                type="file"
                accept=".pdf"
                onChange={(e) => field.onChange(e.target.files)}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      <Col xs={24} sm={6} style={{ width: "100%" }}>
        <Controller
          name="trascrito"
          control={methods.control}
          rules={{
            validate: {
              fileType: (files) => {
                if (!files || files.length === 0) return true; // Permite vacío
                return validateFileType(files[0], ["application/pdf"])
                  ? true
                  : "Archivo no válido. Solo se permiten PDF";
              },
              fileSize: (files) => {
                if (!files || files.length === 0) return true; // Permite vacío
                return files[0].size <= 2 * 1024 * 1024
                  ? true
                  : "El archivo no debe superar los 2 MB.";
              },
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem label="Transcrito (PDF)">
              <Input
                status={error && "error"}
                type="file"
                accept=".pdf"
                onChange={(e) => field.onChange(e.target.files)}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      <Col xs={24} sm={6} style={{ width: "100%" }}>
        <Controller
          name="constancia"
          control={methods.control}
          rules={{
            validate: {
              fileType: (files) => {
                if (!files || files.length === 0) return true; // Permite vacío
                return validateFileType(files[0], ["application/pdf"])
                  ? true
                  : "Archivo no válido. Solo se permiten PDF";
              },
              fileSize: (files) => {
                if (!files || files.length === 0) return true; // Permite vacío
                return files[0].size <= 2 * 1024 * 1024
                  ? true
                  : "El archivo no debe superar los 2 MB.";
              },
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem label="Constancia (PDF)">
              <Input
                status={error && "error"}
                type="file"
                accept=".pdf"
                onChange={(e) => field.onChange(e.target.files)}
              />
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
                autoSize={{ minRows: 1, maxRows: 6 }}
                maxLength={250}
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
