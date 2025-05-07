import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SearchBar } from "@/modules/gestionhumana/pages/empleados/pages/ListEmpleados/styled"
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Button, Input, Space, Table, Tooltip, Typography } from "antd";
import { getVacaciones } from "@/services/gestion-humana/vacacionesAPI";
import { ColumnsType } from "antd/es/table";
import { EditOutlined } from "@ant-design/icons";
import { FaFilePdf } from "react-icons/fa6";
import { getvacacionesCartas } from "@/services/gestion-humana/vacacionesAPI";
import useNotification from "antd/es/notification/useNotification";

interface DataType {
  key: number;
  empleado_id: string;
  empleado: string;
  tipo_vacaciones: string;
  fecha_inicio: string;
  fecha_fin: string;
  fecha_reintegro: string;
  user_sys: string;
  periodo: string;
  esta_en_vacaciones: string;
}

const { Text } = Typography;

export const ListVacaciones = () => {
  const location = useLocation();
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loadingRow, setLoadingRow] = useState<boolean>(true);
  const [notificationApi, contextHolder] = useNotification();

  const fetchVacaciones = () => {
    getVacaciones().then(({ data: { data } }) => {
      const vacaciones = data.map((vacacion) => {
        return {
          key: vacacion.id,
          empleado_id: vacacion.empleado_id,
          empleado: vacacion.empleado,
          tipo_vacaciones: vacacion.tipo_vacaciones,
          fecha_inicio: vacacion.fecha_inicio,
          fecha_fin: vacacion.fecha_fin,
          fecha_reintegro: vacacion.fecha_reintegro,
          user_sys: vacacion.user_sys,
          periodo: vacacion.periodo,
          esta_en_vacaciones: vacacion.esta_en_vacaciones,
        };
      });

      setInitialData(vacaciones);
      setDataSource(vacaciones);
      setLoadingRow(false);
    });
  };

  useEffect(() => {
    fetchVacaciones();
  }, []);

  const fetchCartaVacaciones = ($id: string) => {

    getvacacionesCartas($id)
      .then((data) => {
        const file = new Blob([data.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        // Crear un enlace temporal para forzar la descarga
        const link = document.createElement("a");
        link.href = fileURL;
        link.download = "CARTA_VACACIONES.pdf"; // Nombre del archivo a descargar
        document.body.appendChild(link);
        link.click(); // Simular el clic en el enlace para iniciar la descarga
        document.body.removeChild(link); // Eliminar el enlace después de la descarga
      })
      .finally(() => null)
      .catch((error) => {
        notificationApi.open({
          type: "error",
          message: "No se puede generar licencia.",
        });
        console.log(
          "type: " + error,
          "title: " + error.error + "description: " + error.message
        );
      });
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
      title: "Empleado",
      dataIndex: "empleado",
      key: "empleado",
      sorter: (a, b) => a.empleado.localeCompare(b.empleado),
    },
    {
      title: "Tipo carta",
      dataIndex: "tipo_vacaciones",
      key: "tipo_vacaciones",
      sorter: (a, b) => a.tipo_vacaciones.localeCompare(b.tipo_vacaciones),
    },
    {
      title: "Fecha inicio",
      dataIndex: "fecha_inicio",
      key: "fecha_inicio",
    },
    {
      title: "Fecha fin",
      dataIndex: "fecha_fin",
      key: "fecha_fin",
    },
    {
      title: "Fecha reintegro",
      dataIndex: "fecha_reintegro",
      key: "fecha_reintegro",
    },
    {
      title: "Período",
      dataIndex: "periodo",
      key: "periodo",
      sorter: (a, b) => a.periodo.localeCompare(b.periodo),
    },
    {
      title: "Usuario",
      dataIndex: "user_sys",
      key: "user_sys",
      sorter: (a, b) => a.user_sys.localeCompare(b.user_sys),
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      render: (_, record: { key: React.Key }) => {
        return (
          <Space>
            <Tooltip title="Editar">
              <Link to={`${location.pathname}/edit/${record.key}`}>
                <Button size="small" icon={<EditOutlined />} type="primary" />
              </Link>
            </Tooltip>
            <Tooltip title="Generar Documento">
              <Button
                key={record.key + "vacaciones"}
                size="small"
                icon={<FaFilePdf />}
                danger
                onClick={() => fetchCartaVacaciones(record.key.toString())}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const getRowClassName = (record: DataType) => {
    return record.esta_en_vacaciones === "1" ? "highlight-row" : "";
  };

  return (
    <>
      {contextHolder}
      <StyledCard
        title={"Lista de vacaciones de empleados"}
        extra={
          <Link to={`${location.pathname}/create`}>
            <Button type="primary">Crear</Button>
          </Link>
        }
      >
        <SearchBar>
          <Input placeholder="Buscar" onChange={handleSearch} />
        </SearchBar>
        <Table
          className="custom-table"
          rowKey={(record) => record.key}
          size="small"
          dataSource={dataSource ?? initialData}
          columns={columns}
          loading={loadingRow}
          pagination={{
            total: initialData?.length,
            showSizeChanger: true,
            defaultPageSize: 5,
            pageSizeOptions: ["5", "15", "30"],
            showTotal: (total: number) => {
              return <Text>Total Registros: {total}</Text>;
            },
          }}
          bordered
          rowClassName={getRowClassName}
        />
      </StyledCard>
    </>
  );
};
