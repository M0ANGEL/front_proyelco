import { Button, Tooltip } from 'antd';
import { UpOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.round((position / totalHeight) * 100));
        setScrollProgress(progress);
      }
      
      setIsVisible(position > 300);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        right: 24,
        bottom: 24,
        zIndex: 9999,
        animation: 'slideIn 0.3s ease-out'
      }}
    >
      <Tooltip 
        title={`Subir al inicio (${scrollProgress}% bajado)`}
        placement="left"
        color="#1890ff"
      >
        <Button
          type="primary"
          shape="circle"
          size="large"
          icon={<UpOutlined />}
          onClick={scrollToTop}
          style={{
            width: 56,
            height: 56,
            background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
            border: 'none',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}
        />
      </Tooltip>
      
      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default ScrollToTopButton;