/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { getSalarioMinimo } from "@/services/gestion-humana/dotacionesAPI";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { index } from "@/services/gestion-humana/alertasContratosAPI";
import { empleadosActivos } from "@/services/maestras/empleadosAPI";
import {
  getResolucionPorVencer,
  getResolucionPorAcabar,
} from "@/services/resolucion-facturacion/resolucionFacturacionAPI";
import { Badge, Space, Divider, List, Drawer } from "antd";
import {
  getDiasIncapacidadEmpleado,
  getIncapacidadesSinRadicar,
  getIncapacidadesSinPagar,
} from "@/services/gestion-humana/incapacidadesAPI";
import { useEffect, useState } from "react";
import { GoAlert } from "react-icons/go";
import { FaBell } from "react-icons/fa";
import {
  getAlertasImpuestoRodamiento,
  getAlertasMantenimientos,
  getAlertasTechno,
  getAlertasSoat,
} from "@/services/activos/activosAPI";
import { KEY_ROL } from "@/config/api";

export const Alerts = () => {
  const { getSessionVariable } = useSessionStorage();
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);

  const user_rol = getSessionVariable(KEY_ROL);

  // ---- ACTIVOS FIJOS ---- //
  const [
    vencimientoMantenimientoDescription,
    setVencimientoMantenimientoDescription,
  ] = useState<string[]>([]);
  const [vencimientoMantenimientoTitle, setVencimientoMantenimientoTitle] =
    useState<string>();
  const [vencimientosSoatDescription, setVencimientosSoatDescription] =
    useState<string[]>([]);
  const [vencimientosSoatTitle, setVencimientoSoatTitle] = useState<string>();
  const [vencimientosTechnoTitle, setVencimientoTechnoTitle] =
    useState<string>();
  const [vencimientosRodamientoTitle, setVencimientoRodamientoTitle] =
    useState<string>();
  const [vencimientosTechnoDescription, setVencimientosTechnoDescription] =
    useState<string[]>([]);

  const [
    VencimientosRodamientoDescription,
    setVencimientosRodamientoDescription,
  ] = useState<string[]>([]);
  // ------ FIN ACTIVOS FIJOS ------ //

  // ------ RESOLUCION FACTURACION
  const [resolucionPorVencerTitle, setResolucionPorVencerTitle] =
    useState<string>();
  const [resolucionPorVencerDescription, setResolucionPorVencerDescription] =
    useState<string[]>([]);
  const [resolucionPorAcabarTitle, setResolucionPorAcabarTitle] =
    useState<string>();
  const [resolucionPorAcabarDescription, setResolucionPorAcabarDescription] =
    useState<string[]>([]);
  // ------ FIN RESOLUCION FACTURACION

  // ------ Gestion humana
  const [periodoPruebaTitle, setPeriodoPruebaTitle] = useState<string>();
  const [
    periodoPruebaIndefinidoDescription,
    setPeriodoPruebaIndefinidoDescription,
  ] = useState<string[]>([]);
  const [periodoVacacionesTitle, setPeriodoVacacionesTitle] =
    useState<string>();
  const [periodoVacacionesDescription, setPeriodoVacacionesDescription] =
    useState<string[]>([]);
  const [periodoAprendizTitle, setPeriodoAprendizTitle] = useState<string>();
  const [periodoAprendizDescription, setPeriodoAprendizDescription] = useState<
    string[]
  >([]);
  const [periodoTerminoFijoTitle, setPeriodoTerminoFijoTitle] =
    useState<string>();
  const [periodoTerminoFijoDescription, setPeriodoTerminoFijoDescription] =
    useState<string[]>([]);
  const [periodoPrestacionServiciosTitle, setPeriodoPrestacionServiciosTitle] =
    useState<string>();
  const [
    periodoPrestacionServiciosDescription,
    setPeriodoPrestacionServiciosDescription,
  ] = useState<string[]>([]);
  const [incapacidadesSinRadicarTitle, setIncapacidadesSinRadicarTitle] =
    useState<string>();
  const [
    incapacidadesSinRadicarDescription,
    setIncapacidadesSinRadicarDescription,
  ] = useState<string[]>([]);
  const [incapacidadesSinPagarTitle, setIncapacidadesSinPagarTitle] =
    useState<string>();
  const [
    incapacidadesSinPagarDescription,
    setIncapacidadesSinPagarDescription,
  ] = useState<string[]>([]);
  const [dotacionesSinEntregarTitle, setDotacionesSinEntregarTitle] =
    useState<string>();
  const [
    dotacionesSinEntregarDescription,
    setDotacionesSinEntregarDescription,
  ] = useState<string[]>([]);
  // -----------Gestión humana fin
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  // -------------------------------- RESOLUCION FACTURACION --------------------------------
  const fetchResolucionesPorVencer = async () => {
    try {
      const {
        data: { data },
      } = await getResolucionPorVencer();
      const newDescriptions: string[] = [];
      let newCount = 0;

      data.forEach((resolucion) => {
        const description =
          "Resolución " +
          resolucion.resolucion +
          "-" +
          resolucion.prefijo +
          " está por vencer dias " +
          resolucion.dias;
        newDescriptions.push(description);
        newCount++;
      });

      setResolucionPorVencerTitle("RESOLUCIONES POR VENCER");
      setResolucionPorVencerDescription((prevDescriptions) => [
        ...prevDescriptions,
        ...newDescriptions,
      ]);
      setCount((count) => count + newCount);
    } catch (error) {
      console.error("Error fetching incapacidades:", error);
    }
  };

  const fetchResolucionesPorAcabar = async () => {
    try {
      const {
        data: { data },
      } = await getResolucionPorAcabar();
      const newDescriptions: string[] = [];
      let newCount = 0;

      data.forEach((resolucion) => {
        const description =
          "Resolución " +
          resolucion.resolucion +
          "-" +
          resolucion.prefijo +
          " está por acabar " +
          resolucion.diferencia;
        newDescriptions.push(description);
        newCount++;
      });

      setResolucionPorAcabarTitle("RESOLUCIONES POR ACABAR");
      setResolucionPorAcabarDescription((prevDescriptions) => [
        ...prevDescriptions,
        ...newDescriptions,
      ]);
      setCount((count) => count + newCount);
    } catch (error) {
      console.error("Error fetching incapacidades:", error);
    }
  };
  // FIN RESOLUCION FACTURACION--------------------------------
  const fetchMantenimeintoVencimiento = async () => {
    try {
      const {
        data: { data },
      } = await getAlertasMantenimientos();
      const newDescriptions: string[] = [];
      let newCount = 0;

      data.forEach((mantenimiento) => {
        const description =
          mantenimiento.alerta +
          "\n" + // Mensaje de alerta
          "Fecha de vencimiento: " +
          mantenimiento.fecha_vencimiento +
          "\n"; // Variable con la fecha de vencimiento
        newDescriptions.push(description);
        newCount++;
      });
      setVencimientoMantenimientoTitle("Vencimientos Mantenimientos");
      setVencimientoMantenimientoDescription((prevDescriptions) => [
        ...prevDescriptions,
        ...newDescriptions,
      ]);

      setCount((count) => count + newCount);
    } catch (error) {
      console.error("Error fetching mantenimientos:", error);
    }
  };

  const fetchSoatVencimiento = async () => {
    try {
      const {
        data: { data },
      } = await getAlertasSoat();
      const newDescriptions: string[] = [];
      let newCount = 0;

      data.forEach((soat) => {
        const description =
          soat.alerta +
          "\n" + // Mensaje de alerta
          "Fecha de vencimiento: " +
          soat.fecha_vencimiento +
          "\n"; // Variable con la fecha de vencimiento
        newDescriptions.push(description);
        newCount++;
      });
      setVencimientoSoatTitle("Vencimientos Soat");
      setVencimientosSoatDescription((prevDescriptions) => [
        ...prevDescriptions,
        ...newDescriptions,
      ]);

      setCount((count) => count + newCount);
    } catch (error) {
      console.error("Error fetching soat:", error);
    }
  };

  const fetchTechnoVencimiento = async () => {
    try {
      const {
        data: { data },
      } = await getAlertasTechno();
      const newDescriptions: string[] = [];
      let newCount = 0;

      data.forEach((tecno) => {
        const description =
          tecno.alerta +
          "\n" + // Mensaje de alerta
          "Fecha de vencimiento: " +
          tecno.fecha_vencimiento +
          "\n"; // Variable con la fecha de vencimiento
        newDescriptions.push(description);
        newCount++;
      });
      setVencimientoTechnoTitle("Vencimientos Tecnicomecanicos");
      setVencimientosTechnoDescription((prevDescriptions) => [
        ...prevDescriptions,
        ...newDescriptions,
      ]);

      setCount((count) => count + newCount);
    } catch (error) {
      console.error("Error fetching tecnicomecanicas:", error);
    }
  };

  const fetchImpuestoRodamiento = async () => {
    try {
      const {
        data: { data },
      } = await getAlertasImpuestoRodamiento();
      const newDescriptions: string[] = [];
      let newCount = 0;

      data.forEach((roda) => {
        const description =
          roda.alerta +
          "\n" +
          "Fecha de vencimiento: " +
          roda.fecha_vencimiento +
          "\n";
        newDescriptions.push(description);
        newCount++;
      });
      setVencimientoRodamientoTitle("Vencimientos Impuestos Rodamiento");
      setVencimientosRodamientoDescription((prevDescriptions) => [
        ...prevDescriptions,
        ...newDescriptions,
      ]);

      setCount((count) => count + newCount);
    } catch (error) {
      console.error("Error fetching impuestos:", error);
    }
  };

  // ------------------------GESTION HUMANA
  const fetchIncapacidadesSinRadicar = async () => {
    try {
      const {
        data: { data },
      } = await getIncapacidadesSinRadicar();
      const newDescriptions: string[] = [];
      let newCount = 0;

      data.forEach((incapacidad) => {
        const description =
          "Empleado " +
          incapacidad.cedula +
          "-" +
          incapacidad.nombre_completo +
          " tiene incapacidad sin radicar ";
        newDescriptions.push(description);
        newCount++;
      });

      setIncapacidadesSinRadicarTitle("INCAPACIDADES SIN RADICAR");
      setIncapacidadesSinRadicarDescription((prevDescriptions) => [
        ...prevDescriptions,
        ...newDescriptions,
      ]);
      setCount((count) => count + newCount);
    } catch (error) {
      console.error("Error fetching incapacidades:", error);
    }
  };

  const fetchIncapacidadesSinPagar = async () => {
    try {
      const {
        data: { data },
      } = await getIncapacidadesSinPagar();
      const newDescriptions: string[] = [];
      let newCount = 0;

      data.forEach((incapacidad) => {
        const description =
          "Empleado " +
          incapacidad.cedula +
          "-" +
          incapacidad.nombre_completo +
          " tiene incapacidad sin pagar mas de 6 meses.";
        newDescriptions.push(description);
        newCount++;
      });

      setIncapacidadesSinPagarTitle("INCAPACIDADES SIN PAGAR");
      setIncapacidadesSinPagarDescription((prevDescriptions) => [
        ...prevDescriptions,
        ...newDescriptions,
      ]);
      setCount((count) => count + newCount);
    } catch (error) {
      console.error("Error fetching incapacidades:", error);
    }
  };

  const calcularDiasParaTerminarPeriodo = (fecha: string) => {
    const futureDate = new Date(fecha);
    const currentDate = new Date();
    const differenceInMilliseconds =
      futureDate.getTime() - currentDate.getTime();
    const differenceInDays =
      differenceInMilliseconds / (1000 * 60 * 60 * 24) + 1;

    return Math.round(differenceInDays);
  };

  const calcularFechaFinPeriodoPrueba = (fecha: string) => {
    const fechaInicio = new Date(fecha);
    fechaInicio.setDate(fechaInicio.getDate() + 60);
    const fechaPrueba = fechaInicio.toISOString().split("T")[0];
    return fechaPrueba;
  };

  const calcularFechaDeVacaciones = (fecha: string) => {
    // Convertir la fecha de ingreso en un objeto Date
    const fechaIngresoDate = new Date(fecha);
    const fechaActual = new Date();
    const fechaVacaciones = new Date(fechaIngresoDate);
    fechaVacaciones.setFullYear(fechaVacaciones.getFullYear() + 1);

    // Mientras la fecha de vacaciones esté en el pasado, suma otro año
    while (fechaVacaciones <= fechaActual) {
      fechaVacaciones.setFullYear(fechaVacaciones.getFullYear() + 1);
    }

    const year = fechaVacaciones.getFullYear();
    const month = String(fechaVacaciones.getMonth() + 1).padStart(2, "0"); // Mes es 0-indexado, por lo que sumamos 1
    const day = String(fechaVacaciones.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const fetchEmpleados = async () => {
    try {
      const {
        data: { data: empleados },
      } = await empleadosActivos();
      const alerta: { data: any } = await index();
      const salario: { data: any } = await getSalarioMinimo(1);

      const updatedDescriptions: {
        periodoAprendiz: string[];
        periodoTerminoFijo: string[];
        periodoPrestacionServicios: string[];
        periodoPruebaIndefinido: string[];
        vacaciones: string[];
        periodoPruebaLabor: string[];
        vacacionesLabor: string[];
        dotaciones: string[];
      } = {
        periodoAprendiz: [],
        periodoTerminoFijo: [],
        periodoPrestacionServicios: [],
        periodoPruebaIndefinido: [],
        vacaciones: [],
        periodoPruebaLabor: [],
        vacacionesLabor: [],
        dotaciones: [],
      };
      let updatedCount = 0;

      const empleadosPromises = empleados.map(async (empleado) => {
        const fechaFinPrueba =
          empleado.fecha_fin === null
            ? calcularFechaFinPeriodoPrueba(empleado.fecha_inicio)
            : null;
        const fechaVacaciones =
          empleado.no_vacaciones_este_anio == "1"
            ? calcularFechaDeVacaciones(empleado.fecha_inicio)
            : null;
        const fechaDotacion =
          empleado.no_entregas_dotaciones_este_anio == "1"
            ? calcularFechaDeVacaciones(empleado.fecha_inicio)
            : null;

        if (["gh_bienestar"].includes(user_rol)) {
          if (empleado.no_entregas_dotaciones_este_anio == "1") {
            if (
              fechaFinPrueba &&
              empleado.contrato_id != "5" &&
              empleado.estado == "1" &&
              empleado.salario <= salario.data
            ) {
              const diasFinPrueba =
                calcularDiasParaTerminarPeriodo(fechaFinPrueba);

              if (
                diasFinPrueba <= parseInt(alerta.data.data[4].dias) &&
                diasFinPrueba >= 0
              ) {
                updatedDescriptions.periodoPruebaIndefinido.push(
                  `Empleado ${
                    empleado.nombre_completo
                  } termina periodo de prueba en ${Math.round(
                    diasFinPrueba
                  )} días`
                );
                updatedCount++;
              }
            }

            if (
              fechaDotacion &&
              empleado.contrato_id != "5" &&
              empleado.estado == "1" &&
              empleado.salario <= salario.data
            ) {
              const diasParaDotacion =
                calcularDiasParaTerminarPeriodo(fechaDotacion);
              if (
                diasParaDotacion <= parseInt(alerta.data.data[6].dias) &&
                diasParaDotacion >= 0
              ) {
                updatedDescriptions.dotaciones.push(
                  `Empleado ${
                    empleado.nombre_completo
                  } entregar dotación en ${Math.round(diasParaDotacion)} días`
                );
                updatedCount++;
              }
            }
          }
        } else {
          if (
            empleado.fecha_fin &&
            empleado.contrato_id == "5" &&
            empleado.estado == "1"
          ) {
            const { data } = await getDiasIncapacidadEmpleado(empleado.id);
            const fecha = new Date(empleado.fecha_fin);
            fecha.setDate(fecha.getDate() + parseInt(data));
            const fechaFin = fecha.toISOString().split("T")[0];
            const diasFinAprendiz = calcularDiasParaTerminarPeriodo(fechaFin);

            if (diasFinAprendiz <= parseInt(alerta.data.data[0].dias)) {
              updatedDescriptions.periodoAprendiz.push(
                `Aprendiz ${
                  empleado.nombre_completo
                } termina contrato aprendizaje en ${Math.round(
                  diasFinAprendiz
                )} días`
              );
              updatedCount++;
            }
          }

          if (
            empleado.fecha_fin &&
            empleado.contrato_id == "2" &&
            empleado.estado == "1"
          ) {
            const fechaFin = new Date(empleado.fecha_fin)
              .toISOString()
              .split("T")[0];
            const dias = calcularDiasParaTerminarPeriodo(fechaFin);

            if (dias <= parseInt(alerta.data.data[1].dias)) {
              updatedDescriptions.periodoTerminoFijo.push(
                `Empleado ${
                  empleado.nombre_completo
                } termina contrato en ${Math.round(dias)} días`
              );
              updatedCount++;
            }
          }

          if (
            empleado.fecha_fin &&
            empleado.contrato_id == "4" &&
            empleado.estado == "1"
          ) {
            const fechaFin = new Date(empleado.fecha_fin)
              .toISOString()
              .split("T")[0];
            const dias = calcularDiasParaTerminarPeriodo(fechaFin);

            if (dias <= parseInt(alerta.data.data[6].dias)) {
              updatedDescriptions.periodoPrestacionServicios.push(
                `Empleado ${
                  empleado.nombre_completo
                } termina contrato en ${Math.round(dias)} días`
              );
              updatedCount++;
            }
          }

          if (
            fechaFinPrueba &&
            fechaVacaciones &&
            empleado.contrato_id != "5" &&
            empleado.estado == "1"
          ) {
            const diasFinPrueba =
              calcularDiasParaTerminarPeriodo(fechaFinPrueba);
            const diasParaVacaciones =
              calcularDiasParaTerminarPeriodo(fechaVacaciones);

            if (
              diasFinPrueba <= parseInt(alerta.data.data[4].dias) &&
              diasFinPrueba >= 0
            ) {
              updatedDescriptions.periodoPruebaIndefinido.push(
                `Empleado ${
                  empleado.nombre_completo
                } termina periodo de prueba en ${Math.round(
                  diasFinPrueba
                )} días`
              );
              updatedCount++;
            }

            if (
              diasParaVacaciones <= parseInt(alerta.data.data[5].dias) &&
              diasParaVacaciones >= 0
            ) {
              updatedDescriptions.vacaciones.push(
                `Empleado ${empleado.nombre_completo} sale a vacaciones en ${diasParaVacaciones} días`
              );
              updatedCount++;
            }
          }
        }
      });

      await Promise.all(empleadosPromises);

      setPeriodoAprendizTitle("FIN PERIODO APRENDIZ");
      setPeriodoAprendizDescription((prev) => [
        ...prev,
        ...updatedDescriptions.periodoAprendiz,
      ]);
      setPeriodoTerminoFijoTitle("FIN CONTRATO TERMINO FIJO");
      setPeriodoTerminoFijoDescription((prev) => [
        ...prev,
        ...updatedDescriptions.periodoTerminoFijo,
      ]);
      setPeriodoPrestacionServiciosTitle(
        "FIN CONTRATO PRESTACIÓN DE SERVICIOS"
      );
      setPeriodoPrestacionServiciosDescription((prev) => [
        ...prev,
        ...updatedDescriptions.periodoPrestacionServicios,
      ]);
      setPeriodoPruebaTitle("FIN PERIODO PRUEBA");
      setPeriodoPruebaIndefinidoDescription((prev) => [
        ...prev,
        ...updatedDescriptions.periodoPruebaIndefinido,
      ]);
      setPeriodoVacacionesTitle("VACACIONES");
      setPeriodoVacacionesDescription((prev) => [
        ...prev,
        ...updatedDescriptions.vacaciones,
      ]);
      setDotacionesSinEntregarTitle("DOTACIONES POR ENTREGAR");
      setDotacionesSinEntregarDescription((prev) => [
        ...prev,
        ...updatedDescriptions.dotaciones,
      ]);
      setCount((prev) => prev + updatedCount);
    } catch (error) {
      console.error("Error fetching empleados:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (["contabilidad", "facturacion"].includes(user_rol)) {
        await Promise.all([
          fetchResolucionesPorVencer(),
          fetchResolucionesPorAcabar(),
        ]);
      } else {
        await Promise.all([
          fetchEmpleados(),
          fetchIncapacidadesSinRadicar(),
          fetchIncapacidadesSinPagar(),
        ]);
      }
    };
    const fetchDataActivos = async () => {
      await Promise.all([
        fetchMantenimeintoVencimiento(),
        fetchSoatVencimiento(),
        fetchTechnoVencimiento(),
        fetchImpuestoRodamiento(),
      ]);
    };

    if (["gh_admin", "gh_consulta", "gh_auxiliar"].includes(user_rol)) {
      fetchData();
    }
    fetchDataActivos();
  }, []);

  const periodoFinAprendiz = () => {
    if (periodoAprendizDescription.length > 0) {
      return (
        <>
          <Divider orientation="left">
            <GoAlert style={{ color: "red" }} /> {periodoAprendizTitle}
          </Divider>
          <List
            size="small"
            bordered
            dataSource={periodoAprendizDescription}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </>
      );
    } else {
      return null;
    }
  };

  const periodoFinPrueba = () => {
    if (periodoPruebaIndefinidoDescription.length > 0) {
      return (
        <>
          <Divider orientation="left">
            <GoAlert style={{ color: "red" }} /> {periodoPruebaTitle}
          </Divider>
          <List
            size="small"
            bordered
            dataSource={periodoPruebaIndefinidoDescription}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </>
      );
    } else {
      return null;
    }
  };

  const periodoFinVacaciones = () => {
    if (periodoVacacionesDescription.length > 0) {
      return (
        <>
          <Divider orientation="left">
            <GoAlert style={{ color: "red" }} /> {periodoVacacionesTitle}
          </Divider>
          <List
            size="small"
            bordered
            dataSource={periodoVacacionesDescription}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </>
      );
    } else {
      return null;
    }
  };

  const periodoFinTerminFijo = () => {
    if (periodoTerminoFijoDescription.length > 0) {
      return (
        <>
          <Divider orientation="left">
            <GoAlert style={{ color: "red" }} /> {periodoTerminoFijoTitle}
          </Divider>
          <List
            size="small"
            bordered
            dataSource={periodoTerminoFijoDescription}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </>
      );
    } else {
      return null;
    }
  };

  const periodoPrestacionServicios = () => {
    if (periodoPrestacionServiciosDescription.length > 0) {
      return (
        <>
          <Divider orientation="left">
            <GoAlert style={{ color: "red" }} />{" "}
            {periodoPrestacionServiciosTitle}
          </Divider>
          <List
            size="small"
            bordered
            dataSource={periodoPrestacionServiciosDescription}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </>
      );
    } else {
      return null;
    }
  };

  const incapacidadesSinRadicar = () => {
    if (incapacidadesSinRadicarDescription.length > 0) {
      return (
        <>
          <Divider orientation="left">
            <GoAlert style={{ color: "red" }} /> {incapacidadesSinRadicarTitle}
          </Divider>
          <List
            size="small"
            bordered
            dataSource={incapacidadesSinRadicarDescription}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </>
      );
    } else {
      return null;
    }
  };

  const alertaMantenimientos = () => {
    if (vencimientoMantenimientoDescription.length > 0) {
      return (
        <>
          <Divider orientation="left">
            {" "}
            <GoAlert style={{ color: "red" }} /> {vencimientoMantenimientoTitle}
          </Divider>
          <List
            size="small"
            bordered
            dataSource={vencimientoMantenimientoDescription}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </>
      );
    } else {
      return null;
    }
  };

  const alertaSoat = () => {
    if (vencimientosSoatDescription.length > 0) {
      return (
        <>
          <Divider orientation="left">
            {" "}
            <GoAlert style={{ color: "red" }} /> {vencimientosSoatTitle}
          </Divider>
          <List
            size="small"
            bordered
            dataSource={vencimientosSoatDescription}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </>
      );
    } else {
      return null;
    }
  };

  const alertaTechno = () => {
    if (vencimientosTechnoDescription.length > 0) {
      return (
        <>
          <Divider orientation="left">
            {" "}
            <GoAlert style={{ color: "red" }} /> {vencimientosTechnoTitle}
          </Divider>
          <List
            size="small"
            bordered
            dataSource={vencimientosTechnoDescription}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </>
      );
    } else {
      return null;
    }
  };

  const alertaRodamiento = () => {
    if (VencimientosRodamientoDescription.length > 0) {
      return (
        <>
          <Divider orientation="left">
            {" "}
            <GoAlert style={{ color: "red" }} /> {vencimientosRodamientoTitle}
          </Divider>
          <List
            size="small"
            bordered
            dataSource={VencimientosRodamientoDescription}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </>
      );
    } else {
      return null;
    }
  };

  const incapacidadesSinPagar = () => {
    if (incapacidadesSinPagarDescription.length > 0) {
      return (
        <>
          <Divider orientation="left">
            <GoAlert style={{ color: "red" }} /> {incapacidadesSinPagarTitle}
          </Divider>
          <List
            size="small"
            bordered
            dataSource={incapacidadesSinPagarDescription}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </>
      );
    } else {
      return null;
    }
  };

  const dotacionesSinEntregar = () => {
    if (dotacionesSinEntregarDescription.length > 0) {
      return (
        <>
          <Divider orientation="left">
            <GoAlert style={{ color: "red" }} /> {dotacionesSinEntregarTitle}
          </Divider>
          <List
            size="small"
            bordered
            dataSource={dotacionesSinEntregarDescription}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </>
      );
    } else {
      return null;
    }
  };
  // ---------FIN GESTION HUMANA

  // -------- RESOLUCIONES FACTURACION
  const resolucionesPorVencer = () => {
    if (resolucionPorVencerDescription.length > 0) {
      return (
        <>
          <Divider orientation="left">
            <GoAlert style={{ color: "red" }} /> {resolucionPorVencerTitle}
          </Divider>
          <List
            size="small"
            bordered
            dataSource={resolucionPorVencerDescription}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </>
      );
    } else {
      return null;
    }
  };

  const resolucionesPorAcabar = () => {
    if (resolucionPorAcabarDescription.length > 0) {
      return (
        <>
          <Divider orientation="left">
            <GoAlert style={{ color: "red" }} /> {resolucionPorAcabarTitle}
          </Divider>
          <List
            size="small"
            bordered
            dataSource={resolucionPorAcabarDescription}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </>
      );
    } else {
      return null;
    }
  };
  // FIN RESOLUCION FACTURACION ------------------------

  return (
    <>
      <Space size="middle" style={{ marginTop: 16 }}>
        <Badge size="small" count={count}>
          <FaBell
            onClick={showDrawer}
            size={24}
            style={{ cursor: "pointer" }}
          />
        </Badge>
      </Space>
      <Drawer title="Notificaciones" onClose={onClose} open={open}>
        {/* gestion humana */}
        {periodoFinAprendiz()}
        {periodoFinPrueba()}
        {periodoFinVacaciones()}
        {periodoFinTerminFijo()}
        {periodoPrestacionServicios()}
        {incapacidadesSinRadicar()}
        {incapacidadesSinPagar()}
        {dotacionesSinEntregar()}
        {/* fin gestion humana */}

        {/* Activos Fijos */}
        {alertaMantenimientos()}
        {alertaSoat()}
        {alertaTechno()}
        {alertaRodamiento()}
        {/* fin Activos Fijos */}

        {/* resoluciones facturacion */}
        {resolucionesPorVencer()}
        {resolucionesPorAcabar()}
        {/* fin resoluciones facturacion */}
      </Drawer>
    </>
  );
};
