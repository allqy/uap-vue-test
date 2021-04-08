import axios from 'axios';
import {Message,Loading} from 'element-ui';
import {setSessionStorageItem,getSessionStorageItem} from './session_storage';

const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    // baseURL: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
    baseURL: 'http://127.0.0.1:8081',
    timeout: 5000
});

let loading  //定义loading变量

function startLoading() { //使用Element loading-start 方法
    loading = Loading.service({
        lock: true,
        text: '加载中……',
        background: 'rgba(0, 0, 0, 0.7)'
    })
}
function endLoading() { //使用Element loading-close 方法
    loading.close()
}

//那么 showFullScreenLoading() tryHideFullScreenLoading() 要干的事儿就是将同一时刻的请求合并。
//声明一个变量 needLoadingRequestCount，每次调用showFullScreenLoading方法 needLoadingRequestCount + 1。
//调用tryHideFullScreenLoading()方法，needLoadingRequestCount - 1。needLoadingRequestCount为 0 时，结束 loading。
let needLoadingRequestCount = 0
export function showFullScreenLoading() {
    if (needLoadingRequestCount === 0) {
        startLoading()
    }
    needLoadingRequestCount++
}

export function tryHideFullScreenLoading() {
    if (needLoadingRequestCount <= 0) return
    needLoadingRequestCount--
    if (needLoadingRequestCount === 0) {
        endLoading()
    }
}

service.interceptors.request.use(
    config => {
        config.headers.Authorization = getSessionStorageItem("token");
        showFullScreenLoading()
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        //console.log(response)
        if (response.status === 200) {
            if (response.headers && response.headers.token) {
                setSessionStorageItem("token", response.headers.token);
            }
            tryHideFullScreenLoading()
            return response.data;
        } else {
            Promise.reject();
        }
    },
    error => {
        //console.log(error);
        //console.log(error.response);
        if(error && error.response){
            error.message = error.response.data.message
        }else{
            error.message('连接服务器失败')
        }
        Message.error(error.message)
        tryHideFullScreenLoading()
        return Promise.reject()
    }
);

export default service;
