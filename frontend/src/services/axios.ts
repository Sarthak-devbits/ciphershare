import axios from "axios";

const SERVER_URL = process.env.REACT_APP_API_URL;
const API_PATH = "api/";

const instance = axios.create({
  baseURL: `${SERVER_URL}/${API_PATH}`,
  headers: {
    "Content-Type": "application/json",
  },
});

const axiosInstances = {
  instance,
};

export default axiosInstances;
