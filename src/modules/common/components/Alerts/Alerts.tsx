import { Badge, Space, Divider, List, Drawer } from "antd";
import { useEffect, useState } from "react";
import { GoAlert } from "react-icons/go";
import { FaBell } from "react-icons/fa";
import { KEY_ROL } from "@/config/api";
import useSessionStorage from "../../hooks/useSessionStorage";
import { getProyectosSinMovimientos } from "@/services/proyectos/proyectosAPI";

export const Alerts = () => {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);

  const [resolucionPorVencerTitle, setResolucionPorVencerTitle] =
    useState<string>();
  const [resolucionPorVencerDescription, setResolucionPorVencerDescription] =
    useState<JSX.Element[]>([]);

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  useEffect(() => {
    const fetchData = async () => {
      if (["Administrador"].includes(user_rol)) {
        await fetchResolucionesPorVencer();
      }
    };
    if (["Administrador"].includes(user_rol)) fetchData();
  }, []);

  const fetchResolucionesPorVencer = async () => {
    try {
      const {
        data: { data },
      } = await getProyectosSinMovimientos();
      const newDescriptions: JSX.Element[] = [];
      let newCount = 0;

      data.forEach((resolucion) => {
        const description = (
          <div>
            <div><b>Proyecto:</b> {resolucion.descripcion}</div> 
            <div><b>Ultima Fecha:</b> {resolucion.ultima_fecha}</div> 
            <div><b>Dias sin movimientos:</b> {resolucion.dias_inactivo}</div> 
          </div>
        );

        newDescriptions.push(description);
        newCount++;
      });

      setResolucionPorVencerTitle("PROYECTOS INACTIVOS MAS DE 1 DIA");
      setResolucionPorVencerDescription((prev) => [
        ...prev,
        ...newDescriptions,
      ]);
      setCount((prev) => prev + newCount);
    } catch (error) {
      console.error("Error fetching proyectos:", error);
    }
  };

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
    }
    return null;
  };

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
        {resolucionesPorVencer()}
      </Drawer>
    </>
  );
};
