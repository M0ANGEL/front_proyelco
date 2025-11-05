import { useEffect, useState } from "react";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import {
  Button,
  Input,
  Typography,
  Table,
  Modal,
  Select,
  Col,
  notification,
} from "antd";
import { Link, useLocation } from "react-router-dom";
import { getActiUsers } from "@/services/activosFijos/CrearActivosAPI";
import {
  darPermisosObrasAsistencia,
  getObrasPermisos,
} from "@/services/talento-humano/permisosObrasAPI";

interface DataType {
  key: number;
  rango: string;
  nombre: string;
  usuarios_permisos: string[];
}

const { Text } = Typography;

export const PermisosAsistencia = () => {
  const location = useLocation();

  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [obraSeleccionada, setObraSeleccionada] = useState<DataType | null>(null);
  const [usuarios, setUsuarios] = useState<{ label: string; value: string }[]>([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<string[]>([]);

  useEffect(() => {
    fetchCategorias();
    fetchUsuarios();
  }, []);

  const fetchCategorias = async () => {
    const {
      data: { data },
    } = await getObrasPermisos();

    // 🔹 Convertir usuarios_permisos de string JSON a array
    const categorias = data.map((categoria) => ({
      key: categoria.id,
      rango: categoria.rango,
      nombre: categoria.nombre,
      usuarios_permisos: (() => {
        try {
          return JSON.parse(categoria.usuarios_permisos || "[]");
        } catch {
          return [];
        }
      })(),
    }));

    setInitialData(categorias);
    setDataSource(categorias);
    setLoading(false);
  };

  const fetchUsuarios = async () => {
    const {
      data: { data },
    } = await getActiUsers();
    const listaUsuarios = data.map((u) => ({
      label: u.nombre.toUpperCase(),
      value: u.id.toString(),
    }));
    setUsuarios(listaUsuarios);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    const filtered = initialData.filter((item) =>
      Object.values(item).some((v) =>
        v?.toString().toLowerCase().includes(value)
      )
    );
    setDataSource(filtered);
  };

  const openModal = (record: DataType) => {
    setObraSeleccionada(record);
    setUsuarioSeleccionado(record.usuarios_permisos || []); // ✅ Cargar usuarios de la API
    setModalVisible(true);
  };

  const handleGuardarPermisos = () => {
    setLoading(true);

    const payload = {
      obra_id: obraSeleccionada?.key,
      usuarios: usuarioSeleccionado,
    };

    darPermisosObrasAsistencia(payload)
      .then(() => {
        notification.success({
          message: "Permisos asignados correctamente",
          description: `Se asignaron permisos a la obra ${obraSeleccionada?.nombre}`,
          placement: "topRight",
        });
        setModalVisible(false);

        // 🔄 Refrescar los datos para ver el cambio actualizado en la tabla
        fetchCategorias();
      })
      .catch((err) => {
        notification.error({
          message: "Error al asignar permisos",
          description: err.message || "Ocurrió un error inesperado.",
          placement: "topRight",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const columns = [
    {
      title: "Proyectos / Áreas",
      dataIndex: "nombre",
      key: "nombre",
      sorter: (a: any, b: any) => a.nombre.localeCompare(b.nombre),
      render: (text: string) => text?.toUpperCase(),
    },
    {
      title: "Rango",
      dataIndex: "rango",
      key: "rango",
      sorter: (a: any, b: any) => a.rango.localeCompare(b.rango),
      render: (text: string) => text?.toUpperCase(),
    },
    {
      title: "Acciones",
      key: "acciones",
      align: "center",
      render: (_: any, record: DataType) => (
        <Button
          type="link"
          style={{ backgroundColor: "blue", color: "white" }}
          onClick={() => openModal(record)}
        >
          Asignar permisos
        </Button>
      ),
    },
  ];

  return (
    <>
      <StyledCard
        title="Permisos para sedes o obras"
      >
        <Input
          placeholder="Buscar"
          onChange={handleSearch}
          style={{ marginBottom: 12 }}
        />
        <Table
          rowKey={(record) => record.key}
          size="small"
          dataSource={dataSource}
          columns={columns}
          loading={loading}
          pagination={{
            total: initialData.length,
            showSizeChanger: true,
            defaultPageSize: 15,
            showTotal: (total) => <Text>Total Registros: {total}</Text>,
          }}
          bordered
        />
      </StyledCard>

      {/* MODAL */}
      <Modal
        title={`Asignar permisos a la obra: ${
          obraSeleccionada?.nombre ?? ""
        }`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleGuardarPermisos}
        okText="Guardar"
        cancelText="Cancelar"
        confirmLoading={loading}
      >
        <Col xs={24} sm={24} style={{ width: "100%" }}>
          <label style={{ fontWeight: 500 }}>Usuarios para asignación</label>
          <Select
            mode="multiple"
            showSearch
            allowClear
            placeholder="Seleccione uno o varios usuarios"
            options={usuarios}
            style={{ width: "100%", marginTop: 8 }}
            value={usuarioSeleccionado} // ✅ Mostrar los usuarios seleccionados desde la API
            onChange={(value) =>
              setUsuarioSeleccionado(value.map((v) => String(v)))
            }
            filterOption={(input, option) =>
              (option?.label ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          />
        </Col>
      </Modal>
    </>
  );
};
