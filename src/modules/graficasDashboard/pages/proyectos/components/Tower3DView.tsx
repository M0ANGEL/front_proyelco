// // // // // import React, { useRef, useState } from 'react';
// // // // // import { Canvas, useFrame, useThree } from '@react-three/fiber';
// // // // // import { OrbitControls, Text } from '@react-three/drei';
// // // // // import * as THREE from 'three';
// // // // // import { Apartment } from '@/services/types';

// // // // // // Componente optimizado para las versiones instaladas
// // // // // const Tower3DView = ({ apartments, floors, currentFloor }) => {
// // // // //   const towerRef = useRef<THREE.Group>(null);
// // // // //   const [hoveredApt, setHoveredApt] = useState(null);

// // // // //   // Configuración de cámara
// // // // //   const CameraSetup = () => {
// // // // //     const { camera } = useThree();
// // // // //     React.useEffect(() => {
// // // // //       camera.position.set(15, 15, 15);
// // // // //       camera.lookAt(0, 0, 0);
// // // // //     }, []);
// // // // //     return null;
// // // // //   };

// // // // //   // Componente de apartamento 3D
// // // // //   const Apartment3D = ({ apt, position, floorNum }) => {
// // // // //     const ref = useRef<THREE.Mesh>();
// // // // //     const color = getStatusColor(apt.estado);
// // // // //     const isCurrentFloor = floorNum === currentFloor;

// // // // //     useFrame(() => {
// // // // //       if (ref.current) {
// // // // //         ref.current.rotation.y += 0.01;
// // // // //       }
// // // // //     });

// // // // //     return (
// // // // //       <mesh
// // // // //         ref={ref}
// // // // //         position={position}
// // // // //         onPointerOver={() => setHoveredApt(apt.id)}
// // // // //         onPointerOut={() => setHoveredApt(null)}
// // // // //         visible={isCurrentFloor}
// // // // //       >
// // // // //         <boxGeometry args={[1.5, 2, 1.5]} />
// // // // //         <meshStandardMaterial
// // // // //           color={color}
// // // // //           transparent={!isCurrentFloor}
// // // // //           opacity={isCurrentFloor ? 1 : 0.2}
// // // // //         />
// // // // //         {(hoveredApt === apt.id || isCurrentFloor) && (
// // // // //           <Text
// // // // //             position={[0, 1.5, 0]}
// // // // //             fontSize={0.5}
// // // // //             color="black"
// // // // //             anchorX="center"
// // // // //             anchorY="middle"
// // // // //           >
// // // // //             {apt.consecutivo}
// // // // //           </Text>
// // // // //         )}
// // // // //       </mesh>
// // // // //     );
// // // // //   };

// // // // //   // Componente de piso
// // // // //   const Floor = ({ floorNum, apartments }) => {
// // // // //     const floorY = (parseInt(floorNum) - 1) * 3;

// // // // //     return (
// // // // //       <group position={[0, floorY, 0]}>
// // // // //         {/* Base del piso */}
// // // // //         <mesh position={[0, -1, 0]} receiveShadow>
// // // // //           <boxGeometry args={[10, 0.2, 10]} />
// // // // //           <meshStandardMaterial color="#dddddd" />
// // // // //         </mesh>

// // // // //         {/* Apartamentos */}
// // // // //         {apartments.map((apt, i) => {
// // // // //           const angle = (i / apartments.length) * Math.PI * 2;
// // // // //           const x = Math.cos(angle) * 4;
// // // // //           const z = Math.sin(angle) * 4;
// // // // //           return (
// // // // //             <Apartment3D
// // // // //               key={apt.id}
// // // // //               apt={apt}
// // // // //               position={[x, 0, z]}
// // // // //               floorNum={floorNum}
// // // // //             />
// // // // //           );
// // // // //         })}
// // // // //       </group>
// // // // //     );
// // // // //   };

// // // // //   return (
// // // // //     <div style={{ height: '500px', width: '100%', background: '#f0f0f0' }}>
// // // // //       <Canvas shadows>
// // // // //         <CameraSetup />
// // // // //         <ambientLight intensity={0.5} />
// // // // //         <spotLight
// // // // //           position={[10, 20, 10]}
// // // // //           angle={0.3}
// // // // //           intensity={1}
// // // // //           castShadow
// // // // //         />

// // // // //         <group ref={towerRef}>
// // // // //           {Object.entries(floors).map(([floorNum, apts]) => (
// // // // //             <Floor key={floorNum} floorNum={floorNum} apartments={apts} />
// // // // //           ))}
// // // // //         </group>

// // // // //         <OrbitControls
// // // // //           enablePan={true}
// // // // //           enableZoom={true}
// // // // //           enableRotate={true}
// // // // //         />
// // // // //       </Canvas>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // // Función auxiliar para colores
// // // // // function getStatusColor(status) {
// // // // //   switch(status) {
// // // // //     case '2': return '#4CAF50'; // Completado
// // // // //     case '1': return '#2196F3'; // En progreso
// // // // //     default: return '#9E9E9E';  // No iniciado
// // // // //   }
// // // // // }

// // // // // export default Tower3DView;

// // // // import React, { useRef, useState } from 'react';
// // // // import { Canvas, useFrame, useThree } from '@react-three/fiber';
// // // // import { OrbitControls, Text } from '@react-three/drei';
// // // // import * as THREE from 'three';
// // // // import { Apartment } from '@/services/types';

// // // // // Componente que contiene la lógica 3D (debe estar dentro de Canvas)
// // // // const TowerScene = ({ floors, currentFloor }) => {
// // // //   const towerRef = useRef<THREE.Group>(null);
// // // //   const [hoveredApt, setHoveredApt] = useState<string | null>(null);
// // // //   const { camera } = useThree();

// // // //   // Configuración inicial de cámara
// // // //   React.useEffect(() => {
// // // //     camera.position.set(15, 30, 30);
// // // //     camera.lookAt(0, 10, 0);
// // // //   }, [camera]);

