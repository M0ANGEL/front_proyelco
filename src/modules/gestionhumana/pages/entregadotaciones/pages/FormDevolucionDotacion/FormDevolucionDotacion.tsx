import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Notification } from "@/modules/auth/pages/LoginPage/types";
import { DevolucionDotacion } from "../../components/DevolucionDotacion";
import { getDotaciones, getEntregaDotacion, crearDevolucionDotacion } from "@/services/gestion-humana/dotacionesAPI";
import { getEmpleadosOn } from "@/services/maestras/empleadosAPI";
import { EntregaDotacion } from "@/services/types"; 
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_ROL } from "@/config/api";

const { Text } = Typography;

export const FormDevolucionDotacion = () => {
  const [api, contextHolder] = notification.useNotification();
  const [loaderSave, setLoaderSave] = useState<boolean>(false);
  const control = useForm();
  const [selectDotacion, setSelectDotacion] = useState<SelectProps["options"]>([]);
  const [selectEmpleado, setSelectEmpleado] = useState<SelectProps["options"]>([]);
  const [entregaDotacion, setEntregaDotacion] = useState<EntregaDotacion>();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const { data: dotacionesResponse } = await getDotaciones();
        const optionsDotaciones = dotacionesResponse.data.map((item) => ({
          label: `${item.tipo}-${item.talla}`,
          value: item.id.toString(),
        }));
        setSelectDotacion(optionsDotaciones);

        const { data: empleadosResponse } = await getEmpleadosOn();
        const optionsEmpleados = empleadosResponse.data.map((item) => ({
          label: item.nombre_completo,
          value: item.id.toString(),
        }));
        setSelectEmpleado(optionsEmpleados);

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

  useEffect(() => {
    if (id) {
      getEntregaDotacion(id).then(({ data }) => {
        setEntregaDotacion(data);
        setLoaderSave(false);
      });
    } else {
      setEntregaDotacion(undefined);
      setLoaderSave(false);
    }
  }, [id])

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

  const onFinish: SubmitHandler<any> = async (data) => {
    setLoaderSave(true);
    const formData = new FormData();

    formData.append("empleado_id", data.empleado_id);
    formData.append("dotacion_id", data.dotacion_id);
    formData.append("cantidad", data.cantidad);
    formData.append("cantidad_devolucion", data.cantidad_devolucion);
    formData.append("fecha_devolucion", data.fecha_devolucion);
    formData.append("observacion", data.observacion);

    data.documento?.forEach((file: any) => {
      formData.append("documento", file.originFileObj);
    });

    if (data.documento?.file?.originFileObj) {
      formData.append("documento", data.documento.file.originFileObj);
    }

    crearDevolucionDotacion(formData, id)
        .then((res) => {
          pushNotification({ title: res.data.message });
          setTimeout(() => {
            navigate("..");
          }, 800);
        })
        .catch((error) => {
          pushNotification({
            type: "error",
            title: error.error,
            description: error.message,
          });
          setLoaderSave(false);
        });
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
              title={"DEVOLUCIÓN DOTACIÓN"}
              extra={
                <Space>
                  <Button
                    htmlType="submit"
                    type="primary"
                    icon={<SaveOutlined />}
                    disabled={!["gh_admin", "gh_bienestar", "administrador"].includes(user_rol)}
                  >
                    Guardar
                  </Button>
                  <Link to="../.." relative="path">
                    <Button danger type="primary" icon={<ArrowLeftOutlined />}>
                      Volver
                    </Button>
                  </Link>
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
                    children: <DevolucionDotacion 
                                selectDotacion={selectDotacion}
                                selectEmpleado={selectEmpleado}
                                entregaDotacion={entregaDotacion}
                               />,
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
