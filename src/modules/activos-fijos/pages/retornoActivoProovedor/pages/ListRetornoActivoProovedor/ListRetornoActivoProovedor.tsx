/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import {
  TabsProps,
  Tabs,
  Layout,
  Row,
  Col,
  Table,
  Button,
  Space,
  Tooltip,
  Upload,
  notification,
} from "antd";
import { useState, useEffect } from "react";
import { ColumnsType } from "antd/es/table";
import { retornoActivoProovedorCerrado, retornoActivoProovedor } from "./types";
import {
  PlusOutlined,
  CheckOutlined,
  CloudServerOutlined,
  UploadOutlined,
  StopOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  aceptarRetornoActivoProovedor,
  cancelarRetornoActivoProvedor,
  cargarAdjuntosRetornos,
  getListaRetornoActivoProovedor,
} from "@/services/activos/retornoActivosProovedorAPI";
import { fetchUserProfile } from "@/services/auth/authAPI";
import { ButtonUpload } from "@/modules/documentos/pages/ventas/pages/dis/components/ListarDocumentos/styled";
import ModalArchivosRetorno from "../Components/ModalArchivosRetorno";
import { RedButton } from "@/modules/common/components/ExportExcel/styled";

export const ListRetornoActivoProovedor = () => {
  const [activeTabKey, setActiveTabKey] = useState<string>("pendientes");
  const [retornosActivosProovedor, setRetornosActivosProovedor] = useState<
    retornoActivoProovedor[]
  >([]);
  const [retornoActivosProovedorCerrado, setRetornosActivosProovedorCerrado] =
    useState<retornoActivoProovedorCerrado[]>([]);
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const [activoModalId, setActivoModalId] = useState<number | null>(null);
  const [loaderTable, setLoaderTable] = useState<boolean>(true);

  const getAdjuntos = (id: number) => {
    setActivoModalId(id); // Guardamos el ID del mantenimiento
    setModalVisible(true); // Abrimos el modal
  };

  const closeModalArchivos = () => {
    setModalVisible(false); // Cerramos el modal
    setActivoModalId(null); // Reiniciamos el ID
  };

  const handleFileChangeImages = async (file: File, activoModalId: number) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      notification.error({
        message: "El archivo no puede superar las 2MB.",
      });
      return isLt2M;
    }

    const formData = new FormData();
    formData.append("imagen", file);
    formData.append("id", activoModalId.toString());

    setLoaderTable(true);

    try {
      // Llamar al método cargarAdjuntos con el FormData y el id
      const response = await cargarAdjuntosRetornos(formData, activoModalId);

      if (response.data?.status === "success") {
        notification.open({
          type: "success",
          message: `Archivo cargado con éxito!`,
        });
        fetchData(); // Refrescar la lista de mantenimientos o archivos
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

  useEffect(() => {
    fetchData();
  }, [loaderTable]);

  const fetchData = async () => {
    try {
      const { data } = await getListaRetornoActivoProovedor();
      const pendientes: retornoActivoProovedor[] = [];
      const cerradas: retornoActivoProovedorCerrado[] = [];

      data.forEach((item: any) => {
        if (item.estado === "pendiente") {
          pendientes.push({
            id: item.id,
            id_activo: item.id_activo,
            usuarios: item.usuarios.nombre,
            descripcion: item.descripcion,
            tipo_retorno: item.tipo_retorno,
            provedoras: item.provedoras.nombre,
            fecha_creacion: item.fecha_creacion,
            precio: item.precio,
            estado: item.estado,
            activo: item.activo
          });
        } else if (item.estado === "cerrado") {
          cerradas.push({
            id: item.id,
            id_activo: item.id_activo,
            usuarios: item.usuarios.nombre,
            descripcion: item.descripcion,
            tipo_retorno: item.tipo_retorno,
            provedoras: item.provedoras.nombre,
            fecha_creacion: item.fecha_creacion,
            precio: item.precio,
            estado: item.estado,
            activo: item.activo,
          });
        }
      });

      setRetornosActivosProovedor(pendientes);
      setRetornosActivosProovedorCerrado(cerradas);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAccept = async (key: React.Key) => {
    const response = await fetchUserProfile();
    const userId = response.data.userData.id;
    const id = Number(key);
    // Ejemplo: llamar a una función solo con la clave
    aceptarRetornoActivoProovedor(id, userId)
      .then((response) => {
        if (response.status === "success") {
          notification.success({message: "retorno provedor aceptado con éxito"})
        } else {
          notification.error({message: "Error al aceptar el retorno del provedor"})
          console.error("Error al aceptar el retorno del provedor:", response);
        }
      })
      .catch((error) => {
        notification.error({message: "Error en la solicitud"})
        console.error("Error en la solicitud:", error);
      });
  };


  const handleRechazar = async (key: React.Key) => {
    const response = await fetchUserProfile();
    const userId = response.data.userData.id;
    const id = Number(key);
    cancelarRetornoActivoProvedor(id,userId)
      .then((response) => {
        console.log(response);
        if (response.data.status === "success") {
          notification.success({message: "Retorno provedor cancelado con éxito"})
        } else {
          notification.error({message: "Error al cancelar el retorno del provedor"})
          console.error("Error al cancelar el retorno del provedor:", response);
        }
      })
      .catch((error) => {
        notification.error({message: "Error en la solicitud"})
        console.error("Error en la solicitud:", error);
      });
  };

  const columnsPendiente: ColumnsType<retornoActivoProovedor> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      align: "center",
    },
    {
      title: "Activo",
      dataIndex: "activo",
      key: "activo",
      render: (_, { activo :{id, nombre} }) =>
        <span>{`${id} - ${nombre}`}</span>,
    },
    
    {
      title: "usuario autoriza",
      dataIndex: "usuarios",
      key: "usuarios",
    },
    {
      title: "descripcion",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "tipo de retorno",
      dataIndex: "tipo_retorno",
      key: "tipo_retorno",
    },
    {
      title: "empresa proovedora del activo",
      dataIndex: "provedoras",
      key: "provedoras",
    },
    {
      title: "fecha creacion solicitud",
      dataIndex: "fecha_creacion",
      key: "fecha_creacion",
    },
    {
      title: "precio",
      dataIndex: "precio",
      key: "precio",
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
                key={record.id + "consultar"}
                size="small"
                type="primary"
                onClick={() => handleAccept(record.id)}
              >
                <CheckOutlined />
              </Button>
            </Tooltip>

            <Tooltip title="Rechazar">
              <RedButton
                key={record.id + "rechazar"}
                size="small"
                type="primary"
                onClick={() => handleRechazar(record.id)}
              >
                <StopOutlined/>
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
          </Space>
        );
      },
      width: 70,
    },
  ];

  const columnsCerrados: ColumnsType<retornoActivoProovedorCerrado> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      align: "center",
    },
     {
      title: "Activo",
      dataIndex: "activo",
      key: "activo",
      render: (_, { activo :{id, nombre} }) =>
        <span>{`${id} - ${nombre}`}</span>,
    },
    {
      title: "usuario autoriza",
      dataIndex: "usuarios",
      key: "usuarios",
    },
    {
      title: "descripcion",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "tipo de retorno",
      dataIndex: "tipo_retorno",
      key: "tipo_retorno",
    },
    {
      title: "empresa proovedora del activo",
      dataIndex: "provedoras",
      key: "provedoras",
    },
    {
      title: "fecha creacion solicitud",
      dataIndex: "fecha_creacion",
      key: "fecha_creacion",
    },
    {
      title: "precio",
      dataIndex: "precio",
      key: "precio",
    },
    {
      title: "estado",
      dataIndex: "estado",
      key: "estado",
    },
  ];

  const getTable = () => {
    switch (activeTabKey) {
      case "pendientes":
        return (
          <>
            <Row justify="end" style={{ marginBottom: 16 }}>
              <Col>
                <Space direction="horizontal" size="middle">
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate("crear-retorno-activo-proovedor")}
                  >
                    Crear Retorno De Activo Proovedor
                  </Button>
                  <RedButton
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() =>
                      navigate("crear-retorno-activo-proovedor-masivos")
                    }
                  >
                    Crear Retorno De Activo Proovedor Masivo
                  </RedButton>
                </Space>
              </Col>
            </Row>
            <Table
              rowKey="key"
              columns={columnsPendiente}
              dataSource={retornosActivosProovedor}
            />
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
                  Crear Retorno De Activo Proovedor
                </Button>
              </Col>
            </Row>
            <Table
              rowKey="key"
              columns={columnsCerrados}
              dataSource={retornoActivosProovedorCerrado}
            />
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

        <ModalArchivosRetorno
          visible={modalVisible}
          onClose={closeModalArchivos}
          activoModalId={activoModalId ?? -1}
        />
      </Row>
    </Layout>
  );
};
