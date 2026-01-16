import api from "./api";
import { AuthResponse } from "../types/user.type";

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  register: async (
    username: string,
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    const response = await api.post("/auth/register", {
      username,
      email,
      password,
    });
    return response.data;
  },
};
