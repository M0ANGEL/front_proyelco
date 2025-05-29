/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";

import { Badge, Space, Drawer } from "antd";

import { useState } from "react";
import { FaBell } from "react-icons/fa";

import { KEY_ROL } from "@/config/api";

export const Alerts = () => {
  const { getSessionVariable } = useSessionStorage();
  const [open, setOpen] = useState(false);

  const user_rol = getSessionVariable(KEY_ROL);

  // -----------Gestión humana fin
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  /*   const periodoFinAprendiz = () => {
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
  }; */

  return (
    <>
      <Space size="middle" style={{ marginTop: 16 }}>
        <Badge size="small" /* count={count} */>
          <FaBell
            onClick={showDrawer}
            size={24}
            style={{ cursor: "pointer" }}
          />
        </Badge>
      </Space>
      <Drawer title="Notificaciones" onClose={onClose} open={open}>
        {/* resoluciones facturacion */}
        {/*  {resolucionesPorAcabar()} */}
        {/* fin resoluciones facturacion */}
      </Drawer>
    </>
  );
};
