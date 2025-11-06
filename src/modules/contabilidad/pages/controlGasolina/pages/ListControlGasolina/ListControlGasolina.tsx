// // // import { useEffect, useState } from "react";
// // // import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
// // // import { Button, Col, DatePicker, Select, Table, Row, Space } from "antd";
// // // import dayjs from "dayjs";
// // // import { 
// // //   getConductores,
// // //   getPlacas,
// // //   getControlGasolina 
// // // } from "@/services/contabilidad/controlGasolinaAPI";

// // // const { RangePicker } = DatePicker;

// // // interface DataType {
// // //   key: number;
// // //   placa: string;
// // //   conductor: string;
// // //   monto: number;
// // //   volumen: number;
// // //   km: number;
// // //   fecha: string;
// // //   combustible: string;
// // //   comprobante: string;
// // // }

// // // interface DataSelect {
// // //   label: string;
// // //   value: number | string;
// // // }

// // // export const ListControlGasolina = () => {
// // //   const [conductores, setConductores] = useState<DataSelect[]>([]);
// // //   const [placas, setPlacas] = useState<DataSelect[]>([]);
// // //   const [selectedPlacas, setSelectedPlacas] = useState<(number | string)[]>([]);
// // //   const [selectedConductores, setSelectedConductores] = useState<(number | string)[]>([]);
// // //   const [selectedFiltro, setSelectedFiltro] = useState<string | null>(null);
// // //   const [selectedCorte, setSelectedCorte] = useState<string | null>(null);
// // //   const [selectedMes, setSelectedMes] = useState<string | null>(null);
// // //   const [fechaRange, setFechaRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
// // //   const [dataSource, setDataSource] = useState<DataType[]>([]);
// // //   const [loading, setLoading] = useState(false);
// // //   const [currentPage, setCurrentPage] = useState(1);
// // //   const [pageSize, setPageSize] = useState(10);

// // //   const [filtros] = useState<DataSelect[]>([
// // //     { label: "Rango Fechas", value: "1" },
// // //     { label: "Cortes", value: "2" },
// // //   ]);

// // //   const [cortes] = useState<DataSelect[]>([
// // //     { label: "Del 1 al 15", value: "1" },
// // //     { label: "Del 16 a Fin mes", value: "2" },
// // //   ]);

// // //   const [meses] = useState<DataSelect[]>([
// // //     { label: "Enero", value: "1" },
// // //     { label: "Febrero", value: "2" },
// // //     { label: "Marzo", value: "3" },
// // //     { label: "Abril", value: "4" },
// // //     { label: "Mayo", value: "5" },
// // //     { label: "Junio", value: "6" },
// // //     { label: "Julio", value: "7" },
// // //     { label: "Agosto", value: "8" },
// // //     { label: "Septiembre", value: "9" },
// // //     { label: "Octubre", value: "10" },
// // //     { label: "Noviembre", value: "11" },
// // //     { label: "Diciembre", value: "12" },
// // //   ]);

// // //   useEffect(() => {
// // //     fetchConductores();
// // //     fetchPlacas();
// // //   }, []);

// // //   const fetchConductores = async () => {
// // //     try {
// // //       const { data: { data } } = await getConductores();
// // //       setConductores(
// // //         data.map((p: any) => ({
// // //           label: p.nombre_completo.toUpperCase(),
// // //           value: p.id,
// // //         }))
// // //       );
// // //     } catch (error) {
// // //       console.error("Error al obtener conductores:", error);
// // //     }
// // //   };

// // //   const fetchPlacas = async () => {
// // //     try {
// // //       const { data: { data } } = await getPlacas();
// // //       setPlacas(
// // //         data.map((p: any) => ({
// // //           label: p.placa.toUpperCase(),
// // //           value: p.placa, // Usar la placa como valor, no el ID
// // //         }))
// // //       );
// // //     } catch (error) {
// // //       console.error("Error al obtener placas:", error);
// // //     }
// // //   };

// // //   const handleConsultar = async () => {
// // //     if (selectedFiltro === "1" && !fechaRange) {
// // //       console.error("Debe seleccionar un rango de fechas");
// // //       return;
// // //     }

// // //     if (selectedFiltro === "2" && (!selectedCorte || !selectedMes)) {
// // //       console.error("Debe seleccionar mes y corte");
// // //       return;
// // //     }

// // //     setLoading(true);
// // //     try {
// // //       const dataPost = {
// // //         tipoFiltro: selectedFiltro,
// // //         fechaInicio: selectedFiltro === "1" && fechaRange ? fechaRange[0].format("YYYY-MM-DD") : null,
// // //         fechaFin: selectedFiltro === "1" && fechaRange ? fechaRange[1].format("YYYY-MM-DD") : null,
// // //         mes: selectedFiltro === "2" ? selectedMes : null,
// // //         corte: selectedFiltro === "2" ? selectedCorte : null,
// // //         placas: selectedPlacas.length > 0 ? selectedPlacas : null,
// // //         conductores: selectedConductores.length > 0 ? selectedConductores : null,
// // //       };

// // //       console.log("Datos enviados:", dataPost);

// // //       const { data: { data } } = await getControlGasolina(dataPost);

// // //       const mapped = data.map((item: any, idx: number) => ({
// // //         key: idx,
// // //         placa: item.proyecto || "-",
// // //         conductor: item.cliente || "-",
// // //         monto: item.cantidad || 0,
// // //         volumen: item.volumen || 0,
// // //         km: item.km || 0,
// // //         fecha: item.fecha || "-",
// // //         combustible: item.combustible || "-",
// // //         comprobante: item.comprobante || "-"
// // //       }));

// // //       setDataSource(mapped);
// // //     } catch (error) {
// // //       console.error("Error en la consulta:", error);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const columns = [
// // //     {
// // //       title: "Placa",
// // //       dataIndex: "placa",
// // //       key: "placa",
// // //       align: "center",
// // //     },
// // //     {
// // //       title: "Conductor",
// // //       dataIndex: "conductor",
// // //       key: "conductor",
// // //       align: "center",
// // //     },
// // //     {
// // //       title: "Monto ($)",
// // //       dataIndex: "monto",
// // //       key: "monto",
// // //       align: "center",
// // //       render: (monto: number) => `$${monto.toLocaleString()}`,
// // //     },
// // //     {
// // //       title: "Volumen (L)",
// // //       dataIndex: "volumen",
// // //       key: "volumen",
// // //       align: "center",
// // //       render: (volumen: number) => `${volumen}L`,
// // //     },
// // //     {
// // //       title: "Kilometraje",
// // //       dataIndex: "km",
// // //       key: "km",
// // //       align: "center",
// // //       render: (km: number) => `${km} km`,
// // //     },
// // //     {
// // //       title: "Fecha",
// // //       dataIndex: "fecha",
// // //       key: "fecha",
// // //       align: "center",
// // //     },
// // //     {
// // //       title: "Combustible",
// // //       dataIndex: "combustible",
// // //       key: "combustible",
// // //       align: "center",
// // //     },
// // //     {
// // //       title: "Comprobante",
// // //       dataIndex: "comprobante",
// // //       key: "comprobante",
// // //       align: "center",
// // //     }
// // //   ];

// // //   const isConsultarDisabled =
// // //     (selectedFiltro === "1" && !fechaRange) ||
// // //     (selectedFiltro === "2" && (!selectedCorte || !selectedMes)) ||
// // //     !selectedFiltro;

// // //   const totalGeneral = dataSource.reduce((acc, item) => acc + item.monto, 0);
// // //   const totalVolumen = dataSource.reduce((acc, item) => acc + (parseFloat(item.volumen.toString()) || 0), 0);

