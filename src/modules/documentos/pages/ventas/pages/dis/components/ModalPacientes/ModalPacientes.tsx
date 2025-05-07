import { Button, Col, Modal, Row, Table } from "antd";
import { Props } from "./types";
import { ColumnsType } from "antd/es/table";
import { Paciente } from "@/services/types";

export const ModalPacientes = ({
  pacientes,
  open,
  setOpen,
  setPaciente,
}: Props) => {
  const columns: ColumnsType<Paciente> = [
    {
      key: "tipo_documento",
      dataIndex: "tipo_identificacion",
      title: "Tipo Documento",
      width: 60,
      align: "center",
    },
    {
      key: "numero_identificacion",
      dataIndex: "numero_identificacion",
      title: "Número Identificación",
      width: 120,
      align: "center",
    },
    {
      key: "nombre",
      dataIndex: "nombre",
      title: "Nombre Paciente",
      render(
        _,
        { nombre_primero, nombre_segundo, apellido_primero, apellido_segundo }
      ) {
        return `${nombre_primero} ${
          ["null", ".", null].includes(nombre_segundo) ? "" : nombre_segundo
        } ${apellido_primero} ${
          ["null", ".", null].includes(apellido_segundo) ? "" : apellido_segundo
        }`;
      },
    },
    {
      key: "acciones",
      width: 60,
      align: "center",
      render(_, record) {
        return (
          <>
            <Button
              type="primary"
              size="small"
              onClick={() => {
                setPaciente(record);
                setOpen(false);
              }}
            >
              Seleccionar
            </Button>
          </>
        );
      },
    },
  ];
  return (
    <Modal
      title={`Coincidencias de número de identifiación digitado`}
      open={open}
      footer={[]}
      onCancel={() => {
        setOpen(false);
        setPaciente(undefined);
      }}
      destroyOnClose={true}
      width={700}
    >
      <Row gutter={[12, 12]}>
        <Col span={24}></Col>
        <Col span={24}>
          <Table
            rowKey={(record) => record.id}
            columns={columns}
            dataSource={pacientes}
            size="small"
            pagination={false}
          />
        </Col>
      </Row>
    </Modal>
  );
};
