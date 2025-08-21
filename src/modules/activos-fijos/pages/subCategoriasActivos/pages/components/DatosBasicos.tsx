import { useEffect, useState } from "react";
import { Col, Input, Row, SelectProps, Select, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Props } from "./types";
import TextArea from "antd/es/input/TextArea";
import { getActiCategorias } from "@/services/activosFijos/CategoriasAPI";

const { Text } = Typography;

export const DatosBasicos = ({ TkCategoria }: Props) => {
  const [selectCategorias, setSelectCategorias] = useState<
    SelectProps["options"]
  >([]);
  const methods = useFormContext();

  useEffect(() => {
    //si tenemos datos en categoria agregamos a metho los datos
    if (TkCategoria) {
      methods.setValue("descripcion", TkCategoria?.descripcion);
      methods.setValue("nombre", TkCategoria?.nombre);
      methods.setValue("categoria_id", TkCategoria?.categoria_id);
    } else {
      fetchCategorias();
    }
  }, [TkCategoria]);

  const fetchCategorias = () => {
    getActiCategorias().then(({ data: { data } }) => {
      const categoriasPadres = data.map((item) => ({
        label: item.nombre.toUpperCase(),
        value: item.id,
      }));
      setSelectCategorias(categoriasPadres);
    });
  };

  return (
    <Row gutter={24}>
      {/* nombre de la categoria */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="nombre"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Nombre de la subcategoria es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Nombre de la subcategoria">
              <Input
                {...field}
                maxLength={50}
                placeholder="Nombre"
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* campo de nombre de la categorias padre para la seleccion*/}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="categoria_id"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Categoria pafre requerida",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Categoria Padre">
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
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* descripcion */}
      <Col xs={24} sm={24} style={{ width: "100%" }}>
        <Controller
          name="descripcion"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "La descripcion es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Descripcion">
              <TextArea
                {...field}
                maxLength={200}
                placeholder="Equipo Computo"
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
