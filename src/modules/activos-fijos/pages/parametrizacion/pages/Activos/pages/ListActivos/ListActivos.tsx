/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  notification,
  Row,
  Col,
  Typography,
  Layout,
  Tooltip,
  Tag,
  Select,
  Upload,
  Space,
  Spin,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  SyncOutlined,
  HistoryOutlined,
  FallOutlined,
  DownloadOutlined,
  CloudServerOutlined,
  UploadOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import {
  Activos,
  Bodega,
  Categoria,
  Parametro,
  SubCategoria,
  SubLocalizacionArea,
} from "@/services/types"; // Importar la interfaz de Categoría
import { useNavigate } from "react-router-dom";
import {
  StyledCard,
  StyledFormItem,
} from "@/modules/common/layout/DashboardLayout/styled";
import {
  cargarAdjuntos,
  // crearActivosMasivos,
  deleteActivo,
  generateQr,
  getActivos,
  getActivosSinImagenes,
  getListaActivosPagination,
  getUsuariosLista,
  inactivateActivo,
} from "@/services/activos/activosAPI";
import ParametrosActivoModal from "../components/ParametrosActivoModal";
import { fetchUserProfile } from "@/services/auth/authAPI";
import { TrazabilidadActivosModal } from "../components/TrazabilidadActivosModal";
import {
  BlueButton,
  RedButton,
  GreenButton,
  PurpleButton,
} from "@/modules/common/components/ExportExcel/styled";
import { DepreciacionActivoModal } from "../components/DepreciacionActivoModal";
import { ButtonUpload } from "@/modules/documentos/pages/ventas/pages/dis/components/ListarDocumentos/styled";
import AdjuntosModal from "../components/AdjuntosModal";
import { TrazabilidadDepreciacionModal } from "../components/DesgasteDepreciacionModal";
// import { KEY_ROL } from "@/config/api";
// import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { InactivarActivoModal } from "../components/InactivarActivoModal";
import { PaginationActivos } from "./types";
import { StyledPanelFilterActivos } from "./style";
import { Controller, useForm } from "react-hook-form";
import Title from "antd/es/typography/Title";
import Form from "antd/es/form/Form";
import { getListaCategoriasActivas } from "@/services/activos/categoriaAPI";
import { getListaSubCategoriasActivas } from "@/services/activos/subCategoriaAPI";
import { getBodegas } from "@/services/maestras/bodegasAPI";
import { User } from "@/modules/admin-usuarios/pages/usuarios/types";
import { getListaSubLocalizacionArea } from "@/services/activos/subLocalizacionAreaAPI";
import { getListaParametrosActivas } from "@/services/activos/parametrosAPI";

const { Text } = Typography;

let timeout: ReturnType<typeof setTimeout> | null;

