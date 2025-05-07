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
import { DatosBasicos } from "../../components/DatosBasicos";
import { Vacaciones } from "@/services/types";
import { getEmpleados } from "@/services/maestras/empleadosAPI";
import {
  crearVacaciones,
  getVacacion,
  updateVacacion,
} from "@/services/gestion-humana/vacacionesAPI";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_ROL } from "@/config/api";
import dayjs from "dayjs";

const { Text } = Typography;

export const FormVacaciones = () => {
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const [loaderSave, setLoaderSave] = useState<boolean>(false);
  const control = useForm();
  const [vacacion, setVacacion] = useState<Vacaciones>();
  const [selectEmpleado, setSelectEmpleado] = useState<SelectProps["options"]>(
    []
  );
  const [selectTipoCarta, setSelectTipoCarta] = useState<
    SelectProps["options"]
  >([]);
  const { id } = useParams<{ id: string }>();
  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);

  const tipoCartas = [
    { label: "CARTA VACACIONES", value: "CARTA VACACIONES" },
    {
      label: "CARTA VACACIONES COMPENSADAS",
      value: "CARTA VACACIONES COMPENSADAS",
    },
    {
      label: "CARTA VACACIONES MITA COMPENSADAS",
      value: "CARTA VACACIONES MITA COMPENSADAS",
    },
  ];

  const fetchEmpleados = () => {
    getEmpleados()
      .then(({ data: { data } }) => {
        const options = data.map((item) => {
          return {
            label: `${item.cedula}-${item.nombre_completo}-${
              item.estado === "1" ? "Activo" : "Inactivo"
            }`,
            value: item.id.toString(),
          };
        });
        setSelectEmpleado(options);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  useEffect(() => {
    fetchEmpleados();

    if (id) {
      getVacacion(id).then(({ data }) => {
        setVacacion(data);
      });
    }

    setSelectTipoCarta(tipoCartas);
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
    
    if (data.periodo) {
      data.periodo = [
        dayjs(data.periodo[0]).format("YYYY-MM-DD"),
        dayjs(data.periodo[1]).format("YYYY-MM-DD"),
      ];
    }

    if (!vacacion) {
      crearVacaciones(data)
        .then((res) => {
          const blob = new Blob([res.data], { type: "application/pdf" });

          const fileURL = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = fileURL;
          a.download = "vacaciones.pdf";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);

        setTimeout(() => window.URL.revokeObjectURL(fileURL), 100);
          pushNotification({ title: 'Vacaciones creadas con exito!' });
          setTimeout(() => {
            navigate(-1);
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
    } else {
      updateVacacion(data, id)
        .then((res) => {
          pushNotification({ title: res.data.message });
          setTimeout(() => {
            navigate(-1);
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
              title={(vacacion ? "Editar" : "Crear") + " Vacaciones"}
              extra={
                <Space>
                  <Button
                    htmlType="submit"
                    type="primary"
                    icon={<SaveOutlined />}
                    disabled={
                      !["gh_admin", "gh_auxiliar", "administrador"].includes(
                        user_rol
                      )
                    }
                  >
                    Guardar
                  </Button>

                  {vacacion ? (
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
                        Datos Basicos
                      </Text>
                    ),
                    children: (
                      <DatosBasicos
                        selectEmpleado={selectEmpleado}
                        vacacion={vacacion}
                        selectTipoCarta={selectTipoCarta}
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
