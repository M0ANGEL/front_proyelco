/* eslint-disable @typescript-eslint/no-explicit-any */
import { getFuentes, setStatusFuente } from "@/services/maestras/fuentesAPI";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Button, Input, Popconfirm, Tag, Tooltip, Typography } from "antd";
import { ButtonTag } from "../../../usuarios/pages/ListUsuarios/styled";
import { EditOutlined, SyncOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import Table, { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { SearchBar } from "./styled";
import { DataType } from "./types";

const { Text } = Typography;

export const ListFuentes = () => {
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loadingRow, setLoadingRow] = useState<any>([]);
  const [loaderTable, setLoaderTable] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    fetchFuentes();
  }, []);

  const fetchFuentes = () => {
    setLoaderTable(true);
    getFuentes()
      .then(({ data: { data } }) => {
        const fuentes = data.map((fuente) => {
          return {
            key: fuente.id,
            prefijo: fuente.prefijo,
            descripcion: fuente.descripcion,
            tipo_fuente: fuente.tipo_fuente.toUpperCase(),
            estado: fuente.estado,
          };
        });
        setInitialData(fuentes);
        setDataSource(fuentes);
        setLoadingRow([]);
      })
      .finally(() => setLoaderTable(false));
  };

  const handleStatus = (id: React.Key) => {
    setLoadingRow([...loadingRow, id]);
    setStatusFuente(id)
      .then(() => {
        fetchFuentes();
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
      title: "Prefijo",
      dataIndex: "prefijo",
      key: "prefijo",
      align: "center",
      width: 120,
      sorter: (a, b) => a.prefijo.localeCompare(b.prefijo),
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
      sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
    },
    {
      title: "Tipo Fuente",
      dataIndex: "tipo_fuente",
      key: "tipo_fuente",
      align: "center",
      width: 150,
      sorter: (a, b) => a.tipo_fuente.localeCompare(b.tipo_fuente),
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      align: "center",
      width: 120,
      render: (_, { key, estado }) => {
        let estadoString = "";
        let color;
        if (estado === "1") {
          estadoString = "ACTIVO";
          color = "green";
        } else {
          estadoString = "INACTIVO";
          color = "red";
        }
        return (
          <Popconfirm
            title="¿Desea cambiar el estado?"
            onConfirm={() => handleStatus(key)}
            placement="left"
          >
            <ButtonTag color={color}>
              <Tooltip title="Cambiar estado">
                <Tag
                  color={color}
                  key={estadoString}
                  icon={loadingRow.includes(key) ? <SyncOutlined spin /> : null}
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
      width: 120,
      render: (_, { key }) => {
        return (
          <Tooltip title="Editar">
            <Link to={`${location.pathname}/edit/${key}`}>
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
        title={"Lista de Fuentes"}
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
          dataSource={dataSource == null ? initialData : dataSource}
          columns={columns}
          loading={loaderTable}
          pagination={{
            total: initialData?.length,
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