// // // //   // Animación de rotación
// // // //   useFrame(() => {
// // // //     if (towerRef.current) {
// // // //       towerRef.current.rotation.y += 0.002;
// // // //     }
// // // //   });

// // // //   // Componente de Apartamento
// // // //   const ApartmentCube = ({ apt, position, floorIndex }) => {
// // // //     const ref = useRef<THREE.Mesh>(null);
// // // //     const isCurrentFloor = currentFloor === String(floorIndex + 1);
// // // //     const isHovered = hoveredApt === apt.id;

// // // //     const getColor = () => {
// // // //       switch(apt.estado) {
// // // //         case '2': return '#4CAF50'; // Completado
// // // //         case '1': return '#2196F3'; // En progreso
// // // //         default: return '#9E9E9E';  // No iniciado
// // // //       }
// // // //     };

// // // //     useFrame(() => {
// // // //       if (ref.current && isHovered) {
// // // //         ref.current.position.y = position[1] + Math.sin(Date.now() * 0.005) * 0.3;
// // // //       }
// // // //     });

// // // //     return (
// // // //       <mesh
// // // //         ref={ref}
// // // //         position={position}
// // // //         castShadow
// // // //         onPointerOver={() => setHoveredApt(apt.id)}
// // // //         onPointerOut={() => setHoveredApt(null)}
// // // //       >
// // // //         <boxGeometry args={[1.8, 2.5, 1.8]} />
// // // //         <meshStandardMaterial
// // // //           color={getColor()}
// // // //           transparent={!isCurrentFloor}
// // // //           opacity={isCurrentFloor ? 1 : 0.6}
// // // //         />
// // // //         {(isHovered || isCurrentFloor) && (
// // // //           <Text
// // // //             position={[0, 1.8, 0]}
// // // //             fontSize={0.5}
// // // //             color="black"
// // // //             anchorX="center"
// // // //             anchorY="middle"
// // // //           >
// // // //             {apt.consecutivo}
// // // //           </Text>
// // // //         )}
// // // //       </mesh>
// // // //     );
// // // //   };

// // // //   // Componente de Piso
// // // //   const Floor = ({ floorNum, apartments, index }) => {
// // // //     const floorHeight = index * 4;
// // // //     const isCurrentFloor = currentFloor === floorNum;

// // // //     return (
// // // //       <group position={[0, floorHeight, 0]}>
// // // //         {/* Estructura del piso */}
// // // //         <mesh position={[0, -1.5, 0]} receiveShadow>
// // // //           <boxGeometry args={[10, 0.3, 10]} />
// // // //           <meshStandardMaterial color="#b0bec5" />
// // // //         </mesh>

// // // //         {/* Apartamentos */}
// // // //         {apartments.map((apt, i) => {
// // // //           const angle = (i / apartments.length) * Math.PI * 2;
// // // //           const radius = 6;
// // // //           const x = Math.cos(angle) * radius;
// // // //           const z = Math.sin(angle) * radius;

// // // //           return (
// // // //             <ApartmentCube
// // // //               key={apt.id}
// // // //               apt={apt}
// // // //               position={[x, 0, z]}
// // // //               floorIndex={index}
// // // //             />
// // // //           );
// // // //         })}

// // // //         {/* Indicador de piso */}
// // // //         <Text
// // // //           position={[0, -2, 0]}
// // // //           fontSize={0.8}
// // // //           color={isCurrentFloor ? "#FF5722" : "#607D8B"}
// // // //           anchorX="center"
// // // //           anchorY="middle"
// // // //         >
// // // //           Piso {floorNum}
// // // //         </Text>
// // // //       </group>
// // // //     );
// // // //   };

// // // //   return (
// // // //     <group ref={towerRef}>
// // // //       {Object.entries(floors).map(([floorNum, apts], index) => (
// // // //         <Floor
// // // //           key={floorNum}
// // // //           floorNum={floorNum}
// // // //           apartments={apts}
// // // //           index={index}
// // // //         />
// // // //       ))}
// // // //     </group>
// // // //   );
// // // // };

// // // // // Componente contenedor principal
// // // // const Tower3DView: React.FC<{ floors: Record<string, Apartment[]>, currentFloor: string }> = ({ floors, currentFloor }) => {
// // // //   return (
// // // //     <div style={{
// // // //       height: '600px',
// // // //       width: '100%',
// // // //       background: 'linear-gradient(to bottom, #eceff1, #cfd8dc)',
// // // //       borderRadius: '8px',
// // // //       overflow: 'hidden'
// // // //     }}>
// // // //       <Canvas shadows camera={{ fov: 50 }}>
// // // //         <ambientLight intensity={0.5} />
// // // //         <spotLight
// // // //           position={[20, 30, 20]}
// // // //           angle={0.3}
// // // //           intensity={1}
// // // //           castShadow
// // // //           shadow-mapSize-width={2048}
// // // //           shadow-mapSize-height={2048}
// // // //         />
// // // //         <pointLight position={[-10, 10, -10]} intensity={0.5} />

// // // //         <TowerScene floors={floors} currentFloor={currentFloor} />

// // // //         <OrbitControls
// // // //           enablePan={true}
// // // //           enableZoom={true}
// // // //           enableRotate={true}
// // // //           minDistance={15}
// // // //           maxDistance={50}
// // // //         />
// // // //         <gridHelper args={[30, 30]} rotation={[Math.PI / 2, 0, 0]} />
// // // //       </Canvas>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default Tower3DView;
// // // import React, { useRef, useState } from 'react';
// // // import { Canvas, useFrame, useThree } from '@react-three/fiber';
// // // import { OrbitControls, Text } from '@react-three/drei';
// // // import * as THREE from 'three';
// // // import { Apartment } from '@/services/types';

// // // // Componente 3D interno
// // // const TowerScene = ({ floors, currentFloor }) => {
// // //   const towerRef = useRef<THREE.Group>(null);
// // //   const [hoveredApt, setHoveredApt] = useState<string | null>(null);
// // //   const { camera } = useThree();

