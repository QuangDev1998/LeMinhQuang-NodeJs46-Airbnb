import { http } from "./config";

export const authServices = {
  login: (user) => http.post("/auth/signin", user),
  register: (user) => http.post("/auth/signup", user),
};
