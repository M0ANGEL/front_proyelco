/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import {
  Button,
  Input,
  Tooltip,
  Space,
  Popconfirm,
  Tag,
  Typography,
} from "antd";
import { EditOutlined, SyncOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import Table, { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { SearchBar, ButtonTag } from "./styled";
import { DataType } from "./types";
import {
  getListaResolucionPrin,
  setStatusResol,
} from "@/services/facturacion/resolucionAPI";
import dayjs from "dayjs";

const { Text, Paragraph } = Typography;

export const ListResolucion = () => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [loadingRow, setLoadingRow] = useState<any>([]);
  const location = useLocation();
  const [loaderTable, setLoaderTable] = useState<boolean>(true);
  const [ellipsis, setEllipsis] = useState(true);

  useEffect(() => {
    fetchResolucion();
  }, []);

  const fetchResolucion = () => {
    getListaResolucionPrin().then(({ data: { data } }) => {
      const listResolucion = data.map((listResol) => {
        return {
          key: listResol.id,
          id: listResol.id,
          convenio_id: listResol.convenio_id,
          user_id: listResol.username,
          prefijo: listResol.prefijo,
          consecutivo: listResol.consecutivo,
          resolucion: listResol.resolucion,
          fecha_resolucion: dayjs(listResol.fecha_resolucion).format(
            "YYYY-MM-DD"
          ),
          desde: listResol.desde,
          hasta: listResol.hasta,
          estado: listResol.estado_id,
          created_at: dayjs(listResol.created_at).format("YYYY-MM-DD"),
          updated_at: dayjs(listResol.updated_at).format("YYYY-MM-DD"),
          consecutivo_nc:listResol.consecutivo_nc,
          consecutivo_nd:listResol.consecutivo_nd,
        };
      });
      setInitialData(listResolucion);
      setDataSource(listResolucion);
      setLoadingRow([]);
    });
    setLoaderTable(false);
  };

  const handleStatus = (id: React.Key) => {
    setLoadingRow([...loadingRow, id]);
    setStatusResol(id)
      .then(() => {
        fetchResolucion();
      })
      .catch(() => {
        setLoadingRow([]);
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

  const columns: ColumnsType<DataType> = [
    {
      title: "Resolución",
      dataIndex: "resolucion",
      key: "resolucion",
    },
    {
      title: "Prefijo",
      dataIndex: "prefijo",
      key: "prefijo",
    },
    {
      title: "Convenio",
      dataIndex: "convenio_id",
      key: "convenio_id",
      render: (_, record: { key: React.Key; convenio_id: string }) => {
        return (
          <Paragraph
            ellipsis={{
              rows: 4,
              expandable: true,
              symbol: 'Expandir',
              onEllipsis: (ellipsis) => {
                // console.log("Ellipsis changed:", ellipsis);
              },
            }}
          >
            {record.convenio_id}
          </Paragraph>
        );
      },
    },
    {
      title: "Consecutivo Facturación",
      dataIndex: "consecutivo",
      key: "consecutivo",
      align: "center",
    },
    {
      title: "Consecutivo Nota Crédito",
      dataIndex: "consecutivo_nc",
      key: "consecutivo_nc",
      align: "center",
    },
    {
      title: "Consecutivo Nota Débito",
      dataIndex: "consecutivo_nd",
      key: "consecutivo_nd",
      align: "center",
    },
    {
      title: "Rango",
      dataIndex: "desde",
      key: "desde",
      align: "center",
      render: (_, record: { key: React.Key; desde: string; hasta: string }) => {
        const rango = record.desde + " - " + record.hasta;
        return (
          <ButtonTag>
            <Tooltip title="Rango Facturacion">
              <Tag
                key={record.key}
                icon={
                  loadingRow.includes(record.key) ? <SyncOutlined spin /> : null
                }
              >
                {rango.toUpperCase()}
              </Tag>
            </Tooltip>
          </ButtonTag>
        );
      },
    },
    {
      title: "Fecha Resolución",
      dataIndex: "fecha_resolucion",
      key: "fecha_resolucion",
      align: "center",
      sorter: (a, b) => a.fecha_resolucion.localeCompare(b.fecha_resolucion),
    },
    {
      title: "Estado",
      dataIndex: "estado_id",
      key: "estado_id",
      align: "center",
      render: (_, record: { key: React.Key; estado: string }) => {
        let estadoString = "";
        let color;
        if (record.estado === "6") {
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
            <ButtonTag color={color}>
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
      title: "Usuario",
      dataIndex: "user_id",
      key: "user_id",
      align: "center",
    },
    {
      title: "Fecha Creación",
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      sorter: (a, b) => a.created_at.localeCompare(b.created_at),
    },
    {
      title: "Fecha Actualización",
      dataIndex: "updated_at",
      key: "updated_at",
      align: "center",
      sorter: (a, b) => a.updated_at.localeCompare(b.updated_at),
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
        title={"Lista de Resoluciones"}
        extra={
          <>
            <Space>
              <Link to={`${location.pathname}/create`}>
                <Button type="primary">Crear</Button>
              </Link>
            </Space>
          </>
        }
      >
        <SearchBar>
          <Input placeholder="Buscar" onChange={handleSearch} />
        </SearchBar>
        <Table
          className="custom-table"
          rowKey={(record) => record.id}
          size="small"
          dataSource={dataSource}
          columns={columns}
          loading={loaderTable}
          pagination={{
            total: dataSource?.length,
            showSizeChanger: true,
            defaultPageSize: 5,
            pageSizeOptions: ["5", "15", "30"],
            showTotal: (total: number) => {
              return (
                <>
                  <Text>Total Registros: {total}</Text>
                </>
              );
            },
          }}
          bordered
        />
      </StyledCard>
    </>
  );
};
