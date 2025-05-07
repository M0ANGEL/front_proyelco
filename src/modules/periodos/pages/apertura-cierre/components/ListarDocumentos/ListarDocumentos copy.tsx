import React, { MouseEvent, useState } from 'react';
import { DatePicker, Button, List, Tag, Table } from 'antd';
import { Dayjs } from 'dayjs';
import { EventValue } from 'rc-picker/lib/interface';
import { PlayCircleFilled, StopFilled } from "@ant-design/icons";
import './styles.css';

const { RangePicker } = DatePicker;

export const ListarDocumentos = () => {
  const [dateRange, setDateRange] = React.useState([]);
  const [userHistory, setUserHistory] = React.useState([]);
  const [historialUsuarios, setHistorialUsuarios] = useState([]);
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [detalleEstadoMeses, setDetalleEstadoMeses] = useState<DetalleEstadoMes[]>([]);

  // Función para manejar el cambio en el rango de fecha.
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  // Función para manejar la acción de Apertura.
  const handleAperturaClick = () => {
    // Agregar lógica para la acción de Apertura aquí.
  };

  // Función para manejar la acción de Cierre.
  const handleCierreClick = () => {
    // Agregar lógica para la acción de Cierre aquí.
  };

  function handleCierre(event: MouseEvent<HTMLElement, MouseEvent>): void {
    throw new Error('Function not implemented.');
  }

  function handleApertura(event: MouseEvent<HTMLElement, MouseEvent>): void {
    throw new Error('Function not implemented.');
  }

  // Estado para almacenar el detalle del estado de los meses seleccionados

  const mesesData = [
    { id: 1, nombre: 'Enero', estado: 'Abierto', año: 2023 },
    { id: 2, nombre: 'Febrero', estado: 'Cerrado', año: 2023 },
    { id: 3, nombre: 'Marzo', estado: 'Abierto', año: 2023 },
    { id: 4, nombre: 'Abril', estado: 'Cerrado', año: 2023 },
    { id: 5, nombre: 'Mayo', estado: 'Abierto', año: 2023 },
    { id: 6, nombre: 'Junio', estado: 'Cerrado', año: 2023 },
    { id: 7, nombre: 'Julio', estado: 'Abierto', año: 2023 },
  ];

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Nombre del Mes',
      dataIndex: 'nombre',
      key: 'nombre',
      render: (text, record) => (
        <span
          className="nombre-mes"
          onClick={() => handleDetalleEstado(record.id, record.nombre)}
        >
          {text.charAt(0).toUpperCase() + text.slice(1)}
        </span>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      render: (text) => (
        <Tag color={text === 'Abierto' ? 'green' : 'red'}>{text}</Tag>
      ),
    },
    {
      title: 'Año',
      dataIndex: 'año',
      key: 'año',
    },
    
  ];

  type DetalleEstadoMes = {
    mesNombre: string;
    estado: string;
  };
  


  // Función para manejar el detalle del estado de los meses
  const handleDetalleEstado = (mesId, mesNombre) => {
    // Buscar el mes en mesesData por su ID
    const mesSeleccionado = mesesData.find((mes) => mes.id === mesId);

    // Actualizar el estado del detalle
    setDetalleEstadoMeses([{ mesNombre, estado: mesSeleccionado?.estado }]);
  };

  const data = mesesData; // Tu arreglo de meses

  return (
    <>
    <div className="formulario-container">
      <div className="formulario">
        <h2>Rango de Fecha</h2>
        <DatePicker.RangePicker
          onChange={(dates) => {
            setFechaInicio(dates[0]);
            setFechaFin(dates[1]);
          }}
        />
        <div className="botones-container">
          <Button className="boton-apertura" type="primary" onClick={handleApertura}>
            <PlayCircleFilled /> Apertura
          </Button>
          <Button className="boton-cierre" onClick={handleCierre}>
            <StopFilled /> Cierre
          </Button>
        </div>
      </div>

      {/* Espacio entre el Rango de Fecha y el Listado de Meses */}
      <div className="espacio"></div>

      <div className="listado-meses">
        <h2>Listado de Meses</h2>
        <Table columns={columns} dataSource={mesesData} pagination={false} />
      </div>

      <div className="espacio"></div>

    </div>
    
    <div>
        <h2>Historial de Usuario</h2>
        <List
          dataSource={historialUsuarios}
          renderItem={(item) => (
            <List.Item>{item}</List.Item>
          )}
        />
      </div>
      </>
  );

  // function generarListaMeses() {
  //   return (
  //     <div className="listado-meses">
  //       <h2>Listado de Meses</h2>
  //       <div className="cuadro-listado">
  //         {mesesData.map((mes, index) => (
  //           <div key={index} className="mes-fila">
  //             <div className="mes-columna">
  //               <span className="nombre-mes">ID: {mes.id}</span>
  //             </div>
  //             <div className="mes-columna">
  //               <span className="nombre-mes">
  //                 {mes.nombre.charAt(0).toUpperCase() + mes.nombre.slice(1)}
  //               </span>
  //             </div>
  //             <div className="mes-columna">
  //               <Tag color={mes.estado === 'Abierto' ? 'green' : 'red'}>
  //                 {mes.estado}
  //               </Tag>
  //             </div>
  //             <div className="mes-columna">
  //               <span className="nombre-mes">Año: {mes.año}</span>
  //             </div>

  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // }


  // return (
  //   <>

  //     <div className="formulario-container">
  //       <div className="formulario">
  //         <h2>Rango de Fecha</h2>
  //         <DatePicker.RangePicker
  //           onChange={(dates) => {
  //             setFechaInicio(dates[0]);
  //             setFechaFin(dates[1]);
  //           }}
  //         />
  //         <div className="botones-container">
  //           <Button className="boton-apertura" type="primary" onClick={handleApertura}>
  //             <PlayCircleFilled /> Apertura
  //           </Button>
  //           <Button className="boton-cierre" onClick={handleCierre}>
  //             <StopFilled /> Cierre
  //           </Button>
  //         </div>
  //       </div>

  //       <div className="listado-meses">
  //         <div className="cuadro-listado">
  //           {generarListaMeses()}
  //         </div>
  //       </div>

  //     </div>
  //     <div>
  //       <h2>Listado de Meses</h2>
  //       {/* Aquí puedes agregar tu listado de meses */}
  //     </div>
  //     <div>
  //       <h2>Historial de Usuario</h2>
  //       <List
  //         dataSource={historialUsuarios}
  //         renderItem={(item) => (
  //           <List.Item>{item}</List.Item>
  //         )}
  //       />
  //     </div></>
  // );
};
