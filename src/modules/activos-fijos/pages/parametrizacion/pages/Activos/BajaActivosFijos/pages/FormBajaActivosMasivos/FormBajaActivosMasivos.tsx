import { useState, useEffect } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  notification,
  Row,
  Select,
  Spin,
  UploadFile,
  UploadProps,
} from "antd";
import { SaveOutlined, InboxOutlined } from "@ant-design/icons";
import { UserData, Activos, BajaActivosFijos } from "@/services/types";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { useParams, useNavigate } from "react-router-dom";
import { getUsuarios } from "@/services/maestras/usuariosAPI";
import { fetchUserProfile } from "@/services/auth/authAPI";
import { KEY_BODEGA } from "@/config/api";
import {
  getActivosBodegaEstadoPropiedad,
  getListaActivos,
} from "@/services/activos/activosAPI";
import {
  crearBajaActivosFijos,
  getBajaActivosFijos,
  updateBajaActivosFijos,
} from "@/services/activos/BajaActivosFijosAPI";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import Dragger from "antd/es/upload/Dragger";
import styled from "styled-components";
import Upload, { RcFile } from "antd/es/upload";
// import { crearDato } from "@/services/activos/datosAPI";
const { Option } = Select;

export const FormBajaActivosMasivos = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [actionType, setActionType] = useState<"crear" | "editar">("crear");
  const { id } = useParams<{ id: string }>(); // Obtener el ID de la URL
  const [usuario, setUsuarios] = useState<UserData[]>([]);
  const [, setFilteredUsuarios] = useState<UserData[]>([]);
  const [activos, setActivos] = useState<Activos[]>([]);
  const [filteredActivos, setFilteredActivos] = useState<Activos[]>([]);
  const { getSessionVariable } = useSessionStorage();
  const [selectedMotivo, setSelectedMotivo] = useState<string | null>(null);

  const navigate = useNavigate();
  const [idUsuarioFijo, setIdUsuarioFijo] = useState<number | null>(null);
  const [usuarioLogueado, setUsuarioLogueado] = useState<UserData | null>(null); // Nuevo estado para almacenar el usuario logueado
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const CustomUploadListStyles = styled.div`
    .ant-upload-list-item {
      background-color: #f9f9f9; /* Fondo claro para mayor contraste */
      border: 1px solid #d9d9d9;
      padding: 8px;
      border-radius: 4px;
      margin: 5px 0;
    }

    /* Estilo específico para el nombre del archivo */
    .ant-upload-list-item-name {
      color: #000000 !important; /* Asegura que el color del texto sea negro */
      font-size: 12px; /* Tamaño de fuente */
      font-weight: bold; /* Negrita para destacar */
      overflow: visible !important; /* Evita que el nombre se oculte */
      white-space: nowrap; /* Evita que el nombre se divida en varias líneas */
      text-overflow: ellipsis; /* Si es muy largo, mostrar puntos suspensivos */
      max-width: 100%; /* Asegura que el nombre no se recorte */
    }

    .ant-upload-list-item:hover .ant-upload-list-item-name {
      color: #1890ff; /* Cambia el color al pasar el mouse */
    }
  `;

  const handleUpload: UploadProps["onChange"] = (info) => {
    // Almacenar el arreglo de archivos en el estado
    setFileList(info.fileList);
  };

  const uploadProps: UploadProps = {
    name: "file",
    multiple: true,
    accept: ".png,.jpg,.jpeg,.pdf",
    fileList,
    onChange: handleUpload,
    showUploadList: {
      showRemoveIcon: true,
    },
    listType: "text",
    beforeUpload: (file: RcFile) => {
      const isImageOrPDF =
        file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.type === "application/pdf";
      if (!isImageOrPDF) {
        message.error("Solo se pueden cargar imágenes o archivos PDF.");
        return Upload.LIST_IGNORE;
      }
      setFileList((prevFileList) => [
        ...prevFileList,
        {
          ...file,
          name: file.name,
          uid: file.uid,
          status: "done",
        } as UploadFile,
      ]);
      return false;
    },
    onRemove: (file: UploadFile) => {
      setFileList((prevFileList) =>
        prevFileList.filter((f) => f.uid !== file.uid)
      );
    },
  };

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
      } catch (error) {
        notification.error({
          message: "Error",
          description: "Hubo un error al obtener el perfil del usuario.",
        });
      }
    };

    let bodega = getSessionVariable(KEY_BODEGA);
    let bodegaN = Number(bodega);
    let estado = 1;
    let estado_propiedad =1;
    getActivosBodegaEstadoPropiedad(bodegaN, estado, estado_propiedad)
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

    fetchUserId();
  }, []);

  //controlador de acciones
  useEffect(() => {
    if (id) {
      setActionType("editar");
      fetchBajaActivos(Number(id)); // Convertir id a número
    } else {
      setActionType("crear");
      form.resetFields();
    }
  }, [id, form]);

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

  const fetchBajaActivos = async (id: number) => {
    try {
      const response = await getBajaActivosFijos(id);
      const data = response.data;
      form.setFieldsValue({
        id_activo: data.id_activo,
        descripcion: data.descripcion,
        id_usuario : data.id_usuario,
        motivo: data.motivo,
        empresa_venta: data.empresa_venta,
        empresa_chatarra : data.empresa_chatarra,
        empresa_donacion : data.empresa_donacion,
        precio_venta :data.precio_venta,
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

  const handleMotivoChange = (value: string) => {
    setSelectedMotivo(value); // Actualiza el motivo seleccionado
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

      const formDataToSend = new FormData();
      fileList.forEach(
        (file) =>
          file.originFileObj &&
          formDataToSend.append("files[]", file.originFileObj as File)
      );
      Object.keys(values).forEach(
        (key) =>
          values[key] !== undefined && formDataToSend.append(key, values[key])
      );


      // Asigna el idUsuarioFijo tanto a user_id como a id_usuario antes de enviar
      const data: BajaActivosFijos = {
        ...values,
        id_usuario: idUsuarioFijo,
      };

      const response = await fetchUserProfile();
      const id_usuario = response.data.userData.id;

      if (actionType === "crear") {
        await crearBajaActivosFijos(formDataToSend, id_usuario);
        notification.success({
          message: "Éxito",
          description: "Solicitud creada correctamente.",
        });
      } else if (actionType === "editar" && id) {
        await updateBajaActivosFijos(Number(id), data, id_usuario);
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

  const onSearchActivos = (value: string) => {
    fetchActivos(value);
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

  return (
    <StyledCard
      title={
        actionType === "crear"
          ? "CREAR BAJA DE ACTIVO"
          : "EDITAR BAJA DE ACTIVO"
      }
    >
      <Spin spinning={loading}>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Activo"
                name="id_activo"
                rules={[
                  {
                    required: true,
                    message: "Debe seleccionar al menos un activo",
                  },
                ]}
              >
                <Select
                  mode="multiple" // Permite la selección múltiple
                  showSearch
                  placeholder="Seleccione los activos"
                  onSearch={onSearchActivos}
                  filterOption={false}
                >
                {Array.isArray(filteredActivos) &&
                  filteredActivos.map((activo) => (
                    <Option key={activo.id} value={activo.id}>
                      {`${activo.nombre} - ${activo.bodega_info.bod_nombre}`}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Descripcion"
                name="descripcion"
                rules={[
                  { required: true, message: "Debe digitar una descripcion" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Empleado Que Solicita"
                name="id_usuario"
                rules={[
                  { required: true, message: "Este campo es obligatorio" },
                ]}
                initialValue={idUsuarioFijo} // Valor inicial del formulario
              >
                <Select
                  defaultValue={idUsuarioFijo}
                  value={idUsuarioFijo}
                  showSearch
                  placeholder="Seleccione el usuario"
                  onSearch={fetchUsuarios}
                  filterOption={false}
                  // disabled // Desactiva el campo para evitar cambios
                >
                  <Option value={idUsuarioFijo}>
                    {usuarioLogueado?.nombre}
                  </Option>
                </Select>
              </Form.Item>
            </Col>

            <Col>
              <Row>
                <CustomUploadListStyles>
                  <Col span={24} style={{ width: "100%" }}>
                    {/* Mostrar el campo de carga de archivos solo si actionType es 'crear' */}
                    {actionType === "crear" && (
                      <Form.Item label="Archivo" style={{ width: "100%" }}>
                        <Dragger
                          {...uploadProps}
                          style={{
                            width: "100%", // Hacer que el contenedor del Dragger ocupe todo el ancho disponible
                            minHeight: "180px", // Ajustar la altura mínima del Dragger
                            padding: "2px", // Ajustar el padding si es necesario
                          }}
                        >
                          <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                          </p>
                          <p className="ant-upload-text">
                            Click o arrastra un archivo al área para cargar
                          </p>
                          <p className="ant-upload-hint">
                            Solo se permiten imágenes (png, jpg, jpeg) o
                            archivos PDF.
                          </p>
                        </Dragger>
                      </Form.Item>
                    )}
                  </Col>
                </CustomUploadListStyles>
              </Row>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Motivo Baja Activo"
                name="motivo"
                rules={[
                  { required: true, message: "Debe seleccionar un motivo" },
                ]}
              >
                <Select
                  placeholder="Seleccione un motivo"
                  onChange={handleMotivoChange}
                >
                  <Option value="chatarra">Chatarra</Option>
                  <Option value="venta">Venta</Option>
                  <Option value="donacion">Donación</Option>
                </Select>
              </Form.Item>
            </Col>

            {selectedMotivo === "venta" && (
              <>
                <Col span={12}>
                  <Form.Item
                    label="Valor Venta"
                    name="precio_venta"
                    rules={[
                      {
                        required: true,
                        message: "Debe ingresar el valor de venta",
                      },
                    ]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      step={"0.01"}
                      formatter={(value) => formatNumber(value)}
                      parser={(value) => parseNumber(value)}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label="Comprador / empresa venta"
                    name="empresa_venta"
                    rules={[
                      {
                        required: true,
                        message: "Debe ingresar el nombre del comprador",
                      },
                    ]}
                  >
                    <Input placeholder="Ingrese el nombre del comprador" />
                  </Form.Item>
                </Col>
              </>
            )}

            {selectedMotivo === "donacion" && (
              <>
                <Col span={12}>
                  <Form.Item
                    label="Donado a : "
                    name="empresa_donacion"
                    rules={[
                      {
                        required: true,
                        message:
                          "Debe ingresar el nombre de la empresa a donar",
                      },
                    ]}
                  >
                    <Input placeholder="Ingrese el nombre de la empresa a donar" />
                  </Form.Item>
                </Col>
              </>
            )}

            {selectedMotivo === "chatarra" && (
              <>
                <Col span={12}>
                  <Form.Item
                    label="Empresa encargada de chatarra : "
                    name="empresa_chatarra"
                    rules={[
                      {
                        required: true,
                        message:
                          "Debe ingresar el nombre de la empresa donde se enviara a chatarra",
                      },
                    ]}
                  >
                    <Input placeholder="Ingrese el nombre de la empresa donde se enviara a chatarra" />
                  </Form.Item>
                </Col>
              </>
            )}
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
