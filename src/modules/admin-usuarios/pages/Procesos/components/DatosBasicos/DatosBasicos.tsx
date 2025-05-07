/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { getBodegas, validarUsuario } from "@/services/maestras/maestrasAPI";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Controller, useFormContext } from "react-hook-form";
import { getAliados } from "@/services/aliados/aliadosAPI";
import { useEffect, useState } from "react";
import { Usuario } from "../../types";
import {
  SelectProps,
  Typography,
  Checkbox,
  Select,
  Input,
  Col,
  Row,
} from "antd";
import { getFuentes } from "@/services/maestras/fuentesAPI";

const { Text } = Typography;

interface Props {
  usuario?: Usuario;
}

export const DatosBasicos = ({ usuario }: Props) => {
  const [phoneValue, setPhoneValue] = useState<string>("");
  const [selectBodegas, setSelectBodegas] = useState<SelectProps["options"]>(
    []
  );
  const [selectAliado, setSelectAliado] = useState<SelectProps["options"]>([]);
  const [selectFuentes, setSelectFuentes] = useState<SelectProps["options"]>(
    []
  );
  const [timer, setTimer] = useState<any>(null);
  const methods = useFormContext();

  useEffect(() => {
    methods.setValue("has_bodegas", methods.watch("has_bodegas"));
  }, [methods.watch("has_bodegas")]);

  useEffect(() => {
    methods.setValue("has_fuentes", methods.watch("has_fuentes"));
  }, [methods.watch("has_fuentes")]);

  useEffect(() => {
    methods.setValue("rol", methods.watch("rol"));
  }, [methods.watch("rol")]);

  useEffect(() => {
    getBodegas().then(({ data: { data } }) => {
      setSelectBodegas(
        data.map((bodega) => ({ value: bodega.id, label: bodega.bod_nombre }))
      );
    });
    getAliados().then(({ data: { data } }) => {
      setSelectAliado(
        data.map((aliado) => ({ value: aliado.id, label: aliado.aldo_nombre }))
      );
    });
    getFuentes().then(({ data: { data } }) => {
      setSelectFuentes(
        data.map((fuente) => ({
          value: fuente.id.toString(),
          label: `${fuente.prefijo} - ${fuente.descripcion}`,
        }))
      );
    });
  }, []);

  useEffect(() => {
    usuario?.user ? setPhoneValue(usuario.user.telefono) : "";
    methods.reset(
      usuario?.user
        ? {
            nombre: usuario.user.nombre,
            cedula: usuario.user.cedula,
            cargo: usuario.user.cargo,
            telefono: usuario.user.telefono,
            rol: usuario.user.rol,
            username: usuario.user.username,
            has_bodegas: parseInt(usuario.user.has_bodegas) == 1,
            has_fuentes: parseInt(usuario.user.has_fuentes) == 1,
            bodegas_habilitadas: usuario.user.bodegas_habilitadas,
            password: "",
            fuentes: usuario.fuentes,
          }
        : {
            nombre: null,
            cedula: null,
            cargo: "NA",
            telefono: null,
            rol: null,
            username: null,
            has_bodegas: 0,
            bodegas_habilitadas: [],
            password: "",
            has_fuentes: 0,
            fuentes: [],
          }
    );

    if (usuario && usuario.aliado.length > 0) {
      methods.setValue("aliado_id", usuario.aliado[0].id_aliado);
    }
  }, [usuario]);

  const onUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    methods.setValue("username", e.target.value);
    if (timer) {
      clearTimeout(timer);
    }

    const newTimer = setTimeout(() => {
      validarUsuario(e.target.value).then(({ data }) => {
        Object.entries(data).length === 0
          ? methods.clearErrors("username")
          : methods.setError("username", {
              message: "Usuario existente, ingresa otro.",
            });
      });
    }, 600);

    setTimer(newTimer);
  };

  const handleChangePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    methods.setValue("telefono", e.target.value);
    const { value: inputValue } = e.target;
    const reg = /^-?\d*(\d*)?$/;
    if (
      reg.test(inputValue) ||
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

  return (
    <>
      <Row gutter={24}>
        <Col xs={24} md={12} style={{ width: "100%" }}>
          <Controller
            name="nombre"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Nombre completo es requerido",
              },
              minLength: {
                value: 10,
                message: "Nombre completo debe tener mínimo 10 caracteres",
              },
              maxLength: {
                value: 60,
                message: "Nombre completo debe tener máximo 60 caracteres",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Nombre completo:">
                <Input
                  {...field}
                  placeholder="Nombre completo"
                  status={error && "error"}
                  maxLength={60}
                  style={{ textTransform: "uppercase" }}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="cedula"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Cédula es requerido",
              },
              minLength: {
                value: 8,
                message: "La cédula debe tener más de 8 caracteres",
              },
              maxLength: {
                value: 15,
                message: "La cédula debe tener hasta 15 caracteres",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Cédula:">
                <Input
                  {...field}
                  placeholder="Cédula"
                  status={error && "error"}
                  style={{ width: "100%" }}
                  maxLength={10}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="telefono"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Telefono es requerido",
              },
              minLength: {
                value: 10,
                message: "El teléfono debe tener 10 caracteres",
              },
              maxLength: {
                value: 10,
                message: "El teléfono debe tener 10 caracteres",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Teléfono:">
                <Input
                  {...field}
                  placeholder="Teléfono"
                  value={phoneValue}
                  onChange={handleChangePhone}
                  onBlur={handleBlurPhone}
                  status={error && "error"}
                  maxLength={10}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} md={12}>
          <Controller
            name="rol"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Rol es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Rol:">
                <Select
                  {...field}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label?.toString() ?? "")
                      .toLowerCase()
                      .includes(input.toString().toLowerCase())
                  }
                  options={[
                    { value: "administrador", label: "Administrador" },
                    { value: "usuario", label: "Usuario" },
                    { value: "compras", label: "Compras" },
                    { value: "auditoria", label: "Auditoria" },
                    { value: "regente", label: "Regente" },
                    { value: "regente_farmacia", label: "Regente Farmacia" },
                    { value: "cotizaciones", label: "Cotizaciones" },
                    { value: "quimico", label: "Quimico" },
                    { value: "revisor_compras", label: "Revisor Compras" },
                    { value: "auxiliar_bodega", label: "Auxiliar Bodega" },
                    { value: "juridico", label: "Jurídico" },
                    { value: "facturacion", label: "Facturación" },
                    { value: "contabilidad", label: "Contabilidad" },
                    { value: "calidad", label: "Calidad" },
                    { value: "gh_admin", label: "Gestión Humana Admin" },
                    { value: "gh_auxiliar", label: "Gestión Humana Auxiliar" },
                    { value: "gh_consulta", label: "Gestión Humana Consulta" },
                    { value: "gh_bienestar", label: "Bienestar" },
                  ]}
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="username"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Nombre de usuario es requerido",
              },
              minLength: {
                value: 5,
                message: "El usuario debe tener mas de 5 caracteres",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Nombre de usuario:">
                <Input
                  {...field}
                  prefix={<UserOutlined style={{ color: "grey" }} />}
                  placeholder="Nombre de usuario"
                  status={error && "error"}
                  disabled={usuario ? true : false}
                  onChange={onUsernameChange}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="password"
            control={methods.control}
            rules={{
              required: {
                value: usuario?.user ? false : true,
                message: "Contraseña es requerido",
              },
              minLength: {
                value: 6,
                message: "La contraseña debe tener un minimo de 6 caracteres",
              },
              maxLength: {
                value: 8,
                message: "La contraseña debe tener un máximo de 8 caracteres",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Contraseña:">
                <Input.Password
                  {...field}
                  prefix={<LockOutlined style={{ color: "grey" }} />}
                  placeholder="Contraseña de usuario"
                  status={error && "error"}
                  autoComplete="off"
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col span={24}>
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Controller
                name="has_bodegas"
                control={methods.control}
                render={({ field }) => (
                  <StyledFormItem>
                    <Checkbox
                      {...field}
                      checked={methods.getValues("has_bodegas")}
                    >
                      Habilitar bodegas
                    </Checkbox>
                  </StyledFormItem>
                )}
              />
              {methods.getValues("has_bodegas") ? (
                <Controller
                  name="bodegas_habilitadas"
                  control={methods.control}
                  render={({ field }) => (
                    <StyledFormItem
                      label="Bodegas Habilitadas:"
                      extra={
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          Las bodegas seleccionadas serán las habilitadas como
                          bodega destino en los traslados y en la lista de
                          inventario.
                          {/* <br />{" "}
                          <b>
                            (Solo aplica para el rol 'usuario', 'calidad',
                            'auxiliar bodega' 'regente farmacia')
                          </b> */}
                        </Text>
                      }
                    >
                      <Select
                        {...field}
                        showSearch
                        mode="multiple"
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
                      />
                    </StyledFormItem>
                  )}
                />
              ) : null}
            </Col>
            <Col xs={24} md={12}>
              <Controller
                name="aliado_id"
                control={methods.control}
                render={({ field }) => (
                  <StyledFormItem
                    label="Aliado:"
                    extra={
                      <Text type="danger" style={{ fontSize: 11 }}>
                        Este campo solo aplica para los usuarios que van a
                        cargar dispensaciones por archivo plano
                      </Text>
                    }
                  >
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
                      options={selectAliado}
                    />
                  </StyledFormItem>
                )}
              />
            </Col>
            <Col xs={24} md={12}>
              <Controller
                name="has_fuentes"
                control={methods.control}
                render={({ field }) => (
                  <StyledFormItem>
                    <Checkbox
                      {...field}
                      checked={methods.getValues("has_fuentes")}
                    >
                      Habilitar fuentes
                    </Checkbox>
                  </StyledFormItem>
                )}
              />
              {methods.getValues("has_fuentes") ? (
                <Controller
                  name="fuentes"
                  control={methods.control}
                  render={({ field }) => (
                    <StyledFormItem
                      label="Fuentes:"
                      extra={
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          Las fuentes seleccionadas solo aplicarán para los
                          usuarios del HUV
                        </Text>
                      }
                    >
                      <Select
                        {...field}
                        showSearch
                        mode="multiple"
                        maxTagCount={2}
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
                        options={selectFuentes}
                      />
                    </StyledFormItem>
                  )}
                />
              ) : null}
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};
