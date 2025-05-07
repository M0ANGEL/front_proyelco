/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  Button,
  Popconfirm,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  notification,
} from "antd";
import { SyncOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  getUsuario,
  removerEmpBod,
  setStatusBodegaUsuario,
  setStatusEmpresaUsuario,
} from "@/services/maestras/usuariosAPI";
import { Usuario } from "../../types";
import { useParams } from "react-router-dom";
import { ColumnsType } from "antd/es/table";
import { ButtonTag } from "../../pages/ListUsuarios/styled";

const { Text } = Typography;

interface DataType {
  key: string;
  name: string;
  estado: string;
  children?: DataType[];
}

interface Props {
  usuario: Usuario | undefined;
  setUsuario: (value: Usuario) => void;
}

export const TablaEmpresasBodegas = ({ usuario, setUsuario }: Props) => {
  const params = useParams<{ id: string }>();
  const [loadingRow, setLoadingRow] = useState<any>([]);
  const [dataEmpresas, setDataEmpresas] = useState<DataType[]>([]);
  const [notificationApi, contextHolder] = notification.useNotification();

  useEffect(() => {
    getData(usuario);
  }, [usuario]);

  const getData = (usuario: Usuario | undefined) => {
    if (usuario) {
      const dataEmpresas = usuario.empresas.map((empresa) => {
        const bodegas = usuario.bodegas.filter(
          (bodega) => bodega.bodega.id_empresa === empresa.empresa.id.toString()
        );
        return {
          key: "emp-" + empresa.id,
          name: empresa.empresa.emp_nombre,
          estado: empresa.estado,
          children: bodegas.map((bodega) => ({
            key: "bod-" + bodega.id,
            name: bodega.bodega.bod_nombre,
            estado: bodega.estado,
          })),
        };
      });
      setDataEmpresas(dataEmpresas);
    }
  };

  const handleStatus = (id: React.Key) => {
    setLoadingRow([...loadingRow, id]);

    const tipo = id.toString().split("-")[0];
    const value = id.toString().split("-")[1];

    if (tipo === "emp") {
      setStatusEmpresaUsuario(value)
        .then(() => {
          getUsuario(params.id ?? "").then(({ data }) => {
            getData(data);
            setLoadingRow([]);
          });
        })
        .catch(({ response: { data } }) => {
          console.log(data);
          // onPushNotification({ type: "error", description: data.message });
          setLoadingRow([]);
        });
    } else {
      setStatusBodegaUsuario(value)
        .then(() => {
          getUsuario(params.id ?? "").then(({ data }) => {
            getData(data);
            setLoadingRow([]);
          });
        })
        .catch(({ response: { data } }) => {
          console.log(data);
          // onPushNotification({ type: "error", description: data.message });
          setLoadingRow([]);
        });
    }
  };

  const removerItem = (key: React.Key) => {
    const keySplit = key.toString().split("-");
    if (dataEmpresas.length == 1 && keySplit[0] == "emp") {
      notificationApi.open({
        type: "warning",
        message: "No se puede eliminar la última empresa asignada",
      });
    } else {
      let data = null;
      if (keySplit[0] == "emp") {
        const bodegas = dataEmpresas
          .find((item) => item.key == key)
          ?.children?.map((bodega) => bodega.key.toString().split("-")[1]);
        data = {
          ctrl: "empresa",
          id: keySplit[1],
          bodegas,
        };
      } else {
        data = {
          ctrl: "bodega",
          id: keySplit[1],
        };
      }

      removerEmpBod(data)
        .then(({ data: { message } }) => {
          let newDataEmpresas: DataType[] = [];
          if (keySplit[0] == "emp") {
            newDataEmpresas = dataEmpresas.filter((item) => item.key != key);
          } else {
            newDataEmpresas = dataEmpresas.map((item) => {
              const children = item.children?.filter(
                (child) => child.key != key
              );
              return { ...item, children };
            });
          }

          getUsuario(params.id ?? "").then(({ data }) => {
            if (usuario) {
              setUsuario({
                ...usuario,
                empresas: data.empresas,
                bodegas: data.bodegas,
              });
            }
            setLoadingRow([]);
          });
          setDataEmpresas(newDataEmpresas);
          notificationApi.open({
            type: "success",
            message,
          });
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
        );
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Empresas/Bodegas",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
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
              <Tooltip title="Cambiar estado" placement="right">
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
      title: "",
      dataIndex: "",
      key: "remover",
      align: "center",
      width: 150,
      render(_, { key }) {
        return (
          <>
            <Space direction="horizontal">
              <Button
                type="primary"
                size="small"
                danger
                onClick={() => {
                  removerItem(key);
                }}
              >
                <DeleteOutlined />
              </Button>
            </Space>
          </>
        );
      },
    },
  ];

  return (
    <>
      {contextHolder}
      <Table
        title={() => (
          <Text strong italic>
            Lista de Empresas y bodegas vinculadas
          </Text>
        )}
        size="small"
        className="custom-table"
        style={{ marginTop: 12 }}
        // scroll={{ y: "auto" }}
        dataSource={dataEmpresas}
        columns={columns}
        pagination={{ pageSize: 2 }}
      />
    </>
  );
};
