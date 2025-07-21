// import { useState, useEffect } from "react";
// import {
//   Project,
//   ProjectDetailResponse,
//   ResponseProject,
// } from "@/services/types";
// import {
//   fetchProjectDetalle,
//   getGrafiaPoryectos,
// } from "@/services/graficasDashboard/proyectosAPI";
// import ProjectCard from "./components/ProjectCard";
// import ProjectDetail from "./components/ProjectDetail";
// import styles from './DashboardProyectos.module.css';

// export const DashboardProyectos = () => {
//   const [projects, setProjects] = useState<ResponseProject[]>([]);
//   const [selectedProject, setSelectedProject] = useState<Project | null>(null);
//   const [projectDetail, setProjectDetail] =
//     useState<ProjectDetailResponse | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const loadProjects = async () => {
//       try {
//         getGrafiaPoryectos().then(({ data: { data } }) => {
//           setProjects(data);
//           setLoading(false);
//         });
//       } catch (err) {
//         setError("Error al cargar los proyectos");
//         setLoading(false);
//         setProjects([]); // Asegurar que projects siempre sea un array
//       }
//     };

//     loadProjects();
//   }, []);

//   const handleProjectSelect = async (project: Project) => {
//     try {
//       setLoading(true);
//       fetchProjectDetalle(project.id).then(({ data }) => {
//         setProjectDetail(data);
//         setSelectedProject(project);
//         setLoading(false);
//       });
//     } catch (err) {
//       setError("Error al cargar los detalles del proyecto");
//       setLoading(false);
//     }
//   };

//   const handleBackToProjects = () => {
//     setSelectedProject(null);
//     setProjectDetail(null);
//   };

//   if (loading) {
//     return <div className="loading">Cargando...</div>;
//   }

//   if (error) {
//     return <div className="error">{error}</div>;
//   }

//   return (
//     <div className="app">
//       {!selectedProject ? (
//         <div className="projects-grid">
//           <h1>Mis Proyectos</h1>
//           <div className="projects-container">
//             {/* Verificación adicional antes de mapear */}
//             {projects && projects.length > 0 ? (
//               projects.map((project) => (
//                 <ProjectCard
//                   key={project.id}
//                   project={project}
//                   onClick={() => handleProjectSelect(project)}
//                 />
//               ))
//             ) : (
//               <div className="no-projects">No hay proyectos disponibles</div>
//             )}
//           </div>
//         </div>
//       ) : projectDetail ? (
//         <ProjectDetail
//           project={selectedProject}
//           detail={projectDetail}
//           onBack={handleBackToProjects}
//         />
//       ) : (
//         <div className="error">
//           No se pudieron cargar los detalles del proyecto
//         </div>
//       )}
//     </div>
//   );
// };
import { useState, useEffect } from "react";
import {
  Project,
  ProjectDetailResponse,
  ResponseProject,
} from "@/services/types";
import {
  fetchProjectDetalle,
  getGrafiaPoryectos,
} from "@/services/graficasDashboard/proyectosAPI";
import ProjectCard from "./components/ProjectCard";
import ProjectDetail from "./components/ProjectDetail";

// Estilos principales del dashboard
const dashboardStyles = {
  app: {
    padding: "2rem",
    maxWidth: "1400px",
    margin: "0 auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    minHeight: "100vh",
    backgroundColor: "#f9fafb"
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "300px",
    fontSize: "1.2rem",
    color: "#555",
    fontWeight: "500" as const
  },
  error: {
    backgroundColor: "#ffebee",
    color: "#d32f2f",
    padding: "1.5rem",
    borderRadius: "8px",
    margin: "2rem 0",
    textAlign: "center" as const,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  },
  projectsGrid: {
    marginTop: "2rem"
  },
  projectsTitle: {
    fontSize: "2rem",
    color: "#2c3e50",
    marginBottom: "1.5rem",
    paddingBottom: "0.5rem",
    borderBottom: "1px solid #eaeaea",
    fontWeight: "600" as const
  },
  projectsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.5rem",
    marginTop: "1rem",
    animation: "fadeIn 0.4s ease-out"
  },
  noProjects: {
    gridColumn: "1 / -1",
    backgroundColor: "#f5f5f5",
    padding: "2rem",
    textAlign: "center" as const,
    borderRadius: "8px",
    color: "#757575",
    fontSize: "1.1rem"
  },
  retryButton: {
    backgroundColor: "#d32f2f",
    color: "white",
    border: "none",
    padding: "0.5rem 1.5rem",
    borderRadius: "4px",
    marginTop: "1rem",
    cursor: "pointer",
    transition: "background-color 0.3s",
    fontSize: "0.9rem",
    fontWeight: "500" as const
  }
};

// Keyframes para animaciones
const keyframes = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export const DashboardProyectos = () => {
  const [projects, setProjects] = useState<ResponseProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectDetail, setProjectDetail] = useState<ProjectDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        getGrafiaPoryectos().then(({ data: { data } }) => {
          setProjects(data);
          setLoading(false);
        });
      } catch (err) {
        setError("Error al cargar los proyectos");
        setLoading(false);
        setProjects([]);
      }
    };

    loadProjects();
  }, []);

  const handleProjectSelect = async (project: Project) => {
    try {
      setLoading(true);
      fetchProjectDetalle(project.id).then(({ data }) => {
        setProjectDetail(data);
        setSelectedProject(project);
        setLoading(false);
      });
    } catch (err) {
      setError("Error al cargar los detalles del proyecto");
      setLoading(false);
    }
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
    setProjectDetail(null);
  };

  if (loading) {
    return <div style={dashboardStyles.loading}>Cargando proyectos...</div>;
  }

  if (error) {
    return (
      <div style={dashboardStyles.error}>
        {error}
        <button 
          style={dashboardStyles.retryButton} 
          onClick={() => window.location.reload()}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <>
      <style>{keyframes}</style>
      <div style={dashboardStyles.app}>
        {!selectedProject ? (
          <div style={dashboardStyles.projectsGrid}>
            <h1 style={dashboardStyles.projectsTitle}>Mis Proyectos</h1>
            <div style={dashboardStyles.projectsContainer}>
              {projects && projects.length > 0 ? (
                projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => handleProjectSelect(project)}
                  />
                ))
              ) : (
                <div style={dashboardStyles.noProjects}>
                  No hay proyectos disponibles
                </div>
              )}
            </div>
          </div>
        ) : projectDetail ? (
          <ProjectDetail
            project={selectedProject}
            detail={projectDetail}
            onBack={handleBackToProjects}
          />
        ) : (
          <div style={dashboardStyles.error}>
            No se pudieron cargar los detalles del proyecto
            <button 
              style={dashboardStyles.retryButton}
              onClick={handleBackToProjects}
            >
              Volver
            </button>
          </div>
        )}
      </div>
    </>
  );
};