/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Input, Popconfirm, Space, Tag, Tooltip, Typography } from "antd";
import { EditOutlined, SyncOutlined, HistoryOutlined } from "@ant-design/icons";
import { FaRegEye } from "react-icons/fa";
import Table, { ColumnsType } from "antd/es/table";
import { GreenButton } from "@/modules/aliados/pages/lista-dispensaciones/pages/ListDispensaciones/styled";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { ButtonTag } from "@/modules/admin-usuarios/pages/usuarios/pages/ListUsuarios/styled";
import { SearchBar } from "./styled";
import { ModalTrazabilidad, ModalVerEmpleado } from "../../components";
import { AlertaContrato, Incapacidad } from "@/services/types";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_ROL } from "@/config/api";
import { getEmpleados, setStatusEmpleado } from "@/services/maestras/empleadosAPI";
import { getDiasIncapacidadEmpleado } from "@/services/gestion-humana/incapacidadesAPI";
import { index } from "@/services/gestion-humana/alertasContratosAPI";
import { getDiasIncapacidadEmpleados } from "@/services/gestion-humana/incapacidadesAPI";

const { Text } = Typography;

interface DataType {
  key: number;
  nombre: string;
  cedula: string;
  telefono: string;
  sede: string;
  contrato_id: string;
  contrato: string;
  fecha_inicio: string;
  fecha_fin: string | undefined;
  fecha_fin_prueba: string | null;
  fecha_vacaciones: string | null;
  estado: string;
}

