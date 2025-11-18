const useSessionStorage = () => {
  const getSessionVariable = (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error getting session storage:', error);
      return null;
    }
  };

  const setSessionVariable = (key: string, value: string): void => {
    try {
      sessionStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting session storage:', error);
    }
  };

  const removeSessionVariable = (key: string): void => {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing session storage:', error);
    }
  };

  return {
    getSessionVariable,
    setSessionVariable,
    removeSessionVariable,
  };
};

export default useSessionStorage;