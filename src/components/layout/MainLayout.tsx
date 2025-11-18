// import React, { useState } from "react";
// import { Layout, Row, Col } from "antd";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../hooks/useAuth";
// import { useAdmin } from "../../hooks/useAdmin";
// import UserAvatar from "../ui/UserAvatar";
// import NavbarMenu from "./NavbarMenu";
// import {NotificationBell} from "../notifications/NotificationBell";
// import ScreenSplitter from "./ScreenSplitter";
// import ModuleSelector from "./ModuleSelector";
// import { LogoContainer } from "./styled";
// import { MenuItem } from "../../types/auth.types";
// import { getRouteComponent } from "../../config/route-components.config";
// import { getModuleIcon } from "../../config/module-icons.config";
// import { ParticlesBackground } from "../animations/ParticlesBackground";

// const { Header, Content } = Layout;

// const headerStyle: React.CSSProperties = {
//   color: "#fff",
//   height: 64,
//   padding: "0 16px",
//   backgroundColor: "#1976d2",
//   display: "flex",
//   alignItems: "center",
//   gap: "16px",
//   boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//   position: "fixed",
//   top: 0,
//   left: 0,
//   right: 0,
//   zIndex: 1000,
//   width: "100%",
// };

// const contentStyle: React.CSSProperties = {
//   backgroundColor: "#f0f2f5",
//   padding: "16px",
//   flex: 1,
//   display: "flex",
//   flexDirection: "column",
//   overflow: "hidden",
//   marginTop: 64,
//   minHeight: "calc(100vh - 64px)",
// };

// const layoutStyle: React.CSSProperties = {
//   minHeight: "100vh",
//   width: "100%",
//   display: "flex",
//   flexDirection: "column",
// };

// const mainContentStyle: React.CSSProperties = {
//   background: "#fff",
//   borderRadius: "8px",
//   padding: "0",
//   boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//   border: "1px solid #d9d9d9",
//   overflow: "hidden",
//   flex: 1,
//   display: "flex",
//   flexDirection: "column",
//   minHeight: "400px",
// };

// const mainContentHeaderStyle: React.CSSProperties = {
//   background: "#fafafa",
//   color: "#333",
//   padding: "12px 16px",
//   borderBottom: "1px solid #e8e8e8",
//   display: "flex",
//   alignItems: "center",
//   gap: "8px",
//   fontWeight: 600,
//   flexShrink: 0,
//   flexWrap: "wrap",
// };

// interface MainLayoutProps {
//   children: React.ReactNode;
// }

// interface SelectedModule {
//   menuItem: MenuItem;
//   routeKey: string;
//   component: React.ComponentType;
// }

// const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
//   const { user } = useAuth();
//   const { isAdmin } = useAdmin();
//   const navigate = useNavigate();
//   const [splitSide, setSplitSide] = useState<"left" | "right" | "none">("none");
//   const [leftModule, setLeftModule] = useState<SelectedModule | null>(null);
//   const [rightModule, setRightModule] = useState<SelectedModule | null>(null);
//   const [selectorVisible, setSelectorVisible] = useState(false);
//   const [selectorSide, setSelectorSide] = useState<"left" | "right">("left");

//   const availableModules = user?.perfiles?.[0]?.menu || [];

//   const goToDashboard = () => {
//     navigate("/dashboard");
//   };

//   const handleSideSelect = (side: "left" | "right" | "none") => {
//     setSplitSide(side);
//     if (side === "left" || side === "right") {
//       setSelectorSide(side);
//       setSelectorVisible(true);
//     } else {
//       setLeftModule(null);
//       setRightModule(null);
//     }
//   };

//   const handleModuleSelect = (menuItem: MenuItem, routeKey: string) => {
//     const Component = getRouteComponent(routeKey);
//     const selectedModule: SelectedModule = {
//       menuItem,
//       routeKey,
//       component: Component,
//     };

//     if (selectorSide === "left") {
//       setLeftModule(selectedModule);
//     } else {
//       setRightModule(selectedModule);
//     }
//     setSelectorVisible(false);
//   };

