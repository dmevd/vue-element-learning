import request from './request';

const api = {};
const apiUrl = 'api/route';


const client = function(model, action, params){
    return {
        head:{
            model,
            action,
            userId: localStorage.getItem("GLO_userId")
        },
        body:params
    }
};

api.userService= (action, data) => {
    return request({
        url: apiUrl,
        method: 'post',
        data: client('userService', action, data)
    })
};

api.unitService= (action, data) => {
    return request({
        url: apiUrl,
        method: 'post',
        data: client('unitService', action, data)
    })
};
export default api
