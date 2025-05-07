/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Button, Form, Input, Layout, notification, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Categoria, VariablesDinamicas } from "@/services/types";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { useParams, useNavigate } from "react-router-dom";
import {
  crearCategoria,
  getCategoria,
  getListaVariablesDinamicasVidaUtil,
  updateCategoria,
} from "@/services/activos/categoriaAPI";

export const FormCategoria = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [variablesDinamicas, setVariablesDinamicas] = useState<
    VariablesDinamicas[]
  >([]);
  const [actionType, setActionType] = useState<"crear" | "editar">("crear");
  const { id } = useParams<{ id: string }>(); // Obtener el ID de la URL
  const navigate = useNavigate();

  //manejador de acciones
  useEffect(() => {
    if (id) {
      setActionType("editar");
      fetchCategoria(Number(id));
    } else {
      setActionType("crear");
      form.resetFields();
    }
  }, [id, form]);

  const fetchCategoria = async (id: number) => {
    try {
      const response = await getCategoria(id);
      form.setFieldsValue(response.data);
    } catch (error) {
      console.error("Error al obtener la categoría:", error);
      notification.error({
        message: "Error",
        description: "Hubo un error al obtener la categoría.",
      });
    }
  };

  useEffect(() => {
    const fetchVariablesDinamicas = async () => {
      try {
        const { data } = await getListaVariablesDinamicasVidaUtil();
        if (Array.isArray(data)) {
          setVariablesDinamicas(data);
        } else {
          setVariablesDinamicas([]);
          notification.error({
            message: "Error",
            description: "La respuesta de la API no es válida.",
          });
        }
      } catch (error) {
        notification.error({
          message: "Error",
          description: "Hubo un error al obtener las variables dinamicas.",
        });
      }
    };

    fetchVariablesDinamicas(); // Llama al método al montar el componente.
  }, []);

  const handleInputChange = (e: any) => {
    const { value } = e.target;
    form.setFieldsValue({
      descripcion: value.toUpperCase(),
    });
  };

  const onFinish = (values: any) => {
    setLoading(true);
    const data: Categoria = {
      ...values,
    };

    if (actionType === "crear") {
      crearCategoria(data)
        .then(() => {
          notification.success({
            message: "Éxito",
            description: "categoria creada correctamente.",
          });
          navigate(".."); // Redirige a la lista de parametros
        })
        .catch((error) => {     
          console.log(error)
        notification.error({
            message: "Error",
            description: error.response.data.message,
          });
        })
        .finally(() => {
          setLoading(false);
          form.resetFields();
        });
    } else if (actionType === "editar" && id) {
      updateCategoria(Number(id), data)
        .then(() => {
          notification.success({
            message: "Éxito",
            description: "categoria actualizada correctamente.",
          });
          navigate(".."); // Redirige a la lista de parametros
        })
        .catch((error) => {
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
        title={actionType === "crear" ? "CREAR CATEGORÍA" : "EDITAR CATEGORÍA"}
      >
        <Form
          layout="vertical"
          autoComplete="off"
          form={form}
          onFinish={onFinish}
        >
          <Form.Item
            name="descripcion"
            label="Descripción"
            rules={[
              { required: true, message: "Por favor ingresa la descripción." },
            ]}
          >
            <Input onChange={handleInputChange} />
          </Form.Item>


          <Form.Item>
            <Form.Item
              name="variable_dinamica"
              label="Variable Dinámica"
              rules={[
                {
                  required: true,
                  message: "Por favor selecciona una variable dinámica.",
                },
              ]}
            >
              <Select placeholder="Seleccione una variable">
                {variablesDinamicas.map((variable) => (
                  <Select.Option key={variable.id} value={variable.id}>
                    {variable.nombre}{" "}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<PlusOutlined />}
            >
              {actionType === "crear" ? "Crear categoría" : "Editar categoría"}
            </Button>
          </Form.Item>
        </Form>
      </StyledCard>
    </Layout>
  );
};