// // //   return (
// // //     <StyledCard title="Informes de control de gasolina">
// // //       <Row gutter={16} align="bottom" style={{ marginBottom: 16 }}>
// // //         {/* Tipo de filtro */}
// // //         <Col xs={24} md={4}>
// // //           <Select
// // //             placeholder="Tipo de filtro"
// // //             options={filtros}
// // //             value={selectedFiltro}
// // //             onChange={(value) => {
// // //               setSelectedFiltro(value);
// // //               // Limpiar otros filtros al cambiar tipo
// // //               setFechaRange(null);
// // //               setSelectedCorte(null);
// // //               setSelectedMes(null);
// // //             }}
// // //             style={{ width: "100%" }}
// // //             allowClear
// // //           />
// // //         </Col>

// // //         {/* Corte y mes */}
// // //         {selectedFiltro === "2" && (
// // //           <>
// // //             <Col xs={12} md={3}>
// // //               <Select
// // //                 placeholder="Mes"
// // //                 options={meses}
// // //                 value={selectedMes}
// // //                 onChange={(value) => setSelectedMes(value)}
// // //                 style={{ width: "100%" }}
// // //                 allowClear
// // //               />
// // //             </Col>

// // //             <Col xs={12} md={3}>
// // //               <Select
// // //                 placeholder="Corte"
// // //                 options={cortes}
// // //                 value={selectedCorte}
// // //                 onChange={(value) => setSelectedCorte(value)}
// // //                 style={{ width: "100%" }}
// // //                 allowClear
// // //               />
// // //             </Col>
// // //           </>
// // //         )}

// // //         {/* Rango de fechas */}
// // //         {selectedFiltro === "1" && (
// // //           <Col xs={24} md={6}>
// // //             <RangePicker
// // //               style={{ width: "100%" }}
// // //               format="DD/MM/YYYY"
// // //               placeholder={["Fecha inicio", "Fecha fin"]}
// // //               value={fechaRange}
// // //               onChange={(dates) => setFechaRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
// // //               disabledDate={(current) => current && current > dayjs().endOf("day")}
// // //             />
// // //           </Col>
// // //         )}

// // //         {/* Placas */}
// // //         <Col xs={24} md={4}>
// // //           <Select
// // //             mode="multiple"
// // //             placeholder="Placas"
// // //             options={placas}
// // //             value={selectedPlacas}
// // //             onChange={(values) => setSelectedPlacas(values)}
// // //             style={{ width: "100%" }}
// // //             allowClear
// // //             showSearch
// // //             optionFilterProp="label"
// // //             maxTagCount="responsive"
// // //           />
// // //         </Col>

// // //         {/* Conductores */}
// // //         <Col xs={24} md={4}>
// // //           <Select
// // //             mode="multiple"
// // //             placeholder="Conductores"
// // //             options={conductores}
// // //             value={selectedConductores}
// // //             onChange={(values) => setSelectedConductores(values)}
// // //             style={{ width: "100%" }}
// // //             allowClear
// // //             showSearch
// // //             optionFilterProp="label"
// // //             maxTagCount="responsive"
// // //           />
// // //         </Col>

// // //         {/* Botón Consultar alineado a la derecha */}
// // //         <Col xs={24} md={3} style={{ textAlign: "right" }}>
// // //           <Button
// // //             type="primary"
// // //             onClick={handleConsultar}
// // //             disabled={isConsultarDisabled}
// // //             loading={loading}
// // //             size="large"
// // //             style={{ width: "100%" }}
// // //           >
// // //             Consultar
// // //           </Button>
// // //         </Col>
// // //       </Row>

// // //       <Row gutter={16} align="middle">
// // //         <Col xs={24} md={18}>
// // //           <Table
// // //             columns={columns}
// // //             dataSource={dataSource}
// // //             loading={loading}
// // //             rowKey="key"
// // //             pagination={{
// // //               current: currentPage,
// // //               pageSize: pageSize,
// // //               total: dataSource.length,
// // //               showSizeChanger: true,
// // //               pageSizeOptions: ["10", "20", "50", "100"],
// // //               showTotal: (total, range) =>
// // //                 `${range[0]}-${range[1]} de ${total} registros`,
// // //               onChange: (page, size) => {
// // //                 setCurrentPage(page);
// // //                 setPageSize(size || 10);
// // //               },
// // //             }}
// // //             scroll={{ x: 1000 }}
// // //           />
// // //         </Col>

// // //         {/* Indicadores */}
// // //         <Col xs={24} md={6} style={{ textAlign: "center" }}>
// // //           <div style={{ marginBottom: "2rem" }}>
// // //             <span
// // //               style={{
// // //                 fontSize: "3rem",
// // //                 fontWeight: "bold",
// // //                 color: "#e68415ff",
// // //                 display: "block",
// // //               }}
// // //             >
// // //               ${totalGeneral.toLocaleString()}
// // //             </span>
// // //             <span style={{ fontSize: "1.2rem" }}>Total Monto</span>
// // //           </div>
          
// // //           <div style={{ marginBottom: "2rem" }}>
// // //             <span
// // //               style={{
// // //                 fontSize: "3rem",
// // //                 fontWeight: "bold",
// // //                 color: "#1890ff",
// // //                 display: "block",
// // //               }}
// // //             >
// // //               {totalVolumen.toLocaleString()}L
// // //             </span>
// // //             <span style={{ fontSize: "1.2rem" }}>Total Volumen</span>
// // //           </div>

// // //           <div>
// // //             <span
// // //               style={{
// // //                 fontSize: "2rem",
// // //                 fontWeight: "bold",
// // //                 color: "#52c41a",
// // //                 display: "block",
// // //               }}
// // //             >
// // //               {dataSource.length}
// // //             </span>
// // //             <span style={{ fontSize: "1.2rem" }}>Total Registros</span>
// // //           </div>
// // //         </Col>
// // //       </Row>
// // //     </StyledCard>
// // //   );
// // // };

// // import { useEffect, useState } from "react";
// // import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
// // import { Button, Col, DatePicker, Select, Table, Row, Space, Card } from "antd";
// // import dayjs from "dayjs";
// // import { 
// //   getConductores,
// //   getPlacas,
// //   getControlGasolina 
// // } from "@/services/contabilidad/controlGasolinaAPI";

// // const { RangePicker } = DatePicker;

// // interface DataType {
// //   key: number;
// //   placa: string;
// //   conductor: string;
// //   monto: number;
// //   volumen: number;
// //   km: number;
// //   fecha: string;
// //   combustible: string;
// //   comprobante: string;
// // }

// // interface DataSelect {
// //   label: string;
// //   value: number | string;
// // }

// // export const ListControlGasolina = () => {
// //   const [conductores, setConductores] = useState<DataSelect[]>([]);
// //   const [placas, setPlacas] = useState<DataSelect[]>([]);
// //   const [selectedPlacas, setSelectedPlacas] = useState<(number | string)[]>([]);
// //   const [selectedConductores, setSelectedConductores] = useState<(number | string)[]>([]);
// //   const [selectedFiltro, setSelectedFiltro] = useState<string | null>(null);
// //   const [selectedCorte, setSelectedCorte] = useState<string | null>(null);
// //   const [selectedMes, setSelectedMes] = useState<string | null>(null);
// //   const [fechaRange, setFechaRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
// //   const [dataSource, setDataSource] = useState<DataType[]>([]);
// //   const [loading, setLoading] = useState(false);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [pageSize, setPageSize] = useState(10);

// //   const [filtros] = useState<DataSelect[]>([
// //     { label: "Rango Fechas", value: "1" },
// //     { label: "Cortes", value: "2" },
// //   ]);

// //   const [cortes] = useState<DataSelect[]>([
// //     { label: "Del 1 al 15", value: "1" },
// //     { label: "Del 16 a Fin mes", value: "2" },
// //   ]);