export const ListActivos = () => {
  const navigate = useNavigate();
  const [activos, setActivos] = useState<Activos[]>([]);
  const [loaderTable, setLoaderTable] = useState<boolean>(true);

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [subCategorias, setsubCategorias] = useState<SubCategoria[]>([]);
  const [bodegas, setBodegas] = useState<Bodega[]>([]);
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [subLocalizacionArea, setSubLocalizacionArea] = useState<
    SubLocalizacionArea[]
  >([]);

  const [parametros, setParametros] = useState<Parametro[]>([]);

  const [visible, setVisible] = useState(false);
  const [datos, setDatos] = useState<any[]>([]);
  const [, setLoading] = useState(false);
  const [loadingRow, setLoadingRow] = useState<any>([]);

  const [activoId, setActivoId] = useState<React.Key>();
  const [openModalTrazabilidad, setOpenModalTrazabilidad] =
    useState<boolean>(false);

  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [selectedActivoId, setSelectedActivoId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activoModalId, setActivoModalId] = useState<number | null>(null);
  const [openModalDepreciacion, setOpenModalDepreciacion] = useState(false);
  const [activosSinImagenes, setActivosSinImagenes] = useState<number[]>([]);
  useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // const { getSessionVariable } = useSessionStorage();
  // const rol = getSessionVariable(KEY_ROL);

  const [currentItemsPage, setCurrentItemsPage] = useState<number>(10);
  const [pagination, setPagination] = useState<PaginationActivos>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const control = useForm({});

  // const showInactivateModal = (id: number) => {
  //   setSelectedActivoId(id);
  //   setIsModalVisible(true);
  // };

  const handleInactivate = async (observacion: string) => {
    const response = await fetchUserProfile();
    const id_usuario = response.data?.userData?.id;

    if (!selectedActivoId) return;

    try {
      await inactivateActivo(selectedActivoId, id_usuario, observacion);
      notification.success({
        message: "Activo inactivado con éxito",
        duration: 4,
      });
      fetchActivos();
    } catch (error) {
      console.error("Error en inactivateActivo:", error);
      notification.error({ message: "Error al inactivar activo", duration: 4 });
    }

    setIsModalVisible(false);
  };

  const getAdjuntos = (id: number) => {
    setActivoModalId(id);
    setModalVisible(true);
  };

  const closeModalArchivos = () => {
    setModalVisible(false);
    setActivoModalId(null);
  };

  const abrirModalDepreciacion = (id: number) => {
    setActivoId(id);
    setOpenModalDepreciacion(true);
  };

  const fetchCategorias = async () => {
    try {
      const response = await getListaCategoriasActivas();
      setCategorias(response.data);
    } catch (error) {
      console.error("Error al obtener las areas", error);
    }
  };

  const fetchSubCategorias = async () => {
    try {
      const responde = await getListaSubCategoriasActivas();
      setsubCategorias(responde.data);
    } catch (error) {
      console.error("Error al obtener las areas", error);
    }
  };

  const fetchBodegas = async () => {
    try {
      const response = await getBodegas();
      setBodegas(response.data.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await getUsuariosLista();
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const fetchSubLocalizacioArea = async () => {
    try {
      const response = await getListaSubLocalizacionArea();
      setSubLocalizacionArea(response.data);
    } catch (error) {
      console.error("Error al obtener las areas", error);
    }
  };

  const fetchParametros = async () => {
    try {
      const response = await getListaParametrosActivas();
      setParametros(response.data);
    } catch (error) {
      console.error("Error al obtener las areas", error);
    }
  };

  useEffect(() => {
    fetchActivos();
  }, [currentPage]);

  useEffect(() => {
    fetchCategorias();
    fetchSubCategorias();
    fetchBodegas();
    fetchUsuarios();
    fetchSubLocalizacioArea();
    fetchParametros();
  }, []);

  //cargar Activos
  const fetchActivos = async (origen = "local") => {
    setLoaderTable(true);
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    const dataSend = {
      page: origen == "filtros" ? 1 : currentPage,
      paginate: currentItemsPage,
      data: control.getValues(),
    };
    timeout = setTimeout(async () => {
      try {
        const {
          data: { data },
        } = await getListaActivosPagination(dataSend);
        console.log(data);
        setActivos(data.data);
        setPagination(data);
      } catch (error) {
        notification.error({
          message: "Error",
        });
      } finally {
        setLoaderTable(false);
      }
    }, 800);
  };

  useEffect(() => {
    const fetchActivosSinImagenes = async () => {
      try {
        const response = await getActivosSinImagenes();

        if (response && response.data) {
          setActivosSinImagenes(response.data);
        } else {
          setActivosSinImagenes([]);
        }
      } catch (error) {
        console.error("Error al obtener activos sin imágenes:", error);
        setActivosSinImagenes([]);
      }
    };

    fetchActivosSinImagenes();
  }, []);

  //manejador de eliminacion
  const handleDelete = async (id: React.Key) => {
    setLoadingRow([...loadingRow, id]);
    const response = await fetchUserProfile();
    const userId = response.data.userData.id;

    deleteActivo(id, userId)
      .then(() => {
        notification.success({
          message: "Estado Actualizado",
          description: "Se ha cambiado el ESTADO del activo.",
        });
        fetchActivos(); // Refrescar la lista de activos
      })
      .catch((error) => {
        setLoadingRow([]);
        notification.error({
          message: "Error",
          description: error.message,
        });
      });
  };

  const handleViewDetails = async (id: number) => {
    setLoading(true);
    try {
      const response = await getActivos(id);
      if (response && response.data.data.datos) {
        setDatos(response.data.data.datos);

        // const ActivosMap = activos.reduce((map: any, activo: Activos) => {
        //   map[activo.id] = activo.nombre; // Asume que cada parámetro tiene un id y un nombre
        //   return map;
        // }, {});

        // const DatosMap = datos.reduce((map: any, datos: Datos)=>{
        //   map[datos.id] = datos.parametro_sub_categoria.id_parametro;
        //   return map;
        // })

        setVisible(true);
      } else {
        console.error("Datos no disponibles en la respuesta");
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "No se pudo obtener la información del activo.",
      });
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (value: any) => {
    if (value === null || value === undefined) {
      return "N/A";
    }

    const numericValue =
      typeof value === "string"
        ? parseFloat(value.replace(/[^\d.-]/g, ""))
        : value;

    // Validar si el valor convertido es un número válido
    if (!isNaN(numericValue)) {
      return numericValue.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0, // Sin decimales
      });
    }

    return value; // Si no es un número, devolver el valor original
  };

  const openModal = (id: number) => {
    setSelectedActivoId(id);
    setVisibleModal(true);
  };

  // Método para cerrar el modal
  const closeModal = () => {
    setVisibleModal(false);
  };

  const formatNumberNuevo = (
    value: Float32Array | undefined | number | string
  ) => {
    if (value === null || value === undefined) return "";

    // Si el valor es un Float32Array, toma el primer elemento
    const numberValue = Array.isArray(value)
      ? value[0]
      : typeof value === "number"
      ? value
      : Number(value);
    const flooredValue = Math.floor(numberValue);

    // Formatea el número
    return new Intl.NumberFormat("es-CO").format(flooredValue);
  };

  // const handleFileUpload = (file: File) => {
  //   cargaActivosMasivos(file);
  // };

  // const cargaActivosMasivos = async (file: File) => {

  //   const formData = new FormData();
  //   formData.append("archivo", file);

  //   const response = await fetchUserProfile();
  //   const userId = response.data.userData.id;
  //   crearActivosMasivos(formData);

  // };

  const handleFileChangeImages = async (file: File, activoModalId: number) => {
    const formData = new FormData();
    formData.append("imagen", file);
    formData.append("id", activoModalId.toString());

    setLoaderTable(true);

    try {
      const response = await cargarAdjuntos(formData, activoModalId);

      if (response.data?.status === "success") {
        notification.open({
          type: "success",
          message: `Archivo cargado con éxito!`,
        });
        fetchActivos(); // Refrescar la lista de activos
      } else {
        notification.open({
          type: "error",
          message: response.data.message || "Error al cargar el archivo.",
        });
      }
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const errores: string[] = Object.values(error.response.data.errors);
        for (const err of errores) {
          notification.open({
            type: "error",
            message: err,
            duration: 5,
          });
        }
      } else {
        notification.open({
          type: "error",
          message:
            error.response?.data?.message || "Error al cargar el archivo.",
          duration: 5,
        });
      }
    } finally {
      setLoaderTable(false);
    }
  };

  // const onFinish = (data: any) => {
  //   fetchActivos(data);
  // };

  const columns: ColumnsType<Activos> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      align: "center",
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "Observaciones",
      dataIndex: "observaciones",
      key: "observaciones",
      width: 130,
    },

    {
      title: "Usuario",
      dataIndex: "usuarios",
      key: "usuarios",
      width: 200,
      render: (usuarios?: { nombre: string }[]) => (
        <span>
          {usuarios?.map((usuario, index) => (
            <div key={index}>
              {usuario.nombre}
              {index !== usuarios.length - 1 && <div></div>}
            </div>
          )) || "N/A"}
        </span>
      ),
    },
    {
      title: "Localizacion",
      dataIndex: "bodega_info",
      key: "bodega_info",
      render: (bodega_info: { bod_nombre: string }) => (
        <span>{bodega_info?.bod_nombre || "desconocido"}</span>
      ),
      width: 200,
    },
    {
      title: "Categoria",
      dataIndex: "categoria",
      key: "categoria",
      render: (categoria: { descripcion: string }) => (
        <span>{categoria.descripcion || "Desconocido"}</span>
      ),
    },
    {
      title: "Sub Categoria",
      dataIndex: "subcategoria",
      key: "subcategoria",
      render: (subcategoria: { descripcion: string }) => (
        <span>{subcategoria.descripcion || "Desconocido"}</span>
      ),
      width: 100,
    },
    {
      title: "Area",
      dataIndex: "area",
      key: "area",
      render: (area: { descripcion: string }) => (
        <span>{area.descripcion || "Desconocido"}</span>
      ),
    },
    {
      title: "Fecha De Compra",
      dataIndex: "fecha_compra",
      key: "fecha_compra",
    },
    {
      title: "Vida util",
      dataIndex: "vidaUtil",
      key: "vidaUtil",
      render: (value) => formatNumberNuevo(value) + " MESES",
    },
    {
      title: "Valor De Compra Unitario",
      dataIndex: "valor_compra",
      key: "valor_compra",
      width: 100,
      render: (value) => formatNumber(value),
    },
    {
      title: "Placa Proveedor",
      dataIndex: "placa_provedor",
      key: "placa_provedor",
      render: (_, record) => {
        const placaProveedor = record.datos.find(
          (dato) => dato.parametro_sub_categoria?.parametro?.descripcion === "PLACA DEL PROVEEDOR"
        );
    
        return placaProveedor ? placaProveedor.valor_almacenado : "N/A";
      },
    },
    
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      width: 130,
      align: "center",
      render: (_: any, record: Activos) => {
        let estadoString = "";
        let color;
        let disableChange = false;

        if (record.estado === "1") {
          estadoString = "ACTIVO";
          color = "green";
          disableChange = true;
        } else if (record.estado === "0") {
          estadoString = "INACTIVO";
          color = "red";
          disableChange = true;
        } else if (record.estado === "3") {
          estadoString = "PENDIENTE";
          color = "blue";
          disableChange = true; // Deshabilita el cambio si el estado es "PENDIENTE"
        } else if (record.estado === "4") {
          disableChange = true;
          estadoString = "MANTENIMIENTO";
          color = "pink";
        } else if (record.estado === "5") {
          disableChange = true;
          estadoString = "VENCIDO";
          color = "purple";
        }

        return (
          <div>
            <Tooltip
              title={
                disableChange
                  ? "No se puede cambiar el estado"
                  : "Cambiar estado"
              }
            >
              <span>
                <Tag
                  color={color}
                  key={estadoString}
                  icon={
                    loadingRow.includes(record.id) ? (
                      <SyncOutlined spin />
                    ) : null
                  }
                  style={{ cursor: disableChange ? "not-allowed" : "pointer" }}
                  onClick={() => {
                    if (!disableChange) {
                      handleDelete(record.id); // Solo llamar si no está deshabilitado
                    }
                  }}
                >
                  {estadoString.toUpperCase()}
                </Tag>
              </span>
            </Tooltip>
          </div>
        );
      },
      sorter: (a, b) => a.estado.localeCompare(b.estado),
    },
    {
      title: "Estado x propiedad",
      dataIndex: "estado_propiedad",
      key: "estado_propiedad",
      align: "center",
      render: (_: any, record: Activos) => {
        let estadoString = "";
        let color;
        let disableChange = false; // Asume que los cambios están habilitados por defecto

        // Determina el estado y el color
        if (record.estado_propiedad === "1") {
          estadoString = "PROPIO";
          color = "grey";
          disableChange = true; // Deshabilita el cambio si el estado es "PENDIENTE"
        } else if (record.estado_propiedad === "0") {
          estadoString = "ALQUILADO";
          color = "brown";
          disableChange = true; // Deshabilita el cambio si el estado es "PENDIENTE"
        } else if (record.estado_propiedad === "2") {
          estadoString = "COMODATO";
          color = "black";
        }

        return (
          <div>
            <Tooltip
              title={
                disableChange
                  ? "No se puede cambiar el estado"
                  : "Cambiar estado"
              }
            >
              <span>
                <Tag
                  color={color}
                  key={estadoString}
                  icon={
                    loadingRow.includes(record.id) ? (
                      <SyncOutlined spin />
                    ) : null
                  }
                  style={{ cursor: disableChange ? "not-allowed" : "pointer" }}
                  onClick={() => {
                    if (!disableChange) {
                      handleDelete(record.id); // Solo llamar si no está deshabilitado
                    }
                  }}
                >
                  {estadoString.toUpperCase()}
                </Tag>
              </span>
            </Tooltip>
          </div>
        );
      },
      sorter: (a, b) => a.estado.localeCompare(b.estado),
    },
    {
      title: "Acciones",
      key: "acciones",
      align: "center",
      fixed: "right",
      width: 340,
      render: (_, record: Activos) => (
        <Space>
          <Tooltip title="Editar">
            <Button
              disabled={record.estado === "0" || record.estado === "5"}
              icon={<EditOutlined />}
              type="primary"
              size="small"
              onClick={() => navigate(`editar-activo/${record.id}`)}
            />
          </Tooltip>

          {/* {["af-admin", "administrador", "gerencia"].includes(rol) && (
            <Tooltip title="Inactivar Activo">
              <Button
                type="primary"
                danger
                size="small"
                onClick={() => {
                  setActivoId(record.id);
                  showInactivateModal(record.id);
                }}
              >
                <StopOutlined />
              </Button>
            </Tooltip>
          )} */}

          <InactivarActivoModal
            isVisible={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            onConfirm={handleInactivate}
          />

          <Tooltip title="Ver Detalles/Parametros">
            <Button onClick={() => handleViewDetails(record.id)} size="small">
              <SearchOutlined />
            </Button>{" "}
          </Tooltip>

          <Tooltip title="Ver Trazabilidad">
            <GreenButton
              type="primary"
              size="small"
              onClick={() => {
                setActivoId(record.id);
                setOpenModalTrazabilidad(true);
              }}
            >
              <HistoryOutlined />
            </GreenButton>
          </Tooltip>

          <Tooltip title="Descargar QR">
            <BlueButton
              type="primary"
              size="small"
              onClick={() => generateQr(record.id)} // Asocia el QR con el ID del activo
            >
              <DownloadOutlined />
            </BlueButton>
          </Tooltip>

          <Tooltip title="Desgaste Mensual">
            <RedButton
              type="primary"
              size="small"
              onClick={() => {
                openModal(record.id);
              }}
            >
              <FallOutlined />
            </RedButton>
          </Tooltip>

          <Tooltip title="Historial Desgaste">
            <PurpleButton
              type="primary"
              size="small"
              onClick={() => abrirModalDepreciacion(record.id)} // Cambia "123" por el id que necesites pasar
            >
              <BankOutlined />
            </PurpleButton>
          </Tooltip>

          <Tooltip title="Ver soportes">
            <Button
              key={record.id + "consultar"}
              size="small"
              onClick={() => getAdjuntos(record.id)}
            >
              <CloudServerOutlined />
            </Button>
          </Tooltip>

          <Upload
            beforeUpload={(file) => {
              handleFileChangeImages(file, record.id);
              return false;
            }}
            maxCount={10}
            accept=".png,.jpg,.jpeg,.pdf"
            showUploadList={false}
            multiple
          >
            <Tooltip title="Cargar Imagenes">
              <ButtonUpload size="small">
                <UploadOutlined />
              </ButtonUpload>
            </Tooltip>
          </Upload>
        </Space>
      ),
    },
  ];

  return (
    <Layout>
      <ParametrosActivoModal
        open={visible}
        onClose={() => setVisible(false)}
        datos={datos}
      />

      <AdjuntosModal
        visible={modalVisible}
        onClose={closeModalArchivos}
        activoModalId={activoModalId ?? -1}
      />

      <TrazabilidadActivosModal
        open={openModalTrazabilidad}
        setOpen={(value: boolean) => {
          setOpenModalTrazabilidad(value);
          setActivoId(undefined);
        }}
        id_activo={activoId}
      />

      <DepreciacionActivoModal
        idActivo={Number(selectedActivoId)}
        visible={visibleModal}
        onClose={closeModal}
      />

      <TrazabilidadDepreciacionModal
        open={openModalDepreciacion}
        setOpen={(value: boolean) => {
          setOpenModalDepreciacion(value);
          setActivoId(undefined);
        }}
        id_activo={activoId}
      />

      <StyledCard title="Lista Activos" className="styled-card-documents">
        <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
          <StyledPanelFilterActivos>
            <Form
              className="form-panel-filtro"
              layout="vertical"
              onKeyDown={(e: any) =>
                e.key === "Enter" ? e.preventDefault() : null
              }
              // onFinish={control.handleSubmit(onFinish)}
            >
              <Row gutter={[12, 12]}>
                <Col xs={24}>
                  <Title
                    level={4}
                    style={{
                      color: "#6c757d",
                      textAlign: "center",
                      marginBlock: "16px",
                    }}
                  >
                    <SearchOutlined style={{ marginRight: "8px" }} />
                    Filtros de Búsqueda
                  </Title>
                </Col>

                <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }}>
                  <Controller
                    control={control.control}
                    name="buscarActivos"
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem>
                        <Input
                          {...field}
                          placeholder="Buscar Activos"
                          prefix={<SearchOutlined />}
                          allowClear
                          status={error && "error"}
                        />
                      </StyledFormItem>
                    )}
                  />
                </Col>

                <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }}>
                  <Controller
                    control={control.control}
                    name="id_activo"
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem>
                        <Input
                          {...field}
                          placeholder="Buscar Id Activo"
                          prefix={<SearchOutlined />}
                          allowClear
                          status={error && "error"}
                        />
                      </StyledFormItem>
                    )}
                  />
                </Col>

                <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }}>
                  <Controller
                    control={control.control}
                    name="placa_proovedor"
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem>
                        <Input
                          {...field}
                          placeholder="Buscar Placa Provedor Activo"
                          prefix={<SearchOutlined />}
                          allowClear
                          status={error && "error"}
                        />
                      </StyledFormItem>
                    )}
                  />
                </Col>

                <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }}>
                  <Controller
                    control={control.control}
                    name="categorias"
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem
                        validateStatus={error ? "error" : ""}
                        help={error?.message}
                      >
                        <Select
                          {...field}
                          mode="multiple"
                          placeholder="Filtrar por Categorías"
                          style={{ width: "100%" }}
                          showSearch
                          filterOption={(input, option) => {
                            return option?.label
                              ? option.label
                                  .toString()
                                  .toLowerCase()
                                  .includes(input.toLowerCase())
                              : false;
                          }}
                          onChange={(values) => field.onChange(values)}
                          allowClear
                          options={categorias.map((categoria) => ({
                            label: categoria.descripcion,
                            value: categoria.id,
                          }))}
                        />
                      </StyledFormItem>
                    )}
                  />
                </Col>

                <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }}>
                  <Controller
                    control={control.control}
                    name="subcategorias"
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem
                        validateStatus={error ? "error" : ""}
                        help={error?.message}
                      >
                        <Select
                          {...field}
                          mode="multiple"
                          placeholder="Filtrar por Subcategorías"
                          style={{ width: "100%" }}
                          showSearch
                          filterOption={(input, option) => {
                            return option?.label
                              ? option.label
                                  .toString()
                                  .toLowerCase()
                                  .includes(input.toLowerCase())
                              : false;
                          }}
                          onChange={(values) => field.onChange(values)}
                          allowClear
                          options={subCategorias.map((subcategoria) => ({
                            label: subcategoria.descripcion,
                            value: subcategoria.id,
                          }))}
                        />
                      </StyledFormItem>
                    )}
                  />
                </Col>

                <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }}>
                  <Controller
                    control={control.control}
                    name="bodegas"
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem
                        validateStatus={error ? "error" : ""}
                        help={error?.message}
                      >
                        <Select
                          {...field}
                          mode="multiple"
                          placeholder="Filtrar por Sede/Localización"
                          style={{ width: "100%" }}
                          showSearch
                          filterOption={(input, option) => {
                            return option?.label
                              ? option.label
                                  .toString()
                                  .toLowerCase()
                                  .includes(input.toLowerCase())
                              : false;
                          }}
                          onChange={(values) => field.onChange(values)}
                          allowClear
                          options={bodegas.map((bodega) => ({
                            label: bodega.bod_nombre,
                            value: bodega.id,
                          }))}
                        />
                      </StyledFormItem>
                    )}
                  />
                </Col>

                <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }}>
                  <Controller
                    control={control.control}
                    name="usuarios"
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem
                        validateStatus={error ? "error" : ""}
                        help={error?.message}
                      >
                        <Select
                          {...field}
                          mode="multiple"
                          placeholder="Filtrar por Usuario"
                          style={{ width: "100%" }}
                          showSearch
                          filterOption={(input, option) =>
                            option?.label
                              ? option.label
                                  .toString()
                                  .toLowerCase()
                                  .includes(input.toLowerCase())
                              : false
                          }
                          onChange={(values) => field.onChange(values)}
                          allowClear
                          options={usuarios.map((usuario) => ({
                            label: usuario.nombre,
                            value: usuario.id,
                          }))}
                        />
                      </StyledFormItem>
                    )}
                  />
                </Col>

                <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }}>
                  <Controller
                    control={control.control}
                    name="areas"
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem
                        validateStatus={error ? "error" : ""}
                        help={error?.message}
                      >
                        <Select
                          {...field}
                          mode="multiple"
                          placeholder="Filtrar por Área"
                          style={{ width: "100%" }}
                          showSearch
                          filterOption={(input, option) =>
                            option?.label
                              ? option.label
                                  .toString()
                                  .toLowerCase()
                                  .includes(input.toLowerCase())
                              : false
                          }
                          onChange={(values) => field.onChange(values)}
                          allowClear
                          options={subLocalizacionArea.map((area) => ({
                            label: area.descripcion,
                            value: area.id,
                          }))}
                        />
                      </StyledFormItem>
                    )}
                  />
                </Col>

                <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }}>
                  <Controller
                    control={control.control}
                    name="estados"
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem
                        validateStatus={error ? "error" : ""}
                        help={error?.message}
                      >
                        <Select
                          {...field}
                          mode="multiple"
                          placeholder="Filtrar por Estado"
                          style={{ width: "100%" }}
                          showSearch
                          filterOption={(input, option) =>
                            option?.label
                              ? option.label
                                  .toString()
                                  .toLowerCase()
                                  .includes(input.toLowerCase())
                              : false
                          }
                          onChange={(values) => field.onChange(values)}
                          allowClear
                          options={[
                            { value: "0", label: "Inactivo" },
                            { value: "1", label: "Activo" },
                            { value: "3", label: "Pendiente" },
                            { value: "4", label: "Mantenimiento" },
                            { value: "5", label: "Vencido" },
                          ]}
                        />
                      </StyledFormItem>
                    )}
                  />
                </Col>

                <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }}>
                  <Controller
                    control={control.control}
                    name="estado_propiedad"
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem
                        validateStatus={error ? "error" : ""}
                        help={error?.message}
                      >
                        <Select
                          {...field}
                          mode="multiple"
                          placeholder="Filtrar por Estado Propiedad"
                          style={{ width: "100%" }}
                          showSearch
                          filterOption={(input, option) =>
                            option?.label
                              ? option.label
                                  .toString()
                                  .toLowerCase()
                                  .includes(input.toLowerCase())
                              : false
                          }
                          onChange={(values) => field.onChange(values)}
                          allowClear
                          options={[
                            { value: "0", label: "Alquilado" },
                            { value: "1", label: "Propio" },
                            { value: "2", label: "Comodato" },
                          ]}
                        />
                      </StyledFormItem>
                    )}
                  />
                </Col>

                <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }}>
                  <Controller
                    control={control.control}
                    name="parametros"
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem
                        validateStatus={error ? "error" : ""}
                        help={error?.message}
                      >
                        <Select
                          {...field}
                          mode="multiple"
                          placeholder="Filtrar por Parámetro"
                          style={{ width: "100%" }}
                          showSearch
                          allowClear
                          filterOption={(input, option) =>
                            option?.children
                              ? option.children
                                  .toString()
                                  .toLowerCase()
                                  .includes(input.toLowerCase())
                              : false
                          }
                          onChange={(values) => field.onChange(values)}
                        >
                          {parametros.map((parametro) => (
                            <Select.Option
                              key={parametro.id}
                              value={parametro.id}
                            >
                              {parametro.descripcion}
                            </Select.Option>
                          ))}
                        </Select>
                      </StyledFormItem>
                    )}
                  />
                </Col>

                <Col
                  xs={24}
                  sm={12}
                  md={8}
                  style={{ display: "flex", gap: "10px", alignItems: "center" }}
                >
                  <Spin spinning={loaderTable}>
                    <Button
                      type="primary"
                      icon={<SearchOutlined />}
                      style={{ width: "80px" }} 
                      onClick={() => {
                        setCurrentPage(1);
                        fetchActivos("filtros");
                      }}
                    />
                  </Spin>

                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate("crear-activo")}
                  >
                    Crear Activo
                  </Button>
                </Col>
              </Row>
            </Form>
          </StyledPanelFilterActivos>
        </Row>
        <Text>Total Registros: {pagination?.total}</Text>

        <Table
          bordered
          rowKey={(record) => record.id.toString()}
          size="small"
          scroll={{ x: 2100 }}
          columns={columns}
          dataSource={activos}
          loading={loaderTable}
          pagination={{
            total: pagination?.total,
            pageSize: pagination?.per_page,
            simple: false,
            current: currentPage,
            onChange: (page: number, pageSize: number) => {
              setCurrentPage(page);
              setCurrentItemsPage(pageSize);
            },
            showSizeChanger: true,
            hideOnSinglePage: true,
            showTotal: () => {
              return (
                <>
                  <Text>Total Registros: {pagination?.total}</Text>
                </>
              );
            },
          }}
          rowClassName={(record) =>
            Array.isArray(activosSinImagenes) &&
            activosSinImagenes.includes(record.id)
              ? "fila-roja"
              : ""
          }
        />
      </StyledCard>

      <style>
        {`
          .fila-roja {
            background-color:rgb(237, 197, 88) !important;
          }
        `}
      </style>
    </Layout>
  );
};
