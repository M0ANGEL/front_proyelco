/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  EditOutlined,
  HistoryOutlined,
  CloseCircleFilled,
} from "@ant-design/icons";
import {
  Button,
  Space,
  Tooltip,
  Input,
  notification,
  Row,
  Col,
  PaginationProps,
  Typography,
} from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useState, useEffect } from "react";
import { DataType, Props } from "./types";
import { SearchBar } from "./styled";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import dayjs from "dayjs";
import { anularTrasladoActivo, getListaTrasladosActivosEstadosYbodegaSalidas } from "@/services/activos/trasladosActivosAPI";
import { KEY_BODEGA } from "@/config/api";
import { GreenButton } from "@/modules/common/components/ExportExcel/styled";
import { TrazabilidadTrasladosActivosModal } from "../Components/TrazabilidadTrasladosActivosModal";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile } from "@/services/auth/authAPI";

const { Text } = Typography;
let timeout: ReturnType<typeof setTimeout> | null;

export const ListarActivosSalidas = ({ tab }: Props) => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loaderTable, setLoaderTable] = useState<boolean>(true);
  const [, setValue] = useState<string>("");
  const [pagination, setPagination] = useState<{
    total: number;
    per_page: number;
  }>();
  const { getSessionVariable } = useSessionStorage();
  const [trasladoId, setTrasladoId] = useState<React.Key>();
  const [openModalTrasladosTrazabilidad, setOpenModalTrasladosTrazabilidad] =
    useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocumentos();
  }, []);

  const fetchDocumentos = () => {
    let estado = "";
    const bodega = getSessionVariable(KEY_BODEGA);
    const bodegaN = Number(bodega);

    switch (tab) {
      case "pendientes":
        estado = "pendiente";
        break;
      case "cerrado":
        estado = "cerrado";
        break;
      case "anulados":
        estado = "anulado";
        break;
    }

    getListaTrasladosActivosEstadosYbodegaSalidas(estado, bodegaN)
      .then(({ data }) => {
        const TAS: DataType[] = data.map((item) => {
          return {
            key: item.id,
            bodega_origen_info: item.bodega_origen_info.bod_nombre,
            bodega_destino_info: item.bodega_destino_info.bod_nombre,
            id_activo: item.activo?.nombre,
            fecha_traslado: item.fecha_traslado, // Convertido a Date
            estado: item.estado,
            fecha_recibido: item.fecha_recibido
              ? new Date(item.fecha_recibido)
              : new Date(), // Proporcionar fecha predeterminada
            descripcion: item.descripcion,
            user_origen_info: item.user_origen_info.nombre,
            user_destino_info: item.user_destino_info.nombre,
          };
        });
        setDataSource(TAS);
        setPagination({
          total: data.length, // Asegúrate de que esto sea correcto
          per_page: 10, // Ajusta el tamaño de página según sea necesario
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
                duration: 4,
              });
            }
          } else {
            notificationApi.open({
              type: "error",
              message: response.data.message,
              duration: 4,
            });
          }
        }
      )
      .finally(() => {
        setLoaderTable(false);
      });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setValue(value);

    setLoaderTable(true);
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => {
      fetchDocumentos(); // Llamar con el valor de búsqueda
    }, 500);
  };

  const handleChangePagination: PaginationProps["onChange"] = () => {
    setLoaderTable(true);
    fetchDocumentos(); // Pasar el valor de búsqueda y la página
  };

  const HandleAnularTraslado = async (id: React.Key) => {
    setLoaderTable(true);
    const response = await fetchUserProfile();
    const userId = response.data.userData.id;
    
    // Aquí asume que tienes un servicio API para anular el traslado
    anularTrasladoActivo(id,userId )
      .then((_,) => {
        notificationApi.success({
          message: "Traslado anulado correctamente",
          duration: 3,
        });
  
        // Recargar la lista de traslados
        fetchDocumentos();
      })
      .catch((error: { response: { data: { message: any; }; }; }) => {
        notificationApi.error({
          message: "Error al anular el traslado",
          description: error?.response?.data?.message || "Ocurrió un error",
          duration: 4,
        });
      })
      .finally(() => {
        setLoaderTable(false);
      });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "traslado Act Salida ",
      dataIndex: "key",
      key: "key",
      sorter: true,
      align: "center",
      fixed: "left",
      width: 120,
    },
    {
      title: "Activo",
      dataIndex: "id_activo",
      key: "id_activo",
    },
    {
      title: "Fecha Traslado",
      dataIndex: "fecha_traslado",
      key: "fecha_traslado",
      sorter: (a, b) => a.fecha_traslado.getTime() - b.fecha_traslado.getTime(), // Usar getTime para comparación
      render: (date: Date) => dayjs(date).format("YYYY-MM-DD"), // Convertir de vue
    },
    {
      title: "Fecha Traslado",
      dataIndex: "fecha_recibido",
      key: "fecha_recibido",
      sorter: (a, b) => a.fecha_traslado.getTime() - b.fecha_traslado.getTime(), // Usar getTime para comparación
      render: (date: Date) => dayjs(date).format("YYYY-MM-DD"), // Convertir de vue
    },
    {
      title: "Sede Origen",
      dataIndex: "bodega_origen_info",
      key: "bodega_origen_info",
    },
    {
      title: "Sede Destino",
      dataIndex: "bodega_destino_info",
      key: "bodega_destino_info",
    },
    {
      title: "Usuario Elaboró",
      dataIndex: "user_origen_info",
      key: "user_origen_info",
    },
    {
      title: "Usuario Recibio",
      dataIndex: "user_destino_info",
      key: "user_destino_info",
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
    },
    {
      title: "Descripcion",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      fixed: "right",
      render: (_, record: { key: React.Key }) => {
        return (
          <Space>
            <Tooltip title="Editar documento">
              <Button
                type="primary"
                size="small"
                onClick={() => navigate(`editar/${record.key}`)}
              >
                <EditOutlined />
              </Button>
            </Tooltip>


            {tab === "pendientes" && (
              <Tooltip title="Anular Traslado">
                  <Button
                    type="primary"
                    style={{ background: "red", borderColor: "red" }}
                    size="small"
                    onClick={() => {
                      setTrasladoId(record.key);
                      HandleAnularTraslado(record.key);
                    }}
                  >
                <CloseCircleFilled/>
                </Button>
              </Tooltip>
            )}

            {tab === "cerrado" && (
              <Tooltip title="Ver Trazabilidad">
                <GreenButton
                  type="primary"
                  size="small"
                  onClick={() => {
                    setTrasladoId(record.key);
                    setOpenModalTrasladosTrazabilidad(true);
                  }}
                >
                  <HistoryOutlined />
                </GreenButton>
              </Tooltip>
            )}
          </Space>
        );
      },
      width: 70,
    },
  ];

  if (tab === "cerrado") {
    columns.splice(5, 0, {
      title: "Usuario Aceptó",
      dataIndex: "user_destino_info",
      key: "user_destino_info",
    });
  }
  return (
    <>
      <TrazabilidadTrasladosActivosModal
        open={openModalTrasladosTrazabilidad}
        setOpen={(value: boolean) => {
          setOpenModalTrasladosTrazabilidad(value);
          setTrasladoId(undefined);
        }}
        id_trasladoActivo={trasladoId}
      />

      {contextHolder}
      <Row gutter={12}>
        <Col span={24}>
          <SearchBar>
            <Input placeholder="Buscar" onChange={handleSearch} />
          </SearchBar>
        </Col>
        <Col span={24}>
          <Table
            bordered
            rowKey={(record) => record.key}
            size="small"
            columns={columns}
            dataSource={dataSource}
            loading={loaderTable}
            pagination={{
              total: pagination?.total,
              pageSize: pagination?.per_page,
              simple: true,
              onChange: handleChangePagination,
              hideOnSinglePage: true,
              showTotal: () => {
                return (
                  <>
                    <Text>Total Registros: {pagination?.total}</Text>
                  </>
                );
              },
            }}
          />
        </Col>
      </Row>
    </>
  );
};
