import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled"
import { SearchBar } from "@/modules/gestionhumana/pages/empleados/pages/ListEmpleados/styled"
import { Button, Input, message, Space, Tag, Tooltip, Typography } from "antd"
import { EditOutlined, SyncOutlined, CloudServerOutlined, PaperClipOutlined } from "@ant-design/icons"
import { FaFilePdf } from "react-icons/fa";
import Table, { ColumnsType } from "antd/es/table"
import useNotification from "antd/es/notification/useNotification"
import { ModalIncapacidad } from "../../components"
import { getIncapacidades, downloadSoporte, downloadTranscrito, downloadConstancia } from "@/services/gestion-humana/incapacidadesAPI"
import useArrayBuffer from "@/modules/common/hooks/useArrayBuffer"
import { generarLicenciasLaborales } from "@/services/gestion-humana/generarContratosAPI"
import moment from "moment";
import { TbFilePencil } from "react-icons/tb";
import { LuFileCheck } from "react-icons/lu";

interface DataType {
  key: number;
  cedula: string;
  nombre: string;
  cargo: string;
  origen: string;
  fechaInicio: string;
  fechaFin: string;
  salario: string;
  dias: string;
  valor_diario: string;
  valor_incapacidad: string;
  valor_asumido_farmart: string;
  valor_recobrado: string;
  radicado: string;
  pagado_valor: string;
  pagada: string;
  fecha_pago: string;
  sede: string;
  ciudad: string;
  has_file: boolean;
  user_sys: string;
  diagnostico: string;
  has_transcrito: boolean;
  has_constancia: boolean;
}

const { Text } = Typography

const formatNumber = (number: any) => {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};

