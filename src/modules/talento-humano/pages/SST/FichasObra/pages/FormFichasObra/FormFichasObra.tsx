import { useEffect, useState } from "react";
import {
  Button,
  Form,
  notification,
  Space,
  Spin,
  Tabs,
  Typography,
} from "antd";
import {
  LoadingOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Notification } from "@/modules/auth/pages/LoginPage/types";
import { AmClientes } from "@/services/types";
import { DatosBasicos } from "../components/DatosBasicos";

import {
  crearFicha,
  getFicha,
  updateFicha,
} from "@/services/talento-humano/fichaObraAPI";
import dayjs from "dayjs";

const { Text } = Typography;

export const FormFichasObra = () => {
  const [api, contextHolder] = notification.useNotification();
  const [loaderSave, setLoaderSave] = useState<boolean>(false);
  const methods = useForm();
  const [categoria, setCategoria] = useState<AmClientes>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    // Si hay un id ejecutamos una consulta para traer datos de esa categoría
    if (id) {
      getFicha(id).then(({ data }) => {
        setCategoria(data);
        setLoaderSave(false);
      });
    } else {
      setLoaderSave(false);
    }
  }, [id]);

  // Notificación de los estados
  const pushNotification = ({
    type = "success",
    title,
    description,
  }: Notification) => {
    api[type]({
      message: title,
      description: description,
      placement: "bottomRight",
    });
  };

  // Guardado de los datos modificado para manejar archivos
  // const onFinish: SubmitHandler<any> = async (data) => {
  //   setLoaderSave(true);

  //   try {
  //     // Crear FormData para enviar archivos
  //     const formData = new FormData();

  //     // Agregar todos los campos del formulario al FormData
  //     Object.keys(data).forEach(key => {
  //       if (key === 'foto' && data[key] instanceof File) {
  //         // Agregar la foto como archivo
  //         formData.append('foto', data[key]);
  //       } else if (key === 'fecha_expedicion' || key === 'fecha_nacimiento' || key === 'fecha_ingreso') {
  //         // Formatear fechas si es necesario
  //         if (data[key]) {
  //           formData.append(key, dayjs(data[key]).format('YYYY-MM-DD'));
  //         }
  //       } else if (key === 'salario' || key === 'numero_hijos') {
  //         // Manejar campos numéricos
  //         formData.append(key, data[key]?.toString() || '');
  //       } else {
  //         // Agregar otros campos como strings
  //         formData.append(key, data[key]?.toString() || '');
  //       }
  //     });

  //     if (categoria) {
  //       // Actualizar empleado existente
  //       await updateFicha(formData, id);
  //       pushNotification({ title: "Empleado actualizado con éxito!" });
  //       setTimeout(() => {
  //         navigate("..");
  //       }, 800);
  //     } else {
  //       // Crear nuevo empleado
  //       await crearFicha(formData);
  //       pushNotification({ title: "Empleado creado con éxito!" });
  //       setTimeout(() => {
  //         navigate(-1);
  //       }, 800);
  //     }

  //   } catch (error: any) {
  //     const msg = error.response?.data?.message || "Ocurrió un error inesperado";
  //     pushNotification({
  //       type: "error",
  //       title: "Error",
  //       description: msg,
  //     });
  //     setLoaderSave(false);
  //   }
  // };

  // Guardado de los datos modificado para manejar archivos
  const onFinish: SubmitHandler<any> = async (data) => {
    setLoaderSave(true);

    try {
      // Crear FormData para enviar archivos
      const formData = new FormData();

      console.log("📝 Datos del formulario:", data);

      if (categoria) {
        // 🔹 MODO ACTUALIZACIÓN: Enviar SOLO los campos editables
        console.log("🔄 Modo ACTUALIZACIÓN - Enviando solo campos editables");

        // Campos editables en actualización
        const camposEditables = [
          "contratista_id",
          "eps",
          "pension",
          "tipo_sangre",
          "numero_hijos",
          "foto",
        ];

        // Agregar solo campos editables al FormData
        camposEditables.forEach((key) => {
          const value = data[key];
          console.log(`🔍 Procesando campo ${key}:`, value);

          if (key === "foto" && value instanceof File) {
            formData.append("foto", value);
            console.log("📸 Foto agregada:", value.name);
          } else if (value !== null && value !== undefined && value !== "") {
            formData.append(key, value.toString());
            console.log(`✅ ${key} agregado:`, value);
          } else {
            console.log(`❌ ${key} está vacío o undefined`);
          }
        });
      } else {
        // 🔹 MODO CREACIÓN: Enviar TODOS los campos
        console.log("🆕 Modo CREACIÓN - Enviando todos los campos");

        // Agregar todos los campos del formulario al FormData
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

      // DEBUG: Verificar FormData
      console.log("📤 FormData preparado - contenido:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": ", pair[1]);
      }

      if (categoria) {
        // Actualizar empleado existente
        console.log("🔄 Actualizando empleado ID:", categoria.id);
        await updateFicha(formData, categoria.id.toString());
        pushNotification({ title: "Empleado actualizado con éxito!" });
        setTimeout(() => {
          navigate("..");
        }, 800);
      } else {
        // Crear nuevo empleado
        console.log("🆕 Creando nuevo empleado");
        await crearFicha(formData);
        pushNotification({ title: "Empleado creado con éxito!" });
        setTimeout(() => {
          navigate(-1);
        }, 800);
      }
    } catch (error: any) {
      console.error("❌ Error al guardar:", error);
      const msg =
        error.response?.data?.message || "Ocurrió un error inesperado";
      pushNotification({
        type: "error",
        title: "Error",
        description: msg,
      });
      setLoaderSave(false);
    }
  };

  // Retorno de la vista
  return (
    <>
      {contextHolder}
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
                    children: <DatosBasicos TkCategoria={categoria} />,
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
