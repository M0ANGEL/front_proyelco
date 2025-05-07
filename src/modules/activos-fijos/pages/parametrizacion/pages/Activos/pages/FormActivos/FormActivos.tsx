/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  notification,
  Row,
  Select,
  Spin,
  UploadProps,
  Typography,
  Switch,
} from "antd";
import { SaveOutlined } from "@ant-design/icons";
import {
  Categoria,
  SubCategoria,
  Activos,
  Bodega,
  Parametros_SubCategoria,
  DatosCrear,
  SubLocalizacionArea,
} from "@/services/types";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { useParams, useNavigate } from "react-router-dom";
import {
  crearActivo,
  getActivos,
  getUsuariosLista,
  updateActivo,
} from "@/services/activos/activosAPI";
import {
  getListaCategoriasActivas,
  getListaSubcategoriasxCategorias,
} from "@/services/activos/categoriaAPI";
import {
  getListaParametrosxSubCategorias,
  getListaSubCategoriasActivas,
} from "@/services/activos/subCategoriaAPI";
import { getLocalidades } from "@/services/maestras/localidadesAPI";
import { getBodegas } from "@/services/maestras/bodegasAPI";
import { getListaSubLocalizacionArea } from "@/services/activos/subLocalizacionAreaAPI";
import { fetchUserProfile } from "@/services/auth/authAPI";
import Dragger from "antd/es/upload/Dragger";
import Upload, { RcFile, UploadFile } from "antd/es/upload";
import { getListaParametrosSubCategoriasActivas } from "@/services/activos/Parametros_SubCategoriaAPI";
import { Controller, useForm } from "react-hook-form";
import { CustomUploadListStyles } from "./styled";
import dayjs from "dayjs";
import { User } from "@/modules/admin-usuarios/pages/usuarios/types";
// import { crearDato } from "@/services/activos/datosAPI";

const { Option } = Select;
const { Text } = Typography;

