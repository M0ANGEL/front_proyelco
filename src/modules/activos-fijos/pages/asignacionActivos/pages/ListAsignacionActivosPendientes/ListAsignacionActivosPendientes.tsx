import { CheckOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Space,
  Tooltip,
  notification,
  Tabs,
  Layout,
  Modal,
  Input,
} from "antd";
import Table, { ColumnsType } from "antd/es/table";
import React, { useState, useEffect } from "react";
import { DataType } from "./types";
import { Content } from "antd/es/layout/layout";
import { fetchUserProfile } from "@/services/auth/authAPI";
import {
  aceptarAsignacionActivo,
  getListaAsignarActivosAdministrador,
  getListaAsignarActivosEstadoUsuario,
} from "@/services/activos/asignarActivosAPI";
import { KEY_ROL } from "@/config/api";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { getActivos } from "@/services/activos/activosAPI";
import { ParametrosActivoModal } from "../../../parametrizacion/pages/Activos/pages/components";

export const ListAsignacionActivosPendientes = () => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [dataSourceCerrados, setDataSourceCerrados] = useState<DataType[]>([]);
  const [
    dataSourceAdministradorPendientes,
    setDataSourceAdministradorPendientes,
  ] = useState<DataType[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>("1");
  const [notificationApi, contextHolder] = notification.useNotification();
  const [, setLoaderTable] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedKey, setSelectedKey] = useState<React.Key | null>(null);
  const [observacion, setObservacion] = useState<string>("");
  const { getSessionVariable } = useSessionStorage();
  const rol = getSessionVariable(KEY_ROL);

  const [searchBodega, setSearchBodega] = useState<string>("");
  const [searchUsuario, setSearchUsuario] = useState<string>("");
  
  const [, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [datos, setDatos] = useState<any[]>([]);


  useEffect(() => {
    fetchDocumentos();
    fetchDocumentosCerrados();
    fetchDocumentosAdminPendientes();
  }, []);

  const fetchDocumentos = async () => {
    const estado = "pendiente";
    const response = await fetchUserProfile();
    const id_usuario = response.data.userData.id;
    getListaAsignarActivosEstadoUsuario(estado, id_usuario)
      .then(({ data }) => {
        setDataSource(data.map((item) => ({ key: item.activo.id, ...item })));
      })
      .catch(({ response }) => {
        notificationApi.error({ message: response.data.message, duration: 4 });
      })
      .finally(() => setLoaderTable(false));
  };


  const handleViewDetails = async (id: number) => {
      setLoading(true);
      try {
        const response = await getActivos(id);
        if (response && response.data.data.datos) {
          setDatos(response.data.data.datos);
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



  const fetchDocumentosCerrados = async () => {
    const estado = "cerrado";
    const response = await fetchUserProfile();
    const id_usuario = response.data.userData.id;
    getListaAsignarActivosEstadoUsuario(estado, id_usuario)
      .then(({ data }) => {
        setDataSourceCerrados(
          data.map((item) => ({ key: item.activo.id, ...item }))
        );
      })
      .catch(({ response }) => {
        notificationApi.error({ message: response.data.message, duration: 4 });
      })
      .finally(() => setLoaderTable(false));
  };

  const fetchDocumentosAdminPendientes = async () => {
    getListaAsignarActivosAdministrador()
      .then(({ data }) => {
        setDataSourceAdministradorPendientes(
          data.map((item) => ({ key: item.activo.id, ...item }))
        );
      })
      .catch(({ response }) => {
        notificationApi.error({ message: response.data.message, duration: 4 });
      })
      .finally(() => setLoaderTable(false));
  };

  const handleAccept = async (key: React.Key, observacion: string) => {
    const response = await fetchUserProfile();
    const userId = response.data.userData.id;
    aceptarAsignacionActivo(Number(key), userId, observacion)
      .then(() => {
        notificationApi.success({
          message: "Asignación aceptada con éxito",
          duration: 4,
        });
        fetchDocumentos();
      })
      .catch((error) => console.error("Error en la solicitud:", error));
  };

  const showModal = (key: React.Key) => {
    setSelectedKey(key);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setObservacion("");
    setSelectedKey(null);
  };

  const handleModalAccept = () => {
    if (selectedKey) {
      handleAccept(selectedKey, observacion);
      handleCancel();
    }
  };

  const getFilteredData = (data: any[]) => {
    return data.filter((item) => {
      const matchesBodega = searchBodega
        ? item.bodega_info?.bod_nombre
            ?.toLowerCase()
            .includes(searchBodega.toLowerCase())
        : true;
      const matchesUsuario = searchUsuario
        ? item.user_info?.nombre
            ?.toLowerCase()
            .includes(searchUsuario.toLowerCase())
        : true;
      return matchesBodega && matchesUsuario;
    });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "ID",
      dataIndex: "key",
      key: "key",
      sorter: true,
      align: "center",
      fixed: "left",
      width: 120,
    },
    {
      title: "Activo",
      dataIndex: "activo",
      key: "activo",
      render: (activo) => <span>{activo?.nombre || "Desconocido"}</span>,
    },
    {
      title: "Categoría",
      dataIndex: "activo",
      key: "categoria",
      render: (activo) => (
        <span>
          {activo?.subcategoria?.categoria?.descripcion || "Desconocido"}
        </span>
      ),
    },
    {
      title: "Sub Categoría",
      dataIndex: "activo",
      key: "subcategoria",
      render: (activo) => (
        <span>{activo?.subcategoria?.descripcion || "Desconocido"}</span>
      ),
    },
    {
      title: "Usuario Recibido",
      dataIndex: "user_info",
      key: "user_info",
      render: (user_info) => <span>{user_info?.nombre || "Desconocido"}</span>,
    },
    {
      title: "sede/localizacion",
      dataIndex: "bodega_info",
      key: "bodega_info",
      render: (bodega_info) => (
        <span>{bodega_info?.bod_nombre || "Desconocido"}</span>
      ),
    },
    { title: "Estado", dataIndex: "estado", key: "estado" },
    ...(selectedTab !== "3"
      ? ([
          {
            title: "Acciones",
            dataIndex: "acciones",
            key: "acciones",
            align: "center",
            fixed: "right",
            render: (_: any, record: any) => (
              <Space>
                <Tooltip title="Aceptar">
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => showModal(record.id)}
                  >
                    <CheckOutlined />
                  </Button>
                </Tooltip>

                <Tooltip title="Ver Detalles/Parametros">
                  <Button
                    onClick={() => handleViewDetails(record.activo.id)}
                    size="small"
                  >
                    <SearchOutlined />
                  </Button>{" "}
                </Tooltip>

              </Space>
            ),
            width: 70,
          },
        ] as ColumnsType<DataType>)
      : []),
  ];

  const filteredColumns =
    selectedTab === "2"
      ? columns.filter((col) => col.key !== "acciones")
      : columns;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>

        <ParametrosActivoModal
                open={visible}
                onClose={() => setVisible(false)}
                datos={datos}
              />

        <Content style={{ padding: "20px" }}>
          {contextHolder}

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

          <Tabs activeKey={selectedTab} onChange={setSelectedTab} animated>
            <Tabs.TabPane tab="Pendientes" key="1">
              <Table
                columns={filteredColumns}
                dataSource={getFilteredData(dataSource)}
                scroll={{ x: "max-content" }}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Cerrados" key="2">
              <Table
                columns={filteredColumns}
                dataSource={getFilteredData(dataSourceCerrados)}
                scroll={{ x: "max-content" }}
              />
            </Tabs.TabPane>
            {["af-admin", "gerencia", "administrador"].includes(rol) && (
              <Tabs.TabPane tab="Administrador pendientes" key="3">
                <Table
                  columns={filteredColumns}
                  dataSource={getFilteredData(
                    dataSourceAdministradorPendientes
                  )}
                  scroll={{ x: "max-content" }}
                />
              </Tabs.TabPane>
            )}
          </Tabs>
        </Content>
      </Layout>
      <Modal
        title="Aceptar Asignación de Activo"
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={handleModalAccept}
        okText="Aceptar"
        cancelText="Cancelar"
      >
        <Input.TextArea
          rows={4}
          value={observacion}
          onChange={(e) => setObservacion(e.target.value)}
          placeholder="Ingrese una observación para aceptar la asignación"
        />
      </Modal>
    </Layout>
  );
};
