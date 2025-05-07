import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Button, Input, Space, Tag, Tooltip, Typography } from "antd";
import { SearchBar } from "../../../empleados/pages/ListEmpleados/styled";
import { EditOutlined } from "@ant-design/icons";
import { FaTshirt } from "react-icons/fa";
import Table, { ColumnsType } from "antd/es/table";
import { getDotacionesEmpleados } from "@/services/gestion-humana/dotacionesAPI";
import { GreenButton } from "@/modules/common/components/ExportExcel/styled";

interface DataType {
  key: number;
  cedula: string;
  nombre_completo: string;
  cargo: string;
  sede: string;
  talla_camisa: string;
  talla_pantalon: string;
  talla_zapatos: string;
  fecha_inicio: string;
  dias_dotacion: string;
  fecha_fin_prueba: string;
  no_entregas_dotaciones_este_anio: string;
  gana_mas_de_dos_salarios: string;
}

const { Text } = Typography;
export const ListEmpleadosDotaciones = () => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();

  useEffect(() => {
    getDotacionesEmpleados().then(({ data: { data } }) => {
      const empleados = data.map((empleado) => {
        return {
          key: empleado.id,
          cedula: empleado.cedula,
          nombre_completo: empleado.nombre_completo,
          cargo: empleado.cargo,
          sede: empleado.sede,
          talla_camisa: empleado.talla_camisa,
          talla_pantalon: empleado.talla_pantalon,
          talla_zapatos: empleado.talla_zapatos,
          fecha_inicio: empleado.fecha_inicio,
          dias_dotacion: empleado.dias_dotacion,
          fecha_fin_prueba: empleado.fecha_fin_prueba,
          no_entregas_dotaciones_este_anio: empleado.no_entregas_dotaciones_este_anio,
          gana_mas_de_dos_salarios: empleado.gana_mas_de_dos_salarios,
        };
      });
      setInitialData(empleados);
      setDataSource(empleados);
      setLoading(false);
    });
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const filterTable = initialData?.filter((o: any) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setDataSource(filterTable);
  };

  const calcularDiasParaTerminarPeriodoPrueba = (fecha: string) => {
    // Fecha futura
    const futureDate = new Date(fecha);
    // Fecha actual
    const currentDate = new Date();
    // Calcular la diferencia en milisegundos
    const differenceInMilliseconds = futureDate.getTime() - currentDate.getTime();
    // Convertir la diferencia a días
    const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24) + 1;

    return differenceInDays;
  }

  const columns: ColumnsType<DataType> = [
    {
      title: "Cédula",
      dataIndex: "cedula",
      key: "cedula",
      sorter: (a, b) => a.cedula.localeCompare(b.cedula),
    },
    {
      title: "Nombre",
      dataIndex: "nombre_completo",
      key: "nombre_completo",
      sorter: (a, b) => a.nombre_completo.localeCompare(b.nombre_completo),
    },
    {
      title: "Cargo",
      dataIndex: "cargo",
      key: "cargo",
      sorter: (a, b) => a.cargo.localeCompare(b.cargo),
    },
    {
      title: "Sede",
      dataIndex: "sede",
      key: "sede",
      sorter: (a, b) => a.sede.localeCompare(b.sede),
    },
    {
      title: "Camisa",
      dataIndex: "talla_camisa",
      key: "talla_camisa",
      sorter: (a, b) => a.talla_camisa.localeCompare(b.talla_camisa),
    },
    {
      title: "Pantalón",
      dataIndex: "talla_pantalon",
      key: "talla_pantalon",
      sorter: (a, b) => a.talla_pantalon.localeCompare(b.talla_pantalon),
    },
    {
      title: "Zapatos",
      dataIndex: "talla_zapatos",
      key: "talla_zapatos",
      sorter: (a, b) => a.talla_zapatos.localeCompare(b.talla_zapatos),
    },
    {
      title: "Fecha inicio",
      dataIndex: "fecha_inicio",
      key: "fecha_inicio",
      sorter: (a, b) => a.fecha_inicio.localeCompare(b.fecha_inicio),
    },
    {
      title: "Fecha fin prueba",
      dataIndex: "fecha_fin_prueba",
      key: "fecha_fin_prueba",
      render: (_, record: { key: React.Key; fecha_fin_prueba: string; no_entregas_dotaciones_este_anio: string}) => {
        let color = ''
        const diasFinPrueba = calcularDiasParaTerminarPeriodoPrueba(record.fecha_fin_prueba)
        
        if (record.no_entregas_dotaciones_este_anio === '0') {
          color = 'green';
        } else {
          if (diasFinPrueba <= 15 && Math.round(diasFinPrueba + 1) >= 0) {
            color = 'red';
          }
          if (diasFinPrueba <= 0) {
            color = 'green';
          }
        }

        return (
          <Tag
            color={color}
            key={record.fecha_fin_prueba}
          >
            {record.fecha_fin_prueba}
          </Tag>
        );
      },
    },

    {
      title: "Dias",
      dataIndex: "dias_dotacion",
      key: "dias_dotacion",
      sorter: (a, b) => a.dias_dotacion.localeCompare(b.dias_dotacion),
      render: (text, record) => {
        let color = '';
    
        if (record.no_entregas_dotaciones_este_anio === '0') {
          color = 'green';
        } else {
    
          if (text < 30 && text > 0) {
            color = 'red';
          }
        }
    
        return (
          <Tag color={color} key={text}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      render: (_, record: { key: React.Key; cedula: string }) => {
        return (
          <Space>
            <Tooltip title="Entregar dotación">
              <Link to={`/gestionhumana/dotaciones/entregas/create/${record.key}`}>
                <GreenButton icon={<FaTshirt />} type="primary" size="small"/>
              </Link>
            </Tooltip>
            <Tooltip title="Editar">
              <Link to={`${location.pathname}/edit/${record.key}`}>
                <Button icon={<EditOutlined />} type="primary" size="small" />
              </Link>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const getRowClassName = (record: DataType) => {
    return record.gana_mas_de_dos_salarios === "1" ? "highlight-row" : "";
  };

  return (
    <StyledCard
      title={"LISTA EMPLEADOS"}
      // extra={
      //   <Link to={`${location.pathname}/create`}>
      //     <Button type="primary">Crear</Button>
      //   </Link>
      // }
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
        loading={loading}
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
  );
};
