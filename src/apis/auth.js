import { setToken } from "../utils/token_helper";
import BaseApi from "./base";

export const login = async (payload) => {
  const formData = new URLSearchParams({
    username: payload.email,
    password: payload.password,
  });

  try {
    const response = await BaseApi.post(
      "/auth/login",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        withCredentials: true,
      }
    );

    const { access_token } = response.data;

    setToken(access_token);

    return response.data;

  } catch (error) {
    console.error(
      "Login Failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const signup = async (payload) => {
  try {
    const response = await BaseApi.post("/auth/signup", payload);

    return response.data;

  } catch (error) {
    console.error(
      "Signup Failed:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.detail || "Signup failed"
    );
  }
};


export const getCurrentUser = async () =>{
  try {
    const response = await BaseApi.get("auth/me")
    return response?.data
    
  } catch (error) {
    console.error("Un-authenticated : " , error.response?.data || error.message)

    throw new Error(
      error.response?.data?.detail || "Signup failed"
    )
    
  }
}