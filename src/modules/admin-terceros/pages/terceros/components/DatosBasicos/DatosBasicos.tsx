/* eslint-disable react-hooks/exhaustive-deps */
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Col, Input, notification, Row, Select, SelectProps, Space, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { Props } from "./types";
import { getTiposDocumentosIdentificacion } from "@/services/admin-terceros/tercerosAPI";

const { Text } = Typography;

export const DatosBasicos = ({ tercero, tercerotipos, localidades }: Props) => {
  const [phoneValue, setPhoneValue] = useState<string>("");
  const [cellPhoneValue, setCellPhoneValue] = useState<string>("");
  const [selectTipo, setSelectTipo] = useState<SelectProps["options"]>([]);
  const [selectLocalidad, setSelectLocalidad] = useState<
    SelectProps["options"]
  >([]);
  const [selectTipoDocumento, setSelectTipoDocumento] = useState<
  SelectProps["options"]
>([]);
const [notificationApi, contextHolder] = notification.useNotification();
  const methods = useFormContext();

  useEffect(() => {
    const optionsTipo = tercerotipos?.map((item) => {
      return { label: item.descripcion, value: item.id };
    });
    setSelectTipo(optionsTipo);
    const optionsLoc = localidades?.map((localidad) => {
      return {
        label: `${localidad.municipio} - ${localidad.departamento}`,
        value: localidad.id.toString(),
      };
    });
    setSelectLocalidad(optionsLoc);
  }, [tercero, tercerotipos, localidades]);

  useEffect(() => {
    tercero ? setPhoneValue(tercero?.telefono) : "";
    tercero ? setCellPhoneValue(tercero?.celular) : "";
    methods.reset(
      tercero
        ? {
            tipo_documento: tercero.tipo_documento,
            tipo_persona: tercero.tipo_persona,
            nit: tercero.nit.toString(),
            digito_ver: tercero.digito_ver,
            nombre: tercero.nombre,
            razon_soc: tercero.razon_soc,
            nombre1: tercero.nombre1,
            nombre2: tercero.nombre2,
            apellido1: tercero.apellido1,
            apellido2: tercero.apellido2,
            direccion: tercero.direccion,
            telefono: tercero.telefono,
            correo_ele: tercero.correo_ele,
            ciudad: tercero.ciudad,
            medio_pag: tercero.medio_pag,
            celular: tercero.celular,
            barrio: tercero.barrio,
            tipo_id: JSON.parse(tercero.tipo_id),
            estado: tercero.estado,
          }
        : {
            tipo_documento: "NIT",
            tipo_persona: null,
            nit: null,
            digito_ver: null,
            nombre: null,
            razon_soc: null,
            nombre1: null,
            nombre2: null,
            apellido1: null,
            apellido2: null,
            direccion: null,
            telefono: null,
            correo_ele: null,
            ciudad: null,
            medio_pag: null,
            celular: null,
            barrio: null,
            tipo_id: [],
            estado: "1",
          }
    );
  }, [tercero]);

  useEffect(()=>{
    getTiposDocumentosIdentificacion("terceros")
      .then(({ data: { data } }) => {
        setSelectTipoDocumento(
          data.map((item) => ({
            value: item.codigo,
            label: `${item.codigo} - ${item.descripcion}`,
          }))
        );
      })
      .catch(
        ({
          response,
          response: {
            data: { errors },
          },
        }) => {
          if (errors) {
            const errores: string[] = Object.values(errors);
            for (const error of errores) {
              notificationApi.open({
                type: "error",
                message: error,
              });
            }
          } else {
            notificationApi.open({
              type: "error",
              message: response.data.message,
            });
          }
        }
      );

  },[tercero])

  const handleChangePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    methods.setValue("telefono", e.target.value);
    const { value: inputValue } = e.target;
    const reg = /^-?\d*(\d*)?$/;
    if (
      reg.test(inputValue) ||
      (inputValue === "" && inputValue.length == 7) ||
      (inputValue === "" && inputValue.length == 10)
    ) {
      setPhoneValue(inputValue);
      methods.clearErrors("telefono");
    }
  };

  const handleBlurPhone = () => {
    let valueTemp = phoneValue;
    if (phoneValue.charAt(phoneValue.length - 1) === ".") {
      valueTemp = phoneValue.slice(0, -1);
    }
    setPhoneValue(valueTemp.replace(/0*(\d+)/, "$1"));
  };

  const handleChangeCellPhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    methods.setValue("celular", e.target.value);
    const { value: inputValue } = e.target;
    const reg = /^-?\d*(\d*)?$/;
    if (
      reg.test(inputValue) ||
      (inputValue === "" && inputValue.length == 10)
    ) {
      setCellPhoneValue(inputValue);
      methods.clearErrors("celular");
    }
  };

  const handleBlurCellPhone = () => {
    let valueTemp = cellPhoneValue;
    if (cellPhoneValue.charAt(cellPhoneValue.length - 1) === ".") {
      valueTemp = phoneValue.slice(0, -1);
    }
    setCellPhoneValue(valueTemp.replace(/0*(\d+)/, "$1"));
  };

  return (
    <>
    {contextHolder}
      <Row gutter={24}>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Row gutter={12}>
            <Col xs={24} sm={12}>
              <Controller
                name="tipo_documento"
                control={methods.control}
                rules={{
                  required: {
                    value: true,
                    message: "Tipo documento es requerido",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Tipo Documento:">
                    <Select
                      {...field}
                      options={selectTipoDocumento}
                      placeholder="Tipo Documento"
                      status={error && "error"}
                    />
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                )}
              />
            </Col>
            <Col xs={24} sm={12}>
              <StyledFormItem required label="Identificación:">
                <Space.Compact style={{ width: "100%" }}>
                  <Controller
                    name="nit"
                    control={methods.control}
                    rules={{
                      required: {
                        value: true,
                        message: "Identificación es requerido",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <Space>
                        <Input
                          {...field}
                          placeholder="IDENTIFICACIÓN"
                          status={error && "error"}
                          disabled={tercero ? true : false}
                          style={{ textAlign: "center" }}
                        />
                        {/* <Text type="danger">{error?.message}</Text> */}
                      </Space>
                    )}
                  />
                  <Input
                    value={"-"}
                    disabled
                    style={{ textAlign: "center", maxWidth: 40 }}
                  />
                  <Controller
                    name="digito_ver"
                    control={methods.control}
                    rules={{
                      required: {
                        value: true,
                        message: "Dígito verificación es requerido",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <Space direction="vertical">
                        <Input
                          {...field}
                          placeholder="DÍGITO VERIFICACIÓN"
                          status={error && "error"}
                          style={{ textAlign: "center", maxWidth: 150 }}
                        />
                        {/* <Text type="danger">{error?.message}</Text> */}
                      </Space>
                    )}
                  />
                </Space.Compact>
                <Text type="danger">
                  {methods.getFieldState("nit").error?.message}
                </Text>
                <br />
                <Text type="danger">
                  {methods.getFieldState("digito_ver").error?.message}
                </Text>
              </StyledFormItem>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={24}>
              <Controller
                name="tipo_persona"
                control={methods.control}
                rules={{
                  required: {
                    value: true,
                    message: "Tipo Persona es requerido",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Tipo Persona:">
                    <Select
                      {...field}
                      options={[
                        { label: "NATURAL", value: "PERSONA NATURAL" },
                        { label: "JURIDICA", value: "PERSONA JURIDICA" },
                      ]}
                      placeholder="TIPO PERSONA"
                      status={error && "error"}
                    />
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                )}
              />
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={24}>
              <Controller
                name="nombre"
                control={methods.control}
                rules={{
                  required: {
                    value: true,
                    message: "Nombre Comercial es requerido",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Nombre Comercial:">
                    <Input
                      {...field}
                      placeholder="Nombre Comercial"
                      status={error && "error"}
                      style={{ textTransform: "uppercase" }}
                    />
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                )}
              />
            </Col>
          </Row>

          <Row gutter={12}>
            <Col xs={24} sm={12}>
              <Controller
                name="nombre1"
                control={methods.control}
                rules={{
                  required: {
                    value: true,
                    message: "Primer nombre es requerido",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Primer Nombre:">
                    <Input
                      {...field}
                      placeholder="Primer Nombre"
                      status={error && "error"}
                      style={{ textTransform: "uppercase" }}
                    />
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                )}
              />
            </Col>
            <Col xs={24} sm={12}>
              <Controller
                name="nombre2"
                control={methods.control}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem label="Segundo Nombre:">
                    <Input
                      {...field}
                      placeholder="Segundo Nombre"
                      status={error && "error"}
                      style={{ textTransform: "uppercase" }}
                    />
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                )}
              />
            </Col>
          </Row>
          <Row gutter={12}>
            <Col xs={24} sm={12}>
              <Controller
                name="apellido1"
                control={methods.control}
                rules={{
                  required: {
                    value: true,
                    message: "Primer apellido es requerido",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Primer Apellido:">
                    <Input
                      {...field}
                      placeholder="Primer Apellido"
                      status={error && "error"}
                      style={{ textTransform: "uppercase" }}
                    />
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                )}
              />
            </Col>
            <Col xs={24} sm={12}>
              <Controller
                name="apellido2"
                control={methods.control}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem label="Segundo Apellido:">
                    <Input
                      {...field}
                      placeholder="Segundo Apellido"
                      status={error && "error"}
                      style={{ textTransform: "uppercase" }}
                    />
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                )}
              />
            </Col>
          </Row>
          <Row gutter={12}>
            <Col xs={24} sm={12}>
              <Controller
                name="telefono"
                control={methods.control}
                rules={{
                  minLength: {
                    value: 7,
                    message: "El teléfono debe ser mínimo 7 caracteres",
                  },
                  maxLength: {
                    value: 10,
                    message: "El teléfono debe ser máximo 10 caracteres",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem label="Teléfono:">
                    <Input
                      {...field}
                      placeholder="Teléfono"
                      status={error && "error"}
                      value={phoneValue}
                      onChange={handleChangePhone}
                      onBlur={handleBlurPhone}
                      maxLength={10}
                    />
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                )}
              />
            </Col>
            <Col xs={24} sm={12}>
              <Controller
                name="celular"
                control={methods.control}
                rules={{
                  required: {
                    value: true,
                    message: "Celular es requerido",
                  },
                  minLength: {
                    value: 10,
                    message: "El celular debe ser de 10 caracteres",
                  },
                  maxLength: {
                    value: 10,
                    message: "El celular debe ser de 10 caracteres",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Celular:">
                    <Input
                      {...field}
                      placeholder="Celular"
                      status={error && "error"}
                      value={cellPhoneValue}
                      onChange={handleChangeCellPhone}
                      onBlur={handleBlurCellPhone}
                      maxLength={10}
                    />
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                )}
              />
            </Col>
          </Row>
          <Controller
            name="correo_ele"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Correo Electrónico es requerido",
              },
              pattern: {
                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                message: "Correo Electrónico debe tener un formato válido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Correo Electrónico:">
                <Input
                  {...field}
                  placeholder="Correo Electrónico"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="razon_soc"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Razon Social es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Razon Social:">
                <Input
                  {...field}
                  placeholder="Presentación"
                  status={error && "error"}
                  style={{ textTransform: "uppercase" }}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Row gutter={12}>
            <Col xs={24} sm={12}>
              <Controller
                name="tipo_id"
                control={methods.control}
                rules={{
                  required: {
                    value: true,
                    message: "Tipo Tercero es requerido",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Tipo Tercero:">
                    <Select
                      {...field}
                      mode="multiple"
                      options={selectTipo}
                      placeholder="Tipo Tercero"
                      status={error && "error"}
                    />
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                )}
              />
            </Col>
            <Col xs={24} sm={12}>
              <Controller
                name="estado"
                control={methods.control}
                rules={{
                  required: {
                    value: true,
                    message: "Estado es requerido",
                  },
                }}
                defaultValue={"1"}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Estado:">
                    <Select
                      {...field}
                      options={[
                        { value: "0", label: "INACTIVO" },
                        { value: "1", label: "ACTIVO" },
                      ]}
                      status={error && "error"}
                      disabled={!tercero ? true : false}
                    />
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                )}
              />
            </Col>
          </Row>
          <Controller
            name="medio_pag"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Medio de pago es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Medio de Pago:">
                <Select
                  {...field}
                  options={[
                    { label: "Consignación", value: "consignacion" },
                    { label: "Efectivo", value: "efectivo" },
                  ]}
                  placeholder="Medio de Pago"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="ciudad"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Ciudad es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Ciudad:">
                <Select
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toString()
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) !== -1
                  }
                  {...field}
                  placeholder="CIUDAD"
                  status={error && "error"}
                  options={selectLocalidad}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="direccion"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Dirección es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Dirección:">
                <Input
                  {...field}
                  placeholder="Dirección"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
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
              <StyledFormItem required label="Barrio:">
                <Input
                  {...field}
                  placeholder="Barrio"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
      </Row>
    </>
  );
};