// // //   // Configuración inicial de cámara
// // //   React.useEffect(() => {
// // //     camera.position.set(20, 25, 25);
// // //     camera.lookAt(0, 10, 0);
// // //   }, [camera]);

// // //   // Animación suave de rotación
// // //   useFrame(() => {
// // //     if (towerRef.current) {
// // //       towerRef.current.rotation.y += 0.001;
// // //     }
// // //   });

// // //   // Componente de Apartamento
// // //   const ApartmentCube = ({ apt, position, floorIndex }) => {
// // //     const ref = useRef<THREE.Mesh>(null);
// // //     const isCurrentFloor = currentFloor === String(floorIndex + 1);
// // //     const isHovered = hoveredApt === apt.id;

// // //     const getColor = () => {
// // //       switch(apt.estado) {
// // //         case '2': return '#4CAF50'; // Completado
// // //         case '1': return '#2196F3'; // En progreso
// // //         default: return '#9E9E9E';  // No iniciado
// // //       }
// // //     };

// // //     // Animación de hover
// // //     useFrame(() => {
// // //       if (ref.current && isHovered) {
// // //         ref.current.position.y = position[1] + Math.sin(Date.now() * 0.005) * 0.3;
// // //       }
// // //     });

// // //     return (
// // //       <mesh
// // //         ref={ref}
// // //         position={position}
// // //         castShadow
// // //         onPointerOver={() => setHoveredApt(apt.id)}
// // //         onPointerOut={() => setHoveredApt(null)}
// // //       >
// // //         <boxGeometry args={[1.8, 2.5, 1.8]} />
// // //         <meshStandardMaterial
// // //           color={getColor()}
// // //           transparent={!isCurrentFloor}
// // //           opacity={isCurrentFloor ? 1 : 0.6}
// // //         />
// // //         {(isHovered || isCurrentFloor) && (
// // //           <Text
// // //             position={[0, 1.8, 0]}
// // //             fontSize={0.5}
// // //             color="black"
// // //             anchorX="center"
// // //             anchorY="middle"
// // //           >
// // //             {apt.consecutivo}
// // //           </Text>
// // //         )}
// // //       </mesh>
// // //     );
// // //   };

// // //   // Componente de Piso
// // //   const Floor = ({ floorNum, apartments, index }) => {
// // //     const floorHeight = index * 4;
// // //     const isCurrentFloor = currentFloor === floorNum;

// // //     return (
// // //       <group position={[0, floorHeight, 0]}>
// // //         {/* Base del piso */}
// // //         <mesh position={[0, -1.5, 0]} receiveShadow>
// // //           <boxGeometry args={[10, 0.3, 10]} />
// // //           <meshStandardMaterial color="#b0bec5" />
// // //         </mesh>

// // //         {/* Columnas estructurales */}
// // //         {[[5,0,5], [-5,0,5], [5,0,-5], [-5,0,-5]].map((pos, i) => (
// // //           <mesh key={i} position={[pos[0], 1, pos[2]]} castShadow>
// // //             <cylinderGeometry args={[0.4, 0.4, 3, 8]} />
// // //             <meshStandardMaterial color="#78909c" />
// // //           </mesh>
// // //         ))}

// // //         {/* Apartamentos */}
// // //         {apartments.map((apt, i) => {
// // //           const angle = (i / apartments.length) * Math.PI * 2;
// // //           const radius = 5;
// // //           const x = Math.cos(angle) * radius;
// // //           const z = Math.sin(angle) * radius;

// // //           return (
// // //             <ApartmentCube
// // //               key={apt.id}
// // //               apt={apt}
// // //               position={[x, 0, z]}
// // //               floorIndex={index}
// // //             />
// // //           );
// // //         })}

// // //         {/* Indicador de piso */}
// // //         <Text
// // //           position={[0, -2, 0]}
// // //           fontSize={0.8}
// // //           color={isCurrentFloor ? "#FF5722" : "#607D8B"}
// // //           anchorX="center"
// // //           anchorY="middle"
// // //         >
// // //           Piso {floorNum}
// // //         </Text>
// // //       </group>
// // //     );
// // //   };

// // //   return (
// // //     <group ref={towerRef}>
// // //       {Object.entries(floors).map(([floorNum, apts], index) => (
// // //         <Floor
// // //           key={floorNum}
// // //           floorNum={floorNum}
// // //           apartments={apts}
// // //           index={index}
// // //         />
// // //       ))}
// // //     </group>
// // //   );
// // // };

// // // // Componente contenedor principal
// // // const Tower3DView = ({ floors, currentFloor }) => {
// // //   return (
// // //     <div style={{
// // //       height: '600px',
// // //       width: '100%',
// // //       background: 'linear-gradient(to bottom, #eceff1, #cfd8dc)',
// // //       borderRadius: '8px',
// // //       overflow: 'hidden'
// // //     }}>
// // //       <Canvas shadows camera={{ fov: 50 }}>
// // //         <ambientLight intensity={0.6} />
// // //         <spotLight
// // //           position={[25, 30, 25]}
// // //           angle={0.25}
// // //           intensity={1.2}
// // //           castShadow
// // //           shadow-mapSize-width={2048}
// // //           shadow-mapSize-height={2048}
// // //         />
// // //         <pointLight position={[-15, 20, -15]} intensity={0.5} />

// // //         <TowerScene floors={floors} currentFloor={currentFloor} />

// // //         <OrbitControls
// // //           enablePan={true}
// // //           enableZoom={true}
// // //           enableRotate={true}
// // //           minDistance={15}
// // //           maxDistance={50}
// // //         />
// // //       </Canvas>
// // //     </div>
// // //   );
// // // };

// // // export default Tower3DView;

// // import React, { useRef, useState } from 'react';
// // import { Canvas, useFrame, useThree } from '@react-three/fiber';
// // import { OrbitControls, Text } from '@react-three/drei';
// // import * as THREE from 'three';
// // import axios from 'axios';

