/* eslint-disable react-hooks/exhaustive-deps */
import { ConfigProvider, Layout, Modal, Space, Spin, notification } from "antd";
import { LoadingOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { CustomAvatarDescription, CustomMenu } from "../../components";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { fetchUserProfile, logout } from "@/services/auth/authAPI";
import { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";
import { Notification } from "@/modules/auth/pages/LoginPage/types";
import useInactivityTimer from "../../hooks/useInactivityTimer";
import useSessionStorage from "../../hooks/useSessionStorage";
import { useScreenSize } from "../../hooks/useScreenSize";
import { KEY_BODEGA, KEY_EMPRESA } from "@/config/api";
import { useContext, useEffect, useMemo, useState } from "react";
import { Alerts } from "../../components/Alerts";
import { MaxTimeInactivity } from "./constants";
import { AuthRoutesList } from "@/modules/auth";
import { UserData } from "@/services/types";
import useToken from "../../hooks/useToken";
import {
  StyledMenuCollapsedButton,
  StyledContentSpace,
  CustomBreadcrumb,
  BreadcrumbLink,
} from "./styled";
import { GlobalContext } from "@/router/GlobalContext";

const { Sider, Header, Content } = Layout;

const specialPaths = [
  "/create",
  "/edit",
  "/show",
  "/crear-variable",
  "/editar-variable",
  "/anular",
  "/aprobar",
  "/desaprobar",
  "/pagar",
  "/cancelar",
  "/distribuir",
  "dis/auditar",
  "/import",
  "/entradas",
  "/salidas",
  "/traslados",
  "/ventas",
  "/crear-categoria",
  "/editar-categoria",
  "/crear-subcategoria",
  "/editar-subcategoria",
  "/crear-parametro",
  "/editar-parametro",
  "/crear-parametro-sub-categoria",
  "/editar-parametro-sub-categoria",
  "/crear-Datos",
  "/editar-datos",
  "/crear-activo",
  "/editar-activo",
  "/crear-sub-localizacion-area",
  "/editar-sub-localizacion-area",
  "/crear-activo-masivos",
  "/crear-retorno-activo-proovedor",
  "/crear-retorno-activo-proovedor-masivos",
  "/crear-solicitar-activos",
  "/solicitudes-activos",
  "/tas/crear",
  "/tas/editar",
  "/traslados-entrada",
  "/upload",
  "/devolucion",
  "/maec",
  "/maa",
  "/mav",
  "/map",
  "/maei",
  "/crear-mantenimiento",
  "/",
];

export const DashboardLayout = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useContext debe usarse dentro de un GlobalProvider");
  }
  const { setUserGlobal } = context;

  const [api, contextHolder] = notification.useNotification();
  const timer = useInactivityTimer(MaxTimeInactivity);
  const { getSessionVariable } = useSessionStorage();
  const { width } = useScreenSize();
  const location = useLocation();
  const navigate = useNavigate();

  const [breadcrumbs, setBreadcrumbs] = useState<Array<BreadcrumbItemType>>([
    { title: "Dashboard" },
  ]);
  const [flagAlertaSesion, setFlagAlertaSession] = useState<boolean>(false);
  const [showBreadcrumbs, setShowBreadcrumbs] = useState<boolean>(true);
  const [logoutSpin, setLogoutSpin] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (width <= 950) {
      return true;
    } else {
      return false;
    }
  });
  const [loader, setLoader] = useState<boolean>(false);
  const [modal, contextModal] = Modal.useModal();
  const [user, setUser] = useState<UserData>();
  const { getToken, removeToken } = useToken();
  const [accesos, setAccesos] = useState<string[]>([]);

  useEffect(() => {
    if (width <= 680) {
      setShowBreadcrumbs(false);
    } else {
      setShowBreadcrumbs(true);
    }
  }, [width]);

  useEffect(() => {
    if (user) {
      setUserGlobal(user);
    }
  }, [user]);

  const pushNotification = ({
    type = "success",
    title,
    description,
  }: Notification) => {
    api[type]({
      message: title,
      description: description,
      placement: "top",
    });
  };

  // useEffect(() => {
  //   const handleLoad = () => {
  //     fetchUserProfile()
  //       .then(({ data }) => {
  //         setLoader(false);
  //         setUser(data.userData);
  //       })
  //       .catch(() => {
  //         removeToken();
  //         navigate(`/${AuthRoutesList.AUTH}/${AuthRoutesList.LOGIN}`);
  //       });
  //   };

  //   window.addEventListener("load", handleLoad);

  //   // return () => {
  //   //   window.removeEventListener("load", handleLoad);
  //   // };
  // }, []);

  useMemo(() => {
    setLoader(true);
    const elementos = location.pathname.split("/").slice(1);
    setBreadcrumbs(
      elementos.map((item, index) => {
        if (index === elementos.length - 1) {
          return { title: item };
        } else {
          const rutaParcial = elementos.slice(0, index + 1).join("/");
          const href = window.location.origin + "/" + rutaParcial;
          return {
            title: <BreadcrumbLink to={href}>{item}</BreadcrumbLink>,
          };
        }
      })
    );
    if (
      (getToken() && location.pathname == "/dashboard") ||
      (getToken() && accesos.length == 0)
    ) {
      fetchUserProfile()
        .then(({ data }) => {
          setAccesos([]);
          setLoader(false);
          setUser(data.userData);
          let access: string[] = [];
          const perfil = data.userData.perfiles.find(
            (perfil) => perfil.id_empresa == getSessionVariable(KEY_EMPRESA)
          );
          if (perfil) {
            // perfil.modulos.forEach((modulo) => {
            //   access.push(
            //     `/${modulo.modulo.nom_modulo.replace(" ", "").toLowerCase()}`
            //   );
            // });
            perfil.menu.forEach((menu) => {
              access.push(
                `/${menu.key}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
              );
              if (menu.children && menu.children.length > 0) {
                menu.children.forEach((child) => {
                  access.push(
                    `/${child.key}`
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                  );
                  if (child.children && child.children.length > 0) {
                    child.children.forEach((grandchild) => {
                      access.push(
                        `/${grandchild.key}`
                          .normalize("NFD")
                          .replace(/[\u0300-\u036f]/g, "")
                      );
                    });
                  }
                });
              }
            });
          } else {
            access = [];
          }
          access.push("/dashboard");
          access.push("/dashboard/perfil");
          setAccesos(access);
        })
        .catch(() => {
          removeToken();
          navigate(`/${AuthRoutesList.AUTH}/${AuthRoutesList.LOGIN}`);
        });
    }
    // if (
    //   !accesos.includes(location.pathname) &&
    //   location.pathname !== "/documentos"
    // ) {
    //   api.error({ message: "No tienes permisos para acceder a este módulo" });
    //   navigate(`/dashboard`);
    // }
  }, [location]);

  useEffect(() => {
    if (accesos.length > 0) {
      const path = location.pathname;
      let has_special_path = false;
      specialPaths.forEach((specialPath) => {
        if (path.includes(specialPath)) {
          has_special_path = true;
          return;
        }
      });
      if (!has_special_path)
        if (!accesos.includes(path)) {
          api.error({
            message: "No tienes permisos para acceder a este módulo",
          });
          navigate(`/dashboard`);
        }
    }
  }, [accesos, location]);

  useMemo(() => {
    if (timer >= MaxTimeInactivity) {
      if (!flagAlertaSesion) {
        modal.warning({
          title: "Sesion caducada",
          icon: <ExclamationCircleOutlined />,
          content: "Por favor ingresa de nuevo.",
          onOk: () => {
            logout().then(() => {
              removeToken();
              setTimeout(() => {
                navigate(`/${AuthRoutesList.AUTH}/${AuthRoutesList.LOGIN}`);
              }, 500);
            });
          },
        });
        setFlagAlertaSession(true);
      }
    }
  }, [timer]);


  //validacion de horario 
  //  useEffect(() => {
  //     const verificarHorario = () => {
  //       if (!user) return;
    
  //       const ahora = new Date();
  //       const diaActual = ahora.toLocaleString("es-CO", { weekday: "long" }).toLowerCase();
  //       const horaActual = ahora.toLocaleTimeString("es-CO", { hour12: false }); // HH:mm:ss
    
  //       // console.log("Día actual:", diaActual);
  //       // console.log("Hora actual:", horaActual);
  //       // console.log("Horario adicional:", user?.horario_adicional);
  //       // console.log("Horario regular:", user?.horario?.detalles);
    
  //       let dentroDeHorario = false;
    
  //       //  Validar Horario Adicional
  //       const { horario_adicional } = user;
  //       if (horario_adicional) {
  //         const fechaInicio = new Date(horario_adicional.fecha_inicio);
  //         const fechaFinal = new Date(horario_adicional.fecha_final);
    
  //         if (ahora >= fechaInicio && ahora <= fechaFinal) {
  //           dentroDeHorario = true;
  //         }
  //       }
    
  //       //  Validar Horario 
  //       if (!dentroDeHorario && user.horario?.detalles) {
  //         const horarioDia = user.horario.detalles.find((h) => h.dia.toLowerCase() === diaActual);
  //         if (horarioDia) {
  //           const convertirMinutos = (hora: string) => {
  //             const [h, m, s] = hora.split(":").map(Number);
  //             return h * 60 + m + (s || 0) / 60;
  //           };
    
  //           const minutosActual = convertirMinutos(horaActual);
  //           const minutosInicio = convertirMinutos(horarioDia.hora_inicio.trim());
  //           const minutosFinal = convertirMinutos(horarioDia.hora_final.trim());
    
  //           if (minutosActual >= minutosInicio && minutosActual <= minutosFinal) {
  //             dentroDeHorario = true;
  //           }
  //         }
  //       }
    
  //       //  Si no está dentro de ningún horario, cerrar sesión
  //       // if (!dentroDeHorario) {
  //       //   console.warn("Fuera de horario. Cerrando sesión...");
  //       //   pushNotification({
  //       //     type: "warning",
  //       //     description: "Tu sesión se cerrará porque estás fuera del horario permitido.",
  //       //   });
  //       //   // setTimeout(onLogout, 1500);
  //       //   logout().then(() => {
  //       //     removeToken();
  //       //     setTimeout(() => {
  //       //       navigate(`/${AuthRoutesList.AUTH}/${AuthRoutesList.LOGIN}`);
  //       //     }, 2000);
  //       //   });
  //       // }
  //     };
    
  //     // Ejecutar cada 15 m 900000
  //     const interval = setInterval(verificarHorario, 900000);
    
  //     return () => clearInterval(interval);
  //   }, [user]);

  return (
    <>
      {contextModal}
      {contextHolder}
      <Spin
        spinning={logoutSpin}
        indicator={
          <LoadingOutlined
            style={{ fontSize: 100, color: "rgb(239 170 28)" }}
            spin
          />
        }
      >
        <Layout
          onLoad={() => {
            fetchUserProfile()
              .then(({ data }) => {
                setLoader(false);
                setUser(data.userData);
              })
              .catch(() => {
                removeToken();
                navigate(`/${AuthRoutesList.AUTH}/${AuthRoutesList.LOGIN}`);
              });
          }}
          hasSider
        >
          <Sider
            collapsedWidth="50"
            breakpoint="xs"
            trigger={null}
            collapsed={collapsed}
            style={{
              overflow: "auto",
              height: "100vh",
              position: "fixed",
              insetInlineStart: 0,
              top: 0,
              bottom: 0,
              scrollbarWidth: "thin",
              scrollbarGutter: "stable",
              transition: ".6s all",
              backgroundColor: "#000000", //color sidebar
              zIndex: 0,
            }}
          >
            <CustomMenu
              onLoader={(value) => setLoader(value)}
              user={user}
              collapsed={collapsed}
            />
          </Sider>
          <Layout style={{ marginInlineStart: 200 }}>
            <Header
              style={{
                position: "fixed",
                zIndex: 100,
                left: collapsed ? 50 : 200,
                width: collapsed ? "calc(100% - 50px)" : "calc(100% - 200px)",
                borderBottom: "2px solid #D9D9D9",
                backgroundColor: "#FFFFFF",
                display: "flex",
                justifyContent: "space-between",
                paddingInline: 10,
                paddingRight: 10,
                transition: ".6s all",
              }}
            >
              <Space direction="horizontal" style={{ lineHeight: 1 }}>
                <StyledMenuCollapsedButton
                  onClick={() => setCollapsed(!collapsed)}
                />
                {showBreadcrumbs ? (
                  <CustomBreadcrumb separator=">" items={breadcrumbs} />
                ) : null}
              </Space>
              <Alerts />
              <CustomAvatarDescription
                user={user}
                bodega={user?.bodega?.find(
                  (element) =>
                    element.id_bodega.toString() ===
                      getSessionVariable(KEY_BODEGA) &&
                    element.bodega.id_empresa.toString() ===
                      getSessionVariable(KEY_EMPRESA)
                )}
                loader={loader}
                onFetchLogout={(value: boolean) => setLogoutSpin(value)}
                onPushNotification={(data: Notification) =>
                  pushNotification(data)
                }
              />
            </Header>
            <Content
              style={{
                padding: 0,
                paddingTop: 64,
                marginTop: 0,
                marginLeft: collapsed ? -150 : 0,
                position: "relative",
                background: "#f8f8f8",
                minHeight: "calc(100vh - 64px)",
                // backgroundImage: "url(./logo_dash.png)",  //logo de dashboard
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                overflow: "initial",
                transition: ".6s all",
                zIndex: 2,
              }}
            >
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: "#f9af11",
                  },
                  components: {
                    Table: {
                      colorFillAlter: "#6F6F6F",
                      colorFillSecondary: "#929292",
                      colorFillContent: "#929292",
                      fontSize: 12,
                      colorTextHeading: "white",
                    },
                    Collapse: {
                      colorFillAlter: "black",
                      colorTextHeading: "white",
                      colorBorder: "#f1f1f1",
                      colorBgContainer: "#f1f1f1",
                      borderRadiusLG: 5,
                    },
                    Button: {
                      colorBgContainerDisabled: "rgb(249 175 17 / 33%)",
                      colorTextDisabled: "rgba(0, 0, 0, 0.25)",
                    },
                    Input: {
                      colorTextDisabled: "#272727",
                    },
                    Select: {
                      colorTextDisabled: "#272727",
                    },
                    DatePicker: {
                      colorTextDisabled: "#272727",
                    },
                    InputNumber: {
                      colorTextDisabled: "#272727",
                    },
                  },
                }}
              >
                <StyledContentSpace>
                  <Outlet />
                </StyledContentSpace>
              </ConfigProvider>
            </Content>
          </Layout>
        </Layout>
      </Spin>
    </>
  );
};
