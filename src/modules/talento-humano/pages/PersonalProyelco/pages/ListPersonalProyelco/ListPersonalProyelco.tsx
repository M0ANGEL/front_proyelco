import { useEffect, useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Button, 
  Tag, 
  Tooltip, 
  Typography, 
  Modal, 
  Form, 
  Input as AntInput,
  Alert,
  Spin,
  List,
  notification,
  Popconfirm
} from "antd";
import { 
  SyncOutlined, 
  ExclamationCircleOutlined,
  PlusOutlined 
} from "@ant-design/icons";

// Componentes globales
import { DataTable } from "@/components/global/DataTable";
import { BackButton } from "@/components/global/BackButton";
import { GlobalCard } from "@/components/global/GlobalCard";
import { SearchBar } from "@/components/global/SearchBar";
import { BotonesOpciones } from "@/components/global/BotonesOpciones";

import { KEY_ROL } from "@/config/api";
import dayjs from "dayjs";
import { DeletePersonal, getPersonales, checkActivosPendientes } from "@/services/talento-humano/personalAPI";
import useSessionStorage from "@/hooks/useSessionStorage";

const { Text, Title } = Typography;
const { TextArea } = AntInput;
const { confirm } = Modal;

interface DataType {
  key: number;
  nombres: string;
  estado: string;
  identificacion: number;
  cargo: string;
  genero: string;
  telefono_celular: string;
  created_at: string;
  updated_at: string;
  fecha_ingreso: string;
  fecha_nacimiento: string;
  tipo_documento: string;
  estado_civil: string;
  salario: string;
  valor_hora: string;
}

interface ActivoType {
  id: number;
  nombre: string;
  numero_activo: string;
}

interface ActivosResponse {
  tieneActivosPendientes: boolean;
  totalActivosPendientes: number;
  activos: ActivoType[];
}

interface InactivarForm {
  motivo: string;
}

