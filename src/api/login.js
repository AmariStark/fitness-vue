// 登录相关
import request from "@/utils/request"

export function login(datas){
    return request({
        method: "post",
        url: "/login",
        data: datas
    })
}

// 个人信息
export function getInfo(){
    return request({
        method: "get",
        url: "/getInfo",
    })
}

// 退出登录
export function logout(){
    return request({
        method: "post",
        url: "/logout",
    })
}
