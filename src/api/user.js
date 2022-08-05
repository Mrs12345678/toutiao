import axios from './index.js'

export function login(params){
    return axios.post('/user/login',params)
}
export function reg(params){
    return axios.post('/user/reg',params)
}

export function sendSms(params){
    return axios.post('/user/sendSms',params)
}
export function delete_user(params){
    return axios.post('/user/delete_user',params)
}
export function getUserInfo(params){
    return axios.post('/user/getuserInfo',params)
}
export function editUserInfo(params){
    return axios.post('/user/editUserInfo',params)
}