import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import {
  Alert,
  Col,
  Collapse,
  Input,
  InputNumber,
  Row,
  Select,
  Tooltip,
  Typography,
} from "antd";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Proceso, Props } from "./types";
import { useParams } from "react-router-dom";
import { InfoCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;
const { Panel } = Collapse;

export const DatosFacturacion = ({
  selectTipoProyecto,
  selectUSuarios,
  selectIngeniero,
  procesos,
}: Props) => {
  const methods = useFormContext();

  const tipoProyecto = useWatch({
    control: methods.control,
    name: "tipoProyecto_id",
  });

  const tipoObra = useWatch({
    control: methods.control,
    name: "tipo_obra",
  });

  /* apartamentos */
  const cantidadTorres = useWatch({
    name: "torres",
    control: methods.control,
  });

  const pisosPorTorre = useWatch({
    name: "bloques",
    control: methods.control,
  });

  /* casas */
  const cantidadManzanas = useWatch({
    name: "cantidadManzanas",
    control: methods.control,
  });

  const manzanasData = useWatch({
    name: "manzanas",
    control: methods.control,
  });

  const { id } = useParams<{ id: string }>();

  /* render personaliza de apt */
  const renderPersonalizada = () => {
    const bloques = [];
    const totalTorres = parseInt(cantidadTorres || "0", 10);

    for (let i = 0; i < totalTorres; i++) {
      const cantidadPisos = parseInt(pisosPorTorre?.[i]?.pisos || "0", 10);
      const inputsPorPiso = [];

      for (let j = 0; j < cantidadPisos; j++) {
        inputsPorPiso.push(
          <Col xs={24} sm={4} key={`piso-${j}`}>
            <Controller
              name={`bloques[${i}].apartamentosPorPiso[${j}]`}
              control={methods.control}
              rules={{
                required: {
                  value: true,
                  message: "Cantidad de apartamentos requerida",
                },
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Solo se permiten números",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem required label={`Aptos en Piso ${j + 1}`}>
                  <Input
                    {...field}
                    placeholder="Solo número"
                    type="number"
                    status={error && "error"}
                  />
                  <Text type="danger">{error?.message}</Text>
                </StyledFormItem>
              )}
            />
          </Col>
        );
      }

      bloques.push(
        <Col span={24} key={i}>
          <Collapse
            style={{ backgroundColor: "#1a4c9e" }}
            expandIconPosition="right"
          >
            <Panel
              header={`Torre ${i + 1}`}
              key={i}
              style={{ color: "#FFFFFF" }}
            >
              <Row gutter={[12, 6]}>
                {/* ✅ Nombre de la torre */}
                <Col xs={24} sm={24}>
                  <Controller
                    name={`bloques[${i}].nombre`}
                    control={methods.control}
                    rules={{
                      required: {
                        value: true,
                        message: `Nombre para la Torre ${i + 1} es requerido`,
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem
                        required
                        label={`Nombre de la Torre ${i + 1}`}
                      >
                        <Input
                          {...field}
                          placeholder={`Ej: Torre ${i + 1}`}
                          status={error && "error"}
                        />
                        <Text type="danger">{error?.message}</Text>
                      </StyledFormItem>
                    )}
                  />
                </Col>

                {/* Cantidad de pisos */}
                <Col xs={24} sm={24}>
                  <Controller
                    name={`bloques[${i}].pisos`}
                    control={methods.control}
                    rules={{
                      required: {
                        value: true,
                        message: "Cantidad de pisos requerida",
                      },
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Solo se permiten números",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem required label="Cantidad de Pisos">
                        <Input
                          {...field}
                          placeholder="Solo número"
                          type="number"
                          status={error && "error"}
                        />
                        <Text type="danger">{error?.message}</Text>
                      </StyledFormItem>
                    )}
                  />
                </Col>

                {/* Inputs de apartamentos por piso */}
                {inputsPorPiso}
              </Row>
            </Panel>
          </Collapse>
        </Col>
      );
    }

    return (
      <>
        <Col span={24}>
          <Alert
            message="Selecciona cantidad de torres. Por cada torre podrás especificar su nombre, cuántos pisos y cuántos apartamentos por piso."
            type="success"
          />
        </Col>
        {bloques}
      </>
    );
  };

  /* render de casas */
  const renderCasas = () => {
    const bloques = [];
    const totalManzanas = parseInt(cantidadManzanas || "0", 10);

    for (let i = 0; i < totalManzanas; i++) {
      const totalCasas = parseInt(manzanasData?.[i]?.cantidadCasas || "0", 10);
      const casasInputs = [];

      for (let j = 0; j < totalCasas; j++) {
        casasInputs.push(
          <Col xs={24} sm={4} key={`casa-${i}-${j}`}>
            <Controller
              name={`manzanas[${i}].casas[${j}].pisos`}
              control={methods.control}
              rules={{
                required: {
                  value: true,
                  message: "Cantidad de pisos requerida",
                },
                validate: (value) =>
                  value === 1 || value === 2 || "Solo se permite 1 o 2 pisos",
              }}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem required label={`Casa ${j + 1} - Pisos`}>
                  <InputNumber
                    {...field}
                    min={1}
                    max={2}
                    placeholder="Solo 1 o 2 pisos"
                    status={error ? "error" : ""}
                    style={{ width: "100%" }}
                  />
                  <Text type="danger">{error?.message}</Text>
                </StyledFormItem>
              )}
            />
          </Col>
        );
      }

      bloques.push(
        <Col span={24} key={i}>
          <Collapse
            style={{ backgroundColor: "#1a4c9e" }}
            expandIconPosition="right"
          >
            <Panel
              header={`Manzana ${i + 1}`}
              key={i}
              style={{ color: "#FFFFFF" }}
            >
              <Row gutter={[12, 6]}>
                {/* Nombre de la manzana */}
                <Col xs={24}>
                  <Controller
                    name={`manzanas[${i}].nombre`}
                    control={methods.control}
                    rules={{
                      required: { value: true, message: `Nombre requerido` },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem
                        required
                        label={`Nombre Manzana ${i + 1}`}
                      >
                        <Input {...field} status={error && "error"} />
                        <Text type="danger">{error?.message}</Text>
                      </StyledFormItem>
                    )}
                  />
                </Col>

                {/* Cantidad de casas */}
                <Col xs={24}>
                  <Controller
                    name={`manzanas[${i}].cantidadCasas`}
                    control={methods.control}
                    rules={{
                      required: {
                        value: true,
                        message: "Cantidad de casas requerida",
                      },
                      pattern: { value: /^[0-9]+$/, message: "Solo números" },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem required label="Cantidad Casas">
                        <Input
                          {...field}
                          type="number"
                          status={error && "error"}
                        />
                        <Text type="danger">{error?.message}</Text>
                      </StyledFormItem>
                    )}
                  />
                </Col>

                {casasInputs}
              </Row>
            </Panel>
          </Collapse>
        </Col>
      );
    }

    return (
      <>
        <Col span={24}>
          <Alert
            message="Primero define la cantidad de manzanas. Luego cada manzana tendrá su nombre, número de casas y pisos por casa."
            type="success"
          />
        </Col>
        {bloques}
      </>
    );
  };

  return (
    <Row gutter={[12, 6]}>
      {/* cuando se crea un proyecyo */}
      {!id && (
        <>
          {/* Tipo Proyecto */}
          <Col xs={24} sm={6}>
            <Controller
              name="tipoProyecto_id"
              control={methods.control}
              rules={{
                required: {
                  value: true,
                  message: "Tipo de proyecto es requerido",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem required label="Tipo Proyecto:">
                  <Select
                    {...field}
                    status={error && "error"}
                    options={selectTipoProyecto}
                    placeholder="Tipo de Proyecto"
                    onChange={(value) => {
                      field.onChange(value);
                      methods.resetField("tipo_obra", { defaultValue: "" }); // queda con 3 para setear
                    }}
                  />

                  <Text type="danger">{error?.message}</Text>
                </StyledFormItem>
              )}
            />
          </Col>
        </>
      )}

      {/* apt para activacion por dia   */}
      <Col xs={24} sm={5}>
        <Controller
          name="activador_pordia_apt"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Numero de activacion de apt por dia es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Activacion por dia de procesos:">
              <Input
                {...field}
                disabled={tipoProyecto=="1" ? false:true}
                status={error && "error"}
                placeholder="00"
                type="number"
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* usuario asignado */}
      <Col xs={24} sm={6}>
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
      <Col xs={24} sm={6}>
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

      {/* minimo de apt para confirmar pisos, no debe ser mayor a la canitdad de apt    */}
      {tipoProyecto === 1 && (
        <>
          <Col xs={24} sm={6}>
            <Controller
              name="minimoApt"
              control={methods.control}
              rules={{
                required: {
                  value: true,
                  message: "Numero minimo de apt es requerido",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem
                  required
                  label={
                    <span>
                      Minimo APT{" "}
                      <Tooltip title="Es la cantidad de apt minimos que deben ser confirmado para tomar el piso como completo">
                        <InfoCircleOutlined
                          style={{ color: "#faad14", cursor: "pointer" }}
                        />
                      </Tooltip>
                    </span>
                  }
                >
                  <Input
                    {...field}
                    status={error && "error"}
                    placeholder="00"
                    type="number"
                  />
                  <Text type="danger">{error?.message}</Text>
                </StyledFormItem>
              )}
            />
          </Col>
        </>
      )}

      {/*cuando se esta editando un proyecto  */}
      {id && (
        <>
          {/* foreach de procesos */}
          {procesos?.map((proceso: Proceso, index: number) => (
            <Col xs={24} sm={4} key={proceso.proceso}>
              <Controller
                name={`procesos[${index}]`} // 👈 controlamos el objeto completo
                control={methods.control}
                defaultValue={{
                  proceso: proceso.proceso, // fijo desde tu data
                  numero: proceso.numero ?? "", // editable en el input
                }}
                rules={{
                  validate: (value) => {
                    if (!value?.numero) return "Número es requerido";
                    if (!/^[0-9]+$/.test(value.numero))
                      return "Solo números permitidos";
                    return true;
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem
                    required
                    label={`Proceso ${proceso.nombre_proceso}`}
                  >
                    <InputNumber
                      value={field.value?.numero}
                      onChange={(val) =>
                        field.onChange({
                          ...field.value,
                          numero: val, // se actualiza al escribir
                          proceso: proceso.proceso, // se mantiene el id del proceso
                        })
                      }
                      placeholder="Número de proceso"
                      status={error ? "error" : ""}
                      style={{ width: "100%" }}
                    />
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                )}
              />
            </Col>
          ))}
        </>
      )}

      {!id && (
        <>
          {/* SE DEBE CONDICIONAR SI SON APARTAMENTOS */}
          {/* Tipo Obra */}
          {tipoProyecto === 1 && (
            <>
              <Col xs={24} sm={6}>
                <Controller
                  name="tipo_obra"
                  control={methods.control}
                  rules={{
                    required: {
                      value: true,
                      message: "Tipo de obra es requerido",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem required label="Tipo de Obra">
                      <Select
                        {...field}
                        options={[
                          { value: 1, label: "Personalizada" },
                          { value: 0, label: "Simétrica" },
                        ]}
                        status={error && "error"}
                        placeholder="Selecciona tipo de obra"
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>
            </>
          )}

          {/* *********************************************APARTAMENTOS******************************************************/}
          {/* Simétrica */}
          {tipoObra === 0 && (
            <>
              {/* cantidad de torres */}
              <Col xs={24} sm={6}>
                <Controller
                  name="torres"
                  control={methods.control}
                  rules={{
                    required: {
                      value: true,
                      message: "Cantidad de torres requerida",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem required label="Cantidad Torres:">
                      <Input
                        {...field}
                        placeholder="00"
                        status={error && "error"}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>
              {/* cantidad de pisos */}
              <Col xs={24} sm={6}>
                <Controller
                  name="cant_pisos"
                  control={methods.control}
                  rules={{
                    required: {
                      value: true,
                      message: "Cantidad de pisos requerida",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem required label="Cantidad Pisos:">
                      <Input
                        {...field}
                        placeholder="00"
                        status={error && "error"}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>
              {/* canitdad de apt por pisos */}
              <Col xs={24} sm={6}>
                <Controller
                  name="apt"
                  control={methods.control}
                  rules={{
                    required: {
                      value: true,
                      message: "Cantidad de apartamentos requerida",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem
                      required
                      label="Cantidad Apartamentos por Piso:"
                    >
                      <Input
                        {...field}
                        placeholder="00"
                        status={error && "error"}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>
              {parseInt(cantidadTorres || "0", 10) > 0 &&
                Array.from({ length: parseInt(cantidadTorres) }).map(
                  (_, index) => (
                    <Col xs={24} sm={8} key={`torre-nombre-${index}`}>
                      <Controller
                        name={`torreNombres[${index}]`}
                        control={methods.control}
                        rules={{
                          required: {
                            value: true,
                            message: `Nombre de la Torre ${
                              index + 1
                            } es requerido`,
                          },
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <StyledFormItem
                            required
                            label={`Nombre Torre ${index + 1}`}
                          >
                            <Input
                              {...field}
                              placeholder={`Ej: Torre ${index + 1}`}
                              status={error && "error"}
                            />
                            <Text type="danger">{error?.message}</Text>
                          </StyledFormItem>
                        )}
                      />
                    </Col>
                  )
                )}
            </>
          )}

          {/* Personalizada */}
          {tipoObra === 1 && (
            <>
              <Col xs={24} sm={5}>
                <Controller
                  name="torres"
                  control={methods.control}
                  rules={{
                    required: {
                      value: true,
                      message: "Cantidad de torres requerida",
                    },
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Solo se permiten números",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem required label="Cantidad Torres:">
                      <Input
                        {...field}
                        placeholder="Solo número"
                        type="number"
                        status={error && "error"}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>
            </>
          )}

          {/* Renderización personalizada */}
          {tipoObra === 1 && cantidadTorres && renderPersonalizada()}
          {/* *********************************************APARTAMENTOS FIN************************************************ */}

          {/* *********************************************CASAS*********************************************************** **/}

          {/* cantidad de manzanas */}
          {tipoProyecto === 2 && (
            <>
              <Col xs={24} sm={6}>
                <Controller
                  name="cantidadManzanas" // 👈 cambio aquí
                  control={methods.control}
                  rules={{
                    required: {
                      value: true,
                      message: "Cantidad de manzanas requerida",
                    },
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Solo se permiten números",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem required label="Cantidad de Manzanas:">
                      <Input
                        {...field}
                        placeholder="Solo número"
                        type="number"
                        status={error && "error"}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>
            </>
          )}

          {tipoProyecto === 2 && renderCasas()}
          {/* *********************************************CASAS FIN****************************************************** ***/}
        </>
      )}
    </Row>
  );
};
