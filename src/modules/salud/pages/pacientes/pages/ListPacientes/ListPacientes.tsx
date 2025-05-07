/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ButtonTag } from "@/modules/admin-usuarios/pages/usuarios/pages/ListUsuarios/styled";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { EditOutlined, SyncOutlined, UploadOutlined } from "@ant-design/icons";
import Table, { ColumnsType } from "antd/es/table";
import { DataType, Pagination } from "./types";
import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import {
  setStatusPaciente,
  getPacientesPag,
} from "@/services/maestras/pacientesAPI";
import { Link } from "react-router-dom";
import { SearchBar } from "./styled";
import {
  notification,
  Popconfirm,
  Typography,
  Tooltip,
  Button,
  Input,
  Tag,
  Upload,
  Spin,
} from "antd";
import type { UploadProps } from "antd";
import { BASE_URL } from "@/config/api";
import { GreenButton } from "@/modules/common/components/ExportExcel/styled";
import { ModalErroresPlano } from "../../components/ModalErroresPlano";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_ROL } from "@/config/api";

const { Text } = Typography;

export const ListPacientes = () => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loaderTable, setLoaderTable] = useState<boolean>(true);
  const [loader, setLoader] = useState<boolean>(false);
  const [loadingRow, setLoadingRow] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [pagination, setPagination] = useState<Pagination>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [value, setValue] = useState<string>("");
  const location = useLocation();
  const [erroresPlano, setErroresPlano] = useState<string[]>([]);
  const [openModalErroresPlano, setOpenModalErroresPlano] =
    useState<boolean>(false);
  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);

  useEffect(() => {
    fetchPacientes();
  }, []);

  useEffect(() => {
    setLoaderTable(true);
    const controller = new AbortController();
    const { signal } = controller;
    fetchPacientes(value, currentPage, signal);
    return () => controller.abort();
  }, [value, currentPage]);

  const fetchPacientes = (query = "", page = 1, abort?: AbortSignal) => {
    getPacientesPag(page, query, abort)
      .then(({ data: { data } }) => {
        setPagination(data);
        const pacientes = data.data.map((paciente) => {
          return {
            key: paciente.id,
            tipo_identificacion: paciente.tipo_identificacion,
            numero_identificacion: paciente.numero_identificacion,
            nombre_primero: paciente.nombre_primero,
            nombre_segundo: paciente.nombre_segundo,
            apellido_primero: paciente.apellido_primero,
            apellido_segundo: paciente.apellido_segundo,
            fecha_nacimiento: paciente.fecha_nacimiento,
            edad: paciente.edad,
            genero: paciente.genero,
            direccion: paciente.direccion,
            celular: paciente.celular,
            eps: paciente.eps.entidad,
            estado: paciente.estado,
          };
        });
        setDataSource(pacientes);
        setLoadingRow([]);
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

  const handleStatus = (id: React.Key) => {
    setLoadingRow([...loadingRow, id]);
    setStatusPaciente(id)
      .then(() => {
        fetchPacientes();
      })
      .catch(() => {
        setLoadingRow([]);
      });
  };

  const props: UploadProps = {
    name: "pacientes",
    showUploadList: false,
    action: `${BASE_URL}pacientes/cargar-plano`,
    data: {},
    method: "POST",
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    maxCount: 1,
    accept: ".xlsx",
    progress: {
      strokeColor: {
        "0%": "#108ee9",
        "100%": "#87d068",
      },
      size: 3,
      format: (percent: any) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
    beforeUpload(file: any) {
      const isExcel =
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      if (!isExcel) {
        notificationApi.open({
          type: "error",
          message: "Solo se admite el formato .xlsx",
          duration: 20,
        });
      }
      return isExcel;
    },
    onChange(info: any) {
      setLoader(true);
      if (info.file.status !== "uploading") {
        setLoader(false);
      }
      if (info.file.status === "removed") {
        setLoader(false);
      }
      if (info.file.status === "done") {
        const {
          file: { response },
        } = info;
        const data: any = response;
        if (data.errores.length > 0) {
          setErroresPlano(data.errores);
          setOpenModalErroresPlano(true);
          setLoader(false);
        }
        fetchPacientes();
        setLoader(false);
        notificationApi.open({
          type: info.file.response.status,
          message: info.file.response.message,
          duration: 20,
        });
      } else if (info.file.status === "error") {
        setLoader(false);
        notificationApi.open({
          type: "error",
          message: info.file.response.message,
          duration: 20,
        });
      }
    },
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Tipo Documento",
      dataIndex: "tipo_identificacion",
      key: "tipo_identificacion",
      align: "center",
      width: 90,
    },
    {
      title: "Identificación",
      dataIndex: "numero_identificacion",
      key: "numero_identificacion",
      align: "center",
      width: 120,
    },
    {
      title: "Primer Nombre",
      dataIndex: "nombre_primero",
      key: "nombre_primero",
    },
    {
      title: "Segundo Nombre",
      dataIndex: "nombre_segundo",
      key: "nombre_segundo",
    },
    {
      title: "Primer Apellido",
      dataIndex: "apellido_primero",
      key: "apellido_primero",
    },
    {
      title: "Segundo Apellido",
      dataIndex: "apellido_segundo",
      key: "apellido_segundo",
    },
    {
      title: "Género",
      dataIndex: "genero",
      key: "genero",
      align: "center",
      width: 80,
    },
    {
      title: "Celular",
      dataIndex: "celular",
      key: "celular",
    },
    {
      title: "EPS",
      dataIndex: "eps",
      key: "eps",
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
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      fixed: "right",
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
      {contextHolder}
      <ModalErroresPlano
        open={openModalErroresPlano}
        setOpen={(value: boolean) => setOpenModalErroresPlano(value)}
        errores={erroresPlano}
      />
      <StyledCard
        title={"Lista de pacientes"}
        extra={
          <Link to={`${location.pathname}/create`}>
            <Button type="primary">Crear</Button>
          </Link>
        }
      >
        <Spin spinning={loader}>
          <SearchBar style={{ marginBottom: 10 }}>
            <Input
              placeholder={`Busqueda número de identificación, debes presionar Enter para buscar`}
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
           {["administrador"].includes(user_rol) && (
            <Upload {...props}>
              <GreenButton type="primary" icon={<UploadOutlined />}>
                Cargar Pacientes
              </GreenButton>
            </Upload>
          )}
          <div style={{ marginTop: "10px" }}>
            <Table
              bordered
              rowKey={(record) => record.key}
              size="small"
              columns={columns}
              dataSource={dataSource}
              loading={loaderTable}
              scroll={{ x: 1200 }}
              pagination={{
                total: pagination?.total,
                showSizeChanger: false,
                simple: false,
                onChange: (page: number) => setCurrentPage(page),
                hideOnSinglePage: true,
                current: currentPage,
                showTotal: (total: number) => {
                  return <Text>Total Registros: {total}</Text>;
                },
              }}
            />
          </div>
        </Spin>
      </StyledCard>
    </>
  );
};
