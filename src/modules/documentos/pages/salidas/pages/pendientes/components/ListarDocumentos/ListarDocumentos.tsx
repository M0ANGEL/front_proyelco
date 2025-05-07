/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { notification, Typography, Tooltip, Button, Space, Input } from "antd";
import { DataType, Pagination, Props } from "./types";
import { Link, useLocation } from "react-router-dom";
import Table, { ColumnsType } from "antd/es/table";
import { useState, useEffect } from "react";
// import fileDownload from "js-file-download";
import { ModalDispensaciones } from "..";
import {
  getPendientePdf,
  getPaginatePen,
  // getExcelPend,
} from "@/services/documentos/pendApi";
import { SearchBar } from "./styled";
import {
  CloseCircleFilled,
  FileTextOutlined,
  SearchOutlined,
  FilePdfFilled,
  StopOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "./styles.css";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_ROL } from "@/config/api";

const { Text } = Typography;

export const ListarDocumentos = ({ privilegios, tab }: Props) => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [openModalPagos, setOpenModalPagos] = useState<boolean>(false);
  const [loaderTable, setLoaderTable] = useState<boolean>(true);
  const [pendienteId, setPendienteId] = useState<React.Key>();
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [pagination, setPagination] = useState<Pagination>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { getSessionVariable } = useSessionStorage();
  const [user_rol] = useState<string>(getSessionVariable(KEY_ROL));
  const [value, setValue] = useState<string>("");
  const location = useLocation();

  useEffect(() => {
    setLoaderTable(true);
    const controller = new AbortController();
    const { signal } = controller;
    fetchDocumentos(value, currentPage, signal);
    return () => {
      controller.abort();
    };
  }, [value, currentPage]);

  const fetchDocumentos = (query = "", page = 1, abort: AbortSignal) => {
    let estado = "";
    switch (tab) {
      case "pendientes":
        estado = "1";
        break;
      case "cerrado":
        estado = "3";
        break;
      case "anulados":
        estado = "4";
        break;
      case "cancelados":
        estado = "7";
        break;
    }
    getPaginatePen(page, estado, query, abort)
      .then(({ data: { data } }) => {
        setPagination(data);
        const documentos: DataType[] = data.data.map((item) => {
          const cantidad_maxima = item.detalle.reduce(
            (accumulator, currentValue) => {
              return accumulator + parseInt(currentValue.cantidad_saldo);
            },
            0
          );
          const cantidad_pagada = item.detalle.reduce(
            (accumulator, currentValue) => {
              return accumulator + parseInt(currentValue.cantidad_pagada);
            },
            0
          );

          const flagPago = cantidad_pagada < cantidad_maxima ? true : false;
          const flagPagos = cantidad_pagada == 0 ? true : false;
          return {
            key: item.id,
            consecutivo: item.consecutivo,
            consecutivo_dispensacion: item.dispensacion
              ? item.dispensacion.consecutivo
              : "",
            dispensacion_id: item.dispensacion ? item.dispensacion.id : 0,
            bodega: item.bodegas.bod_nombre,
            num_docu: item.pacientes.numero_identificacion,
            nombres: `${item.pacientes.nombre_primero}${
              item.pacientes.nombre_segundo
                ? " " + item.pacientes.nombre_segundo
                : ""
            }`,
            apellidos: `${item.pacientes.apellido_primero}${
              item.pacientes.apellido_segundo
                ? " " + item.pacientes.apellido_segundo
                : ""
            }`,
            usuario: item.usuarios.username,
            fecha: dayjs(item.created_at).format("YYYY-MM-DD HH:mm"),
            flagPago,
            flagPagos,
          };
        });
        setDataSource(documentos);
        setLoaderTable(false);
      })
      .catch(({ response }) => {
        if (response) {
          if (response.data.errors) {
            const errores: string[] = Object.values(response.data.errors);

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
          setLoaderTable(false);
        }
      });
  };

  const handlePdfClick = async (id: string) => {
    setLoaderTable(true);
    try {
      const response = await getPendientePdf(id);
      const blob = new Blob([response.data], { type: "application/pdf" });

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "pendienteprint.pdf"; // Nombre del archivo al descargar
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setLoaderTable(false);
    } catch (error) {
      setLoaderTable(false);
      console.error("Error downloading PDF:", error);
    }
  };

  // const exportExcel = (id: string) => {
  //   setLoaderTable(true);
  //   getExcelPend()
  //     .then(({ data }) => {
  //       fileDownload(data, "PENDIENTES.xlsx");
  //     })
  //     .catch((error) => {
  //       console.error("Error en la solicitud HTTP:", error);
  //       // Aquí puedes mostrar un mensaje de error al usuario o realizar otras acciones
  //     })
  //     .finally(() => {
  //       setLoaderTable(false);
  //     });
  // };

  const columns: ColumnsType<DataType> = [
    {
      title: "Consecutivo",
      dataIndex: "consecutivo",
      key: "consecutivo",
      align: "center",
      fixed: "left",
      width: 120,
    },
    {
      title: "Dispensación",
      dataIndex: "consecutivo_dispensacion",
      key: "consecutivo_dispensacion",
      align: "center",
      fixed: "left",
      width: 120,
      render: (value, { dispensacion_id }) => (
        <Link
          target="_blank"
          to={`/documentos/ventas/dis/show/${dispensacion_id}`}
        >
          {value}
        </Link>
      ),
    },
    {
      title: "N° Documento",
      dataIndex: "num_docu",
      key: "num_docu",
    },
    {
      title: "Nombre Paciente",
      dataIndex: "nombres",
      key: "nombres",
    },
    {
      title: "Apellido Paciente",
      dataIndex: "apellidos",
      key: "apellidos",
    },
    {
      title: "Bodega",
      dataIndex: "bodega",
      key: "bodega",
      align: "center",
    },
    {
      title: "Usuario",
      dataIndex: "usuario",
      key: "usuario",
      align: "center",
    },
    {
      title: "Fecha Creación",
      dataIndex: "fecha",
      key: "fecha",
      align: "center",
    },

    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      fixed: "right",
      width: 260,
      render: (_, { key, flagPago, flagPagos }) => {
        return (
          <>
            <Space>
              <Tooltip title="Ver documento">
                <Link to={`${location.pathname}/show/${key}`}>
                  <Button key={key + "consultar"} size="small">
                    <SearchOutlined />
                  </Button>
                </Link>
              </Tooltip>
              <Tooltip title="Descargar Pdf">
                <Button
                  size="small"
                  onClick={() => handlePdfClick(key.toString())}
                >
                  <FilePdfFilled className="icono-rojo" />
                </Button>
              </Tooltip>
              {/* <Tooltip title="Descargar Excel">
                <Button
                  size="small"
                  onClick={() => exportExcel(key.toString())}
                >
                  <FileExcelFilled className="icono-verde" />
                </Button>
              </Tooltip> */}
              {privilegios?.anular == "1" && tab == "pendientes" ? (
                <Tooltip title="Anular documento">
                  <Link to={`${location.pathname}/anular/${key}`}>
                    <Button
                      danger
                      type="primary"
                      size="small"
                      key={key + "anular"}
                    >
                      <StopOutlined />
                    </Button>
                  </Link>
                </Tooltip>
              ) : null}
              {["pendientes", "cancelados"].includes(tab) ? (
                <>
                  <Tooltip title="Ver Pagos">
                    <Button
                      key={key + "pagar"}
                      size="small"
                      onClick={() => {
                        setPendienteId(key);
                        setOpenModalPagos(true);
                      }}
                      disabled={flagPagos}
                    >
                      <FileTextOutlined />
                    </Button>
                  </Tooltip>
                  {["administrador", "regente_farmacia", "quimico"].includes(
                    user_rol
                  ) ? (
                    <Tooltip title="Cancelar pendientes">
                      <Link to={`${location.pathname}/cancelar/${key}`}>
                        <Button danger size="small" key={key + "cancelar"}>
                          <CloseCircleFilled />
                        </Button>
                      </Link>
                    </Tooltip>
                  ) : null}
                  {flagPago ? (
                    <Tooltip title="Pagar Pendiente">
                      <Link to={`${location.pathname}/pagar/${key}`}>
                        <Button key={key + "pagar"} size="small" type="primary">
                          Pagar
                        </Button>
                      </Link>
                    </Tooltip>
                  ) : null}
                </>
              ) : null}
            </Space>
            <Space>
              {!flagPago ? <Text type="danger">Pago completado</Text> : null}
            </Space>
          </>
        );
      },
    },
  ];

  return (
    <>
      {contextHolder}

      <ModalDispensaciones
        open={openModalPagos}
        setOpen={(value: boolean) => {
          setPendienteId(undefined);
          setOpenModalPagos(value);
        }}
        pendiente_id={pendienteId}
      />

      <SearchBar>
        <Input
          placeholder="Busqueda por consecutivo o número de identificación, debes presionar Enter para buscar"
          onKeyUp={(e: any) => {
            const {
              key,
              target: { value },
            } = e;
            if (key == "Enter") {
              setValue(value);
              setCurrentPage(1);
            }
          }}
        />
      </SearchBar>

      <Table
        bordered
        rowKey={(record) => record.key}
        scroll={{ x: 1400 }}
        size="small"
        columns={columns}
        dataSource={dataSource}
        loading={loaderTable}
        pagination={{
          total: pagination?.total,
          pageSize: pagination?.per_page,
          onChange: (page: number) => setCurrentPage(page),
          hideOnSinglePage: true,
          showSizeChanger: false,
          current: currentPage,
          showTotal: () => {
            return (
              <>
                <Text>Total Registros: {pagination?.total}</Text>
              </>
            );
          },
        }}
      />
    </>
  );
};
