import React, { useState } from "react";
import { Avatar, Dropdown, MenuProps, Image } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  UserSwitchOutlined,
  KeyOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { User } from "../../types/auth.types";
import { FILES_URL } from "@/config/api";

interface UserAvatarProps {
  user: User | null;
  size?: number;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = 32 }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Obtener la URL de la imagen del usuario
  const getAvatarSrc = () => {
    if (!user?.image) return null;

    // Si la imagen es "default" o hay error, mostrar iniciales
    if (user.image.includes("default") || imageError) {
      return null;
    }

    // Construir la URL completa de la imagen
    return `${FILES_URL}${user.image}`;
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    const names = name.trim().split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    if (!name) return "#1890ff";
    const colors = [
      "#f56a00",
      "#7265e6",
      "#ffbf00",
      "#00a2ae",
      "#87d068",
      "#108ee9",
      "#eb2f96",
      "#fa541c",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      setLoggingOut(false);
      console.error("Error cerrando sesión", err);
    }
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserSwitchOutlined />,
      label: "Mi Perfil",
      onClick: () => navigate("/profile"),
    },
    {
      key: "change-password",
      icon: <KeyOutlined />,
      label: "Cambiar Contraseña",
      onClick: () => navigate("/profile"),
    },
    { type: "divider" },
    {
      key: "logout",
      icon: loggingOut ? <LoadingOutlined spin /> : <LogoutOutlined />,
      label: loggingOut ? "Cerrando sesión..." : "Cerrar Sesión",
      onClick: handleLogout,
      danger: true,
      disabled: loggingOut,
    },
  ];

  // Si no hay usuario, mostrar avatar por defecto
  if (!user) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
        }}
      >
        <Avatar
          size={size}
          icon={<UserOutlined />}
          style={{
            backgroundColor: "#ffffff",
            color: "#666666",
            border: "2px solid #f0f0f0",
          }}
        />
        <span style={{ color: "#fff", fontWeight: "bold" }}>Usuario</span>
      </div>
    );
  }

  const avatarSrc = getAvatarSrc();

  // Renderizar el avatar
  const renderAvatar = () => {
    if (loggingOut) {
      return (
        <Avatar
          size={size}
          style={{
            backgroundColor: "#ffffff",
            color: "#1890ff",
            verticalAlign: "middle",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          icon={<LoadingOutlined spin />}
        />
      );
    }

    if (avatarSrc) {
      return (
        <Avatar
          size={size}
          src={
            <Image
              src={avatarSrc}
              alt={user.nombre}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
              }}
              preview={false}
              onError={() => setImageError(true)}
              fallback={
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: getAvatarColor(user.nombre),
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: size * 0.4,
                  }}
                >
                  {getInitials(user.nombre)}
                </div>
              }
            />
          }
          style={{
            verticalAlign: "middle",
            backgroundColor: "#ffffff",
            border: "2px solid #f0f0f0",
          }}
        />
      );
    }

    // Mostrar iniciales si no hay imagen o hubo error
    return (
      <Avatar
        size={size}
        style={{
          backgroundColor: getAvatarColor(user.nombre),
          verticalAlign: "middle",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          fontSize: size * 0.4,
          color: "#ffffff",
          border: "2px solid #ffffff",
        }}
      >
        {getInitials(user.nombre)}
      </Avatar>
    );
  };

  const userDisplay = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        cursor: loggingOut ? "not-allowed" : "pointer",
        padding: "4px 8px",
        borderRadius: "6px",
        transition: "all 0.3s ease",
        opacity: loggingOut ? 0.7 : 1,
      }}
      onMouseEnter={(e) => {
        if (!loggingOut) {
          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      {renderAvatar()}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span
          style={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: "14px",
            lineHeight: "1.2",
            opacity: loggingOut ? 0.7 : 1,
          }}
        >
          {user.nombre.split(" ")[0]}
        </span>
        <span
          style={{
            color: "rgba(255,255,255,0.8)",
            fontSize: "12px",
            lineHeight: "1.2",
            opacity: loggingOut ? 0.7 : 1,
          }}
        >
          {user.rol}
        </span>
      </div>
    </div>
  );

  return (
    <Dropdown
      menu={{ items: userMenuItems }}
      placement="bottomRight"
      trigger={["click"]}
      disabled={loggingOut}
    >
      {userDisplay}
    </Dropdown>
  );
};

export default UserAvatar;