// //   const [meses] = useState<DataSelect[]>([
// //     { label: "Enero", value: "1" },
// //     { label: "Febrero", value: "2" },
// //     { label: "Marzo", value: "3" },
// //     { label: "Abril", value: "4" },
// //     { label: "Mayo", value: "5" },
// //     { label: "Junio", value: "6" },
// //     { label: "Julio", value: "7" },
// //     { label: "Agosto", value: "8" },
// //     { label: "Septiembre", value: "9" },
// //     { label: "Octubre", value: "10" },
// //     { label: "Noviembre", value: "11" },
// //     { label: "Diciembre", value: "12" },
// //   ]);

// //   useEffect(() => {
// //     fetchConductores();
// //     fetchPlacas();
// //   }, []);

// //   const fetchConductores = async () => {
// //     try {
// //       const { data: { data } } = await getConductores();
// //       setConductores(
// //         data.map((p: any) => ({
// //           label: p.nombre_completo.toUpperCase(),
// //           value: p.id,
// //         }))
// //       );
// //     } catch (error) {
// //       console.error("Error al obtener conductores:", error);
// //     }
// //   };

// //   const fetchPlacas = async () => {
// //     try {
// //       const { data: { data } } = await getPlacas();
// //       setPlacas(
// //         data.map((p: any) => ({
// //           label: p.placa.toUpperCase(),
// //           value: p.placa,
// //         }))
// //       );
// //     } catch (error) {
// //       console.error("Error al obtener placas:", error);
// //     }
// //   };

// //   const handleConsultar = async () => {
// //     if (selectedFiltro === "1" && !fechaRange) {
// //       console.error("Debe seleccionar un rango de fechas");
// //       return;
// //     }

// //     if (selectedFiltro === "2" && (!selectedCorte || !selectedMes)) {
// //       console.error("Debe seleccionar mes y corte");
// //       return;
// //     }

// //     setLoading(true);
// //     try {
// //       const dataPost = {
// //         tipoFiltro: selectedFiltro,
// //         fechaInicio: selectedFiltro === "1" && fechaRange ? fechaRange[0].format("YYYY-MM-DD") : null,
// //         fechaFin: selectedFiltro === "1" && fechaRange ? fechaRange[1].format("YYYY-MM-DD") : null,
// //         mes: selectedFiltro === "2" ? selectedMes : null,
// //         corte: selectedFiltro === "2" ? selectedCorte : null,
// //         placas: selectedPlacas.length > 0 ? selectedPlacas : null,
// //         conductores: selectedConductores.length > 0 ? selectedConductores : null,
// //       };

// //       console.log("Datos enviados:", dataPost);

// //       const { data: { data } } = await getControlGasolina(dataPost);

// //       const mapped = data.map((item: any, idx: number) => ({
// //         key: idx,
// //         placa: item.proyecto || "-",
// //         conductor: item.cliente || "-",
// //         monto: item.cantidad || 0,
// //         volumen: item.volumen || 0,
// //         km: item.km || 0,
// //         fecha: item.fecha || "-",
// //         combustible: item.combustible || "-",
// //         comprobante: item.comprobante || "-"
// //       }));

// //       setDataSource(mapped);
// //     } catch (error) {
// //       console.error("Error en la consulta:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const columns = [
// //     {
// //       title: "Placa",
// //       dataIndex: "placa",
// //       key: "placa",
// //       align: "center",
// //     },
// //     {
// //       title: "Conductor",
// //       dataIndex: "conductor",
// //       key: "conductor",
// //       align: "center",
// //     },
// //     {
// //       title: "Monto ($)",
// //       dataIndex: "monto",
// //       key: "monto",
// //       align: "center",
// //       render: (monto: number) => `$${monto.toLocaleString()}`,
// //     },
// //     {
// //       title: "Volumen (L)",
// //       dataIndex: "volumen",
// //       key: "volumen",
// //       align: "center",
// //       render: (volumen: number) => `${volumen}L`,
// //     },
// //     {
// //       title: "Kilometraje",
// //       dataIndex: "km",
// //       key: "km",
// //       align: "center",
// //       render: (km: number) => `${km} km`,
// //     },
// //     {
// //       title: "Fecha",
// //       dataIndex: "fecha",
// //       key: "fecha",
// //       align: "center",
// //     },
// //     {
// //       title: "Combustible",
// //       dataIndex: "combustible",
// //       key: "combustible",
// //       align: "center",
// //     },
// //     {
// //       title: "Comprobante",
// //       dataIndex: "comprobante",
// //       key: "comprobante",
// //       align: "center",
// //     }
// //   ];

// //   const isConsultarDisabled =
// //     (selectedFiltro === "1" && !fechaRange) ||
// //     (selectedFiltro === "2" && (!selectedCorte || !selectedMes)) ||
// //     !selectedFiltro;

// //   const totalGeneral = dataSource.reduce((acc, item) => acc + item.monto, 0);
// //   const totalVolumen = dataSource.reduce((acc, item) => acc + (parseFloat(item.volumen.toString()) || 0), 0);
// //   const totalRegistros = dataSource.length;

// //   return (
// //     <StyledCard title="Informes de control de gasolina">
// //       <Row gutter={16} align="bottom" style={{ marginBottom: 16 }}>
// //         {/* Tipo de filtro */}
// //         <Col xs={24} md={4}>
// //           <Select
// //             placeholder="Tipo de filtro"
// //             options={filtros}
// //             value={selectedFiltro}
// //             onChange={(value) => {
// //               setSelectedFiltro(value);
// //               setFechaRange(null);
// //               setSelectedCorte(null);
// //               setSelectedMes(null);
// //             }}
// //             style={{ width: "100%" }}
// //             allowClear
// //           />
// //         </Col>

// //         {/* Corte y mes */}
// //         {selectedFiltro === "2" && (
// //           <>
// //             <Col xs={12} md={3}>
// //               <Select
// //                 placeholder="Mes"
// //                 options={meses}
// //                 value={selectedMes}
// //                 onChange={(value) => setSelectedMes(value)}
// //                 style={{ width: "100%" }}
// //                 allowClear
// //               />
// //             </Col>

// //             <Col xs={12} md={3}>
// //               <Select
// //                 placeholder="Corte"
// //                 options={cortes}
// //                 value={selectedCorte}
// //                 onChange={(value) => setSelectedCorte(value)}
// //                 style={{ width: "100%" }}
// //                 allowClear
// //               />
// //             </Col>
// //           </>
// //         )}

// //         {/* Rango de fechas */}
// //         {selectedFiltro === "1" && (
// //           <Col xs={24} md={6}>
// //             <RangePicker
// //               style={{ width: "100%" }}
// //               format="DD/MM/YYYY"
// //               placeholder={["Fecha inicio", "Fecha fin"]}
// //               value={fechaRange}
// //               onChange={(dates) => setFechaRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
// //               disabledDate={(current) => current && current > dayjs().endOf("day")}
// //             />
// //           </Col>
// //         )}

// //         {/* Placas */}
// //         <Col xs={24} md={4}>
// //           <Select
// //             mode="multiple"
// //             placeholder="Placas"
// //             options={placas}
// //             value={selectedPlacas}
// //             onChange={(values) => setSelectedPlacas(values)}
// //             style={{ width: "100%" }}
// //             allowClear
// //             showSearch
// //             optionFilterProp="label"
// //             maxTagCount="responsive"
// //           />
// //         </Col>

// //         {/* Conductores */}
// //         <Col xs={24} md={4}>
// //           <Select
// //             mode="multiple"
// //             placeholder="Conductores"
// //             options={conductores}
// //             value={selectedConductores}
// //             onChange={(values) => setSelectedConductores(values)}
// //             style={{ width: "100%" }}
// //             allowClear
// //             showSearch
// //             optionFilterProp="label"
// //             maxTagCount="responsive"
// //           />
// //         </Col>

