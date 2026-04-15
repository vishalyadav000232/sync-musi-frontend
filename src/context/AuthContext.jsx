import { createContext, useContext, useReducer, useEffect } from "react";
import { authReducer } from "./authReducer";
import { login as loginApi, getCurrentUser , signup as signupApi} from "../apis/auth";
import { getToken, setToken, removeToken } from "../utils/token_helper";

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true
};

export const AuthProvider = ({ children }) => {

  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {

    const initAuth = async () => {

      const token = getToken();

      if (!token) {
        dispatch({ type: "LOGOUT" });
        return;
      }

      try {

        const user = await getCurrentUser();

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: user
        });

      } catch {
        dispatch({ type: "LOGOUT" });
      }

    };

    initAuth();

  }, []);

  const login = async (data) => {

    dispatch({ type: "AUTH_LOADING" });

    const res = await loginApi(data);

    setToken(res.access_token);

    const user = await getCurrentUser();
    

    dispatch({
      type: "LOGIN_SUCCESS",
      payload: user
    });

    return res;
  };

  const signup = async (data) => {

  dispatch({ type: "AUTH_LOADING" });

  try {

    const res = await signupApi(data);

    
    setToken(res.access_token);

    const user = await getCurrentUser();

    dispatch({
      type: "LOGIN_SUCCESS",
      payload: user
    });

    return res;

  } catch (error) {

    dispatch({
      type: "AUTH_ERROR",
      payload: error.message
    });

    throw error;
  }
};

  const logout = () => {

    removeToken();

    dispatch({
      type: "LOGOUT"
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        signup
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);