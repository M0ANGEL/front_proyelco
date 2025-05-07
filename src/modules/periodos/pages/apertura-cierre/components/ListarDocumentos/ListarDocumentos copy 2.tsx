import React, { useState } from 'react';
import { DatePicker, Button, List, Tag, Table } from 'antd';
import { PlayCircleFilled, StopFilled } from "@ant-design/icons";
import './styles.css';

const { RangePicker } = DatePicker;

export const ListarDocumentos = () => {
  const [dateRange, setDateRange] = useState([]);
  const [historialUsuarios, setHistorialUsuarios] = useState([]);
  const [detalleEstadoMeses, setDetalleEstadoMeses] = useState([]);
  const [mesesData, setMesesData] = useState([
    { id: 1, nombre: 'Enero', estado: 'Abierto', año: 2023 },
    { id: 2, nombre: 'Febrero', estado: 'Cerrado', año: 2023 },
    { id: 3, nombre: 'Marzo', estado: 'Abierto', año: 2023 },
    { id: 4, nombre: 'Abril', estado: 'Cerrado', año: 2023 },
    { id: 5, nombre: 'Mayo', estado: 'Abierto', año: 2023 },
    { id: 6, nombre: 'Junio', estado: 'Cerrado', año: 2023 },
    { id: 7, nombre: 'Julio', estado: 'Abierto', año: 2023 },
  ]);

  const columns = [
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
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
  ];

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const handleAperturaClick = () => {
    // Agregar lógica para la acción de Apertura aquí.
  };

  const handleCierreClick = () => {
    // Agregar lógica para la acción de Cierre aquí.
  };

  function handleDetalleEstado(mesId, mesNombre) {
    // Simulación de consulta API para obtener el detalle del estado del mes
    // En este ejemplo, estamos utilizando datos simulados en lugar de una consulta real.
    const detalleSimulado = [
      { periodo: '2023-01', documentosCerrados: ['Doc1', 'Doc2'] },
      { periodo: '2023-02', documentosCerrados: ['Doc3', 'Doc4'] },
    ];
  
    // Buscar el detalle simulado por ID del mes
    const detalleMes = detalleSimulado.find((detalle) => detalle.periodo === `${2023}-${mesId}`);
  
    if (detalleMes) {
      setDetalleEstadoMeses([detalleMes]);
    } else {
      setDetalleEstadoMeses([]);
    }
  }
  

  return (
    <>
      <div className="formulario-container">
        <div className="formulario">
          <h2>Rango de Fecha</h2>
          <DatePicker.RangePicker
            onChange={(dates) => {
              // Simulación de consulta API para obtener el historial de usuario
              // En este ejemplo, estamos utilizando datos simulados en lugar de una consulta real.
              const historialSimulado = [
                { usuario: 'Usuario1', acciones: ['Apertura', 'Cierre'] },
                { usuario: 'Usuario2', acciones: ['Apertura'] },
              ];

              // Actualizar el historial simulado
              setHistorialUsuarios(historialSimulado);

              setDateRange(dates);
            }}
          />
          <div className="botones-container">
            <Button className="boton-apertura" type="primary" onClick={handleAperturaClick}>
              <PlayCircleFilled /> Apertura
            </Button>
            <Button className="boton-cierre" onClick={handleCierreClick}>
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


        {/* 
      <div>
        <h2>Historial de Usuario</h2>
        <List
          dataSource={historialUsuarios}
          renderItem={(item) => (
            <List.Item>{item.usuario} realizó: {item.acciones.join(', ')}</List.Item>
          )}
        />
      </div> */}
      </div>
      <div>
        <h2>Detalle del Estado del Mes</h2>
        <Table
          columns={[
            { title: 'Periodo', dataIndex: 'periodo', key: 'periodo' },
            {
              title: 'Documentos Cerrados',
              dataIndex: 'documentosCerrados',
              key: 'documentosCerrados',
              render: (documentos) => (
                <ul>
                  {documentos.map((doc, index) => (
                    <li key={index}>{doc}</li>
                  ))}
                </ul>
              ),
            },
          ]}
          dataSource={detalleEstadoMeses} // Usar detalleEstadoMeses como dataSource
          pagination={false}
        />

      </div>
    </>

  );
};