// //         {/* Botón Consultar */}
// //         <Col xs={24} md={3} style={{ textAlign: "right" }}>
// //           <Button
// //             type="primary"
// //             onClick={handleConsultar}
// //             disabled={isConsultarDisabled}
// //             loading={loading}
// //             size="large"
// //             style={{ width: "100%" }}
// //           >
// //             Consultar
// //           </Button>
// //         </Col>
// //       </Row>

// //       <Row gutter={16} align="middle">
// //         <Col xs={24} md={18}>
// //           <Table
// //             columns={columns}
// //             dataSource={dataSource}
// //             loading={loading}
// //             rowKey="key"
// //             pagination={{
// //               current: currentPage,
// //               pageSize: pageSize,
// //               total: dataSource.length,
// //               showSizeChanger: true,
// //               pageSizeOptions: ["10", "20", "50", "100"],
// //               showTotal: (total, range) =>
// //                 `${range[0]}-${range[1]} de ${total} registros`,
// //               onChange: (page, size) => {
// //                 setCurrentPage(page);
// //                 setPageSize(size || 10);
// //               },
// //             }}
// //             scroll={{ x: 1000 }}
// //           />
// //         </Col>

// //         {/* Indicadores estilo recibo */}
// //         <Col xs={24} md={6}>
// //           <Card 
// //             title={
// //               <div style={{ textAlign: "center", fontSize: "1.2rem", fontWeight: "bold" }}>
// //                 RESUMEN TOTAL
// //               </div>
// //             }
// //             style={{
// //               background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
// //               border: "none",
// //               borderRadius: "15px",
// //               boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
// //               color: "white"
// //             }}
// //             bodyStyle={{ padding: "20px" }}
// //           >
// //             {/* Total Monto */}
// //             <div style={{ 
// //               marginBottom: "25px",
// //               padding: "15px",
// //               background: "rgba(255,255,255,0.1)",
// //               borderRadius: "10px",
// //               border: "1px solid rgba(255,255,255,0.2)"
// //             }}>
// //               <div style={{ 
// //                 fontSize: "0.9rem", 
// //                 opacity: 0.9,
// //                 marginBottom: "5px"
// //               }}>
// //                 TOTAL MONTO
// //               </div>
// //               <div style={{ 
// //                 fontSize: "2.2rem", 
// //                 fontWeight: "bold",
// //                 fontFamily: "'Courier New', monospace",
// //                 textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
// //               }}>
// //                 ${totalGeneral.toLocaleString()}
// //               </div>
// //             </div>

// //             {/* Total Volumen */}
// //             <div style={{ 
// //               marginBottom: "25px",
// //               padding: "15px",
// //               background: "rgba(255,255,255,0.1)",
// //               borderRadius: "10px",
// //               border: "1px solid rgba(255,255,255,0.2)"
// //             }}>
// //               <div style={{ 
// //                 fontSize: "0.9rem", 
// //                 opacity: 0.9,
// //                 marginBottom: "5px"
// //               }}>
// //                 TOTAL VOLUMEN
// //               </div>
// //               <div style={{ 
// //                 fontSize: "2rem", 
// //                 fontWeight: "bold",
// //                 fontFamily: "'Courier New', monospace",
// //                 textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
// //               }}>
// //                 {totalVolumen.toLocaleString()} L
// //               </div>
// //             </div>

// //             {/* Total Registros */}
// //             <div style={{ 
// //               padding: "15px",
// //               background: "rgba(255,255,255,0.1)",
// //               borderRadius: "10px",
// //               border: "1px solid rgba(255,255,255,0.2)"
// //             }}>
// //               <div style={{ 
// //                 fontSize: "0.9rem", 
// //                 opacity: 0.9,
// //                 marginBottom: "5px"
// //               }}>
// //                 TOTAL REGISTROS
// //               </div>
// //               <div style={{ 
// //                 fontSize: "1.8rem", 
// //                 fontWeight: "bold",
// //                 fontFamily: "'Courier New', monospace",
// //                 textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
// //               }}>
// //                 {totalRegistros}
// //               </div>
// //             </div>

// //             {/* Línea divisoria decorativa */}
// //             <div style={{
// //               height: "2px",
// //               background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
// //               margin: "20px 0"
// //             }}></div>

// //             {/* Información adicional */}
// //             <div style={{ 
// //               fontSize: "0.8rem", 
// //               opacity: 0.8,
// //               textAlign: "center",
// //               marginTop: "15px"
// //             }}>
// //               <div>Consulta generada:</div>
// //               <div style={{ fontWeight: "bold" }}>
// //                 {dayjs().format('DD/MM/YYYY HH:mm')}
// //               </div>
// //             </div>
// //           </Card>
// //         </Col>
// //       </Row>
// //     </StyledCard>
// //   );
// // };
// import { useEffect, useState } from "react";
// import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
// import { Button, Col, DatePicker, Select, Table, Row, Space, Card } from "antd";
// import dayjs from "dayjs";
// import { 
//   getConductores,
//   getPlacas,
//   getControlGasolina 
// } from "@/services/contabilidad/controlGasolinaAPI";

// const { RangePicker } = DatePicker;

// interface DataType {
//   key: number;
//   placa: string;
//   conductor: string;
//   km_inicial: number;
//   km_final: number;
//   km_recorridos: number;
//   volumen_litros: number;
//   volumen_galones: number;
//   km_por_galon: number;
//   total_dinero: number;
//   cantidad_registros: number;
//   fecha_inicio: string;
//   fecha_fin: string;
// }

// interface DataSelect {
//   label: string;
//   value: number | string;
// }

// export const ListControlGasolina = () => {
//   const [conductores, setConductores] = useState<DataSelect[]>([]);
//   const [placas, setPlacas] = useState<DataSelect[]>([]);
//   const [selectedPlacas, setSelectedPlacas] = useState<(number | string)[]>([]);
//   const [selectedConductores, setSelectedConductores] = useState<(number | string)[]>([]);
//   const [selectedFiltro, setSelectedFiltro] = useState<string | null>(null);
//   const [selectedCorte, setSelectedCorte] = useState<string | null>(null);
//   const [selectedMes, setSelectedMes] = useState<string | null>(null);
//   const [fechaRange, setFechaRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
//   const [dataSource, setDataSource] = useState<DataType[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);

//   const [filtros] = useState<DataSelect[]>([
//     { label: "Rango Fechas", value: "1" },
//     { label: "Cortes", value: "2" },
//   ]);

//   const [cortes] = useState<DataSelect[]>([
//     { label: "Del 1 al 15", value: "1" },
//     { label: "Del 16 a Fin mes", value: "2" },
//   ]);

//   const [meses] = useState<DataSelect[]>([
//     { label: "Enero", value: "1" },
//     { label: "Febrero", value: "2" },
//     { label: "Marzo", value: "3" },
//     { label: "Abril", value: "4" },
//     { label: "Mayo", value: "5" },
//     { label: "Junio", value: "6" },
//     { label: "Julio", value: "7" },
//     { label: "Agosto", value: "8" },
//     { label: "Septiembre", value: "9" },
//     { label: "Octubre", value: "10" },
//     { label: "Noviembre", value: "11" },
//     { label: "Diciembre", value: "12" },
//   ]);

//   useEffect(() => {
//     fetchConductores();
//     fetchPlacas();
//   }, []);

//   const fetchConductores = async () => {
//     try {
//       const { data: { data } } = await getConductores();
//       setConductores(
//         data.map((p: any) => ({
//           label: p.nombre_completo.toUpperCase(),
//           value: p.id,
//         }))
//       );
//     } catch (error) {
//       console.error("Error al obtener conductores:", error);
//     }
//   };

