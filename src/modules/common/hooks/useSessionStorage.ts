import CryptoJS from "crypto-js";
import { API_KEY } from "@/config/api";

function useSessionStorage() {
  const iv = CryptoJS.lib.WordArray.random(16);

  const getSessionVariable = (key: string) => {
    return CryptoJS.AES.decrypt(
      localStorage.getItem(key) ?? "".toString(),
      API_KEY,
      { iv: iv }
    ).toString(CryptoJS.enc.Utf8);
  };

  const setSessionVariable = (key: string, newValue: string) => {
    localStorage.setItem(
      key,
      CryptoJS.AES.encrypt(newValue, API_KEY, { iv: iv }).toString()
    );
  };

  const clearSessionVariable = (key: string) => {
    localStorage.removeItem(key);
  };

  const clearAllVariables = () => {
    localStorage.clear();
  };

  return {
    getSessionVariable,
    setSessionVariable,
    clearSessionVariable,
    clearAllVariables,
  };
}

export default useSessionStorage;
