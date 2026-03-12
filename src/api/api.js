import axios from "axios";
import { getToken } from "../utils/auth";

const api = axios.create({
  baseURL: "https://apifirstapp.onrender.com/api"
  // baseURL: "http://10.0.2.2:8081/api"
});

api.interceptors.request.use(async (config) => {

  const token = await getToken();

  if(token){
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;

});

export default api;