//   const fetchPlacas = async () => {
//     try {
//       const { data: { data } } = await getPlacas();
//       setPlacas(
//         data.map((p: any) => ({
//           label: p.placa.toUpperCase(),
//           value: p.placa,
//         }))
//       );
//     } catch (error) {
//       console.error("Error al obtener placas:", error);
//     }
//   };

//   // Función para procesar los datos y calcular métricas por placa
//   const procesarDatosPorPlaca = (data: any[]) => {
//     // Agrupar datos por placa
//     const datosAgrupados: { [key: string]: any[] } = {};
    
//     data.forEach((item: any) => {
//       const placa = item.proyecto || "-";
//       if (!datosAgrupados[placa]) {
//         datosAgrupados[placa] = [];
//       }
//       datosAgrupados[placa].push(item);
//     });

//     // Calcular métricas para cada placa
//     const resultados: DataType[] = [];
    
//     Object.keys(datosAgrupados).forEach((placa, index) => {
//       const registros = datosAgrupados[placa];
      
//       if (registros.length < 2) {
//         // Si hay menos de 2 registros, no se puede calcular el kilometraje
//         return;
//       }

//       // Ordenar registros por fecha
//       const registrosOrdenados = registros.sort((a, b) => 
//         new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
//       );

//       // Tomar el primer y último registro
//       const primerRegistro = registrosOrdenados[0];
//       const ultimoRegistro = registrosOrdenados[registrosOrdenados.length - 1];

//       // Calcular kilómetros recorridos
//       const kmInicial = parseFloat(primerRegistro.km) || 0;
//       const kmFinal = parseFloat(ultimoRegistro.km) || 0;
//       const kmRecorridos = kmFinal - kmInicial;

//       // Sumar volumen total (convertir a galones)
//       const volumenTotalLitros = registros.reduce((sum, item) => sum + (parseFloat(item.volumen) || 0), 0);
//       const volumenTotalGalones = volumenTotalLitros / 3.78541; // Convertir litros a galones

//       // Calcular km/gal
//       const kmPorGalon = volumenTotalGalones > 0 ? kmRecorridos / volumenTotalGalones : 0;

//       // Sumar total dinero
//       const totalDinero = registros.reduce((sum, item) => sum + (parseFloat(item.cantidad) || 0), 0);

//       resultados.push({
//         key: index,
//         placa: placa,
//         conductor: primerRegistro.cliente || "-",
//         km_inicial: kmInicial,
//         km_final: kmFinal,
//         km_recorridos: kmRecorridos,
//         volumen_litros: volumenTotalLitros,
//         volumen_galones: parseFloat(volumenTotalGalones.toFixed(2)),
//         km_por_galon: parseFloat(kmPorGalon.toFixed(2)),
//         total_dinero: totalDinero,
//         cantidad_registros: registros.length,
//         fecha_inicio: primerRegistro.fecha || "-",
//         fecha_fin: ultimoRegistro.fecha || "-"
//       });
//     });

//     return resultados;
//   };

//   const handleConsultar = async () => {
//     if (selectedFiltro === "1" && !fechaRange) {
//       console.error("Debe seleccionar un rango de fechas");
//       return;
//     }

//     if (selectedFiltro === "2" && (!selectedCorte || !selectedMes)) {
//       console.error("Debe seleccionar mes y corte");
//       return;
//     }

//     setLoading(true);
//     try {
//       const dataPost = {
//         tipoFiltro: selectedFiltro,
//         fechaInicio: selectedFiltro === "1" && fechaRange ? fechaRange[0].format("YYYY-MM-DD") : null,
//         fechaFin: selectedFiltro === "1" && fechaRange ? fechaRange[1].format("YYYY-MM-DD") : null,
//         mes: selectedFiltro === "2" ? selectedMes : null,
//         corte: selectedFiltro === "2" ? selectedCorte : null,
//         placas: selectedPlacas.length > 0 ? selectedPlacas : null,
//         conductores: selectedConductores.length > 0 ? selectedConductores : null,
//       };

//       console.log("Datos enviados:", dataPost);

//       const { data: { data } } = await getControlGasolina(dataPost);

//       // Procesar datos para calcular métricas por placa
//       const datosProcesados = procesarDatosPorPlaca(data);
//       setDataSource(datosProcesados);
//     } catch (error) {
//       console.error("Error en la consulta:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const columns = [
//     {
//       title: "Placa",
//       dataIndex: "placa",
//       key: "placa",
//       align: "center",
//       fixed: 'left' as const,
//     },
//     {
//       title: "Conductor",
//       dataIndex: "conductor",
//       key: "conductor",
//       align: "center",
//     },
//     {
//       title: "KM Inicial",
//       dataIndex: "km_inicial",
//       key: "km_inicial",
//       align: "center",
//       render: (km: number) => km.toLocaleString(),
//     },
//     {
//       title: "KM Final",
//       dataIndex: "km_final",
//       key: "km_final",
//       align: "center",
//       render: (km: number) => km.toLocaleString(),
//     },
//     {
//       title: "KM Recorridos",
//       dataIndex: "km_recorridos",
//       key: "km_recorridos",
//       align: "center",
//       render: (km: number) => km.toLocaleString(),
//     },
//     {
//       title: "Volumen (L)",
//       dataIndex: "volumen_litros",
//       key: "volumen_litros",
//       align: "center",
//       render: (volumen: number) => `${volumen.toFixed(2)}L`,
//     },
//     {
//       title: "Volumen (Gal)",
//       dataIndex: "volumen_galones",
//       key: "volumen_galones",
//       align: "center",
//       render: (volumen: number) => `${volumen.toFixed(2)} gal`,
//     },
//     {
//       title: "Rendimiento",
//       dataIndex: "km_por_galon",
//       key: "km_por_galon",
//       align: "center",
//       render: (rendimiento: number) => (
//         <span style={{ 
//           fontWeight: 'bold', 
//           color: rendimiento > 0 ? '#52c41a' : '#ff4d4f' 
//         }}>
//           {rendimiento.toFixed(2)} km/gal
//         </span>
//       ),
//     },
//     {
//       title: "Total ($)",
//       dataIndex: "total_dinero",
//       key: "total_dinero",
//       align: "center",
//       render: (monto: number) => `$${monto.toLocaleString()}`,
//     },
//     {
//       title: "Registros",
//       dataIndex: "cantidad_registros",
//       key: "cantidad_registros",
//       align: "center",
//     },
//     {
//       title: "Fecha Inicio",
//       dataIndex: "fecha_inicio",
//       key: "fecha_inicio",
//       align: "center",
//     },
//     {
//       title: "Fecha Fin",
//       dataIndex: "fecha_fin",
//       key: "fecha_fin",
//       align: "center",
//     }
//   ];

//   const isConsultarDisabled =
//     (selectedFiltro === "1" && !fechaRange) ||
//     (selectedFiltro === "2" && (!selectedCorte || !selectedMes)) ||
//     !selectedFiltro;

//   // Calcular totales
//   const totalGeneral = dataSource.reduce((acc, item) => acc + item.total_dinero, 0);
//   const totalVolumenLitros = dataSource.reduce((acc, item) => acc + item.volumen_litros, 0);
//   const totalVolumenGalones = dataSource.reduce((acc, item) => acc + item.volumen_galones, 0);
//   const totalKmRecorridos = dataSource.reduce((acc, item) => acc + item.km_recorridos, 0);
//   const promedioRendimiento = totalVolumenGalones > 0 ? totalKmRecorridos / totalVolumenGalones : 0;
//   const totalRegistros = dataSource.reduce((acc, item) => acc + item.cantidad_registros, 0);

