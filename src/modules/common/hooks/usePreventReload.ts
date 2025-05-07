/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';

const usePreventReload = (shouldPrevent: boolean) => {
  useEffect(() => {
    const handleBeforeUnload = (event: any) => {
      if (shouldPrevent) {
        event.preventDefault();
        // Para navegadores antiguos
        event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [shouldPrevent]);
};

export default usePreventReload;
