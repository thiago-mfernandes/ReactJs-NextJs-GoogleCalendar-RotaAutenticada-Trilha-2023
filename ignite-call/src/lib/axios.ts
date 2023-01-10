import axios from "axios";

export const api = axios.create({
  // o back-end e o front-end nesse caso estao na mesma url
  baseURL: '/api',
})