// // interface Apartment {
// //   id: number;
// //   user_id: number;
// //   proyecto_id: number;
// //   torre: string;
// //   piso: string;
// //   apartamento: string;
// //   consecutivo: string;
// //   orden_proceso: string;
// //   procesos_proyectos_id: number;
// //   text_validacion: string | null;
// //   fecha_ini_torre: string | null;
// //   estado: string;
// //   fecha_habilitado: string;
// //   validacion: number;
// //   estado_validacion: number;
// //   fecha_validacion: string | null;
// //   fecha_fin: string;
// //   created_at: string;
// //   updated_at: string;
// // }

// // interface ApartmentModalProps {
// //   apt: Apartment | null;
// //   onClose: () => void;
// // }

// // const ApartmentModal: React.FC<ApartmentModalProps> = ({ apt, onClose }) => {
// //   if (!apt) return null;

// //   const getStatusText = (status: string): string => {
// //     switch(status) {
// //       case '2': return 'Completado';
// //       case '1': return 'En progreso';
// //       default: return 'No iniciado';
// //     }
// //   };

// //   return (
// //     <div style={{
// //       position: 'fixed',
// //       top: '50%',
// //       left: '50%',
// //       transform: 'translate(-50%, -50%)',
// //       backgroundColor: 'white',
// //       padding: '20px',
// //       borderRadius: '8px',
// //       boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
// //       zIndex: 1000,
// //       width: '400px',
// //       maxWidth: '90%'
// //     }}>
// //       <h3 style={{ marginTop: 0, color: '#333' }}>Información del Apartamento</h3>
// //       <div style={{ marginBottom: '15px' }}>
// //         <p><strong>Consecutivo:</strong> {apt.consecutivo}</p>
// //         <p><strong>Torre:</strong> {apt.torre}</p>
// //         <p><strong>Piso:</strong> {apt.piso}</p>
// //         <p><strong>Apartamento:</strong> {apt.apartamento}</p>
// //         <p><strong>Estado:</strong> {getStatusText(apt.estado)}</p>
// //         <p><strong>Fecha habilitado:</strong> {new Date(apt.fecha_habilitado).toLocaleDateString()}</p>
// //         {apt.fecha_fin && (
// //           <p><strong>Fecha finalización:</strong> {new Date(apt.fecha_fin).toLocaleDateString()}</p>
// //         )}
// //       </div>
// //       <button
// //         onClick={onClose}
// //         style={{
// //           padding: '8px 16px',
// //           backgroundColor: '#2196F3',
// //           color: 'white',
// //           border: 'none',
// //           borderRadius: '4px',
// //           cursor: 'pointer',
// //           transition: 'background-color 0.3s'
// //         }}
// //         onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0d8bf2'}
// //         onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2196F3'}
// //       >
// //         Cerrar
// //       </button>
// //     </div>
// //   );
// // };

// // interface TowerSceneProps {
// //   floors: Record<string, Apartment[]>;
// //   currentFloor: string;
// //   onAptClick: (aptId: number) => void;
// // }

// // const TowerScene: React.FC<TowerSceneProps> = ({ floors, currentFloor, onAptClick }) => {
// //   const towerRef = useRef<THREE.Group>(null);
// //   const [hoveredApt, setHoveredApt] = useState<string | null>(null);
// //   const { camera } = useThree();

// //   React.useEffect(() => {
// //     camera.position.set(20, 25, 25);
// //     camera.lookAt(0, 10, 0);
// //   }, [camera]);

// //   useFrame(() => {
// //     if (towerRef.current) {
// //       towerRef.current.rotation.y += 0.001;
// //     }
// //   });

// //   interface ApartmentCubeProps {
// //     apt: Apartment;
// //     position: [number, number, number];
// //     floorIndex: number;
// //   }

// //   const ApartmentCube: React.FC<ApartmentCubeProps> = ({ apt, position, floorIndex }) => {
// //     const ref = useRef<THREE.Mesh>(null);
// //     const isCurrentFloor = currentFloor === String(floorIndex + 1);
// //     const isHovered = hoveredApt === apt.id.toString();

// //     const getColor = () => {
// //       switch(apt.estado) {
// //         case '2': return '#4CAF50'; // Completado
// //         case '1': return '#2196F3'; // En progreso
// //         default: return '#9E9E9E';  // No iniciado
// //       }
// //     };

// //     useFrame(() => {
// //       if (ref.current && isHovered) {
// //         ref.current.position.y = position[1] + Math.sin(Date.now() * 0.005) * 0.3;
// //       } else if (ref.current) {
// //         ref.current.position.y = position[1];
// //       }
// //     });

// //     return (
// //       <mesh
// //         ref={ref}
// //         position={position}
// //         castShadow
// //         onPointerOver={() => setHoveredApt(apt.id.toString())}
// //         onPointerOut={() => setHoveredApt(null)}
// //         onClick={(e) => {
// //           e.stopPropagation();
// //           onAptClick(apt.id);
// //         }}
// //       >
// //         <boxGeometry args={[1.8, 2.5, 1.8]} />
// //         <meshStandardMaterial
// //           color={getColor()}
// //           transparent={!isCurrentFloor}
// //           opacity={isCurrentFloor ? 1 : 0.6}
// //           emissive={isHovered ? '#ffffff' : '#000000'}
// //           emissiveIntensity={isHovered ? 0.2 : 0}
// //         />
// //         {(isHovered || isCurrentFloor) && (
// //           <Text
// //             position={[0, 1.8, 0]}
// //             fontSize={0.5}
// //             color="black"
// //             anchorX="center"
// //             anchorY="middle"
// //           >
// //             {apt.consecutivo}
// //           </Text>
// //         )}
// //       </mesh>
// //     );
// //   };

// //   interface FloorProps {
// //     floorNum: string;
// //     apartments: Apartment[];
// //     index: number;
// //   }

// //   const Floor: React.FC<FloorProps> = ({ floorNum, apartments, index }) => {
// //     const floorHeight = index * 4;
// //     const isCurrentFloor = currentFloor === floorNum;

