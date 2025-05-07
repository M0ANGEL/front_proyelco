/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
  import {
    notification,
    Tabs,
    Layout,
  } from "antd";
  import Table, { ColumnsType } from "antd/es/table";
  import { useState, useEffect } from "react";
  import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
  import dayjs from "dayjs";
  import { getListaTrasladosActivosPorBodegaYEstado } from "@/services/activos/trasladosActivosAPI";
import { KEY_BODEGA } from "@/config/api";
import { Content } from "antd/es/layout/layout";
import { DataType } from "./type";
  
  
  export const ListTrasladosActivosEntrada = () => {
    const [notificationApi, contextHolder] = notification.useNotification();
    const [, setLoaderTable] = useState<boolean>(true);
    const [, setPagination] = useState<{ total: number; per_page: number }>();
    const { getSessionVariable } = useSessionStorage();
    const [dataSource, setDataSource] = useState<DataType[]>([]);


    // let timeout: ReturnType<typeof setTimeout> | null;


  
  
    useEffect(() => {
      fetchDocumentos();
    }, []);
  
  

    
    const fetchDocumentos = () => {
      const bodega = getSessionVariable(KEY_BODEGA);
      const bodegaN = Number(bodega);
      const estado = "cerrado";

  
      getListaTrasladosActivosPorBodegaYEstado(estado, bodegaN)
          .then((response) => {
              const traslados = response.data;
  
              const documentos: DataType[] = traslados.map((item) => {
                  return {
                      key: item.id,
                      nombre_Activo: item.activo.nombre,
                      bodega_origen: item.bodega_origen_info?.bod_nombre, // Accede a la información de la bodega origen
                      bodega_destino: item.bodega_destino_info?.bod_nombre, // Accede a la información de la bodega destino
                      id_activo: item.id_activo,
                      fecha_traslado: new Date(item.fecha_traslado), 
                      estado: item.estado,
                      fecha_recibido: item.fecha_recibido ? new Date(item.fecha_recibido) : new Date(),
                      descripcion: item.descripcion,
                      user_origen: item.user_origen_info?.nombre,
                      user_destino: item.user_destino_info?.nombre,
                  };

              });
  
              setDataSource(documentos);

              setPagination({
                  total: traslados.length,
                  per_page: 10,
              });
          })
          .catch((error) => {
              const response = error.response;
              const errors = response?.data?.errors;
              if (errors) {
                  const errores: string[] = Object.values(errors);
                  for (const error of errores) {
                      notificationApi.open({
                          type: "error",
                          message: error,
                          duration: 4,
                      });
                  }
              } else {
                  notificationApi.open({
                      type: "error",
                      message: response.data.message,
                      duration: 4,
                  });
              }
          })
          .finally(() => {
              setLoaderTable(false);
          });
  };
  
  
  

  
  
    const columns: ColumnsType<DataType> = [
      {
        title: "traslado Act Salida ",
        dataIndex: "key",
        key: "key",
        sorter: true,
        align: "center",
        fixed: "left",
        width: 120,
      },
      {
        title: "Activo",
        dataIndex: "nombre_Activo",
        key: "nombre_Activo",
      },
      {
        title: "Fecha Traslado",
        dataIndex: "fecha_traslado",
        key: "fecha_traslado",
        sorter: (a, b) => a.fecha_traslado.getTime() - b.fecha_traslado.getTime(), // Usar getTime para comparación
        render: (date: Date) => dayjs(date).format("YYYY-MM-DD"), // Convertir de vue
      },
      {
        title: "Fecha Aceptado",
        dataIndex: "fecha_recibido",
        key: "fecha_recibido",
        sorter: (a, b) => a.fecha_traslado.getTime() - b.fecha_traslado.getTime(), // Usar getTime para comparación
        render: (date: Date) => dayjs(date).format("YYYY-MM-DD"), // Convertir de vue
      },
      {
        title: "Sede Origen",
        dataIndex: "bodega_origen",
        key: "bodega_origen",
      },
      {
        title: "Sede Destino",
        dataIndex: "bodega_destino",
        key: "bodega_destino", 
      },
      {
        title: "Usuario Elaboró",
        dataIndex: "user_origen",
        key: "user_origen",
      },
      {
        title: "Usuario Recibio",
        dataIndex: "user_destino",
        key: "user_destino",
      },
      {
        title: "Estado",
        dataIndex: "estado",
        key: "estado",
      },
      {
        title: "Descripcion",
        dataIndex: "descripcion",
        key: "descripcion",
      }
    ];
  
    
    return (
        <Layout style={{ minHeight: '100vh' }}>
      <Layout>
          <Content style={{ padding: '20px' }}>
            {contextHolder}
            <Tabs
              items={[
                {
                  key: "1",
                  label: "Traslados Entrada / Recibidos",
                  children: (
                    <Table 
                      columns={columns} 
                      dataSource={dataSource} 
                      scroll={{ x: 'max-content' }} 
                    />
                  ),
                },
              ]}
              animated
            />
          </Content>
        </Layout>
      </Layout>
    );
  };
  