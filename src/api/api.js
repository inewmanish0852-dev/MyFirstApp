import axios from "axios";
import { getToken } from "../utils/auth";

const api = axios.create({
  baseURL: "http://10.0.2.2:8000/api"
});

api.interceptors.request.use(async (config) => {

  const token = await getToken();

  if(token){
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;

});

export default api;