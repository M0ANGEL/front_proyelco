import { useEffect, useState } from "react";
import {
  Button,
  Input,
  message,
  Popconfirm,
  Select,
  Space,
  Tag,
  Tooltip,
} from "antd";
import { Link, useLocation } from "react-router-dom";
import { ColumnsType } from "antd/es/table";
import { ButtonTag } from "@/modules/admin-usuarios/pages/usuarios/pages/ListUsuarios/styled";
import { CloseOutlined, SyncOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  DeleteAsignacionRfid,
  DeleteFicha,
  getFichasObra,
  getRfidDisponibles,
  UpdateRfidResponsable,
} from "@/services/talento-humano/fichaObraAPI";
import { DataTable } from "@/components/global/DataTable";
import { BotonesOpciones } from "@/components/global/BotonesOpciones";
import { notify } from "@/components/global/NotificationHandler";
import { StyledCard } from "@/components/layout/styled";

interface DataType {
  key: number;
  id: number;
  nombres: string;
  estado: string;
  rfid: string | null;
  identificacion: number;
  cargo: string;
  genero: string;
  telefono_celular: string;
  created_at: string;
  updated_at: string;
  fecha_ingreso: string;
  fecha_nacimiento: string;
  tipo_documento: string;
  tipo_empleado: string;
  estado_civil: string;
  salario: string;
  valor_hora: string;
}

interface RFDI {
  id: number;
  codigo: string;
}

const { Option } = Select;

