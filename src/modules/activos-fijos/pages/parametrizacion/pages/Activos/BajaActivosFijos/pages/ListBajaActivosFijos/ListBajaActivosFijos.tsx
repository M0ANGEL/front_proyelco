/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-empty-function */
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
  Tabs,
  Space,
  Tooltip,
} from "antd";
import { SearchOutlined, PlusOutlined,CheckOutlined,CloseOutlined} from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { cancelarBajaActivosFijos, getListaBajaActivosFijos } from "@/services/activos/BajaActivosFijosAPI";
import { dataVendido, dataChatarra, dataDonacion, dataPendientes } from "./types";
import { fetchUserProfile } from "@/services/auth/authAPI";
import { aceptarBajaActivo } from "@/services/activos/activosAPI";
import { RedButton } from "@/modules/common/components/ExportExcel/styled";

const { TabPane } = Tabs;
const { Text } = Typography;

export const ListBajaActivosFijos = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [loaderTable, setLoaderTable] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<string>("pendientes");
  const [pagination, setPagination] = useState<{
    total: number;
    per_page: number;
  }>();

  useEffect(() => {
    fetchBajaActivosFijos();
  }, [currentTab]);

  const fetchBajaActivosFijos = async () => {
    setLoaderTable(true);
    try {
      const response = await getListaBajaActivosFijos();
      // Filtra los datos según la pestaña actual
      const filteredData = response.data.filter((item: any) => {
        // Pestaña de Pendientes
        if (currentTab === "pendientes") {
          return item.estado === "pendiente"; // Solo activos con estado '3' (Pendiente)
        }
        // Pestañas de Eliminados
        if (currentTab === "chatarra" && item.activo.estado === "0") {
          return item.motivo === "Chatarra";
        }
        if (currentTab === "donacion" && item.activo.estado === "0") {
          return item.motivo === "Donacion";
        }
        if (currentTab === "venta" && item.activo.estado === "0") {
          return item.motivo === "venta";
        }
        if (currentTab === "cerrados"){
          return item.estado ==="cerrado";
        }
        return false;
      });
      setData(filteredData);
      setPagination({ total: response.total, per_page: response.per_page });
    } catch (error) {
      notification.error({
        message: "Error al cargar datos",
      });
    } finally {
      setLoaderTable(false);
    }
  };


  const handleAccept = async (key: React.Key) => {
    const response = await fetchUserProfile();
    const userId = response.data.userData.id;
    const id = Number(key);
    aceptarBajaActivo(id, userId)
      .then((response) => {
        if (response.status === "success") {
          notification.success({message: "Baja de activo aceptado con éxito"})
        } else {
          notification.error({message: "Error al aceptar la baja de activo"})

        }
      })
      .catch((error) => {
        notification.error({message: "Error en la solicitud"})
        console.error("Error en la solicitud:", error);
      });
  };


  const handleCancelar = async (key: React.Key) => {
    const response = await fetchUserProfile();
    const userId = response.data.userData.id;
    const id = key;
    const params={
      id_usuario : userId,
      id:id
  }
    // Ejemplo: llamar a una función solo con la clave
    cancelarBajaActivosFijos(params)
      .then((response) => {
        if (response.status === "success") {
          notification.success({message: "Baja de activo cancelada con éxito"})
        } else {
          notification.error({message: "Error al cancelar la baja de activo" })
          console.error("Error al cancelar la baja de activo:", response);
        }
      })
      .catch((error) => {
        notification.error({message: "Error en la solicitud" })
        console.error("Error en la solicitud:", error);
      });
  };

  
  

  // Columnas para cada pestaña
  const columnsChatarra: ColumnsType<dataChatarra> = [
    {
      title: "ID Activo",
      dataIndex: "id_activo",
      key: "id_activo",
    },
    {
      title: "Nombre Activo",
      dataIndex: "activo",
      key: "activo",
      render: (activo: { nombre: string }) => (
        <span>{activo.nombre || "no "}</span>
      ),
    },
    {
      title: "Nombre Usuario",
      dataIndex: "usuarios",
      key: "usuarios",
      render: (usuarios: { nombre: string }) => (
        <span>{usuarios?.nombre || "no "}</span>
      ),
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "Motivo",
      dataIndex: "motivo",
      key: "motivo",
    },
    {
      title: "Empresa Chatarra",
      dataIndex: "empresa_chatarra",
      key: "empresa_chatarra",
    },
    {
      title: "Localización",
      dataIndex: "activo",
      key: "activo",
      render: (activo: { localizacion: string }) => (
        <span>{activo?.localizacion || "desconocido"}</span>
      ),
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      render: (activo: { estado: string | number }) => {
        const estadoNumero = Number(activo?.estado); // Convertir a número si es una cadena
    
        let estadoTexto;
    
        switch (estadoNumero) {
          case 1:
            estadoTexto = "Activo";
            break;
          case 0:
            estadoTexto = "Inactivo";
            break;
          case 3:
            estadoTexto = "Pendiente";
            break;
          default:
            estadoTexto = "Desconocido";
        }
    
        return <span>{estadoTexto}</span>;
      },
    },
  ];

  const columnsDonacion: ColumnsType<dataDonacion> = [
    {
      title: "ID Activo",
      dataIndex: "id_activo",
      key: "id_activo",
    },
    {
      title: "Nombre Activo",
      dataIndex: "activo",
      key: "activo",
      render: (usuarios: { nombre: string }) => (
        <span>{usuarios?.nombre || "no "}</span>
      ),
    },
    {
      title: "Nombre Usuario",
      dataIndex: "usuarios",
      key: "usuarios",
      render: (activo: { nombre: string }) => (
        <span>{activo.nombre || "no "}</span>
      ),
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "Motivo",
      dataIndex: "motivo",
      key: "motivo",
    },
    {
      title: "Empresa Donación",
      dataIndex: "empresa_donacion",
      key: "empresa_donacion",
    },
    {
      title: "Localización",
      dataIndex: "activo",
      key: "activo",
      render: (activo: { localizacion: string }) => (
        <span>{activo?.localizacion || "desconocido"}</span>
      ),
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      render: (activo: { estado: string | number }) => {
        const estadoNumero = Number(activo?.estado); // Convertir a número si es una cadena
    
        let estadoTexto;
    
        switch (estadoNumero) {
          case 1:
            estadoTexto = "Activo";
            break;
          case 0:
            estadoTexto = "Inactivo";
            break;
          case 3:
            estadoTexto = "Pendiente";
            break;
          default:
            estadoTexto = "Desconocido";
        }
    
        return <span>{estadoTexto}</span>;
      },
    },
  ];

  const columnsVenta: ColumnsType<dataVendido> = [
    {
      title: "ID Activo",
      dataIndex: "id_activo",
      key: "id_activo",
    },
    {
      title: "Nombre Activo",
      dataIndex: "activo",
      key: "activo",
      render: (activo: { nombre: string }) => (
        <span>{activo.nombre || "no "}</span>
      ),
    },
    {
      title: "Nombre Usuario",
      dataIndex: "usuarios",
      key: "usuarios",
      render: (usuarios: { nombre: string }) => (
        <span>{usuarios?.nombre || "no "}</span>
      ),
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "Motivo",
      dataIndex: "motivo",
      key: "motivo",
    },
    {
      title: "Empresa Venta",
      dataIndex: "empresa_venta",
      key: "empresa_venta",
    },
    {
      title: "Localización",
      dataIndex: "activo",
      key: "activo",
      render: (activo: { localizacion: string }) => (
        <span>{activo?.localizacion || "desconocido"}</span>
      ),
    },
    {
      title: "Precio Venta",
      dataIndex: "precio_venta",
      key: "precio_venta",
    },
    {
      title: "Estado",
      dataIndex: "activo",
      key: "activo",
      render: (activo: { estado: string | number }) => {
        const estadoNumero = Number(activo?.estado); // Convertir a número si es una cadena
    
        let estadoTexto;
    
        switch (estadoNumero) {
          case 1:
            estadoTexto = "Activo";
            break;
          case 0:
            estadoTexto = "Inactivo";
            break;
          case 3:
            estadoTexto = "Pendiente";
            break;
          default:
            estadoTexto = "Desconocido";
        }
    
        return <span>{estadoTexto}</span>;
      },
    }
  ];

  const columnsPendiente: ColumnsType<dataPendientes> = [
    {
      title: "ID Activo",
      dataIndex: "id_activo",
      key: "id_activo",
    },
    {
      title: "Nombre Activo",
      dataIndex: "activo",
      key: "activo",
      render: (activo: { nombre: string }) => (
        <span>{activo.nombre || "no "}</span>
      ),
    },
    {
      title: "Categoria",
      dataIndex: "activo",
      key: "activo",
      render: (activo: { categoria: {descripcion: string }}) => (
        <span>{activo?.categoria.descripcion|| ""}</span>
      ),
    },
    {
      title: "Localización",
      dataIndex: "bodega_info",
      key: "bodega_info",
      render: (bodega_info:{ bod_nombre :string }) => (
        <span>{bodega_info.bod_nombre || "desconocido"}</span>
      ),
    },

    {
      title: "Nombre Usuario",
      dataIndex: "usuarios",
      key: "usuarios",
      render: (usuarios: { nombre: string }) => (
        <span>{usuarios?.nombre || "no "}</span>
      ),
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "Motivo",
      dataIndex: "motivo",
      key: "motivo",
    },
    {
      title: "Estado",
      dataIndex: "activo",
      key: "activo",
      render: (activo: { estado: string }) => {
        let estadoTexto;
        
        switch (activo.estado) {
          case "1":
            estadoTexto = "Activo";
            break;
          case "0":
            estadoTexto = "Inactivo";
            break;
          case "3":
            estadoTexto = "Pendiente";
            break;
          default:
            estadoTexto = "Desconocido";
        }
        
        return <span>{estadoTexto}</span>;
      },
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      fixed: "right",
      render: (_, record) => {
        return (
          <Space>
            <Tooltip title="Aceptar">
              <Button
                key={record.id + "consultar"}
                size="small"
                type="primary"
                onClick={() => handleAccept(record.id)}
              >
                <CheckOutlined />
              </Button>
            </Tooltip>

            <Tooltip title="Cancelar">
              <Button
                key={record.id + "consultar"}
                size="small"
                type="primary"
                onClick={() => handleCancelar(record.id)}
              >
                <CloseOutlined/>
              </Button>
            </Tooltip>


          </Space>

          
        );
      },
      width: 70,
    },
  ];

  const columnsCerrado: ColumnsType<dataPendientes> = [
    {
      title: "ID Activo",
      dataIndex: "id_activo",
      key: "id_activo",
    },
    {
      title: "Nombre Activo",
      dataIndex: "activo",
      key: "activo",
      render: (activo: { nombre: string }) => (
        <span>{activo.nombre || "no "}</span>
      ),
    },
    {
      title: "Categoria",
      dataIndex: "activo",
      key: "activo",
      render: (activo: { categoria: {descripcion: string }}) => (
        <span>{activo?.categoria.descripcion|| ""}</span>
      ),
    },
    {
      title: "Localización",
      dataIndex: "bodega_info",
      key: "bodega_info",
      render: (bodega_info:{ bod_nombre :string }) => (
        <span>{bodega_info.bod_nombre || "desconocido"}</span>
      ),
    },

    {
      title: "Nombre Usuario",
      dataIndex: "usuarios",
      key: "usuarios",
      render: (usuarios: { nombre: string }) => (
        <span>{usuarios?.nombre || "no "}</span>
      ),
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "Motivo",
      dataIndex: "motivo",
      key: "motivo",
    },
    {
      title: "Estado",
      dataIndex: "activo",
      key: "activo",
      render: (activo: { estado: string }) => {
        let estadoTexto;
        
        switch (activo.estado) {
          case "1":
            estadoTexto = "Activo";
            break;
          case "0":
            estadoTexto = "Inactivo";
            break;
          case "3":
            estadoTexto = "Pendiente";
            break;
          default:
            estadoTexto = "Desconocido";
        }
        
        return <span>{estadoTexto}</span>;
      },
    },
  ];

  const getColumns = () => {
    if (currentTab === "chatarra") return columnsChatarra;
    if (currentTab === "donacion") return columnsDonacion;
    if (currentTab === "venta") return columnsVenta;
    if (currentTab === "pendientes") return columnsPendiente;
    if (currentTab === "cerrados") return columnsCerrado;
  };

  return (
    <Layout>
      <StyledCard title="Baja Activos Fijos Farmart">
        <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Buscar Activos"
              prefix={<SearchOutlined />}
              allowClear
              onChange={() => {}}
            />
          </Col>

          <Row justify="end" style={{ marginBottom: 16 }}>

          <Col xs={24} sm={12} md={8}>
          <Space direction="horizontal" size="middle">

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("crear-activo")}
            >
              Crear Baja Activo
            </Button>

            <RedButton
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("crear-activo-masivos")}
            >
              Crear Baja Activos Masivo
            </RedButton>
            </Space>
          </Col>
          </Row>

        </Row>
        <Text>Total Registros: {pagination?.total}</Text>
        <Tabs
          defaultActiveKey="pendientes"
          onChange={(key) => setCurrentTab(key)}
        >
          <TabPane tab="pendientes" key="pendientes">
            <Table
              bordered
              rowKey={(record) => record.id_activo.toString()}
              size="small"
              columns={getColumns()}
              dataSource={data}
              loading={loaderTable}
              pagination={{
                total: pagination?.total,
                pageSize: pagination?.per_page,
                simple: true,
              }}
            />
          </TabPane>

          <TabPane tab="cerrados" key="cerrados">
            <Table
              bordered
              rowKey={(record) => record.id_activo.toString()}
              size="small"
              columns={getColumns()}
              dataSource={data}
              loading={loaderTable}
              pagination={{
                total: pagination?.total,
                pageSize: pagination?.per_page,
                simple: true,
              }}
            />
          </TabPane>


          <TabPane tab="Chatarra" key="chatarra">
            <Table
              bordered
              rowKey={(record) => record.id_activo.toString()}
              size="small"
              columns={getColumns()}
              dataSource={data}
              loading={loaderTable}
              pagination={{
                total: pagination?.total,
                pageSize: pagination?.per_page,
                simple: true,
              }}
            />
          </TabPane>
          <TabPane tab="Donación" key="donacion">
            <Table
              bordered
              rowKey={(record) => record.id_activo.toString()}
              size="small"
              columns={getColumns()}
              dataSource={data}
              loading={loaderTable}
              pagination={{
                total: pagination?.total,
                pageSize: pagination?.per_page,
                simple: true,
              }}
            />
          </TabPane>
          <TabPane tab="Venta" key="venta">
            <Table
              bordered
              rowKey={(record) => record.id_activo.toString()}
              size="small"
              columns={getColumns()}
              dataSource={data}
              loading={loaderTable}
              pagination={{
                total: pagination?.total,
                pageSize: pagination?.per_page,
                simple: true,
              }}
            />
          </TabPane>
        </Tabs>
      </StyledCard>
    </Layout>
  );
};
