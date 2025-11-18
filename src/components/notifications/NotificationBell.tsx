import { Badge, Space, Divider, List, Drawer, Tag, Card, Typography } from "antd";
import { useEffect, useState } from "react";
import { GoAlert } from "react-icons/go";
import { FaBell } from "react-icons/fa";
import { getProyectosSinMovimientos, getProyectosSinMovimientosIng } from "@/services/proyectos/proyectosAPI";
import useSessionStorage from "@/hooks/useSessionStorage";
import { KEY_ROL } from "@/config/api";

const { Text, Title } = Typography;

export const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);

  //estados para guardar data y titulo
  const [proyectosInactivosTitulo, setProyectosInactivosTitulo] = useState<string>();
  const [proyectosInactivosDescripcion, setProyectosInactivosDescripcion] = useState<JSX.Element[]>([]);

  //estados para guardar data y titulo de proyectos ingenieros de obras
  const [proyectosInactivosTituloIng, setProyectosInactivosTituloIng] = useState<string>();
  const [proyectosInactivosDescripcionIng, setProyectosInactivosDescripcionIng] = useState<JSX.Element[]>([]);

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
          <Card 
            size="small" 
            style={{ 
              marginBottom: 8,
              borderLeft: "4px solid #ff4d4f",
              borderRadius: "8px"
            }}
            bodyStyle={{ padding: "12px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <Text strong style={{ fontSize: "14px" }}>
                {resolucion.descripcion}
              </Text>
              <Tag color="error" style={{ margin: 0 }}>
                {resolucion.dias_inactivo} días
              </Tag>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Última actividad:
                </Text>
                <Text style={{ fontSize: "12px" }}>
                  {resolucion.ultima_fecha}
                </Text>
              </div>
            </div>
          </Card>
        );

        newDescriptions.push(description);
        newCount++;
      });

      setProyectosInactivosTitulo("PROYECTOS INACTIVOS");
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
          <Card 
            size="small" 
            style={{ 
              marginBottom: 8,
              borderLeft: "4px solid #ff4d4f",
              borderRadius: "8px"
            }}
            bodyStyle={{ padding: "12px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <Text strong style={{ fontSize: "14px" }}>
                {resolucion.descripcion}
              </Text>
              <Tag color="error" style={{ margin: 0 }}>
                {resolucion.dias_inactivo} días
              </Tag>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Última actividad:
                </Text>
                <Text style={{ fontSize: "12px" }}>
                  {resolucion.ultima_fecha}
                </Text>
              </div>
            </div>
          </Card>
        );

        newDescriptions.push(description);
        newCount++;
      });

      setProyectosInactivosTituloIng("PROYECTOS INACTIVOS");
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
        <div style={{ marginBottom: 24 }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 8, 
            marginBottom: 16,
            padding: "8px 12px",
            backgroundColor: "#fff2f0",
            borderRadius: "6px",
            border: "1px solid #ffccc7"
          }}>
            <GoAlert style={{ color: "#ff4d4f", fontSize: "16px" }} />
            <Text strong style={{ color: "#ff4d4f", fontSize: "14px" }}>
              {proyectosInactivosTitulo}
            </Text>
            <Tag color="red" style={{ marginLeft: "auto" }}>
              {proyectosInactivosDescripcion.length}
            </Tag>
          </div>
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {proyectosInactivosDescripcion.map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const proyectosInactivosIng = () => {
    if (proyectosInactivosDescripcionIng.length > 0) {
      return (
        <div style={{ marginBottom: 24 }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 8, 
            marginBottom: 16,
            padding: "8px 12px",
            backgroundColor: "#fff2f0",
            borderRadius: "6px",
            border: "1px solid #ffccc7"
          }}>
            <GoAlert style={{ color: "#ff4d4f", fontSize: "16px" }} />
            <Text strong style={{ color: "#ff4d4f", fontSize: "14px" }}>
              {proyectosInactivosTituloIng}
            </Text>
            <Tag color="red" style={{ marginLeft: "auto" }}>
              {proyectosInactivosDescripcionIng.length}
            </Tag>
          </div>
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {proyectosInactivosDescripcionIng.map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const NoNotifications = () => (
    <div style={{ 
      textAlign: "center", 
      padding: "40px 20px",
      color: "#bfbfbf"
    }}>
      <FaBell style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.5 }} />
      <Title level={4} style={{ color: "#bfbfbf", marginBottom: "8px" }}>
        No hay notificaciones
      </Title>
      <Text type="secondary">
        No tienes notificaciones pendientes en este momento.
      </Text>
    </div>
  );

  /*****************************************EMPAQUETADO INFO FIN**************************************************************** */

  const hasNotifications = proyectosInactivosDescripcion.length > 0 || proyectosInactivosDescripcionIng.length > 0;

  return (
    <>
      <Space size="middle" style={{ marginTop: 16 }}>
        <Badge 
          count={count} 
          size="small"
          style={{ 
            backgroundColor: count > 0 ? "#ff4d4f" : "#d9d9d9",
            boxShadow: count > 0 ? "0 0 0 1px #fff" : "none"
          }}
        >
          <FaBell
            onClick={showDrawer}
            size={24}
            style={{ 
              cursor: "pointer", 
              color: count > 0 ? "#1890ff" : "#595959",
              transition: "color 0.3s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#1890ff"}
            onMouseLeave={(e) => e.currentTarget.style.color = count > 0 ? "#1890ff" : "#595959"}
          />
        </Badge>
      </Space>
      <Drawer 
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FaBell style={{ color: "#1890ff" }} />
            <span>Notificaciones</span>
            {count > 0 && (
              <Tag color="blue" style={{ marginLeft: "auto" }}>
                {count} {count === 1 ? 'notificación' : 'notificaciones'}
              </Tag>
            )}
          </div>
        } 
        onClose={onClose} 
        open={open}
        width={400}
        styles={{
          body: {
            padding: "16px",
            backgroundColor: "#fafafa"
          }
        }}
      >
        {hasNotifications ? (
          <>
            {proyectosInactivosAdmin()}
            {proyectosInactivosIng()}
          </>
        ) : (
          <NoNotifications />
        )}
      </Drawer>
    </>
  );
};