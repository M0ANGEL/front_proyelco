/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
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
  DatePicker,
  Tag,
  Upload,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  UploadOutlined,
  SyncOutlined,
  CloudServerOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { Mantenimiento } from "@/services/types"; // Importar la interfaz de Categoría
import { useNavigate } from "react-router-dom";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import {
  aceptarMantenimiento,
  cargarAdjuntosMantenimientos,
  getListaMantenimientos,
  handleUpdateEstado,
} from "@/services/activos/mantenimientoAPI";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween"; // Importa el plugin isBetween
import { ButtonUpload } from "@/modules/documentos/pages/ventas/pages/dis/components/ListarDocumentos/styled";
import ModalArchivosMantenimiento from "../Components/ModalAdjuntosMantenimiento";
import {
  BlueButton,
  RedButton,
} from "@/modules/common/components/ExportExcel/styled";
import { fetchUserProfile } from "@/services/auth/authAPI";
import ModalRenovacionMantenimiento from "../Components/ModalRenovacionMantenimiento";

dayjs.extend(isBetween);

const { Text } = Typography;
const { RangePicker } = DatePicker;

export const ListMantenimiento = () => {
  const navigate = useNavigate();
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([]);
  const [loaderTable, setLoaderTable] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState("");
  const [, setFilteredMantenimiento] = useState<Mantenimiento[]>([]);
  const [pagination, setPagination] = useState<{
    total: number;
    per_page: number;
  }>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null); // Estado para el rango de fechas
  const [finalDataSource, setFinalDataSource] = useState<Mantenimiento[]>([]);
  const [loadingRow, setLoadingRow] = useState<number[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [mantenimientoId, setMantenimientoId] = useState<number>(1);
  const [notificacionApi, contextHolder] = notification.useNotification();
  const [idUsuarioFijo, setIdUsuarioFijo] = useState<number>(1);
  const [visible, setVisible] = useState(false);

  const showModal = (record: number) => {
    setMantenimientoId(record); // Establecemos el registro seleccionado
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
    setMantenimientoId(0); // Limpiamos el registro seleccionado
  };

  const getAdjuntos = (id: number) => {
    setMantenimientoId(id); // Guardamos el ID del mantenimiento
    setModalVisible(true); // Abrimos el modal
  };

  const closeModal = () => {
    setModalVisible(false); // Cerramos el modal
    setMantenimientoId(0); // Reiniciamos el ID
  };

  useEffect(() => {
    fetchMantenimientos();
  }, [currentPage]);

  useEffect(() => {
    applyFilters();
  }, [mantenimientos, dateRange, searchInput]);

  const applyFilters = () => {
    let filtered = mantenimientos;

    if (dateRange) {
      filtered = filtered.filter((mantenimiento) => {
        return dayjs(mantenimiento.fecha_mantenimiento).isBetween(
          dateRange[0],
          dateRange[1],
          null,
          "[]"
        );
      });
    }

    if (searchInput) {
      filtered = filtered.filter((mantenimiento) => {
        const descripcion = mantenimiento.tipo_mantenimiento || "";
        return descripcion.toLowerCase().includes(searchInput.toLowerCase());
      });
    }

    setFilteredMantenimiento(filtered);
    setFinalDataSource(filtered);
  };

  //cargar Activos
  const fetchMantenimientos = async () => {
    setLoaderTable(true);
    try {
      const response = await getListaMantenimientos();
      setMantenimientos(response.data);
      setFilteredMantenimiento(response.data); // Establece el estado inicial
      setPagination({
        total: response.total,
        per_page: response.per_page,
      });
    } catch (error) {
      notificacionApi.error({ message: "Error" });
    } finally {
      setLoaderTable(false);
    }
  };

  const handdleAceptarMantenimiento = async (id: number, idUser: number) => {
    const response = await fetchUserProfile();
    const userId = Number(response.data.userData.id);
    setIdUsuarioFijo(userId);
    try {
       await aceptarMantenimiento(id, idUser);
      notificacionApi.success({ message: "mantenimiento cerrado con exito" });
    } catch (error: any) {
      notificacionApi.error({ message: error.response.data.error });
    }
  };

  const handleFileChangeImages = async (
    file: File,
    mantenimientoId: number
  ) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      notificacionApi.error({
        message: "El archivo no puede superar las 2MB.",
      });
      return isLt2M;
    }

    const formData = new FormData();
    formData.append("imagen", file);
    formData.append("id", mantenimientoId.toString());

    setLoaderTable(true);

    try {
      // Llamar al método cargarAdjuntos con el FormData y el id
      const response = await cargarAdjuntosMantenimientos(formData, mantenimientoId);

      if (response.data?.status === "success") {
        notificacionApi.open({
          type: "success",
          message: `Archivo cargado con éxito!`,
        });
        fetchMantenimientos(); // Refrescar la lista de mantenimientos o archivos
      } else {
        notificacionApi.open({
          type: "error",
          message: response.data.message || "Error al cargar el archivo.",
        });
      }
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const errores: string[] = Object.values(error.response.data.errors);

        for (const err of errores) {
          notificacionApi.open({
            type: "error",
            message: err,
            duration: 5,
          });
        }
      } else {
        notificacionApi.open({
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

  // //manejador de eliminacion
  // const handleDelete = (id: number) => {
  //   deleteMantenimiento(id)
  //     .then(() => {
  //       notification.success({
  //         message: "Mantenimiento Eliminado",
  //         description: "El mantenimiento ha sido eliminado exitosamente.",
  //       });
  //       fetchMantenimientos(); // Refrescar la lista de mantenimientos
  //     })
  //     .catch((error) => {
  //       notification.error({
  //         message: "Error",
  //         description: error.message,
  //       });
  //     });
  // };

  //formato para el numero del costo
  const formatNumber = (value: any) => {
    if (typeof value === "string") {
      return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return value.toLocaleString("es-ES", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };
    
  
  const columns: ColumnsType<Mantenimiento> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      align: "center",
    },
    {
      title: "Activo",
      dataIndex: "activos",
      key: "activos",
      render: (activos: { nombre: string }) => (
        <span>{activos?.nombre}</span> // Usa el mapa para obtener el nombre de la categoría
      ),
    },
    {
      title: "Fecha Mantenimiento",
      dataIndex: "fecha_mantenimiento",
      key: "fecha_mantenimiento",
      width:  80,
    },
    {
      title: "Fecha Fin De Mantenimiento",
      dataIndex: "fecha_fin_mantenimiento",
      key: "fecha_fin_mantenimiento",
      width: 80,
    },

    {
      title: "Tipo De Mantenimiento",
      dataIndex: "tipo_mantenimiento",
      key: "tipo_mantenimiento",
      width: 90,
    },
    {
      title: "Descripcion Del Mantenimiento",
      dataIndex: "descripcion_mantenimiento",
      key: "descripcion_mantenimiento",
      width: 90,
    },
    {
      title: "Encaragado Del Mantenimiento",
      dataIndex: "tercero_info",
      key: "tercero_info",
      render: (tercero_info: { nombre: string }) => (
        <span>{tercero_info?.nombre}</span> // Usa el mapa para obtener el nombre de la categoría
      ),
    },
    {
      title: "Valor Del Mantenimiento",
      dataIndex: "valor_mantenimiento",
      key: "valor_mantenimiento",
      render: (value) => formatNumber(value),
    },
    {
      title: "Observaciones Del Mantenimiento",
      dataIndex: "observacion_mantenimiento",
      key: "observacion_mantenimiento",
      width: 90,
    },
    {
      title: "Usuario Encargado Del Mantenimiento",
      dataIndex: "user_info",
      key: "user_info",
      render: (user_info: { nombre: string }) => (
        <span>{user_info?.nombre}</span> // Usa el mapa para obtener el nombre de la categoría
      ),
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      align: "center",
      render: (_: any, record: Mantenimiento) => {
        let estadoString = "";
        let color;
        let disableChange = false; // Asume que los cambios están habilitados por defecto

        // Determina el estado y el color
        if (record.estado === "activo") {
          estadoString = "Activo";
          color = "green";
        } else if (record.estado === "inactivo") {
          estadoString = "Inactivo";
          color = "blue";
          disableChange = true; // Deshabilita el cambio si el estado es "PENDIENTE"
        } else if (record.estado === "vencido") {
          estadoString = "Vencido";
          color = "red";
          disableChange = true; // Deshabilita el cambio si el estado es "PENDIENTE"
        } else if (record.estado === "cerrado") {
          estadoString = "Cerrado";
          color = "gray";
        }

        const handleEstadoChange = async (id: number) => {
          // Si los cambios están deshabilitados, no hacer nada
          if (disableChange) return;

          // Mostrar el spinner de carga en la fila correspondiente
          setLoadingRow((prev: number[]) => [...prev, id]);

          try {
            // Llamar a la función de actualización para cambiar el estado en el backend
            const response = await handleUpdateEstado(id, "cerrado"); // Pasar el estado "cerrado"

            if (response.success) {
              // Aquí puedes realizar cualquier acción adicional después de la actualización
            } else {
              console.error("Error al cambiar el estado");
            }
          } catch (error) {
            console.error("Error en la verificación del estado:", error);
          } finally {
            // Ocultar el spinner de carga después de completar la operación
            setLoadingRow((prev) =>
              prev.filter((loadingId) => loadingId !== id)
            );
          }
        };

        return (
          <div>
            <Tooltip
              title={
                disableChange
                  ? "No se puede cambiar el estado"
                  : "Cambiar estado a cerrado"
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
                  onClick={() => handleEstadoChange(record.id)} // Llamar al método de cambio de estado
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
      render: (_, record: Mantenimiento) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Tooltip title="Editar">
            <Button
              icon={<EditOutlined />}
              type="primary"
              size="small"
              onClick={() => navigate(`editar-mantenimiento/${record.id}`)}
            />
          </Tooltip>

          <Tooltip title="Completado">
            <BlueButton
              icon={<CheckCircleOutlined />}
              type="primary"
              size="small"
              onClick={() =>
                handdleAceptarMantenimiento(record.id, idUsuarioFijo)
              }
            />
          </Tooltip>

          <Tooltip title="Renovar">
            <RedButton
              icon={<ReloadOutlined />}
              type="primary"
              size="small"
              onClick={() => showModal(record.id)} // Mostrar modal al hacer clic
            />
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
              return false; // Evita la carga automática del archivo
            }}
            maxCount={10}
            accept=".pdf"
            showUploadList={false}
            multiple
          >
            <Tooltip title="Cargar soportes">
              <ButtonUpload size="small">
                <UploadOutlined />
              </ButtonUpload>
            </Tooltip>
          </Upload>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      {contextHolder}
      <StyledCard title="Mantenimientos">
        <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Buscar Mantenimientos"
              prefix={<SearchOutlined />}
              allowClear
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </Col>

          <Col xs={24} sm={12} md={8}>
            <RangePicker
              format="YYYY-MM-DD"
              onChange={(dates) =>
                setDateRange(
                  dates ? [dates[0] as Dayjs, dates[1] as Dayjs] : null
                )
              }
            />
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("crear-mantenimiento")}
            >
              Crear Mantenimiento
            </Button>
          </Col>
        </Row>

        <ModalArchivosMantenimiento
          visible={modalVisible}
          onClose={closeModal}
          mantenimientoId={mantenimientoId ?? -1}
        />

        <ModalRenovacionMantenimiento
          visible={visible}
          onCancel={hideModal}
          recordId={mantenimientoId} // Pasamos el ID del registro seleccionado
          idUsuarioFijo={idUsuarioFijo} // Pasamos el ID del usuario fijo
        />

        <Text>Total Registros: {pagination?.total}</Text>
        <Table
          bordered
          rowKey={(record) => record.id.toString()} // Asegurar que rowKey sea un string
          size="small"
          scroll={{x:2000}}
          columns={columns}
          dataSource={finalDataSource}
          loading={loaderTable}
          pagination={{
            total: pagination?.total,
            pageSize: pagination?.per_page,
            simple: true,
            onChange: (page: number) => {
              setCurrentPage(page);
            },
            hideOnSinglePage: true,
          }}
        />
      </StyledCard>
    </Layout>
  );
};
