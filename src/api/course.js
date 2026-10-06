import request from "@/utils/request"

export function selectAllCourseList(){
    return request({
        method: "get",
        url: "/course/list",
    })
}

export function getById(id){
    return request({
        method: "get",
        url: "/course/detail/"+id,
        //http://localhost:8088/course/detail/id
    })
}

export function addCourse(data){
    return request({
        method: "post",
        url: "/course/add",
        data: data
    })
}

export function updateCourse(data){
    return request({
        method: "post",
        url: "/course/update",
        data: data
    })
}

export function deleteCourse(id){
    return request({
        method: "delete",
        url: "/course/delete/"+id
    })
}
