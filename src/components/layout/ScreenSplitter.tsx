import React, { useState } from 'react';
import { Button, Tooltip, Modal, Card, Row, Col } from 'antd';
import { 
  SplitCellsOutlined, 
  LeftOutlined, 
  RightOutlined, 
  CloseOutlined,
  AppstoreOutlined
} from '@ant-design/icons';

interface ScreenSplitterProps {
  onSideSelect: (side: 'left' | 'right' | 'none') => void;
  currentSide: 'left' | 'right' | 'none';
}

const ScreenSplitter: React.FC<ScreenSplitterProps> = ({ onSideSelect, currentSide }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSideSelect = (side: 'left' | 'right' | 'none') => {
    onSideSelect(side);
    setIsModalVisible(false);
  };

  return (
    <>
      {/* Botón flotante centrado */}
      <div style={{
        position: 'fixed',
        top: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '8px 16px',
        borderRadius: '20px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        border: '1px solid #d9d9d9'
      }}>
        <Tooltip title="Dividir pantalla">
          <Button
            type="primary"
            icon={<SplitCellsOutlined />}
            onClick={showModal}
            size="small"
            style={{
              borderRadius: '50%',
              width: '32px',
              height: '32px'
            }}
          />
        </Tooltip>
        
        {/* Indicador del lado activo */}
        {currentSide !== 'none' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '12px', color: '#666' }}>
              {currentSide === 'left' ? 'Lado Izquierdo' : 'Lado Derecho'}
            </span>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => handleSideSelect('none')}
              size="small"
              style={{ width: '24px', height: '24px' }}
            />
          </div>
        )}
      </div>

      {/* Modal de selección */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SplitCellsOutlined />
            <span>Dividir Pantalla</span>
          </div>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={400}
      >
        <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
          <Col span={12}>
            <Card
              hoverable
              style={{
                border: currentSide === 'left' ? '2px solid #1890ff' : '1px solid #d9d9d9',
                textAlign: 'center'
              }}
              onClick={() => handleSideSelect('left')}
            >
              <LeftOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }} />
              <div style={{ fontWeight: 'bold' }}>Lado Izquierdo</div>
              <div style={{ fontSize: '12px', color: '#666' }}>Seleccionar componente</div>
            </Card>
          </Col>
          
          <Col span={12}>
            <Card
              hoverable
              style={{
                border: currentSide === 'right' ? '2px solid #52c41a' : '1px solid #d9d9d9',
                textAlign: 'center'
              }}
              onClick={() => handleSideSelect('right')}
            >
              <RightOutlined style={{ fontSize: '24px', color: '#52c41a', marginBottom: '8px' }} />
              <div style={{ fontWeight: 'bold' }}>Lado Derecho</div>
              <div style={{ fontSize: '12px', color: '#666' }}>Seleccionar componente</div>
            </Card>
          </Col>
          
          <Col span={24}>
            <Card
              hoverable
              style={{
                border: currentSide === 'none' ? '2px solid #ff4d4f' : '1px solid #d9d9d9',
                textAlign: 'center'
              }}
              onClick={() => handleSideSelect('none')}
            >
              <CloseOutlined style={{ fontSize: '24px', color: '#ff4d4f', marginBottom: '8px' }} />
              <div style={{ fontWeight: 'bold' }}>Vista Normal</div>
              <div style={{ fontSize: '12px', color: '#666' }}>Sin división</div>
            </Card>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default ScreenSplitter;