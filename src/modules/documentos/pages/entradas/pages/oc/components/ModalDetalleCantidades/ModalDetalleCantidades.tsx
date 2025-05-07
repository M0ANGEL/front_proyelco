/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Switch,
  Tooltip,
  Typography,
} from "antd";
import { TagOutlined } from "@ant-design/icons";
import { DataType, Props } from "./types";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Table, { ColumnsType } from "antd/es/table";
import { SearchBar } from "./styled";

const { Text } = Typography;

export const ModalDetalleCantidad = ({
  detalle,
  ordenes,
  estado_cantidades,
  RQPID,
  openDetalle,
  setOpenDetalle,
}: Props) => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const location = useLocation();
  useEffect(() => {
    const detalleCantidades: DataType[] = detalle.map((item, index) => {
      let cantidadOC = 0;
      ordenes
        .filter((orden) => !["3", "4"].includes(orden.estado))
        .forEach((ordencompra) => {
          ordencompra.detalle.forEach((oc_detalle) => {
            if (
              oc_detalle.producto_id === item.producto_id ||
              oc_detalle.producto.cod_padre == item.producto.cod_padre
            ) {
              cantidadOC += parseInt(oc_detalle.cantidad);
            }
          });
        });
      return {
        id_producto: item.producto_id,
        descripcion_producto: item.producto.descripcion,
        cantidad: parseInt(item.cantidad),
        cantidadOC,
        estado_cantidades,
        RQPID: RQPID ? RQPID : "",
        key: index,
      };
    });
    setDataSource(detalleCantidades);
    setInitialData(detalleCantidades);
  }, [detalle, ordenes, estado_cantidades, RQPID]);

  const columnsDetalle: ColumnsType<DataType> = [
    {
      title: "ID",
      dataIndex: "id_producto",
      key: "id_producto",
    },
    {
      title: "Descripción",
      dataIndex: "descripcion_producto",
      key: "descripcion_producto",
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
      width: 140,
      render: (_, { cantidad, cantidadOC }) => {
        return (
          <>
            <Space direction="vertical">
              <Text>Requerida: {cantidad}</Text>
              <Text type={cantidadOC < cantidad ? "danger" : "success"}>
                Pedida: {cantidadOC}
              </Text>
            </Space>
          </>
        );
      },
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      fixed: "right",
      width: 70,
      render: (_, { RQPID }) => {
        return (
          <Tooltip title="Crear OC">
            <Link to={`${location.pathname}/create/${RQPID}`}>
              <Button type="primary" key={RQPID + "crear_modal"} size="small">
                <TagOutlined />
              </Button>
            </Link>
          </Tooltip>
        );
      },
    },
  ];

  const handleSearchDetalleCant = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const filterTable = initialData?.filter((o: any) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setDataSource(filterTable);
  };

  const onChangeSwitch = (checked: boolean) => {
    if (checked) {
      setDataSource(
        dataSource.filter((item) => item.cantidad > item.cantidadOC)
      );
    } else {
      setDataSource(initialData);
    }
  };

  return (
    <>
      <Modal
        title="Detalle cantidades"
        keyboard
        footer={[
          <Button danger type="primary" onClick={() => setOpenDetalle(false)}>
            Cerrar
          </Button>,
        ]}
        width={1200}
        style={{ top: 20 }}
        open={openDetalle}
        onCancel={() => setOpenDetalle(false)}
        key={"modalcantidades"}
      >
        <Row>
          <Col span={24}>
            <SearchBar>
              <Input placeholder="Buscar" onChange={handleSearchDetalleCant} />
            </SearchBar>
          </Col>
          <Col span={24}>
            <Form>
              <Form.Item
                label="Ver productos con cantidades pendientes:"
                style={{ marginBottom: 10 }}
              >
                <Switch size="small" onChange={onChangeSwitch} />
              </Form.Item>
            </Form>
          </Col>
          <Col span={24}>
            <Table
              size={"small"}
              columns={columnsDetalle}
              dataSource={dataSource == null ? initialData : dataSource}
              pagination={{ simple: false, pageSize: 10 }}
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};
