import { UserData } from "@/services/types";
import { createContext, useState, ReactNode } from "react";

interface GlobalContextType {
  userGlobal: UserData | undefined;
  setUserGlobal: (value: UserData) => void;
}

export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined
);

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const [userGlobal, setUserGlobal] = useState<UserData | undefined>(undefined);

  return (
    <GlobalContext.Provider value={{ userGlobal, setUserGlobal }}>
      {children}
    </GlobalContext.Provider>
  );
};
