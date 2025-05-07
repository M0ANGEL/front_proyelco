/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import {
  Button,
  Input,
  Popconfirm,
  Tag,
  Tooltip,
  Space,
  Typography,
  Row,
  Col,
  Spin,
} from "antd";
import { EditOutlined, SyncOutlined, FileExcelFilled } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import Table, { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { SearchBar } from "./styled";
import {
  getExcelLP,
  getListapre,
  setStatusListapre,
} from "@/services/maestras/listaPreciosAPI";
import { UploadOutlined, FileOutlined } from "@ant-design/icons";
import { ButtonTag } from "@/modules/admin-usuarios/pages/usuarios/pages/ListUsuarios/styled";
import fileDownload from "js-file-download";
import ExcelJS from "exceljs";
import useNotification from "antd/es/notification/useNotification";

const { Text } = Typography;

interface DataType {
  key: number;
  codigo: string;
  descripcion: string;
  estado: string;
  nit: string;
}

export const ListaPrecios = () => {
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [notificationApi, contextHolder] = useNotification();
  const [loadingRow, setLoadingRow] = useState<any>([]);
  const [loader, setLoader] = useState<boolean>(true);
  const location = useLocation();

  useEffect(() => {
    fetchPerfiles();
  }, []);

  const fetchPerfiles = () => {
    getListapre().then(({ data }) => {
      const listaPre = data.map((listaPre) => {
        return {
          key: listaPre.id,
          codigo: listaPre.codigo,
          descripcion: listaPre.descripcion,
          estado: listaPre.estado,
          nit: listaPre.nit,
        };
      });
      setInitialData(listaPre);
      setDataSource(listaPre);
      setLoadingRow([]);
      setLoader(false);
    });
  };

  const handleStatus = (id: React.Key) => {
    setLoadingRow([...loadingRow, id]);
    setStatusListapre(id)
      .then(() => {
        fetchPerfiles();
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

  const exportExcel = (id_listapre: React.Key) => {
    setLoader(true);
    getExcelLP(id_listapre.toString())
      .then(({ data }) => {
        fileDownload(data, "LISTA_PRECIOS_PROVEEDOR.xlsx");
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
          setLoader(false);
        }
      )
      .finally(() => {
        setLoader(false);
      });
  };

  // Función para crear un archivo Excel vacío
  const createEmptyExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Plantilla");
    worksheet.addRow(["codigo", "precio"]); // Agrega títulos de columnas

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Plantilla_Precios.xlsx";
      a.click();
    });
  };
  const columns: ColumnsType<DataType> = [
    {
      title: "ID",
      dataIndex: "key",
      key: "key",
      width: 60,
      align: "center",
    },
    {
      title: "Nombre Lista de Precios",
      dataIndex: "codigo",
      key: "codigo",
      sorter: (a, b) => a.codigo.localeCompare(b.codigo),
      width: 250,
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
      sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      align: "center",
      width: 100,
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
          <Space>
            <Tooltip title="Generar Excel">
              <Button
                icon={<FileExcelFilled className="icono-verde" />}
                onClick={() => exportExcel(record.key)}
                size="small"
              />
            </Tooltip>
            <Tooltip title="Editar">
              <Link to={`${location.pathname}/edit/${record.key}`}>
                <Button icon={<EditOutlined />} type="primary" size="small" />
              </Link>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      {contextHolder}
      <StyledCard
        title={"Lista de Precios Proveedor"}
        extra={
          <>
            <Space>
              <Link to={`${location.pathname}/create`}>
                <Button type="primary" icon={<FileOutlined />}>
                  Crear
                </Button>
              </Link>

              <Link to={`${location.pathname}/import`}>
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  style={{ background: "green" }}
                >
                  Importar Excel
                </Button>
              </Link>
              {/* Agrega el botón para crear el archivo Excel vacío */}
              <Button
                onClick={createEmptyExcel}
                icon={<FileExcelFilled className="icono-verde" />}
                type="default"
              >
                Descargar Plantilla
              </Button>
            </Space>
          </>
        }
      >
        <Row gutter={[12, 12]}>
          <Col xs={24} md={{ span: 18 }}>
            <SearchBar>
              <Input placeholder="Buscar" onChange={handleSearch} />
            </SearchBar>
          </Col>
          <Col xs={24} md={{ span: 6 }}>
            <Spin spinning={loader}>
              <Button
                type="dashed"
                icon={<FileExcelFilled className="icono-verde" />}
                block
                onClick={() => exportExcel("all")}
                disabled={dataSource.length == 0}
              >
                Descargar informe
              </Button>
            </Spin>
          </Col>
        </Row>
        <Table
          className="custom-table"
          rowKey={(record) => record.key}
          size="small"
          dataSource={dataSource == null ? initialData : dataSource}
          columns={columns}
          loading={loader}
          pagination={{
            pageSize: 10,
            simple: false,
            hideOnSinglePage: true,
            showTotal: () => {
              return (
                <>
                  <Text>Total Registros: {initialData.length}</Text>
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
