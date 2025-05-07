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
  DatePicker,
  Tag,
  Upload,
  message,
  Select,
} from "antd";
import {
  SearchOutlined,
  UploadOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { Activos, Bodega, ResponseListaLocalizaciones, ResponseListaUsuarios } from "@/services/types"; // Importar la interfaz de Categoría
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { cargarAdjuntos } from "@/services/activos/activosAPI";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween"; // Importa el plugin isBetween
import { ButtonUpload } from "@/modules/documentos/pages/ventas/pages/dis/components/ListarDocumentos/styled";
import { getListaActivosSubCategoria } from "@/services/activos/MovimientosActivosAPI";
import { ParametrosActivoModal } from "../../../parametrizacion/pages/Activos/pages/components";
import {
  getActivos,
  getBodegasLocalizaciones,
  getUsuariosLista,
  updateLocalizacion,
} from "@/services/activos/activosAPI";
import { User } from "@/modules/admin-usuarios/pages/usuarios/types";
import { fetchUserProfile } from "@/services/auth/authAPI";
// import ModalArchivosMantenimiento from "../Components/ModalAdjuntosMantenimiento";

dayjs.extend(isBetween);

const { Text } = Typography;
const { RangePicker } = DatePicker;

export const ListMovimientosEquiposIndustrial = () => {
  const [activosEquiposIndustrial, setActivosEquiposIndustrial] = useState<
    Activos[]
  >([]);
  const [loaderTable, setLoaderTable] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState("");
  const [pagination, setPagination] = useState<{
    total: number;
    per_page: number;
  }>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null); // Estado para el rango de fechas
  const [finalDataSource, setFinalDataSource] = useState<Activos[]>([]);
  const [loadingRow] = useState<number[]>([]);
  const [visible, setVisible] = useState(false);
  const [datos, setDatos] = useState<any[]>([]);
  const [localizaciones, setLocalizaciones] = useState<Bodega[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    [key: number]: number;
  }>({});
  const [selectedUser, setSelectedUser] = useState<{ [key: number]: number }>(
    {}
  );

  const [searchBodega, setSearchBodega] = useState<string>("");
  const [searchUsuario, setSearchUsuario] = useState<string>("");



  useEffect(() => {
    fetchActivosEquiposIndustrial();
  }, [currentPage]);

  useEffect(() => {
    applyFilters();
  }, [activosEquiposIndustrial, dateRange, searchInput]);

  const applyFilters = () => {
    let filtered = activosEquiposIndustrial;

    if (dateRange) {
      filtered = filtered.filter((activosEquiposComputo) => {
        return dayjs(activosEquiposComputo.fecha_compra).isBetween(
          dateRange[0],
          dateRange[1],
          null,
          "[]"
        );
      });
    }

    if (searchInput) {
      filtered = filtered.filter((activosEquiposComputo) => {
        const nombre = activosEquiposComputo.nombre || "";
        return nombre.toLowerCase().includes(searchInput.toLowerCase());
      });
    }

    setFinalDataSource(filtered);
  };

  useEffect(() => {
    const fetchBodegas = async () => {
      try {
        const response: ResponseListaLocalizaciones =
          await getBodegasLocalizaciones();
        if (response.status === "success") {
          const bodegasArray = Object.values(response.data); // Extrae los valores como array
          setLocalizaciones(bodegasArray);
        } else {
          // Manejo de errores si el estado no es 'success'
          console.error("Error al obtener las bodegas:", response);
        }
      } catch (error) {
        console.error("Error al hacer la solicitud:", error);
      } finally {
        setLoading(false); // Finaliza el estado de carga
      }
    };

    fetchBodegas();
  }, []);


  const handleLocationChange = (value: number, recordId: number) => {
    setSelectedLocation((prev) => ({ ...prev, [recordId]: value }));
  };


  const handleUserChange = (value: number, recordId: number) => {
    setSelectedUser((prev) => ({ ...prev, [recordId]: value }));
  };


  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response: ResponseListaUsuarios =
          await getUsuariosLista();
        if (response.status === "success") {
          const usuariosArray = Object.values(response.data); // Extrae los valores como array
          setUsers(usuariosArray);
        } else {
          // Manejo de errores si el estado no es 'success'
          console.error("Error al obtener los usuarios:", response);
        }
      } catch (error) {
        console.error("Error al hacer la solicitud:", error);
      } finally {
        setLoading(false); // Finaliza el estado de carga
      }
    };

    fetchUsuarios();
  }, []);



  // Cargar Activos
