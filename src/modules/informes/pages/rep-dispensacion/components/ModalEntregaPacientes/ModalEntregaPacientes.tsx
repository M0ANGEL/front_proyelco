/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getEntregaPacientes } from "@/services/informes/reportesAPI";
import { FilterDropdownProps } from "antd/es/table/interface";
import { useEffect, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { DataType } from "./types";
import { Props } from "./types";
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

export const ModalEntregaPacientes = ({ open, setOpen, data }: Props) => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loaderTable, setLoaderTable] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const searchInput = useRef<InputRef>(null);

  useEffect(() => {
    setLoaderTable(true);
    if (open) {
      getEntregaPacientes(data)
        .then(({ data: { data } }) => {
          const responseData = data.length == 0;
          if (responseData) {
            notificationApi.open({
              type: "warning",
              message: `No hay Datos En su Busqueda!`,
            });
          }

          const paciente: DataType[] = data.map((item: any) => {
            return {
              key: item.key,
              producto_id: item.producto_id,
              descripcion: item.descripcion,
              lote: item.lote,
              fecha_vencimiento: item.fecha_vencimiento,
              cantidad: item.cantidad,
              consecutivo: item.consecutivo,
              fecha_entrega: item.fecha_entrega,
              paciente_id: item.paciente_id,
              paciente_nombre: item.paciente_nombre,
              paciente_apellido: item.paciente_apellido,
              paciente_telefono: item.paciente_telefono,
              paciente_direccion: item.paciente_direccion,
              paciente_email: item.paciente_email,
              paciente_dni: item.paciente_dni,
              paciente_ocupacion: item.paciente_ocupacion,
              producto_descripcion: item.producto_descripcion,
              numero_identificacion: item.numero_identificacion,
              nombre_primero: item.nombre_primero,
              nombre_segundo: item.nombre_segundo,
              apellido_primero: item.apellido_primero,
              apellido_segundo: item.apellido_segundo,
              bod_nombre: item.bod_nombre,
              cantidad_entregada: item.cantidad_entregada,
              created_at: item.created_at,
              autorizacion_cabecera: item.autorizacion_cabecera,
              observacion: item.observacion ?? "",
            };
          });
          setDataSource(paciente);
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

  const columns: any = [
    {
      title: "Producto",
      key: "index",
      dataIndex: "producto_id",
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
      title: "Lote",
      key: "lote",
      dataIndex: "lote",
      width: 90,
      ...getColumnSearchProps("lote"),
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
      key: "cantidad_entregada",
      dataIndex: "cantidad_entregada",
      align: "center",
      width: 70,
    },
    {
      title: "Consecutivo",
      key: "consecutivo",
      dataIndex: "consecutivo",
      width: 100,
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
      title: "Codigo Paciente",
      key: "numero_identificacion",
      dataIndex: "numero_identificacion",
      width: 90,
    },
    {
      title: "Nombre Paciente",
      key: "nombre_primero",
      dataIndex: "nombre_primero",
      render: (_: any, record: any) => {
        return `${record.nombre_primero} ${record.nombre_segundo} ${record.apellido_primero} ${record.apellido_segundo}`;
      },
    },
    {
      title: "Bodega",
      key: "bod_nombre",
      dataIndex: "bod_nombre",
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
              scroll={{ x: 1000, y: 600 }}
              size="small"
              dataSource={dataSource}
              loading={loaderTable}
              columns={columns}
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};