export const ListIncapacidades = () => {

  const [loadingRow, setLoadingRow] = useState<any>([])
  const [initialData, setInitialData] = useState<DataType[]>([])
  const [dataSource, setDataSource] = useState<DataType[]>([])
  const location = useLocation()
  const [notificationApi, contextHolder] = useNotification()
  const [openModalSoportes, setOpenModalSoportes] = useState<boolean>(false)
  const [soportes, setSoportes] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const { arrayBufferToString } = useArrayBuffer()


  useEffect(() => {
    fetchIncapacidades()
  }, [])

  const fetchIncapacidades = () => {
    getIncapacidades().then(({ data: { data } }) => {
      const incapacidades = data.map((incapacidad) => {
        return {
          key: incapacidad.id,
          nombre: incapacidad.nombre_completo,
          cargo: incapacidad.cargo,
          origen: incapacidad.origen,
          fechaInicio: incapacidad.fecha_inicio,
          fechaFin: incapacidad.fecha_fin,
          salario: incapacidad.salario,
          valor_diario: incapacidad.valor_diario,
          valor_incapacidad: incapacidad.valor_incapacidad,
          dias: incapacidad.dias_incapacidad,
          valor_asumido_farmart: incapacidad.valor_asumido_farmart,
          valor_recobrado: incapacidad.valor_recobrado,
          radicado: incapacidad.radicado,
          pagada: incapacidad.pagada,
          pagado_valor: incapacidad.pagado_valor,
          fecha_pago: incapacidad.fecha_pago,
          sede: incapacidad.sede,
          ciudad: incapacidad.ciudad,
          cedula: incapacidad.cedula,
          has_file: incapacidad.incapacidad_file != null,
          user_sys: incapacidad.user_sys,
          diagnostico: incapacidad.diagnostico,
          has_transcrito: incapacidad.transcrito_file != null,
          has_constancia: incapacidad.constancia_file != null,
        };
      });
      setInitialData(incapacidades);
      setDataSource(incapacidades);
      setLoadingRow([]);
      setLoading(false)
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const filterTable = initialData?.filter((o: any) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setDataSource(filterTable)
  }

  const fetchLicenciasLaborales = ($id: string) => {

    generarLicenciasLaborales($id)
      .then((data) => {
        const file = new Blob([data.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        // Crear un enlace temporal para forzar la descarga
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = 'licencia.pdf'; // Nombre del archivo a descargar
        document.body.appendChild(link);
        link.click(); // Simular el clic en el enlace para iniciar la descarga
        document.body.removeChild(link); // Eliminar el enlace después de la descarga
      })
      .finally(() => null)
      .catch((error) => {
        notificationApi.open({
          type: "error",
          message: "No se puede generar licencia.",
        });
        console.log('type: ' + error, 'title: ' + error.error + 'description: ' + error.message);
      });
  }

  const columns: ColumnsType<DataType> = [
    {
      title: "Cédula",
      dataIndex: "cedula",
      key: "cedula",
      sorter: (a, b) => a.cedula.localeCompare(b.cedula),
      width: 100,
      render: (value, { has_file }) => {
        return (
          <>
            {has_file && (
              <Tooltip title="Incapacidad">
                <PaperClipOutlined style={{ marginRight: 5, color: "blue" }} />
              </Tooltip>
            )}
            {value}
          </>
        );
      },
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
      sorter: (a, b) => a.nombre.localeCompare(b.nombre),
      width: 160,
      render: (text) => (
        text ? (
          <Tooltip title={text}>
            {text.length > 20 ? `${text.substring(0, 20)}...` : text}
          </Tooltip>
        ) : null
      ),
    },
    {
      title: "Cargo",
      dataIndex: "cargo",
      key: "cargo",
      sorter: (a, b) => a.cargo.localeCompare(b.cargo),
      width: 160,
      render: (text) => (
        text ? (
          <Tooltip title={text}>
            {text.length > 20 ? `${text.substring(0, 20)}...` : text}
          </Tooltip>
        ) : null
      ),
    },
    {
      title: "Origen",
      dataIndex: "origen",
      key: "origen",
      width: 100,
      sorter: (a, b) => a.origen.localeCompare(b.origen),
    },
    {
      title: "Diagnostico",
      dataIndex: "diagnostico",
      key: "diagnostico",
      width: 160,
      sorter: (a, b) => a.diagnostico.localeCompare(b.diagnostico),
      render: (text) => (
        text ? (
          <Tooltip title={text}>
            {text.length > 20 ? `${text.substring(0, 20)}...` : text}
          </Tooltip>
        ) : null
      ),
    },
    {
      title: "Fecha inicio",
      dataIndex: "fechaInicio",
      key: "fechaInicio",
      width: 80,
      sorter: (a, b) => a.fechaInicio.localeCompare(b.fechaInicio),
    },
    {
      title: "Fecha fin",
      dataIndex: "fechaFin",
      key: "fechaFin",
      width: 80,
      sorter: (a, b) => a.fechaFin.localeCompare(b.fechaFin),
    },
    {
      title: "Salario",
      dataIndex: "salario",
      key: "salario",
      width: 100,
      sorter: (a, b) => a.salario.localeCompare(b.salario),
      render: (salario) => (formatNumber(salario))
    },
    {
      title: "Dias",
      dataIndex: "dias",
      key: "dias",
      align: "center",
      width: 60,
      render: (_, record: { key: React.Key; dias: string }) => {
        let color

        if (parseInt(record.dias) >= 15) {
          color = "red";
        }

        return (
          <Tag
            color={color}
            key={record.dias}
            icon={
              loadingRow.includes(record.key) ? (
                <SyncOutlined spin />
              ) : null
            }
          >
            {record.dias}
          </Tag>
        );
      },
      sorter: (a, b) => a.dias.localeCompare(b.dias),
    },
    {
      title: "Valor diario",
      dataIndex: "valor_diario",
      key: "valor_diario",
      width: 100,
      sorter: (a, b) => a.valor_diario.localeCompare(b.valor_diario),
      render: (valor_diario) => (formatNumber(valor_diario))
    },
    {
      title: "Valor incapacidad",
      dataIndex: "valor_incapacidad",
      key: "valor_incapacidad",
      width: 100,
      sorter: (a, b) => a.valor_incapacidad.localeCompare(b.valor_incapacidad),
      render: (valor_incapacidad) => (formatNumber(valor_incapacidad))
    },
    {
      title: "Valor Farmart",
      dataIndex: "valor_asumido_farmart",
      key: "valor_asumido_farmart",
      width: 100,
      sorter: (a, b) => a.valor_asumido_farmart.localeCompare(b.valor_asumido_farmart),
      render: (valor_asumido_farmart) => (formatNumber(valor_asumido_farmart))
    },
    {
      title: "Valor recobrado",
      dataIndex: "valor_recobrado",
      key: "valor_recobrado",
      width: 100,
      sorter: (a, b) => a.valor_recobrado.localeCompare(b.valor_recobrado),
      render: (valor_recobrado) => (formatNumber(valor_recobrado))
    },
    {
      title: "Sede",
      dataIndex: "sede",
      key: "sede",
      width: 160,
      sorter: (a, b) => a.sede.localeCompare(b.sede),
      render: (text) => (
        text ? (
          <Tooltip title={text}>
            {text.length > 20 ? `${text.substring(0, 20)}...` : text}
          </Tooltip>
        ) : null
      ),
    },
    {
      title: "Ciudad",
      dataIndex: "ciudad",
      key: "ciudad",
      width: 100,
      sorter: (a, b) => a.ciudad.localeCompare(b.ciudad),
    },
    {
      title: "Radicado",
      dataIndex: "radicado",
      key: "radicado",
      width: 100,
      sorter: (a, b) => a.radicado.localeCompare(b.radicado),
    },
    {
      title: "Pagada",
      dataIndex: "pagada",
      key: "pagada",
      width: 68,
      sorter: (a, b) => a.pagada.localeCompare(b.pagada),
    },
    {
      title: "Pagado valor",
      dataIndex: "pagado_valor",
      key: "pagado_valor",
      width: 100,
      sorter: (a, b) => a.pagado_valor.localeCompare(b.pagado_valor),
      render: (pagado_valor) => (formatNumber(pagado_valor))
    },
    {
      title: "Fecha pago",
      dataIndex: "fecha_pago",
      key: "fecha_pago",
      width: 100,
      sorter: (a, b) => a.fecha_pago.localeCompare(b.fecha_pago),
    },
    {
      title: "Usuario",
      dataIndex: "user_sys",
      key: "usuario",
      width: 120,
      sorter: (a, b) => a.user_sys.localeCompare(b.user_sys),
      render: (text) => (
        text ? (
          <Tooltip title={text}>
            {text.length > 20 ? `${text.substring(0, 20)}...` : text}
          </Tooltip>
        ) : null
      ),
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      fixed: "right",
      width: 180,
      render: (_, record: { key: React.Key; cedula: string; has_transcrito: boolean; has_constancia: boolean }) => {
        return (
          <Space>
            <Tooltip title="Editar">
              <Link to={`${location.pathname}/edit/${record.key}`}>
                <Button size="small" icon={<EditOutlined />} type="primary" />
              </Link>
            </Tooltip>
            <Tooltip title="Descargar incapacidad">
              <Button
                key={record.key + "soportes"}
                size="small"
                onClick={() => {
                  downloadSoporte(record.key.toString())
                    .then((response) => {

                      const url = window.URL.createObjectURL(
                        new Blob([response.data])
                      );
                      const link = document.createElement("a");
                      link.href = url;
                      link.setAttribute("download", 'incapacidad_' + record.cedula + '.pdf');
                      document.body.appendChild(link);
                      link.click();
                    })
                    .catch(({ response: { data } }) => {
                      const message = arrayBufferToString(data).replace(
                        /[ '"]+/g,
                        " "
                      );
                      notificationApi.open({
                        type: "error",
                        message: message,
                      });
                    })
                    .finally(() => null);
                }}
              >
                <CloudServerOutlined />
              </Button>
            </Tooltip>

            <Tooltip title="Descargar transcrito">
              <Button
                key={record.key + "transcrito"}
                size="small"
                disabled={!record.has_transcrito}
                onClick={() => {
                  downloadTranscrito(record.key.toString())
                    .then((response) => {

                      const url = window.URL.createObjectURL(
                        new Blob([response.data])
                      );
                      const link = document.createElement("a");
                      link.href = url;
                      link.setAttribute("download", 'transcrito' + record.cedula + '.pdf');
                      document.body.appendChild(link);
                      link.click();
                    })
                    .catch(({ response: { data } }) => {
                      const message = arrayBufferToString(data).replace(
                        /[ '"]+/g,
                        " "
                      );
                      notificationApi.open({
                        type: "error",
                        message: message,
                      });
                    })
                    .finally(() => null);
                }}
              >
                <TbFilePencil />
              </Button>
            </Tooltip>

            <Tooltip title="Descargar constancia">
              <Button
                key={record.key + "constancia"}
                size="small"
                disabled={!record.has_constancia}
                onClick={() => {
                  downloadConstancia(record.key.toString())
                    .then((response) => {

                      const url = window.URL.createObjectURL(
                        new Blob([response.data])
                      );
                      const link = document.createElement("a");
                      link.href = url;
                      link.setAttribute("download", 'constancia_' + record.cedula + '.pdf');
                      document.body.appendChild(link);
                      link.click();
                    })
                    .catch(({ response: { data } }) => {
                      const message = arrayBufferToString(data).replace(
                        /[ '"]+/g,
                        " "
                      );
                      notificationApi.open({
                        type: "error",
                        message: message,
                      });
                    })
                    .finally(() => null);
                }}
              >
                <LuFileCheck />
              </Button>
            </Tooltip>

            <Tooltip title="Generar Licencia">
              <Button
                key={record.key + "licencias"}
                size="small"
                icon={<FaFilePdf />}
                danger
                onClick={() => fetchLicenciasLaborales(record.key.toString())}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ]

  const getRowClassName = (record: DataType) => {
    const today = moment();
    const startDate = moment(record.fechaInicio, "YYYY-MM-DD");
    const endDate = moment(record.fechaFin, "YYYY-MM-DD");

    return today.isBetween(startDate, endDate, "day", "[]") ? "highlight-row" : "";
  };

  return (
    <>
      {contextHolder}
      <ModalIncapacidad
        open={openModalSoportes}
        setOpen={(value: boolean) => {
          setOpenModalSoportes(value);
        }}
        soportes={soportes}
      />
      <StyledCard
        title={"LISTA INCAPACIDADES Y LICENCIAS"}
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
          scroll={{ x: 2200 }}
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
          rowClassName={getRowClassName}
        />
      </StyledCard>
    </>
  )
}