export const ListEmpleados = () => {
  const [loadingRow, setLoadingRow] = useState<any>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [openModalTrazabilidad, setOpenModalTrazabilidad] = useState<boolean>(false);
  const [openModalVerEmpleado, setOpenModalVerEmpleado] = useState<boolean>(false);
  const [empleadoId, setEmpleadoId] = useState<React.Key>();
  const [alertas, setAlertas] = useState<AlertaContrato[]>([]);
  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const filterTable = initialData?.filter((o: any) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setDataSource(filterTable);
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  useEffect(() => {
    fetchAlertas();
  }, []);

  const fetchAlertas = async () => {
    const { data: { data } } = await index();
    setAlertas(data)
  }

  const fetchEmpleados = async () => {
    const { data: { data } } = await getEmpleados();
    const incapacidades = await getDiasIncapacidadEmpleados();

    const empleadosPromises = data.map(async (empleado) => {

      const fechaFinPrueba = empleado.fecha_fin === null ? calcularFechaFinPeriodoPrueba(empleado.fecha_inicio) : null;
      const fechaVacaciones = empleado.fecha_fin === null ? calcularFechaDeVacaciones(empleado.fecha_inicio) : null;

      let fechaFin = empleado.fecha_fin; // puede llegar null 

      if (empleado.fecha_fin && empleado.contrato_id == '5') {
        const registroIncapacidad = incapacidades.data.incapacidades.find(
          (incap: any) => incap.empleado_id === empleado.id.toString()
        );
    
        if (registroIncapacidad) {
          const diasIncapacidad = parseInt(registroIncapacidad.total_dias, 10);
          const fecha = new Date(empleado.fecha_fin);
          fecha.setDate(fecha.getDate() + diasIncapacidad);
          fechaFin = fecha.toISOString().split('T')[0];
        }
      }

      return {
        key: empleado.id,
        nombre: empleado.nombre_completo,
        cedula: empleado.cedula,
        telefono: empleado.telefono,
        sede: empleado.bod_nombre,
        contrato: empleado.contrato,
        contrato_id: empleado.contrato_id,
        fecha_inicio: empleado.fecha_inicio,
        fecha_fin: fechaFin,
        fecha_fin_prueba: fechaFinPrueba,
        fecha_vacaciones: fechaVacaciones,
        estado: empleado.estado,
      };
    });

    const empleados = await Promise.all(empleadosPromises);

    setInitialData(empleados);
    setDataSource(empleados);
    setLoadingRow([]);
    setLoading(false);
  };

  const calcularFechaFinPeriodoPrueba = (fecha: string) => {
    const fechaInicio = new Date(fecha)
    fechaInicio.setDate(fechaInicio.getDate() + 60)
    const fechaPrueba = fechaInicio.toISOString().split('T')[0]
    return fechaPrueba
  }

  const calcularDiasParaTerminarPeriodoPrueba = (fecha: string) => {
    // Fecha futura
    const futureDate = new Date(fecha);
    // Fecha actual
    const currentDate = new Date();
    // Calcular la diferencia en milisegundos
    const differenceInMilliseconds = futureDate.getTime() - currentDate.getTime();
    // Convertir la diferencia a días
    const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24) + 1;

    return Math.round(differenceInDays);
  }

  const calcularFechaDeVacaciones = (fecha: string) => {

    // Convertir la fecha de ingreso en un objeto Date
    const fechaIngresoDate = new Date(fecha);
    // Obtener la fecha actual
    const fechaActual = new Date();
    // Inicializar la fecha de vacaciones como la fecha de ingreso + 1 año
    const fechaVacaciones = new Date(fechaIngresoDate);
    fechaVacaciones.setFullYear(fechaVacaciones.getFullYear() + 1);

    // Mientras la fecha de vacaciones esté en el pasado, suma otro año
    while (fechaVacaciones <= fechaActual) {
      fechaVacaciones.setFullYear(fechaVacaciones.getFullYear() + 1);
    }
    // Formatear la fecha de las próximas vacaciones en 'yyyy-mm-dd'
    const year = fechaVacaciones.getFullYear();
    const month = String(fechaVacaciones.getMonth() + 1).padStart(2, '0'); // Mes es 0-indexado, por lo que sumamos 1
    const day = String(fechaVacaciones.getDate() + 1).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const handleStatus = (id: React.Key) => {
    setLoadingRow([...loadingRow, id]);
    setStatusEmpleado(id)
      .then(() => {
        fetchEmpleados();
      })
      .catch(() => {
        setLoadingRow([]);
      });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
      sorter: (a, b) => a.nombre.localeCompare(b.nombre),
      render: (text) => (
        text ? (
          <Tooltip title={text}>
            {text.length > 20 ? `${text.substring(0, 20)}...` : text}
          </Tooltip>
        ) : null
      ),
    },
    {
      title: "Cédula",
      dataIndex: "cedula",
      key: "cedula",
      sorter: (a, b) => a.cedula.localeCompare(b.cedula),
    },
    {
      title: "Sede",
      dataIndex: "sede",
      key: "sede",
      sorter: (a, b) => a.sede.localeCompare(b.sede),
      render: (text) => (
        text ? (
          <Tooltip title={text}>
            {text.length > 17 ? `${text.substring(0, 17)}...` : text}
          </Tooltip>
        ) : null
      )
    },
    {
      title: "Contrato",
      dataIndex: "contrato",
      key: "contrato",
      sorter: (a, b) => a.contrato.localeCompare(b.contrato),
      render: (text) => (
        text ? (
          <Tooltip title={text}>
            {text.length > 20 ? `${text.substring(0, 20)}...` : text}
          </Tooltip>
        ) : null
      ),
    },
    {
      title: "Télefono",
      dataIndex: "telefono",
      key: "telefono",
      sorter: (a, b) => a.telefono.localeCompare(b.telefono),
    },
    {
      title: "Fecha ingreso",
      dataIndex: "fecha_inicio",
      key: "fecha_inicio",
      sorter: (a, b) => a.fecha_inicio.localeCompare(b.fecha_inicio),
    },
    {
      title: "Fecha salida",
      dataIndex: "fecha_fin",
      key: "fecha_fin",
      align: "center",
      render: (_, record: { key: React.Key; fecha_fin: string | undefined; estado: string; contrato_id: string }) => {
        let color = ''
        if (record.fecha_fin && alertas.length > 0) {
          const dias = calcularDiasParaTerminarPeriodoPrueba(record.fecha_fin)

          if (dias <= parseInt(alertas[0].dias) && record.estado == '1' && record.contrato_id == '5') {
            color = "red";
          }

          if (dias <= parseInt(alertas[1].dias) && record.estado == '1' && record.contrato_id == '2') {
            color = "red";
          }
        }

        return (
          <Tag
            color={color}
            key={record.fecha_fin}
          >
            {record.fecha_fin}
          </Tag>
        );
      },
    },
    {
      title: "Fecha fin prueba",
      dataIndex: "fecha_fin_prueba",
      key: "fecha_fin_prueba",
      align: "center",
      render: (_, record: { key: React.Key; fecha_fin_prueba: string | null; estado: string; contrato_id: string }) => {
        let color = ''

        if (record.fecha_fin_prueba && record.contrato_id == '1' && record.estado == '1' && alertas.length > 0) {
          const diasFinPrueba = calcularDiasParaTerminarPeriodoPrueba(record.fecha_fin_prueba)

          if (diasFinPrueba < parseInt(alertas[2].dias) && Math.round(diasFinPrueba + 1) >= 0) {
            color = "red";
          }
          if (diasFinPrueba <= 0 && record.estado == '1') {
            color = "green";
          }
        }

        if (record.fecha_fin_prueba && record.contrato_id == '3' && record.estado == '1' && alertas.length > 0) {
          const diasFinPrueba = calcularDiasParaTerminarPeriodoPrueba(record.fecha_fin_prueba)

          if (diasFinPrueba < parseInt(alertas[4].dias) && Math.round(diasFinPrueba + 1) >= 0) {
            color = "red";
          }
          if (diasFinPrueba <= 0 && record.estado == '1') {
            color = "green";
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
      title: "Fecha vacaciones",
      dataIndex: "fecha_vacaciones",
      key: "fecha_vacaciones",
      align: "center",
      render: (_, record: { key: React.Key; fecha_vacaciones: string | null; estado: string; contrato_id: string; nombre: string; }) => {
        let color = ''
        
        if (record.fecha_vacaciones && record.estado == '1' && record.contrato_id == '1' && alertas.length > 0) {
          const diasParaVacaciones = calcularDiasParaTerminarPeriodoPrueba(record.fecha_vacaciones) - 1;

          if (diasParaVacaciones <= parseInt(alertas[3].dias) && Math.round(diasParaVacaciones) >= 0) {
            color = 'red'
          }
        }

        if (record.fecha_vacaciones && record.estado == '1' && record.contrato_id == '3' && alertas.length > 0) {
          const diasParaVacaciones = calcularDiasParaTerminarPeriodoPrueba(record.fecha_vacaciones) - 1;

          if (diasParaVacaciones <= parseInt(alertas[5].dias) && Math.round(diasParaVacaciones) >= 0) {
            color = 'red'
          }
        }

        return (
          <Tag
            color={color}
            key={record.fecha_vacaciones}
          >
            {record.fecha_vacaciones}
          </Tag>
        );
      },
    },

    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      align: "center",
      render: (_, record: { key: React.Key; estado: string }) => {
        let estadoString = "";
        let color;
        if (record.estado === "1") {
          estadoString = "ACTIVO";
          color = "green";
        } else {
          estadoString = "INACTIVO";
          color = "red";
        }
        return (
          <Popconfirm
            title="¿Desea cambiar el estado?"
            onConfirm={() => handleStatus(record.key)}
            placement="left"
          >
            <ButtonTag color={color} disabled={!['gh_admin', 'administrador'].includes(user_rol)}>
              <Tooltip title="Cambiar estado">
                <Tag
                  color={color}
                  key={estadoString}
                  icon={
                    loadingRow.includes(record.key) ? (
                      <SyncOutlined spin />
                    ) : null
                  }
                >
                  {estadoString.toUpperCase()}
                </Tag>
              </Tooltip>
            </ButtonTag>
          </Popconfirm>
        );
      },
      sorter: (a, b) => a.estado.localeCompare(b.estado),
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
                <Button icon={<EditOutlined />} type="primary" size="small"/>
              </Link>
            </Tooltip>

            <Tooltip title="Trazabilidad">
              <GreenButton
                type="primary"
                size="small"
                onClick={() => {
                  setEmpleadoId(record.key);
                  setOpenModalTrazabilidad(true);
                }}
              >
                <HistoryOutlined />
              </GreenButton>
            </Tooltip>
            <Tooltip title="Ver">
              <Button
                size="small"
                onClick={() => {
                  setEmpleadoId(record.key);
                  setOpenModalVerEmpleado(true);
                }}
              >
                <FaRegEye />
              </Button>
            </Tooltip>
          </Space>
        );
      },
    },
  ]

  return (
    <>
      <ModalTrazabilidad
        open={openModalTrazabilidad}
        setOpen={(value: boolean) => {
          setOpenModalTrazabilidad(value);
          setEmpleadoId(undefined);
        }}
        id_empleado={empleadoId}
      />
      <ModalVerEmpleado
        open={openModalVerEmpleado}
        setOpen={(value: boolean) => {
          setOpenModalVerEmpleado(value);
          setEmpleadoId(undefined);
        }}
        id_empleado={empleadoId}
      />
      <StyledCard
        title={"Lista de empleados"}
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
          loading={loading}
          pagination={{
            total: initialData?.length,
            showSizeChanger: true,
            defaultPageSize: 5,
            pageSizeOptions: ["5", "15", "30"],
            showTotal: (total: number) => {
              return (
                <Text>Total Registros: {total}</Text>
              );
            },
          }}
          bordered
        />
      </StyledCard>
    </>
  );
};