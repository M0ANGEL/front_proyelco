/* eslint-disable @typescript-eslint/no-explicit-any */
import { ButtonTag } from "@/modules/admin-usuarios/pages/usuarios/pages/ListUsuarios/styled";
import { Popconfirm, Typography, Tooltip, Button, Input, Col, Tag } from "antd";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { EditOutlined, SyncOutlined } from "@ant-design/icons";
import Table, { ColumnsType } from "antd/es/table";
import {
  setStatusMotivoAud,
  getMotivosAud,
} from "@/services/maestras/motivosAuditoriaAPI";
import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { SearchBar } from "./styled";
import { DataType } from "./types";

const { Text } = Typography;

export const ListMotivos = () => {
  const [loadingRow, setLoadingRow] = useState<React.Key[]>([]);
  const [loaderTable, setLoaderTable] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const location = useLocation();

  useEffect(() => {
    fetchMotivos();
  }, []);

  const fetchMotivos = () => {
    getMotivosAud().then(({ data: { data } }) => {
      const motivos: DataType[] = data.map((motivo) => {
        return {
          key: motivo.id,
          codigo: motivo.codigo,
          motivo: motivo.motivo,
          estado: motivo.estado,
          motivo_homologado: motivo.homologado_info
            ? `${motivo.homologado_info.codigo} - ${motivo.homologado_info.motivo}`
            : "No tiene",
        };
      });
      setInitialData(motivos);
      setDataSource(motivos);
      setLoadingRow([]);
      setLoaderTable(false);
    });
  };

  const handleStatus = (id: React.Key) => {
    setLoadingRow([...loadingRow, id]);
    setStatusMotivoAud(id)
      .then(() => {
        fetchMotivos();
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
      title: "Código Motivo",
      dataIndex: "codigo",
      key: "codigo",
      align: "center",
      width: 120,
      sorter: (a, b) => a.codigo.localeCompare(b.codigo),
    },
    {
      title: "Motivo Desc.",
      dataIndex: "motivo",
      key: "motivo",
      sorter: (a, b) => a.motivo.localeCompare(b.motivo),
    },
    {
      title: "Motivo Homologado",
      dataIndex: "motivo_homologado",
      key: "motivo_homologado",
      sorter: (a, b) => a.motivo_homologado.localeCompare(b.motivo_homologado),
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      align: "center",
      width: 120,
      sorter: (a, b) => a.estado.localeCompare(b.estado),
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
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      fixed: "right",
      width: 120,
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
        title={"Lista de Motivos Auditoría"}
        extra={
          <Link to={`${location.pathname}/create`}>
            <Button type="primary">Crear</Button>
          </Link>
        }
      >
        <Col span={24}>
          <SearchBar>
            <Input placeholder="Buscar" onChange={handleSearch} />
          </SearchBar>
        </Col>
        <Table
          className="custom-table"
          rowKey={(record) => record.key}
          size="small"
          dataSource={dataSource == null ? initialData : dataSource}
          columns={columns}
          loading={loaderTable}
          pagination={{
            simple: false,
            hideOnSinglePage: true,
            showTotal: (total: number) => {
              return (
                <>
                  <Text>Total Registros: {total}</Text>
                </>
              );
            },
          }}
          bordered
          scroll={{ x: 800 }}
        />
      </StyledCard>
    </>
  );
};