export const FormActivos = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [actionType, setActionType] = useState<"crear" | "editar">("crear");
  const { id } = useParams<{ id: string }>();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [subCategorias, setSubCategorias] = useState<SubCategoria[]>([]);

  const [, setSubCategoriasNormales] = useState<SubCategoria[]>([]);

  const [usuario, setUsuarios] = useState<User[]>([]);
  const [localidades, setLocalidades] = useState<Bodega[]>([]);
  const [parametro_sub_categoria, setParametro_SubCategorias] = useState<
    Parametros_SubCategoria[]
  >([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<User[]>([]);
  const [filteredBodegas, setFilteredBodegas] = useState<Bodega[]>([]);
  const [subLocalizacionArea, setSubLocalizacionArea] = useState<
    SubLocalizacionArea[]
  >([]);
  const [filteredSubLocalizacionArea, setFilteredSubLocalizacionArea] =
    useState<SubLocalizacionArea[]>([]);

  const [fileListFactura, setFileListFactura] = useState<UploadFile[]>([]);
  const [fileListImagenes, setFileListImagenes] = useState<UploadFile[]>([]);

  const [filteredSubCategorias, setFilteredSubCategorias] = useState<
    SubCategoria[]
  >([]);

  const [FilteredCategorias, setFilteredCategorias] = useState<Categoria[]>([]);

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const control = useForm();

  const estadoPropiedad = control.watch("estado_propiedad", form);

  const watchEstadoPropiedad = control.watch("estado_propiedad");

  const watchCantidad = control.watch("cantidadCheck");

  //controlador de acciones
  useEffect(() => {
    if (id) {
      setActionType("editar");
      fetchActivos(Number(id));
    } else {
      setActionType("crear");
      form.resetFields();
    }
  }, [id, form]);

  //traer las categorias
  useEffect(() => {
    getListaCategoriasActivas()
      .then(({ data }) => {
        if (Array.isArray(data)) {
          setCategorias(data);
          setFilteredCategorias(data);
        } else {
          setCategorias([]);
          setFilteredCategorias([]);
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

    getUsuariosLista()
      .then(({ data }) => {
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

    getListaSubCategoriasActivas()
      .then(({ data }) => {
        if (Array.isArray(data)) {
          setSubCategoriasNormales(data);
          setFilteredSubCategorias(data);
        } else {
          setSubCategoriasNormales([]);
          setFilteredSubCategorias([]);
          notification.error({
            message: "Error",
            description: "error",
          });
        }
      })
      .catch(() => {
        notification.error({
          message: "Error",
          description: "Hubo un error al obtener las SubCategorias.",
        });
      });
  }, []);

  const handleUploadFactura: UploadProps["onChange"] = (info) => {
    setFileListFactura(info.fileList);
  };

  const handleUploadImagenes: UploadProps["onChange"] = (info) => {
    setFileListImagenes(info.fileList);
  };

  const uploadPropsFactura: UploadProps = {
    name: "factura",
    multiple: false, // Solo una factura
    accept: ".png,.jpg,.jpeg,.pdf",
    fileList: fileListFactura,
    onChange: handleUploadFactura,
    showUploadList: {
      showRemoveIcon: true,
    },
    listType: "text",
    beforeUpload: (file: RcFile) => {
      const isValidType =
        file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.type === "application/pdf";

      if (!isValidType) {
        message.error("Solo se pueden cargar imágenes o archivos PDF.");
        return Upload.LIST_IGNORE;
      }

      // Evitar duplicados
      if (fileListFactura.some((f) => f.name === file.name)) {
        message.warning("Este archivo ya ha sido agregado.");
        return Upload.LIST_IGNORE;
      }

      setFileListFactura([file]); // Solo permite un archivo a la vez
      return false;
    },
    onRemove: () => {
      setFileListFactura([]);
    },
  };

  const uploadPropsImagenes: UploadProps = {
    name: "imagenes",
    multiple: true, // Permite varias imágenes
    accept: ".png,.jpg,.jpeg",
    fileList: fileListImagenes,
    onChange: handleUploadImagenes,
    showUploadList: {
      showRemoveIcon: true,
    },
    listType: "picture",
    beforeUpload: (file: RcFile) => {
      const isValidType =
        file.type === "image/png" || file.type === "image/jpeg";

      if (!isValidType) {
        message.error("Solo se pueden cargar imágenes en formato PNG o JPEG.");
        return Upload.LIST_IGNORE;
      }

      // Evitar duplicados
      if (fileListImagenes.some((f) => f.name === file.name)) {
        message.warning("Esta imagen ya ha sido agregada.");
        return Upload.LIST_IGNORE;
      }

      setFileListImagenes((prev) => [
        ...prev,
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
      setFileListImagenes((prev) => prev.filter((f) => f.uid !== file.uid));
    },
  };

  const traerSubxCategoria = (id_categoria: number) => {
    getListaSubcategoriasxCategorias(id_categoria)
      .then(({ data: { data } }) => {
        if (Array.isArray(data)) {
          setSubCategorias(data);
          setFilteredSubCategorias(data);
        } else {
          setSubCategorias([]);
          setFilteredSubCategorias([]);
          notification.error({
            message: "Error",
            description: "La respuesta de la API no es válida.",
          });
        }
      })
      .catch(() => {
        notification.error({
          message: "Error",
          description: "Hubo un error al obtener las SubCategorias.",
        });
      });
  };

  const traerParametrosxSubcategorias = (id_subcategoria: number) => {
    getListaParametrosSubCategoriasActivas(id_subcategoria)
      .then(({ data }) => {
        if (Array.isArray(data)) {
          setParametro_SubCategorias(data);
        } else {
          setParametro_SubCategorias([]);
          notification.error({
            message: "Error",
            description: "La respuesta de la API no es válida.",
          });
        }
      })
      .catch(() => {
        notification.error({
          message: "Error",
          description: "Hubo un error al obtener las SubCategorias.",
        });
      });
  };

  //cargar la lista de activos
  const fetchActivos = async (id: number) => {
    try {
      const response = await getActivos(id);

      // Obtener parámetros por subcategorías
      getListaParametrosxSubCategorias(
        Number(response.data.data.id_subCategoria)
      ).then(({ data: { data } }) => {
        setParametro_SubCategorias(data);
      });

      const data = response.data;
      console.log("datica",data);

      control.reset({
        nombre: data.data.nombre,
        observaciones: data.data.observaciones,
        id_area: parseInt(data.data.id_area),
        localizacion: parseInt(data.data.localizacion),
        id_categoria: parseInt(data.data.id_categoria),
        id_subCategoria: parseInt(data.data.id_subCategoria),
        estado_propiedad: parseInt(data.data.estado_propiedad),
        fecha_compra: dayjs(data.data.fecha_compra),
        id_usuario: Array.isArray(data.data.id_usuario)
  ? data.data.id_usuario.map((id) => ({
      label: data.data.usuarios?.[Number(id)]?.nombre || `ID ${id}`, // Convertimos el ID a string para indexar
      value: Number(id),
    }))
  : typeof data.data.id_usuario === "string"
  ? JSON.parse(data.data.id_usuario).map((id: any) => ({
      label: data.data.usuarios?.[Number(id)]?.nombre || `ID ${id}`,
      value: Number(id),
    }))
  : [],

      

        valor_compra: data.data.valor_compra,
      });

      if (data.data.datos) {
        const parametrosValues: Record<string, any> = {};

        data.data.datos.forEach((dato: any) => {
          const descripcion =
            dato.parametro_sub_categoria.parametro.descripcion;
          if (dato.parametro_sub_categoria.parametro.tipo === "fecha") {
            parametrosValues[`parametro_${descripcion}`] = dayjs(
              dato.valor_almacenado
            );
          } else {
            parametrosValues[`parametro_${descripcion}`] =
              dato.valor_almacenado;
          }
        });

        control.reset({
          ...control.getValues(),
          ...parametrosValues,
        });
      }

      const cantidadValue =
        data.data.cantidad !== null && data.data.cantidad !== undefined
          ? data.data.cantidad
          : 1;

      control.reset({
        ...control.getValues(),
        cantidad: cantidadValue,
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
      const response = await getUsuariosLista();
      setUsuarios(response.data);
      setFilteredUsuarios(response.data);

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

  const fetchCategorias = async (search: string = "") => {
    try {
      const response = await getListaCategoriasActivas();
      setCategorias(response.data);
      setFilteredCategorias(response.data);

      const filtered = categorias.filter((categoria) =>
        categoria.descripcion.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredCategorias(filtered);
    } catch (error) {
      console.error("Error al obtener las areas", error);
    }
  };

  const fetchSubCategorias = async (search: string = "") => {
    try {
      const responde = await getListaSubCategoriasActivas();
      setSubCategoriasNormales(responde.data);
      setFilteredSubCategorias(responde.data);

      const filtered = subCategorias.filter((subca) =>
        subca.descripcion.toLowerCase().includes(search.toLowerCase())
      );

      setFilteredSubCategorias(filtered);
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
      // if (!fileList || fileList.length === 0 && estadoPropiedad !== 2) {
      //   notification.error({
      //     message: "Error",
      //     description: "Debe cargar una factura antes de continuar.",
      //   });
      //   setLoading(false);
      //   return;
      // }

      const datos: DatosCrear[] = parametro_sub_categoria.map((parametro) => ({
        id_parametro_subCategoria: parametro.id,
        valor_almacenado:
          values[`parametro_${parametro.parametro.descripcion}`] || "",
      }));

      const formDataToSend = new FormData();
      fileListFactura.forEach(
        (file) =>
          file.originFileObj &&
          formDataToSend.append("files[]", file.originFileObj as File)
      );
      Object.keys(values).forEach(
        (key) =>
          values[key] !== undefined && formDataToSend.append(key, values[key])
      );

      fileListImagenes.forEach(
        (file) =>
          file.originFileObj &&
          formDataToSend.append("filesImagenes[]", file.originFileObj as File)
      );
      Object.keys(values).forEach(
        (key) =>
          values[key] !== undefined && formDataToSend.append(key, values[key])
      );

      formDataToSend.append("datos", JSON.stringify(datos));

      const transformedData: Activos = {
        ...values,
        datos,
      };

      if (actionType === "crear") {
        const response = await fetchUserProfile();
        const userId = response.data.userData.id;
        await crearActivo(formDataToSend, userId)
          .then(() => {
            notification.success({
              message: "Éxito",
              description: "Activo creado correctamente.",
            });
            navigate("..");
          })
          .catch(({ response:{data:{message}}}: any) => {
            notification.error({
              message: "Alerta",
              description: message ,
            });
          })
          .finally(() => {
            setLoading(false);
            form.resetFields();
          });
      } else if (actionType === "editar" && id) {
        const response = await fetchUserProfile();
        const userId = response.data.userData.id;
        await updateActivo(Number(id), transformedData, userId)
          .then(() => {
            notification.success({
              message: "Éxito",
              description: "Activo actualizado correctamente.",
            });
            navigate("..");
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
      className="styled-card-documents"
      title={actionType === "crear" ? "CREAR ACTIVO" : "EDITAR ACTIVO"}
    >
      <Spin spinning={loading}>
        <Form
          layout="vertical"
          form={form}
          autoComplete="off"
          onFinish={control.handleSubmit(onFinish)}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Controller
                name="nombre"
                control={control.control}
                rules={{
                  required: {
                    value: true,
                    message: "Por favor digitar el nombre del activo",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <Form.Item required label="Nombre Activo" name="nombre">
                    <Input {...field} />
                    <Text type="danger">{error?.message}</Text>
                  </Form.Item>
                )}
              />
            </Col>

            <Col span={12}>
              <Controller
                name="observaciones"
                control={control.control}
                rules={{
                  required: {
                    value: true,
                    message: "Por favor digitar la observacion del activo",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <Form.Item required label="Observación" name="observaciones">
                    <Input {...field} />
                    <Text type="danger">{error?.message}</Text>
                  </Form.Item>
                )}
              />
            </Col>

            <Col span={12}>
              <Controller
                name="id_usuario"
                control={control.control}
                rules={{
                  required: {
                    value: actionType !== "editar", // Solo obligatorio si no es "editar"
                    message: "Por favor digitar el encargado del activo",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <Form.Item
                    required={actionType !== "editar"} // Marca el campo como requerido solo si no está en modo editar
                    label="Usuario Encargado"
                    name="id_usuario"
                  >
                    <Select
                      {...field}
                      mode="multiple" // Permite seleccionar varios usuarios
                      showSearch
                      placeholder="Seleccione el usuario"
                      onSearch={onSearch}
                      filterOption={false}
                      disabled={actionType === "editar"} // Desactiva el campo en modo editar
                      onChange={(value) => field.onChange(value)} // Guarda los valores como array
                    >
                      {Array.isArray(filteredUsuarios) &&
                        filteredUsuarios.map((usuario) => (
                          <Option key={usuario.id} value={usuario.id}>
                            {usuario.nombre}
                          </Option>
                        ))}
                    </Select>
                    <Text type="danger">{error?.message}</Text>
                  </Form.Item>
                )}
              />
            </Col>

            <Col span={12}>
              <Controller
                name="localizacion"
                control={control.control}
                rules={{
                  required: {
                    value: true,
                    message: "Por favor digite la ubicacion del activo",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <Form.Item required label="localizacion" name="localizacion">
                    <Select
                      {...field}
                      placeholder="seleccione la localizacion"
                      onSelect={() => getLocalidades()}
                      onSearch={fetchBodegas}
                      filterOption={false}
                      showSearch
                      disabled={actionType === "editar"}
                    >
                      {Array.isArray(filteredBodegas) &&
                        filteredBodegas.map((localidad) => (
                          <Option key={localidad.id} value={localidad.id}>
                            {[localidad.bod_nombre]}
                          </Option>
                        ))}
                    </Select>
                    <Text type="danger">{error?.message}</Text>
                  </Form.Item>
                )}
              />
            </Col>

            <Col span={12}>
              <Controller
                name="id_area"
                control={control.control}
                rules={{
                  required: {
                    value: true,
                    message: "Por favor digitar el area del activo",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <Form.Item required label="Area" name="id_area">
                    <Select
                      {...field}
                      placeholder="seleccione el area"
                      onSelect={() => getListaSubLocalizacionArea()}
                      onSearch={fetchSubLocalizacioArea}
                      filterOption={false}
                      showSearch
                      disabled={actionType === "editar"}
                    >
                      {Array.isArray(filteredSubLocalizacionArea) &&
                        filteredSubLocalizacionArea.map((area) => (
                          <Option key={area.id} value={area.id}>
                            {[area.descripcion]}
                          </Option>
                        ))}
                    </Select>
                    <Text type="danger">{error?.message}</Text>
                  </Form.Item>
                )}
              />
            </Col>

            <Col span={12}>
              <Controller
                name="id_categoria"
                control={control.control}
                rules={{
                  required: {
                    value: true,
                    message: "Por favor digitar la categoria del activo",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <Form.Item required label="Categoría" name="id_categoria">
                    <Select
                      showSearch
                      onSearch={fetchCategorias}
                      filterOption={false}
                      {...field}
                      placeholder="Selecciona la categoría"
                      onSelect={(value) => traerSubxCategoria(value)}
                      disabled={actionType === "editar"}
                    >
                      {Array.isArray(FilteredCategorias) &&
                        FilteredCategorias.map((categoria) => (
                          <Option key={categoria.id} value={categoria.id}>
                            {categoria.descripcion}
                          </Option>
                        ))}
                    </Select>
                    <Text type="danger">{error?.message}</Text>
                  </Form.Item>
                )}
              />
            </Col>

            <Col span={12}>
              <Controller
                name="id_subCategoria"
                control={control.control}
                rules={{
                  required: {
                    value: true,
                    message: "Por favor digitar la subcategoria del activo",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <Form.Item
                    required
                    label="Subcategoría"
                    name="id_subCategoria"
                  >
                    <Select
                      {...field}
                      placeholder="Selecciona la Sub Categoría"
                      showSearch
                      filterOption={false}
                      onSearch={fetchSubCategorias}
                      onSelect={(value) => traerParametrosxSubcategorias(value)}
                    >
                      {Array.isArray(filteredSubCategorias) &&
                        filteredSubCategorias.map((subCategoria) => (
                          <Option key={subCategoria.id} value={subCategoria.id}>
                            {subCategoria.descripcion}
                          </Option>
                        ))}
                    </Select>
                    <Text type="danger">{error?.message}</Text>
                  </Form.Item>
                )}
              />
            </Col>

            <Col span={12}>
              <Controller
                name="estado_propiedad"
                control={control.control}
                rules={{
                  required: {
                    value: true,
                    message: "Por favor escoger el estado de propiedad",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <Form.Item
                    required
                    label="Estado Propiedad"
                    name="estado_propiedad"
                  >
                    <Select
                      {...field}
                      placeholder="Seleccione el estado de propiedad"
                      options={[
                        { value: 1, label: "Propio" },
                        { value: 0, label: "Rentado" },
                        { value: 2, label: "Comodato" },
                      ]}
                    />
                    <Text type="danger">{error?.message}</Text>
                  </Form.Item>
                )}
              />
            </Col>

            <Col span={12}>
              <Controller
                name="cantidadCheck"
                control={control.control}
                render={({ field }) => (
                  <Form.Item label="Habilitar Cantidad">
                    <Switch
                      {...field}
                      checked={field.value}
                      style={{
                        backgroundColor: field.value ? "#52c41a" : "#d9d9d9",
                      }}
                    />
                  </Form.Item>
                )}
              />
            </Col>

            {watchCantidad && (
              <Col span={12}>
                <Controller
                  name="cantidad"
                  control={control.control}
                  rules={{
                    required: {
                      value: true,
                      message: "Por favor ingrese la cantidad",
                    },
                    min: {
                      value: 1,
                      message: "La cantidad debe ser al menos 1",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <Form.Item label="Cantidad">
                      <InputNumber
                        {...field}
                        placeholder="Ingrese la cantidad"
                        min={1}
                        style={{ width: "100%" }}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </Form.Item>
                  )}
                />
              </Col>
            )}
          </Row>

          <Row gutter={16}>
            {parametro_sub_categoria.map((parametro) => (
              <Col span={12}>
                <Form.Item
                  label={parametro.parametro.descripcion}
                  name={`parametro_${parametro.parametro.descripcion}`}
                >
                  <Controller
                    name={`parametro_${parametro.parametro.descripcion}`}
                    control={control.control}
                    rules={{
                      required: {
                        value: true,
                        message: `Por favor ingresa ${parametro.parametro.descripcion}`,
                      },
                    }}
                    render={({ field }) => {
                      switch (parametro.parametro.tipo) {
                        case "texto":
                          return <Input {...field} />;
                        case "numero":
                          return (
                            <InputNumber {...field} style={{ width: "100%" }} />
                          );
                        case "imagen":
                          return (
                            <Input {...field} type="file" accept="image/*" />
                          );
                        case "fecha":
                          return (
                            <DatePicker
                              {...field}
                              format="DD/MM/YYYY"
                              style={{ width: "100%" }}
                              onChange={(date) => field.onChange(date)} // Actualizar el valor en el control
                            />
                          );
                        case "pdf":
                          return (
                            <Input
                              {...field}
                              type="file"
                              accept="application/pdf"
                            />
                          );
                        default:
                          return <Input {...field} />;
                      }
                    }}
                  />
                </Form.Item>
              </Col>
            ))}
          </Row>

          <Row gutter={16}>
            {/* Campo: Fecha de Compra */}
            <Col span={12}>
              <Controller
                name="fecha_compra"
                control={control.control}
                rules={{
                  required: {
                    value: true,
                    message: "Por favor digitar la fecha de compra del activo",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <Form.Item
                    label={`Fecha de ${
                      watchEstadoPropiedad == 1 ? "Compra" : "Renta"
                    }`}
                    name="fecha_compra"
                  >
                    <DatePicker {...field} style={{ width: "100%" }} />
                    <Text type="danger">{error?.message}</Text>
                  </Form.Item>
                )}
              />
            </Col>

            <Col span={12}>
              <Controller
                name="valor_compra"
                control={control.control}
                rules={{
                  required: {
                    value: true,
                    message: "Por favor digitar el valor de compra del activo",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <Form.Item
                    required
                    label={`Valor Unitario ${
                      watchEstadoPropiedad == 1 ? "Compra" : "Renta"
                    } Activo`}
                    name="valor_compra"
                  >
                    <InputNumber
                      {...field}
                      style={{ width: "100%" }}
                      step={"0.01"}
                      formatter={(value) => formatNumber(value)}
                      parser={(value) => parseNumber(value)}
                    />
                    <Text type="danger">{error?.message}</Text>
                  </Form.Item>
                )}
              />
            </Col>

            <CustomUploadListStyles>
              <Col span={26}>
                {actionType === "crear" && estadoPropiedad !== 2 && (
                  <Form.Item
                    label="Factura"
                    rules={[
                      {
                        required: true,
                        message: "Por favor, sube una factura.",
                      },
                    ]}
                  >
                    <Dragger {...uploadPropsFactura}></Dragger>
                  </Form.Item>
                )}
              </Col>
            </CustomUploadListStyles>

            <Col span={12}>
              <CustomUploadListStyles>
                {actionType === "crear" && (
                  <Form.Item
                    label="Imágenes del Activo"
                    rules={[
                      {
                        required: true,
                        message: "Por favor, sube al menos una imagen.",
                      },
                    ]}
                  >
                    <Dragger {...uploadPropsImagenes}></Dragger>
                  </Form.Item>
                )}
              </CustomUploadListStyles>
            </Col>
          </Row>

          <Row>
            <Col span={8}>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                >
                  {actionType === "crear" ? "Crear Activo" : "Editar Activo"}
                  Guardar
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </StyledCard>
  );
};
