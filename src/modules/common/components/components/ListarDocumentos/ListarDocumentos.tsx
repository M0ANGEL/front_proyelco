/* eslint-disable react-hooks/exhaustive-deps */
import { SearchOutlined, EditOutlined, StopOutlined } from "@ant-design/icons";
import { Button, Space, Tooltip, Typography } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useState, useEffect } from "react";
import { DataType, Props } from "./types";
import { Link, useLocation } from "react-router-dom";

const { Text } = Typography;

export const ListarDocumentos = ({ documentos, privilegios, tab }: Props) => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const location = useLocation();
  useEffect(() => {
    const data: DataType[] = documentos.map((item) => {
      const fecha = new Date(item.created_at);
      const dia = fecha.getDate();
      const mes = fecha.getMonth() + 1; // Los meses en JavaScript comienzan desde 0
      const año = fecha.getFullYear();

      // Formatear la fecha en el formato deseado (por ejemplo, DD/MM/YYYY)
      const fechaFormateada = `${dia < 10 ? '0' + dia : dia}/${mes < 10 ? '0' + mes : mes}/${año}`;

      return {
        key: item.id,
        trs_id: item.trs_id,
        bod_origen: item.bod_origen.bod_nombre,
        bod_destino: item.bod_destino.bod_nombre,
        user: item.user.username,
        fecha: fechaFormateada,
        user_acepta: item.user_acepta,
      };
    });
    setDataSource(data);
  }, [documentos]);

  const columns: ColumnsType<DataType> = [
    {
      title: "Id.",
      dataIndex: "key",
      key: "key",
      sorter: true,
      align: "center",
      fixed: "left",
      width: 120,
    },
    {
      title: "Consecutivo",
      dataIndex: "trs_id",
      key: "trs_id",
      sorter: true,
      align: "center",
      fixed: "left",
      width: 120,
    },
    {
      title: "Bodega Origen",
      dataIndex: "bod_origen",
      key: "bod_origen",
      sorter: (a, b) => a.bod_origen.localeCompare(b.bod_origen),
    },
    {
      title: "Bodega Destino",
      dataIndex: "bod_destino",
      key: "bod_destino",
      sorter: (a, b) => a.bod_destino.localeCompare(b.bod_destino),
    },
    {
      title: "Usuario Elaboró",
      dataIndex: "user",
      key: "user",
      sorter: (a, b) => a.user.localeCompare(b.user),
    },
    {
      title: "Fecha Realizado",
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
            {privilegios?.consultar == "1" ? (
              <Tooltip title="Ver documento">
                <Link to={`${location.pathname}/show/${record.key}`}>
                  <Button key={record.key + "consultar"} size="small">
                    <SearchOutlined />
                  </Button>
                </Link>
              </Tooltip>
            ) : null}
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

  if (tab === "cerrado") {
    columns.splice(5, 0, {
      title: "Usuario Aceptó",
      dataIndex: "user_acepta",
      key: "user_acepta",
      sorter: (a, b) => a.user_acepta.localeCompare(b.user_acepta),
    });
  }
  return (
    <>
      <Table
        bordered
        rowKey={(record) => record.key}
        size="small"
        columns={columns}
        dataSource={dataSource}
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
    </>
  );
};