//   return (
//     <StyledCard title="Informes de control de gasolina - Rendimiento por Placa">
//       <Row gutter={16} align="bottom" style={{ marginBottom: 16 }}>
//         {/* Tipo de filtro */}
//         <Col xs={24} md={4}>
//           <Select
//             placeholder="Tipo de filtro"
//             options={filtros}
//             value={selectedFiltro}
//             onChange={(value) => {
//               setSelectedFiltro(value);
//               setFechaRange(null);
//               setSelectedCorte(null);
//               setSelectedMes(null);
//             }}
//             style={{ width: "100%" }}
//             allowClear
//           />
//         </Col>

//         {/* Corte y mes */}
//         {selectedFiltro === "2" && (
//           <>
//             <Col xs={12} md={3}>
//               <Select
//                 placeholder="Mes"
//                 options={meses}
//                 value={selectedMes}
//                 onChange={(value) => setSelectedMes(value)}
//                 style={{ width: "100%" }}
//                 allowClear
//               />
//             </Col>

//             <Col xs={12} md={3}>
//               <Select
//                 placeholder="Corte"
//                 options={cortes}
//                 value={selectedCorte}
//                 onChange={(value) => setSelectedCorte(value)}
//                 style={{ width: "100%" }}
//                 allowClear
//               />
//             </Col>
//           </>
//         )}

//         {/* Rango de fechas */}
//         {selectedFiltro === "1" && (
//           <Col xs={24} md={6}>
//             <RangePicker
//               style={{ width: "100%" }}
//               format="DD/MM/YYYY"
//               placeholder={["Fecha inicio", "Fecha fin"]}
//               value={fechaRange}
//               onChange={(dates) => setFechaRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
//               disabledDate={(current) => current && current > dayjs().endOf("day")}
//             />
//           </Col>
//         )}

//         {/* Placas */}
//         <Col xs={24} md={4}>
//           <Select
//             mode="multiple"
//             placeholder="Placas"
//             options={placas}
//             value={selectedPlacas}
//             onChange={(values) => setSelectedPlacas(values)}
//             style={{ width: "100%" }}
//             allowClear
//             showSearch
//             optionFilterProp="label"
//             maxTagCount="responsive"
//           />
//         </Col>

//         {/* Conductores */}
//         <Col xs={24} md={4}>
//           <Select
//             mode="multiple"
//             placeholder="Conductores"
//             options={conductores}
//             value={selectedConductores}
//             onChange={(values) => setSelectedConductores(values)}
//             style={{ width: "100%" }}
//             allowClear
//             showSearch
//             optionFilterProp="label"
//             maxTagCount="responsive"
//           />
//         </Col>

//         {/* Botón Consultar */}
//         <Col xs={24} md={3} style={{ textAlign: "right" }}>
//           <Button
//             type="primary"
//             onClick={handleConsultar}
//             disabled={isConsultarDisabled}
//             loading={loading}
//             size="large"
//             style={{ width: "100%" }}
//           >
//             Consultar
//           </Button>
//         </Col>
//       </Row>

//       <Row gutter={16} align="middle">
//         <Col xs={24} md={18}>
//           <Table
//             columns={columns}
//             dataSource={dataSource}
//             loading={loading}
//             rowKey="key"
//             pagination={{
//               current: currentPage,
//               pageSize: pageSize,
//               total: dataSource.length,
//               showSizeChanger: true,
//               pageSizeOptions: ["10", "20", "50", "100"],
//               showTotal: (total, range) =>
//                 `${range[0]}-${range[1]} de ${total} placas`,
//               onChange: (page, size) => {
//                 setCurrentPage(page);
//                 setPageSize(size || 10);
//               },
//             }}
//             scroll={{ x: 1500 }}
//           />
//         </Col>

//         {/* Indicadores estilo recibo actualizados */}
//         <Col xs={24} md={6}>
//           <Card 
//             title={
//               <div style={{ textAlign: "center", fontSize: "1.2rem", fontWeight: "bold" }}>
//                 RESUMEN RENDIMIENTO
//               </div>
//             }
//             style={{
//               background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//               border: "none",
//               borderRadius: "15px",
//               boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
//               color: "white"
//             }}
//             bodyStyle={{ padding: "20px" }}
//           >
//             {/* Total Monto */}
//             <div style={{ 
//               marginBottom: "20px",
//               padding: "15px",
//               background: "rgba(255,255,255,0.1)",
//               borderRadius: "10px",
//               border: "1px solid rgba(255,255,255,0.2)"
//             }}>
//               <div style={{ fontSize: "0.9rem", opacity: 0.9, marginBottom: "5px" }}>
//                 TOTAL MONTO
//               </div>
//               <div style={{ 
//                 fontSize: "1.8rem", 
//                 fontWeight: "bold",
//                 fontFamily: "'Courier New', monospace",
//                 textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
//               }}>
//                 ${totalGeneral.toLocaleString()}
//               </div>
//             </div>

//             {/* Total KM Recorridos */}
//             <div style={{ 
//               marginBottom: "20px",
//               padding: "15px",
//               background: "rgba(255,255,255,0.1)",
//               borderRadius: "10px",
//               border: "1px solid rgba(255,255,255,0.2)"
//             }}>
//               <div style={{ fontSize: "0.9rem", opacity: 0.9, marginBottom: "5px" }}>
//                 KM RECORRIDOS
//               </div>
//               <div style={{ 
//                 fontSize: "1.6rem", 
//                 fontWeight: "bold",
//                 fontFamily: "'Courier New', monospace",
//                 textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
//               }}>
//                 {totalKmRecorridos.toLocaleString()} km
//               </div>
//             </div>

//             {/* Rendimiento Promedio */}
//             <div style={{ 
//               marginBottom: "20px",
//               padding: "15px",
//               background: "rgba(255,255,255,0.1)",
//               borderRadius: "10px",
//               border: "1px solid rgba(255,255,255,0.2)"
//             }}>
//               <div style={{ fontSize: "0.9rem", opacity: 0.9, marginBottom: "5px" }}>
//                 RENDIMIENTO PROMEDIO
//               </div>
//               <div style={{ 
//                 fontSize: "1.6rem", 
//                 fontWeight: "bold",
//                 fontFamily: "'Courier New', monospace",
//                 textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
//                 color: promedioRendimiento > 0 ? '#a7f3a7' : '#ffa7a7'
//               }}>
//                 {promedioRendimiento.toFixed(2)} km/gal
//               </div>
//             </div>

//             {/* Total Volumen */}
//             <div style={{ 
//               marginBottom: "20px",
//               padding: "15px",
//               background: "rgba(255,255,255,0.1)",
//               borderRadius: "10px",
//               border: "1px solid rgba(255,255,255,0.2)"
//             }}>
//               <div style={{ fontSize: "0.9rem", opacity: 0.9, marginBottom: "5px" }}>
//                 COMBUSTIBLE USADO
//               </div>
//               <div style={{ 
//                 fontSize: "1.4rem", 
//                 fontWeight: "bold",
//                 fontFamily: "'Courier New', monospace",
//                 textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
//               }}>
//                 {totalVolumenGalones.toFixed(2)} gal
//               </div>
//               <div style={{ fontSize: "0.8rem", opacity: 0.8, marginTop: "5px" }}>
//                 ({totalVolumenLitros.toFixed(2)} L)
//               </div>
//             </div>

