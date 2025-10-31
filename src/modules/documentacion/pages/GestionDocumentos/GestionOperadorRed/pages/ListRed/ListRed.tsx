// import { useState } from "react";
// import { Tabs, Typography, Button } from "antd";
// import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
// import { EmcaliRoute } from "../components/EMCALI/EmcaliRoute/EmcaliRoute";
// import { CelsiaRoute } from "../components/CELSIA/CelsiaRoute/CelsiaRoute";
// // 👇 Aquí importas el componente que quieres mostrar al dar clic
// import { CrearDocumentacionRed } from "../../../CrearDocumentacionRed";

// const { Text } = Typography;

// export const ListRed = () => {
//   const [showCreate, setShowCreate] = useState(false);

//   const handleShowCreate = () => {
//     setShowCreate(true);
//   };

//   const handleBack = () => {
//     setShowCreate(false);
//   };

//   return (
//     <StyledCard>
//       {/* Si showCreate es true, muestra el componente de creación */}
//       {showCreate ? (
//         <>
//           <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
//             <Text strong style={{ fontSize: "16px" }}>
//               Crear nueva red
//             </Text>
//             <Button onClick={handleBack}>Volver</Button>
//           </div>
//           <CrearDocumentacionRed />
//         </>
//       ) : (
//         <>
//           <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
//             <Text strong style={{ fontSize: "16px" }}>
//               Listado de Redes
//             </Text>
//             <Button type="primary" onClick={handleShowCreate}>
//               Crear nuevo
//             </Button>
//           </div>

//           <Tabs
//             defaultActiveKey="1"
//             destroyInactiveTabPane={true}
//             items={[
//               {
//                 key: "1",
//                 label: <Text>EMCALI</Text>,
//                 children: <EmcaliRoute />,
//               },
//               {
//                 key: "2",
//                 label: <Text>CELSIA</Text>,
//                 children: <CelsiaRoute />,
//               },
//             ]}
//           />
//         </>
//       )}
//     </StyledCard>
//   );
// };
import { useState } from "react";
import { Tabs, Typography, Button } from "antd";
import { useLocation } from "react-router-dom";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { EmcaliRoute } from "../components/EMCALI/EmcaliRoute/EmcaliRoute";
import { CelsiaRoute } from "../components/CELSIA/CelsiaRoute/CelsiaRoute";
import { CrearDocumentacionRed } from "../../../CrearDocumentacionRed";

const { Text } = Typography;

export const ListRed = () => {
  const [showCreate, setShowCreate] = useState(false);
  const location = useLocation();

  // Determinar si estamos en la ruta base o en una ruta interna
  const isBaseRoute = location.pathname === "/documentacion/operador-red";
  const isInternalRoute = !isBaseRoute;

  const handleShowCreate = () => {
    setShowCreate(true);
  };

  const handleBack = () => {
    setShowCreate(false);
  };

  // Renderizar contenido basado en la ruta
  const renderContent = () => {
    if (showCreate) {
      return (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <Text strong style={{ fontSize: "16px" }}>
              Crear nueva red
            </Text>
            <Button type="primary" onClick={handleBack}>Volver</Button>
          </div>
          <CrearDocumentacionRed />
        </>
      );
    }

    if (isInternalRoute) {
      // Para rutas internas, mostrar el componente correspondiente sin tabs
  if (location.pathname.includes("actividades-celsia")) {
        return <CelsiaRoute />;
      } else {
        return <EmcaliRoute />;
      }
    }

    // Para la ruta base, mostrar los tabs
    return (
      <>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <Text strong style={{ fontSize: "16px" }}>
            Listado de Redes
          </Text>
          <Button type="primary" onClick={handleShowCreate}>
            Crear nuevo
          </Button>
        </div>

        <Tabs
          defaultActiveKey="1"
          destroyInactiveTabPane={true}
          items={[
            {
              key: "1",
              label: <Text>EMCALI</Text>,
              children: <EmcaliRoute />,
            },
            {
              key: "2",
              label: <Text>CELSIA</Text>,
              children: <CelsiaRoute />,
            },
          ]}
        />
      </>
    );
  };

  return (
    <StyledCard>
      {renderContent()}
    </StyledCard>
  );
};