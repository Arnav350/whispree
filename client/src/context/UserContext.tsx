import axios from "axios";
import { Dispatch, ReactNode, SetStateAction, createContext, useEffect, useState } from "react";

interface IProviderChildren {
  children: ReactNode;
}

interface IUserContext {
  username: string | null;
  setUsername: Dispatch<SetStateAction<string | null>>;
  id: string | null;
  setId: Dispatch<SetStateAction<string | null>>;
}

export const UserContext = createContext<IUserContext>({} as IUserContext);

export function UserContextProvider({ children }: IProviderChildren) {
  const [username, setUsername] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const token = document.cookie.split("; ").find((row) => row.startsWith("token="));

    if (token) {
      axios.get("/profile").then((res) => {
        setId(res.data.userId);
        setUsername(res.data.username);
      });
    }
  }, []);

  return <UserContext.Provider value={{ username, setUsername, id, setId }}>{children}</UserContext.Provider>;
}
