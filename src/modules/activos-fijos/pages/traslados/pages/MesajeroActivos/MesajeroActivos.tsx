import { useEffect, useState } from "react";
import {
  StyledCard,
  StyledFormItem,
} from "@/modules/common/layout/DashboardLayout/styled";
import { Button, Col, Input, Modal, Row, Tag, Typography, message } from "antd";
import { Link } from "react-router-dom";
import { SearchBar } from "@/modules/gestionhumana/pages/empleados/pages/ListEmpleados/styled";
import Table, { ColumnsType } from "antd/es/table";
import {
  ArrowLeftOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { DeleteActiActivos } from "@/services/activosFijos/CrearActivosAPI";
import { entregaMensajero, getActiActivosMensajeros } from "@/services/activosFijos/TrasladosActivosAPI";
import TextArea from "antd/es/input/TextArea";

interface DataType {
  key: number;
  id: number;
  codigo_traslado: string;
  activo_id: number;
  user_id: number;
  usuarios_asignados: string | null;
  usuarios_confirmaron: string | null;
  aceptacion: number;
  tipo_ubicacion: number;
  ubicacion_actual_id: string;
  ubicacion_destino_id: string;
  observacion: string;
  observacion_rechazo: string | null;
  userRechaza_id: number | null;
  created_at: string;
  updated_at: string;
  mensajero: number;
  usuario: string;
  categoria: string;
  subcategoria: string;
  bodega_origen: string;
  bodega_destino: string;
  numero_activo: string;
  valor: string;
  condicion: number;
  descripcion: string;
}

const { Text } = Typography;

// Componente Modal de Confirmación
const ModalConfirmacion = ({ data, onConfirm, loading }) => {
  const [visible, setVisible] = useState(false);
  const [observacionActivo, setObservacionActivo] = useState("");

  const handleConfirmar = () => {
    if (!observacionActivo.trim()) {
      message.warning("Por favor ingresa una observación antes de confirmar");
      return;
    }
    onConfirm(data.id, observacionActivo);
    setVisible(false);
    setObservacionActivo("");
  };

  return (
    <>
      <Button
        type="primary"
        onClick={() => setVisible(true)}
        style={{
          background: "#003daeff",
          color: "white",
        }}
        icon={<CheckCircleOutlined />}
      >
        Confirmar Entrega
      </Button>

      <Modal
        title={`Confirmar Entrega - ${data.numero_activo}`}
        open={visible}
        onCancel={() => {
          setVisible(false);
          setObservacionActivo("");
        }}
        width={700}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setVisible(false);
              setObservacionActivo("");
            }}
            style={{
              color: "white",
              background: "#ce2222ff",
            }}
            icon={<CloseCircleOutlined />}
          >
            Cancelar
          </Button>,
          <Button
            key="confirm"
            onClick={handleConfirmar}
            style={{
              color: "white",
              background:
                observacionActivo.trim().length !== 0
                  ? "#003daeff"
                  : "#adc0e4ff",
            }}
            disabled={observacionActivo.trim().length === 0 || loading}
            loading={loading}
            icon={<CheckCircleOutlined />}
          >
            Confirmar Entrega
          </Button>,
        ]}
        centered
      >
        <Row gutter={16}>
          {/* Información Principal del Activo */}
          <Col xs={24} sm={12}>
            <StyledFormItem label="Código de Traslado" labelCol={{ span: 24 }}>
              <Input value={data.codigo_traslado} disabled />
            </StyledFormItem>
          </Col>

          <Col xs={24} sm={12}>
            <StyledFormItem label="Número de Activo" labelCol={{ span: 24 }}>
              <Input value={data.numero_activo} disabled />
            </StyledFormItem>
          </Col>

          <Col xs={24} sm={12}>
            <StyledFormItem label="Categoría" labelCol={{ span: 24 }}>
              <Input value={data.categoria} disabled />
            </StyledFormItem>
          </Col>

          <Col xs={24} sm={12}>
            <StyledFormItem label="Subcategoría" labelCol={{ span: 24 }}>
              <Input value={data.subcategoria} disabled />
            </StyledFormItem>
          </Col>

          {/* Información de Traslado */}
          <Col xs={24} sm={12}>
            <StyledFormItem label="Bodega Origen" labelCol={{ span: 24 }}>
              <Input value={data.bodega_origen} disabled />
            </StyledFormItem>
          </Col>

          <Col xs={24} sm={12}>
            <StyledFormItem label="Bodega Destino" labelCol={{ span: 24 }}>
              <Input value={data.bodega_destino} disabled />
            </StyledFormItem>
          </Col>

          <Col xs={24} sm={12}>
            <StyledFormItem label="Fecha de Traslado" labelCol={{ span: 24 }}>
              <Input
                value={dayjs(data.created_at).format("DD/MM/YYYY HH:mm")}
                disabled
              />
            </StyledFormItem>
          </Col>

          <Col xs={24} sm={12}>
            <StyledFormItem label="Solicitado por" labelCol={{ span: 24 }}>
              <Input value={data.usuario} disabled />
            </StyledFormItem>
          </Col>

          <Col xs={24}>
            <StyledFormItem
              label="Descripción del Activo"
              labelCol={{ span: 24 }}
            >
              <TextArea value={data.descripcion} disabled rows={2} />
            </StyledFormItem>
          </Col>

          {/* Observación de Confirmación */}
          <Col xs={24}>
            <StyledFormItem
              label="Observación de Confirmación *"
              labelCol={{ span: 24 }}
              required
              help="Ingresa una observación sobre el estado del activo al momento de la entrega"
            >
              <TextArea
                allowClear
                placeholder="Describe el estado del activo al momento de la entrega, cualquier observación o detalle relevante..."
                rows={4}
                value={observacionActivo}
                onChange={(e) => setObservacionActivo(e.target.value)}
                maxLength={500}
                showCount
              />
            </StyledFormItem>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export const MesajeroActivos = () => {
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loadingRow, setLoadingRow] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchTraslados();
  }, []);

  const fetchTraslados = () => {
    setLoading(true);
    getActiActivosMensajeros()
      .then(({ data: { data } }) => {
        const traslados = data.map((traslado) => {
          return {
            key: traslado.id,
            id: traslado.id,
            codigo_traslado: traslado.codigo_traslado,
            activo_id: traslado.activo_id,
            user_id: traslado.user_id,
            usuarios_asignados: traslado.usuarios_asignados,
            usuarios_confirmaron: traslado.usuarios_confirmaron,
            aceptacion: traslado.aceptacion,
            tipo_ubicacion: traslado.tipo_ubicacion,
            ubicacion_actual_id: traslado.ubicacion_actual_id,
            ubicacion_destino_id: traslado.ubicacion_destino_id,
            observacion: traslado.observacion,
            observacion_rechazo: traslado.observacion_rachazo,
            userRechaza_id: traslado.userRechaza_id,
            created_at: traslado.created_at,
            updated_at: traslado.updated_at,
            mensajero: traslado.mensajero,
            usuario: traslado.usuario,
            categoria: traslado.categoria,
            subcategoria: traslado.subcategoria,
            bodega_origen: traslado.bodega_origen,
            bodega_destino: traslado.bodega_destino,
            numero_activo: traslado.numero_activo,
            descripcion: traslado.descripcion,
            condicion: traslado.condicion,
            descripcion: traslado.descripcion,
          };
        });

        setInitialData(traslados);
        setDataSource(traslados);
        setLoadingRow([]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching traslados:", error);
        setLoading(false);
      });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const filterTable = initialData?.filter((o: DataType) =>
      Object.keys(o).some((k) =>
        String(o[k as keyof DataType])
          .toLowerCase()
          .includes(value.toLowerCase())
      )
    );
    setDataSource(filterTable);
  };

  // Función para confirmar entrega
  const ConfirmarEntrega = (id: number, observacion: string) => {
    setLoadingRow([...loadingRow, id]);

    // Aquí deberías enviar la observación a tu API
    console.log("Confirmando entrega:", { id, observacion });
    const data = {
      'observacion': observacion,
      'id': id
    }

    // Ejemplo de llamada a la API con observación
    entregaMensajero(data) // Ajusta esta llamada según tu API
      .then(() => {
        message.success("Entrega confirmada exitosamente");
        fetchTraslados();
      })
      .catch((error) => {
        console.error("Error confirmando entrega:", error);
        message.error("Error al confirmar la entrega");
        setLoadingRow(loadingRow.filter((rowId: number) => rowId !== id));
      });
  };

  const getCondicionTag = (condicion: number) => {
    let estadoString = "";
    let color = "";

    switch (condicion) {
      case 1:
        estadoString = "BUENO";
        color = "green";
        break;
      case 2:
        estadoString = "REGULAR";
        color = "orange";
        break;
      case 3:
        estadoString = "MALO";
        color = "red";
        break;
      default:
        estadoString = "DESCONOCIDO";
        color = "default";
    }

    return estadoString;
  };

  const getCondicionColor = (condicion: number) => {
    switch (condicion) {
      case 1:
        return "green";
      case 2:
        return "orange";
      case 3:
        return "red";
      default:
        return "default";
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Código Traslado",
      dataIndex: "codigo_traslado",
      key: "codigo_traslado",
      sorter: (a, b) => a.codigo_traslado.localeCompare(b.codigo_traslado),
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Número Activo",
      dataIndex: "numero_activo",
      key: "numero_activo",
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Categoría",
      dataIndex: "categoria",
      key: "categoria",
      sorter: (a, b) => a.categoria.localeCompare(b.categoria),
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Subcategoría",
      dataIndex: "subcategoria",
      key: "subcategoria",
      sorter: (a, b) => a.subcategoria.localeCompare(b.subcategoria),
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Descripcion",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "Bodega Origen",
      dataIndex: "bodega_origen",
      key: "bodega_origen",
      sorter: (a, b) => a.bodega_origen.localeCompare(b.bodega_origen),
    },
    {
      title: "Bodega Destino",
      dataIndex: "bodega_destino",
      key: "bodega_destino",
      sorter: (a, b) => a.bodega_destino.localeCompare(b.bodega_destino),
    },
    {
      title: "Condición",
      dataIndex: "condicion",
      key: "condicion",
      align: "center",
      render: (condicion: number, record: DataType) => (
        <Tag
          color={getCondicionColor(condicion)}
          icon={loadingRow.includes(record.id) ? <SyncOutlined spin /> : null}
        >
          {getCondicionTag(condicion)}
        </Tag>
      ),
      sorter: (a, b) => a.condicion - b.condicion,
    },
    {
      title: "Solicitado por",
      dataIndex: "usuario",
      key: "usuario",
      sorter: (a, b) => a.usuario.localeCompare(b.usuario),
    },
    {
      title: "Fecha Traslado",
      dataIndex: "created_at",
      key: "created_at",
      sorter: (a, b) => a.created_at.localeCompare(b.created_at),
      render: (text) => dayjs(text).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      render: (_, record) => (
        <ModalConfirmacion
          data={record}
          onConfirm={ConfirmarEntrega}
          loading={loadingRow.includes(record.id)}
        />
      ),
    },
  ];

  return (
    <StyledCard
      title={"Lista de Activos para Confirmar Entrega"}
      extra={
        <Link to=".." relative="path">
          <Button danger type="primary" icon={<ArrowLeftOutlined />}>
            Volver
          </Button>
        </Link>
      }
    >
      <SearchBar>
        <Input
          placeholder="Buscar por código de traslado, número de activo, categoría, bodega..."
          onChange={handleSearch}
          style={{ marginBottom: 16 }}
        />
      </SearchBar>

      <Table
        className="custom-table"
        rowKey={(record) => record.id}
        size="small"
        dataSource={dataSource}
        columns={columns}
        loading={loading}
        pagination={{
          total: dataSource?.length,
          showSizeChanger: true,
          defaultPageSize: 15,
          pageSizeOptions: ["5", "15", "30", "50"],
          showTotal: (total: number) => {
            return <Text strong>Total de Traslados: {total}</Text>;
          },
        }}
        bordered
        scroll={{ x: 1200 }}
      />
    </StyledCard>
  );
};
