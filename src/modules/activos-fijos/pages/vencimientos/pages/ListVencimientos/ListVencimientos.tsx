/* eslint-disable react-hooks/exhaustive-deps */
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import {
  TabsProps,
  Tabs,
  Layout,
  notification,
  Table,
  Tooltip,
  Tag,
} from "antd";
import { useState, useEffect } from "react";
import { getListaActivos } from "@/services/activos/activosAPI";
import { ColumnsType } from "antd/es/table";
import { dataImpuestosRodamiento, dataMantenimiento, dataSoat, dataTecno } from "./types";
import { getListaMantenimientos } from "@/services/activos/mantenimientoAPI";
// import { useNotifications } from "./NotificationContext"; // Importa el hook de notificaciones
import { AxiosError } from "axios";
import { ReloadOutlined } from "@ant-design/icons";
import React from "react";
import { obtenerAlertas } from "@/services/activos/vencimientosAPI";
// import { Vencimientos } from "@/services/types";
import { RedButton } from "@/modules/common/components/ExportExcel/styled";
import ModalRenovarParametros from "../Components/ModalRenovarParametros";
import { fetchUserProfile } from "@/services/auth/authAPI";


export const ListVencimientos = () => {
  const [activeTabKey, setActiveTabKey] = React.useState("soat");
  const [datasoat, setDatasoat] = useState<dataSoat[]>([]);
  
  const [dataImpuestosRodamiento, setDataImpuestosRodamiento] = useState<dataImpuestosRodamiento[]>([]);
  const [datatecno, setDatatecno] = useState<dataTecno[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [idUsuarioFijo, setIdUsuarioFijo] = useState<number>(1);
  const [tipoMantenimiento, setTipoMantenimiento] = useState<
    "soat" | "tecnicomecanica"
  >("soat");

  // const [dataSeguro, setDataSeguro] = useState<dataSeguro[]>([]); // Inicializa correctamente
  const [datamantenimiento, setDatamantenimiento] = useState<
    dataMantenimiento[]
  >([]);
  const [pagination, setPagination] = useState<{
    total: number;
    per_page: number;
  }>();
  const [loaderTable, setLoaderTable] = useState<boolean>(true);
  // const { addNotification } = useNotifications(); // Usa el hook para acceder al contexto
  const [modalVisible, setModalVisible] = useState(false);
  const [activo, setActivo] = useState<number | null>(null);

  const showModal = (idActivo: number, tipo: "soat" | "tecnicomecanica") => {
    setActivo(idActivo);
    setTipoMantenimiento(tipo);
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setActivo(null);
  };

  useEffect(() => {
    const loadAllData = async () => {
      await fetchData();
      await fetchMantenimientos();
      setDataLoaded(true);
    };

    loadAllData();
  }, []);

  useEffect(() => {
    if (dataLoaded) {
      checkAlertsAndNotify();
    }
  }, [activeTabKey, dataLoaded]);

  useEffect(() => {
    if (dataLoaded) {
      checkAlertsAndNotify();
    }
  }, [datasoat, datatecno, datamantenimiento, dataImpuestosRodamiento]);

  const fetchData = async () => {
    try {
      const response = await fetchUserProfile();
      const userId = Number(response.data.userData.id);
      setIdUsuarioFijo(userId);

      const { data } = await getListaActivos();
      const soatData: dataSoat[] = [];
      const tecnoData: dataTecno[] = [];
      const impuestoRodamientoData : dataImpuestosRodamiento[] = [];

      data.forEach((item) => {
        const soatFechaDato = item.datos.find(
          (dato) =>
            dato.parametro_sub_categoria.parametro.descripcion === "SOAT"
        );

        if (soatFechaDato) {
          const fechaCompra = new Date(soatFechaDato.valor_almacenado);
          const fechaVencimiento = new Date(fechaCompra);
          fechaVencimiento.setFullYear(fechaVencimiento.getFullYear() + 1);

          soatData.push({
            datos: item.datos,
            id_activo: item.id,
            nombre_activo: item.nombre,
            fecha_compra: fechaCompra.toISOString().split("T")[0],
            fecha_vencimiento: fechaVencimiento.toISOString().split("T")[0],
            alerta:
              calcularAlerta(fechaVencimiento.toISOString().split("T")[0]) ||
              "sin alerta",
          });
        }

        const tecnoFechaDato = item.datos.find(
          (dato) =>
            dato.parametro_sub_categoria.parametro.descripcion ===
            "TECNICOMECANICA"
        );

        if (tecnoFechaDato) {
          const fechaCompra = new Date(tecnoFechaDato.valor_almacenado);
          const fechaVencimiento = new Date(fechaCompra);
          fechaVencimiento.setFullYear(fechaVencimiento.getFullYear() + 1);

          tecnoData.push({
            datos: item.datos,
            id_activo: item.id,
            nombre_activo: item.nombre,
            fecha_compra: fechaCompra.toISOString().split("T")[0],
            fecha_vencimiento: fechaVencimiento.toISOString().split("T")[0],
            alerta:
              calcularAlerta(fechaVencimiento.toISOString().split("T")[0]) ||
              "sin alerta",
          });
        }

        const impuestoRodamientoFechaDato = item.datos.find(
          (dato) =>
            dato.parametro_sub_categoria.parametro.descripcion ===
            "IMPUESTO DE RODAMIENTO"
        );

        if(impuestoRodamientoFechaDato){
          const fechaCompra = new Date(impuestoRodamientoFechaDato.valor_almacenado);
          const fechaVencimiento = new Date(fechaCompra);
          fechaVencimiento.setFullYear(fechaVencimiento.getFullYear() + 1);

          impuestoRodamientoData.push({
            datos: item.datos,
            id_activo: item.id,
            nombre_activo: item.nombre,
            fecha_compra: fechaCompra.toISOString().split("T")[0],
            fecha_vencimiento: fechaVencimiento.toISOString().split("T")[0],
            alerta: 
            calcularAlerta(fechaVencimiento.toISOString().split("T")[0]) ||
            "sin alerta",
          });
        }
      });

      setDatasoat(soatData);
      setDatatecno(tecnoData);
      setDataImpuestosRodamiento(impuestoRodamientoData);
    } catch (error) {
      if (error instanceof AxiosError) {
        notification.error({
          message: "Error al obtener activos",
          description: `Error: ${error.message}. Código: ${error.code}`,
        });
      } else if (error instanceof Error) {
        notification.error({
          message: "Error al obtener activos",
          description: error.message,
        });
      } else {
        notification.error({
          message: "Error inesperado",
          description: "Ocurrió un error inesperado.",
        });
      }
    } finally {
      setLoaderTable(false);
    }
  };

  const fetchMantenimientos = async () => {
    try {
      const response = await getListaMantenimientos();

      if (!response || !response.data) {
        throw new Error(
          "La respuesta de la API no tiene la estructura esperada."
        );
      }

      const mantenimenticos: dataMantenimiento[] = response.data.map((item) => {
        const fechaMantenimiento = new Date(item.fecha_mantenimiento);
        let fechaVencimiento;

        // Verificar si la fecha_fin_mantenimiento está disponible
        if (item.fecha_fin_mantenimiento) {
          fechaVencimiento = new Date(item.fecha_fin_mantenimiento);
        } else {
          // Si no hay fecha_fin_mantenimiento, se puede calcular como un año a partir de la fecha de mantenimiento
          fechaVencimiento = new Date(fechaMantenimiento);
          fechaVencimiento.setFullYear(fechaVencimiento.getFullYear() + 1);
        }


        return {
          id_activo: item.id_activo,
          activo: item.activos?.nombre,
          fecha_mantenimiento: fechaMantenimiento.toISOString().split("T")[0],
          fecha_fin_mantenimiento: fechaVencimiento.toISOString().split("T")[0],
          tipo_mantenimiento: item.tipo_mantenimiento,
          alerta:
            calcularAlerta(fechaVencimiento.toISOString().split("T")[0]) ||
            "sin alerta",
        };
      });

      setDatamantenimiento(mantenimenticos);
      setPagination({
        total: response.data.length,
        per_page: 10,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching mantenimientos data:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoaderTable(false);
    }
  };



  const calcularAlerta = (fechaVencimientoStr: string): string | null => {
    const fechaVencimiento = new Date(fechaVencimientoStr);
    const fechaActual = new Date();

    const diffTime = fechaVencimiento.getTime() - fechaActual.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 30) {
      return null;
    } else if (diffDays === 30) {
      return "Vencimiento en 1 mes";
    } else if (diffDays > 1) {
      return `Vencimiento en ${diffDays} días`;
    } else if (diffDays === 1) {
      return "Vencimiento mañana";
    } else if (diffDays < 0) {
      return "Ya vencido";
    }

    return null;
  };

  const shownNotifications = new Set<string>();

  const checkAlertsAndNotify = () => {
    const today = new Date();

    const checkAndNotify = (
      fechaVencimientoStr: string,
      nombre_activo: string,
      tipo: string
    ) => {
      if (!fechaVencimientoStr) return;

      const fechaVencimiento = new Date(fechaVencimientoStr);
      const diffTime = fechaVencimiento.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let message: string | null = null;
      const key = `${nombre_activo}-${tipo}`;

      if (diffDays > 30) {
        return;
      } else if (diffDays === 30) {
        message = `El ${tipo} de ${nombre_activo} vencerá en 1 mes`;
      } else if (diffDays > 1) {
        message = `El ${tipo} de ${nombre_activo} vencerá en ${diffDays} días`;
      } else if (diffDays === 1) {
        message = `El ${tipo} de ${nombre_activo} vencerá mañana`;
      } else if (diffDays < 0) {
        message = `El ${tipo} de ${nombre_activo} ya ha vencido`;
      }

      if (message && !shownNotifications.has(key)) {
        notification.error({
          message,
          duration: 0,
        });
        // addNotification({ message, type: "error" }); // Agrega la notificación al contexto
        shownNotifications.add(key);
      }
    };

    if (activeTabKey === "soat") {
      datasoat.forEach((item) => {
        checkAndNotify(item.fecha_vencimiento, item.nombre_activo, "SOAT");
      });
    } else if (activeTabKey === "tecno") {
      datatecno.forEach((item) => {
        checkAndNotify(
          item.fecha_vencimiento,
          item.nombre_activo,
          "Tecnomecánica"
        );
      });
    } else if (activeTabKey === "impuestosRodamiento") {
      dataImpuestosRodamiento.forEach((item) => {
        checkAndNotify(
          item.fecha_vencimiento,
          item.nombre_activo,
          "IMPUESTO DE RODAMIENTO"
        );
      });
      }
      else if (activeTabKey === "mantenimiento") {
      datamantenimiento.forEach((item) => {
        checkAndNotify(
          item.fecha_fin_mantenimiento,
          item.activo,
          "Mantenimiento"
        );
      });
    }
  };

  useEffect(() => {
    const loadAlertas = async () => {
      await obtenerAlertas();
    };

    loadAlertas();
  }, []);

  const columnsSoat: ColumnsType<dataSoat> = [
    {
      title: "ID",
      dataIndex: "id_activo",
      key: "id_activo",
      width: 100,
      align: "center",
    },
    {
      title: "Activo",
      dataIndex: "nombre_activo",
      key: "nombre_activo",
      width: 150,
    },
    {
      title: "Fecha Compra",
      dataIndex: "fecha_compra",
      key: "fecha_compra",
      width: 150,
    },
    {
      title: "Fecha Vencimiento",
      dataIndex: "fecha_vencimiento",
      key: "fecha_vencimiento",
      width: 150,
    },
    {
      title: "Alerta",
      dataIndex: "alerta",
      key: "alerta",
      width: 150,
      render: (text: string) => (
        <Tag color={text === "Ya vencido" ? "red" : "default"}>{text}</Tag>
      ),
    },
    {
      title: "Acciones",
      key: "acciones",
      align: "center",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {/* Condicional para mostrar el botón solo si el valor de "alerta" es "Ya vencido" */}
          {record.alerta === "Ya vencido" && (
            <Tooltip title="Renovar">
              <RedButton
                icon={<ReloadOutlined />}
                type="primary"
                size="small"
                onClick={() => showModal(record.id_activo, "soat")}
              />
            </Tooltip>
          )}
        </div>
      ),
    },
  ];
  const columsImpuestoRodamiento : ColumnsType<dataImpuestosRodamiento> = [
    {
      title: "ID",
      dataIndex: "id_activo",
      key: "id_activo",
      width: 100,
      align: "center",
    },
    {
      title: "Activo",
      dataIndex: "nombre_activo",
      key: "nombre_activo",
      width: 150,
    },
    {
      title: "Fecha Compra",
      dataIndex: "fecha_compra",
      key: "fecha_compra",
      width: 150,
    },
    {
      title: "Fecha Vencimiento",
      dataIndex: "fecha_vencimiento",
      key: "fecha_vencimiento",
      width: 150,
    },
    {
      title: "Alerta",
      dataIndex: "alerta",
      key: "alerta",
      width: 150,
      render: (text: string) => (
        <Tag color={text === "Ya vencido" ? "red" : "default"}>{text}</Tag>
      ),
    }
  ];

  const columnsTecno: ColumnsType<dataTecno> = [
    {
      title: "ID",
      dataIndex: "id_activo",
      key: "id_activo",
      width: 100,
      align: "center",
    },
    {
      title: "Activo",
      dataIndex: "nombre_activo",
      key: "nombre_activo",
      width: 150,
    },
    {
      title: "Fecha Compra",
      dataIndex: "fecha_compra",
      key: "fecha_compra",
      width: 150,
    },
    {
      title: "Fecha Vencimiento",
      dataIndex: "fecha_vencimiento",
      key: "fecha_vencimiento",
      width: 150,
    },
    {
      title: "Alerta",
      dataIndex: "alerta",
      key: "alerta",
      width: 150,
      render: (text: string) => (
        <Tag color={text === "Ya vencido" ? "red" : "default"}>{text}</Tag>
      ),
    },
    {
      title: "Acciones",
      key: "acciones",
      align: "center",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {/* Condicional para mostrar el botón solo si el valor de "alerta" es "Ya vencido" */}
          {record.alerta === "Ya vencido" && (
            <Tooltip title="Renovar">
              <RedButton
                icon={<ReloadOutlined />}
                type="primary"
                size="small"
                onClick={() => showModal(record.id_activo, "tecnicomecanica")}
              />
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  const columnsMantenimiento: ColumnsType<dataMantenimiento> = [
    {
      title: "ID",
      dataIndex: "id_activo",
      key: "id_activo",
      width: 100,
      align: "center",
    },
    {
      title: "Activo",
      dataIndex: "activo",
      key: "activo",
      width: 150,
    },
    {
      title: "Fecha Mantenimiento",
      dataIndex: "fecha_mantenimiento",
      key: "fecha_mantenimiento",
      width: 150,
    },
    {
      title: "Fecha Vencimiento",
      dataIndex: "fecha_fin_mantenimiento",
      key: "fecha_fin_mantenimiento",
      width: 150,
    },
    {
      title: "Tipo Mantenimiento",
      dataIndex: "tipo_mantenimiento",
      key: "tipo_mantenimiento",
      width: 150,
    },
    {
      title: "Alerta",
      dataIndex: "alerta",
      key: "alerta",
      width: 150,
      render: (text: string) => (
        <Tag color={text === "Ya vencido" ? "red" : "default"}>{text}</Tag>
      ),
    },
  ];

  const tabs: TabsProps["items"] = [
    {
      key: "soat",
      label: `SOAT`,
      children: (
        <Table
          loading={loaderTable}
          columns={columnsSoat}
          dataSource={datasoat}
          pagination={pagination}
          rowKey="id_activo"
        />
      ),
    },
    {
      key: "tecno",
      label: `Tecnomecánica`,
      children: (
        <Table
          loading={loaderTable}
          columns={columnsTecno}
          dataSource={datatecno}
          pagination={pagination}
          rowKey="id_activo"
        />
      ),
    },
    {
      key: "mantenimiento",
      label: `Mantenimiento`,
      children: (
        <Table
          loading={loaderTable}
          columns={columnsMantenimiento}
          dataSource={datamantenimiento}
          pagination={pagination}
          rowKey="id_activo"
        />
      ),
    },
    {
      key: "impuestosRodamiento",
      label: `Impuestos Rodamiento`,
      children: (
        <Table
          loading={loaderTable}
          columns={columsImpuestoRodamiento}
          dataSource={dataImpuestosRodamiento}
          pagination={pagination}
          rowKey="id_activo"
        />
      ),
    },
  ];

  return (
    <Layout>
      <StyledCard>
        <Tabs
          defaultActiveKey="soat"
          activeKey={activeTabKey}
          onChange={(key) => setActiveTabKey(key)}
          items={tabs}
        />
      </StyledCard>

      {activo && (
       <ModalRenovarParametros
       visible={modalVisible}
       onCancel={handleCancel}
       idUsuarioFijo={idUsuarioFijo}
       idActivo={activo} // Aquí pasamos el ID del activo
       tipoMantenimiento={tipoMantenimiento} // Aquí pasamos 'soat' o 'tecnomecanica'
     />
     
      )}
    </Layout>
  );
};
