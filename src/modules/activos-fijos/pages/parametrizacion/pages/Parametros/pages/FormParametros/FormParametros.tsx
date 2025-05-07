/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Button, Form, Input, Layout, notification, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Parametro } from "@/services/types";
import { crearParametro, updateParametro, getParametro } from "@/services/activos/parametrosAPI";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { useParams, useNavigate } from "react-router-dom";


const { Option } = Select;

export const FormParametros = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [actionType, setActionType] = useState<"crear" | "editar">("crear");
  const { id } = useParams<{ id: string }>(); // Obtener el ID de la URL
  const navigate = useNavigate();


  useEffect(() => {
    if (id) {
      setActionType("editar");
      fetchParametro(Number(id)); // Convertir id a número
    } else {
      setActionType("crear");
      form.resetFields();
    }
  }, [id, form]);

  const fetchParametro = async (id: number) => {
    try {
      const response = await getParametro(id);
      form.setFieldsValue(response.data);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Hubo un error al obtener el parametro.",
      });
    }
  };

  const handleInputChange = (e : any) => {
    const { value } = e.target;
    form.setFieldsValue({
      descripcion: value.toUpperCase(),
    });
  };

  const onFinish = (values: any) => {
    setLoading(true);
  
    // Crear objeto de datos
    const data: Parametro = {
      ...values,
    };
  
    if (actionType === "crear") {
      crearParametro(data)
        .then(() => {
          notification.success({
            message: "Éxito",
            description: "Parámetro creado correctamente.",
          });
          navigate(".."); // Redirige a la lista de parámetros
        })
        .catch((error: { response?: any }) => {
          // Manejo de errores personalizados desde el backend
          if (error.response && error.response.data && error.response.data.message) {
            notification.error({
              message: "Error",
              description: error.response.data.message, // Mensaje personalizado del backend
            });
          } else {
            notification.error({
              message: "Error",
              description: "Ocurrió un error al crear el parámetro.",
            });
          }
        })
        .finally(() => {
          setLoading(false);
          form.resetFields();
        });
    } else if (actionType === "editar" && id) {
      updateParametro(Number(id), data)
        .then(() => {
          notification.success({
            message: "Éxito",
            description: "Parámetro actualizado correctamente.",
          });
          navigate(".."); // Redirige a la lista de parámetros
        })
        .catch((error: { response?: any }) => {
          // Manejo de errores personalizados desde el backend
          if (error.response && error.response.data && error.response.data.message) {
            notification.error({
              message: "Error",
              description: error.response.data.message, // Mensaje personalizado del backend
            });
          } else {
            notification.error({
              message: "Error",
              description: "Ocurrió un error al actualizar el parámetro.",
            });
          }
        })
        .finally(() => {
          setLoading(false);
          form.resetFields();
        });
    }
  };
  
  return (
    <Layout>
      <StyledCard title={actionType === "crear" ? "CREAR PARAMETRO" : "EDITAR PARAMETRO"}>
        <Form 
        layout="vertical"
        autoComplete="off"
        form={form} onFinish={onFinish}>

          <Form.Item
            name="descripcion"
            label="Descripción"
            rules={[{ required: true, message: "Por favor ingresa la descripción." }]}
          >
            <Input onChange={handleInputChange} />
          </Form.Item>
          <Form.Item
        name="tipo"
        label="Tipo de Parámetro"
        rules={[{ required: true, message: 'Por favor seleccione un tipo' }]}
      >
        <Select placeholder="Seleccione el tipo">
          <Option value="texto">Texto</Option>
          <Option value="numero">Numero</Option>
          <Option value="fecha">Fecha</Option>
        </Select>
      </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<PlusOutlined />}
            >
              {actionType === "crear" ? "Crear Parametro" : "Editar Parametro"}
            </Button>
          </Form.Item>
        </Form>
      </StyledCard>
    </Layout>
  );
};
