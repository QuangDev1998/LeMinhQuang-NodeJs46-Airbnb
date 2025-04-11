import axios from "axios";
import { store } from "../redux/store";
import { turnOffLoading, turnOnLoading } from "../redux/slices/spinnerSlice";

export const http = axios.create({
  baseURL: "http://localhost:3001/api",
});

// Add a request interceptor
http.interceptors.request.use(
  function (config) {
    store.dispatch(turnOnLoading());
    const rawLoginData = localStorage.getItem("USER_LOGIN");
    const loginData = rawLoginData ? JSON.parse(rawLoginData) : null;
    if (loginData?.access_token) {
      config.headers.Authorization = `Bearer ${loginData.access_token}`;
    }
    return config;
  },
  function (error) {
    console.log(2);
    store.dispatch(turnOnLoading());
    return Promise.reject(error);
  }
);

// Add a response interceptor
http.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    store.dispatch(turnOffLoading());

    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    store.dispatch(turnOffLoading());
    return Promise.reject(error);
  }
);
