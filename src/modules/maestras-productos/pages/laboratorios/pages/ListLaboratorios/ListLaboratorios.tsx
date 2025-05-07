/* eslint-disable @typescript-eslint/no-explicit-any */
import { EditOutlined,SyncOutlined } from "@ant-design/icons";
import { Button, Col, Input, Popconfirm, Row, Tag, Tooltip,  Typography, } from "antd";
import { useState, useEffect } from "react";
import Table, { ColumnsType } from "antd/es/table";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { DataType } from "./types";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { SearchBar, ButtonTag} from "./styled";
import { getLaboratorios,setStatusLab } from "@/services/maestras/laboratoriosAPI";
import dayjs from "dayjs";

const { Text } = Typography;

export const ListLaboratorios = () => {
  const [loaderTable, setLoaderTable] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const location = useLocation();
  const [loadingRow, setLoadingRow] = useState<any>([]);

  
  useEffect(() => {

    fetchLaboratorios();
  }, []);

  const fetchLaboratorios = () => {
    getLaboratorios().then(({ data: { data } }) => {
      const laboratorio = data.map((lab) => {
        return {
          key: lab.id,
          descripcion: lab.descripcion,
          estado_id: lab.estado_id,
          fecha: dayjs(lab.created_at).format("YYYY-MM-DD"),
        };
      });
      setInitialData(laboratorio);
      setDataSource(laboratorio);
      setLoadingRow([]);
      setLoaderTable(false);
    });
    setLoaderTable(false);
  };

  const handleStatus = (id: React.Key) => {
    setLoadingRow([...loadingRow, id]);
    setStatusLab(id)
      .then(() => {
        fetchLaboratorios();
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
      title: "Código",
      dataIndex: "key",
      key: "key",
      align: "center",
      width: 100,
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
      align: "center",
      width: 200,
      sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
    },
    {
      title: "Fecha Creacion",
      dataIndex: "fecha",
      key: "fecha",
      align: "center",
      width: 100,
    },
    {
      title: "Estado",
      dataIndex: "estado_id",
      key: "estado_id",
      align: "center",
      width: 100,
      render: (_, record: { key: React.Key; estado_id: string }) => {
        let estadoString = "";
        let color;
        if (record.estado_id === "6") {
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
      sorter: (a, b) => a.estado_id.localeCompare(b.estado_id),
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
        title={"Lista de Laboratorios"}
        extra={
          <Link to={`${location.pathname}/create`}>
            <Button type="primary">Crear</Button>
          </Link>
        }
      >
        <Row gutter={12}>
          <Col xs={24} sm={24}>
            <SearchBar>
              <Input placeholder="Buscar" onChange={handleSearch} />
            </SearchBar>
          </Col>
        </Row>
        <Table
          className="custom-table"
          rowKey={(record) => record.key}
          size="small"
          dataSource={dataSource == null ? initialData : dataSource}
          columns={columns}
          loading={loaderTable}
          pagination={{
            simple: false,
          }}
          bordered
        />
      </StyledCard>
    </>
  );
};
