import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { CiLink } from "react-icons/ci";
// import { SearchBar } from "@/modules/common/components/FormDocuments/styled"
import { SearchBar } from "@/modules/gestionhumana/pages/empleados/pages/ListEmpleados/styled"
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled"
import { Button, Input, Space, Spin, Tag, Tooltip, Typography } from "antd"
import { FaFilePdf } from "react-icons/fa";
import { getPreselecciones } from "@/services/gestion-humana/preseleccionesAPI"
import Table, { ColumnsType } from "antd/es/table"
import { EditOutlined, SyncOutlined, CloudServerOutlined, PaperClipOutlined } from "@ant-design/icons"
import { ModalDocumentos, ModalLinkDocumentos } from "../../components"
import useNotification from "antd/es/notification/useNotification"
import { getSoportesEmpleados } from "@/services/gestion-humana/empleadosAPI"
import { GreenButton } from "@/modules/aliados/pages/lista-dispensaciones/pages/ListDispensaciones/styled"

interface DataType {
  key: number;
  nombre: string;
  documento: string;
  cargo: string;
  convenio: string;
  examen_medico: string;
  estado: string;
  observacion: string;
  user: string;
  reclutador: string;
  fecha: string;
  has_files: boolean;
}

const { Text } = Typography

export const ListPreselecciones = () => {

  const [loadingRow, setLoadingRow] = useState<any>([])
  const [initialData, setInitialData] = useState<DataType[]>([])
  const [dataSource, setDataSource] = useState<DataType[]>([])
  const location = useLocation()
  const [openModalSoportes, setOpenModalSoportes] = useState<boolean>(false)
  const [openModalLink, setOpenModalLink] = useState<boolean>(false)
  const [soportes, setSoportes] = useState<string[]>([])
  const [documento, setDocumento] = useState<string>('')
  const [notificationApi, contextHolder] = useNotification()
  const [loader, setLoader] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [idPreseleccion, setIdPreseleccion] = useState<string>('')
  const [appUrl, setAppUrl] = useState<string>('')

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const filterTable = initialData?.filter((o: any) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setDataSource(filterTable);
  }

  useEffect(() => {
    fetchPreselecciones();
  }, []);

  const fetchPreselecciones = () => {
    getPreselecciones().then(({ data: { data, appUrl } }) => {
      setAppUrl(appUrl)
      const preselecciones = data.map((preseleccion) => {
        return {
          key: preseleccion.id,
          nombre: preseleccion.nombre,
          documento: preseleccion.documento,
          cargo: preseleccion.cargo,
          convenio: preseleccion.convenio,
          examen_medico: preseleccion.examen_medico,
          estado: preseleccion.estado,
          observacion: preseleccion.observacion,
          user: preseleccion.user_id,
          reclutador: preseleccion.nombre_reclutador,
          fecha: preseleccion.created_at,
          has_files: preseleccion.documentos_cargados.length > 0,
        };
      });
      setInitialData(preselecciones);
      setDataSource(preselecciones);
      setLoadingRow([]);
      setLoading(false);
    });
  }

  const columns: ColumnsType<DataType> = [
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
      sorter: (a, b) => a.nombre.localeCompare(b.nombre),
      render: (text) => (
        text ? (
          <Tooltip title={text}>
            {text.length > 20 ? `${text.substring(0, 20)}...` : text}
          </Tooltip>
        ) : null
      ),
    },
    {
      title: "Documento",
      dataIndex: "documento",
      key: "documento",
      align: "center",
      sorter: (a, b) => a.documento.localeCompare(b.documento),
      render: (value, { has_files }) => {
        return (
          <>
            {has_files && (
              <Tooltip title="Soportes cargados">
                <PaperClipOutlined style={{ marginRight: 5, color: "blue" }} />
              </Tooltip>
            )}
            {value}
          </>
        );
      },
    },
    {
      title: "Cargo",
      dataIndex: "cargo",
      key: "cargo",
      width: 150,
      sorter: (a, b) => a.cargo.localeCompare(b.cargo),
    },
    {
      title: "Convenio",
      dataIndex: "convenio",
      key: "convenio",
      sorter: (a, b) => a.convenio.localeCompare(b.convenio),
      render: (text) => (
        text ? (
          <Tooltip title={text}>
            {text.length > 20 ? `${text.substring(0, 20)}...` : text}
          </Tooltip>
        ) : null
      ),
    },
    {
      title: "Examen medico",
      dataIndex: "examen_medico",
      key: "examen_medico",
      align: "center",
      render: (_, record: { key: React.Key; examen_medico: string }) => {
        let estadoString = "";
        let color;
        if (record.examen_medico === "1") {
          estadoString = "SI";
          color = "green";
        } else {
          estadoString = "NO";
          color = "red";
        }
        return (
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
        );
      },
      sorter: (a, b) => a.estado.localeCompare(b.estado),
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      sorter: (a, b) => a.estado.localeCompare(b.estado),
    },
    {
      title: "Observacion",
      dataIndex: "observacion",
      key: "observacion",
      sorter: (a, b) => a.observacion.localeCompare(b.observacion),
      render: (text) => (
        text ? (
          <Tooltip title={text}>
            {text.length > 20 ? `${text.substring(0, 20)}...` : text}
          </Tooltip>
        ) : null
      ),
    },
    {
      title: "Reclutador",
      dataIndex: "reclutador",
      key: "reclutador",
      sorter: (a, b) => a.reclutador.localeCompare(b.reclutador),
      render: (text) => (
        text ? (
          <Tooltip title={text}>
            {text.length > 20 ? `${text.substring(0, 20)}...` : text}
          </Tooltip>
        ) : null
      ),
    },
    {
      title: "Fecha",
      dataIndex: "fecha",
      key: "fecha",
      sorter: (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime(),
      render: (fecha) => new Date(fecha).toLocaleDateString(),
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      render: (_, record: { key: React.Key; documento: string }) => {
        return (
          <Space>
            <Tooltip title="Editar">
              <Link to={`${location.pathname}/edit/${record.key}`}>
                <Button size="small" icon={<EditOutlined />} type="primary" />
              </Link>
            </Tooltip>

            <Tooltip title="Cargar documentos">
              <Link to={`${location.pathname}/upload/${record.key}`}>
                <Button size="small" icon={<FaFilePdf />} type="primary" danger/>
              </Link>
            </Tooltip>

            <Tooltip title="Ver soportes">
              <GreenButton
                key={record.key + "soportes"}
                size="small"
                onClick={() => {
                  setLoader(true);
                  getSoportesEmpleados(record.key.toString())
                    .then(({ data: { data } }) => {
                      if (data.length > 0) {
                        setOpenModalSoportes(true);
                        setSoportes(data);
                      } else {
                        notificationApi.open({
                          type: "error",
                          message:
                            "No existen soportes cargados para esta preselección",
                          duration: 3,
                        });
                      }
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
                              duration: 5,
                            });
                          }
                        } else {
                          notificationApi.open({
                            type: "error",
                            message: response.data.message,
                            duration: 5,
                          });
                        }
                      }
                    )
                    .finally(() => setLoader(false));
                }}
              >
                <CloudServerOutlined />
              </GreenButton>
            </Tooltip>

            <Tooltip title="Link envio documentos">
              <Button
                key={record.key + "link"}
                size="small"
                onClick={() => {
                  setOpenModalLink(true)
                  setIdPreseleccion(record.key.toString())
                  setDocumento(record.documento)
                }}
              >
                <CiLink />
              </Button>
            </Tooltip>
          </Space>
        );
      },
    },
  ]

  return (
    <>
      {contextHolder}
      <ModalDocumentos
        open={openModalSoportes}
        setOpen={(value: boolean) => {
          setOpenModalSoportes(value);
        }}
        soportes={soportes}
      />
      <ModalLinkDocumentos
        open={openModalLink}
        setOpen={(value: boolean) => {
          setOpenModalLink(value);
        }}
        id={idPreseleccion}
        documento={documento}
        urlHost={appUrl}
      />
      <Spin spinning={loader}></Spin>
      <StyledCard
        title={"LISTA CANDIDATOS DE PRESELECCIÓN"}
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
          dataSource={dataSource ?? initialData}
          columns={columns}
          loading={loading}
          pagination={{
            total: initialData?.length,
            showSizeChanger: true,
            defaultPageSize: 5,
            pageSizeOptions: ["5", "15", "30"],
            showTotal: (total: number) => {
              return (
                <Text>Total Registros: {total}</Text>
              );
            },
          }}
          bordered
        />
      </StyledCard>
    </>
  )
}