const fetchActivosEquiposIndustrial = async () => {
  setLoaderTable(true);
  try {
    const categoria = "MAQUINA Y EQUIPO";
    const response = await getListaActivosSubCategoria(categoria);
    setActivosEquiposIndustrial(response.data);
    setPagination({
      total: response.total,
      per_page: response.per_page,
    });
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      notification.error({ message: error.response.data.message });
    } else {
      notification.error({ message: "Ocurrió un error al cargar los activos." });
    }
  } finally {
    setLoaderTable(false);
  }
};



  const handleFileChangeImages = async (
    file: File,
    mantenimientoId: number
  ) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      notification.error({
        message: "El archivo no puede superar las 2MB.",
      });
      return isLt2M;
    }

    const formData = new FormData();
    formData.append("imagen", file);
    formData.append("id", mantenimientoId.toString());

    setLoaderTable(true);

    try {
      const response = await cargarAdjuntos(formData, mantenimientoId);

      if (response.data?.status === "success") {
        notification.open({
          type: "success",
          message: `Archivo cargado con éxito!`,
        });
        fetchActivosEquiposIndustrial(); // Refrescar la lista de mantenimientos o archivos
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

  const handleViewDetails = async (id: number) => {
    setLoading(true);
    try {
      const response = await getActivos(id);
    
      if (response && response.data.data.datos) {
        setDatos(response.data.data.datos); // Asume que `datos` está en la respuesta

        // const ActivosMap = activosEquiposIndustrial.reduce(
        //   (map: any, activo: Activos) => {
        //     map[activo.id] = activo.nombre; // Asume que cada parámetro tiene un id y un nombre
        //     return map;
        //   },
        //   {}
        // );

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

  const getFilteredData = (data: Activos[]) => {
    return data.filter((item) => {
      const matchesBodega = searchBodega
        ? item.bodega_info?.bod_nombre.toLowerCase().includes(searchBodega.toLowerCase())
        : true;
        const matchesUsuario = searchUsuario
        ? Object.values(item.usuarios || {}).some((user: { nombre: string }) => 
            user.nombre.toLowerCase().includes(searchUsuario.toLowerCase())
          )
        : true;
      return matchesBodega && matchesUsuario;
    });
  };

  const handleSaveChanges = async (record: Activos) => {
    try {
      // Obtener los valores seleccionados
      const response = await fetchUserProfile();
                          const userId = Number(response.data.userData.id);

      const nuevaUbicacion = selectedLocation[record.id] || record.bodega_info.id;
      const nuevoUsuario = selectedUser[record.id] 
      ?? (record.usuarios ? Object.values(record.usuarios).map((user: { id: number }) => user.id) : []);

        await updateLocalizacion(record.id, nuevaUbicacion, nuevoUsuario, userId);

      // Actualizar la lista de activos con los nuevos valores localmente
      setActivosEquiposIndustrial((prevActivos) =>
        prevActivos.map((activo) =>
          activo.id === record.id
            ? {
                ...activo,
                ubicacionActual: nuevaUbicacion,
                usuarioAsignado: nuevoUsuario,
              }
            : activo
        )
      );

      message.success(
        `El activo ${record.nombre} fue actualizado correctamente.`
      );
    } catch (error) {
      message.error("Error al actualizar la ubicación y el usuario.");
    }
  };

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
    },
   {
      title: "Usuarios",
      dataIndex: "usuarios",
      key: "usuarios",
      render: (usuarios, record: Activos) => {
        // Convertimos el objeto de usuarios en un array si es necesario
        const usuariosArray = usuarios
          ? Object.values(usuarios) as { id: string; nombre: string }[]
          : [];
    
        return (
          <Select
            mode="multiple" // Permitir selección múltiple
            value={selectedUser[record.id] ?? usuariosArray.map((user) => user.id)} // Convertimos usuarios a un array de IDs
            style={{ width: 250 }}
            onChange={(value) => handleUserChange(value, record.id)} // `value` ahora será un array de IDs
            loading={loading}
            showSearch
            placeholder="Seleccione usuarios"
            optionFilterProp="label"
            filterOption={(input, option) =>
              option && typeof option.label === "string"
                ? option.label.toLowerCase().includes(input.toLowerCase())
                : false
            }
            options={users.map((user) => ({
              label: user.nombre, 
              value: user.id, 
            }))}
          />
        );
      }
    },

    
    {
        title: 'Localización',
        dataIndex: 'bodega_info',
        key: 'bodega_info',
        render: (bodega_info: any, record: Activos) => (
          <Select
            value={selectedLocation[record.id] ?? bodega_info.bod_nombre} // Usar el estado o el valor inicial
            style={{ width: 200 }}
            showSearch // Permitir búsqueda
            onChange={(value) => handleLocationChange(value, record.id)}
            loading={loading}
            placeholder="Seleccione una localización"
            optionFilterProp="label" // Usar la propiedad 'label' para filtrar
            filterOption={(input, option) =>
              // Asegurarse de que siempre se retorne un booleano
              option ? option.label.toLowerCase().includes(input.toLowerCase()) : false
            } // Personalizar el filtro de búsqueda
            options={localizaciones.map((localizacion) => ({
              label: localizacion.bod_nombre,
              value: localizacion.id,
            }))} // Estructurar las opciones usando 'label' y 'value'
          />
        ),
      },
    {
      title: "Categoria",
      dataIndex: "categoria",
      key: "categoria",
      render: (categoria: { descripcion: string }) => (
        <span>{categoria.descripcion || "Desconocido"}</span> // Usa el mapa para obtener el nombre de la categoría
      ),
    },
    {
      title: "Sub Categoria",
      dataIndex: "subcategoria",
      key: "subcategoria",
      render: (subcategoria: { descripcion: string }) => (
        <span>{subcategoria.descripcion || "Desconocido"}</span> // Usa el mapa para obtener el nombre de la categoría
      ),
    },
    {
      title: "Area",
      dataIndex: "area",
      key: "area",
      render: (area: { descripcion: string }) => (
        <span>{area.descripcion || "Desconocido"}</span> // Usa el mapa para obtener el nombre de la categoría
      ),
    },
    {
      title: "Fecha De Compra",
      dataIndex: "fecha_compra",
      key: "fecha_compra",
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      align: "center",
      render: (_: any, record: Activos) => {
        let estadoString = "";
        let color;
        let disableChange = false; // Asume que los cambios están habilitados por defecto

        // Determina el estado y el color
        if (record.estado === "1") {
          estadoString = "ACTIVO";
          color = "green";
          disableChange = true; // Deshabilita el cambio si el estado es "PENDIENTE"
        } else if (record.estado === "0") {
          estadoString = "INACTIVO";
          color = "red";
          disableChange = true; // Deshabilita el cambio si el estado es "PENDIENTE"
        } else if (record.estado === "3") {
          estadoString = "PENDIENTE";
          color = "blue";
          disableChange = true; // Deshabilita el cambio si el estado es "PENDIENTE"
        } else if (record.estado === "4") {
          disableChange = true;
          estadoString = "MANTENIMIENTO";
          color = "pink";
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
                      //   handleDelete(record.id); // Solo llamar si no está deshabilitado
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
        } else if (record.estado_propiedad === "4") {
          estadoString = "CANCELADO";
          color = "gray";
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
                      //   handleDelete(record.id); // Solo llamar si no está deshabilitado
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
      render: (_, record: Activos) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Tooltip title="Ver Detalles/Parametros">
            <Button onClick={() => handleViewDetails(record.id)} size="small">
              <SearchOutlined />
            </Button>{" "}
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

          <Tooltip title="Guardar cambios">
            <Button type="primary" onClick={() => handleSaveChanges(record)}>
              Guardar
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <StyledCard title="Movimientos Equipos Industrial">
        <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>

        <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
                  <Input
                    placeholder="Buscar por bodega"
                    prefix={<SearchOutlined />}
                    value={searchBodega}
                    onChange={(e) => setSearchBodega(e.target.value)}
                  />
                  <Input
                    placeholder="Buscar por usuario"
                    prefix={<SearchOutlined />}
                    value={searchUsuario}
                    onChange={(e) => setSearchUsuario(e.target.value)}
                  />
                </div>



          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Buscar Equipo Industrial"
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

        </Row>

        <ParametrosActivoModal
          open={visible}
          onClose={() => setVisible(false)}
          datos={datos}
        />

        {/* <ModalArchivosMantenimiento 
        visible={modalVisible} 
        onClose={closeModal} 
        mantenimientoId={mantenimientoId ?? -1}
      /> */}

        <Text>Total Registros: {pagination?.total}</Text>
        <Table
          bordered
          rowKey={(record) => record.id.toString()} // Asegurar que rowKey sea un string
          size="small"
          columns={columns}
          dataSource={getFilteredData(finalDataSource)}
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
