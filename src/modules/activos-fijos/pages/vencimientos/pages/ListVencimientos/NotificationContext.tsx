// import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// interface Notification {
//   message: string;
//   type: 'error' | 'warning' | 'info';
// }

// interface NotificationContextProps {
//   notifications: Notification[];
//   addNotification: (notification: Notification) => void;
// }

// interface NotificationProviderProps {
//   children: ReactNode;
// }

// const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

// export const useNotifications = () => {
//   const context = useContext(NotificationContext);
//   if (!context) {
//     throw new Error('useNotificationContext must be used within a NotificationProvider');
//   }
//   return context;
// };

// export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
//   const [notifications, setNotifications] = useState<Notification[]>([]);

//   const addNotification = (notification: Notification) => {
//     setNotifications((prevNotifications) => [...prevNotifications, notification]);
//   };

//   useEffect(() => {
//     const loadInitialNotifications = async () => {
//       // Lógica para cargar notificaciones iniciales
//     };

//     loadInitialNotifications();
//   }, []);

//   return (
//     <NotificationContext.Provider value={{ notifications, addNotification }}>
//       {children}
//     </NotificationContext.Provider>
//   );
// };





