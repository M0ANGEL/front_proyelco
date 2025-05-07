import { useEffect, useState } from "react";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Input, Typography, Button } from "antd";
import { SearchBar } from "@/modules/gestionhumana/pages/empleados/pages/ListEmpleados/styled";
import Table, { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { getMaUsuarios } from "@/services/marcaciones-asistencias/ma_usuariosApi";
import { ModalFoto } from "./ModalFoto"; // Importa el modal
import { ImUserCheck } from "react-icons/im";

interface DataType {
  key: number;
  nombre_completo: string;
  cedula: string;
  telefono: number;
  bod_nombre: string;
  nombre_cargo: string;
  created_at: string;
  foto_url: string;
}

const { Text } = Typography;

export const UsuariosRegistrados = () => {
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<DataType | null>(null);

  useEffect(() => {
    fetchUsuariosRegistrados();
  }, []);

  const fetchUsuariosRegistrados = () => {
    getMaUsuarios().then(({ data: { data } }) => {
      const categorias = data.map((categoria) => ({
        key: categoria.id,
        nombre_completo: categoria.nombre_completo,
        cedula: categoria.cedula,
        telefono: categoria.telefono,
        bod_nombre: categoria.bod_nombre,
        nombre_cargo: categoria.nombre_cargo,
        created_at: dayjs(categoria?.created_at).format("DD-MM-YYYY HH:mm"),
        foto_url: categoria.foto_url, // Usar la URL de la imagen
      }));

      setInitialData(categorias);
      setDataSource(categorias);
      setLoading(false);
    });
  };

  const handleOpenModal = (record: DataType) => {
    setSelectedUser(record);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedUser(null);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const filterTable = initialData?.filter((o: any) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setDataSource(filterTable);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Nombre Completo",
      dataIndex: "nombre_completo",
      key: "nombre_completo",
      sorter: (a, b) => a.nombre_completo.localeCompare(b.nombre_completo),
    },
    {
      title: "Documento",
      dataIndex: "cedula",
      key: "cedula",
      sorter: (a, b) => a.cedula.localeCompare(b.cedula),
    },
    {
      title: "Bodega Usuario",
      dataIndex: "bod_nombre",
      key: "bod_nombre",
      sorter: (a, b) => a.bod_nombre.localeCompare(b.bod_nombre),
    },
    {
      title: "Cargo",
      dataIndex: "nombre_cargo",
      key: "nombre_cargo",
      sorter: (a, b) => a.nombre_cargo.localeCompare(b.nombre_cargo),
    },
    {
      title: "Acciones",
      align: "center",
      key: "acciones",
      render: (_, record: DataType) => (
        <Button type="primary" onClick={() => handleOpenModal(record)}>
          <ImUserCheck />
        </Button>
      ),
    },
  ];

  return (
    <StyledCard title="Usuarios Registrados">
      <SearchBar>
        <Input placeholder="Buscar" onChange={handleSearch} />
      </SearchBar>
      <Table
        className="custom-table"
        rowKey={(record) => record.key}
        size="small"
        dataSource={dataSource ?? initialData}
        columns={columns}
        loading={loading}
        pagination={{
          total: initialData?.length,
          showSizeChanger: true,
          defaultPageSize: 15,
          pageSizeOptions: ["5", "15", "30"],
          showTotal: (total: number) => <Text>Total Registros: {total}</Text>,
        }}
        bordered
      />

      {/* Modal de la Foto */}
      {selectedUser && (
        <ModalFoto
          visible={modalVisible}
          onClose={handleCloseModal}
          nombre={selectedUser.nombre_completo}
          fotoUrl={selectedUser.foto_url} // Aquí pasamos la URL de la foto
        />
      )}
    </StyledCard>
  );
};