//             {/* Totales */}
//             <div style={{ 
//               padding: "15px",
//               background: "rgba(255,255,255,0.1)",
//               borderRadius: "10px",
//               border: "1px solid rgba(255,255,255,0.2)"
//             }}>
//               <div style={{ fontSize: "0.9rem", opacity: 0.9, marginBottom: "5px" }}>
//                 ESTADÍSTICAS
//               </div>
//               <div style={{ fontSize: "0.8rem", opacity: 0.9 }}>
//                 <div>Placas: {dataSource.length}</div>
//                 <div>Registros: {totalRegistros}</div>
//               </div>
//             </div>

//             {/* Información adicional */}
//             <div style={{ 
//               fontSize: "0.7rem", 
//               opacity: 0.8,
//               textAlign: "center",
//               marginTop: "15px"
//             }}>
//               <div>Consulta generada:</div>
//               <div style={{ fontWeight: "bold" }}>
//                 {dayjs().format('DD/MM/YYYY HH:mm')}
//               </div>
//             </div>
//           </Card>
//         </Col>
//       </Row>
//     </StyledCard>
//   );
// };

import { useEffect, useState } from "react";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Button, Col, DatePicker, Select, Table, Row, Space, Card } from "antd";
import dayjs from "dayjs";
import { 
  getConductores,
  getPlacas,
  getControlGasolina 
} from "@/services/contabilidad/controlGasolinaAPI";

const { RangePicker } = DatePicker;

interface DataType {
  key: number;
  placa: string;
  conductor: string;
  km_inicial: number;
  km_final: number;
  km_recorridos: number;
  volumen_litros: number;
  volumen_galones: number;
  km_por_galon: number;
  total_dinero: number;
  cantidad_registros: number;
  fecha_inicio: string;
  fecha_fin: string;
}

interface DataSelect {
  label: string;
  value: number | string;
}

