import axios from 'axios';
import { MessageBox, Message } from 'element-ui'

let baseUrl = "http://localhost:9090/akkj/";
switch (process.env.NODE_ENV) {
    case 'development':
        // baseUrl = "http://localhost:9090/akkj/"  //开发环境url
        baseUrl = "http://114.67.101.174:8080/"   //生产环境url
        break
    case 'serve':
        baseUrl = "http://114.67.101.174:9090/"   //生产环境url
        break
}

const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    baseURL: baseUrl,
    timeout: 5000
});

service.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        let data = response.data;
        if (data.code === '200') {
            return data;
        } else if(data.code === '400'){
            localStorage.clear();
        }else {
            Message({
                message: data.msg || 'Error',
                type: 'error',
                duration: 2 * 1000
            });
            return Promise.reject(new Error(data.msg || 'Error'))
        }
    },
    error => {

        console.log(error);
        return Promise.reject();
    }
);

export default service;
