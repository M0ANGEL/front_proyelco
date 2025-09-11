import { Badge, Space, Divider, List, Drawer } from "antd";
import { useEffect, useState } from "react";
import { GoAlert } from "react-icons/go";
import { FaBell } from "react-icons/fa";
import { KEY_ROL } from "@/config/api";
import useSessionStorage from "../../hooks/useSessionStorage";
import { getProyectosSinMovimientos, getProyectosSinMovimientosIng } from "@/services/proyectos/proyectosAPI";

export const Alerts = () => {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);

  //estados para guardar data y titulo
  const [proyectosInactivosTitulo, setProyectosInactivosTitulo] =
    useState<string>();
  const [proyectosInactivosDescripcion, setProyectosInactivosDescripcion] =
    useState<JSX.Element[]>([]);

  //estados para guardar data y titulo de proyectos ingenieros de obras
  const [proyectosInactivosTituloIng, setProyectosInactivosTituloIng] =
    useState<string>();
     const [proyectosInactivosDescripcionIng, setProyectosInactivosDescripcionIng] =
    useState<JSX.Element[]>([]);


  //estados de open close de alert
  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);
/*****************************************ESTADO DE LLAMADA DATA*************************************************************** */
  //efecto para llamado de data
  useEffect(() => {
    //solo llamar si el rol es Adminsitrador o Directora Proyectos
    const fetchData = async () => {
      if (["Administrador", "Directora Proyectos"].includes(user_rol)) {
        await functionLlamadoProyectosInactivosAdmin();
      }
    };
    if (["Administrador", "Directora Proyectos"].includes(user_rol)) {
      fetchData();
    }


    //lalmamos los datos de los proyectos inactivos de los ing asignados
    const fetchDataIng = async () => {
      if (["Ingeniero Obra", "Encargado Obras"].includes(user_rol)) {
        await functionLlamadoProyectosInactivosIng();
      }
    };
    if (["Ingeniero Obra", "Encargado Obras"].includes(user_rol)) {
      fetchDataIng();
    }

  }, []);
  
/*****************************************ESTADO DE LLAMADA DATA FIN*************************************************************** */

/*****************************************APIS DE LLAMADA**************************************************************** */
  //function de llamado de data
  const functionLlamadoProyectosInactivosAdmin = async () => {
    try {
      const {
        data: { data },
      } = await getProyectosSinMovimientos();
      const newDescriptions: JSX.Element[] = [];
      let newCount = 0;

      data.forEach((resolucion) => {
        const description = (
          <div>
            <div>
              <b>Proyecto:</b> {resolucion.descripcion}
            </div>
            <div>
              <b>Ultima Fecha:</b> {resolucion.ultima_fecha}
            </div>
            <div>
              <b>Dias sin movimientos:</b> {resolucion.dias_inactivo}
            </div>
          </div>
        );

        newDescriptions.push(description);
        newCount++;
      });

      setProyectosInactivosTitulo("PROYECTOS INACTIVOS MAS DE 2 DIA");
      setProyectosInactivosDescripcion((prev) => [
        ...prev,
        ...newDescriptions,
      ]);
      setCount((prev) => prev + newCount);
    } catch (error) {
      console.error("Error fetching proyectos:", error);
    }
  };

  //llamado de datos ing proyectos asugnados y encargados de obra
   const functionLlamadoProyectosInactivosIng = async () => {
    try {
      const {
        data: { data },
      } = await getProyectosSinMovimientosIng();
      const newDescriptions: JSX.Element[] = [];
      let newCount = 0;

      data.forEach((resolucion) => {
        const description = (
          <div>
            <div>
              <b>Proyecto:</b> {resolucion.descripcion}
            </div>
            <div>
              <b>Ultima Fecha:</b> {resolucion.ultima_fecha}
            </div>
            <div>
              <b>Dias sin movimientos:</b> {resolucion.dias_inactivo}
            </div>
          </div>
        );

        newDescriptions.push(description);
        newCount++;
      });

      setProyectosInactivosTituloIng("PROYECTOS INACTIVOS MAS DE 2 DIA");
      setProyectosInactivosDescripcionIng((prev) => [
        ...prev,
        ...newDescriptions,
      ]);
      setCount((prev) => prev + newCount);
    } catch (error) {
      console.error("Error fetching proyectos:", error);
    }
  };

/*****************************************APIS DE LLAMADA FIN**************************************************************** */

/*****************************************EMPAQUETADO INFO**************************************************************** */
  //empaquetado de la informacion
  const proyectosInactivosAdmin = () => {
    if (proyectosInactivosDescripcion.length > 0) {
      return (
        <>
          <Divider orientation="left">
            <GoAlert style={{ color: "red" }} /> {proyectosInactivosTitulo}
          </Divider>
          <List
            size="small"
            bordered
            dataSource={proyectosInactivosDescripcion}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </>
      );
    }
    return null;
  };


   const proyectosInactivosIng = () => {
    if (proyectosInactivosDescripcionIng.length > 0) {
      return (
        <>
          <Divider orientation="left">
            <GoAlert style={{ color: "red" }} /> {proyectosInactivosTituloIng}
          </Divider>
          <List
            size="small"
            bordered
            dataSource={proyectosInactivosDescripcionIng}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </>
      );
    }
    return null;
  };


  /*****************************************EMPAQUETADO INFO FIN**************************************************************** */

  //return de la logica
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
        {proyectosInactivosAdmin()}
        {proyectosInactivosIng()}
      </Drawer>
    </>
  );
};
