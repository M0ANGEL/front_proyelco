/* eslint-disable @typescript-eslint/no-explicit-any */
import { ButtonTag } from "@/modules/admin-usuarios/pages/usuarios/pages/ListUsuarios/styled";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Button, Input, Popconfirm, Tag, Tooltip, Typography } from "antd";
import { EditOutlined, SyncOutlined } from "@ant-design/icons";
import Table, { ColumnsType } from "antd/es/table";
import {
  setStatusCuotaModeradora,
  getCuotaModeradoras,
} from "@/services/maestras/cuotaModeradoraAPI";
import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { SearchBar } from "./styled";
import { DataType } from "./types";
import dayjs from "dayjs";

const { Text } = Typography;

export const ListCuotas = () => {
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [loadingRow, setLoadingRow] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const location = useLocation();

  useEffect(() => {
    fetchCuotas();
  }, []);

  const fetchCuotas = () => {
    getCuotaModeradoras().then(({ data: { data } }) => {
      const cuotas = data.map((cuota) => {
        return {
          key: cuota.id,
          fecha: cuota.fecha,
          regimen: cuota.regimen,
          categoria: cuota.categoria,
          valor: cuota.valor,
          estado: cuota.estado,
        };
      });
      setInitialData(cuotas);
      setDataSource(cuotas);
      setLoadingRow([]);
    });
  };

  const handleStatus = (id: React.Key) => {
    setLoadingRow([...loadingRow, id]);
    setStatusCuotaModeradora(id)
      .then(() => {
        fetchCuotas();
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
      title: "Año",
      dataIndex: "fecha",
      key: "fecha",
      width: 100,
      align: "center",
      sorter: (a, b) => a.fecha.localeCompare(b.fecha),
      render: (fecha: string) => {
        const formattedYear = dayjs(fecha).format("YYYY");
        return <span>{formattedYear}</span>;
      },
    },
    {
      title: "Regimen",
      dataIndex: "regimen",
      key: "regimen",
      sorter: (a, b) => a.regimen.localeCompare(b.regimen),
    },
    {
      title: "Categoria",
      dataIndex: "categoria",
      key: "categoria",
      width: 100,
      align: "center",
      sorter: (a, b) => a.categoria.localeCompare(b.categoria),
    },
    {
      title: "Valor",
      dataIndex: "valor",
      key: "valor",
      sorter: (a, b) => a.valor.localeCompare(b.valor),
      render: (value) => {
        return <Text>$ {parseFloat(value).toLocaleString("es-CO")}</Text>;
      },
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      width: 150,
      align: "center",
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
      sorter: (a, b) => a.estado.localeCompare(b.estado),
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      width: 100,
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
        title={"Lista de cuotas moderadoras"}
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
          loading={initialData.length == 0 ? true : false}
          scroll={{ x: 900 }}
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
