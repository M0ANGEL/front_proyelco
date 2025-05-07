import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Button, Input, Space, Tooltip, Typography } from "antd";
import { CloudServerOutlined, EditOutlined, PaperClipOutlined } from "@ant-design/icons";
import { SearchBar } from "../../../empleados/pages/ListEmpleados/styled";
import {
  getEntregaDotaciones,
  downloadSoporte,
} from "@/services/gestion-humana/dotacionesAPI";
import Table, { ColumnsType } from "antd/es/table";
import useArrayBuffer from "@/modules/common/hooks/useArrayBuffer";
import useNotification from "antd/es/notification/useNotification";
import { GreenButton } from "@/modules/common/components/ExportExcel/styled";
import { GiReturnArrow } from "react-icons/gi";

interface DataType {
  key: number;
  cedula: string;
  nombre_completo: string;
  tipo: string;
  talla: string;
  cantidad: string;
  fecha_entrega: string;
  observacion: string;
  cargo: string;
  sede: string;
  has_file: boolean;
  entrega_total: string;
  fecha_inicio: string;
  dias: string;
}

const { Text } = Typography;

export const ListEntregaDotaciones = () => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();
  const [notificationApi, contextHolder] = useNotification();

  const { arrayBufferToString } = useArrayBuffer();

  useEffect(() => {
    getEntregaDotaciones().then(({ data: { data } }) => {
      const dotaciones = data.map((dotacion) => {
        return {
          key: dotacion.id,
          cedula: dotacion.cedula,
          nombre_completo: dotacion.nombre_completo,
          tipo: dotacion.tipo,
          talla: dotacion.talla,
          cantidad: dotacion.cantidad,
          fecha_entrega: dotacion.fecha_entrega,
          observacion: dotacion.observacion,
          cargo: dotacion.cargo,
          sede: dotacion.sede,
          has_file: dotacion.soporte != null,
          entrega_total: dotacion.entrega_total,
          fecha_inicio: dotacion.fecha_inicio,
          dias: dotacion.dias,
        };
      });
      setInitialData(dotaciones);
      setDataSource(dotaciones);
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

  const columns: ColumnsType<DataType> = [
    {
      title: "Cédula",
      dataIndex: "cedula",
      key: "cedula",
      sorter: (a, b) => a.cedula.localeCompare(b.cedula),
      render: (value, { has_file }) => {
        return (
          <>
            {has_file && (
              <Tooltip title="Soporte">
                <PaperClipOutlined style={{ marginRight: 5, color: "blue" }} />
              </Tooltip>
            )}
            {value}
          </>
        );
      },
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
      title: "Tipo",
      dataIndex: "tipo",
      key: "tipo",
      sorter: (a, b) => a.tipo.localeCompare(b.tipo),
    },
    { 
      title: "Talla",
      dataIndex: "talla",
      key: "talla",
      sorter: (a, b) => a.talla.localeCompare(b.talla),
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
      sorter: (a, b) => a.cantidad.localeCompare(b.cantidad),
    },
    {
      title: "Entrega",
      dataIndex: "entrega_total",
      key: "entrega_total",
      sorter: (a, b) => a.entrega_total.localeCompare(b.entrega_total),
    },
    {
      title: "Fecha entrega",
      dataIndex: "fecha_entrega",
      key: "fecha_entrega",
      sorter: (a, b) => a.fecha_entrega.localeCompare(b.fecha_entrega),
    },
    {
      title: "Observación",
      dataIndex: "observacion",
      key: "observacion",
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      render: (_, record: { key: React.Key; cedula: string }) => {
        return (
          <Space>
            <Tooltip title="Editar">
              <Link to={`${location.pathname}/edit/${record.key}`}>
                <Button icon={<EditOutlined />} type="primary" size="small"/>
              </Link>
            </Tooltip>
            <Tooltip title="Devolución">
              <Link to={`${location.pathname}/devolucion/${record.key}`}>
                <GreenButton icon={<GiReturnArrow />} type="primary" size="small"/>
              </Link>
            </Tooltip>
            <Tooltip title="Descargar soporte">
              <Button
                key={record.key + "soportes"}
                size="small"
                onClick={() => {
                  downloadSoporte(record.key.toString())
                    .then((response) => {
                      const url = window.URL.createObjectURL(
                        new Blob([response.data])
                      );
                      const link = document.createElement("a");
                      link.href = url;
                      link.setAttribute(
                        "download",
                        "soporte_" + record.cedula + ".pdf"
                      );
                      document.body.appendChild(link);
                      link.click();
                    })
                    .catch(({ response: { data } }) => {
                      const message = arrayBufferToString(data).replace(
                        /[ '"]+/g,
                        " "
                      );
                      notificationApi.open({
                        type: "error",
                        message: message,
                      });
                    })
                    .finally(() => null);
                }}
              >
                <CloudServerOutlined />
              </Button>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      {contextHolder}
      <StyledCard
        title={"LISTA ENTREGA DOTACIONES"}
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
              return <Text>Total Registros: {total}</Text>;
            },
          }}
          bordered
        />
      </StyledCard>
    </>
  );
};
