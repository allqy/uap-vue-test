import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import{getSessionStorageItem} from '../utils/session_storage'

export default new Vuex.Store({
    state: {
        //用户信息
        userInfo: getSessionStorageItem("userInfo") || {}
    },
    getters :{
        //获取用户信息
        getUserInfo(state) {
            return state.userInfo;
        }
    },
    mutations :{
        //设置用户信息
        setUserInfo(state,payload){
            state.userInfo=JSON.parse(payload);
        }
    },
    actions :{},
    modules :{}
})