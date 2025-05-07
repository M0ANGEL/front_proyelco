/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Controller, useForm } from "react-hook-form";
import { getActivosAlquiler } from "@/services/activos/activosAPI";
import { KEY_BODEGA } from "@/config/api";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { getTercerosList } from "@/services/admin-terceros/tercerosAPI";
import {
  crearRetornoActivoProovedor,
  getRetornoActivoProovedor,
  updateRetornoActivoProovedor,
} from "@/services/activos/retornoActivosProovedorAPI";
import { fetchUserProfile } from "@/services/auth/authAPI";
// import { crearDato } from "@/services/activos/datosAPI";
const { Option } = Select;

export const FormRetornoActivoProovedor = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [actionType, setActionType] = useState<"crear" | "editar">("crear");
  const { id } = useParams<{ id: string }>(); // Obtener el ID de la URL
  const [provedores, setProvedores] = useState<Tercero[]>([]);
  // const [usuarioAutoriza, setUsuarioAutoriza] = useState<number>();
  const [usuario, setUsuario] = useState<UserData[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<UserData[]>([]);
  const [ActivosAlquiler, setActivosAlquiler] = useState<Activos[]>([]);
  const [filteredActivosAlquiler, setFilteredActivosAlquiler] = useState<
    Activos[]
  >([]);
  const [filteredProvedores, setFilteredProvedores] = useState<Tercero[]>([]);

  const navigate = useNavigate();
  const estado = 0;
  const { getSessionVariable } = useSessionStorage();
  const bodega = getSessionVariable(KEY_BODEGA);
  const bodegaN = Number(bodega);
  const [form] = Form.useForm();
  const control = useForm();

  useEffect(() => {
    if (id) {
      setActionType("editar");
      fetchRetornoActivoProvedor(Number(id)); // Convertir id a número
    } else {
      setActionType("crear");
      form.resetFields();
    }
  }, [id, form]);

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
          setUsuario(data);
          setFilteredUsuarios(data);
        } else {
          setUsuario([]);
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

      control.reset({});
      form.setFieldsValue({
        data,
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Hubo un error al obtener los retornos activos.",
      });
    }
  };

  const fetchUsuarios = async (search = "") => {
    try {
      const response = await getUsuarios();
      setUsuario(response.data.data);
      setFilteredUsuarios(response.data.data);

      const filtered = usuario.filter((usuario) =>
        usuario.nombre.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredUsuarios(filtered);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

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

  const onFinish = async (values: any) => {
    setLoading(true);

    const response = await fetchUserProfile();
    const userId = response.data.userData.id;

    try {
      if (userId === null) {
        notification.error({
          message: "Error",
          description:
            "No se pudo determinar el usuario que realiza la solicitud.",
        });
        return;
      }

      const data: RetornoActivoProovedor = {
        ...values,
        user_id: userId,
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

      navigate("..");
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
          ? "CREAR RETORNO PROOVEDOR"
          : "EDITAR RETORNO PROOVEDOR"
      }
    >
      <Spin spinning={loading}>
        <Form onFinish={control.handleSubmit(onFinish)} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
            <Form.Item label="Activo">
  <Controller
    name="id_activo"
    control={control.control}
    rules={{ required: "Debe seleccionar al menos un activo" }}
    render={({ field }) => (
      <Select
        {...field}
        mode="multiple"
        placeholder="Seleccione uno o más activos alquilados"
        showSearch
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
        filterOption={false} // Desactivamos el filtro interno para manejarlo manualmente
      >
        {filteredActivosAlquiler?.map((activo) => (
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
                      value={usuario}
                      onSearch={fetchUsuarios}
                      onChange={(value) => {
                        field.onChange(value);
                        setUsuario(value);
                      }}
                      filterOption={(input, option) =>
                        option?.label
                          ?.toLowerCase()
                          .includes(input.toLowerCase()) ?? false
                      }
                      options={filteredUsuarios.map((usuario) => ({
                        value: usuario.id,
                        label: `${usuario.nombre}`,
                      }))}
                    />
                  )}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Descripción">
                <Controller
                  name="descripcion"
                  control={control.control}
                  rules={{ required: "Debe digitar una descripción" }}
                  render={({ field }) => <Input {...field} />}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Tipo de Retorno">
                <Controller
                  name="tipo_retorno"
                  control={control.control}
                  rules={{ required: "Debe seleccionar el tipo de retorno" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Seleccione el tipo de retorno"
                    >
                      <Option value="falla">Falla</Option>
                      <Option value="garantia">Garantía</Option>
                      <Option value="mejora">Mejora</Option>
                      <Option value="no uso">No Uso</Option>
                    </Select>
                  )}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Empresa Proveedora">
                <Controller
                  name="empresa_proovedora"
                  control={control.control}
                  rules={{
                    required:
                      "Debe seleccionar la empresa proveedora del activo",
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Seleccione la empresa proveedora"
                      onSelect={getTercerosList}
                      onSearch={fetchTerceros}
                      filterOption={false}
                      showSearch
                    >
                      {filteredProvedores?.map((proveedor) => (
                        <Option key={proveedor.id} value={proveedor.id}>
                          {proveedor.nombre}
                        </Option>
                      ))}
                    </Select>
                  )}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Fecha">
                <Controller
                  name="fecha_creacion"
                  control={control.control}
                  rules={{ required: "Debe seleccionar la fecha" }}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      style={{ width: "100%" }}
                      format="YYYY-MM-DD"
                    />
                  )}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Precio">
                <Controller
                  name="precio"
                  control={control.control}
                  render={({ field }) => (
                    <InputNumber
                      {...field}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                      style={{ width: "100%" }}
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              {actionType === "crear" ? "Crear Solicitud" : "Editar Solicitud"}
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </StyledCard>
  );
};
