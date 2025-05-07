/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import {
  Table,
  Input,
  notification,
  Row,
  Col,
  Layout,
  Select,
  Tooltip,
  Tag,
  Button,
} from "antd";
import {
  SearchOutlined,
  FallOutlined,
  CloudServerOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { Activos } from "@/services/types";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { getActivosBodega } from "@/services/activos/activosAPI";
import { RedButton } from "@/modules/common/components/ExportExcel/styled";
import { DepreciacionActivoModal } from "../../../parametrizacion/pages/Activos/pages/components/DepreciacionActivoModal";
import AdjuntosModal from "../../../parametrizacion/pages/Activos/pages/components/AdjuntosModal";
import { KEY_BODEGA } from "@/config/api";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";

let timeout: ReturnType<typeof setTimeout> | null;
const { Option } = Select;

export const ListInventario = () => {
  const [activos, setActivos] = useState<Activos[]>([]);
  const [loaderTable, setLoaderTable] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState("");
  const [filteredActivos, setFilteredActivos] = useState<Activos[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    []
  );
  const [selectedBodegas, setSelectedBodegas] = useState<string[]>([]);
  const [selectedEstado, setSelectedEstado] = useState<string[]>([]);
  const [selectedEstadoPropiedad, setSelectedEstadoPropiedad] = useState<
    string[]
  >([]);
  const [selectedUsuarios, setSelectedUsuarios] = useState<string[]>([]);
  const [selectedArea, setSelectedArea] = useState<string[]>([]);

  const [pagination, setPagination] = useState<{
    total: number;
    per_page: number;
  }>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedActivoId, setSelectedActivoId] = useState<number | null>(null);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [activoModalId, setActivoModalId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { getSessionVariable } = useSessionStorage();
  const bodega = getSessionVariable(KEY_BODEGA);
  const bodegaN = Number(bodega);

  useEffect(() => {
    fetchActivos();
  }, [currentPage]);

  useEffect(() => {
    filterActivos();
  }, [
    searchInput,
    selectedCategories,
    selectedSubcategories,
    selectedBodegas,
    selectedEstado,
    selectedEstadoPropiedad,
    selectedUsuarios,
    selectedArea,
    pagination,
  ]);

  const fetchActivos = async () => {
    setLoaderTable(true);
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(async () => {
      try {
        const response = await getActivosBodega(bodegaN);
        setActivos(response.data);
        setFilteredActivos(response.data);
        setPagination({ total: response.total, per_page: response.per_page });
      } catch (error) {
        notification.error({
          message: "Error",
        });
      } finally {
        setLoaderTable(false);
      }
    }, 800);
  };

  const filterActivos = () => {
    let filtered = activos.filter((activo) =>
      activo.nombre.toLowerCase().includes(searchInput.toLowerCase())
    );

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((activo) =>
        selectedCategories.includes(activo.categoria.descripcion)
      );
    }

    if (selectedSubcategories.length > 0) {
      filtered = filtered.filter((activo) =>
        selectedSubcategories.includes(activo.subcategoria.descripcion)
      );
    }

    if (selectedBodegas.length > 0) {
      filtered = filtered.filter((activo) =>
        selectedBodegas.includes(activo.bodega_info.bod_nombre)
      );
    }

    if (selectedEstado.length > 0) {
      filtered = filtered.filter((activo) =>
        selectedEstado.includes(activo.estado)
      );
    }

    if (selectedEstadoPropiedad.length > 0) {
      filtered = filtered.filter((activo) =>
        selectedEstadoPropiedad.includes(activo.estado_propiedad)
      );
    }

    if (selectedUsuarios.length > 0) {
      filtered = filtered.filter((activo) => {
        const nombresUsuarios = activo.usuarios
          ? Object.values(activo.usuarios).map((u: any) => u.nombre)
          : [];
    
        return nombresUsuarios.some((nombre) => selectedUsuarios.includes(nombre));
      });
    }
    

    if(selectedArea.length > 0) {
      filtered = filtered.filter((activo) =>
      selectedArea.includes(activo.area.descripcion)
    );
    }



    setFilteredActivos(filtered);
  };

  const uniqueCategories = Array.from(
    new Set(activos.map((activo) => activo.categoria.descripcion))
  );

  const uniqueSubcategories = Array.from(
    new Set(activos.map((activo) => activo.subcategoria.descripcion))
  );

  const uniqueBodega = Array.from(
    new Set(activos.map((activo) => activo.bodega_info.bod_nombre))
  );

  const uniqueEstado = Array.from(
    new Set(activos.map((activo) => activo.estado))
  );

  const uniqueEstadoPropiedad = Array.from(
    new Set(activos.map((activo) => activo.estado_propiedad))
  );

  const uniqueUsuarios = Array.from(
    new Set(
      activos.flatMap((activo) =>
        activo.usuarios ? Object.values(activo.usuarios).map((u: any) => u.nombre) : []
      )
    )
  );
  

  const uniqueArea = Array.from(
    new Set(activos.map((activo) => activo.area.descripcion))
  );

  // const formatNumber = (value: any) => {
  //   if (typeof value === "string") {
  //     return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  //   }
  //   return value.toLocaleString("es-ES", {
  //     minimumFractionDigits: 0,
  //     maximumFractionDigits: 2,
  //   });
  // };

  // const formatNumberNuevo = (
  //   value: Float32Array | undefined | number | string
  // ) => {
  //   if (value === null || value === undefined) return "";

  //   // Si el valor es un Float32Array, toma el primer elemento
  //   const numberValue = Array.isArray(value)
  //     ? value[0]
  //     : typeof value === "number"
  //     ? value
  //     : Number(value);
  //   const flooredValue = Math.floor(numberValue);

  //   // Formatea el número
  //   return new Intl.NumberFormat("es-CO").format(flooredValue);
  // };

  const openModal = (id: number) => {
    setSelectedActivoId(id);
    setVisibleModal(true);
  };

  // Método para cerrar el modal
  const closeModal = () => {
    setVisibleModal(false);
  };

  const getAdjuntos = (id: number) => {
    setActivoModalId(id); // Guardamos el ID del mantenimiento
    setModalVisible(true); // Abrimos el modal
  };

  const closeModalArchivos = () => {
    setModalVisible(false); // Cerramos el modal
    setActivoModalId(null); // Reiniciamos el ID
  };

  // Columnas base
  const columns: ColumnsType<Activos> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      align: "center",
    },
    {
      title: "Activo",
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
      width: 200,
      render: (usuarios: Record<string, { nombre: string }>) => {
        console.log("Usuarios recibidos:", usuarios, "Tipo:", typeof usuarios);
    
        if (!usuarios || Object.keys(usuarios).length === 0) {
          return <span>Desconocido</span>;
        }
    
        // Convertimos el objeto a un array y aseguramos el tipado correcto
        const listaUsuarios = Object.values(usuarios) as { nombre: string }[];
    
        return <span>{listaUsuarios.map((usuario) => usuario.nombre).join(", ")}</span>;
      }
    },
    
    {
      title: "Localización",
      dataIndex: "bodega_info",
      key: "bodega_info",
      width: 90,
      render: (bodega_info: { bod_nombre: string }) => (
        <span>{bodega_info.bod_nombre || "Desconocido"}</span>
      ),
    },
    {
      title: "Categoría",
      dataIndex: "categoria",
      key: "categoria",
      width: 110,
      render: (categoria: { descripcion: string }) => (
        <span>{categoria.descripcion || "Desconocido"}</span>
      ),
    },
    {
      title: "Sub Categoría",
      dataIndex: "subcategoria",
      key: "subcategoria",
      width: 110,

      render: (subcategoria: { descripcion: string }) => (
        <span>{subcategoria.descripcion || "Desconocido"}</span>
      ),
    },
    {
      title: "Area",
      dataIndex: "area",
      key: "area",
      width: 115,
      render: (area: { descripcion: string }) => (
        <span>{area?.descripcion || "Desconocido"}</span>
      ),
    },
    {
      title: "Fecha de Compra",
      dataIndex: "fecha_compra",
      key: "fecha_compra",
      width: 90,
    },
    {
      title: "Parámetros",
      key: "datos",
      width:200,
      render: (
        _: any,
        {
          datos,
        }: {
          datos: {
            parametro_sub_categoria: { parametro: { descripcion: string } };
            valor_almacenado: string;
          }[];
        }
      ) => {
        return (
          <>
            {datos.map((dato, index) => (
              <div key={index}>
                <span style={{ fontWeight: "bold", color: "black" }}>
                  {dato.parametro_sub_categoria.parametro.descripcion}
                </span>
                <span>: {dato.valor_almacenado}</span>
              </div>
            ))}
          </>
        );
      },
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      align: "center",
      width: 150,

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
        } else if (record.estado === "3") {
          estadoString = "PENDIENTE";
          color = "blue";
          disableChange = true; // Deshabilita el cambio de estado
        } else if (record.estado === "4") {
          estadoString = "MANTENIMIENTO";
          disableChange = false;
          color = "pink";
        } else if(record.estado === "5"){
          estadoString = "VENCIDO";
          color = "red";
          disableChange = true;
        }


        // Renderiza solo el Tag sin la funcionalidad de cambio de estado
        return (
          <Tooltip title={estadoString}>
            <Tag color={color}>{estadoString.toUpperCase()}</Tag>
          </Tooltip>
        );
      },
      sorter: (a, b) => a.estado.localeCompare(b.estado),
    },
    {
      title: "Estado Propiedad",
      dataIndex: "estado_propiedad",
      key: "estado_propiedad",
      align: "center",
      render: (_: any, record: Activos) => {
        let estadoString = "";
        let color;
        let disableChange = false;

        if (record.estado_propiedad === "1") {
          estadoString = "PROPIO";
          color = "pink";
          disableChange = true;
        } else if (record.estado_propiedad === "0") {
          estadoString = "ALQUILADO";
          disableChange = true;
          color = "brown";
        } else if (record.estado === "3") {
          estadoString = "PENDIENTE";
          color = "blue";
          disableChange = true; // Deshabilita el cambio de estado
        } else if (record.estado === "4") {
          estadoString = "CANCELADO";
          color = "gray";
          disableChange = true;
        } 

        // Renderiza solo el Tag sin la funcionalidad de cambio de estado
        return (
          <Tooltip title={estadoString}>
            <Tag color={color}>{estadoString.toUpperCase()}</Tag>
          </Tooltip>
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
          <Tooltip title="Depreciacion">
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

          <Tooltip title="Ver soportes">
            <Button
              key={record.id + "consultar"}
              size="small"
              onClick={() => getAdjuntos(record.id)}
            >
              <CloudServerOutlined />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <StyledCard title="Inventario">
        <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Buscar Activos"
              prefix={<SearchOutlined />}
              allowClear
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </Col>

          <DepreciacionActivoModal
            idActivo={Number(selectedActivoId)} // Pasar el ID del activo seleccionado
            visible={visibleModal}
            onClose={closeModal}
          />

          <AdjuntosModal
            visible={modalVisible}
            onClose={closeModalArchivos}
            activoModalId={activoModalId ?? -1}
            hideDeleteButton={true}
          />

          <Col xs={24} sm={12} md={8}>
            <Select
              mode="multiple"
              placeholder="Filtrar por Categorías"
              style={{ width: "100%" }}
              onChange={(values) => setSelectedCategories(values)}
            >
              {uniqueCategories.map((categoria) => (
                <Option key={categoria} value={categoria}>
                  {categoria}
                </Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Select
              mode="multiple"
              placeholder="Filtrar por Subcategorías"
              style={{ width: "100%" }}
              onChange={(values) => setSelectedSubcategories(values)}
            >
              {uniqueSubcategories.map((subcategoria) => (
                <Option key={subcategoria} value={subcategoria}>
                  {subcategoria}
                </Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Select
              mode="multiple"
              placeholder="Filtrar por sede/localizacion"
              style={{ width: "100%" }}
              onChange={(values) => setSelectedBodegas(values)}
            >
              {uniqueBodega.map((bodega) => (
                <Option key={bodega} value={bodega}>
                  {bodega}
                </Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Select
              mode="multiple"
              placeholder="Filtrar por estado"
              style={{ width: "100%" }}
              onChange={(values) => setSelectedEstado(values)}
            >
              {uniqueEstado.map((estado) => (
                <Option key={estado} value={String(estado)}>
                  {/* Convertimos a string */}
                  {String(estado) === "0"
                    ? "Inactivo"
                    : String(estado) === "1"
                    ? "Activo"
                    : String(estado) === "2"
                    ? "Pendiente"
                    : String(estado) === "3"
                    ? "Pendiente"
                    : String(estado) === "4"
                    ? "Mantenimiento"
                    : String(estado) === "5"
                    ? "Vencido"
                    : "Desconocido"}{" "}
                  {/* Comparación con string para mostrar el estado */}
                </Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Select
              mode="multiple"
              placeholder="Filtrar por estado propiedad"
              style={{ width: "100%" }}
              onChange={(values) => setSelectedEstadoPropiedad(values)}
            >
              {uniqueEstadoPropiedad.map((estadoP) => (
                <Option key={estadoP} value={String(estadoP)}>
                  {" "}
                  {/* Convertimos a string */}
                  {String(estadoP) === "0" ? "Alquilado" : "Propio"}{" "}
                  {/* Hacemos la comparación con cadenas */}
                </Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Select
              mode="multiple"
              placeholder="Filtrar por usuarios"
              style={{ width: "100%" }}
              onChange={(values) => setSelectedUsuarios(values)}
            >
              {uniqueUsuarios.map((usuario) => (
                <Option key={usuario} value={usuario}>
                  {usuario}
                </Option>
              ))}
            </Select>
          </Col>


          <Col xs={24} sm={12} md={8}>
            <Select
              mode="multiple"
              placeholder="Filtrar por area"
              style={{ width: "100%" }}
              onChange={(values) => setSelectedArea(values)}
            >
              {uniqueArea.map((area) => (
                <Option key={area} value={area}>
                  {area}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>

        <Table
          bordered
          rowKey={(record) => record.id.toString()}
          size="small"
          columns={columns}
          dataSource={filteredActivos}
          scroll={{ x: 1800 }}
          loading={loaderTable}
          pagination={{
            total: pagination?.total,
            pageSize: pagination?.per_page,
            simple: true,
            onChange: (page) => setCurrentPage(page),
          }}
        />
      </StyledCard>
    </Layout>
  );
};
