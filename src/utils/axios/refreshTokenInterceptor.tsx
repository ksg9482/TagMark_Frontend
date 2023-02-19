import axios, { AxiosError } from 'axios';
import serverConfig from '../../config';

export const getRefresh = async (error: AxiosError | any) => {
    const accessToken: string = localStorage.getItem('accessToken') ? localStorage.getItem('accessToken')! : '';
    
     if(error.response?.data.message === 'TokenExpiredError') {
        let originalRequest = error.config;
        const getAccessToken: any = await axios.get(
            `${serverConfig.SERVER_HOST}/api/user/refresh`,
            { withCredentials: true, headers:{ Authorization: `Bearer ${accessToken}`} }
          );
        localStorage.setItem('accessToken', getAccessToken.data.accessToken)

        axios.defaults.headers.common.Authorization = `Bearer ${getAccessToken.data.accessToken}`;
        originalRequest.headers!.Authorization = `Bearer ${getAccessToken.data.accessToken}`;
        return axios(originalRequest);
     }
    
    return error.response;
  }