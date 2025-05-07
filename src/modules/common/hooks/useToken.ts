import { useState } from "react";

export default function useToken() {
  const getToken = () => {
    return localStorage.getItem("token");
  };

  const [token, setToken] = useState<string | null>(getToken());

  const saveToken = (token: string) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const removeToken = () => {
    setToken(null);
    localStorage.clear();
  };

  return {
    setToken: saveToken,
    token,
    removeToken,
    getToken,
  };
}
