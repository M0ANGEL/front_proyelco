/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import {
  Col,
  Input,
  InputNumber,
  Row,
  Select,
  SelectProps,
  Typography,
} from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { Props } from "./types";
import { buscarPadre } from "@/services/maestras/productosPadreAPI";
import dayjs from "dayjs";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_ROL } from "@/config/api";

const { Text } = Typography;
let timeout: ReturnType<typeof setTimeout> | null;

export const DatosBasicos = ({
  producto,
  grupos,
  subgrupos,
  ivas,
  formaFarma,
  upr,
  tipoMedicamento,
}: Props) => {
  const [selectGrupo, setSelectGrupos] = useState<SelectProps["options"]>([]);
  const [selectSubGrupos, setSelectSubGrupos] = useState<
    SelectProps["options"]
  >([]);
  const [selectIvas, setSelectIvas] = useState<SelectProps["options"]>([]);
  const [selectPadre, setSelectPadre] = useState<SelectProps["options"]>([]);
  const [selectFormafm, setSelectFormafm] = useState<SelectProps["options"]>(
    []
  );
  const [selectUpr, setSelectUpr] = useState<SelectProps["options"]>([]);
  const [selectTipoMedicamento, setSelectTipoMedicamento] = useState<
    SelectProps["options"]
  >([]);

  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);
  const methods = useFormContext();

  useEffect(() => {
    const optionsGrupo = grupos
      ?.filter((item) => item.estado == "1")
      .map((item) => {
        return { label: item.descripcion, value: item.id.toString() };
      });
    const optionsIva = ivas
      ?.sort((a, b) => parseFloat(a.iva) - parseFloat(b.iva))
      .map((item) => {
        return { label: `${item.iva} %`, value: item.id.toString() };
      });
    setSelectGrupos(optionsGrupo);
    setSelectIvas(optionsIva);
    if (producto) {
      const optionsSubgrupo = subgrupos
        ?.filter((item) => item.grupo_id == producto.grupo_id)
        .filter((item) => item.estado == "1")
        .map((item) => {
          return { label: item.descripcion, value: item.id.toString() };
        });
      setSelectSubGrupos(optionsSubgrupo);
      const optionsPadre = [
        {
          label: `${producto.codigo_padre.cod_padre} - ${producto.codigo_padre.descripcion}`,
          value: producto.codigo_padre.cod_padre,
        },
      ];
      setSelectPadre(optionsPadre);
    }
  }, [producto, grupos, subgrupos, ivas]);

  useEffect(() => {
    methods.reset(
      producto
        ? {
            descripcion: producto.descripcion,
            principio_act: producto.principio_act,
            cod_barra: producto.cod_barra,
            presentacion: producto.presentacion,
            forma_far: producto.forma_far,
            via_admin: producto.via_admin,
            ubicacion: producto.ubicacion,
            laboratorio: producto.laboratorio,
            concentracion: producto.concentracion,
            uni_dispensacion: producto.uni_dispensacion,
            invima: producto.invima,
            cum: producto.cum,
            expediente: producto.expediente,
            atc: producto.atc,
            estado_invima: producto.estado_invima,
            fecha_vig_invima: dayjs(producto.fecha_vig_invima, "DD/MM/YYYY"),
            iva_id: producto.iva_id,
            grupo_id: producto.grupo_id,
            subgrupo_id: producto.subgrupo_id,
            estado: producto.estado,
            cant_presentacion: producto.cant_presentacion,
            unidad_medida: producto.unidad_medida,
            nivel_invima: producto.nivel_invima,
            pbs: producto.pbs,
            cod_mipres: producto.cod_mipres,
            cadena_frio: producto.cadena_frio,
            cod_padre: producto.cod_padre,
            circular_regulacion: producto.circular_regulacion,
            p_regulado_compra: producto.p_regulado_compra,
            p_regulado_venta: producto.p_regulado_venta,
            precio_promedio: producto.precio_promedio
              ? parseFloat(producto.precio_promedio)
              : 0,
            ium: producto.ium,
            ium1: producto.ium1,
            ium2: producto.ium2,
            ium3: producto.ium3,
            cod_huv: producto.cod_huv,
            tipo_medicamento_id: producto.tipo_medicamento_id,
            grupo_invima: producto.grupo_invima,
            codigo_dci:producto.codigo_dci,
            codigo_dci2:producto.codigo_dci2,

          }
        : {
            descripcion: null,
            principio_act: null,
            cod_barra: null,
            presentacion: null,
            forma_far: null,
            via_admin: null,
            ubicacion: null,
            laboratorio: null,
            concentracion: null,
            uni_dispensacion: null,
            invima: null,
            cum: null,
            expediente: null,
            atc: null,
            estado_invima: null,
            fecha_vig_invima: null,
            iva_id: null,
            grupo_id: null,
            subgrupo_id: null,
            estado: "1",
            cant_presentacion: null,
            unidad_medida: null,
            nivel_invima: null,
            pbs: null,
            cod_mipres: null,
            cadena_frio: null,
            cod_padre: null,
            circular_regulacion: null,
            p_regulado_compra: null,
            p_regulado_venta: null,
            precio_promedio: 0,
            ium: null,
            ium1: null,
            ium2: null,
            ium3: null,
            cod_huv: null,
            tipo_medicamento_id: null,
            grupo_invima: null,
            codigo_dci:null,
            codigo_dci2:null,
          }
    );
  }, [producto]);

  useEffect(() => {
    const optionsFormafm = formaFarma?.map((item) => {
      return { label: item.nombre, value: item.nombre };
    });
    setSelectFormafm(optionsFormafm);

    const optionsUpr = upr?.map((item) => {
      return { label: item.nombre, value: item.nombre };
    });
    setSelectUpr(optionsUpr);

    const optionsTipoMed = tipoMedicamento?.map((item) => {
      return { label: item.nombre, value: item.id.toString() };
    });
    setSelectTipoMedicamento(optionsTipoMed);
  }, [formaFarma, upr, tipoMedicamento]);

  const handleChangeGrupo = (value: string) => {
    methods.setValue("grupo_id", value);
    const options = subgrupos
      ?.filter((item) => item.grupo_id == value)
      .filter((item) => item.estado == "1")
      .map((item) => {
        return { label: item.descripcion, value: item.id.toString() };
      });
    setSelectSubGrupos(options);
  };

  const handleSearchPadre = (query: string) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (query.length > 0) {
      timeout = setTimeout(() => {
        buscarPadre(query).then(({ data: { data } }) => {
          setSelectPadre(
            data.map((item) => {
              return {
                label: `${item.cod_padre} - ${item.descripcion}`,
                value: item.cod_padre,
              };
            })
          );
        });
      }, 500);
    }
  };

  return (
    <>
      <Row gutter={24}>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="descripcion"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Descripción es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Descripción:">
                <Input
                  {...field}
                  placeholder="Descripción"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="principio_act"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Principio activo es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Principio activo:">
                <Input
                  {...field}
                  placeholder="Principio activo"
                  status={error && "error"}
                  disabled={
                    producto
                      ? !["cotizaciones", "administrador", "quimico"].includes(
                          user_rol
                        )
                        ? [null, ""].includes(producto.principio_act)
                          ? false
                          : true
                        : false
                      : false
                  }
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="cod_barra"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Código de barras es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Código de barras:">
                <Input
                  {...field}
                  placeholder="Código de barras"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="presentacion"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Presentación es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Presentación:">
                <Input
                  {...field}
                  placeholder="Presentación"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Row gutter={12}>
            <Col xs={24} sm={12}>
              <Controller
                name="cant_presentacion"
                control={methods.control}
                rules={{
                  required: {
                    value: true,
                    message: "Cantidad Presentacion es requerido",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Cantidad Presentación:">
                    <Input
                      {...field}
                      placeholder="Cantidad Presentación"
                      status={error && "error"}
                    />
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                )}
              />
            </Col>
            <Col xs={24} sm={12}>
              <Controller
                name="unidad_medida"
                control={methods.control}
                rules={{
                  required: {
                    value: true,
                    message: "Unidad Medida es requerido",
                  },
                }}
                defaultValue={"1"}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Unidad Medida:">
                    <Select
                      {...field}
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={[
                        { value: "CAJA", label: "CAJA" },
                        { value: "UNIDAD", label: "UNIDAD" },
                      ]}
                      status={error && "error"}
                    />
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                )}
              />
            </Col>
          </Row>
          <Controller
            name="uni_dispensacion"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Unidad dispensación es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Unidad Dispensación:">
                <Select
                  {...field}
                  showSearch
                  placeholder="Unidad Dispensación"
                  filterOption={(input, option: any) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={selectUpr}
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="forma_far"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Forma farmaceútica es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Forma Farmaceútica:">
                <Select
                  {...field}
                  showSearch
                  placeholder="Forma Farmaceútica"
                  filterOption={(input, option: any) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={selectFormafm}
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="via_admin"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Vía administración es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Vía Administración:">
                <Input
                  {...field}
                  placeholder="Vía Administración"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="tipo_medicamento_id"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Tipo Medicamento es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Tipo Medicamento:">
                <Select
                  {...field}
                  showSearch
                  placeholder="Tipo Medicamento"
                  filterOption={(input, option: any) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={selectTipoMedicamento}
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Row gutter={12}>
            <Col xs={24} sm={12}>
              <Controller
                name="grupo_id"
                control={methods.control}
                rules={{
                  required: {
                    value: true,
                    message: "Grupo es requerido",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Grupo:">
                    <Select
                      {...field}
                      options={selectGrupo}
                      onChange={handleChangeGrupo}
                      placeholder="Grupo"
                      status={error && "error"}
                    />
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                )}
              />
            </Col>
            <Col xs={24} sm={12}>
              <Controller
                name="subgrupo_id"
                control={methods.control}
                rules={{
                  required: {
                    value: true,
                    message: "SubGrupo es requerido",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="SubGrupo:">
                    <Select
                      {...field}
                      options={selectSubGrupos}
                      placeholder="SubGrupo"
                      status={error && "error"}
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
                name="iva_id"
                control={methods.control}
                rules={{
                  required: {
                    value: true,
                    message: "IVA es requerido",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="IVA:">
                    <Select
                      {...field}
                      options={selectIvas}
                      placeholder="IVA"
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
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={[
                        { value: "0", label: "INACTIVO" },
                        { value: "1", label: "ACTIVO" },
                      ]}
                      status={error && "error"}
                      disabled={!producto ? true : false}
                    />
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                )}
              />
            </Col>
          </Row>
          <Controller
            name="cod_padre"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Código Padre es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Código Padre:">
                <Select
                  {...field}
                  showSearch
                  options={selectPadre}
                  filterOption={false}
                  placeholder="Código Padre"
                  notFoundContent={null}
                  onSearch={handleSearchPadre}
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="ubicacion"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Ubicación (Controlado) es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Ubicación (Controlado):">
                <Select
                  {...field}
                  showSearch
                  options={[
                    { value: "SI", label: "SI" },
                    { value: "NO", label: "NO" },
                  ]}
                  filterOption={false}
                  placeholder="Ubicación (Controlado)"
                  notFoundContent={null}
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="laboratorio"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Laboratorio es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Laboratorio:">
                <Input
                  {...field}
                  placeholder="Laboratorio"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="concentracion"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Concentración es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Concentración:">
                <Input
                  {...field}
                  placeholder="Concentración"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Row gutter={12}>
            <Col xs={24} sm={8}>
              <Controller
                name="pbs"
                control={methods.control}
                rules={{
                  required: {
                    value: true,
                    message: "PBS es requerido",
                  },
                }}
                defaultValue={"1"}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="PBS:">
                    <Select
                      {...field}
                      options={[
                        { value: "PBS", label: "PBS" },
                        { value: "NO PBS", label: "NO PBS" },
                      ]}
                      status={error && "error"}
                    />
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                )}
              />
            </Col>
            <Col xs={24} sm={16}>
              <Controller
                name="cod_mipres"
                control={methods.control}
                rules={{
                  required: {
                    value: true,
                    message: "Código Mipres es requerido",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Código Mipres:">
                    <Input
                      {...field}
                      placeholder="Código Mipres"
                      maxLength={50}
                      status={error && "error"}
                    />
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                )}
              />
            </Col>
          </Row>
          <Row gutter={12}>
            <Col xs={24} sm={8}>
              <Controller
                name="cadena_frio"
                control={methods.control}
                rules={{
                  required: {
                    value: true,
                    message: "Cadena Frio es requerido",
                  },
                }}
                defaultValue={"1"}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Cadena Frio:">
                    <Select
                      {...field}
                      options={[
                        { value: "SI", label: "SI" },
                        { value: "NO", label: "NO" },
                      ]}
                      status={error && "error"}
                    />
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                )}
              />
            </Col>
            <Col xs={24} sm={16}>
              <Controller
                name="cod_huv"
                control={methods.control}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem label="Código HUV:">
                    <Input
                      showCount
                      {...field}
                      maxLength={15}
                      placeholder="Código HUV"
                      status={error && "error"}
                    />
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                )}
              />
            </Col>
            {methods.getValues("precio_promedio") == 0 ? (
              <Col xs={24} sm={12}>
                <Controller
                  name="precio_promedio"
                  control={methods.control}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem required label="Precio Promedio:">
                      <InputNumber
                        {...field}
                        placeholder="Precio Promedio"
                        status={error && "error"}
                        style={{ width: "100%" }}
                        controls={false}
                        formatter={(value) =>
                          `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>
            ) : null}
          </Row>
        </Col>
      </Row>
    </>
  );
};
