import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Space,
  Spin,
  Tabs,
  Typography,
} from "antd"; // ❌ ELIMINA 'notification' de aquí
import {
  LoadingOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DatosBasicos } from "../components/DatosBasicos";

import {
  crearFicha,
  getFicha,
  updateFicha,
} from "@/services/talento-humano/fichaObraAPI";
import dayjs from "dayjs";
import { AmClientes } from "@/types/typesGlobal";
import { notify } from "@/components/global/NotificationHandler"; // ✅ Usa este
import { StyledCard } from "@/components/layout/styled";

const { Text } = Typography;

export const FormFichasObra = () => {
  // ❌ ELIMINA esta línea completamente
  // const [contextHolder] = notification.useNotification();
  
  const [loaderSave, setLoaderSave] = useState<boolean>(false);
  const methods = useForm();
  const [categoria, setCategoria] = useState<AmClientes>();
  const [foto, setFoto] = useState<string>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      getFicha(id).then(({ data }) => {
        setCategoria(data.empleado);
        setFoto(data.foto_url);
        setLoaderSave(false);
      });
    } else {
      setLoaderSave(false);
    }
  }, [id]);

  const onFinish: SubmitHandler<any> = async (data) => {
    setLoaderSave(true);

    try {
      const formData = new FormData();


      if (categoria) {
        const camposEditables = [
          "contratista_id",
          "eps",
          "pension",
          "tipo_sangre",
          "numero_hijos",
          "foto",
        ];

        camposEditables.forEach((key) => {
          const value = data[key];

          if (key === "foto" && value instanceof File) {
            formData.append("foto", value);
          } else if (value !== null && value !== undefined && value !== "") {
            formData.append(key, value.toString());
          } else {
            console.log(`❌ ${key} está vacío o undefined`);
          }
        });
      } else {

        Object.keys(data).forEach((key) => {
          if (key === "foto" && data[key] instanceof File) {
            formData.append("foto", data[key]);
          } else if (
            key === "fecha_expedicion" ||
            key === "fecha_nacimiento" ||
            key === "fecha_ingreso"
          ) {
            if (data[key]) {
              formData.append(key, dayjs(data[key]).format("YYYY-MM-DD"));
            }
          } else if (data[key] !== null && data[key] !== undefined) {
            formData.append(key, data[key].toString());
          }
        });
      }

      for (let pair of formData.entries()) {
        console.log(pair[0] + ": ", pair[1]);
      }

      if (categoria) {
        await updateFicha(formData, categoria.id.toString());
        notify.success("Empleado actualizado con éxito!"); // ✅ Corregí "Empelado"
        setTimeout(() => {
          navigate("..");
        }, 800);
      } else {
        await crearFicha(formData);
        notify.success("Empleado creado con éxito!"); // ✅ Corregí "error" por "success"
        setTimeout(() => {
          navigate(-1);
        }, 800);
      }
    } catch (error: any) {
      const msg =
        error.response?.data?.message || "Ocurrió un error inesperado";
      notify.error(msg);
      setLoaderSave(false);
    }
  };

  // Retorno de la vista
  return (
    <>
      {/* ❌ ELIMINA {contextHolder} - no es necesario con tu sistema notify */}
      <Spin
        spinning={loaderSave}
        indicator={
          <LoadingOutlined spin style={{ fontSize: 40, color: "#f4882a" }} />
        }
        style={{ backgroundColor: "rgb(251 251 251 / 70%)" }}
      >
        <FormProvider {...methods}>
          <Form
            layout="vertical"
            onFinish={methods.handleSubmit(onFinish)}
            autoComplete="off"
          >
            <StyledCard
              title={(categoria ? "Editar" : "Crear") + " Personal"}
              extra={
                <Space>
                  <Button
                    htmlType="submit"
                    type="primary"
                    icon={<SaveOutlined />}
                  >
                    Guardar
                  </Button>

                  {categoria ? (
                    <Link to="../.." relative="path">
                      <Button
                        danger
                        type="primary"
                        icon={<ArrowLeftOutlined />}
                      >
                        Volver
                      </Button>
                    </Link>
                  ) : (
                    <Link to=".." relative="path">
                      <Button
                        danger
                        type="primary"
                        icon={<ArrowLeftOutlined />}
                      >
                        Volver
                      </Button>
                    </Link>
                  )}
                </Space>
              }
            >
              {Object.keys(methods.formState.errors).length > 0 ? (
                <Text type="danger">
                  Faltan campos por diligenciar o existen algunos errores
                </Text>
              ) : null}
              <Tabs
                defaultActiveKey="1"
                items={[
                  {
                    key: "1",
                    label: (
                      <Text
                        type={
                          Object.keys(methods.formState.errors).length > 0
                            ? "danger"
                            : undefined
                        }
                      >
                        Datos Básicos
                      </Text>
                    ),
                    children: <DatosBasicos TkCategoria={categoria} foto={foto} />,
                  },
                ]}
              />
            </StyledCard>
          </Form>
        </FormProvider>
      </Spin>
    </>
  );
};