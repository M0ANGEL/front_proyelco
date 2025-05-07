/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Button, Col, Form, Layout, notification, Select, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  Parametro,
  Parametros_SubCategoria,
  SubCategoria,
} from "@/services/types";
import {
  crearParametro_SubCategoria,
  updateParametro_SubCategoria,
  getParametro_SubCategoria,
} from "@/services/activos/Parametros_SubCategoriaAPI";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { useParams, useNavigate } from "react-router-dom";
import {
  getListaSubCategorias,
  getListaSubCategoriasActivas,
} from "@/services/activos/subCategoriaAPI";
import {
  getListaParametros,
  getListaParametrosActivas,
} from "@/services/activos/parametrosAPI";
import { Controller, useForm } from "react-hook-form";

const { Option } = Select;

export const FormParametros_SubCategoria = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [actionType, setActionType] = useState<"crear" | "editar">("crear");
  const { id } = useParams<{ id: string }>(); // Obtener el ID de la URL
  const [Subcategorias, setSubCategorias] = useState<SubCategoria[]>([]);
  const [parametros, setParametros] = useState<Parametro[]>([]);
  const [FilteredSubCategorias, setFilteredSubCategorias] = useState<
    SubCategoria[]
  >([]);
  const [FilteredParametros, setFilteredParametros] = useState<
  Parametro[]
>([]);
  const control = useForm();
  const { Text } = Typography;


  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setActionType("editar");
      fetchParametro_SubCategoria(Number(id)); // Convertir id a número
    } else {
      setActionType("crear");
      form.resetFields();
    }
  }, [id, form]);

  useEffect(() => {
    getListaSubCategoriasActivas()
      .then(({ data }) => {
        if (Array.isArray(data)) {
          setSubCategorias(data);
          setFilteredSubCategorias(data);
        } else {
          setSubCategorias([]);
          setFilteredSubCategorias([]);

          notification.error({
            message: "Error",
            description: "La respuesta de la API no es válida.",
          });
        }
      })
      .catch(() => {
        notification.error({
          message: "Error",
          description: "Hubo un error al obtener las Categorias.",
        });
      });

    getListaParametrosActivas()
      .then(({ data }) => {
        if (Array.isArray(data)) {
          setParametros(data);
          setFilteredParametros(data);
        } else {
          setSubCategorias([]);
          setFilteredParametros([]);
          notification.error({
            message: "Error",
            description: "La respuesta de la API no es válida.",
          });
        }
      })
      .catch(() => {
        notification.error({
          message: "Error",
          description: "Hubo un error al obtener las Categorias.",
        });
      });
  }, []);

  const fetchSubCategoria = async (search: string) => {
    try {
      const response = await getListaSubCategoriasActivas();
      setSubCategorias(response.data);
      setFilteredSubCategorias(response.data);

      const filtered = Subcategorias.filter((subcategorias) =>
        subcategorias.descripcion.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredSubCategorias(filtered);
    } catch (error) {
      console.error("Error al obtener subcategorias:", error);
    }
  };

  const fetchParametro = async (search: string) => {
    try {
      const response = await getListaParametrosActivas();
      setParametros(response.data);
      setFilteredParametros(response.data);

      const filtered = parametros.filter((parametro) =>
        parametro.descripcion.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredParametros(filtered);
    } catch (error) {
      console.error("Error al obtener subcategorias:", error);
    }
  };

  const fetchParametro_SubCategoria = async (id: number) => {
    try {
      const response = await getParametro_SubCategoria(id);
      const data = response.data;

      form.setFieldsValue({
        id_subCategoria: data.subcategoria.id,
        id_parametro: data.parametro.id,
        parametros_multiples: data.parametro.descripcion,
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Hubo un error al obtener el parametro_sub_categoria.",
      });
    }
  };

  const onFinish = (values: any) => {
    setLoading(true);
    const data: Parametros_SubCategoria = {
      ...values,
      id_SubCategoria: values.id_SubCategoria,
      id_parametro: values.id_parametro,
    };

    if (actionType === "crear") {
      crearParametro_SubCategoria(data)
        .then(() => {
          notification.success({
            message: "Éxito",
            description: "parametro sub Categoria creado correctamente.",
          });
          navigate(".."); // Redirige a la lista de parametros_sub_categoria
        })
        .catch((error) => {
          notification.error({
            message: "El parametro ya esta asignado a esta subcategoria",
            description: error.message,
          });
        })
        .finally(() => {
          setLoading(false);
          form.resetFields();
        });
    } else if (actionType === "editar" && id) {
      updateParametro_SubCategoria(Number(id), data)
        .then(() => {
          notification.success({
            message: "Éxito",
            description: "parametro sub Categoria actualizado correctamente.",
          });
          navigate(".."); // Redirige a la lista de parametro_sub_categoria
        })
        .catch((error: { message: any }) => {
          notification.error({
            message: "Error",
            description: error.message,
          });
        })
        .finally(() => {
          setLoading(false);
          form.resetFields();
        });
    }
  };

  return (
    <Layout>
      <StyledCard
        title={
          actionType === "crear"
            ? "CREAR PARAMETRO_SUB_CATEGORIA"
            : "EDITAR PARAMETRO_SUB_CATEGORIA"
        }
      >
        <Form
          layout="vertical"
          autoComplete="off"
          form={form}
          onFinish={control.handleSubmit(onFinish)}
        >
          <Col span={12}>
            <Controller
              name="id_subCategoria"
              control={control.control}
              rules={{
                required: {
                  value: true,
                  message: "Por favor selecciona la subcategoría.",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <Form.Item required label="SubCategoría" name="id_subCategoria">
                  <Select
                    {...field}
                    placeholder="seleccione la SubCategoría"
                    onSelect={() => getListaSubCategorias()}
                    onSearch={fetchSubCategoria}
                    filterOption={false}
                    showSearch
                    disabled={actionType === "editar"}
                  >
                    {Array.isArray(FilteredSubCategorias) &&
                      FilteredSubCategorias.map((Subcategoria) => (
                        <Option key={Subcategoria.id} value={Subcategoria.id}>
                          {[Subcategoria.descripcion]}
                        </Option>
                      ))}
                  </Select>
                  <Text type="danger">{error?.message}</Text>
                </Form.Item>
              )}
            />
          </Col>

          <Col span={12}>
            <Controller
              name="parametros_multiples"
              control={control.control}
              rules={{
                required: {
                  value: true,
                  message: "Por favor selecciona la subcategoría.",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <Form.Item required label="Parametro" name="parametros_multiples">
                  <Select
                    {...field}
                    mode="multiple"
                    placeholder="seleccione los Parametros"
                    onSelect={() => getListaParametros()}
                    onSearch={fetchParametro}
                    filterOption={false}
                    showSearch
                    disabled={actionType === "editar"}
                  >
                    {Array.isArray(FilteredParametros) &&
                      FilteredParametros.map((parametro) => (
                        <Option key={parametro.id} value={parametro.id}>
                          {[parametro.descripcion]}
                        </Option>
                      ))}
                  </Select>
                  <Text type="danger">{error?.message}</Text>
                </Form.Item>
              )}
            />
          </Col>


          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<PlusOutlined />}
            >
              {actionType === "crear"
                ? "Crear Parametro-sub-categoria"
                : "Editar Parametro-sub-categoria"}
            </Button>
          </Form.Item>
        </Form>
      </StyledCard>
    </Layout>
  );
};