//   const renderComponent = (
//     selectedModule: SelectedModule | null,
//     side: "left" | "right"
//   ) => {
//     if (!selectedModule) {
//       return (
//         <div
//           style={{
//             textAlign: "center",
//             color: "#999",
//             padding: "40px 16px",
//             flex: 1,
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//             alignItems: "center",
//             minHeight: "200px",
//           }}
//         >
//           <div style={{ fontSize: "32px", marginBottom: "12px", opacity: 0.5 }}>
//             {side === "left" ? "⬅️" : "➡️"}
//           </div>
//           <p style={{ margin: 0, fontSize: "14px" }}>
//             Selecciona un módulo para el lado{" "}
//             {side === "left" ? "izquierdo" : "derecho"}
//           </p>
//         </div>
//       );
//     }

//     // ✅ RENDERIZADO COMPLETO - Sin contenedores restrictivos
//     const Component = selectedModule.component;
//     return <Component />;
//   };

//   const renderSplitContent = () => {
//     if (splitSide === "none") {
//       return (
//         <div style={mainContentStyle}>
//           <div style={mainContentHeaderStyle}>
//             <span
//               style={{
//                 background: "#0967a7",
//                 color: "white",
//                 borderRadius: "4px",
//                 padding: "4px 8px",
//                 fontSize: "12px",
//                 fontWeight: 600,
//                 whiteSpace: "nowrap",
//               }}
//             >
//               ERP
//               <ParticlesBackground/>
//             </span>
//           </div>
//           <div
//             style={{
//               padding: "0",
//               flex: 1,
//               overflow: "hidden",
//               display: "flex",
//               flexDirection: "column",
//             }}
//           >
//             <div
//               style={{
//                 flex: 1,
//                 overflow: "hidden",
//                 display: "flex",
//                 flexDirection: "column",
//               }}
//             >
//               {children}
//             </div>
//           </div>
//         </div>
//       );
//     }

//     return (
//       <Row
//         gutter={[16, 16]}
//         style={{
//           height: "100%",
//           flex: 1,
//           overflow: "hidden",
//           margin: 0,
//         }}
//       >
//         <Col
//           xs={24}
//           md={splitSide === "left" ? 24 : 12}
//           style={{
//             height: "100%",
//             display: "flex",
//             flexDirection: "column",
//             minHeight: "400px",
//           }}
//         >
//           <div
//             style={{
//               background: "#fff",
//               borderRadius: "8px",
//               padding: "0",
//               height: "100%",
//               minHeight: "400px",
//               boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//               border:
//                 splitSide === "left"
//                   ? "2px solid #1890ff"
//                   : "1px solid #d9d9d9",
//               overflow: "hidden",
//               display: "flex",
//               flexDirection: "column",
//               flex: 1,
//             }}
//           >
//             <div
//               style={{
//                 background: splitSide === "left" ? "#1890ff" : "#f0f0f0",
//                 color: splitSide === "left" ? "#fff" : "#666",
//                 padding: "12px 16px",
//                 borderBottom: "1px solid #d9d9d9",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "8px",
//                 flexShrink: 0,
//                 flexWrap: "wrap",
//               }}
//             >
//               {leftModule ? (
//                 <>
//                   <span style={{ fontSize: "14px", flexShrink: 0 }}>
//                     {getModuleIcon(leftModule.menuItem.cod_modulo)}
//                   </span>
//                   <span
//                     style={{
//                       fontWeight: "bold",
//                       flex: 1,
//                       minWidth: 0,
//                       overflow: "hidden",
//                       textOverflow: "ellipsis",
//                       whiteSpace: "nowrap",
//                     }}
//                   >
//                     {leftModule.menuItem.label}
//                   </span>
//                   <span
//                     style={{
//                       fontSize: "11px",
//                       opacity: 0.8,
//                       flexShrink: 0,
//                     }}
//                   >
//                     {leftModule.routeKey}
//                   </span>
//                 </>
//               ) : (
//                 <span
//                   style={{
//                     fontWeight: "bold",
//                     flex: 1,
//                     whiteSpace: "nowrap",
//                   }}
//                 >
//                   Lado Izquierdo
//                 </span>
//               )}
//             </div>
//             <div
//               style={{
//                 padding: "0",
//                 flex: 1,
//                 overflow: "hidden",
//                 display: "flex",
//                 flexDirection: "column",
//               }}
//             >
//               {renderComponent(leftModule, "left")}
//             </div>
//           </div>
//         </Col>

