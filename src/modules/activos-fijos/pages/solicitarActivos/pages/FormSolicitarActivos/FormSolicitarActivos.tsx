/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { useState, useEffect } from "react";
import {
  Button,
  Col,
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
  Categoria,
  SubCategoria,
  UserData,
  Bodega,
  SubLocalizacionArea,
  SolicitarActivos,
} from "@/services/types";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { useParams, useNavigate } from "react-router-dom";
import { getListaCategorias } from "@/services/activos/categoriaAPI";
import { getUsuarios } from "@/services/maestras/usuariosAPI";
import { getLocalidades } from "@/services/maestras/localidadesAPI";
import { getBodegas } from "@/services/maestras/bodegasAPI";
import { getListaSubLocalizacionArea } from "@/services/activos/subLocalizacionAreaAPI";
import { getListaSubCategorias } from "@/services/activos/subCategoriaAPI";
import { crearSolicitarActivos, getSolicitarActivo, updateSolicitarActivos } from "@/services/activos/solicitarActivosAPI";
import { fetchUserProfile } from "@/services/auth/authAPI";
// import { crearDato } from "@/services/activos/datosAPI";
const { Option } = Select;

export const FormSolicitarActivos = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [actionType, setActionType] = useState<"crear" | "editar">("crear");
  const { id } = useParams<{ id: string }>(); // Obtener el ID de la URL
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [subCategorias, setSubCategorias] = useState<SubCategoria[]>([]);
  const [usuario, setUsuarios] = useState<UserData[]>([]);
  const [localidades, setLocalidades] = useState<Bodega[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<UserData[]>([]);
  const [filteredBodegas, setFilteredBodegas] = useState<Bodega[]>([]);
  const [subLocalizacionArea, setSubLocalizacionArea] = useState<
    SubLocalizacionArea[]
  >([]);
  const [filteredSubLocalizacionArea, setFilteredSubLocalizacionArea] =
    useState<SubLocalizacionArea[]>([]);

  const navigate = useNavigate();
  const [idUsuarioFijo, setIdUsuarioFijo] = useState<number | null>(null);
  const [usuarioLogueado, setUsuarioLogueado] = useState<UserData | null>(null); // Nuevo estado para almacenar el usuario logueado


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
        const userLogueado = usuariosData.find(user => user.id === userId);
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
      fetchSolicitarActivos(Number(id)); // Convertir id a número
    } else {
      setActionType("crear");
      form.resetFields();
    }
  }, [id, form, idUsuarioFijo]);

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

    getListaSubCategorias()
      .then(({ data }) => {
        if (Array.isArray(data)) {
          setSubCategorias(data);
        } else {
          setSubCategorias([]);
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

    getListaSubLocalizacionArea()
      .then(({ data }) => {
        if (Array.isArray(data)) {
          setSubLocalizacionArea(data);
          setFilteredSubLocalizacionArea(data);
        } else {
          setSubLocalizacionArea([]);
          notification.error({
            message: "Error",
            description: "La respuesta de la API no es válida.",
          });
        }
      })
      .catch(() => {
        notification.error({
          message: "Error",
          description: "Hubo un error al obtener las areas",
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
  }, []);

  //cargar la lista de activos
  const fetchSolicitarActivos = async (id: number) => {
    try {
      const response = await getSolicitarActivo(id);
      const data = response.data;
      form.setFieldsValue({
        id_usuario: usuarioLogueado,
        nombre_solicitud: data.nombre_solicitud,
        descripcion: data.descripcion,
        id_localizacion: data.id_localizacion,
        id_area: data.id_area,
        id_categoria: data.id_categoria,
        id_subCategoria: data.id_subCategoria,
        cantidad: data.cantidad,
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Hubo un error al obtener los activos.",
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

  // const onSearch = (value: string) => {
  //   fetchUsuarios(value); // Filtrar usuarios según la búsqueda
  // };

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

  const fetchSubLocalizacioArea = async (search: string = "") => {
    try {
      const response = await getListaSubLocalizacionArea();
      setSubLocalizacionArea(response.data);
      setFilteredSubLocalizacionArea(response.data);

      const filtered = subLocalizacionArea.filter((subLocalizacionArea) =>
        subLocalizacionArea.descripcion
          .toLowerCase()
          .includes(search.toLowerCase())
      );
      setFilteredSubLocalizacionArea(filtered);
    } catch (error) {
      console.error("Error al obtener las areas", error);
    }
  };

  // const usuarioMap = usuario.reduce((map, usuario) => {
  //   map[Number(idUsuarioFijo)] = usuario.nombre; // Asegurarse de que la clave sea un 'number'
  //   return map;
  // }, {} as { [key: number]: string });



  const onFinish = async (values: any) => {
    setLoading(true);

    try {
      // Asegúrate de que el idUsuarioFijo y user_id están definidos
      if (idUsuarioFijo === null) {
        notification.error({
          message: "Error",
          description: "No se pudo determinar el usuario que realiza la solicitud.",
        });
        return;
      }

      // Asigna el idUsuarioFijo tanto a user_id como a id_usuario antes de enviar
      const data: SolicitarActivos = {
        ...values,
        user_id: idUsuarioFijo,
        id_usuario: idUsuarioFijo,
      };

      if (actionType === "crear") {
        await crearSolicitarActivos(data);
        notification.success({
          message: "Éxito",
          description: "Solicitud creada correctamente.",
        });
      } else if (actionType === "editar" && id) {
        await updateSolicitarActivos(Number(id), data);
        notification.success({
          message: "Éxito",
          description: "Solicitud actualizada correctamente.",
        });
      }

      navigate(".."); // Redirige a la lista de datos
    } catch (error) {
      const errorMessage = (error as Error).message || 'Error desconocido';
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
      title={actionType === "crear" ? "CREAR SOLICITUD" : "EDITAR SOLICITUD"}
    >
      <Spin spinning={loading}>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="activo a solicitar" name="nombre_solicitud" rules={[
                  { required: true, message: "Debe seleccionar un activo" },
                ]}>
                  <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Descripcion" name="descripcion" rules={[
                  { required: true, message: "Debe digitar una descripcion" },
                ]}>
                  <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Empleado Que Solicita" name="id_usuario">
                    <Select
                      showSearch
                      placeholder="Seleccione el usuario"
                      onSearch={fetchUsuarios}
                      filterOption={false}
                      value={usuarioLogueado ? usuarioLogueado.id : undefined} // Asigna el ID del usuario logueado si está disponible
                      defaultValue={idUsuarioFijo} // Preconfigura el valor con el ID del usuario
                      disabled // Desactiva el campo para evitar cambios
                    >
                      {Array.isArray(filteredUsuarios) &&
                        filteredUsuarios.map((usuario) => (
                          <Option key={usuario.id} value={usuario.id}>
                            {usuario.nombre}
                          </Option>
                        ))}
                    </Select>
                
              </Form.Item>
            </Col>


            <Col span={12}>
              <Form.Item label="localizacion Del Empleado" name ="id_localizacion" rules={[
                  { required: true, message: "Debe seleccionar la localizacion del empleado" },
                ]}>
                    <Select
                      placeholder="seleccione la localizacion"
                      onSelect={() => getLocalidades()}
                      onSearch={fetchBodegas}
                      filterOption={false}
                      showSearch
                    >
                      {Array.isArray(filteredBodegas) &&
                        filteredBodegas.map((localidad) => (
                          <Option key={localidad.id} value={localidad.id}>
                            {localidad.bod_nombre}
                          </Option>
                        ))}
                    </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Area" name = "id_area" rules={[
                  { required: true, message: "Debe seleccionar un area" },
                ]}>
                    <Select
                      placeholder="seleccione el area"
                      onSelect={() => getListaSubLocalizacionArea()}
                      onSearch={fetchSubLocalizacioArea}
                      filterOption={false}
                      showSearch
                    >
                      {Array.isArray(filteredSubLocalizacionArea) &&
                        filteredSubLocalizacionArea.map((area) => (
                          <Option key={area.id} value={area.id}>
                            {area.descripcion}
                          </Option>
                        ))}
                    </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Categoría" name="id_categoria" rules={[
                  { required: true, message: "Debe seleccionar una categoria " },
                ]}>
                    <Select
                      placeholder="Selecciona la categoría"
                      onSelect={(value) => value}
                    >
                      {Array.isArray(categorias) &&
                        categorias.map((categoria) => (
                          <Option key={categoria.id} value={categoria.id}>
                            {categoria.descripcion}
                          </Option>
                        ))}
                    </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Subcategoría" name= "id_subCategoria" rules={[
                  { required: true, message: "Debe seleccionar una subcategoria" },
                ]}>
                    <Select
                      placeholder="Selecciona la Sub Categoría"
                      onSelect={(value) => value}
                    >
                      {Array.isArray(subCategorias) &&
                        subCategorias.map((SubCategoria) => (
                          <Option key={SubCategoria.id} value={SubCategoria.id}>
                            {SubCategoria.descripcion}
                          </Option>
                        ))}
                    </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="cantidad" name="cantidad" rules={[
                  { required: true, message: "Debe seleccionar una cantidad" },
                ]}>
              <InputNumber/>
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
