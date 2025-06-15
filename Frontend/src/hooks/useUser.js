import { useContext } from "react";
import {AuthContext} from '../Features/userContext'

const useUser = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { useUser };