//         {splitSide === "right" && (
//           <Col
//             xs={24}
//             md={12}
//             style={{
//               height: "100%",
//               display: "flex",
//               flexDirection: "column",
//               minHeight: "400px",
//             }}
//           >
//             <div
//               style={{
//                 background: "#fff",
//                 borderRadius: "8px",
//                 padding: "0",
//                 height: "100%",
//                 minHeight: "400px",
//                 boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//                 border: "2px solid #52c41a",
//                 overflow: "hidden",
//                 display: "flex",
//                 flexDirection: "column",
//                 flex: 1,
//               }}
//             >
//               <div
//                 style={{
//                   background: "#52c41a",
//                   color: "#fff",
//                   padding: "12px 16px",
//                   borderBottom: "1px solid #d9d9d9",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "8px",
//                   flexShrink: 0,
//                   flexWrap: "wrap",
//                 }}
//               >
//                 {rightModule ? (
//                   <>
//                     <span style={{ fontSize: "14px", flexShrink: 0 }}>
//                       {getModuleIcon(rightModule.menuItem.cod_modulo)}
//                     </span>
//                     <span
//                       style={{
//                         fontWeight: "bold",
//                         flex: 1,
//                         minWidth: 0,
//                         overflow: "hidden",
//                         textOverflow: "ellipsis",
//                         whiteSpace: "nowrap",
//                       }}
//                     >
//                       {rightModule.menuItem.label}
//                     </span>
//                     <span
//                       style={{
//                         fontSize: "11px",
//                         opacity: 0.8,
//                         flexShrink: 0,
//                       }}
//                     >
//                       {rightModule.routeKey}
//                     </span>
//                   </>
//                 ) : (
//                   <span
//                     style={{
//                       fontWeight: "bold",
//                       flex: 1,
//                       whiteSpace: "nowrap",
//                     }}
//                   >
//                     Lado Derecho
//                   </span>
//                 )}
//               </div>
//               <div
//                 style={{
//                   padding: "0",
//                   flex: 1,
//                   overflow: "hidden",
//                   display: "flex",
//                   flexDirection: "column",
//                 }}
//               >
//                 {renderComponent(rightModule, "right")}
//               </div>
//             </div>
//           </Col>
//         )}
//       </Row>
//     );
//   };

//   return (
//     <Layout style={layoutStyle}>
//       <Header style={headerStyle}>
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "12px",
//             minWidth: "auto",
//             flexShrink: 0,
//           }}
//         >
//           <div onClick={goToDashboard} style={{ cursor: "pointer" }}>
//             <LogoContainer>
//               <img
//                 src="/logo_dash3.png"
//                 alt="Logo"
//                 style={{ maxWidth: "120px", height: "auto" }}
//               />
//             </LogoContainer>
//           </div>
//           <NotificationBell />
//         </div>

//         <div
//           style={{
//             flex: 1,
//             minWidth: 0,
//             margin: "0 12px",
//           }}
//         >
//           <NavbarMenu user={user} />
//         </div>

//         <div
//           style={{
//             marginLeft: "auto",
//             minWidth: "auto",
//             flexShrink: 0,
//           }}
//         >
//           <UserAvatar user={user} size={36} />
//         </div>
//       </Header>

//       <Content style={contentStyle}>
//         {renderSplitContent()}

//         {isAdmin && (
//           <>
//             <ScreenSplitter
//               onSideSelect={handleSideSelect}
//               currentSide={splitSide}
//             />
//             <ModuleSelector
//               visible={selectorVisible}
//               onClose={() => setSelectorVisible(false)}
//               onModuleSelect={handleModuleSelect}
//               availableModules={availableModules}
//               title={`Seleccionar módulo para ${
//                 selectorSide === "left" ? "Lado Izquierdo" : "Lado Derecho"
//               }`}
//             />
//           </>
//         )}
//       </Content>
//     </Layout>
//   );
// };

// export default MainLayout;

import React, { useState } from "react";
import { Layout, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useAdmin } from "../../hooks/useAdmin";
import UserAvatar from "../ui/UserAvatar";
import NavbarMenu from "./NavbarMenu";
import { NotificationBell } from "../notifications/NotificationBell";
import ScreenSplitter from "./ScreenSplitter";
import ModuleSelector from "./ModuleSelector";
import { LogoContainer } from "./styled";
import { MenuItem } from "../../types/auth.types";
import { getRouteComponent } from "../../config/route-components.config";
import { getModuleIcon } from "../../config/module-icons.config";
import { ParticlesBackground } from "../animations/ParticlesBackground";

