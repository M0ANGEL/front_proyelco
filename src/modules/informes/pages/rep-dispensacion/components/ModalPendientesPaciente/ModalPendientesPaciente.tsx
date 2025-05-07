/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnsType, FilterDropdownProps } from "antd/es/table/interface";
import { getPendientesPacientes } from "@/services/informes/reportesAPI";
import { useEffect, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { DataType } from "./types";
import { Props } from "./types";
import dayjs from "dayjs";
import {
  TableColumnType,
  notification,
  InputRef,
  Button,
  Input,
  Modal,
  Space,
  Table,
  Col,
  Row,
} from "antd";

export const ModalPendientesPaciente = ({ open, setOpen, data }: Props) => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loaderTable, setLoaderTable] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const searchInput = useRef<InputRef>(null);

  useEffect(() => {
    setLoaderTable(true);
    if (open) {
      data.fechas_rango = [
        dayjs(data.fechas_rango[0]).format("YYYY-MM-DD"),
        dayjs(data.fechas_rango[1]).format("YYYY-MM-DD"),
      ];
      getPendientesPacientes(data)
        .then(({ data: { data } }) => {
          const responseData = data.length == 0;
          if (responseData) {
            notificationApi.open({
              type: "warning",
              message: `No hay Datos En su Busqueda!`,
            });
          }

          const datos: DataType[] = data.map((item: any) => {
            return {
              key: item.id,
              apellido_primero: item.apellido_primero,
              apellido_segundo: item.apellido_segundo,
              autorizacion_cabecera: item.autorizacion_cabecera,
              bod_nombre: item.bod_nombre,
              cantidad_saldo: item.cantidad_saldo,
              cantidad_pagada: item.cantidad_pagada,
              cantidad_pendiente:
                parseInt(item.cantidad_saldo) - parseInt(item.cantidad_pagada),
              consecutivo: item.consecutivo,
              created_at: dayjs(item.created_at).format("YYYY-MM-DD HH:mm:ss"),
              descripcion: item.descripcion,
              nombre_primero: item.nombre_primero,
              nombre_segundo: item.nombre_segundo,
              observacion: item.observacion ?? "",
              producto_id: item.producto_id,
              estado: item.estado,
            };
          });
          setDataSource(datos);
          setLoaderTable(false);
        })
        .catch(({ response: { data } }) => {
          notificationApi.open({
            type: "error",
            message: data,
          });
          setOpen(false);
        })
        .finally(() => setLoaderTable(false));
    }
  }, [open]);

  type DataIndex = keyof DataType;

  const handleSearch = (confirm: FilterDropdownProps["confirm"]) => {
    confirm();
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(confirm)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(confirm)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              clearFilters && handleReset(clearFilters);
              handleSearch(confirm);
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const columns: ColumnsType<DataType> = [
    {
      title: "Producto",
      key: "index",
      dataIndex: "producto_id",
      align: "center",
      width: 80,
      ...getColumnSearchProps("producto_id"),
    },
    {
      title: "Autorizacion",
      key: "autorizacion_cabecera",
      dataIndex: "autorizacion_cabecera",
      width: 110,
    },
    {
      title: "Observación",
      key: "observacion",
      dataIndex: "observacion",
      width: 110,
      ...getColumnSearchProps("observacion"),
    },
    {
      title: "Descripción",
      key: "descripcion",
      dataIndex: "descripcion",
      width: 200,
      ...getColumnSearchProps("descripcion"),
    },
    {
      title: "Cantidad",
      key: "cantidad_saldo",
      dataIndex: "cantidad_saldo",
      align: "center",
      width: 80,
    },
    {
      title: "Cant. Pagada",
      key: "cantidad_pagada",
      dataIndex: "cantidad_pagada",
      align: "center",
      width: 80,
    },
    {
      title: "Cant. Pendiente",
      key: "cantidad_pendiente",
      dataIndex: "cantidad_pendiente",
      align: "center",
      width: 80,
    },
    {
      title: "Estado",
      key: "estado",
      dataIndex: "estado",
      align: "center",
      width: 100,
      ...getColumnSearchProps("estado"),
    },
    {
      title: "Consecutivo",
      key: "consecutivo",
      dataIndex: "consecutivo",
      width: 100,
      align: "center",
      ...getColumnSearchProps("consecutivo"),
    },
    {
      title: "Fecha",
      key: "created_at",
      dataIndex: "created_at",
      width: 90,
      sorter: (a: any, b: any) => a.created_at.localeCompare(b.created_at),

      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Nombre Paciente",
      key: "nombre_primero",
      dataIndex: "nombre_primero",
      render: (
        _,
        { nombre_primero, nombre_segundo, apellido_primero, apellido_segundo }
      ) => {
        return `${nombre_primero} ${nombre_segundo} ${apellido_primero} ${apellido_segundo}`;
      },
    },
    {
      title: "Bodega",
      key: "bod_nombre",
      dataIndex: "bod_nombre",
      align: "center",
    },
  ];

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        footer={[]}
        destroyOnClose
        style={{ top: 10 }}
        onCancel={() => {
          setOpen(false);
          setDataSource([]);
        }}
        width={1200}
      >
        <Row gutter={[12, 12]} style={{ marginTop: 30 }}>
          <Col span={24}>
            <Table
              scroll={{ x: 1280, y: 600 }}
              size="small"
              dataSource={dataSource}
              loading={loaderTable}
              columns={columns}
              pagination={{ hideOnSinglePage: true }}
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};