// //     return (
// //       <group position={[0, floorHeight, 0]}>
// //         <mesh position={[0, -1.5, 0]} receiveShadow>
// //           <boxGeometry args={[10, 0.3, 10]} />
// //           <meshStandardMaterial color="#b0bec5" />
// //         </mesh>

// //         {[[5,0,5], [-5,0,5], [5,0,-5], [-5,0,-5]].map((pos, i) => (
// //           <mesh key={i} position={[pos[0], 1, pos[2]]} castShadow>
// //             <cylinderGeometry args={[0.4, 0.4, 3, 8]} />
// //             <meshStandardMaterial color="#78909c" />
// //           </mesh>
// //         ))}

// //         {apartments.map((apt, i) => {
// //           const angle = (i / apartments.length) * Math.PI * 2;
// //           const radius = 5;
// //           const x = Math.cos(angle) * radius;
// //           const z = Math.sin(angle) * radius;

// //           return (
// //             <ApartmentCube
// //               key={apt.id}
// //               apt={apt}
// //               position={[x, 0, z]}
// //               floorIndex={index}
// //             />
// //           );
// //         })}

// //         <Text
// //           position={[0, -2, 0]}
// //           fontSize={0.8}
// //           color={isCurrentFloor ? "#FF5722" : "#607D8B"}
// //           anchorX="center"
// //           anchorY="middle"
// //         >
// //           Piso {floorNum}
// //         </Text>
// //       </group>
// //     );
// //   };

// //   return (
// //     <group ref={towerRef}>
// //       {Object.entries(floors).map(([floorNum, apts], index) => (
// //         <Floor
// //           key={floorNum}
// //           floorNum={floorNum}
// //           apartments={apts}
// //           index={index}
// //         />
// //       ))}
// //     </group>
// //   );
// // };

// // interface Tower3DViewProps {
// //   floors: Record<string, Apartment[]>;
// //   currentFloor: string;
// // }

// // const Tower3DView: React.FC<Tower3DViewProps> = ({ floors, currentFloor }) => {
// //   const [selectedApt, setSelectedApt] = useState<Apartment | null>(null);
// //   const [loading, setLoading] = useState(false);

