import axios from 'axios';

const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    // baseURL: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
    baseURL: 'http://127.0.0.1:8081',
    timeout: 5000
});

/*service.interceptors.request.use(
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
        console.log(response)
        if (response.status === 200) {
            return response.data;
        } else {
            Promise.reject();
        }
    },
    error => {
        //console.log(error);
        //console.log(error.response);
        alert(error.response.data.message);
        return Promise.reject();
    }
);*/

service.interceptors.request.use(config => {
    return config
  })


service.interceptors.response.use(config => {
    return config
})

export default service;
