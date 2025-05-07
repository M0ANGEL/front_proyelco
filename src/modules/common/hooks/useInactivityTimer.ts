/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

const useInactivityTimer = (inactivityTime: number): number => {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;

    const resetTimer = () => {
      setTimer(0);
    };

    const handleActivity = () => {
      if (timer >= inactivityTime) {
        // Mostrar la alerta o realizar cualquier otra acción necesaria
        // alert('La sesión se cerrará automáticamente.');
        resetTimer();
      } else {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          // Mostrar la alerta o realizar cualquier otra acción necesaria
          //   alert('La sesión se cerrará automáticamente.');
          resetTimer();
        }, inactivityTime * 60 * 1000); // Convertir minutos a milisegundos
      }
    };

    const startTimer = () => {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 60000); // Incrementa el contador cada minuto (60000 ms)

      resetTimer();
    };

    const handleEvent = () => {
      handleActivity();
      resetTimer();
    };

    startTimer();

    document.addEventListener("visibilitychange", handleEvent);
    document.addEventListener("mousemove", handleEvent);
    document.addEventListener("keydown", handleEvent);
    window.addEventListener('beforeunload', handleEvent);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      window.addEventListener('beforeunload', handleEvent);
      document.removeEventListener("visibilitychange", handleEvent);
      document.removeEventListener("mousemove", handleEvent);
      document.removeEventListener("keydown", handleEvent);
    };
  }, [inactivityTime]);

  return timer;
};

export default useInactivityTimer;
