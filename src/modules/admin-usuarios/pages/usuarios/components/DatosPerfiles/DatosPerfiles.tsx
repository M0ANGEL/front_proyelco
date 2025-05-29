import { getPerfiles } from "@/services/maestras/perfilesAPI";
import { Controller, useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { Col, Row, Select, SelectProps, Typography } from "antd";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { getEmpresas } from "@/services/maestras/empresasAPI";
import { getCargos } from "@/services/maestras/cargosAPI";
import { Usuario } from "../../types";

const { Text } = Typography;

interface Props {
  usuario?: Usuario;
}

export const DatosPerfiles = ({ usuario }: Props) => {
  const methods = useFormContext();
  const [selectEmpresa, setSelectEmpresa] = useState<SelectProps["options"]>(
    []
  );
  const [selectCargos, setSelectCargos] = useState<SelectProps["options"]>([]);
  const [selectPperfiles, setSelectPperfiles] = useState<
    SelectProps["options"]
  >([]);

  useEffect(() => {
    //si tenemos datos en categoria agregamos a metho los datos
    if (usuario) {
      methods.setValue("empresas", usuario?.empresas?.[0]?.id_empresa);
      methods.setValue("perfiles", usuario?.perfiles?.[0]?.id_perfil);
      methods.setValue("cargos", usuario?.cargos?.[0]?.id_cargo);

      fetchEmpresa();
      fetchPerfiles();
      fetchCargos();
    } else {
      fetchEmpresa();
      fetchPerfiles();
      fetchCargos();
    }
  }, [usuario]);

  //llamada empres
  const fetchEmpresa = () => {
    getEmpresas().then(({ data }) => {
      const categoriasPadres = data.data.map((item) => ({
        label: item.emp_nombre,
        value: item.id,
      }));
      setSelectEmpresa(categoriasPadres);
    });
  };

  //llamada perfiles
  const fetchPerfiles = () => {
    getPerfiles().then(({ data }) => {
      const categoriasPadres = data.map((item) => ({
        label: item.nom_perfil,
        value: item.id,
      }));
      setSelectPperfiles(categoriasPadres);
    });
  };

  //llamada cargos
  const fetchCargos = () => {
    getCargos().then(({ data }) => {
      const categoriasPadres = data.data.map((item) => ({
        label: item.nombre,
        value: item.id,
      }));
      setSelectCargos(categoriasPadres);
    });
  };

  return (
    <>
      <Row style={{ padding: 10 }} gutter={12}>
        {/* campo selecion de empresa */}
        <Col xs={24} sm={8}>
          <Controller
            name="empresas"
            control={methods.control}
            rules={{
              required: {
                value: true, //validacion diamica si es o no olbigatoriaaa jaja
                message: "La empresa es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Empresa">
                <Select
                  {...field}
                  showSearch
                  allowClear
                  options={selectEmpresa}
                  placeholder={
                    selectEmpresa?.length
                      ? "Selecciona la empresa"
                      : "HAY PROBEMAS PARA MOSTRAR EMPRESAS"
                  }
                  status={error ? "error" : ""}
                  style={{ width: "100%" }}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>

        {/* campo selecion de perfil */}
        <Col xs={24} sm={8}>
          <Controller
            name="perfiles"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "El perfil es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Perfil">
                <Select
                  {...field}
                  showSearch
                  allowClear
                  options={selectPperfiles}
                  placeholder={
                    selectPperfiles?.length
                      ? "Selecciona un perfil"
                      : "HAY PROBLEMAS PARA MOSTRAR PERFILES"
                  }
                  status={error ? "error" : ""}
                  style={{ width: "100%" }}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>

        {/* campo selecion cargo */}
        <Col xs={24} sm={8}>
          <Controller
            name="cargos"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "El cargo es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Cargo">
                <Select
                  {...field}
                  showSearch
                  allowClear
                  options={selectCargos}
                  placeholder={
                    selectCargos?.length
                      ? "Selecciona un cargo"
                      : "HAY PROBLEMAS PARA MOSTRAR CARGOS"
                  }
                  status={error ? "error" : ""}
                  style={{ width: "100%" }}
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
