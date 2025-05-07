/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar, Typography, Space, MenuProps, Dropdown, Skeleton } from "antd";
import { AvatarColors } from "../../layout/DashboardLayout/constants";
import { CustomSpaceDescription } from "./styled";
import { generarNumeroAleatorio, obtenerIniciales } from "./utils";
import useToken from "../../hooks/useToken";
import { Link, useNavigate } from "react-router-dom";
import { AuthRoutesList } from "@/modules/auth";
import { UserData } from "@/services/types";
import { logout } from "@/services/auth/authAPI";
import { Notification } from "@/modules/auth/pages/LoginPage/types";
import { useEffect, useState } from "react";
import { FILES_URL, KEY_EMPRESA } from "@/config/api";
import { CaretDownOutlined } from "@ant-design/icons";
import { BodegasxUsuario } from "@/modules/admin-usuarios/pages/usuarios/types";
import { useScreenSize } from "../../hooks/useScreenSize";
import useSessionStorage from "../../hooks/useSessionStorage";

const { Text } = Typography;

interface props {
  user?: UserData;
  bodega?: BodegasxUsuario;
  loader: boolean;
  onFetchLogout: (value: boolean) => void;
  onPushNotification: (data: Notification) => void;
}

export const CustomAvatarDescription = ({
  user,
  bodega,
  loader,
  onFetchLogout,
  onPushNotification,
}: props) => {
  const { removeToken } = useToken();
  const navigate = useNavigate();
  const [showText, setShowText] = useState(false);
  const { width } = useScreenSize();
  const [shotName, setShowName] = useState<boolean>(true);
    const { getSessionVariable } = useSessionStorage();
  
      const empresaId = getSessionVariable(KEY_EMPRESA);
  

  useEffect(() => {
    setShowText(true);
  }, []);

  useEffect(() => {
    if (width <= 680) {
      setShowName(false);
    } else {
      setShowName(true);
    }
  }, [width]);

  useEffect(() => {
    if ((user && !bodega) || (bodega && bodega.estado == "0")) {
      onFetchLogout(true);
      onPushNotification({
        type: "warning",
        description:
          "Se cerrará la sesión ya que no posees acceso a esta bodega o se encuentra inactiva.",
      });
      setTimeout(() => {
        onLogout();
      }, 1500);
    }
  }, [bodega]);

  const onLogout = () => {
    onFetchLogout(true);
    logout()
      .then(({ data }) => {
        removeToken();
        onPushNotification({
          type: "success",
          title: data,
          description: "En un momento seras redirigido al login!",
        });
        setTimeout(() => {
          navigate(`/${AuthRoutesList.AUTH}/${AuthRoutesList.LOGIN}`);
        }, 1700);
      })
      .catch((error) => {
        onFetchLogout(false);
        onPushNotification({
          type: "error",
          title: error.code,
          description: error.message,
        });
      });
  };

  const items: MenuProps["items"] = [
    {
      label: (
        <Link title="Perfil" to="dashboard/perfil">
          Perfil
        </Link>
      ),
      key: "0",
    },
    {
      label: <a onClick={() => onLogout()}>Logout</a>,
      key: "1",
    },
  ];

  return (
    <>
      <Dropdown menu={{ items }} trigger={["click"]}>
        <a
          onClick={(e) => e.preventDefault()}
          style={{ color: "black", lineHeight: 1, marginTop: 12 }}
        >
          <Space
            direction="horizontal"
            align="center"
            style={{ lineHeight: 1, columnGap: 5 }}
          >
            <CustomSpaceDescription
              direction="vertical"
              style={{ textAlign: "end", columnGap: 1 }}
            >
              {!loader || showText ? (
                <>
                  {shotName ? <Text>{user?.nombre}</Text> : null}

                  <Text strong keyboard>
                    {"Bodega: " + bodega?.bodega.bod_nombre}
                  </Text>
                </>
              ) : (
                <>
                  <Skeleton.Input active size="small" />
                </>
              )}
            </CustomSpaceDescription>
            {!loader || showText ? (
              <>
                {!user?.image.includes("default") ? (
                  <Avatar src={`${FILES_URL}${user?.image}`}></Avatar>
                ) : (
                  <Avatar
                    style={{
                      backgroundColor:
                        AvatarColors[
                          generarNumeroAleatorio(parseInt(user.cedula))
                        ],
                    }}
                  >
                    {obtenerIniciales(user?.nombre)}
                  </Avatar>
                )}
              </>
            ) : (
              <Skeleton.Avatar active />
            )}
            <CaretDownOutlined style={{ color: "#747474" }} />
          </Space>
        </a>
      </Dropdown>
    </>
  );
};
