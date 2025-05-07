import { useState, useEffect } from 'react';
import { DatePicker, Button, Tag, Table, Typography, Modal, Checkbox, Progress, Input, Spin } from 'antd';
import { PlayCircleFilled, StopFilled, CheckOutlined, CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import './styles.css';
import {
  StyledCard,
} from "@/modules/common/layout/DashboardLayout/styled";
import { getTiposDocumentos } from '@/services/maestras/tiposDocumentosAPI';
import { message } from '@/../node_modules/antd/es/index';
import { createPeriodos, getHistorico, getResumenMes } from '@/services/periodos/periodosAPI';
import moment from 'moment';

const { Title } = Typography;

export const ListarDocumentos = () => {
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [detalleEstadoMeses, setDetalleEstadoMeses] = useState<DetalleEstadoMes[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [progress, setProgress] = useState(0); // Inicialmente, el progreso es 0
  const [totalDocuments] = useState(100); // Número total de documentos a procesar
  const [tiposDocumentos, setTiposDocumentos] = useState([]); // Estado para almacenar los tipos de documentos
  const [searchText, setSearchText] = useState('');
  const [apertura, setApertura] = useState(0); // Inicialmente, el progreso es 0
  const [cierre, setCierre] = useState(0); // Inicialmente, el progreso es 0
  const [enableOkButton, setEnableOkButton] = useState(false);
  const [resumenData, setResumenData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [allSelected, setAllSelected] = useState(false);
  const [loadTablas, setLoadTablas] = useState(false);

  // Función para manejar la acción de Apertura.
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        if (progress < totalDocuments) {
          setProgress((prevProgress) => prevProgress + 1);
        } else {
          clearInterval(interval);
          setLoading(false);
        }
      }, 100);
    }
  }, [loading, progress, totalDocuments]);

  useEffect(() => {
    getResumenMes()
      .then(({ data }) => {
        // Transformar los datos y actualizar el estado
        const mesesData = data.map((mes, index) => ({
          id: index + 1,
          mes: mes.mes,
          estado: mes.estado,
          anio: mes.anio
        }));
        setTimeout(() => {
          //navigate(-1);
        }, 800);

        setResumenData(mesesData);
        setLoading(false); // Desactivar la carga una vez que se han obtenido los datos
        setLoadTablas(false);

      })
      .catch((error) => {
        // Manejar errores de la solicitud
        console.log("Error al obtener tipos de documentos", error);
        setLoading(false); // Desactivar la carga en caso de error
        setLoadTablas(false); // Desactivar la carga una vez que se han obtenido los datos

      });

    getHistorico()
      .then(({ data }) => {
        setLoadTablas(true);
        const historico = data.map((hisPer) => {
          const fechaCreacion = new Date(hisPer.created_at);
          const formattedFechaCreacion = `${fechaCreacion.getFullYear()}-${padZero(fechaCreacion.getMonth() + 1)}-${padZero(fechaCreacion.getDate())}  ${padZero(fechaCreacion.getHours())}:${padZero(fechaCreacion.getMinutes())}`;

          return {
            key: hisPer.id,
            documentos: hisPer.documentos,
            periodo: hisPer.apertura == 1 && hisPer.cierre == 0 ? 'Abierto' : 'Cerrado',
            fecIni: hisPer.fecha_inicio,
            fecFin: hisPer.fecha_fin,
            usuario: hisPer.username,
            fechaCreacion: formattedFechaCreacion,
          };
        });

        function padZero(value) {
          return String(value).padStart(2, '0');
        }

        setDetalleEstadoMeses(historico);
        setLoadTablas(false); // Desactivar la carga una vez que se han obtenido los datos

      })
      .catch((error) => {
        // Manejar errores de la solicitud
        console.log("Error al obtener tipos de documentos", error);
        // setLoading(false); // Desactivar la carga en caso de error
      });

       setLoadTablas(false); // Desactivar la carga una vez que se han obtenido los datos

  }, [modalVisible]);

  const handleAperturaClick = () => {
    // Realizar la solicitud al backend
    setLoading(true); // Activar la carga mientras se realiza la solicitud
    setApertura(1);
    setCierre(0);

    getTiposDocumentos()
      .then(({ data }) => {
        const tipos = data
          .map((tipo) => ({
            id: tipo.id,
            descripcion: tipo.descripcion,
            codigo: tipo.codigo,
          }))
          .filter((tipo) => tipo.codigo !== "PEN" && tipo.codigo !== "TRP" && tipo.codigo !== "RC"); // Filtrar los tipos con código "PEN"


        setTiposDocumentos(tipos);
      })
      .catch((error) => {
        // Manejar errores de la solicitud
        console.error("Error al obtener tipos de documentos", error);
        setLoading(false); // Desactivar la carga en caso de error
      });


    handleApertura();
  };

  // Función para manejar la acción de Cierre.
  const handleCierreClick = () => {
    setLoading(true); // Activar la carga mientras se realiza la solicitud
    setCierre(1);
    setApertura(0);

    getTiposDocumentos()
      .then(({ data }) => {
        const tipos = data
          .map((tipo) => ({
            id: tipo.id,
            descripcion: tipo.descripcion,
            codigo: tipo.codigo,
          }))
          .filter((tipo) => tipo.codigo !== "PEN" && tipo.codigo !== "TRP" && tipo.codigo !== "RC"); // Filtrar los tipos con código "PEN"


        setTiposDocumentos(tipos);
      })
      .catch((error) => {
        // Manejar errores de la solicitud
        console.error("Error al obtener tipos de documentos", error);
        setLoading(false); // Desactivar la carga en caso de error
      });


    // handleApertura();

    handleCierre();
  };

  function handleCierre(): void {
    setModalVisible(true);
  }

  function handleApertura(): void {
    setModalVisible(true);
  }

  const handleModalOk = () => {
    console.log("rango fechas=> ", fechaInicio, fechaFin)

    // Lógica para realizar la solicitud al backend aquí
    const payload = [{ documentos: selectedDocuments, fechaInicio: fechaInicio, fechaFin: fechaFin, apertura: apertura, cierre: cierre, }]

    setLoading(true);
    setLoadTablas(true);

    // Hacer la solicitud al backend y luego resetear el estado cuando haya terminado
    createPeriodos(payload)
      .then(() => {
        message.open({
          type: "success",
          content: `Creación de período exitosa!`,
        });
        setTimeout(() => {
          setModalVisible(false);
          setFechaInicio(null);
          setFechaFin(null);
          // window.location.reload();
          setSelectedDocuments([]);
          setSearchText('');

          // Restablece el estado de "Seleccionar Todo" en el Modal
          setSelectAll(false);
          setLoadTablas(false);

        }, 800);
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
              message.open({
                type: "error",
                content: error,
              });
            }
          } else {
            message.open({
              type: "error",
              content: response.data.message,
            });
          }
          
          setLoading(false);
        }
        );
        setLoadTablas(false);
  };

  const handleModalCancel = () => {
    // Lógica para cancelar la modal y restablecer el estado
    setModalVisible(false);
    setSelectedDocuments([]);
  };

  const columns = [
    {
      title: 'Mes',
      dataIndex: 'mes',
      key: 'mes',
      width: 180,
      align: "center",
      render: (text, record) => (
        <Tag color={'green'}
          className="nombre-mes"
          // onClick={() => handleDetalleEstado(record.id, record.mes)}
        >
          {text.charAt(0).toUpperCase() + text.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      width: 180,
      align: "center",
      render: (text) => (
        <Tag
          className="nombre-mes"
          color={text === 'ABIERTO' ? '#0fa189' : '#a1380f'}>{text}</Tag>
      ),
    },
    {
      title: 'Año',
      dataIndex: 'anio',
      key: 'anio',
      width: 100,
      align: "center",
      render: (text, record) => (
        <span
          className="nombre-mes"
        >
          {text}
        </span>
      ),
    },

  ];

  type DetalleEstadoMes = {
    mesNombre: string;
    estado: string;
  };

  // Función para manejar el detalle del estado de los meses
  const handleDetalleEstado = (mesId, mesNombre) => {
    // Buscar el mes en mesesData por su ID
    const mesSeleccionado = resumenData.find((mes) => mes.id === mesId);

    // Actualizar el estado del detalle
    setDetalleEstadoMeses([{ mesNombre, estado: mesSeleccionado?.estado }]);
  };

  const handleDocumentSelection = (documentKey, isSelected) => {
    if (isSelected) {
      // Agregar el documento a la lista de documentos seleccionados
      setSelectedDocuments([...selectedDocuments, documentKey]);
      setEnableOkButton(true);
    } else {
      // Eliminar el documento de la lista de documentos seleccionados
      setSelectedDocuments(selectedDocuments.filter((key) => key !== documentKey));
    }
  };

  // Filtra los documentos según el texto de búsqueda
  const filteredDocumentos = tiposDocumentos.filter((documento) =>
    documento.descripcion.toLowerCase().includes(searchText.toLowerCase())
  );
  const fechasSeleccionadas = fechaInicio && fechaFin;

  const handleSelectAll = (e) => {
    // Actualizar el estado "Seleccionar Todo"
    setSelectAll(e.target.checked);

    // Actualizar la selección de documentos individuales
    const newSelectedDocuments = e.target.checked
      ? filteredDocumentos.map((documento) => documento.id)
      : [];

    setSelectedDocuments(newSelectedDocuments);

    // Actualizar el estado "Todos Seleccionados"
    setAllSelected(e.target.checked);
  };

  useEffect(() => {
    // Actualizar el estado "Enable Ok Button" cuando cambia la selección de documentos o "Todos Seleccionados"
    setEnableOkButton(selectedDocuments.length > 0 || allSelected);
  }, [selectedDocuments, allSelected]);

  const handleDateChange = (dates) => {
    if (dates) {
      // Código para convertir las fechas a objetos Date
      const fecInicia = dates[0].$d;
      const year = fecInicia.getFullYear();
      const month = String(fecInicia.getMonth() + 1).padStart(2, '0');
      const day = String(fecInicia.getDate()).padStart(2, '0');
      const formattedFechaInicio = `${year}-${month}-${day}`;


      const fecFinaliza = dates[1].$d;
      const yearEnd = fecFinaliza.getFullYear();
      const monthEnd = String(fecFinaliza.getMonth() + 1).padStart(2, '0');
      const dayEnd = String(fecFinaliza.getDate()).padStart(2, '0');

      const formattedFechaFin = `${yearEnd}-${monthEnd}-${dayEnd}`;

      setFechaInicio(formattedFechaInicio);
      setFechaFin(formattedFechaFin);
    } else {
      // Aquí estableces el valor del rango de fecha en un array vacío para dejar los campos en blanco.
      setFechaInicio(null);
      setFechaFin(null);
    }
  };


  return (
    <>
      <StyledCard
        className="styled-card-documents"
        title={
          <Title level={4}>
            Apertura y Cierre Períodos
          </Title>
        }
      >
        <div className="formulario-container">
          <div className="formulario">
            <h2 style={{ fontSize: 16, color: "#f4882a" }}>Elegir Rango de Fecha:</h2>
            <DatePicker.RangePicker
              placeholder={['Fecha Inicial', 'Fecha Final']}
              value={
                fechaInicio && fechaFin
                  ? [moment(fechaInicio), moment(fechaFin)]
                  : null
              }
              onChange={handleDateChange}
            // onChange={(dates) => {
            //   console.log(dates[0].$d) 

            //   const fecInicia = dates[0].$d;
            //   const year = fecInicia.getFullYear();
            //   const month = String(fecInicia.getMonth() + 1).padStart(2, '0');
            //   const day = String(fecInicia.getDate()).padStart(2, '0');
            //   const formattedFechaInicio = `${year}-${month}-${day}`;


            //   const fecFinaliza = dates[1].$d;
            //   const yearEnd = fecFinaliza.getFullYear();
            //   const monthEnd = String(fecFinaliza.getMonth() + 1).padStart(2, '0');
            //   const dayEnd = String(fecFinaliza.getDate()).padStart(2, '0');

            //   const formattedFechaFin = `${yearEnd}-${monthEnd}-${dayEnd}`;

            //   setFechaInicio(formattedFechaInicio);
            //   setFechaFin(formattedFechaFin);
            // }}
            />
            <div className="botones-container">
              <Button className="boton-apertura" type="primary" onClick={handleAperturaClick} disabled={!fechasSeleccionadas}>
                <PlayCircleFilled />
                Apertura
              </Button>
              <Button className="boton-cierre" onClick={handleCierreClick} disabled={!fechasSeleccionadas}>
                <StopFilled /> Cierre
              </Button>
            </div>
          </div>
          {/* Espacio entre el Rango de Fecha y el Listado de Meses */}
          <div className="espacio"></div>
          <div className="listado-meses">
            <h2 style={{ fontSize: 16, color: "#f4882a" }}>Listado de Meses</h2>
            <Table columns={columns} dataSource={resumenData} pagination={{ pageSize: 12 }} />
          </div>
          <Modal
            title="Selección de Documentos"
            open={modalVisible}
            onOk={handleModalOk}
            onCancel={handleModalCancel}
            width={500}
            footer={[
              <Button key="back" onClick={handleModalCancel} icon={<CloseOutlined />}>
                Cancelar
              </Button>,
              <Button
                key="submit"
                type="primary"
                onClick={handleModalOk}
                disabled={!enableOkButton}
                icon={<CheckOutlined />}
              >
                Guardar
              </Button>,
            ]}
          >
            <Input.Search
              placeholder="Buscar documentos"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ marginTop: '12px', marginBottom: '12px' }}
            />
            {/* Agrega el checkbox "Seleccionar Todo" */}
            <Checkbox
              checked={selectAll}
              onChange={handleSelectAll}
            >
              Seleccionar Todo
            </Checkbox>
            <Table
              columns={[
                {
                  title: 'Seleccionar',
                  dataIndex: 'seleccionar',
                  key: 'seleccionar',
                  align: 'center',
                  render: (text, record) => (
                    <Checkbox
                      checked={selectedDocuments.includes(record.id)}
                      onChange={(e) => handleDocumentSelection(record.id, e.target.checked)}
                    />
                  ),
                },
                { title: 'Código', dataIndex: 'codigo', key: 'codigo', align: 'center' },
                { title: 'Nombre', dataIndex: 'descripcion', key: 'descripcion' },
              ]}
              dataSource={filteredDocumentos}
              pagination={{ pageSize: 5 }}
            />
            {loading ? (
              <div>
                <p>Procesando documentos...</p>
                <Progress percent={(progress / totalDocuments) * 100} status="active" />
              </div>
            ) : (
              <></>
              //<p>Proceso completado</p>
            )}
          </Modal>
        </div>

        <div style={{ paddingTop: "20px" }}>
          <h2 style={{ fontSize: 18, color: "#000000", textAlign: "center" }}>Detalle Períodos</h2>
          <Spin spinning={loadTablas} indicator={<LoadingOutlined spin style={{ color: "orange" }} />}>
            <Table
              columns={[
                { title: 'Periodo', dataIndex: 'periodo', key: 'periodo', align: 'center'},
                {
                  title: 'Documentos',
                  dataIndex: 'documentos',
                  key: 'documentos',
                  width: 380,
                  align: 'center'
                },
                { title: 'Fecha Inicial', dataIndex: 'fecIni', key: 'fecIni', align: 'center' }, // Agregar la columna de fecha de modificación
                { title: 'Fecha Final', dataIndex: 'fecFin', key: 'fecFin', align: 'center' }, // Agregar la columna de fecha de modificación
                { title: 'Usuario Elabora', dataIndex: 'usuario', key: 'usuario', align: 'center' }, // Agregar la columna de usuario
                { title: 'Fecha Realizado', dataIndex: 'fechaCreacion', key: 'fechaCreacion', align: 'center' }, // Agregar la columna de fecha de modificación
              ]}
              dataSource={detalleEstadoMeses} // Usar detalleEstadoMeses como dataSource
              pagination={{ pageSize: 10 }}

            />
          </Spin>
        </div>
      </StyledCard>
    </>
  );


};


