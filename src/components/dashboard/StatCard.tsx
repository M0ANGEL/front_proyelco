import React from 'react';
import { Card, Typography, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  loading?: boolean;
  route?: string;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  loading = false,
  route,
  description
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (route && value > 0) {
      navigate(route);
    }
  };

  return (
    <Card
      hoverable={!!route && value > 0}
      onClick={handleClick}
      style={{
        height: '140px',
        border: `1px solid ${color}20`,
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        cursor: route && value > 0 ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        background: `linear-gradient(135deg, ${color}10, ${color}05)`,
      }}
      bodyStyle={{
        padding: '20px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <Text type="secondary" style={{ fontSize: '14px', fontWeight: 500 }}>
            {title}
          </Text>
          {loading ? (
            <div style={{ marginTop: '8px' }}>
              <Spin size="small" />
            </div>
          ) : (
            <Title level={2} style={{ margin: '8px 0 0 0', color: color, fontSize: '32px' }}>
              {value.toLocaleString()}
            </Title>
          )}
          {description && (
            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '4px' }}>
              {description}
            </Text>
          )}
        </div>
        <div
          style={{
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: `${color}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {React.cloneElement(icon as React.ReactElement, { 
            style: { fontSize: '24px', color: color } 
          })}
        </div>
      </div>
      
      {route && value > 0 && (
        <div style={{ 
          marginTop: '8px', 
          fontSize: '12px', 
          color: color,
          fontWeight: 500 
        }}>
          👆 Click para ver detalles
        </div>
      )}
    </Card>
  );
};

export default StatCard;