export const ListControlGasolina = () => {
  const [conductores, setConductores] = useState<DataSelect[]>([]);
  const [placas, setPlacas] = useState<DataSelect[]>([]);
  const [selectedPlacas, setSelectedPlacas] = useState<(number | string)[]>([]);
  const [selectedConductores, setSelectedConductores] = useState<(number | string)[]>([]);
  const [selectedFiltro, setSelectedFiltro] = useState<string | null>(null);
  const [selectedCorte, setSelectedCorte] = useState<string | null>(null);
  const [selectedMes, setSelectedMes] = useState<string | null>(null);
  const [fechaRange, setFechaRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [filtros] = useState<DataSelect[]>([
    { label: "Rango Fechas", value: "1" },
    { label: "Cortes", value: "2" },
  ]);

  const [cortes] = useState<DataSelect[]>([
    { label: "Del 1 al 15", value: "1" },
    { label: "Del 16 a Fin mes", value: "2" },
  ]);

  const [meses] = useState<DataSelect[]>([
    { label: "Enero", value: "1" },
    { label: "Febrero", value: "2" },
    { label: "Marzo", value: "3" },
    { label: "Abril", value: "4" },
    { label: "Mayo", value: "5" },
    { label: "Junio", value: "6" },
    { label: "Julio", value: "7" },
    { label: "Agosto", value: "8" },
    { label: "Septiembre", value: "9" },
    { label: "Octubre", value: "10" },
    { label: "Noviembre", value: "11" },
    { label: "Diciembre", value: "12" },
  ]);

  useEffect(() => {
    fetchConductores();
    fetchPlacas();
  }, []);

  const fetchConductores = async () => {
    try {
      const { data: { data } } = await getConductores();
      setConductores(
        data.map((p: any) => ({
          label: p.nombre_completo.toUpperCase(),
          value: p.id,
        }))
      );
    } catch (error) {
      console.error("Error al obtener conductores:", error);
    }
  };

  const fetchPlacas = async () => {
    try {
      const { data: { data } } = await getPlacas();
      setPlacas(
        data.map((p: any) => ({
          label: p.placa.toUpperCase(),
          value: p.placa,
        }))
      );
    } catch (error) {
      console.error("Error al obtener placas:", error);
    }
  };

  const handleConsultar = async () => {
    if (selectedFiltro === "1" && !fechaRange) {
      console.error("Debe seleccionar un rango de fechas");
      return;
    }

    if (selectedFiltro === "2" && (!selectedCorte || !selectedMes)) {
      console.error("Debe seleccionar mes y corte");
      return;
    }

    setLoading(true);
    try {
      const dataPost = {
        tipoFiltro: selectedFiltro,
        fechaInicio: selectedFiltro === "1" && fechaRange ? fechaRange[0].format("YYYY-MM-DD") : null,
        fechaFin: selectedFiltro === "1" && fechaRange ? fechaRange[1].format("YYYY-MM-DD") : null,
        mes: selectedFiltro === "2" ? selectedMes : null,
        corte: selectedFiltro === "2" ? selectedCorte : null,
        placas: selectedPlacas.length > 0 ? selectedPlacas : null,
        conductores: selectedConductores.length > 0 ? selectedConductores : null,
      };

      console.log("Datos enviados:", dataPost);

      const { data: { data } } = await getControlGasolina(dataPost);

      // Mapear directamente los datos del backend
      const mapped = data.map((item: any, idx: number) => ({
        key: idx,
        placa: item.placa || "-",
        conductor: item.conductor || "-",
        km_inicial: item.km_inicial || 0,
        km_final: item.km_final || 0,
        km_recorridos: item.km_recorridos || 0,
        volumen_litros: item.volumen_litros || 0,
        volumen_galones: item.volumen_galones || 0,
        km_por_galon: item.km_por_galon || 0,
        total_dinero: item.total_dinero || 0,
        cantidad_registros: item.cantidad_registros || 0,
        fecha_inicio: item.fecha_inicio || "-",
        fecha_fin: item.fecha_fin || "-"
      }));

      setDataSource(mapped);
    } catch (error) {
      console.error("Error en la consulta:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Placa",
      dataIndex: "placa",
      key: "placa",
      align: "center",
      fixed: 'left' as const,
    },
    {
      title: "Conductor",
      dataIndex: "conductor",
      key: "conductor",
      align: "center",
    },
    {
      title: "KM Inicial",
      dataIndex: "km_inicial",
      key: "km_inicial",
      align: "center",
      render: (km: number) => km.toLocaleString(),
    },
    {
      title: "KM Final",
      dataIndex: "km_final",
      key: "km_final",
      align: "center",
      render: (km: number) => km.toLocaleString(),
    },
    {
      title: "KM Recorridos",
      dataIndex: "km_recorridos",
      key: "km_recorridos",
      align: "center",
      render: (km: number) => km.toLocaleString(),
    },
    {
      title: "Volumen (L)",
      dataIndex: "volumen_litros",
      key: "volumen_litros",
      align: "center",
      render: (volumen: number) => `${volumen.toFixed(2)}L`,
    },
    {
      title: "Volumen (Gal)",
      dataIndex: "volumen_galones",
      key: "volumen_galones",
      align: "center",
      render: (volumen: number) => `${volumen.toFixed(2)} gal`,
    },
    {
      title: "Rendimiento",
      dataIndex: "km_por_galon",
      key: "km_por_galon",
      align: "center",
      render: (rendimiento: number) => (
        <span style={{ 
          fontWeight: 'bold', 
          color: rendimiento > 0 ? '#52c41a' : '#ff4d4f' 
        }}>
          {rendimiento.toFixed(2)} km/gal
        </span>
      ),
    },
    {
      title: "Total ($)",
      dataIndex: "total_dinero",
      key: "total_dinero",
      align: "center",
      render: (monto: number) => `$${monto.toLocaleString()}`,
    },
    {
      title: "Registros",
      dataIndex: "cantidad_registros",
      key: "cantidad_registros",
      align: "center",
    },
    {
      title: "Fecha Inicio",
      dataIndex: "fecha_inicio",
      key: "fecha_inicio",
      align: "center",
      render: (fecha: string) => dayjs(fecha).format('DD/MM/YYYY'),
    },
    {
      title: "Fecha Fin",
      dataIndex: "fecha_fin",
      key: "fecha_fin",
      align: "center",
      render: (fecha: string) => dayjs(fecha).format('DD/MM/YYYY'),
    }
  ];

  const isConsultarDisabled =
    (selectedFiltro === "1" && !fechaRange) ||
    (selectedFiltro === "2" && (!selectedCorte || !selectedMes)) ||
    !selectedFiltro;

  // Calcular totales
  const totalGeneral = dataSource.reduce((acc, item) => acc + item.total_dinero, 0);
  const totalVolumenLitros = dataSource.reduce((acc, item) => acc + item.volumen_litros, 0);
  const totalVolumenGalones = dataSource.reduce((acc, item) => acc + item.volumen_galones, 0);
  const totalKmRecorridos = dataSource.reduce((acc, item) => acc + item.km_recorridos, 0);
  const promedioRendimiento = totalVolumenGalones > 0 ? totalKmRecorridos / totalVolumenGalones : 0;
  const totalRegistros = dataSource.reduce((acc, item) => acc + item.cantidad_registros, 0);

  return (
    <StyledCard title="Informes de control de gasolina - Rendimiento por Placa">
      <Row gutter={16} align="bottom" style={{ marginBottom: 16 }}>
        {/* Tipo de filtro */}
        <Col xs={24} md={4}>
          <Select
            placeholder="Tipo de filtro"
            options={filtros}
            value={selectedFiltro}
            onChange={(value) => {
              setSelectedFiltro(value);
              setFechaRange(null);
              setSelectedCorte(null);
              setSelectedMes(null);
            }}
            style={{ width: "100%" }}
            allowClear
          />
        </Col>

        {/* Corte y mes */}
        {selectedFiltro === "2" && (
          <>
            <Col xs={12} md={3}>
              <Select
                placeholder="Mes"
                options={meses}
                value={selectedMes}
                onChange={(value) => setSelectedMes(value)}
                style={{ width: "100%" }}
                allowClear
              />
            </Col>

            <Col xs={12} md={3}>
              <Select
                placeholder="Corte"
                options={cortes}
                value={selectedCorte}
                onChange={(value) => setSelectedCorte(value)}
                style={{ width: "100%" }}
                allowClear
              />
            </Col>
          </>
        )}

        {/* Rango de fechas */}
        {selectedFiltro === "1" && (
          <Col xs={24} md={6}>
            <RangePicker
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              placeholder={["Fecha inicio", "Fecha fin"]}
              value={fechaRange}
              onChange={(dates) => setFechaRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
              disabledDate={(current) => current && current > dayjs().endOf("day")}
            />
          </Col>
        )}

        {/* Placas */}
        <Col xs={24} md={4}>
          <Select
            mode="multiple"
            placeholder="Placas"
            options={placas}
            value={selectedPlacas}
            onChange={(values) => setSelectedPlacas(values)}
            style={{ width: "100%" }}
            allowClear
            showSearch
            optionFilterProp="label"
            maxTagCount="responsive"
          />
        </Col>

        {/* Conductores */}
        <Col xs={24} md={4}>
          <Select
            mode="multiple"
            placeholder="Conductores"
            options={conductores}
            value={selectedConductores}
            onChange={(values) => setSelectedConductores(values)}
            style={{ width: "100%" }}
            allowClear
            showSearch
            optionFilterProp="label"
            maxTagCount="responsive"
          />
        </Col>

        {/* Botón Consultar */}
        <Col xs={24} md={3} style={{ textAlign: "right" }}>
          <Button
            type="primary"
            onClick={handleConsultar}
            disabled={isConsultarDisabled}
            loading={loading}
            size="large"
            style={{ width: "100%" }}
          >
            Consultar
          </Button>
        </Col>
      </Row>

      <Row gutter={16} align="middle">
        <Col xs={24} md={18}>
          <Table
            columns={columns}
            dataSource={dataSource}
            loading={loading}
            rowKey="key"
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: dataSource.length,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", "100"],
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} de ${total} placas`,
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size || 10);
              },
            }}
            scroll={{ x: 1500 }}
          />
        </Col>

        {/* Indicadores estilo recibo actualizados */}
        <Col xs={24} md={6}>
          <Card 
            title={
              <div style={{ textAlign: "center", fontSize: "1.2rem", fontWeight: "bold" }}>
                RESUMEN RENDIMIENTO
              </div>
            }
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              borderRadius: "15px",
              boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
              color: "white"
            }}
            bodyStyle={{ padding: "20px" }}
          >
            {/* Total Monto */}
            <div style={{ 
              marginBottom: "20px",
              padding: "15px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.2)"
            }}>
              <div style={{ fontSize: "0.9rem", opacity: 0.9, marginBottom: "5px" }}>
                TOTAL MONTO
              </div>
              <div style={{ 
                fontSize: "1.8rem", 
                fontWeight: "bold",
                fontFamily: "'Courier New', monospace",
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
              }}>
                ${totalGeneral.toLocaleString()}
              </div>
            </div>

            {/* Total KM Recorridos */}
            <div style={{ 
              marginBottom: "20px",
              padding: "15px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.2)"
            }}>
              <div style={{ fontSize: "0.9rem", opacity: 0.9, marginBottom: "5px" }}>
                KM RECORRIDOS
              </div>
              <div style={{ 
                fontSize: "1.6rem", 
                fontWeight: "bold",
                fontFamily: "'Courier New', monospace",
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
              }}>
                {totalKmRecorridos.toLocaleString()} km
              </div>
            </div>

            {/* Rendimiento Promedio */}
            <div style={{ 
              marginBottom: "20px",
              padding: "15px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.2)"
            }}>
              <div style={{ fontSize: "0.9rem", opacity: 0.9, marginBottom: "5px" }}>
                RENDIMIENTO PROMEDIO
              </div>
              <div style={{ 
                fontSize: "1.6rem", 
                fontWeight: "bold",
                fontFamily: "'Courier New', monospace",
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                color: promedioRendimiento > 0 ? '#a7f3a7' : '#ffa7a7'
              }}>
                {promedioRendimiento.toFixed(2)} km/gal
              </div>
            </div>

            {/* Total Volumen */}
            <div style={{ 
              marginBottom: "20px",
              padding: "15px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.2)"
            }}>
              <div style={{ fontSize: "0.9rem", opacity: 0.9, marginBottom: "5px" }}>
                COMBUSTIBLE USADO
              </div>
              <div style={{ 
                fontSize: "1.4rem", 
                fontWeight: "bold",
                fontFamily: "'Courier New', monospace",
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
              }}>
                {totalVolumenGalones.toFixed(2)} gal
              </div>
              <div style={{ fontSize: "0.8rem", opacity: 0.8, marginTop: "5px" }}>
                ({totalVolumenLitros.toFixed(2)} L)
              </div>
            </div>

            {/* Totales */}
            <div style={{ 
              padding: "15px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.2)"
            }}>
              <div style={{ fontSize: "0.9rem", opacity: 0.9, marginBottom: "5px" }}>
                ESTADÍSTICAS
              </div>
              <div style={{ fontSize: "0.8rem", opacity: 0.9 }}>
                <div>Placas: {dataSource.length}</div>
                <div>Registros: {totalRegistros}</div>
              </div>
            </div>

            {/* Información adicional */}
            <div style={{ 
              fontSize: "0.7rem", 
              opacity: 0.8,
              textAlign: "center",
              marginTop: "15px"
            }}>
              <div>Consulta generada:</div>
              <div style={{ fontWeight: "bold" }}>
                {dayjs().format('DD/MM/YYYY HH:mm')}
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </StyledCard>
  );
};