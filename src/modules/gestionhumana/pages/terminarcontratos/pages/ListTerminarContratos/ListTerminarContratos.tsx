import { useEffect, useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Button, Input, notification, Space, Table, Tooltip, Typography, Upload } from "antd";
import { Link, useLocation } from "react-router-dom";
import { SearchBar } from "@/modules/gestionhumana/pages/empleados/pages/ListEmpleados/styled"
import { getTerminarContratos, generarPazYSalvo, downloadPazYSalvo, uploadSoportesAliados } from "@/services/gestion-humana/terminarContratosAPI";
import { CloudServerOutlined, EditOutlined, PaperClipOutlined, UploadOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { GreenButton } from "@/modules/aliados/pages/lista-dispensaciones/pages/ListDispensaciones/styled";
import useArrayBuffer from "@/modules/common/hooks/useArrayBuffer";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_ROL } from "@/config/api";
interface DataType {
  key: number;
  nombre: string;
  observacion: string;
  motivoDeRetiro: string;
  cedula: string;
  hasPazYSalvo: boolean;
  fecha_fin: string;
  user_sys: string;
}

const { Text } = Typography

export const ListTerminarContratos = () => {

  const [initialData, setInitialData] = useState<DataType[]>([])
  const [dataSource, setDataSource] = useState<DataType[]>([])
  const location = useLocation()
  const [api, contextHolder] = notification.useNotification()
  const [loaderTable, setLoaderTable] = useState<boolean>(true)
  const { arrayBufferToString } = useArrayBuffer()
  const { getSessionVariable } = useSessionStorage()
  const user_rol = getSessionVariable(KEY_ROL)

  const fetchContratosTerminados = () => {
    getTerminarContratos().then(({ data: { data } }) => {
      const contratosTerminados = data.map((contratosTerminado) => {
        return {
          key: contratosTerminado.id,
          nombre: contratosTerminado.nombre_completo,
          observacion: contratosTerminado.observacion,
          motivoDeRetiro: contratosTerminado.motivo_retiro_id,
          cedula: contratosTerminado.cedula,
          fecha_fin: contratosTerminado.fecha_fin,
          hasPazYSalvo: contratosTerminado.paz_y_salvo ? true : false,
          user_sys: contratosTerminado.user_sys,
        };
      });
      setInitialData(contratosTerminados);
      setDataSource(contratosTerminados);
      setLoaderTable(false);
    });
  };

  useEffect(() => {
    fetchContratosTerminados();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const filterTable = initialData?.filter((o: any) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setDataSource(filterTable);
  };

  const makePazYSalvo = ($id: string) => {
    
    generarPazYSalvo($id)
      .then((data) => {
        const file = new Blob([data.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        // Crear un enlace temporal para forzar la descarga
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = 'paz_y_salvo.pdf'; // Nombre del archivo a descargar
        document.body.appendChild(link);
        link.click(); // Simular el clic en el enlace para iniciar la descarga
        document.body.removeChild(link); // Eliminar el enlace después de la descarga
      })
      .finally(() => null) 
      .catch((error) => {
        api.open({
          type: "error",
          message: "No se puede generar paz y salvo.",
        });
        console.log('type: ' + error, 'title: ' + error.error + 'description: ' + error.message);
      });
  }

  const motivosDeRetiro: { [key: string]: string } = {
    '1': 'VOLUNTARIO',
    '2': 'TERMINACIÓN',
    '3': 'PERIODO DE PRUEBA',
  };

  const handleFileChangeImages = (file: File, id: React.Key) => {
    setLoaderTable(true);
    const formData = new FormData();
    formData.append("soportes", file);
    formData.append("id", id.toString());

    uploadSoportesAliados(formData)
      .then(() => {
        fetchContratosTerminados();
        api.open({
          type: "success",
          message: `Archivo cargado con exito!`,
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
              api.open({
                type: "error",
                message: error,
                duration: 5,
              });
            }
          } else {
            api.open({
              type: "error",
              message: response.data.message,
              duration: 5,
            });
          }
        }
      )
      .finally(() => setLoaderTable(false));
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Cédula",
      dataIndex: "cedula",
      key: "cedula",
      sorter: (a, b) => a.cedula.localeCompare(b.cedula),
      render: (value, { hasPazYSalvo }) => {
        return (
          <>
            {hasPazYSalvo && (
              <Tooltip title="Paz y salvo cargado">
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
    },
    {
      title: "Motivo retiro",
      dataIndex: "motivoDeRetiro",
      key: "motivoDeRetiro",
      sorter: (a, b) => a.motivoDeRetiro.localeCompare(b.motivoDeRetiro),
      render: (motivoDeRetiro) => (motivosDeRetiro[motivoDeRetiro]),
    },
    {
      title: "Obeservación",
      dataIndex: "observacion",
      key: "observacion",
      sorter: (a, b) => a.observacion.localeCompare(b.observacion),
    },
    {
      title: "Fecha terminacion",
      dataIndex: "fecha_fin",
      key: "fecha_fin",
      sorter: (a, b) => new Date(a.fecha_fin).getTime() - new Date(b.fecha_fin).getTime(),
    },
    {
      title: "Usuario",
      dataIndex: "user_sys",
      key: "user_sys",
      sorter: (a, b) => a.user_sys.localeCompare(b.user_sys),
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      render: (_, record: { key: React.Key; cedula: string }) => {
        return (
          <Space>
            <Tooltip title="Editar">
              <Link to={`${location.pathname}/edit/${record.key}`}>
                <Button key={record.key + 'edit'} size="small" icon={<EditOutlined />} type="primary" />
              </Link>
            </Tooltip>
            <Tooltip title="Crear Paz y Salvo">
              <Button
                key={record.key + "licencias"}
                size="small"
                icon={<FaFilePdf />}
                danger
                onClick={() => makePazYSalvo(record.key.toString())}
              />
            </Tooltip>
            <Upload
              beforeUpload={(file) => {
                handleFileChangeImages(file, record.key);
                return false;
              }}
              maxCount={10}
              accept=".pdf"
              showUploadList={false}
            >
              <Tooltip title="Cargar Paz y Salvo">
                <GreenButton size="small" disabled={!['gh_admin'].includes(user_rol)}>
                  <UploadOutlined />
                </GreenButton>
              </Tooltip>
            </Upload>
            <Tooltip title="Ver Paz y Salvo">
              <Button
                key={record.key + "soportes"}
                size="small"
                onClick={() => {
                  
                  downloadPazYSalvo(record.key.toString())
                    .then((response) => {
                      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
                      const pdfWindow = window.open(url, '_blank'); // Abrir el PDF en una nueva pestaña
                      if (pdfWindow) {
                        pdfWindow.focus();
                      }
                    })
                    .catch(({ response: { data } }) => {
                      const message = arrayBufferToString(data).replace(
                        /[ '"]+/g,
                        " "
                      );
                      api.open({
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
          </Space>
        );
      },
    },
  ]

  return (
    <>
      {contextHolder}
      <StyledCard
        title={"LISTA DE CONTRATOS FINALIZADOS"}
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
          loading={loaderTable}
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
  );
}