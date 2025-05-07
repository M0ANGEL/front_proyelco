
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ButtonTag } from "@/modules/admin-usuarios/pages/usuarios/pages/ListUsuarios/styled";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { EditOutlined, SyncOutlined } from "@ant-design/icons";
import Table, { ColumnsType } from "antd/es/table";
import { ModalEstados } from "../../components";
import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import {
  setStatusInventarioBodega,
  setStatusBodega,
  getBodegas,
} from "@/services/maestras/bodegasAPI";
import { KEY_ROL } from "@/config/api";
import { SearchBar } from "./styled";
import { DataType } from "./types";
import {
  Popconfirm,
  Typography,
  Tooltip,
  Button,
  Input,
  Space,
  Tag,
} from "antd";

const { Text } = Typography;

export const ListBodegas = () => {
  const [openModalEstados, setOpenModalEstados] = useState<boolean>(false);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [loadingRow, setLoadingRow] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const { getSessionVariable } = useSessionStorage();
  const location = useLocation();

  const user_rol = getSessionVariable(KEY_ROL);

  useEffect(() => {
    fetchBodegas();
  }, []);

  const fetchBodegas = () => {
    getBodegas().then(({ data: { data } }) => {
      const bodegas = data.map((bodega) => {
        let tipo_bodega = "";
        switch (bodega.tipo_bodega) {
          case "0":
            tipo_bodega = "Bodega";
            break;
          case "1":
            tipo_bodega = "Farmacia";
            break;
          case "2":
            tipo_bodega = "Centro de Costo / Sede";
            break;
        }
        return {
          key: bodega.id,
          bod_nombre: bodega.bod_nombre,
          prefijo: bodega.prefijo,
          bod_tercero: bodega.bod_tercero,
          estado: bodega.estado,
          estado_inventario: bodega.estado_inventario,
          bod_localidad: `${bodega.localidad.municipio} - ${bodega.localidad.departamento}`,
          tipo_bodega,
        };
      });
      setInitialData(bodegas);
      setDataSource(bodegas);
      setLoadingRow([]);
    });
  };

  const handleStatus = (id: React.Key) => {
    setLoadingRow([...loadingRow, id]);
    setStatusBodega(id)
      .then(() => {
        fetchBodegas();
      })
      .catch(() => {
        setLoadingRow([]);
      });
  };

  const handleStatusInventario = (id: React.Key) => {
    setLoadingRow([...loadingRow, id]);
    setStatusInventarioBodega(id)
      .then(() => {
        fetchBodegas();
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
      title: "Bodega",
      dataIndex: "bod_nombre",
      key: "bod_nombre",
      sorter: (a, b) => a.bod_nombre.localeCompare(b.bod_nombre),
    },
    {
      title: "Localidad",
      dataIndex: "bod_localidad",
      key: "bod_localidad",
      sorter: (a, b) => a.bod_localidad.localeCompare(b.bod_localidad),
    },
    {
      title: "Prefijo",
      dataIndex: "prefijo",
      key: "prefijo",
      sorter: (a, b) => a.prefijo.localeCompare(b.prefijo),
    },
    {
      title: "Tercero",
      dataIndex: "bod_tercero",
      key: "bod_tercero",
      sorter: (a, b) => a.bod_tercero.localeCompare(b.bod_tercero),
    },
    {
      title: "Tipo",
      dataIndex: "tipo_bodega",
      key: "tipo_bodega",
      sorter: (a, b) => a.tipo_bodega.localeCompare(b.tipo_bodega),
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      align: "center",
      hidden: !["administrador"].includes(user_rol),
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
      title: "Estado Inventario",
      dataIndex: "estado_inventario",
      key: "estado_inventario",
      align: "center",
      hidden: !["administrador", "revisor_compras"].includes(user_rol),
      render: (_, record: { key: React.Key; estado_inventario: string }) => {
        let estadoString = "";
        let color;
        if (record.estado_inventario === "1") {
          estadoString = "SI";
          color = "green";
        } else {
          estadoString = "NO";
          color = "red";
        }
        return (
          <Popconfirm
            title="¿Desea cambiar el estado del inventario de la bodega?"
            onConfirm={() => handleStatusInventario(record.key)}
            placement="left"
          >
            <ButtonTag color={color}>
              <Tooltip title="Cambiar estado inventario">
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
      sorter: (a, b) => a.estado_inventario.localeCompare(b.estado_inventario),
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      hidden: !["administrador"].includes(user_rol),
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
      <ModalEstados
        open={openModalEstados}
        setOpen={(value: boolean) => {
          setOpenModalEstados(value);
          setInitialData([]);
          fetchBodegas();
        }}
        bodegas={initialData}
      />
      <StyledCard
        title={"Lista de bodegas"}
        extra={
          <Space>
            {["administrador", "revisor_compras"].includes(user_rol) ? (
              <Button
                type="primary"
                onClick={() => {
                  setOpenModalEstados(true);
                }}
              >
                Cambiar Estados Inventarios
              </Button>
            ) : null}
            {["administrador"].includes(user_rol) ? (
              <Link to={`${location.pathname}/create`}>
                <Button type="primary">Crear</Button>
              </Link>
            ) : null}
          </Space>
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
