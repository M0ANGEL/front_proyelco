import {
  SearchOutlined,
  EditOutlined,
  StopOutlined,
  FilePdfFilled,
} from "@ant-design/icons";
import { Button, Space, Tooltip, Typography } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useState, useEffect } from "react";
import { DataType, Props } from "./types";
import { Link, useLocation } from "react-router-dom";
import { getOtrosPdf } from "@/services/documentos/otrosAPI";

const { Text } = Typography;

export const ListarDocumentos = ({ documentos, privilegios, tab }: Props) => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const location = useLocation();

  useEffect(() => {
    const data: DataType[] = documentos.map((item) => {
      return {
        key: item.id,
        bod_solicitante: item.bodega.bod_nombre,
        tercero_id: item.tercero_id,
        razon_soc: item.tercero ? item.tercero.razon_soc || "" : "",
        usuario: item.user.username,
        fecha: item.created_at
          .toString()
          .slice(0, item.created_at.toString().length - 17),
        consecutivo: item.consecutivo,
        estado: item.estado,
      };
    });
    setDataSource(data);
  }, [documentos]);

  const handlePdfClick = async (id) => {
    try {
      const response = await getOtrosPdf(id);
      //const arrayBuffer = await response.arrayBuffer();
      const blob = new Blob([response.data], { type: "application/pdf" });

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "PATprint.pdf"; // Nombre del archivo al descargar
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Consecutivo",
      dataIndex: "consecutivo",
      key: "consecutivo",
      sorter: true,
      align: "center",
      fixed: "left",
      width: 120,
    },
    {
      title: "Nit Tercero",
      dataIndex: "tercero_id",
      key: "tercero_id",
      sorter: (a, b) => a.tercero_id.localeCompare(b.tercero_id),
    },
    {
      title: "Razón Social",
      dataIndex: "razon_soc",
      key: "razon_soc",
      sorter: (a, b) => a.razon_soc.localeCompare(b.razon_soc),
    },
    {
      title: "Punto Entrega",
      dataIndex: "bod_solicitante",
      key: "bod_solicitante",
      sorter: (a, b) => a.bod_solicitante.localeCompare(b.bod_solicitante),
    },
    {
      title: "Fecha Creación",
      dataIndex: "fecha",
      key: "fecha",
      sorter: (a, b) => a.fecha.localeCompare(b.fecha),
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      fixed: "right",
      render: (_, record: { key: React.Key }) => {
        return (
          <Space>
            <Tooltip title="Descargar Pdf">
              <Button size="small" onClick={() => handlePdfClick(record.key)}>
                <FilePdfFilled className="icono-rojo" />
              </Button>
            </Tooltip>
            <Tooltip title="Ver documento">
              <Link to={`${location.pathname}/show/${record.key}`}>
                <Button key={record.key + "consultar"} size="small">
                  <SearchOutlined />
                </Button>
              </Link>
            </Tooltip>
            {privilegios?.modificar == "1" && tab == "pendientes" ? (
              <Tooltip title="Editar documento">
                <Link to={`${location.pathname}/edit/${record.key}`}>
                  <Button
                    type="primary"
                    size="small"
                    key={record.key + "modificar"}
                  >
                    <EditOutlined />
                  </Button>
                </Link>
              </Tooltip>
            ) : null}
            {privilegios?.anular == "1" && tab == "pendientes" ? (
              <Tooltip title="Anular documento">
                <Link to={`${location.pathname}/anular/${record.key}`}>
                  <Button
                    danger
                    type="primary"
                    size="small"
                    key={record.key + "anular"}
                  >
                    <StopOutlined />
                  </Button>
                </Link>
              </Tooltip>
            ) : null}
          </Space>
        );
      },
      width: 70,
    },
  ];

  return (
    <>
      {dataSource.length === 0 ? (
        <Text>No hay registros para mostrar.</Text>
      ) : (
        <Table
          bordered
          rowKey={(record) => record.key}
          size="small"
          columns={columns}
          dataSource={dataSource}
          loading={dataSource.length === 0} // Adjust loading condition if needed
          pagination={{
            simple: false,
            showTotal: (total: number) => {
              return (
                <>
                  <Text>Total Registros: {total}</Text>
                </>
              );
            },
          }}
        />
      )}
    </>
  );
};
