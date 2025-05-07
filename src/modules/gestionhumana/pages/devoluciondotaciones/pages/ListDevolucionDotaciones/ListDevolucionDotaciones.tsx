import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Button, Input, Space, Tooltip, Typography } from "antd";
import useNotification from "antd/es/notification/useNotification";
import { SearchBar } from "../../../empleados/pages/ListEmpleados/styled";
import { CloudServerOutlined, EditOutlined, PaperClipOutlined } from "@ant-design/icons";
import { getDevolucionesDotaciones, downloadSoporteDevoulucion } from "@/services/gestion-humana/dotacionesAPI";
import Table, { ColumnsType } from "antd/es/table";
import useArrayBuffer from "@/modules/common/hooks/useArrayBuffer";

interface DataType {
  key: number;
  cedula: string;
  nombre_completo: string;
  tipo: string;
  talla: string;
  cantidad: string;
  fecha_devolucion: string;
  observacion: string;
  cargo: string;
  sede: string;
  has_file: boolean;
  entrega_total: string;
}

const {Text} = Typography;

export const ListDevolucionDotaciones = () => {
  const [notificationApi, contextHolder] = useNotification();
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(true);

  const { arrayBufferToString } = useArrayBuffer();


  useEffect(() => {
    getDevolucionesDotaciones().then(({ data: { data } }) => {
      const dotaciones = data.map((dotacion) => {
        return {
          key: dotacion.id,
          cedula: dotacion.cedula,
          nombre_completo: dotacion.nombre_completo,
          tipo: dotacion.tipo,
          talla: dotacion.talla,
          cantidad: dotacion.cantidad,
          fecha_devolucion: dotacion.fecha_devolucion,
          observacion: dotacion.observacion,
          cargo: dotacion.cargo,
          sede: dotacion.sede,
          has_file: dotacion.soporte != null,
          entrega_total: dotacion.entrega_total
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
      title: "Fecha",
      dataIndex: "fecha_devolucion",
      key: "fecha_devolucion",
      sorter: (a, b) => a.fecha_devolucion.localeCompare(b.fecha_devolucion),
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
            {/* <Tooltip title="Editar">
              <Link to={`${location.pathname}/edit/${record.key}`}>
                <Button icon={<EditOutlined />} type="primary" size="small"/>
              </Link>
            </Tooltip>
            <Tooltip title="Devolución">
              <Link to={`${location.pathname}/devolucion/${record.key}`}>
                <GreenButton icon={<GiReturnArrow />} type="primary" size="small"/>
              </Link>
            </Tooltip> */}
            <Tooltip title="Descargar soporte">
              <Button
                key={record.key + "soportes"}
                size="small"
                onClick={() => {
                  downloadSoporteDevoulucion(record.key.toString())
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
        title={"LISTA DEVOLUCIÓN DOTACIONES"}
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
        />
      </StyledCard>
    </>
  );
};
