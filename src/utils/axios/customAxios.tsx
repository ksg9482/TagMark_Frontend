import axios, { AxiosInstance } from 'axios';
import config from '../../config';
import { getRefresh } from './refreshTokenInterceptor';
const getToken = (key:string) => {
return localStorage.getItem(key) || 'token not found'
}
//여기서 미리 만들어봤자 헤더는 null값으로 이미 들어가있다. 그때 생성되는게 아니라, 이미 생성된 것을 쓰는 것.
export const customAxios: AxiosInstance = axios.create({
  baseURL: `${config.SERVER_HOST}/api`,
  withCredentials: true,
  headers: { Authorization: `Bearer ${getToken('accessToken')}`}
});

customAxios.interceptors.response.use(
  reponse => { return reponse },
  error => { return getRefresh(error) }
);