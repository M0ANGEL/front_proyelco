/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable react-hooks/exhaustive-deps */
 import { useState, useEffect } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  notification,
  Row,
  Select,
  Spin,
} from "antd";
import { SaveOutlined } from "@ant-design/icons";
import {
  Categoria,
  Activos,
  UserData,
  Bodega,
  TrasladosActivos,
} from "@/services/types";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { useParams, useNavigate } from "react-router-dom";
import {
  getActivosBodegaEstado,
  getListaActivos,
} from "@/services/activos/activosAPI";
import { getListaCategorias } from "@/services/activos/categoriaAPI";
import { getUsuarios } from "@/services/maestras/usuariosAPI";
import { getBodegas } from "@/services/maestras/bodegasAPI";
import {
  crearTrasladosActivos,
  getTrasladosActivos,
  updateTrasladosActivos,
} from "@/services/activos/trasladosActivosAPI";
import { KEY_BODEGA } from "@/config/api";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { fetchUserProfile } from "@/services/auth/authAPI";
// import { crearDato } from "@/services/activos/datosAPI";
const { Option } = Select;

export const FormTranslados = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [actionType, setActionType] = useState<"crear" | "editar">("crear");
  const { id } = useParams<{ id: string }>(); // Obtener el ID de la URL
  const [, setCategorias] = useState<Categoria[]>([]);
  const [usuario, setUsuarios] = useState<UserData[]>([]);
  const [localidades, setLocalidades] = useState<Bodega[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<UserData[]>([]);
  const [filteredBodegas, setFilteredBodegas] = useState<Bodega[]>([]);
  const [activos, setActivos] = useState<Activos[]>([]);
  const [filteredActivos, setFilteredActivos] = useState<Activos[]>([]);
  const { getSessionVariable } = useSessionStorage();
  const bodegaId = Number(getSessionVariable(KEY_BODEGA));
  

  const navigate = useNavigate();

  //controlador de acciones
  useEffect(() => {
    if (id) {
      setActionType("editar");
      fetchTraslados(Number(id)); // Convertir id a número
    } else {
      setActionType("crear");
      form.resetFields();
    }
  }, [id, form]);

  //traer las categorias
  useEffect(() => {
    getListaCategorias()
      .then(({ data }) => {
        if (Array.isArray(data)) {
          setCategorias(data);
        } else {
          setCategorias([]);
          notification.error({
            message: "Error",
            description: "La respuesta de la API no es válida.",
          });
        }
      })
      .catch(() => {
        notification.error({
          message: "Error",
          description: "Hubo un error al obtener las Categorias.",
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

    getBodegas()
      .then(({ data: { data } }) => {
        if (Array.isArray(data)) {
          setLocalidades(data);
          setFilteredBodegas(data);
        } else {
          setLocalidades([]);
          notification.error({
            message: "Error",
            description: "La respuesta de la API no es válida.",
          });
        }
      })
      .catch(() => {
        notification.error({
          message: "Error",
          description: "Hubo un error al obtener las localidades.",
        });
      });
    const bodega = getSessionVariable(KEY_BODEGA);
    const bodegaN = Number(bodega);
    const estado = 1;
    getActivosBodegaEstado(bodegaN,estado)
      .then(({ data }) => {
        if (Array.isArray(data)) {
          setActivos(data);
          setFilteredActivos(data);
        } else {
          setActivos([]);
          notification.error({
            message: "Error",
            description: "La respuesta de la API no es válida.",
          });
        }
      })
      .catch(() => {
        notification.error({
          message: "Error",
          description: "Hubo un error al obtener las Categorias.",
        });
      });
  }, []);

  const localizacionMap = localidades.reduce((map, localidad) => {
    map[localidad.id] = localidad.bod_nombre;
    return map;
  }, {} as { [key: number]: string });

  //cargar la lista de activos
  const fetchActivos = async (search: string = "") => {
    try {
      const response = await getListaActivos();
      setActivos(response.data);
      setFilteredActivos(response.data);

      const filtered = activos.filter((activo) =>
        activo.nombre.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredActivos(filtered);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Hubo un error al obtener los activos.",
      });
    }
  };

  const fetchTraslados = async (id: number) => {
    try {
      const response = await getTrasladosActivos(id);
      const data = response.data;

      form.setFieldsValue({
        id_activo: [data.activo.nombre, data.activo.id],
        descripcion: data.descripcion,
        bodega_destino: [data.bodega_destino_info.bod_nombre, data.bodega_destino],
        user_destino: [data.user_destino_info.nombre, data.user_destino],
        user_origen: data.user_origen ,
        estado: data.estado || "",
        bodega_origen: bodegaId || "",
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Hubo un error al obtener los mantenimientos.",
      });
    }
  };

  const fetchUsuarios = async (search: string = "") => {
    try {
      const response = await getUsuarios();
      setUsuarios(response.data.data);
      setFilteredUsuarios(response.data.data);

      const filtered = usuario.filter((usuario) =>
        usuario.nombre.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredUsuarios(filtered);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const onSearch = (value: string) => {
    fetchUsuarios(value); // Filtrar usuarios según la búsqueda
  };

  const fetchBodegas = async (search: string = "") => {
    try {
      const response = await getBodegas();
      setLocalidades(response.data.data);
      setFilteredBodegas(response.data.data);

      const filtered = localidades.filter((localidades) =>
        localidades.bod_nombre.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredBodegas(filtered);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const onSearchActivos = (value: string) => {
    fetchActivos(value);
  };

  const onSearchBodegas = (value: string) => {
    fetchBodegas(value);
  };

  const bodegaNombre = localizacionMap[bodegaId];

  const onFinish = async (values: any) => {
    setLoading(true);

    try {
      const fechaTraslado = new Date(); // Fecha actual
      const data: TrasladosActivos = {
        ...values,
        fecha_traslado: fechaTraslado.toISOString(),
        bodega_origen: bodegaId,
      };


      if (actionType === "crear") {
        const response = await fetchUserProfile();
        const userId = response.data.userData.id;

        await crearTrasladosActivos(data, userId)
          .then(() => {
            notification.success({
              message: "Éxito",
              description: "traslado creado correctamente.",
            });
            navigate(".."); // Redirige a la lista de datos
          })
          .catch((error: { message: any }) => {
            notification.error({
              message: "Error",
              description: error.message,
            });
          })
          .finally(() => {
            setLoading(false);
            form.resetFields();
          });
      } else if (actionType === "editar" && id) {
        const response = await fetchUserProfile();
        const userId = response.data.userData.id;
        updateTrasladosActivos(Number(id), data, userId)
          .then(() => {
            notification.success({
              message: "Éxito",
              description: "Traslado actualizado correctamente.",
            });
            navigate(".."); // Redirige a la lista de datos
          })
          .catch((error: { message: any }) => {
            notification.error({
              message: "Error",
              description: error.message,
            });
          })
          .finally(() => {
            setLoading(false);
            form.resetFields();
          });
      }
    } catch (error) {
      // Manejo del error con tipo desconocido
      const errorMessage = (error as Error).message || "Error desconocido";
      notification.error({
        message: "Error",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
      form.resetFields();
    }
  };

  return (
    <StyledCard
      title={actionType === "crear" ? "CREAR TRASLADO" : "EDITAR TRASLADO"}
    >
      <Spin spinning={loading}>
        <Form
          layout="vertical"
          form={form}
          autoComplete="off"
          onFinish={onFinish}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Activo"
                name="id_activo"
                rules={[
                  { required: true, message: "Debe seleccionar un activo" },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Seleccione el activo"
                  onSearch={onSearchActivos}
                  filterOption={false}
                >
                  {filteredActivos.map((activo) => (
                    <Option key={activo.id} value={activo.id}>
                      {`${activo.nombre} - ${activo.bodega_info.bod_nombre} - id : ${activo.id}`}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Motivo Traslado"
                name="descripcion"
                rules={[{ required: true, message: "Debe digitar un motivo" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Sede Origen" name="bodega_origen">
                <Select
                  placeholder="Seleccione la localización"
                  value={bodegaId}
                  disabled
                  defaultValue={bodegaId}
                >
                  <Option value={bodegaId}>{bodegaNombre}</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Sede Destino"
                name="bodega_destino"
                rules={[
                  {
                    required: true,
                    message: "Debe digitar el destino del activo",
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Seleccione la localización"
                  onSearch={onSearchBodegas}
                  filterOption={false}
                >
                  {filteredBodegas.map((bodega) => (
                    <Option key={bodega.id} value={bodega.id}>
                      {bodega.bod_nombre}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
  <Form.Item
    label="Usuario Encargado"
    name="user_origen"
    rules={[
      {
        required: true,
        message: "Debe seleccionar al menos un usuario encargado del traslado",
      },
    ]}
  >
    <Select
      mode="multiple" // Permite seleccionar múltiples opciones
      showSearch
      placeholder="Seleccione los usuarios"
      onSearch={onSearch}
      filterOption={false}
      optionFilterProp="children"
    >
      {filteredUsuarios.map((usuario) => (
        <Select.Option key={usuario.id} value={usuario.id}>
          {usuario.nombre}
        </Select.Option>
      ))}
    </Select>
  </Form.Item>
</Col>


<Col span={12}>
  <Form.Item
    label="Usuario Que Recibe"
    name="user_destino"
    rules={[
      {
        required: true,
        message: "Debe seleccionar al menos un usuario que recibe el traslado",
      },
    ]}
  >
    <Select
      mode="multiple" // Permite seleccionar múltiples opciones
      showSearch
      placeholder="Seleccione los usuarios"
      onSearch={onSearch}
      filterOption={false}
      optionFilterProp="children"
    >
      {filteredUsuarios.map((usuario) => (
        <Select.Option key={usuario.id} value={usuario.id}>
          {usuario.nombre}
        </Select.Option>
      ))}
    </Select>
  </Form.Item>
</Col>

            <Col span={12}>
              <Form.Item
                label="Observacion Traslado"
                name="observacion"
                rules={[{ required: true, message: "Debe digitar una observacion" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              {actionType === "crear" ? "Crear Traslado" : "Editar Traslado "}
              Guardar
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </StyledCard>
  );
};
