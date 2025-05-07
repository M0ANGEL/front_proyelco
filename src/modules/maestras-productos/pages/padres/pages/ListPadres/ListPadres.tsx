/* eslint-disable @typescript-eslint/no-explicit-any */

import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import {
  Button,
  Col,
  Input,
  notification,
  Popconfirm,
  Row,
  Space,
  Tooltip,
} from "antd";
import {
  getProductosPadre,
  removeCodigoPadre,
} from "@/services/maestras/productosPadreAPI";
import Table, { ColumnsType } from "antd/es/table";
import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { SearchBar } from "./styled";
import { DataType } from "./types";
import {
  QuestionCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { KEY_ROL } from "@/config/api";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";

export const ListPadres = () => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [deletingRow, setDeletingRow] = useState<React.Key[]>([]);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [loaderTable, setLoaderTable] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);
  const location = useLocation();

  useEffect(() => {
    fetchPadres();
  }, []);

  const fetchPadres = () => {
    setLoaderTable(true);
    getProductosPadre().then(({ data: { data } }) => {
      const productosPadre = data.map((productoPadre) => {
        return {
          key: productoPadre.id,
          codigo: productoPadre.cod_padre,
          descripcion: productoPadre.descripcion,
        };
      });
      setInitialData(productosPadre);
      setDataSource(productosPadre);
      setLoaderTable(false);
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

  const handleDeleteCodigoPadre = (key: React.Key) => {
    setDeleteLoader(true);
    removeCodigoPadre(key)
      .then(({ data: { message } }) => {
        notificationApi.success({ message });
        fetchPadres();
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
              notificationApi.open({
                type: "error",
                message: error,
              });
            }
          } else {
            notificationApi.open({
              type: "error",
              message: response.data.message,
            });
          }
        }
      )
      .finally(() => {
        setDeletingRow([]);
        setDeleteLoader(false);
      });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Código",
      dataIndex: "codigo",
      key: "codigo",
      align: "center",
      width: 100,
      sorter: (a, b) => a.codigo.localeCompare(b.codigo),
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
      sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      width: 100,
      render: (_, { key }) => {
        return (
          <>
            <Space>
              <Tooltip title="Editar">
                <Link to={`${location.pathname}/edit/${key}`}>
                  <Button icon={<EditOutlined />} type="primary" />
                </Link>
              </Tooltip>
              {["administrador", "cotizaciones"].includes(user_rol) ? (
                <Popconfirm
                  title="¿Desea eliminar este Código Padre?"
                  open={deletingRow.includes(key)}
                  icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                  okButtonProps={{
                    loading: deleteLoader,
                    danger: true,
                  }}
                  okText="Si"
                  cancelText="No"
                  onConfirm={() => handleDeleteCodigoPadre(key)}
                  onCancel={() => setDeletingRow([])}
                  disabled={deletingRow.length > 0}
                  onOpenChange={() => setDeletingRow([...deletingRow, key])}
                >
                  <Button type="primary" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              ) : null}
            </Space>
          </>
        );
      },
    },
  ];

  return (
    <>
      {contextHolder}
      <StyledCard
        title={"Lista de productos padres"}
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
