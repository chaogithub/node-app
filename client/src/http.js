import axios from 'axios';
import { Message, Loading } from 'element-ui';
import router from './router'

let loading;

function startLoading() {
    loading = Loading.service({
        lock: true,
        text: '拼命加载中...',
        background: 'rgba(0, 0, 0, 0.7)'
    });
    return loading;
}


function endLoading() {
    // console.log("loading: ", loading)
    loading && loading.close();
    setTimeout(() => { loading && loading.close(); }, 5000)
}

//请求拦截
axios.interceptors.request.use(config => {
    startLoading();
    // 设置请求header
    if (localStorage.eleToken)
        config.headers.Authorization = localStorage.eleToken;
    return config;
}, error => {
    return Promise.reject(error);
})

//响应拦截
axios.interceptors.response.use(response => {
    endLoading();
    return response;
}, error => {
    endLoading();
    Message.error(error.response.data);

    // 利用后端状态码，看token是否过期
    const { status } = error.response
    if (status == 401) {
        Message.error('token值无效，请重新登录');
        // 清除token
        localStorage.removeItem('eleToken');
        // 页面跳转
        router.push('/login')
    }
    return Promise.reject(error);
})

export default axios;