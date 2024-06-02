import { Dispatch, ReactNode, SetStateAction, createContext, useState } from "react";

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

  return <UserContext.Provider value={{ username, setUsername, id, setId }}>{children}</UserContext.Provider>;
}
