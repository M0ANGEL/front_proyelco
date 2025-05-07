import { Tabs } from "antd";
import { TablaDistribuciones } from "../TablaDistribuciones";

export const ListDistribucionCompra = () => {
  return (
    <>
      <Tabs
        items={[
          {
            key: "0",
            label: "Pendientes",
            children: <TablaDistribuciones tab={"pendientes"} />,
          },
          {
            key: "1",
            label: "Completadas",
            children: <TablaDistribuciones tab={"completadas"} />,
          },
        ]}
        animated
      />
    </>
  );
};
