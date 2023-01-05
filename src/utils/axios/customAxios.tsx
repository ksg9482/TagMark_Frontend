import axios, { AxiosInstance } from 'axios';
import config from '../../config';
import { getRefresh } from './refreshTokenInterceptor';
const getToken = (key:string) => {
return localStorage.getItem(key) || 'token not found'
}
export const customAxios: AxiosInstance = axios.create({
  baseURL: `${config.SERVER_HOST}/api`,
  withCredentials: true,
  headers: { Authorization: `Bearer ${getToken('accessToken')}`}
});

customAxios.interceptors.response.use(
  reponse => { return reponse },
  error => { return getRefresh(error) }
);