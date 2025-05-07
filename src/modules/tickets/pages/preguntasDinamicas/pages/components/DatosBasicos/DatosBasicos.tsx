import { useEffect, useState } from "react";
import { Col, Row, Select, SelectProps, Spin, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { LoadingOutlined } from "@ant-design/icons";
import { Props } from "../DatosBasicos/types";
import { getTkCategoriasPadres } from "@/services/tickets/subcategoriasAPI";
import TextArea from "antd/es/input/TextArea";
import { getTkTicketSubCategoria } from "@/services/tickets/ticketsAPI";

const { Text } = Typography;

interface DataSelect {
  label: string | null;
  value: number | null;
}

export const DatosBasicos = ({ TkPPreguntasDinamicas }: Props) => {
  const methods = useFormContext();
  const [loaderEmp, setLoaderEmp] = useState<boolean>(false);
  const [selectCategorias, setSelectCategorias] = useState<
    SelectProps["options"]
  >([]);
  const [subcategorias, setSubcategorias] = useState<DataSelect[]>([]);

  useEffect(() => {
    //si tenemos datos en categoria agregamos a metho los datos
    if (TkPPreguntasDinamicas) {
      methods.setValue("pregunta", TkPPreguntasDinamicas?.pregunta);
      methods.setValue(
        "subcategoria_id",
        TkPPreguntasDinamicas?.subcategoria_id
      );
      methods.setValue("categoria_id", TkPPreguntasDinamicas?.categoria_id);
      methods.setValue("subcategoria", TkPPreguntasDinamicas?.subcategoria);
    } else {
      // fetchCategorias();
      setLoaderEmp(false);
    }
  }, [TkPPreguntasDinamicas]);

  //llamada  categoria del proceso
  useEffect(() => {
    getTkCategoriasPadres().then(({ data: { data } }) => {
      const categoriasPadres = data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setSelectCategorias(categoriasPadres);
    });
    fetchSubcategorias(Number(TkPPreguntasDinamicas?.categoria_id));
  }, [TkPPreguntasDinamicas]);

  //llamado de subcategorias por id de categoria 3
  const fetchSubcategorias = async (categoriaId: number) => {
    if (!categoriaId) {
      setSubcategorias([]);
      return;
    }
    try {
      const response = await getTkTicketSubCategoria(categoriaId);
      const subcategorias = response?.data?.data || [];
      setSubcategorias(
        subcategorias.map((item) => ({
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
      {/* categoria para llamar subcateogrias*/}

      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="categoria_id"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Estado requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Categoria">
              <Spin spinning={loaderEmp} indicator={<LoadingOutlined spin />}>
                <Select
                  {...field}
                  showSearch
                  allowClear
                  onSelect={(value) => {
                    fetchSubcategorias(value);
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
                  options={selectCategorias}
                  status={error && "error"}
                />
              </Spin>
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* Subcategoría */}
      <Col xs={24} sm={12}>
        <Controller
          name="subcategoria_id"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "La subcategoría es requerida",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Subcategoría">
              <Spin spinning={loaderEmp} indicator={<LoadingOutlined spin />}>
                <Select
                  {...field}
                  showSearch
                  allowClear
                  options={subcategorias}
                  disabled={!subcategorias?.length}
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
                  placeholder={
                    subcategorias?.length
                      ? ""
                      : "NO HAY DATOS PARA ESTA CATEGORIA"
                  }
                  status={error && "error"}
                />
              </Spin>
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* Detalle de lapregunta dnamica */}
      <Col xs={24} sm={24}>
        <Controller
          name="pregunta"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "La pregunta es requerida",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Información Detallada del Ticket">
              <TextArea
                {...field}
                maxLength={400}
                rows={2} //10
                placeholder="Recuerda escribir una pregunta clara "
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
