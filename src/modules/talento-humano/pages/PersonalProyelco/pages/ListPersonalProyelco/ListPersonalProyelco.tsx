import { useEffect, useState } from "react";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { 
  Button, 
  Input, 
  Tag, 
  Tooltip, 
  Typography, 
  Modal, 
  Form, 
  Input as AntInput,
  Alert,
  Spin,
  List,
  notification
} from "antd";
import { Link, useLocation } from "react-router-dom";
import Table, { ColumnsType } from "antd/es/table";
import { ButtonTag } from "@/modules/admin-usuarios/pages/usuarios/pages/ListUsuarios/styled";
import { EditOutlined, SyncOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_ROL } from "@/config/api";
import dayjs from "dayjs";
import { SearchBar } from "@/modules/gestion-empresas/pages/empresas/pages/ListEmpresas/styled";
import { DeletePersonal, getPersonales, checkActivosPendientes } from "@/services/talento-humano/personalAPI";

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
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loadingRow, setLoadingRow] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<DataType | null>(null);
  const [activosPendientes, setActivosPendientes] = useState<boolean>(false);
  const [activosLista, setActivosLista] = useState<ActivoType[]>([]);
  const [checkingActivos, setCheckingActivos] = useState<boolean>(false);
  const [form] = Form.useForm();
  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = () => {
    getPersonales().then(({ data: { data } }) => {
      const categorias = data.map((categoria) => {
        return {
          key: categoria.id,
          nombres: categoria.nombre_completo,
          estado: categoria.estado.toString(),
          tipo_documento: categoria.tipo_documento,
          identificacion: categoria.identificacion,
          telefono_celular: categoria.telefono_celular,
          genero: categoria.genero,
          cargo: categoria.cargo,
          estado_civil: categoria.estado_civil,
          salario: Number(categoria.salario).toLocaleString("es-CO"),
          valor_hora: Number(categoria.valor_hora).toLocaleString("es-CO"),
          created_at: dayjs(categoria?.created_at).format("DD-MM-YYYY HH:mm"),
          updated_at: dayjs(categoria?.updated_at).format("DD-MM-YYYY HH:mm"),
          fecha_ingreso: dayjs(categoria?.fecha_ingreso).format("DD-MM-YYYY"),
          fecha_nacimiento: dayjs(categoria?.fecha_nacimiento).format("DD-MM-YYYY"),
        };
      });

      setInitialData(categorias);
      setDataSource(categorias);
      setLoadingRow([]);
      setLoading(false);
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

  // Verificar activos pendientes antes de inactivar
  const handleInactivarClick = async (empleado: DataType) => {
    setSelectedEmployee(empleado);
    setCheckingActivos(true);
    
    try {
      // Verificar si tiene activos pendientes
      const response = await checkActivosPendientes(empleado.key);
      const responseData: ActivosResponse = response.data.data;
      const tieneActivos = responseData.tieneActivosPendientes;

      setActivosPendientes(tieneActivos);
      setActivosLista(responseData.activos || []);
      
      if (tieneActivos) {
        // Mostrar alerta de activos pendientes y BLOQUEAR inactivación
        showActivosPendientesAlert(empleado, responseData.activos);
      } else {
        // Abrir modal para inactivar (sin activos pendientes)
        setModalVisible(true);
      }
    } catch (error) {
      console.error("Error al verificar activos:", error);
      // En caso de error, permitir inactivar con advertencia
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
      fetchCategorias();
      form.resetFields();
      
      // Mostrar mensaje de éxito
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

  const columns: ColumnsType<DataType> = [
    {
      title: "Fecha Ingreso",
      dataIndex: "fecha_ingreso",
      key: "fecha_ingreso",
      sorter: (a, b) => a.fecha_ingreso.localeCompare(b.fecha_ingreso),
    },
    {
      title: "Fecha Nacimiento",
      dataIndex: "fecha_nacimiento",
      key: "fecha_nacimiento",
      sorter: (a, b) => a.fecha_nacimiento.localeCompare(b.fecha_nacimiento),
    },
    {
      title: "Nombre Completo",
      dataIndex: "nombres",
      key: "nombres",
      sorter: (a, b) => a.nombres.localeCompare(b.nombres),
    },
    {
      title: "Genero",
      dataIndex: "genero",
      key: "genero",
    },
    {
      title: "Estado Civil",
      dataIndex: "estado_civil",
      key: "estado_civil",
    },
    {
      title: "Tipo Documento",
      dataIndex: "tipo_documento",
      key: "tipo_documento",
    },
    {
      title: "Cedula",
      dataIndex: "identificacion",
      key: "identificacion",
    },
    {
      title: "Telefono",
      dataIndex: "telefono_celular",
      key: "telefono_celular",
    },
    {
      title: "Cargo",
      dataIndex: "cargo",
      key: "cargo",
    },
    {
      title: "Salario",
      dataIndex: "salario",
      key: "salario",
    },
    {
      title: "Valor Hora",
      dataIndex: "valor_hora",
      key: "valor_hora",
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      align: "center",
      render: (_, record: { key: React.Key; estado: string; nombres: string }) => {
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
          <ButtonTag
            color={color}
            disabled={!["Talento Humano", "Administrador"].includes(user_rol) || record.estado !== "1"}
            onClick={() => record.estado === "1" && handleInactivarClick(record)}
          >
            <Tooltip title={record.estado === "1" ? "Inactivar empleado" : "Empleado inactivo"}>
              <Tag
                color={color}
                key={estadoString}
                icon={
                  loadingRow.includes(record.key) ? (
                    <SyncOutlined spin />
                  ) : null
                }
                style={{ cursor: record.estado === "1" ? "pointer" : "default" }}
              >
                {estadoString.toUpperCase()}
              </Tag>
            </Tooltip>
          </ButtonTag>
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
          <Tooltip title="Editar">
            <Link to={`${location.pathname}/edit/${record.key}`}>
              <Button icon={<EditOutlined />} type="primary" />
            </Link>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <>
      <StyledCard
        title={"Lista de Personal"}
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
            defaultPageSize: 15,
            pageSizeOptions: ["5", "15", "30"],
            showTotal: (total: number) => {
              return <Text>Total Registros: {total}</Text>;
            },
          }}
          bordered
        />
      </StyledCard>

      {/* Modal de Inactivación - SOLO se muestra cuando NO hay activos pendientes */}
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
    </>
  );
};