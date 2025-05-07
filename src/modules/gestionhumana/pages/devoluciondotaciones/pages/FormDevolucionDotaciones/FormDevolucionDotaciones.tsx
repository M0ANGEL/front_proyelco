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
import { Link, useNavigate } from "react-router-dom";
import { Notification } from "@/modules/auth/pages/LoginPage/types";
import { DatosBasicos } from "../../components";
import { getEmpleadosOn } from "@/services/maestras/empleadosAPI";
import { getDotaciones } from "@/services/gestion-humana/dotacionesAPI";
import { crearDevolucionDotacion } from "@/services/gestion-humana/dotacionesAPI"; 

const { Text } = Typography;

export const FormDevolucionDotaciones = () => {
  const [api, contextHolder] = notification.useNotification();
  const [loaderSave, setLoaderSave] = useState<boolean>(false);
  const control = useForm();
  const [selectEmpleados, setSelectEmpleados] = useState<SelectProps["options"]>([]);
  const [selectDotaciones, setSelectDotaciones] = useState<SelectProps["options"]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: dataEmpleados } = await getEmpleadosOn();
        const options = dataEmpleados.data.map((item) => ({
          label: `${item.nombre_completo}-${item.cedula}`,
          value: item.id.toString(),
        }));
        setSelectEmpleados(options);

        const { data: dataDotaciones } = await getDotaciones();
        const optionsDotaciones = dataDotaciones.data.map((item) => ({
          label: `${item.tipo}-${item.talla}`,
          value: item.id.toString(),
        }));
        setSelectDotaciones(optionsDotaciones);
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
      placement: "bottomRight",
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

    formData.append("empleado_id", data.empleado_id);
    formData.append("dotacione_id", data.dotacione_id);
    formData.append("fecha_devolucion", data.fecha_devolucion);
    formData.append("observacion", data.observacion);

    crearDevolucionDotacion(formData)
      .then((res) => {
        pushNotification({ title: res.data.message });
        setTimeout(() => {
          navigate(-1);
        }, 800);
      })
      .catch((error) => {
        pushNotification({
          type: "error",
          title: error.response.error,
          description: error.response.data.message,
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
              title={"REALIZAR DEVOLUCIONES DOTACIÓN"}
              extra={
                <Space>
                  <Button
                    htmlType="submit"
                    type="primary"
                    icon={<SaveOutlined />}
                    // disabled={!["gh_admin", "gh_auxiliar"].includes(user_rol)}
                  >
                    Guardar
                  </Button>
                  <Link to=".." relative="path">
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
                    children: (
                      <DatosBasicos 
                        selectEmpleados={selectEmpleados} 
                        selectDotaciones={selectDotaciones}
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