const { Header, Content } = Layout;

const headerStyle: React.CSSProperties = {
  color: "#fff",
  height: 64,
  padding: "0 16px",
  backgroundColor: "#1976d2",
  display: "flex",
  alignItems: "center",
  gap: "16px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  width: "100%",
};

const contentStyle: React.CSSProperties = {
  backgroundColor: "#f0f2f5",
  padding: "16px",
  flex: 1,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  marginTop: 64,
  minHeight: "calc(100vh - 64px)",
};

const layoutStyle: React.CSSProperties = {
  minHeight: "100vh",
  width: "100%",
  display: "flex",
  flexDirection: "column",
};

const mainContentStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: "8px",
  padding: "0",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  border: "1px solid #d9d9d9",
  overflow: "hidden",
  flex: 1,
  display: "flex",
  flexDirection: "column",
  minHeight: "400px",
};

const mainContentHeaderStyle: React.CSSProperties = {
  background: "#fafafa",
  color: "#333",
  padding: "12px 16px",
  borderBottom: "1px solid #e8e8e8",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontWeight: 600,
  flexShrink: 0,
  flexWrap: "wrap",
};

interface MainLayoutProps {
  children: React.ReactNode;
}

interface SelectedModule {
  menuItem: MenuItem;
  routeKey: string;
  component: React.ComponentType;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const [splitSide, setSplitSide] = useState<"left" | "right" | "none">("none");
  const [leftModule, setLeftModule] = useState<SelectedModule | null>(null);
  const [rightModule, setRightModule] = useState<SelectedModule | null>(null);
  const [selectorVisible, setSelectorVisible] = useState(false);
  const [selectorSide, setSelectorSide] = useState<"left" | "right">("left");

  const availableModules = user?.perfiles?.[0]?.menu || [];

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  const handleSideSelect = (side: "left" | "right" | "none") => {
    setSplitSide(side);
    if (side === "left" || side === "right") {
      setSelectorSide(side);
      setSelectorVisible(true);
    } else {
      setLeftModule(null);
      setRightModule(null);
    }
  };

  const handleModuleSelect = (menuItem: MenuItem, routeKey: string) => {
    const Component = getRouteComponent(routeKey);
    const selectedModule: SelectedModule = {
      menuItem,
      routeKey,
      component: Component,
    };

    if (selectorSide === "left") {
      setLeftModule(selectedModule);
    } else {
      setRightModule(selectedModule);
    }
    setSelectorVisible(false);
  };