// //   const handleAptClick = async (aptId: number) => {
// //     setLoading(true);
// //     try {
// //       const response = await axios.post('dashboards/infoApt', { id: aptId });
// //       if (response.data.status === 'success') {
// //         setSelectedApt(response.data.data);
// //       }
// //     } catch (error) {
// //       console.error('Error fetching apartment info:', error);
// //       // Puedes mostrar un mensaje de error al usuario aquí si lo deseas
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div style={{
// //       height: '600px',
// //       width: '100%',
// //       background: 'linear-gradient(to bottom, #eceff1, #cfd8dc)',
// //       borderRadius: '8px',
// //       overflow: 'hidden',
// //       position: 'relative'
// //     }}>
// //       <Canvas shadows camera={{ fov: 50 }}>
// //         <ambientLight intensity={0.6} />
// //         <spotLight
// //           position={[25, 30, 25]}
// //           angle={0.25}
// //           intensity={1.2}
// //           castShadow
// //           shadow-mapSize-width={2048}
// //           shadow-mapSize-height={2048}
// //         />
// //         <pointLight position={[-15, 20, -15]} intensity={0.5} />

// //         <TowerScene
// //           floors={floors}
// //           currentFloor={currentFloor}
// //           onAptClick={handleAptClick}
// //         />

// //         <OrbitControls
// //           enablePan={true}
// //           enableZoom={true}
// //           enableRotate={true}
// //           minDistance={15}
// //           maxDistance={50}
// //         />
// //       </Canvas>

// //       {loading && (
// //         <div style={{
// //           position: 'absolute',
// //           top: '50%',
// //           left: '50%',
// //           transform: 'translate(-50%, -50%)',
// //           backgroundColor: 'rgba(0,0,0,0.7)',
// //           color: 'white',
// //           padding: '10px 20px',
// //           borderRadius: '4px',
// //           zIndex: 999
// //         }}>
// //           Cargando información...
// //         </div>
// //       )}

// //       {selectedApt && (
// //         <>
// //           <div
// //             style={{
// //               position: 'fixed',
// //               top: 0,
// //               left: 0,
// //               right: 0,
// //               bottom: 0,
// //               backgroundColor: 'rgba(0,0,0,0.5)',
// //               zIndex: 998
// //             }}
// //             onClick={() => setSelectedApt(null)}
// //           />
// //           <ApartmentModal
// //             apt={selectedApt}
// //             onClose={() => setSelectedApt(null)}
// //           />
// //         </>
// //       )}
// //     </div>
// //   );
// // };

// // export default Tower3DView;

// import React, { useRef, useState } from "react";
// import { Canvas, useFrame, useThree } from "@react-three/fiber";
// import { OrbitControls, Text } from "@react-three/drei";
// import * as THREE from "three";
// import { detalleApt } from "@/services/graficasDashboard/proyectosAPI";

// interface Apartment {
//   id: number;
//   user_id: number;
//   proyecto_id: number;
//   torre: string;
//   piso: string;
//   apartamento: string;
//   consecutivo: string;
//   orden_proceso: string;
//   procesos_proyectos_id: number;
//   text_validacion: string | null;
//   fecha_ini_torre: string | null;
//   estado: string;
//   fecha_habilitado: string;
//   validacion: number;
//   estado_validacion: number;
//   fecha_validacion: string | null;
//   fecha_fin: string;
//   created_at: string;
//   updated_at: string;
// }

// interface Tower3DViewProps {
//   floors: Record<string, Apartment[]>;
//   currentFloor: string;
// }

// const Tower3DView: React.FC<Tower3DViewProps> = ({ floors, currentFloor }) => {
//   // Estados para controlar el modal y la carga
//   const [selectedApt, setSelectedApt] = useState<Apartment | null>(null);
//   const [loading, setLoading] = useState(false);

//   // Función que maneja el clic en un apartamento
//   const handleAptClick = async (aptId: number) => {
//     setLoading(true);
//     const DataApt = {
//         id: aptId
//     }
//     try {
//       detalleApt(DataApt).then(({ data }) => {
//         setSelectedApt(data.data);
//       });
      
//     } catch (error) {
//       console.error("Error fetching apartment info:", error);
//       // Aquí podrías mostrar un toast de error si lo deseas
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Componente de la escena 3D
//   const TowerScene = ({
//     onAptClick,
//   }: {
//     onAptClick: (aptId: number) => void;
//   }) => {
//     const towerRef = useRef<THREE.Group>(null);
//     const [hoveredApt, setHoveredApt] = useState<string | null>(null);
//     const { camera } = useThree();

//     // Configuración inicial de la cámara
//     React.useEffect(() => {
//       camera.position.set(20, 25, 25);
//       camera.lookAt(0, 10, 0);
//     }, [camera]);

//     // Animación de rotación suave
//     useFrame(() => {
//       if (towerRef.current) {
//         towerRef.current.rotation.y += 0.001;
//       }
//     });

//     // Componente de cubo de apartamento
//     const ApartmentCube = ({
//       apt,
//       position,
//       floorIndex,
//     }: {
//       apt: Apartment;
//       position: [number, number, number];
//       floorIndex: number;
//     }) => {
//       const ref = useRef<THREE.Mesh>(null);
//       const isCurrentFloor = currentFloor === String(floorIndex + 1);
//       const isHovered = hoveredApt === apt.id.toString();

//       const getColor = () => {
//         switch (apt.estado) {
//           case "2":
//             return "#4CAF50"; // Completado - verde
//           case "1":
//             return "#2196F3"; // En progreso - azul
//           default:
//             return "#9E9E9E"; // No iniciado - gris
//         }
//       };

//       // Animación de hover
//       useFrame(() => {
//         if (ref.current && isHovered) {
//           ref.current.position.y =
//             position[1] + Math.sin(Date.now() * 0.005) * 0.3;
//         } else if (ref.current) {
//           ref.current.position.y = position[1];
//         }
//       });

//       return (
//         <mesh
//           ref={ref}
//           position={position}
//           castShadow
//           onPointerOver={() => setHoveredApt(apt.id.toString())}
//           onPointerOut={() => setHoveredApt(null)}
//           onClick={(e) => {
//             e.stopPropagation();
//             onAptClick(apt.id); // Ejecuta la función pasada desde Tower3DView
//           }}
//         >
//           <boxGeometry args={[1.8, 2.5, 1.8]} />
//           <meshStandardMaterial
//             color={getColor()}
//             transparent={!isCurrentFloor}
//             opacity={isCurrentFloor ? 1 : 0.6}
//             emissive={isHovered ? "#ffffff" : "#000000"}
//             emissiveIntensity={isHovered ? 0.2 : 0}
//           />
//           {(isHovered || isCurrentFloor) && (
//             <Text
//               position={[0, 1.8, 0]}
//               fontSize={0.5}
//               color="black"
//               anchorX="center"
//               anchorY="middle"
//             >
//               {apt.consecutivo}
//             </Text>
//           )}
//         </mesh>
//       );
//     };

//     // Componente de piso
//     const Floor = ({
//       floorNum,
//       apartments,
//       index,
//     }: {
//       floorNum: string;
//       apartments: Apartment[];
//       index: number;
//     }) => {
//       const floorHeight = index * 4;
//       const isCurrentFloor = currentFloor === floorNum;

//       return (
//         <group position={[0, floorHeight, 0]}>
//           {/* Base del piso */}
//           <mesh position={[0, -1.5, 0]} receiveShadow>
//             <boxGeometry args={[10, 0.3, 10]} />
//             <meshStandardMaterial color="#b0bec5" />
//           </mesh>

//           {/* Columnas estructurales */}
//           {[
//             [5, 0, 5],
//             [-5, 0, 5],
//             [5, 0, -5],
//             [-5, 0, -5],
//           ].map((pos, i) => (
//             <mesh key={i} position={[pos[0], 1, pos[2]]} castShadow>
//               <cylinderGeometry args={[0.4, 0.4, 3, 8]} />
//               <meshStandardMaterial color="#78909c" />
//             </mesh>
//           ))}

//           {/* Apartamentos */}
//           {apartments.map((apt, i) => {
//             const angle = (i / apartments.length) * Math.PI * 2;
//             const radius = 5;
//             const x = Math.cos(angle) * radius;
//             const z = Math.sin(angle) * radius;

//             return (
//               <ApartmentCube
//                 key={apt.id}
//                 apt={apt}
//                 position={[x, 0, z]}
//                 floorIndex={index}
//               />
//             );
//           })}

//           {/* Etiqueta del piso */}
//           <Text
//             position={[0, -2, 0]}
//             fontSize={0.8}
//             color={isCurrentFloor ? "#FF5722" : "#607D8B"}
//             anchorX="center"
//             anchorY="middle"
//           >
//             Piso {floorNum}
//           </Text>
//         </group>
//       );
//     };

//     return (
//       <group ref={towerRef}>
//         {Object.entries(floors).map(([floorNum, apts], index) => (
//           <Floor
//             key={floorNum}
//             floorNum={floorNum}
//             apartments={apts}
//             index={index}
//           />
//         ))}
//       </group>
//     );
//   };

//   // Función auxiliar para traducir el estado
//   const getStatusText = (status: string): string => {
//     switch (status) {
//       case "2":
//         return "Completado";
//       case "1":
//         return "En progreso";
//       default:
//         return "No iniciado";
//     }
//   };

//   return (
//     <div
//       style={{
//         height: "600px",
//         width: "100%",
//         background: "linear-gradient(to bottom, #eceff1, #cfd8dc)",
//         borderRadius: "8px",
//         overflow: "hidden",
//         position: "relative",
//       }}
//     >
//       {/* Canvas 3D */}
//       <Canvas shadows camera={{ fov: 50 }}>
//         <ambientLight intensity={0.6} />
//         <spotLight
//           position={[25, 30, 25]}
//           angle={0.25}
//           intensity={1.2}
//           castShadow
//           shadow-mapSize-width={2048}
//           shadow-mapSize-height={2048}
//         />
//         <pointLight position={[-15, 20, -15]} intensity={0.5} />

//         <TowerScene onAptClick={handleAptClick} />

//         <OrbitControls
//           enablePan={true}
//           enableZoom={true}
//           enableRotate={true}
//           minDistance={15}
//           maxDistance={50}
//         />
//       </Canvas>

//       {/* Indicador de carga */}
//       {loading && (
//         <div
//           style={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             backgroundColor: "rgba(0,0,0,0.7)",
//             color: "white",
//             padding: "10px 20px",
//             borderRadius: "4px",
//             zIndex: 999,
//           }}
//         >
//           Cargando información...
//         </div>
//       )}

//       {/* Modal de información del apartamento */}
//       {selectedApt && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: "rgba(0,0,0,0.5)",
//             zIndex: 1000,
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//           onClick={() => setSelectedApt(null)}
//         >
//           <div
//             style={{
//               backgroundColor: "white",
//               padding: "25px",
//               borderRadius: "10px",
//               width: "450px",
//               maxWidth: "95%",
//               boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
//             }}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h3
//               style={{
//                 marginTop: 0,
//                 marginBottom: "20px",
//                 color: "#2c3e50",
//                 borderBottom: "1px solid #eee",
//                 paddingBottom: "10px",
//               }}
//             >
//               Información del Apartamento
//             </h3>

//             <div style={{ marginBottom: "20px" }}>
//                 <div style={{ display: "flex", marginBottom: "8px" }}>
//                 <strong style={{ width: "150px" }}>Quien Confirmo:</strong>
//                 <span>{selectedApt.nombre ? selectedApt.nombre : "--"}</span>
//               </div>
//               <div style={{ display: "flex", marginBottom: "8px" }}>
//                 <strong style={{ width: "150px" }}>Consecutivo:</strong>
//                 <span>{selectedApt.consecutivo}</span>
//               </div>
//               <div style={{ display: "flex", marginBottom: "8px" }}>
//                 <strong style={{ width: "150px" }}>Torre:</strong>
//                 <span>{selectedApt.torre}</span>
//               </div>
//               <div style={{ display: "flex", marginBottom: "8px" }}>
//                 <strong style={{ width: "150px" }}>Piso:</strong>
//                 <span>{selectedApt.piso}</span>
//               </div>
//               <div style={{ display: "flex", marginBottom: "8px" }}>
//                 <strong style={{ width: "150px" }}>Apartamento:</strong>
//                 <span>{selectedApt.apartamento}</span>
//               </div>
//               <div style={{ display: "flex", marginBottom: "8px" }}>
//                 <strong style={{ width: "150px" }}>Estado:</strong>
//                 <span>{getStatusText(selectedApt.estado)}</span>
//               </div>
//               <div style={{ display: "flex", marginBottom: "8px" }}>
//                 <strong style={{ width: "150px" }}>Fecha habilitado:</strong>
//                 <span>
//                   {selectedApt.fecha_habilitado ? new Date(selectedApt.fecha_habilitado).toLocaleDateString() : "--"}
//                 </span>
//               </div>
//               {selectedApt.fecha_fin && (
//                 <div style={{ display: "flex", marginBottom: "8px" }}>
//                   <strong style={{ width: "150px" }}>
//                     Fecha finalización:
//                   </strong>
//                   <span>
//                     {new Date(selectedApt.fecha_fin).toLocaleDateString()}
//                   </span>
//                 </div>
//               )}
//             </div>

//             <button
//               onClick={() => setSelectedApt(null)}
//               style={{
//                 padding: "10px 20px",
//                 backgroundColor: "#3498db",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "5px",
//                 cursor: "pointer",
//                 fontSize: "16px",
//                 transition: "all 0.3s ease",
//                 width: "100%",
//               }}
//               onMouseOver={(e) => {
//                 e.currentTarget.style.backgroundColor = "#2980b9";
//               }}
//               onMouseOut={(e) => {
//                 e.currentTarget.style.backgroundColor = "#3498db";
//               }}
//             >
//               Cerrar
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Tower3DView;


import React, { useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { detalleApt } from "@/services/graficasDashboard/proyectosAPI";

interface Apartment {
  id: number;
  user_id: number;
  proyecto_id: number;
  torre: string;
  piso: string;
  apartamento: string;
  consecutivo: string;
  orden_proceso: string;
  procesos_proyectos_id: number;
  text_validacion: string | null;
  fecha_ini_torre: string | null;
  estado: string;
  fecha_habilitado: string;
  validacion: number;
  estado_validacion: number;
  fecha_validacion: string | null;
  fecha_fin: string;
  created_at: string;
  updated_at: string;
  nombre?: string;
}

interface Tower3DViewProps {
  floors: Record<string, Apartment[]>;
  currentFloor: string;
}

const Tower3DView: React.FC<Tower3DViewProps> = ({ floors, currentFloor }) => {
  const [selectedApt, setSelectedApt] = useState<Apartment | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAptClick = async (aptId: number) => {
    setLoading(true);
    try {
      const { data } = await detalleApt({ id: aptId });
      setSelectedApt(data.data);
    } catch (error) {
      console.error("Error fetching apartment info:", error);
    } finally {
      setLoading(false);
    }
  };

  const TowerScene = ({ onAptClick }: { onAptClick: (aptId: number) => void }) => {
    const { camera } = useThree();
    const towerRef = useRef<THREE.Group>(null);
    const [hoveredApt, setHoveredApt] = useState<string | null>(null);

    // Configuración inicial de la cámara (centrada)
    React.useEffect(() => {
      camera.position.set(0, 15, 25);
      camera.lookAt(0, 10, 0);
    }, [camera]);

    const ApartmentCube = ({
      apt,
      position,
      floorIndex,
    }: {
      apt: Apartment;
      position: [number, number, number];
      floorIndex: number;
    }) => {
      const isCurrentFloor = currentFloor === String(floorIndex + 1);
      const isHovered = hoveredApt === apt.id.toString();

      const getColor = () => {
        switch (apt.estado) {
          case "2": return "#4CAF50";
          case "1": return "#2196F3";
          default: return "#9E9E9E";
        }
      };

      return (
        <mesh
          position={position}
          castShadow
          onPointerOver={() => setHoveredApt(apt.id.toString())}
          onPointerOut={() => setHoveredApt(null)}
          onClick={(e) => {
            e.stopPropagation();
            onAptClick(apt.id);
          }}
        >
          <boxGeometry args={[1.8, 2.5, 1.8]} />
          <meshStandardMaterial
            color={getColor()}
            transparent={!isCurrentFloor}
            opacity={isCurrentFloor ? 1 : 0.6}
          />
          {(isHovered || isCurrentFloor) && (
            <Text
              position={[0, 1.8, 0]}
              fontSize={0.5}
              color="black"
              anchorX="center"
              anchorY="middle"
            >
              {apt.consecutivo}
            </Text>
          )}
        </mesh>
      );
    };

    const Floor = ({
      floorNum,
      apartments,
      index,
    }: {
      floorNum: string;
      apartments: Apartment[];
      index: number;
    }) => {
      const floorHeight = index * 4;
      const isCurrentFloor = currentFloor === floorNum;

      return (
        <group position={[0, floorHeight, 0]}>
          <mesh position={[0, -1.5, 0]} receiveShadow>
            <boxGeometry args={[10, 0.3, 10]} />
            <meshStandardMaterial color="#b0bec5" />
          </mesh>

          {apartments.map((apt, i) => {
            const angle = (i / apartments.length) * Math.PI * 2;
            const radius = 5;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;

            return (
              <ApartmentCube
                key={apt.id}
                apt={apt}
                position={[x, 0, z]}
                floorIndex={index}
              />
            );
          })}

          <Text
            position={[0, -2, 0]}
            fontSize={0.8}
            color={isCurrentFloor ? "#FF5722" : "#607D8B"}
            anchorX="center"
            anchorY="middle"
          >
            Piso {floorNum}
          </Text>
        </group>
      );
    };

    return (
      <group ref={towerRef}>
        {Object.entries(floors).map(([floorNum, apts], index) => (
          <Floor
            key={floorNum}
            floorNum={floorNum}
            apartments={apts}
            index={index}
          />
        ))}
      </group>
    );
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case "2": return "Completado";
      case "1": return "En progreso";
      default: return "No iniciado";
    }
  };

  return (
    <div style={{
      height: "600px",
      width: "100%",
      background: "linear-gradient(to bottom, #eceff1, #cfd8dc)",
      borderRadius: "8px",
      overflow: "hidden",
      position: "relative",
    }}>
      <Canvas shadows camera={{ fov: 50 }}>
        <ambientLight intensity={0.6} />
        <spotLight
          position={[25, 30, 25]}
          angle={0.25}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-15, 20, -15]} intensity={0.5} />

        <TowerScene onAptClick={handleAptClick} />

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={15}
          maxDistance={50}
          target={[0, 10, 0]} // Mantiene el centro de rotación en la torre
        />
      </Canvas>

      {loading && (
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "rgba(0,0,0,0.7)",
          color: "white",
          padding: "10px 20px",
          borderRadius: "4px",
          zIndex: 999,
        }}>
          Cargando información...
        </div>
      )}

      {selectedApt && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => setSelectedApt(null)}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "25px",
              borderRadius: "10px",
              width: "450px",
              maxWidth: "95%",
              boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{
              marginTop: 0,
              marginBottom: "20px",
              color: "#2c3e50",
              borderBottom: "1px solid #eee",
              paddingBottom: "10px",
            }}>
              Información del Apartamento
            </h3>

            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", marginBottom: "8px" }}>
                <strong style={{ width: "150px" }}>Quien Confirmo:</strong>
                <span>{selectedApt.nombre ? selectedApt.nombre : "--"}</span>
              </div>
              <div style={{ display: "flex", marginBottom: "8px" }}>
                <strong style={{ width: "150px" }}>Consecutivo:</strong>
                <span>{selectedApt.consecutivo}</span>
              </div>
              <div style={{ display: "flex", marginBottom: "8px" }}>
                <strong style={{ width: "150px" }}>Torre:</strong>
                <span>{selectedApt.torre}</span>
              </div>
              <div style={{ display: "flex", marginBottom: "8px" }}>
                <strong style={{ width: "150px" }}>Piso:</strong>
                <span>{selectedApt.piso}</span>
              </div>
              <div style={{ display: "flex", marginBottom: "8px" }}>
                <strong style={{ width: "150px" }}>Apartamento:</strong>
                <span>{selectedApt.apartamento}</span>
              </div>
              <div style={{ display: "flex", marginBottom: "8px" }}>
                <strong style={{ width: "150px" }}>Estado:</strong>
                <span>{getStatusText(selectedApt.estado)}</span>
              </div>
              <div style={{ display: "flex", marginBottom: "8px" }}>
                <strong style={{ width: "150px" }}>Fecha habilitado:</strong>
                <span>
                  {selectedApt.fecha_habilitado ? new Date(selectedApt.fecha_habilitado).toLocaleDateString() : "--"}
                </span>
              </div>
              {selectedApt.fecha_fin && (
                <div style={{ display: "flex", marginBottom: "8px" }}>
                  <strong style={{ width: "150px" }}>Fecha finalización:</strong>
                  <span>
                    {new Date(selectedApt.fecha_fin).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedApt(null)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#3498db",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
                transition: "all 0.3s ease",
                width: "100%",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#2980b9";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#3498db";
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tower3DView;