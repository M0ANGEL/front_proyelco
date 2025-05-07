/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { CheckOutlined } from "@ant-design/icons";
import { Button, Space, Tooltip, notification, Tabs, Layout, Modal, Input } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useState, useEffect } from "react";
import { DataType } from "./types";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import dayjs from "dayjs";
import {
  aceptarTraslado,
  getListaTrasladosActivosPorBodegaYEstado,
} from "@/services/activos/trasladosActivosAPI";
import { KEY_BODEGA } from "@/config/api";
import { Content } from "antd/es/layout/layout";
import { fetchUserProfile } from "@/services/auth/authAPI";

export const ListTrasladosActivosPendientes = () => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [, setLoaderTable] = useState<boolean>(true);
  const [, setPagination] = useState<{ total: number; per_page: number }>();
  const { getSessionVariable } = useSessionStorage();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [observacion, setObservacion] = useState("");
  const [selectedKey, setSelectedKey] = useState();

  useEffect(() => {
    fetchDocumentos();
  }, []);

  const fetchDocumentos = () => {
    const bodega = getSessionVariable(KEY_BODEGA);
    const bodegaN = Number(bodega);
    const estado = "aceptadoGerencia";
    getListaTrasladosActivosPorBodegaYEstado(estado, bodegaN)
      .then(({ data }) => {
        const documentos: DataType[] = data.map((item) => {
          return {
            key: item.id,
            bodega_origen: item.bodega_origen_info.bod_nombre,
            bodega_destino: item.bodega_destino_info.bod_nombre,
            id_activo: item.activo.nombre,
            fecha_traslado: new Date(item.fecha_traslado), // Convertido a Date
            estado: item.estado,
            fecha_recibido: item.fecha_recibido
              ? new Date(item.fecha_recibido)
              : new Date(), // Proporcionar fecha predeterminada
            descripcion: item.descripcion,
            user_origen: item.user_origen_info.nombre,
            user_destino: item.user_destino_info.nombre,
          };
        });
        setDataSource(documentos);
        setPagination({
          total: data.length, // Asegúrate de que esto sea correcto
          per_page: 10, // Ajusta el tamaño de página según sea necesario
        });
      })
      .catch(
        ({
          response,
          response: {
            data: { errors },
          },
        }) => {
          if (errors) {
            const errores: string[] = Object.values(errors);
            for (const error of errores) {
              notificationApi.open({
                type: "error",
                message: error,
                duration: 4,
              });
            }
          } else {
            notificationApi.open({
              type: "error",
              message: response.data.message,
              duration: 4,
            });
          }
        }
      )
      .finally(() => {
        setLoaderTable(false);
      });
  };

  const showModal = (key: any) => {
    setSelectedKey(key); // Guarda el ID seleccionado
    setIsModalVisible(true); // Muestra el modal
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Oculta el modal
    setObservacion(""); // Limpia el campo de texto
  };

  const handleOk = () => {
    if (!observacion.trim()) {
      alert("Debe ingresar una observación."); // Validación
      return;
    }

    // Llamar al método handleAccept pasando el key y la observación
    handleAccept(observacion, selectedKey);

    // Cerrar el modal después de aceptar
    setIsModalVisible(false);
    setObservacion("");
  };

  const handleAccept = async (observacion: string, key?: React.Key) => {
    const response = await fetchUserProfile();
    const userId = response.data.userData.id;
    const id_activo = Number(key);
    aceptarTraslado(id_activo, userId, observacion)
      .then((response) => {
        if (response.status === "success") {
          notification.success({ message: "Traslado aceptado con éxito" });
        } else {
          notification.error({ message: "Error al aceptar el traslado" });
        }
      })
      .catch((error) => {
        notification.error({ message: "Error en la solicitud" });
        console.error("Error en la solicitud:", error);
      });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "traslado Act Salida ",
      dataIndex: "key",
      key: "key",
      sorter: true,
      align: "center",
      fixed: "left",
      width: 120,
    },
    {
      title: "Activo",
      dataIndex: "id_activo",
      key: "id_activo",
      render: ( record: any) => `${record.id_activo} - ${record.nombre_activo}`,
    },
    
    {
      title: "Fecha Traslado",
      dataIndex: "fecha",
      key: "fecha",
      sorter: (a, b) => a.fecha_traslado.getTime() - b.fecha_traslado.getTime(), // Usar getTime para comparación
      render: (date: Date) => dayjs(date).format("YYYY-MM-DD"), // Convertir de vue
    },
    {
      title: "Sede Origen",
      dataIndex: "bodega_origen",
      key: "bodega_orign",
    },
    {
      title: "Sede Destino",
      dataIndex: "bodega_destino",
      key: "bodega_destino",
    },
    {
      title: "Usuario Elaboró",
      dataIndex: "user_origen",
      key: "user_origen",
    },
    {
      title: "Usuario Recibio",
      dataIndex: "user_destino",
      key: "user_destino",
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
    },
    {
      title: "Descripcion",
      dataIndex: "descripcion",
      key: "descripcion",
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
                onClick={() => showModal(record.key)} // Abre el modal
              >
                <CheckOutlined />
              </Button>
            </Tooltip>

            <Modal
              title="Ingrese una Observación"
              visible={isModalVisible}
              onOk={handleOk} // Llama al método handleOk
              onCancel={handleCancel} // Cierra el modal
            >
              <Input.TextArea
                rows={4}
                placeholder="Ingrese la observación..."
                value={observacion}
                onChange={(e) => setObservacion(e.target.value)} // Actualiza el valor
              />
            </Modal>
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