export const ListFichasObra = () => {
  const location = useLocation();
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loadingRow, setLoadingRow] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Estados para RFID
  const [rfid, setRfid] = useState<RFDI[]>([]);
  const [loadingRfid, setLoadingRfid] = useState<boolean>(false);

  useEffect(() => {
    fetchFichas();
    fetchRfidDisponibles();
  }, []);

  const fetchFichas = () => {
    getFichasObra()
      .then(({ data: { data } }) => {
        const fichas = data.map((ficha) => {
          return {
            key: ficha.id,
            id: ficha.id,
            nombres: ficha.nombre_completo,
            estado: ficha.estado.toString(),
            tipo_documento: ficha.tipo_documento,
            tipo_empleado:
              ficha.tipo_empleado == 1 ? "PROYELCO" : "NO PROYELCO",
            identificacion: ficha.identificacion,
            telefono_celular: ficha.telefono_celular,
            genero: ficha.genero,
            cargo: ficha.cargo,
            rfid: ficha.rfid,
            estado_civil: ficha.estado_civil,
            salario: Number(ficha.salario).toLocaleString("es-CO"),
            valor_hora: Number(ficha.valor_hora).toLocaleString("es-CO"),
            created_at: dayjs(ficha?.created_at).format("DD-MM-YYYY HH:mm"),
            updated_at: dayjs(ficha?.updated_at).format("DD-MM-YYYY HH:mm"),
            fecha_ingreso: dayjs(ficha?.fecha_ingreso).format("DD-MM-YYYY"),
            fecha_nacimiento: dayjs(ficha?.fecha_nacimiento).format(
              "DD-MM-YYYY"
            ),
          };
        });

        setInitialData(fichas);
        setDataSource(fichas);
        setLoadingRow([]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching fichas:", error);
        setLoading(false);
        notify.error("Error", "No se pudieron cargar las fichas de obra");
      });
  };

  const handleSearch = (value: string) => {
    const filterTable = initialData?.filter((o: any) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setDataSource(filterTable);
  };

  // Cambio de estado
  const handleStatus = (id: React.Key) => {
    setLoadingRow([...loadingRow, id]);
    DeleteFicha(id)
      .then(() => {
        notify.success("Estado de la ficha actualizado con éxito");
        fetchFichas();
      })
      .catch((error) => {
        const msg =
          error.response?.data?.message || "Error al cambiar el estado";
        notify.error("Error", msg);
        setLoadingRow([]);
      });
  };

  const handleEdit = (record: DataType) => {
    // Navegar a la página de edición
    window.location.href = `${location.pathname}/edit/${record.key}`;
  };

  // ✅ Verificar si el select debe estar deshabilitado
  const isRfidSelectDisabled = (rfidValue: string | null): boolean => {
    // Deshabilitar si ya tiene un RFID asignado (no es null, undefined o vacío)
    return rfidValue !== null && rfidValue !== undefined && rfidValue !== "";
  };

  // ✅ Obtener el ID del RFID actual
  const getCurrentRfidId = (rfidValue: string | null): number | null => {
    if (!rfidValue) return null;

    // Buscar el RFID en la lista de disponibles para obtener su ID
    const foundRfid = rfid.find((r) => r.codigo === rfidValue);
    return foundRfid ? foundRfid.id : null;
  };

  // ✅ Manejar cambio de RFID responsable
  const handleRfidChange = async (
    userCedula: number,
    rfidId: number | null
  ) => {
    try {
      if (rfidId === null) {
        // Si se limpia el select, liberar el RFID
        await handleLiberarRfid(userCedula);
        return;
      }

      // Encontrar el código RFID correspondiente al ID
      const selectedRfid = rfid.find((r) => r.id === rfidId);
      if (!selectedRfid) {
        message.error("RFID no encontrado");
        return;
      }

      await UpdateRfidResponsable({
        userCedula: userCedula,
        rfidCodigo: selectedRfid.codigo,
      });

      // Actualizar el estado local
      setDataSource((prev) =>
        prev.map((item) =>
          item.identificacion === userCedula
            ? { ...item, rfid: selectedRfid.codigo }
            : item
        )
      );

      // También actualizar initialData para mantener consistencia en búsquedas
      setInitialData((prev) =>
        prev.map((item) =>
          item.identificacion === userCedula
            ? { ...item, rfid: selectedRfid.codigo }
            : item
        )
      );

      message.success("RFID actualizado correctamente");
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Error al actualizar RFID"
      );
    }
  };

  // ✅ Liberar el RFID
  const handleLiberarRfid = async (userId: number) => {
    try {
      await DeleteAsignacionRfid(userId);

      // Actualizar el estado local
      setDataSource((prev) =>
        prev.map((item) =>
          item.id === userId ? { ...item, rfid: null } : item
        )
      );

      // También actualizar initialData
      setInitialData((prev) =>
        prev.map((item) =>
          item.id === userId ? { ...item, rfid: null } : item
        )
      );

      message.success("RFID liberado correctamente");
    } catch (error) {
      console.error("Error liberating RFID:", error);
      message.error("Error al liberar el RFID");
    }
  };

  // ✅ Cargar RFID disponibles desde API
  const fetchRfidDisponibles = async () => {
    setLoadingRfid(true);
    try {
      const {
        data: { data },
      } = await getRfidDisponibles();
      const rfidFormateadas = data.map((item) => ({
        id: item.id,
        codigo: item.codigo.toUpperCase(),
      }));
      setRfid(rfidFormateadas);
    } catch (error) {
      console.error("Error loading RFID:", error);
      message.error("Error al cargar los RFID disponibles");
    } finally {
      setLoadingRfid(false);
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Nombre Completo",
      dataIndex: "nombres",
      key: "nombres",
      sorter: (a, b) => a.nombres.localeCompare(b.nombres),
      fixed: "left" as const,
      width: 200,
    },
    {
      title: "Tipo empleado",
      dataIndex: "tipo_empleado",
      key: "tipo_empleado",
      sorter: (a, b) => a.tipo_empleado.localeCompare(b.tipo_empleado),
      width: 150,
    },
    {
      title: "Cédula",
      dataIndex: "identificacion",
      key: "identificacion",
      width: 120,
      sorter: (a, b) => a.identificacion - b.identificacion,
    },
    {
      title: "Cargo",
      dataIndex: "cargo",
      key: "cargo",
      width: 100,
      sorter: (a, b) => a.cargo.localeCompare(b.cargo),
    },
    {
      title: "Tarjeta RFID",
      dataIndex: "rfid",
      key: "rfid",
      align: "center",
      width: 200,
      render: (rfidValue: string | null, record: DataType) => {
        const isDisabled = isRfidSelectDisabled(rfidValue);
        const currentRfidId = getCurrentRfidId(rfidValue);

        return (
          <Space size="small">
            <Select
              placeholder="Seleccionar una tarjeta"
              value={currentRfidId}
              onChange={(value) =>
                handleRfidChange(record.identificacion, value)
              }
              style={{ width: 150 }}
              loading={loadingRfid}
              allowClear
              disabled={isDisabled}
              showSearch
              filterOption={(input, option) =>
                option?.children
                  ?.toString()
                  .toLowerCase()
                  .includes(input.toLowerCase()) || false
              }
              notFoundContent="No hay RFID disponibles"
            >
              {rfid.map((rfidItem) => (
                <Option key={rfidItem.id} value={rfidItem.id}>
                  {rfidItem.codigo}
                </Option>
              ))}
            </Select>

            {rfidValue && isDisabled && (
              <Tooltip title="Liberar RFID">
                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  danger
                  size="small"
                  onClick={() => handleLiberarRfid(record.id)}
                />
              </Tooltip>
            )}
          </Space>
        );
      },
    },
    {
      title: "Teléfono",
      dataIndex: "telefono_celular",
      key: "telefono_celular",
      width: 90,
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      align: "center",
      width: 120,
      render: (_, record: DataType) => {
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
            disabled={record.estado === "2"}
            okText="Sí"
            cancelText="No"
          >
            <ButtonTag disabled={record.estado === "2"} color={color}>
              <Tooltip
                title={
                  record.estado === "2"
                    ? "Usuario retirado de la empresa"
                    : "Cambiar estado"
                }
              >
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
      fixed: "right" as const,
      width: 100,
      render: (_, record: DataType) => {
        return (
          <BotonesOpciones
            botones={[
              {
                tipo: "editar",
                label: "Editar ficha",
                onClick: () => handleEdit(record),
                disabled: record.estado === "2",
              },
            ]}
            soloIconos={true}
            size="small"
          />
        );
      },
    },
  ];

  return (
    <StyledCard
      title={"Fichas de Obra"}
      extra={
        <Link to={`${location.pathname}/create`}>
          <Button type="primary">Crear Ficha</Button>
        </Link>
      }
    >
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Buscar ficha por nombre, cédula, cargo, etc."
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300, borderRadius: 8 }}
          allowClear
        />
      </div>

      <DataTable
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        withPagination={true}
        hasFixedColumn={true}
        stickyHeader={true}
        scroll={{ x: 1800, y: 500 }}
        pagination={{
          total: dataSource?.length,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} de ${total} registros`,
          pageSizeOptions: ["10", "20", "50"],
          defaultPageSize: 10,
        }}
      />
    </StyledCard>
  );
};
