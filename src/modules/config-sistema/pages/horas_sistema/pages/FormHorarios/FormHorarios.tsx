import {
  StyledCard,
  StyledFormItem,
} from "@/modules/common/layout/DashboardLayout/styled";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { Notification } from "@/modules/auth/pages/LoginPage/types";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
/* import { Link } from "react-router-dom"; */
import {
  ArrowLeftOutlined,
  LoadingOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  Space,
  Spin,
  Tabs,
  Typography,
  notification,
  TimePicker,
  Col,
  Modal,
  Input,
  Card,
} from "antd";
import moment from "moment";
import {
  crearHorarios,
  getPerfilHorario,
  updateHorario,
} from "@/services/horarios-sistema/horariosAPI";
import { Link } from "react-router-dom";
import { ResponseHorarios } from "@/services/types";

const { Text } = Typography;

export const FormHorarios = () => {
  const [loaderSave, setLoaderSave] = useState<boolean>(false);
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const control = useForm();

  const [perfil, setPerfil] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [dataPerfil, setDataPerfil] = useState<ResponseHorarios>();
  const diasSemana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  const { id } = useParams<{ id: string }>();
  //dias default
  const [horarios, setHorarios] = useState<any>(
    diasSemana.reduce((acc, dia) => {
      acc[dia] = { inicio: null, fin: null };
      return acc;
    }, {} as Record<string, { inicio: string | null; fin: string | null }>)
  );

  useEffect(() => {
    if (id) {
      getPerfilHorario(id).then(({ data }) => {
        setDataPerfil(data);
        setLoaderSave(false);
      });
    }
  }, [id]);

  //carga de selects
  useEffect(() => {
    if (dataPerfil?.perfil_nombre) {
      control.setValue("perfil_id", dataPerfil?.perfil_nombre);
    }
  }, [dataPerfil]);

  //carga de horarios al editar
  useEffect(() => {
    if (dataPerfil?.data) {
      const horariosCargados = diasSemana.reduce((acc, dia) => {
        const horarioDia = dataPerfil?.data?.find(
          (h) => h.dia.toLowerCase() === dia.toLowerCase()
        );

        acc[dia] = {
          inicio: horarioDia
            ? moment(horarioDia.hora_inicio, "HH:mm:ss")
            : null,
          fin: horarioDia ? moment(horarioDia.hora_final, "HH:mm:ss") : null,
        };
        return acc;
      }, {} as Record<string, { inicio: moment.Moment | null; fin: moment.Moment | null }>);

      setHorarios(horariosCargados);
    }
  }, [dataPerfil]);

  /* notificaciones || mensajes */
  const pushNotification = ({
    type = "success",
    title,
    description,
  }: Notification) => {
    api[type]({ message: title, description, placement: "bottomRight" });
  };

  /* selecion de dias */
  const handleHorarioChange = (
    day: string,
    key: "inicio" | "fin",
    value: any
  ) => {
    setHorarios((prev) => {
      const updated = { ...prev, [day]: { ...prev[day], [key]: value } };

      // Si se ingresa hora de inicio, hora fin es obligatoria
      if (updated[day].inicio && !updated[day].fin && key === "inicio") {
        pushNotification({
          type: "warning",
          title: "Hora Fin Obligatoria",
          description: `Si establece una hora de inicio para ${day}, también debe establecer una hora de fin.`,
        });
      }

      // Validación de que la hora de fin no sea menor que la de inicio
      if (updated[day].inicio && updated[day].fin) {
        const inicioMoment = moment(updated[day].inicio, "HH:mm");
        const finMoment = moment(updated[day].fin, "HH:mm");

        if (finMoment.isBefore(inicioMoment)) {
          pushNotification({
            type: "error",
            title: "Error en horarios",
            description: `La hora de fin no puede ser menor que la de inicio para ${day}`,
          });
          return prev; // Mantiene el estado anterior sin actualizar
        }
      }

      return updated;
    });
  };

  // Envío del formulario con validaciones
  const onFinish: SubmitHandler<any> = async (data) => {
    setLoading(true);

    const horariosArray = diasSemana
      .map((day) => {
        const { inicio, fin } = horarios[day];

        if (inicio && !fin) {
          pushNotification({
            type: "error",
            title: "Error en horarios",
            description: `Debe ingresar una hora de fin para ${day}`,
          });
          setLoading(false);
          return null;
        }

        if (inicio && fin) {
          return { dia: day, hora_inicio: inicio, hora_fin: fin };
        }
        return null; // No se envía el día si ambos valores están vacíos
      })
      .filter(Boolean);

    if (horariosArray.length === 0) {
      pushNotification({
        type: "error",
        title: "Error",
        description: "Debe ingresar al menos un horario válido.",
      });
      setLoading(false);
      return;
    }

    try {
      if (id) {
        // Si hay un ID, se edita el horario existente
        await updateHorario(
          {
            perfil_id: perfil ? perfil : dataPerfil?.perfil_nombre, // Usa el valor inicial si no hay selección
            horarios: horariosArray,
            idPerfil: Number(dataPerfil?.perfil),
          },
          Number(id)
        );

        pushNotification({ title: "Horarios actualizados con éxito!" });
      } else {
        // Si no hay un ID, se crea un nuevo horario
        await crearHorarios({
          perfil_id: perfil,
          horarios: horariosArray,
        });
        pushNotification({ title: "Horarios creados con éxito!" });
      }

      setTimeout(() => navigate(-1), 800);
    } catch (error) {
      pushNotification({
        title: `Error: ${
          id ? "No se pudo actualizar el horario" : "Este horario ya existe "
        } ${error}`,
        type: "error",
      });
    } finally {
      setLoading(false);
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
      >
        <FormProvider {...control}>
          <Form
            layout="vertical"
            onFinish={control.handleSubmit(onFinish)}
            autoComplete="off"
          >
            <StyledCard
              title={id ? "Editar" : "Crear" + " Horario"}
              extra={
                <Space>
                  <Button
                    htmlType="submit"
                    type="primary"
                    icon={<SaveOutlined />}
                  >
                    Guardar
                  </Button>
                  <Link to={id ? "../.." : ".."} relative="path">
                    <Button danger type="primary" icon={<ArrowLeftOutlined />}>
                      Volver
                    </Button>
                  </Link>
                </Space>
              }
            >
              {/* <Tabs defaultActiveKey="1" animated>
                <Col xs={24} sm={20} style={{ width: "100%" }}>
                  <Controller
                    name="perfil_id"
                    control={control.control}
                    rules={{
                      required: {
                        value: true,
                        message: "El horario es requerido",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem
                        required
                        label="Horario"
                        labelCol={{ span: 24 }}
                      >
                        <Input
                          {...field}
                          allowClear
                          maxLength={60}
                          onChange={(e) => {
                            field.onChange(e);
                            setPerfil(e.target.value);
                          }}
                        />
                        {error && <Text type="danger">{error.message}</Text>}
                      </StyledFormItem>
                    )}
                  />
                </Col>

                <div style={{ justifyContent: "center", marginTop: 20 }}>
                  <Col xs={24} sm={24} style={{ width: "100%" }}>
                    {Object.keys(horarios).map((day) => (
                      <div
                        key={day}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 0.8fr 0.8fr",
                          gap: "15px",
                          padding: "10px",
                          alignItems: "center",
                          borderBottom: "1px solid #f0f0f0",
                          textAlign: "center",
                          background: "#fafafa",
                          borderRadius: "8px",
                        }}
                      >
                        <Text
                          strong
                          style={{
                            textTransform: "capitalize",
                            fontSize: "16px",
                          }}
                        >
                          {day}
                        </Text>
                        <TimePicker
                          placeholder="Inicio"
                          value={
                            horarios[day].inicio
                              ? moment(horarios[day].inicio, "HH:mm")
                              : null
                          }
                          onChange={(time) =>
                            handleHorarioChange(
                              day,
                              "inicio",
                              time ? time.format("HH:mm") : null
                            )
                          }
                          format="HH:mm"
                          style={{ width: "120px", textAlign: "center" }}
                        />
                        <TimePicker
                          placeholder="Fin"
                          value={
                            horarios[day].fin
                              ? moment(horarios[day].fin, "HH:mm")
                              : null
                          }
                          onChange={(time) =>
                            handleHorarioChange(
                              day,
                              "fin",
                              time ? time.format("HH:mm") : null
                            )
                          }
                          format="HH:mm"
                          style={{ width: "120px", textAlign: "center" }}
                        />
                      </div>
                    ))}
                  </Col>
                </div>
              </Tabs> */}

                <Col xs={24} sm={20} style={{ width: "50%", margin: "auto" }}>
                  {/* Input para el perfil */}
                  <Card
                    style={{
                      padding: "20px",
                      background: "#fafafa",
                      borderRadius: "8px",
                    }}
                  >
                    <Controller
                      name="perfil_id"
                      control={control.control}
                      rules={{
                        required: {
                          value: true,
                          message: "El horario es requerido",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem
                          required
                          label="Horario"
                          labelCol={{ span: 24 }}
                        >
                          <Input
                            {...field}
                            allowClear
                            maxLength={60}
                            onChange={(e) => {
                              field.onChange(e);
                              setPerfil(e.target.value);
                            }}
                          />
                          {error && <Text type="danger">{error.message}</Text>}
                        </StyledFormItem>
                      )}
                    />
                  </Card>

                  {/* Horarios */}
                  <Card
                    style={{
                      padding: 20,
                      background: "#fafafa",
                      borderRadius: "8px",
                    }}
                  >
                    {Object.keys(horarios).map((day) => (
                      <div
                        key={day}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 0.8fr 0.8fr",
                          gap: "15px",
                          padding: "10px",
                          alignItems: "center",
                          borderBottom: "1px solid #f0f0f0",
                          textAlign: "center",
                        }}
                      >
                        <Text
                          strong
                          style={{
                            textTransform: "capitalize",
                            fontSize: "16px",
                          }}
                        >
                          {day}
                        </Text>
                        <TimePicker
                          placeholder="Inicio"
                          value={
                            horarios[day].inicio
                              ? moment(horarios[day].inicio, "HH:mm")
                              : null
                          }
                          onChange={(time) =>
                            handleHorarioChange(
                              day,
                              "inicio",
                              time ? time.format("HH:mm") : null
                            )
                          }
                          format="HH:mm"
                          style={{ width: "120px", textAlign: "center" }}
                        />
                        <TimePicker
                          placeholder="Fin"
                          value={
                            horarios[day].fin
                              ? moment(horarios[day].fin, "HH:mm")
                              : null
                          }
                          onChange={(time) =>
                            handleHorarioChange(
                              day,
                              "fin",
                              time ? time.format("HH:mm") : null
                            )
                          }
                          format="HH:mm"
                          style={{ width: "120px", textAlign: "center" }}
                        />
                      </div>
                    ))}
                  </Card>
                </Col>
            </StyledCard>
          </Form>
        </FormProvider>
      </Spin>

      <Modal
        open={loading}
        closable={false}
        maskClosable={false}
        footer={null}
        centered
      >
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spin size="large" />
          <p style={{ marginTop: "10px" }}>Creando horario...</p>
        </div>
      </Modal>
    </>
  );
};
