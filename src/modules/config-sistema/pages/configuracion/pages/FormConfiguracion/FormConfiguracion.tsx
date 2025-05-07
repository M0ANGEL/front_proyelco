import { useState, useEffect } from "react";
import { Button, Form, Input, Layout, notification, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { useParams, useNavigate } from "react-router-dom";
import {
  crearVariable,
  getVariable,
  updateVariable,
} from "@/services/maestras/configuracionAPI";
import { VariablesDinamicas } from "@/services/types";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_ROL } from "@/config/api";

export const FormConfiguracion = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [actionType, setActionType] = useState<"crear" | "editar">("crear");
  const { id } = useParams<{ id: string }>(); // Obtener el ID de la URL
  const navigate = useNavigate();
  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);

  // manejador de acciones
  useEffect(() => {
    if (id) {
      setActionType("editar");
      fetchVariablesDinamicas(Number(id));
    } else {
      setActionType("crear");
      form.resetFields();
    }
  }, [id, form]);

  const fetchVariablesDinamicas = async (id: number) => {
    try {
      const response = await getVariable(id);
      form.setFieldsValue(response.data);
    } catch (error) {
      console.error("Error al obtener la variable:", error);
      notification.error({
        message: "Error",
        description: "Hubo un error al obtener la variable.",
      });
    }
  };

  const handleInputChange = (e: any) => {
    const { value } = e.target;
    form.setFieldsValue({
      nombre: value.toUpperCase(),
    });
  };

  const onFinish = (values: any) => {
    setLoading(true);
    const data: VariablesDinamicas = {
      ...values,
    };

    if (actionType === "crear") {
      crearVariable(data)
        .then(() => {
          notification.success({
            message: "Éxito",
            description: "variable creada correctamente.",
          });
          navigate("../"); // Redirige a la lista de parametros
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
    } else if (actionType === "editar" && id) {
      updateVariable(Number(id), data)
        .then(() => {
          notification.success({
            message: "Éxito",
            description: "variable actualizada correctamente.",
          });
          navigate("../"); // Redirige a la lista de parametros
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
        title={actionType === "crear" ? "CREAR VARIABLE" : "EDITAR VARIABLE"}
      >
        <Form
          layout="vertical"
          autoComplete="off"
          form={form}
          onFinish={onFinish}
        >
          <Form.Item
            name="nombre"
            label="Nombre"
            rules={[
              { required: true, message: "Por favor ingresa el nombre." },
            ]}
          >
            <Input
              onChange={handleInputChange}
              disabled={actionType === "editar" && user_rol == "ADMINISTRADOR"}
            />
          </Form.Item>

          <Form.Item
            name="valor"
            label="Valor"
            rules={[{ required: true, message: "Por favor ingresa el valor." }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="tipo"
            label="Tipo"
            rules={[
              { required: true, message: "Por favor selecciona el tipo." },
            ]}
          >
            <Select placeholder="Selecciona un tipo">
              <Select.Option value="AF">Activos Fijos</Select.Option>
              <Select.Option value="GH">Gestión Humana</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<PlusOutlined />}
            >
              {actionType === "crear" ? "Crear variable" : "Editar variable"}
            </Button>
          </Form.Item>
        </Form>
      </StyledCard>
    </Layout>
  );
};
