/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Button, Form, Input, Layout, notification } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { SubLocalizacionArea} from "@/services/types";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { useParams, useNavigate } from "react-router-dom";
import { crearSubLocalizacionArea, getSubLocalizacionArea, updateSubLocalizacionArea } from "@/services/activos/subLocalizacionAreaAPI";


export const FormSubLocalizacionArea = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [actionType, setActionType] = useState<"crear" | "editar">("crear");
  const { id } = useParams<{ id: string }>(); // Obtener el ID de la URL
  const navigate = useNavigate();


  //manejador de acciones
  useEffect(() => {
    if (id) {
      setActionType("editar");
      fetchSubLocalizacionArea(Number(id)); // Convertir id a número
    } else {
      setActionType("crear");
      form.resetFields();
    }
  }, [id, form]);

  const handleInputChange = (e : any) => {
    const { value } = e.target;
    form.setFieldsValue({
      descripcion: value.toUpperCase(),
    });
  };

  const fetchSubLocalizacionArea = async (id: number) => {
    try {
      const response = await getSubLocalizacionArea(id);
      const data = response.data;
      form.setFieldsValue({
        descripcion: data.descripcion,
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Hubo un error al obtener la sub localizacion por area.",
      });
    }
  };

  const onFinish = (values: any) => {
    setLoading(true);
    const data: SubLocalizacionArea = {
      ...values,
    };

    if (actionType === "crear") {
      crearSubLocalizacionArea(data)
        .then(() => {
          notification.success({
            message: "Éxito",
            description: "categoría creada correctamente.",
          });
          navigate(".."); // Redirige a la lista de subcategorías
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
      updateSubLocalizacionArea(Number(id), data)
        .then(() => {
          notification.success({
            message: "Éxito",
            description: "categoría actualizada correctamente.",
          });
          navigate(".."); // Redirige a la lista de subcategorías
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
      <StyledCard title={actionType === "crear" ? "CREAR AREA" : "EDITAR AREA"}>
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
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<PlusOutlined />}
            >
              {actionType === "crear" ? "Crear area" : "Editar area"}
            </Button>
          </Form.Item>
        </Form>
      </StyledCard>
    </Layout>
  );
};
