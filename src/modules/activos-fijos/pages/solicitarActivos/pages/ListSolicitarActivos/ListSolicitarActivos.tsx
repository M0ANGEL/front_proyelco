/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { TabsProps, Tabs, Layout, Row, Col, Table, Button, Tooltip, Tag } from "antd";
import { useState, useEffect } from "react";
import { ColumnsType } from "antd/es/table";
import { solicitarActivos, solicitarActivosCerrados } from "./types";
import { PlusOutlined} from "@ant-design/icons";
import {
  getListaSolicitarActivosxUsuario,
} from "@/services/activos/solicitarActivosAPI";
import { fetchUserProfile } from "@/services/auth/authAPI";
import { useNavigate } from "react-router-dom";

export const ListSolicitarActivos = () => {
  const [activeTabKey, setActiveTabKey] = useState<string>("pendientes");
  const [dataSolicitarActivos, setSolicitarActivos] = useState<
    solicitarActivos[]
  >([]);
  const [dataSolicitarActivosCerrados, setSolicitarActivosCerrados] = useState<
    solicitarActivosCerrados[]
  >([]);
  const [loaderTable] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [ loaderTable]);

  const fetchData = async () => {
    try {
      const response = await fetchUserProfile();
      const userId = response.data.userData.id;

      const { data } = await getListaSolicitarActivosxUsuario(userId);
      const pendientes: solicitarActivos[] = [];
      const cerradas: solicitarActivosCerrados[] = [];

      data.forEach((item: any) => {
        if (item.estado === "pendiente") {
          pendientes.push({
            key: item.id,
            nombre_solicitud: item.nombre_solicitud,
            descripcion: item.descripcion,
            id_usuario: item.user_info.nombre,
            id_localizacion: item.bodega_info.bod_nombre,
            id_area: item.area.descripcion,
            id_categoria: item.categoria.descripcion,
            id_subCategoria: item.subcategoria.descripcion,
            cantidad: item.cantidad,
            estado: item.estado,
            user_id: userId,
          });
        } else if (item.estado === "cerrado") {
          cerradas.push({
            key: item.id,
            nombre_solicitud: item.nombre_solicitud,
            descripcion: item.descripcion,
            id_usuario: item.user_info.nombre,
            id_localizacion: item.bodega_info.bod_nombre,
            id_area: item.area.descripcion,
            id_categoria: item.categoria.descripcion,
            id_subCategoria: item.subcategoria?.descripcion,
            cantidad: item.cantidad,
            estado: item.estado,
            fecha_recibido: item.fecha_recibido,
            user_id: userId,
          });
        }
      });

      setSolicitarActivos(pendientes);
      setSolicitarActivosCerrados(cerradas);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const columnsPendiente: ColumnsType<solicitarActivos> = [
    {
      title: "ID",
      dataIndex: "key",
      key: "key",
      width: 100,
      align: "center",
    },
    {
      title: "Nombre",
      dataIndex: "nombre_solicitud",
      key: "nombre_solicitud",
    },
    {
      title: "descripcion",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "usuario solicito",
      dataIndex: "id_usuario",
      key: "id_usuario",
    },
    {
      title: "Solicitado en sede",
      dataIndex: "id_localizacion",
      key: "id_localizacion",
    },
    {
      title: "Solicitado en area",
      dataIndex: "id_area",
      key: "id_area",
    },
    {
      title: "Categoria",
      dataIndex: "id_categoria",
      key: "id_categoria",
    },
    {
      title: "subcategoria",
      dataIndex: "id_subCategoria",
      key: "id_subCategoria",
    },
    {
      title: "cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
    },
    {
      title: "estado",
      dataIndex: "estado",
      key: "estado",
      render: (_: any, record: solicitarActivos) => {
        let estadoString = "";
        let color;
        let disableChange = false;

        if (record.estado === 'pendiente') {
          estadoString = "PENDIENTE";
          color = "blue";
          disableChange = true;
        } else if (record.estado === 'cerrado') {
          estadoString = "CERRADO";
          disableChange = true;
          color = "red";
        } else if (record.estado === '') {
          estadoString = "CANCELADO";
          disableChange = false;
          color = "gray";
        }

        // Renderiza solo el Tag sin la funcionalidad de cambio de estado
        return (
          <Tooltip title={estadoString}>
            <Tag color={color}>{estadoString.toUpperCase()}</Tag>
          </Tooltip>
        );
      }
    }
    ];

  const columnsCerrados: ColumnsType<solicitarActivosCerrados> = [
    {
      title: "ID",
      dataIndex: "key",
      key: "key",
      width: 100,
      align: "center",
    },
    {
      title: "Nombre",
      dataIndex: "nombre_solicitud",
      key: "nombre_solicitud",
    },
    {
      title: "descripcion",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "usuario solicito",
      dataIndex: "id_usuario",
      key: "id_usuario",
    },
    {
      title: "Solicitado en sede",
      dataIndex: "id_localizacion",
      key: "id_localizacion",
    },
    {
      title: "Solicitado en area",
      dataIndex: "id_area",
      key: "id_area",
    },
    {
      title: "Categoria",
      dataIndex: "id_categoria",
      key: "id_categoria",
    },
    {
      title: "subcategoria",
      dataIndex: "id_subCategoria",
      key: "id_subCategoria",
    },
    {
      title: "cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
    },
    {
      title: "estado",
      dataIndex: "estado",
      key: "estado",
      render: (_: any, record: solicitarActivosCerrados) => {
        let estadoString = "";
        let color;
        let disableChange = false;

        if (record.estado === 'pendiente') {
          estadoString = "PENDIENTE";
          color = "blue";
          disableChange = true;
        } else if (record.estado === 'cerrado') {
          estadoString = "CERRADO";
          disableChange = true;
          color = "red";
        } else if (record.estado === '') {
          estadoString = "CANCELADO";
          disableChange = false;
          color = "gray";
        }

        // Renderiza solo el Tag sin la funcionalidad de cambio de estado
        return (
          <Tooltip title={estadoString}>
            <Tag color={color}>{estadoString.toUpperCase()}</Tag>
          </Tooltip>
        );
      },
      // sorter: (a, b) => a.estado.localeCompare(b.estado),
    },
    {
      title: "fecha aceptado",
      dataIndex: "fecha_recibido",
      key: "fecha_recibido",
    },
  ];

  const getTable = () => {
    switch (activeTabKey) {
      case "pendientes":
        return (
          <>
            <Row justify="end" style={{ marginBottom: 16 }}>
              <Col>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => navigate("crear-solicitar-activos")} 
                >
                  Crear Solicitud De Activo
                </Button>
              </Col>
            </Row>
            <Table rowKey="key" columns={columnsPendiente} dataSource={dataSolicitarActivos} />
          </>
        );
      case "cerrados":
        return (
          <>
            <Row justify="end" style={{ marginBottom: 16 }}>
              <Col>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => navigate("crear-solicitar-activos")} 
                  >
                  Crear Solicitud De Activo
                </Button>
              </Col>
            </Row>
            <Table rowKey="key" columns={columnsCerrados} dataSource={dataSolicitarActivosCerrados} />
          </>
        );
      default:
        return null;
    }
  };

  const items: TabsProps["items"] = [
    { key: "pendientes", label: "PENDIENTES", children: getTable() },
    { key: "cerrados", label: "CERRADOS", children: getTable() },
  ];

  

  return (
    <Layout>
      <Row justify="center" style={{ padding: "20px" }}>
        <Col span={24}>
          <StyledCard>
            <Tabs
              defaultActiveKey="pendientes"
              onChange={setActiveTabKey}
              items={items}
            />
          </StyledCard>
        </Col>
      </Row>
    </Layout>
  );
};
