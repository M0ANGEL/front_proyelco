import { useEffect, useState } from "react";
import {
  Form,
  Space,
  Spin,
  Tabs,
  Typography,
} from "antd";
import {
  LoadingOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

// Componentes globales
import { GlobalCard } from "@/components/global/GlobalCard";
import { BackButton } from "@/components/global/BackButton";
import { SaveButton } from "@/components/global/SaveButton";
import { notify } from "@/components/global/NotificationHandler";

// Componentes y servicios específicos
import { DatosBasicos } from "../components/DatosBasicos";
import { AmClientes } from "@/types/typesGlobal";
import useSerialize from "@/hooks/useUpperCase";
import { crearAmCliente, getAmcliente, updateAmCliente } from "@/services/clientes/AdministrarClientesApi";

const { Text } = Typography;



export const FromReporteNc = () => {
  const [loaderSave, setLoaderSave] = useState<boolean>(false);
  const control = useForm();
  const [categoria, setCategoria] = useState<AmClientes>();
  const { transformToUpperCase } = useSerialize();

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const isEditMode = Boolean(id);

  useEffect(() => {
    // Si hay un id ejecutamos una consulta para traer datos de ese cliente
    if (id) {
      setLoaderSave(true);
      getAmcliente(id)
        .then(({ data }) => {
          setCategoria(data);
        })
        .catch((error) => {
          console.error("Error fetching cliente:", error);
          notify.error(
            "Error", 
            "No se pudo cargar la información del cliente"
          );
        })
        .finally(() => {
          setLoaderSave(false);
        });
    } else {
      setLoaderSave(false);
    }
    
  }, [id]);


  // Guardado de los datos
  const onFinish: SubmitHandler<any> = async (data) => {
    data = transformToUpperCase(data, ["emp_nombre"]);

    setLoaderSave(true);

    try {
      if (isEditMode) {
        await updateAmCliente(data, id!);
        notify.success(
          "Éxito", 
          "Cliente actualizado correctamente"
        );
        setTimeout(() => {
          navigate("..");
        }, 800);
      } else {
        await crearAmCliente(data);
        notify.success(
          "Éxito", 
          "Cliente creado correctamente"
        );
        setTimeout(() => {
          navigate(-1);
        }, 800);
      }
    } catch (error: any) {
      console.error("Error saving cliente:", error);
      
      // Manejo específico de errores
      if (error.response?.data?.message?.includes(
        "No se puede actualizar el nit porque ya hay un cliente con este NIT."
      )) {
        notify.error(
          "Error de NIT", 
          "Ya existe un cliente registrado con este NIT. Por favor verifique la información."
        );
      } else if (error.response?.data?.errors?.prefijo) {
        notify.error(
          "Error de Prefijo", 
          "El prefijo ingresado ya está en uso. Por favor utilice uno diferente."
        );
      } else if (error.response?.data?.errors) {
        // Manejo de errores de validación del servidor
        const errores: string[] = Object.values(error.response.data.errors);
        errores.forEach((errorMsg: string) => {
          notify.error("Error de Validación", errorMsg);
        });
      } else {
        notify.error(
          "Error", 
          error.response?.data?.message || "Ocurrió un error inesperado al guardar el cliente"
        );
      }
    } finally {
      setLoaderSave(false);
    }
  };

  const hasErrors = Object.keys(control.formState.errors).length > 0;

  return (
    <Spin
      spinning={loaderSave}
      indicator={
        <LoadingOutlined spin style={{ fontSize: 40, color: "#f4882a" }} />
      }
      style={{ backgroundColor: "rgb(251 251 251 / 70%)", minHeight: "100vh" }}
    >
      <FormProvider {...control}>
        <Form
          layout="vertical"
          onFinish={control.handleSubmit(onFinish)}
          autoComplete="off"
        >
          <GlobalCard
            title={`${isEditMode ? "Editar" : "Crear"} Reporte`}
            extra={
              <Space>
                <SaveButton
                  loading={loaderSave}
                  disabled={loaderSave}
                  text={isEditMode ? "Actualizar Reporte" : "Crear Reporte"}
                  htmlType="submit"
                  icon={<SaveOutlined />}
                />
                <BackButton 
                  to={isEditMode ? "../.." : ".."}
                  text="Volver al Listado"
                />
              </Space>
            }
          >
            {hasErrors && (
              <Text type="danger" style={{ display: 'block', marginBottom: '16px' }}>
                ⚠️ Faltan campos requeridos por diligenciar o existen errores en el formulario
              </Text>
            )}
            
            <Tabs
              defaultActiveKey="1"
              items={[
                {
                  key: "1",
                  label: (
                    <Text
                      type={hasErrors ? "danger" : undefined}
                      strong={!hasErrors}
                    >
                      Datos Básicos
                      {hasErrors && " *"}
                    </Text>
                  ),
                  children: <DatosBasicos TkCategoria={categoria} />,
                },
              ]}
              animated
            />
          </GlobalCard>
        </Form>
      </FormProvider>
    </Spin>
  );
};