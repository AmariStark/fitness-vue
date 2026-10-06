import request from "@/utils/request"

export function selectAllUserList(){
    return request({
        method: "get",
        url: "/user/list",
    })
}

export function getById(id){
    return request({
        method: "get",
        url: "/user/detail/"+id,
        //http://localhost:8088/user/detail/id
    })
}

export function addUser(data){
    return request({
        method: "post",
        url: "/user/add",
        data: data
    })
}

export function updateUser(data){
    return request({
        method: "post",
        url: "/user/update",
        data: data
    })
}

export function deleteUser(id){
    return request({
        method: "delete",
        url: "/user/delete/"+id
    })
}
