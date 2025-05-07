/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  notification,
  Row,
  Select,
  Spin,
} from "antd";
import { SaveOutlined } from "@ant-design/icons";
import {
  UserData,
  Activos,
  Tercero,
  RetornoActivoProovedor,
} from "@/services/types";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { useParams, useNavigate } from "react-router-dom";
import { getUsuarios } from "@/services/maestras/usuariosAPI";
import { fetchUserProfile } from "@/services/auth/authAPI";
import { getActivosAlquiler } from "@/services/activos/activosAPI";
import { KEY_BODEGA } from "@/config/api";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { getTercerosList } from "@/services/admin-terceros/tercerosAPI";
import { Controller, useForm } from "react-hook-form";
import {
  crearRetornoActivoProovedor,
  getRetornoActivoProovedor,
  updateRetornoActivoProovedor,
} from "@/services/activos/retornoActivosProovedorAPI";
// import { crearDato } from "@/services/activos/datosAPI";
const { Option } = Select;

export const FormRetornoActivoProovedorMasivo = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [actionType, setActionType] = useState<"crear" | "editar">("crear");
  const { id } = useParams<{ id: string }>(); // Obtener el ID de la URL
  const [provedores, setProvedores] = useState<Tercero[]>([]);
  const [, setUsuarios] = useState<UserData[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<UserData[]>([]);
  const [ActivosAlquiler, setActivosAlquiler] = useState<Activos[]>([]);
  const [filteredActivosAlquiler, setFilteredActivosAlquiler] = useState<
    Activos[]
  >([]);
  const [filteredProvedores, setFilteredProvedores] = useState<Tercero[]>([]);

  const navigate = useNavigate();
  const estado = 0;

  const [idUsuarioFijo, setIdUsuarioFijo] = useState<number | null>(null);
  const [usuarioLogueado, setUsuarioLogueado] = useState<UserData | null>(null); // Nuevo estado para almacenar el usuario logueado

  const { getSessionVariable } = useSessionStorage();
  const bodega = getSessionVariable(KEY_BODEGA);
  const bodegaN = Number(bodega);
  const [form] = Form.useForm();
  const control = useForm();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetchUserProfile();
        const userId = Number(response.data.userData.id);
        setIdUsuarioFijo(userId);

        // Encuentra el usuario logueado en la lista de usuarios
        const usuariosResponse = await getUsuarios();
        const usuariosData = usuariosResponse.data.data;
        setUsuarios(usuariosData);
        setFilteredUsuarios(usuariosData);
        const userLogueado = usuariosData.find((user) => user.id === userId);
        setUsuarioLogueado(userLogueado || null);
        form.setFieldsValue({ id_usuario: usuarioLogueado?.id }); // Establece el valor en el formulario
      } catch (error) {
        notification.error({
          message: "Error",
          description: "Hubo un error al obtener el perfil del usuario.",
        });
      }
    };

    fetchUserId();
  }, [form]);

  //controlador de acciones
  useEffect(() => {
    if (id) {
      setActionType("editar");
      fetchRetornoActivoProvedor(Number(id)); // Convertir id a número
    } else {
      setActionType("crear");
      form.resetFields();
    }
  }, [id, form, idUsuarioFijo]);

  //traer las categorias
  useEffect(() => {
    getTercerosList()
      .then(({ data }) => {
        if (Array.isArray(data.data)) {
          setProvedores(data.data);
          setFilteredProvedores(data.data);
        } else {
          setProvedores([]);
          setFilteredProvedores([]);
          notification.error({
            message: "Error",
            description: "La respuesta de la API no es válida.",
          });
        }
      })
      .catch(() => {
        notification.error({
          message: "Error",
          description: "Hubo un error al obtener los provedores.",
        });
      });

    getUsuarios()
      .then(({ data: { data } }) => {
        if (Array.isArray(data)) {
          setUsuarios(data);
          setFilteredUsuarios(data);
        } else {
          setUsuarios([]);
          notification.error({
            message: "Error",
            description: "La respuesta de la API no es válida.",
          });
        }
      })
      .catch(() => {
        notification.error({
          message: "Error",
          description: "Hubo un error al obtener los usuarios.",
        });
      });

    getActivosAlquiler(estado, bodegaN)
      .then(({ data }) => {
        if (Array.isArray(data)) {
          setActivosAlquiler(data);
          setFilteredActivosAlquiler(data);
        } else {
          setActivosAlquiler([]);
          setFilteredActivosAlquiler([]);
          notification.error({
            message: "Error",
            description: "La respuesta de la API no es válida.",
          });
        }
      })
      .catch(() => {
        notification.error({
          message: "Error",
          description: "Hubo un error al obtener los activos",
        });
      });
  }, []);

  //cargar la lista de activos
  const fetchRetornoActivoProvedor = async (id: number) => {
    try {
      const response = await getRetornoActivoProovedor(id);
      const data = response.data;
      form.setFieldsValue({
        id_usuario: usuarioLogueado,
        id_activo: data.id_activo,
        descripcion: data.descripcion,
        empresa_proovedora: data.empresa_proovedora,
        fecha_creacion: data.fecha_creacion,
        precio: data.precio,
        tipo_retorno: data.tipo_retorno,
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Hubo un error al obtener los retornos activos.",
      });
    }
  };

  //   const fetchUsuarios = async (search: string = "") => {
  //     try {
  //       const response = await getUsuarios();
  //       setUsuarios(response.data.data);
  //       setFilteredUsuarios(response.data.data);

  //       const filtered = usuario.filter((usuario) =>
  //         usuario.nombre.toLowerCase().includes(search.toLowerCase())
  //       );
  //       setFilteredUsuarios(filtered);
  //     } catch (error) {
  //       console.error("Error al obtener usuarios:", error);
  //     }
  //   };

  const fetchTerceros = async (search = "") => {
    try {
      const response = await getTercerosList();
      setProvedores(response.data.data);
      setFilteredProvedores(response.data.data);

      const filtered = provedores.filter((provedor) =>
        provedor.nombre.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredProvedores(filtered);
    } catch (error) {
      console.error("Error al obtener los provedores:", error);
    }
  };

  const fetchActivosAlquilados = async (search = "") => {
    try {
      const response = await getActivosAlquiler(estado, bodegaN);
      setActivosAlquiler(response.data);
      setFilteredActivosAlquiler(response.data);

      const filtered = ActivosAlquiler.filter((activos) =>
        activos.nombre.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredActivosAlquiler(filtered);
    } catch (error) {
      console.error("Error al obtener las areas", error);
    }
  };

  const formatNumber = (value: any) => {
    if (typeof value === "string") {
      return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return value.toLocaleString("es-ES");
  };

  const parseNumber = (value: any) => {
    return value.replace(/\./g, "");
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Asegúrate de que el idUsuarioFijo y user_id están definidos
      if (idUsuarioFijo === null) {
        notification.error({
          message: "Error",
          description:
            "No se pudo determinar el usuario que realiza la solicitud.",
        });
        return;
      }

      // Asigna el idUsuarioFijo tanto a user_id como a id_usuario antes de enviar
      const data: RetornoActivoProovedor = {
        ...values,
        user_id: idUsuarioFijo,
        id_usuario: usuarioLogueado?.id,
      };

      if (actionType === "crear") {
        await crearRetornoActivoProovedor(data);
        notification.success({
          message: "Éxito",
          description: "Solicitud creada correctamente.",
        });
      } else if (actionType === "editar" && id) {
        await updateRetornoActivoProovedor(Number(id), data);
        notification.success({
          message: "Éxito",
          description: "Solicitud actualizada correctamente.",
        });
      }

      navigate("../"); // Redirige a la lista de datos
    } catch (error) {
      const errorMessage = (error as Error).message || "Error desconocido";
      notification.error({
        message: "Error",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledCard
      title={
        actionType === "crear"
          ? "CREAR RETORNO PROOVEDOR MASIVO"
          : "EDITAR RETORNO PROOVEDOR MASIVO"
      }
    >
      <Spin spinning={loading}>
        <Form
          layout="vertical"
          form={form}
          onFinish={control.handleSubmit(onFinish)}
        >
          <Row gutter={16}>
            <Col span={12}>

            
            <Form.Item
  label="Activo"
  rules={[
    {
      required: true,
      message: "Debe seleccionar al menos un activo",
    },
  ]}
>
  <Controller
    name="id_activo"
    control={control.control}
    render={({ field }) => (
      <Select
        {...field}
        mode="multiple"
        placeholder="Seleccione uno o más activos alquilados"
        onSelect={() => getActivosAlquiler(estado, bodegaN)}
        onSearch={(input) => {
          const searchTerm = input.trim().toLowerCase();

          if (searchTerm === "") {
            // Si el usuario borra el texto, recargamos la lista de activos
            fetchActivosAlquilados();
            return;
          }

          // Filtrar activos por ID o nombre
          const filtrados = filteredActivosAlquiler.filter(
            (activo) =>
              activo.id.toString().includes(searchTerm) || // Filtrar por ID
              activo.nombre.toLowerCase().includes(searchTerm) // Filtrar por nombre
          );

          setFilteredActivosAlquiler(filtrados);
        }}
        filterOption={false}
        showSearch
      >
        {filteredActivosAlquiler.map((activo) => (
          <Select.Option key={activo.id} value={activo.id}>
            {`${activo.id} - ${activo.nombre}`}
          </Select.Option>
        ))}
      </Select>
    )}
  />
</Form.Item>


            </Col>

            <Col span={12}>
              <Form.Item label="Usuario Que Autoriza">
                <Controller
                  name="id_usuario"
                  control={control.control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      showSearch
                      placeholder="Seleccione el usuario"
                      value={idUsuarioFijo} // Usa el valor de idUsuarioFijo como el valor del Select
                      disabled // Desactiva el campo para evitar cambios manuales
                    >
                      {Array.isArray(filteredUsuarios) &&
                        filteredUsuarios.map((usuario) => (
                          <Option key={usuario.id} value={usuario.id}>
                            {usuario.nombre}
                          </Option>
                        ))}
                    </Select>
                  )}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Descripcion"
                rules={[
                  { required: true, message: "Debe digitar una descripcion" },
                ]}
              >
                <Controller
                  name="descripcion"
                  control={control.control}
                  render={({ field }) => <Input {...field} />}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Tipo de Retorno"
                rules={[
                  {
                    required: true,
                    message: "Debe seleccionar el tipo de retorno",
                  },
                ]}
              >
                <Controller
                  name="tipo_retorno"
                  control={control.control}
                  render={({ field }) => (
                    <Select
                      placeholder="Seleccione el tipo de retorno"
                      {...field}
                    >
                      <Select.Option value="falla">Falla</Select.Option>
                      <Select.Option value="garantia">Garantía</Select.Option>
                      <Select.Option value="mejora">Mejora</Select.Option>
                      <Select.Option value="no uso">No Uso</Select.Option>
                    </Select>
                  )}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Empresa Provedora"
                rules={[
                  {
                    required: true,
                    message: "Debe seleccionar la empresa provedora del activo",
                  },
                ]}
              >
                <Controller
                  name="empresa_proovedora"
                  control={control.control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="seleccione la empresa provedora"
                      onSelect={() => getTercerosList()}
                      onSearch={fetchTerceros}
                      filterOption={false}
                      showSearch
                    >
                      {Array.isArray(filteredProvedores) &&
                        filteredProvedores.map((provedores) => (
                          <Option key={provedores.id} value={provedores.id}>
                            {provedores.nombre}
                          </Option>
                        ))}
                    </Select>
                  )}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Fecha"
                rules={[
                  {
                    required: true,
                    message: "Debe seleccionar la fecha",
                  },
                ]}
              >
                <Controller
                  name="fecha_creacion"
                  control={control.control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      style={{ width: "100%" }}
                      placeholder="Seleccione la fecha"
                      format="YYYY-MM-DD"
                    />
                  )}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="precio">
                <Controller
                  name="precio"
                  control={control.control}
                  render={({ field }) => (
                    <InputNumber
                      {...field}
                      formatter={(value) => formatNumber(value)}
                      parser={(value) => parseNumber(value)}
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              {actionType === "crear" ? "Crear Solicitud" : "Editar Solicitud"}
              Guardar
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </StyledCard>
  );
};
