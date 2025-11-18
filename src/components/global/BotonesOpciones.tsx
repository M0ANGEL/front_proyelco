import React from "react";
import { Button, Space, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  StopOutlined,
  CheckOutlined,
  PlusOutlined,
} from "@ant-design/icons";

interface BotonAccion {
  tipo:
    | "editar"
    | "eliminar"
    | "ver"
    | "inactivar"
    | "activar"
    | "crear"
    | "custom";
  label?: string; // Texto opcional debajo o tooltip
  onClick: () => void;
  iconoPersonalizado?: React.ReactNode;
  color?: "default" | "primary" | "danger" | "success" | "warning";
  disabled?: boolean;
}

interface BotonesOpcionesProps {
  botones: BotonAccion[];
  espacio?: number;
  size?: "small" | "middle" | "large";
  soloIconos?: boolean;
  alineacion?: "start" | "center" | "end";
}

export const BotonesOpciones: React.FC<BotonesOpcionesProps> = ({
  botones,
  espacio = 8,
  size = "middle",
  soloIconos = true,
  alineacion = "center",
}) => {
  const getIcon = (tipo: string) => {
    switch (tipo) {
      case "editar":
        return <EditOutlined />;
      case "eliminar":
        return <DeleteOutlined />;
      case "ver":
        return <EyeOutlined />;
      case "inactivar":
        return <StopOutlined />;
      case "activar":
        return <CheckOutlined />;
      case "crear":
        return <PlusOutlined />;
      default:
        return null;
    }
  };

  const getButtonType = (tipo: string): "primary" | "default" | "dashed" => {
    switch (tipo) {
      case "editar":
      case "ver":
      case "activar":
      case "inactivar":
        return "primary";
      case "eliminar":
        return "dashed";
      default:
        return "default";
    }
  };

  return (
    <Space
      size={espacio}
      align="center"
      style={{
        justifyContent:
          alineacion === "center"
            ? "center"
            : alineacion === "end"
            ? "flex-end"
            : "flex-start",
        width: "100%",
        flexWrap: "wrap",
      }}
    >
      {botones.map((btn, index) => {
        const icono = btn.iconoPersonalizado || getIcon(btn.tipo);
        const tipo = getButtonType(btn.tipo);

        const button = (
          <Button
            key={index}
            type={tipo}
            danger={btn.tipo === "eliminar"}
            icon={icono}
            onClick={btn.onClick}
            size={size}
            disabled={btn.disabled}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              fontWeight: 500,
            }}
          >
            {!soloIconos && btn.label?.toUpperCase()}
          </Button>
        );

        return btn.label && soloIconos ? (
          <Tooltip key={index} title={btn.label.toUpperCase()}>
            {button}
          </Tooltip>
        ) : (
          button
        );
      })}
    </Space>
  );
};
