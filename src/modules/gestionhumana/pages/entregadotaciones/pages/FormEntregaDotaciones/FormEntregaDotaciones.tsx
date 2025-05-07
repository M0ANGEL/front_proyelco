import {
  Button,
  Form,
  notification,
  SelectProps,
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
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Notification } from "@/modules/auth/pages/LoginPage/types";
import { DatosBasicos } from "../../components/DatosBasicos";
import { getEmpleadosSalarioMinimo } from "@/services/maestras/empleadosAPI";
import { crearEntregaDotacion } from "@/services/gestion-humana/dotacionesAPI";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_ROL } from "@/config/api";
import { Empleado } from "@/services/types";

const { Text } = Typography;

export const FormEntregaDotaciones = () => {
  const [api, contextHolder] = notification.useNotification();
  const [loaderSave, setLoaderSave] = useState<boolean>(false);
  const control = useForm();
  const [selectEmpleados, setSelectEmpleados] = useState<SelectProps["options"]>([]);
  const navigate = useNavigate();
  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);
  const { id } = useParams<{ id: string }>();
  const [empleadosData, setEmpleadosData] = useState<Empleado[]>([]); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { data },
        } = await getEmpleadosSalarioMinimo();
        const options = data.map((item) => ({
          label: `${item.nombre_completo}-${item.cedula}`,
          value: item.id.toString(),
        }));
        setSelectEmpleados(options);
        setEmpleadosData(data);
      } catch (error: any) {
        console.log("Error: ", error);

        if (error.response) {
          console.error("Error en la respuesta: ", error.response.data);
        } else if (error.request) {
          console.error("Error en la solicitud: ", error.request);
        } else {
          console.error("Error en el setup de la petición: ", error.message);
        }
      } finally {
        // setLoader(false);
      }
    };

    fetchData();
  }, []);

  const pushNotification = ({
    type = "success",
    title,
    description,
  }: Notification) => {
    api[type]({
      message: title,
      description: description,
      placement: "topRight",
    });
  };

  const onFinish: SubmitHandler<any> = async (data) => {
    setLoaderSave(true);

    const formData = new FormData();

    data.documento?.forEach((file: any) => {
      formData.append("documento", file.originFileObj);
    });

    if (data.documento?.file?.originFileObj) {
      formData.append("documento", data.documento.file.originFileObj);
    }

    const dotacionesConCantidad = data.dotacion.filter(
      (dotacion: any) => dotacion.cantidad
    );

    dotacionesConCantidad.forEach((dotacion: any, index: number) => {
      formData.append(`dotacion[${index}][key]`, dotacion.id);
      formData.append(`dotacion[${index}][cantidad]`, dotacion.cantidad);
    });

    formData.append("empleado_id", data.empleado_id);
    formData.append("fecha_entrega", data.fecha_entrega);
    formData.append("observacion", data.observacion);

    crearEntregaDotacion(formData)
      .then((response) => {
        const blob = new Blob([response.data], { type: "application/pdf" });

        const fileURL = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = fileURL;
        a.download = "entrega_dotacion.pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setTimeout(() => window.URL.revokeObjectURL(fileURL), 100);
        pushNotification({ title: "Entrega dotación creado con exito!" });
        setTimeout(() => {
          navigate(-1);
        }, 800);
      })
      .catch((error) => {
        pushNotification({
          type: "error",
          title: "Ingrese cantidad",
          description: "Debe enviar al menos una cantidad de dotación",
        });
        setLoaderSave(false);
      });
  };

  const handleSelectEmpleado = (idEmpleado: string) => {
    const empleadoSeleccionado = empleadosData.find((empleado) => empleado.id.toString() === idEmpleado);
    if (empleadoSeleccionado?.gana_mas_de_dos_salarios === "1") {
      pushNotification({type: "warning", title: "Empleado con mas de 2 salarios minimos!" });
    }
  };

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
        <FormProvider {...control}>
          <Form
            layout="vertical"
            onFinish={control.handleSubmit(onFinish)}
            autoComplete="off"
          >
            <StyledCard
              title={"REALIZAR ENTREGAS DOTACIÓN"}
              extra={
                <Space>
                  <Button
                    htmlType="submit"
                    type="primary"
                    icon={<SaveOutlined />}
                    disabled={
                      !["gh_admin", "gh_bienestar", "administrador"].includes(
                        user_rol
                      )
                    }
                  >
                    Guardar
                  </Button>
                  {id ? (
                    <Link to="../../../empleados" relative="path">
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
              {Object.keys(control.formState.errors).length > 0 ? (
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
                          Object.keys(control.formState.errors).length > 0
                            ? "danger"
                            : undefined
                        }
                      >
                        Datos Básicos
                      </Text>
                    ),
                    children: (
                      <DatosBasicos 
                        selectEmpleados={selectEmpleados} 
                        id={id} 
                        onSelectEmpleado={handleSelectEmpleado}
                      />
                    ),
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
