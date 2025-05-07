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
  Upload,
} from "antd";
import { SaveOutlined, InboxOutlined } from "@ant-design/icons";
import { Activos, UserData, Tercero, Mantenimiento } from "@/services/types";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { useParams, useNavigate } from "react-router-dom";
import { getActivos, getActivosBodegaEstado, getListaActivos } from "@/services/activos/activosAPI";
import { getUsuarios } from "@/services/maestras/usuariosAPI";
import { getTercerosList } from "@/services/admin-terceros/tercerosAPI";
import type { UploadFile, UploadProps } from "antd";
import { message } from "antd"; // Importa los componentes necesarios

import {
  crearMantenimiento,
  getMantenimiento,
  updateMantenimiento,
} from "@/services/activos/mantenimientoAPI";
import { RcFile } from "antd/es/upload";
import styled from "styled-components";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_BODEGA } from "@/config/api";
// import { crearDato } from "@/services/activos/datosAPI";
const { Option } = Select;

export const FormMantenimiento = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [actionType, setActionType] = useState<"crear" | "editar">("crear");
  const { id } = useParams<{ id: string }>(); // Obtener el ID de la URL
  const [activos, setActivos] = useState<Activos[]>([]);
  const [usuarios, setUsuarios] = useState<UserData[]>([]);
  const [terceros, setTerceros] = useState<Tercero[]>([]);
  //   const [filteredMantenimiento, setFilteredMantenimiento] = useState<Mantenimiento[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<UserData[]>([]);
  const [filteredActivos, setFilteredActivos] = useState<Activos[]>([]);
  const [filteredTerceros, setFilteredTerceros] = useState<Tercero[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { Dragger } = Upload;
  const { getSessionVariable } = useSessionStorage();


  const navigate = useNavigate();

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

  //controlador de acciones
  useEffect(() => {
    if (id) {
      setActionType("editar");
      fetchMantenimiento(Number(id)); // Convertir id a número
    } else {
      setActionType("crear");
      form.resetFields();
    }
  }, [id, form]);

  //traer los activos
  useEffect(() => {
    const estado = 1;
    const bodega = getSessionVariable(KEY_BODEGA);
    const bodegaN = Number(bodega);
    getActivosBodegaEstado(bodegaN, estado)
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

    getTercerosList()
      .then(({ data: { data } }) => {
        if (Array.isArray(data)) {
          setTerceros(data);
          setFilteredTerceros(data);
        } else {
          setTerceros([]);
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
  const fetchActivos = async (search = "") => {
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

  const fetchMantenimiento = async (id: number) => {
    try {
      const response = await getMantenimiento(id);
      const data = response.data;

      form.setFieldsValue({
        id_activo: data.activos?.nombre,
        fecha_mantenimiento: data.fecha_mantenimiento,
        tipo_mantenimiento: data.tipo_mantenimiento,
        descripcion_mantenimiento: data.descripcion_mantenimiento,
        id_tercero: data.tercero_info?.nombre,
        valor_mantenimiento: data.valor_mantenimiento,
        observacion_mantenimiento: data.observacion_mantenimiento,
        id_usuario: data.user_info?.nombre,
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Hubo un error al obtener los activos.",
      });
    }
  };

  const fetchTerceros = async (search = "") => {
    try {
      const response = await getTercerosList();
      setTerceros(response.data.data);
      setFilteredTerceros(response.data.data);

      const filtered = terceros.filter((tercero) =>
        tercero.nombre.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredTerceros(filtered);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Hubo un error al obtener los activos.",
      });
    }
  };

  const fetchUsuarios = async (search = "") => {
    try {
      const response = await getUsuarios();
      setUsuarios(response.data.data);
      setFilteredUsuarios(response.data.data);

      const filtered = usuarios.filter((usuario) =>
        usuario.nombre.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredUsuarios(filtered);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Hubo un error al obtener los usuarios.",
      });
    }
  };

  const onSearchTerceros = (value: string) => {
    fetchTerceros(value);
  };

  const onSearch = (value: string) => {
    fetchUsuarios(value); // Filtrar usuarios según la búsqueda
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

  const mapUserNamesToIds = (names: string[], usuario: UserData[]) => {
    return usuario
      .filter((usuario) => names.includes(usuario.nombre))
      .map((usuario) => usuario.id);
  };

  const mapTerceroToIds = (names: string[], terceros: Tercero[]) => {
    return terceros
      .filter((terceros) => names.includes(terceros.nombre))
      .map((terceros) => terceros.id);
  };

  const onFinish = async (values: any) => {
    setLoading(true);

    try {
      if (values.fecha_mantenimiento) {
        values.fecha_mantenimiento =
          values.fecha_mantenimiento.format("YYYY-MM-DD");
      }
      if (values.fecha_fin_mantenimiento) {
        values.fecha_fin_mantenimiento =
          values.fecha_fin_mantenimiento.format("YYYY-MM-DD");
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


      const usuariosIds = mapUserNamesToIds([values.id_usuario], usuarios);

      const tercerosId = mapTerceroToIds([values.id_tercero], terceros);

      let transformData: Mantenimiento = {
        ...values,
      };

      if (actionType === "editar") {
        transformData = {
          ...transformData,
          id_usuario:
            usuariosIds.length > 0
              ? usuariosIds[0]
              : isNaN(Number(transformData.id_usuario))
              ? transformData.id_usuario
              : Number(transformData.id_usuario),
          id_tercero:
            tercerosId.length > 0
              ? tercerosId[0]
              : isNaN(Number(transformData.id_tercero))
              ? transformData.id_tercero
              : Number(transformData.id_tercero),
        };
      }

      if (actionType === "crear") {
        await crearMantenimiento(formDataToSend)
          .then(() => {
            notification.success({
              message: "Éxito",
              description: "mantenimiento creado correctamente.",
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
            setFileList([]); // Limpiar la lista de archivos después de enviar el formulario
          });
      } else if (actionType === "editar" && id) {
        updateMantenimiento(Number(id), transformData)
          .then(() => {
            notification.success({
              message: "Éxito",
              description: "mantenimiento actualizado correctamente.",
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
      title={
        actionType === "crear" ? "CREAR MANTENIMIENTO" : "EDITAR MANTENIMIENTO"
      }
    >
      <Spin spinning={loading}>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Activo" name="id_activo">
                <Select
                  showSearch
                  placeholder="Seleccione el activo"
                  onSelect={(value) => getActivos(value)}
                  onSearch={onSearchActivos}
                  filterOption={false}
                >
                  {Array.isArray(filteredActivos) &&
                    filteredActivos.map((activo) => (
                      <Option key={activo.id} value={activo.id}>
                        {activo.nombre} - {activo.bodega_info.bod_nombre}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Fecha De Mantenimiento"
                name="fecha_mantenimiento"
              >
                <DatePicker />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Fecha Fin Del Mantenimiento"
                name="fecha_fin_mantenimiento"
              >
                <DatePicker />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Tipo De Mantenimiento"
                name="tipo_mantenimiento"
              >
                <Select placeholder="Seleccione el tipo de mantenimiento">
                  <Option value="preventivo">Preventivo</Option>
                  <Option value="obligatorio">Obligatorio</Option>
                  <Option value="correctivo">Correctivo</Option>
                  <Option value="extraordinario">Extraordinario</Option>

                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Descripcion Mantenimiento"
                name="descripcion_mantenimiento"
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Encargado Del Mantenimiento" name="id_terceros">
                <Select
                  placeholder="Seleccione El Tercero Encargado del Mantenimiento"
                  onSelect={() => getTercerosList()}
                  onSearch={onSearchTerceros}
                  filterOption={false}
                  disabled={actionType === "editar"}
                >
                  {Array.isArray(filteredTerceros) &&
                    filteredTerceros.map((terceros) => (
                      <Option key={terceros.id} value={terceros.id}>
                        {terceros.nombre}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="valor Mantenimiento" name="valor_mantenimiento">
                <InputNumber
                  style={{ width: "100%" }}
                  step={"0.01"}
                  formatter={(value) => formatNumber(value)}
                  parser={(value) => parseNumber(value)}
                  // value={formatNumber(field.value)}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Observaciones Del Mantenimiento"
                name="observacion_mantenimiento"
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Usuario Encargado" name="id_usuario">
                <Select
                  showSearch
                  placeholder="Seleccione el usuario"
                  onSelect={() => getUsuarios()}
                  onSearch={onSearch}
                  filterOption={false}
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

            <Row>
              <CustomUploadListStyles>
                <Col span={12}>
                  {/* Mostrar el campo de carga de archivos solo si actionType es 'crear' */}
                  {actionType === "crear" && (
                    <Form.Item label="Archivo">
                      <Dragger {...uploadProps}>
                        <p className="ant-upload-drag-icon">
                          <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">
                          Click o arrastra un archivo al área para cargar
                        </p>
                        <p className="ant-upload-hint">
                          Solo se permiten imágenes (png, jpg, jpeg) o archivos
                          PDF.
                        </p>
                      </Dragger>
                    </Form.Item>
                  )}
                </Col>
              </CustomUploadListStyles>
            </Row>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              {actionType === "crear"
                ? "Crear Mantenimiento "
                : "Editar Mantenimiento"}
              Guardar
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </StyledCard>
  );
};
