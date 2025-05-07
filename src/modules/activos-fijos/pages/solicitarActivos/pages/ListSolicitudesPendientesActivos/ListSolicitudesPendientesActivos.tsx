/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { CheckOutlined } from "@ant-design/icons";
import { Button, Space, Tooltip, notification, Tabs, Layout } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useState, useEffect } from "react";
import { DataType } from "./types";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_BODEGA } from "@/config/api";
import { Content } from "antd/es/layout/layout";
import { aceptarSolicitudActivos, getListaSolicitarActivosPorBodegaYEstado } from "@/services/activos/solicitarActivosAPI";

export const ListSolicitudesPendientesActivos = () => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [, setLoaderTable] = useState<boolean>(true);
  const {} = useSessionStorage();
  const [, setPagination] = useState<{ total: number; per_page: number }>();
  // const [value, setValue] = useState<string>("");
  const { getSessionVariable } = useSessionStorage();

  useEffect(() => {
    fetchDocumentos();
  }, []);

  const fetchDocumentos = () => {
    const bodega = getSessionVariable(KEY_BODEGA);
    const bodegaN = Number(bodega);  
    const estado = "pendiente";
    getListaSolicitarActivosPorBodegaYEstado(estado, bodegaN)
  .then((response) => {
    const { data } = response;
    if (data) {
      const documentos: DataType[] = data.map((item) => ({
        key: item.id,
        nombre_solicitud: item.nombre_solicitud,
        descripcion: item.descripcion,
        id_localizacion: item.bodega_info.bod_nombre,
        user_info: item.user_info.nombre,
        area: item.area.descripcion,
        categoria: item.categoria.descripcion,
        subcategoria: item.subcategoria.descripcion,
        cantidad: item.cantidad,
        estado: item.estado,
      }));
      setDataSource(documentos);
      setPagination({
        total: data.length,
        per_page: 10,
      });
    } else {
      throw new Error('Data is undefined');
    }
  })
  .catch((error) => {
    console.error('Error in fetchDocumentos:', error);
    notificationApi.open({
      type: 'error',
      message: 'Error al obtener los documentos: ' + error.message,
      duration: 4,
    });
  })
  .finally(() => {
    setLoaderTable(false);
  });}


  const handleAccept = (key: React.Key) => {
    const id = Number(key);

    // Ejemplo: llamar a una función solo con la clave
    aceptarSolicitudActivos(id)
      .then((response) => {
        if (response.status === "success") {
          notification.success({message:"solicitud aceptada con éxito"})
        } else {
          console.error("Error al aceptar la solicitud:", response);
        }
      })
      .catch((error) => {
        console.error("Error en la solicitud:", error);
      });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Id Solicitud",
      dataIndex: "key",
      key: "key",
      sorter: true,
      align: "center",
      fixed: "left",
      width: 120,
    },
    {
      title: "nombre_solicitud",
      dataIndex: "nombre_solicitud",
      key: "nombre_solicitud",
    },
    {
      title: "descripcion",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "usuario",
      dataIndex: "user_info",
      key: "user_info",
    },
    {
      title: "Sede",
      dataIndex: "id_localizacion",
      key: "id_localizacion",
    },
    {
      title: "Area",
      dataIndex: "area",
      key: "area",
    },
    {
      title: "categoria",
      dataIndex: "categoria",
      key: "categoria",
    },
    {
      title: "subcategoria",
      dataIndex: "subcategoria",
      key: "subcategoria",
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
                key={record.key + "consultar"}
                size="small"
                type="primary"
                onClick={() => handleAccept(record.key)}
              >
                <CheckOutlined />
              </Button>
            </Tooltip>
          </Space>
        );
      },
      width: 70,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <Content style={{ padding: "20px" }}>
          {contextHolder}
          <Tabs
            items={[
              {
                key: "1",
                label: "Pendientes",
                children: (
                  <Table
                    columns={columns}
                    dataSource={dataSource}
                    scroll={{ x: "max-content" }}
                  />
                ),
              },
            ]}
            animated
          />
        </Content>
      </Layout>
    </Layout>
  );
};
