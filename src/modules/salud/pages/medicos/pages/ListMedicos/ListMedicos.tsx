/* eslint-disable @typescript-eslint/no-explicit-any */
import { EditOutlined, SyncOutlined } from "@ant-design/icons";
import {
  Button,
  Input,
  notification,
  Popconfirm,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { useState, useEffect, useContext } from "react";
import Table, { ColumnsType } from "antd/es/table";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { DataType } from "./types";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { SearchBar } from "./styled";
import {
  getListaMedico,
  setStatusMedico,
} from "@/services/maestras/medicosAPI";
import { ButtonTag } from "@/modules/admin-usuarios/pages/usuarios/pages/ListUsuarios/styled";
import { GlobalContext } from "@/router/GlobalContext";

const { Text } = Typography;

export const ListMedicos = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useContext debe usarse dentro de un GlobalProvider");
  }
  const { userGlobal } = context;

  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [loadingRow, setLoadingRow] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [api, contextHolder] = notification.useNotification();
  const [canCreate, setCanCreate] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    fetchMedicos();
  }, []);

  useEffect(() => {
    if (userGlobal) {
      if (["administrador", "quimico", "regente"].includes(userGlobal.rol)) {
        setCanCreate(true);
      } else if (
        ["auditoria"].includes(userGlobal.rol) &&
        [10338, 10646, 10116, 10796, 7].includes(userGlobal.id)
      ) {
        setCanCreate(true);
      } else if (!["administrador", "quimico", "regente", "auditoria"].includes(userGlobal.rol)) {
        setCanCreate(true);
      } else {
        setCanCreate(false);
      }
    } else {
      setCanCreate(false);
    }
  }, [userGlobal]);

  const fetchMedicos = () => {
    getListaMedico().then(({ data: { data } }) => {
      const medicos = data.map((medico) => {
        return {
          key: medico.id,
          tipo_identificacion: medico.tipo_identificacion,
          numero_identificacion: medico.numero_identificacion,
          nombre_primero: medico.nombre_primero,
          nombre_segundo: medico.nombre_segundo,
          apellido_primero: medico.apellido_primero,
          apellido_segundo: medico.apellido_segundo,
          entidad: medico.entidad,
          estado: medico.estado,
        };
      });
      setInitialData(medicos);
      setDataSource(medicos);
      setLoadingRow([]);
    });
  };

  const handleStatus = (id: React.Key) => {
    setLoadingRow([...loadingRow, id]);
    setStatusMedico(id)
      .then(() => {
        fetchMedicos();
      })
      .catch(
        ({
          response,
          response: {
            data: { errors },
          },
        }) => {
          if (errors) {
            const errores: string[] = Object.values(errors);
            for (const error of errores) {
              api.open({
                type: "error",
                message: error,
              });
            }
          } else {
            api.open({
              type: "error",
              message: response.data.message,
            });
          }
          setLoadingRow([]);
        }
      );
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
      title: "Tipo Documento",
      dataIndex: "tipo_identificacion",
      key: "tipo_identificacion",
      sorter: (a, b) =>
        a.tipo_identificacion.localeCompare(b.tipo_identificacion),
    },
    {
      title: "Identificacion #",
      dataIndex: "numero_identificacion",
      key: "numero_identificacion",
      sorter: (a, b) =>
        a.numero_identificacion.localeCompare(b.numero_identificacion),
    },
    {
      title: "Primer Nombre",
      dataIndex: "nombre_primero",
      key: "nombre_primero",
      sorter: (a, b) => a.nombre_primero.localeCompare(b.nombre_primero),
    },
    {
      title: "Segundo Nombre",
      dataIndex: "nombre_segundo",
      key: "nombre_segundo",
      sorter: (a, b) => a.nombre_segundo.localeCompare(b.nombre_segundo),
    },
    {
      title: "Primer Apellido",
      dataIndex: "apellido_primero",
      key: "apellido_primero",
      sorter: (a, b) => a.apellido_primero.localeCompare(b.apellido_primero),
    },
    {
      title: "Segundo Apellido",
      dataIndex: "apellido_segundo",
      key: "apellido_segundo",
      sorter: (a, b) => a.apellido_segundo.localeCompare(b.apellido_segundo),
    },
    {
      title: "Entidad",
      dataIndex: "entidad",
      key: "entidad",
      sorter: (a, b) => a.entidad.localeCompare(b.entidad),
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      align: "center",
      hidden: userGlobal
        ? ["administrador", "quimico", "regente"].includes(userGlobal?.rol)
          ? false
          : ["auditoria"].includes(userGlobal?.rol) &&
            [10338, 10646, 10116, 10796, 7].includes(userGlobal?.id)
          ? false
          : true
        : false,
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
            <ButtonTag
              color={color}
              disabled={
                userGlobal
                  ? ["administrador", "quimico", "regente"].includes(
                      userGlobal?.rol
                    )
                    ? false
                    : ["auditoria"].includes(userGlobal?.rol) &&
                      [10338, 10646, 10116, 10796, 7].includes(userGlobal?.id)
                    ? false
                    : true
                  : false
              }
            >
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
      {contextHolder}
      <StyledCard
        title={"Lista de Medicos"}
        extra={
          canCreate ? (
            <Link to={`${location.pathname}/create`}>
              <Button type="primary">Crear</Button>
            </Link>
          ) : null
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
