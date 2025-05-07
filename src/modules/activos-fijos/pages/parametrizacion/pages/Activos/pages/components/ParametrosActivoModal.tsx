import React, { } from 'react';
import { Modal, Table} from 'antd';
import { Datos } from '@/services/types';
import { ColumnsType } from 'antd/es/table';


interface ModalTableProps {
  open: boolean;
  onClose: () => void;
  datos: Datos[];
}


export const ParametrosActivoModal: React.FC<ModalTableProps> = ({ open, onClose, datos }) => {
    const columns: ColumnsType<Datos> = [  
    {
      title: 'Parametro',
      dataIndex: 'parametro',
      key: 'parametro',
      render: (
        _,
        {
            parametro_sub_categoria:{
                parametro: {descripcion}
             },
        }
      ) => <span> {descripcion} </span>,

    },
    {
      title: 'Valor Almacenado',
      dataIndex: 'valor_almacenado',
      key: 'valor_almacenado',
    },
  ];

  return (
    <Modal
      title="Detalles del Activo"
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <Table
        columns={columns}
        dataSource={datos}
        rowKey="id"
      />
    </Modal>
  );
};

export default ParametrosActivoModal;