  const renderComponent = (
    selectedModule: SelectedModule | null,
    side: "left" | "right"
  ) => {
    if (!selectedModule) {
      return (
        <div
          style={{
            textAlign: "center",
            color: "#999",
            padding: "40px 16px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}
        >
          <div style={{ fontSize: "32px", marginBottom: "12px", opacity: 0.5 }}>
            {side === "left" ? "⬅️" : "➡️"}
          </div>
          <p style={{ margin: 0, fontSize: "14px" }}>
            Selecciona un módulo para el lado{" "}
            {side === "left" ? "izquierdo" : "derecho"}
          </p>
        </div>
      );
    }

    // ✅ RENDERIZADO COMPLETO - Sin contenedores restrictivos
    const Component = selectedModule.component;
    return <Component />;
  };

  const renderSplitContent = () => {
    if (splitSide === "none") {
      return (
        <div style={mainContentStyle}>
          <div style={mainContentHeaderStyle}>
            <span
              style={{
                background: "#0967a7",
                color: "white",
                borderRadius: "4px",
                padding: "4px 8px",
                fontSize: "12px",
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              ERP
              <ParticlesBackground/>
            </span>
          </div>
          <div
            style={{
              padding: "0",
              flex: 1,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                flex: 1,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {children}
            </div>
          </div>
        </div>
      );
    }

    return (
      <Row
        gutter={[16, 16]}
        style={{
          height: "100%",
          flex: 1,
          overflow: "hidden",
          margin: 0,
        }}
      >
        <Col
          xs={24}
          md={splitSide === "left" ? 24 : 12}
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            minHeight: "400px",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "8px",
              padding: "0",
              height: "100%",
              minHeight: "400px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              border:
                splitSide === "left"
                  ? "2px solid #1890ff"
                  : "1px solid #d9d9d9",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            <div
              style={{
                background: splitSide === "left" ? "#1890ff" : "#f0f0f0",
                color: splitSide === "left" ? "#fff" : "#666",
                padding: "12px 16px",
                borderBottom: "1px solid #d9d9d9",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexShrink: 0,
                flexWrap: "wrap",
              }}
            >
              {leftModule ? (
                <>
                  <span style={{ fontSize: "14px", flexShrink: 0 }}>
                    {getModuleIcon(leftModule.menuItem.cod_modulo)}
                  </span>
                  <span
                    style={{
                      fontWeight: "bold",
                      flex: 1,
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {leftModule.menuItem.label}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      opacity: 0.8,
                      flexShrink: 0,
                    }}
                  >
                    {leftModule.routeKey}
                  </span>
                </>
              ) : (
                <span
                  style={{
                    fontWeight: "bold",
                    flex: 1,
                    whiteSpace: "nowrap",
                  }}
                >
                  Lado Izquierdo
                </span>
              )}
            </div>
            <div
              style={{
                padding: "0",
                flex: 1,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {renderComponent(leftModule, "left")}
            </div>
          </div>
        </Col>

        {splitSide === "right" && (
          <Col
            xs={24}
            md={12}
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              minHeight: "400px",
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: "8px",
                padding: "0",
                height: "100%",
                minHeight: "400px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                border: "2px solid #52c41a",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                flex: 1,
              }}
            >
              <div
                style={{
                  background: "#52c41a",
                  color: "#fff",
                  padding: "12px 16px",
                  borderBottom: "1px solid #d9d9d9",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flexShrink: 0,
                  flexWrap: "wrap",
                }}
              >
                {rightModule ? (
                  <>
                    <span style={{ fontSize: "14px", flexShrink: 0 }}>
                      {getModuleIcon(rightModule.menuItem.cod_modulo)}
                    </span>
                    <span
                      style={{
                        fontWeight: "bold",
                        flex: 1,
                        minWidth: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {rightModule.menuItem.label}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        opacity: 0.8,
                        flexShrink: 0,
                      }}
                    >
                      {rightModule.routeKey}
                    </span>
                  </>
                ) : (
                  <span
                    style={{
                      fontWeight: "bold",
                      flex: 1,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Lado Derecho
                  </span>
                )}
              </div>
              <div
                style={{
                  padding: "0",
                  flex: 1,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {renderComponent(rightModule, "right")}
              </div>
            </div>
          </Col>
        )}
      </Row>
    );
  };

  return (
    <Layout style={layoutStyle}>
      <Header style={headerStyle}>
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            minWidth: "auto",
            flexShrink: 0,
          }}
        >
          <div onClick={goToDashboard} style={{ cursor: "pointer" }}>
            <LogoContainer>
              <img
                src="/logo_dash3.png"
                alt="Logo"
                style={{ maxWidth: "120px", height: "auto" }}
              />
            </LogoContainer>
          </div>
        </div>

        {/* Menú de navegación */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            margin: "0 12px",
          }}
        >
          <NavbarMenu user={user} />
        </div>

        {/* Notificación y Avatar - Agrupados a la derecha */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            minWidth: "auto",
            flexShrink: 0,
          }}
        >
          {/* Campana de notificaciones */}
          <div style={{ marginRight: "8px" }}>
            <NotificationBell />
          </div>

          {/* Avatar del usuario */}
          <UserAvatar user={user} size={36} />
        </div>
      </Header>

      <Content style={contentStyle}>
        {renderSplitContent()}

        {isAdmin && (
          <>
            <ScreenSplitter
              onSideSelect={handleSideSelect}
              currentSide={splitSide}
            />
            <ModuleSelector
              visible={selectorVisible}
              onClose={() => setSelectorVisible(false)}
              onModuleSelect={handleModuleSelect}
              availableModules={availableModules}
              title={`Seleccionar módulo para ${
                selectorSide === "left" ? "Lado Izquierdo" : "Lado Derecho"
              }`}
            />
          </>
        )}
      </Content>
    </Layout>
  );
};

export default MainLayout;