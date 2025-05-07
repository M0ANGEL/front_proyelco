/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Button, Form, Input, Layout, notification, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Categoria, SubCategoria } from "@/services/types";
import { crearSubCategoria, updateSubCategoria, getSubCategoria } from "@/services/activos/subCategoriaAPI";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { useParams, useNavigate } from "react-router-dom";
import { getListaCategoriasActivas } from "@/services/activos/categoriaAPI";

const { Option } = Select;

export const FormSubCategoria = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [actionType, setActionType] = useState<"crear" | "editar">("crear");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const { id } = useParams<{ id: string }>(); // Obtener el ID de la URL
  const navigate = useNavigate();


  //controlador de acciones
  useEffect(() => {
    if (id) {
      setActionType("editar");
      fetchSubcategoria(Number(id)); 
    } else {
      setActionType("crear");
      form.resetFields();
    }
  }, [id, form]);

  const fetchSubcategoria = async (id: number) => {
    try {
      const response = await getSubCategoria(id);

      const subcategoria = response.data.data;

      form.setFieldsValue({
        descripcion: subcategoria.descripcion.toUpperCase(),
        id_categoria: subcategoria.categoria?.id, 
      });

    } catch (error) {
      notification.error({
        message: "Error",
        description: "Hubo un error al obtener la subcategoría.",
      });
    }
};


 //traer las categorias
 useEffect(() => {
  getListaCategoriasActivas().then(({data}) => {
      if (Array.isArray(data)) {
          setCategorias(data);
      } else {
          setCategorias([]);
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


  const handleInputChange = (e : any) => {
    const { value } = e.target;
    form.setFieldsValue({
      descripcion: value.toUpperCase(), 
      id_categoria: value.descripcion, 
    });
}

  

  const onFinish = (values: any) => {
    setLoading(true);
    const data: SubCategoria = {
      ...values,
    };

    if (actionType === "crear") {
      crearSubCategoria(data)
        .then(() => {
          notification.success({
            message: "Éxito",
            description: "Subcategoría creada correctamente.",
          });
          navigate(".."); // Redirige a la lista de subcategorías
        })
        .catch((error) => {
          notification.error({
            message: "subcategoria ya existe",
            description: error.message,
          });
        })
        .finally(() => {
          setLoading(false);
          form.resetFields();
        });
    } else if (actionType === "editar" && id) {
      updateSubCategoria(Number(id), data)
        .then(() => {
          notification.success({
            message: "Éxito",
            description: "Subcategoría actualizada correctamente.",
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
      <StyledCard title={actionType === "crear" ? "CREAR SUBCATEGORIA" : "EDITAR SUBCATEGORIA"}>
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
            name="id_categoria"
            label="Categoría"
            rules={[{ required: true, message: "Por favor selecciona la categoría." }]}
          >
            <Select placeholder="Selecciona la categoría" onSelect={()=>getListaCategoriasActivas()}>
              {Array.isArray(categorias) && categorias.map((categoria) => (
                <Option key={categoria.id} value={categoria.id}>
                  {categoria.descripcion}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<PlusOutlined />}
            >
              {actionType === "crear" ? "Crear Subcategoría" : "Editar Subcategoría"}
            </Button>
          </Form.Item>
        </Form>
      </StyledCard>
    </Layout>
  );
};