export const ListPersonalProyelco = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loadingRow, setLoadingRow] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<DataType | null>(null);
  const [activosPendientes, setActivosPendientes] = useState<boolean>(false);
  const [activosLista, setActivosLista] = useState<ActivoType[]>([]);
  const [checkingActivos, setCheckingActivos] = useState<boolean>(false);
  const [form] = Form.useForm();
  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);

  useEffect(() => {
    fetchPersonal();
  }, []);

  const fetchPersonal = async () => {
    try {
      setLoading(true);
      const response = await getPersonales();
      const personalData = response?.data?.data || [];

      const personal: DataType[] = personalData.map((persona: any) => ({
        key: persona.id,
        nombres: persona.nombre_completo?.toUpperCase() || "",
        estado: persona.estado?.toString() || "0",
        tipo_documento: persona.tipo_documento?.toUpperCase() || "",
        identificacion: persona.identificacion,
        telefono_celular: persona.telefono_celular || "",
        genero: persona.genero?.toUpperCase() || "",
        cargo: persona.cargo?.toUpperCase() || "",
        estado_civil: persona.estado_civil?.toUpperCase() || "",
        salario: Number(persona.salario || 0).toLocaleString("es-CO"),
        valor_hora: Number(persona.valor_hora || 0).toLocaleString("es-CO"),
        created_at: dayjs(persona?.created_at).format("DD-MM-YYYY HH:mm"),
        updated_at: dayjs(persona?.updated_at).format("DD-MM-YYYY HH:mm"),
        fecha_ingreso: dayjs(persona?.fecha_ingreso).format("DD-MM-YYYY"),
        fecha_nacimiento: dayjs(persona?.fecha_nacimiento).format("DD-MM-YYYY"),
      }));

      setInitialData(personal);
      setDataSource(personal);
    } catch (error) {
      notification.error({
        message: "Error al cargar el personal",
        description: "No se pudieron cargar los datos del personal"
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Función de búsqueda global
  const handleSearch = (value: string) => {
    setSearchText(value);
    if (!value.trim()) {
      setDataSource(initialData);
      return;
    }
    const filteredData = initialData.filter((persona) =>
      Object.values(persona).some(
        (val) => val && String(val).includes(value.toUpperCase())
      )
    );
    setDataSource(filteredData);
  };

  const handleResetSearch = () => {
    setSearchText("");
    setDataSource(initialData);
  };

  // 🔹 Navegación
  const handleEdit = (record: DataType) => {
    navigate(`${location.pathname}/edit/${record.key}`);
  };


  // Verificar activos pendientes antes de inactivar
  const handleInactivarClick = async (empleado: DataType) => {
    setSelectedEmployee(empleado);
    setCheckingActivos(true);
    
    try {
      const response = await checkActivosPendientes(empleado.key);
      const responseData: ActivosResponse = response.data.data;
      const tieneActivos = responseData.tieneActivosPendientes;

      setActivosPendientes(tieneActivos);
      setActivosLista(responseData.activos || []);
      
      if (tieneActivos) {
        showActivosPendientesAlert(empleado, responseData.activos);
      } else {
        setModalVisible(true);
      }
    } catch (error) {
      console.error("Error al verificar activos:", error);
      setModalVisible(true);
    } finally {
      setCheckingActivos(false);
    }
  };

  const showActivosPendientesAlert = (empleado: DataType, activos: ActivoType[]) => {
    confirm({
      title: 'No se puede inactivar el empleado - Activos Pendientes',
      icon: <ExclamationCircleOutlined />,
      width: 700,
      content: (
        <div>
          <Alert
            message="Activos Pendientes por Liberar"
            description={
              <div>
                <p style={{ marginBottom: 16 }}>
                  <strong>{empleado.nombres}</strong> tiene <strong>{activos.length} activos</strong> pendientes por liberar. 
                  No puede ser retirado hasta que se liberen todos los activos asignados.
                </p>
                
                <div style={{ 
                  maxHeight: '300px', 
                  overflowY: 'auto',
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px',
                  padding: '12px'
                }}>
                  <List
                    size="small"
                    dataSource={activos}
                    renderItem={(activo) => (
                      <List.Item>
                        <div style={{ width: '100%' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <Text strong>{activo.nombre}</Text>
                              <br />
                              <Text type="secondary">N° Activo: {activo.numero_activo}</Text>
                            </div>
                            <Tag color="orange">Pendiente</Tag>
                          </div>
                        </div>
                      </List.Item>
                    )}
                  />
                </div>
                
                <div style={{ marginTop: 16, padding: '12px', backgroundColor: '#fff2e8', borderRadius: '6px' }}>
                  <Text type="warning">
                    <ExclamationCircleOutlined /> Por favor, contacte el area encargada
                    para liberar estos activos antes de proceder con la inactivación.
                  </Text>
                </div>
              </div>
            }
            type="error"
            showIcon
          />
        </div>
      ),
      okText: 'Entendido',
      cancelButtonProps: { style: { display: 'none' } },
      onOk() {
        setSelectedEmployee(null);
      },
    });
  };

  // Confirmar inactivación
  const handleConfirmInactivar = async (values: InactivarForm) => {
    if (!selectedEmployee) return;

    setLoadingRow([...loadingRow, selectedEmployee.key]);
    setModalVisible(false);

    try {
      await DeletePersonal(selectedEmployee.key, values.motivo);
      await fetchPersonal();
      form.resetFields();
      
      notification.success({
        message: 'Empleado inactivado exitosamente',
        description: `${selectedEmployee.nombres} ha sido inactivado correctamente.`,
      });
    } catch (error) {
      console.error("Error al inactivar empleado:", error);
      notification.error({
        message: 'Error',
        description: 'No se pudo inactivar el empleado. Por favor, intente nuevamente.',
      });
    } finally {
      setLoadingRow(loadingRow.filter((id: any) => id !== selectedEmployee.key));
      setSelectedEmployee(null);
    }
  };

  const handleCancelModal = () => {
    setModalVisible(false);
    setSelectedEmployee(null);
    form.resetFields();
  };

  // 🔹 Generar filtros dinámicos por columna
  const getColumnFilters = (dataIndex: keyof DataType) => {
    const uniqueValues = Array.from(
      new Set(initialData.map((d) => d[dataIndex]))
    );
    return uniqueValues.map((val) => ({
      text: String(val),
      value: String(val),
    }));
  };

  // 🔹 Columnas
  const columns = useMemo(
    () => [
      {
        title: "FECHA INGRESO",
        dataIndex: "fecha_ingreso",
        key: "fecha_ingreso",
        width: 120,
        sorter: (a: DataType, b: DataType) => 
          a.fecha_ingreso.localeCompare(b.fecha_ingreso),
        filters: getColumnFilters("fecha_ingreso"),
        onFilter: (value, record) => record.fecha_ingreso.includes(value as string),
      },
      {
        title: "FECHA NACIMIENTO",
        dataIndex: "fecha_nacimiento",
        key: "fecha_nacimiento",
        width: 140,
        sorter: (a: DataType, b: DataType) => 
          a.fecha_nacimiento.localeCompare(b.fecha_nacimiento),
        filters: getColumnFilters("fecha_nacimiento"),
        onFilter: (value, record) => record.fecha_nacimiento.includes(value as string),
      },
      {
        title: "NOMBRE COMPLETO",
        dataIndex: "nombres",
        key: "nombres",
        width: 200,
        sorter: (a: DataType, b: DataType) => a.nombres.localeCompare(b.nombres),
        filters: getColumnFilters("nombres"),
        onFilter: (value, record) => record.nombres.includes(value as string),
      },
      {
        title: "GÉNERO",
        dataIndex: "genero",
        key: "genero",
        width: 100,
        filters: getColumnFilters("genero"),
        onFilter: (value, record) => record.genero.includes(value as string),
      },
      {
        title: "ESTADO CIVIL",
        dataIndex: "estado_civil",
        key: "estado_civil",
        width: 120,
        filters: getColumnFilters("estado_civil"),
        onFilter: (value, record) => record.estado_civil.includes(value as string),
      },
      {
        title: "TIPO DOCUMENTO",
        dataIndex: "tipo_documento",
        key: "tipo_documento",
        width: 130,
        filters: getColumnFilters("tipo_documento"),
        onFilter: (value, record) => record.tipo_documento.includes(value as string),
      },
      {
        title: "CÉDULA",
        dataIndex: "identificacion",
        key: "identificacion",
        width: 120,
        filters: getColumnFilters("identificacion"),
        onFilter: (value, record) => record.identificacion.toString().includes(value as string),
      },
      {
        title: "TELÉFONO",
        dataIndex: "telefono_celular",
        key: "telefono_celular",
        width: 120,
        filters: getColumnFilters("telefono_celular"),
        onFilter: (value, record) => record.telefono_celular.includes(value as string),
      },
      {
        title: "CARGO",
        dataIndex: "cargo",
        key: "cargo",
        width: 150,
        filters: getColumnFilters("cargo"),
        onFilter: (value, record) => record.cargo.includes(value as string),
      },
      {
        title: "SALARIO",
        dataIndex: "salario",
        key: "salario",
        width: 120,
        align: "right" as const,
        filters: getColumnFilters("salario"),
        onFilter: (value, record) => record.salario.includes(value as string),
      },
      {
        title: "VALOR HORA",
        dataIndex: "valor_hora",
        key: "valor_hora",
        width: 120,
        align: "right" as const,
        filters: getColumnFilters("valor_hora"),
        onFilter: (value, record) => record.valor_hora.includes(value as string),
      },
      {
        title: "ESTADO",
        dataIndex: "estado",
        key: "estado",
        align: "center",
        width: 120,
        filters: [
          { text: "ACTIVO", value: "1" },
          { text: "INACTIVO", value: "0" },
        ],
        onFilter: (value, record) => record.estado === value,
        render: (_, record: DataType) => {
          const isActive = record.estado === "1";
          const color = isActive ? "green" : "red";
          const estadoString = isActive ? "ACTIVO" : "INACTIVO";
          const canEdit = ["Talento Humano", "Administrador"].includes(user_rol);

          return (
            <Popconfirm
              title="¿Desea cambiar el estado?"
              onConfirm={() => handleInactivarClick(record)}
              disabled={!isActive || !canEdit}
              placement="left"
            >
              <Tooltip title={isActive && canEdit ? "Inactivar empleado" : "Empleado inactivo"}>
                <Tag
                  color={color}
                  key={estadoString}
                  icon={
                    loadingRow.includes(record.key) ? (
                      <SyncOutlined spin />
                    ) : null
                  }
                  style={{ 
                    cursor: isActive && canEdit ? "pointer" : "default",
                    margin: 0 
                  }}
                >
                  {estadoString.toUpperCase()}
                </Tag>
              </Tooltip>
            </Popconfirm>
          );
        },
      },
      {
        title: "ACCIONES",
        key: "acciones",
        align: "center",
        width: 100,
        fixed: 'right' as const,
        render: (_: any, record: DataType) => (
          <BotonesOpciones
            botones={[
              {
                tipo: "editar",
                label: "Editar",
                onClick: () => handleEdit(record),
              },
            ]}
          />
        ),
      },
    ],
    [initialData, loadingRow, user_rol]
  );

  return (
    <div>
      <BackButton text="Volver al Dashboard" to="/dashboard" />

      <GlobalCard
        title="Gestión de Personal"
        extra={
          <Link to={`${location.pathname}/create`}>
            <Button type="primary" icon={<PlusOutlined />}>
              Crear
            </Button>
          </Link>
        }
      >
        <SearchBar
          onSearch={handleSearch}
          onReset={handleResetSearch}
          placeholder="Buscar por nombre, cédula, cargo, teléfono..."
          showFilterButton={false}
        />

        <DataTable
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey="key"
          scrollX={1500}
          customClassName="custom-table"
          hasFixedColumn={true}
        />

        <div
          style={{
            marginTop: 16,
            padding: "12px 16px",
            background: "#f8f9fa",
            borderRadius: "6px",
            border: "1px solid #e9ecef",
          }}
        >
          <Text type="secondary">
            💡 <strong>TIP:</strong> Solo usuarios con rol de Talento Humano o Administrador pueden inactivar empleados.
          </Text>
        </div>
      </GlobalCard>

      {/* Modal de Inactivación */}
      <Modal
        title="Inactivar Empleado"
        open={modalVisible}
        onCancel={handleCancelModal}
        footer={null}
        width={600}
      >
        {checkingActivos ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin size="large" />
            <Text style={{ display: 'block', marginTop: 16 }}>Verificando activos pendientes...</Text>
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleConfirmInactivar}
          >
            <div style={{ marginBottom: 16 }}>
              <Alert
                message="Confirmar Inactivación"
                description={
                  <div>
                    <p>Está a punto de inactivar al empleado:</p>
                    <Title level={4} style={{ margin: '8px 0', color: '#1890ff' }}>
                      {selectedEmployee?.nombres}
                    </Title>
                    <p><strong>Identificación:</strong> {selectedEmployee?.identificacion}</p>
                    <p><strong>Cargo:</strong> {selectedEmployee?.cargo}</p>
                    <p><strong>Fecha de ingreso:</strong> {selectedEmployee?.fecha_ingreso}</p>
                  </div>
                }
                type="info"
                showIcon
              />
            </div>

            <div style={{ marginBottom: 16, padding: '12px', backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '6px' }}>
              <Text type="success">
                ✓ Verificación completada: No se encontraron activos pendientes.
              </Text>
            </div>

            <Form.Item
              name="motivo"
              label="Motivo de inactivación (Obligatorio)"
              rules={[
                { 
                  required: true, 
                  message: 'Por favor ingrese el motivo de inactivación' 
                },
                { 
                  min: 10, 
                  message: 'El motivo debe tener al menos 10 caracteres' 
                },
                {
                  max: 500,
                  message: 'El motivo no puede exceder los 500 caracteres'
                }
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Describa detalladamente el motivo por el cual se inactiva al empleado (mínimo 10 caracteres)..."
                maxLength={500}
                showCount
              />
            </Form.Item>

            <div style={{ textAlign: 'right', marginTop: 24 }}>
              <Button onClick={handleCancelModal} style={{ marginRight: 8 }}>
                Cancelar
              </Button>
              <Button type="primary" htmlType="submit" danger>
                Confirmar Inactivación
              </Button>
            </div>
          </Form>
        )}
      </Modal>
    </div>
  );
};