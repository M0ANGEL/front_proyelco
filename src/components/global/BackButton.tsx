// components/global/BackButton.tsx
import React from "react";
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  onClick?: () => void;
  to?: string;
  text?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  to,
  text = "Volver",
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button
      type="default"
      icon={<ArrowLeftOutlined />}
      onClick={handleClick}
      style={{
        borderRadius: 8, // está bien
        backgroundColor: "#f5222d", // si quieres rojo
        borderColor: "#f5222d",
        color: "white",
        margin: "10px 30px"
      }}
    >
      {text}
    </Button>
  );
};
