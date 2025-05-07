import { useState, useEffect } from "react";
import { Button, Form, Input, Layout, notification, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  Activos,
  DatosCrear,
  Parametro,
  Parametros_SubCategoria,
} from "@/services/types";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { useParams, useNavigate } from "react-router-dom";
import { crearDato, getDatos, updateDato } from "@/services/activos/datosAPI";
import { getActivos, getListaActivos } from "@/services/activos/activosAPI";
import { getListaParametros_SubCategoria } from "@/services/activos/Parametros_SubCategoriaAPI";
import { getListaParametros } from "@/services/activos/parametrosAPI";
const { Option } = Select;

export const FormDatos = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [actionType, setActionType] = useState<"crear" | "editar">("crear");
  const { id } = useParams<{ id: string }>(); // Obtener el ID de la URL
  const [Parametros_SubCategoria, setParametro_SubCategorias] = useState<
    Parametros_SubCategoria[]
  >([]);
  const [, setParametro] = useState<Parametro[]>([]);
  const [activos, setActivos] = useState<Activos[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setActionType("editar");
      fetchDatos(Number(id)); // Convertir id a número
    } else {
      setActionType("crear");
      form.resetFields();
    }
  }, [id, form]);

  useEffect(() => {
    getListaActivos()
      .then(({ data }) => {
        if (Array.isArray(data)) {
          setActivos(data);
        } else {
          setActivos([]);
          notification.error({
            message: "Error",
            description: "La respuesta de la API no es válida.",
          });
        }
      })
      .catch(() => {
        notification.error({
          message: "Error",
          description: "Hubo un error al obtener los activos.",
        });
      });

    getListaParametros_SubCategoria()
      .then(({ data }) => {
        if (Array.isArray(data)) {
          setParametro_SubCategorias(data);
        } else {
          setParametro_SubCategorias([]);
          notification.error({
            message: "Error",
            description: "La respuesta de la API no es válida.",
          });
        }
      })
      .catch(() => {
        notification.error({
          message: "Error",
          description:
            "Hubo un error al obtener los parametros x subcategorias.",
        });
      });


      getListaParametros()
      .then(({ data }) => {
        if (Array.isArray(data)) {
          setParametro(data);
        } else {
          setParametro([]);
          notification.error({
            message: "Error",
            description: "La respuesta de la API no es válida.",
          });
        }
      })
      .catch(() => {
        notification.error({
          message: "Error",
          description:
            "Hubo un error al obtener los parametros x subcategorias.",
        });
      });
  }, []);

  const fetchDatos = async (id: number) => {
    try {
      const response = await getDatos(id);
      const data = response.data;
      form.setFieldsValue({
        id_activo: data.activo.nombre,
        id_parametro_subCategoria:
          data.parametro_sub_categoria.parametro.descripcion,
        valor_almacenado: data.valor_almacenado,
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Hubo un error al obtener los datos.",
      });
    }
  };

  const onFinish = (values: any) => {
    setLoading(true);
    const data: DatosCrear = {
      ...values,
      // id_SubCategoria: values.id_SubCategoria,
      //   id_parametro: values.id_parametro,
    };

    if (actionType === "crear") {
      crearDato(data)
        .then(() => {
          notification.success({
            message: "Éxito",
            description: "datos creado correctamente.",
          });
          navigate(".."); // Redirige a la lista de datos
        })
        .catch((error: any) => {
          // Asegúrate de capturar el error desde el backend
          const errorMessage =
            error.response && error.response.data && error.response.data.message
              ? error.response.data.message
              : "Ocurrió un error inesperado. Intente de nuevo.";
    
          notification.error({
            message: "Error",
            description: errorMessage,
          });
        })
        .finally(() => {
          setLoading(false);
          form.resetFields();
        });
    } else if (actionType === "editar" && id) {
      updateDato(Number(id), data)
        .then(() => {
          notification.success({
            message: "Éxito",
            description: "datos actualizado correctamente.",
          });
          navigate(".."); // Redirige a la lista de datos
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

  const parametrosUnicos = [...new Map(Parametros_SubCategoria.map(item => [item.parametro.descripcion, item])).values()];


  return (
    <Layout>
      <StyledCard
        title={actionType === "crear" ? "CREAR DATOS" : "EDITAR DATOS"}
      >
        <Form form={form} onFinish={onFinish}>
          <Form.Item
            name="id_activo"
            label="Id Activo"
            rules={[
              { required: true, message: "Por favor ingrese el id del activo" },
            ]}
          >
            <Select
              placeholder="Seleccione el activo"
              onSelect={(value) => getActivos(value)}
              disabled={actionType === "editar"}
            >
              {Array.isArray(activos) &&
                activos.map((activo) => (
                  <Option key={activo.id} value={activo.id}>
                    {activo.nombre}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="id_parametro_subCategoria"
            label="Id Parametro X SubCategoria"
            rules={[
              {
                required: true,
                message: "Por favor ingrese el id del parametro x subCategoria",
              },
            ]}
          >
            <Select
              placeholder="Seleccione los parametros x categoria"
              onSelect={() => getListaParametros_SubCategoria()}
              disabled={actionType === "editar"}
            >
              {Array.isArray(parametrosUnicos) &&
                parametrosUnicos.map((parametrosUnicos) => (
                  <Option
                    key={parametrosUnicos.id}
                    value={parametrosUnicos.id}
                  >
                    {parametrosUnicos.parametro.descripcion}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="valor_almacenado"
            label="valor Almacenado"
            rules={[{ required: true, message: "Por favor ingrese el valor" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<PlusOutlined />}
            >
              {actionType === "crear" ? "Crear dato" : "Editar dato"}
            </Button>
          </Form.Item>
        </Form>
      </StyledCard>
    </Layout>
  );
};
