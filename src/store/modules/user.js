import { getInfo, logout } from "@/api/login"
import router from "@/router"

const state = {
    token: localStorage.getItem('token') || "",
    name: "",
    nickName: "",
    avatar: ""
}

const getters = {
    isLogin(state) {
        return !!state.token
    }
}

const mutations = {
    SET_TOKEN(state, token) {
        state.token = token || ''
        if (token) {
            localStorage.setItem('token', token)
        } else {
            localStorage.removeItem('token')
        }
    },
    SET_NAME(state, name) {
        state.name = name
    },
    SET_AVATAR(state, avatar) {
        state.avatar = avatar
    },
    REMOVE_TOKEN(state) {
        state.token = ''
        state.name = ''
        state.avatar = ''
        localStorage.removeItem('token')
    }
}

const actions = {
    // 获取个人信息，并把 Promise 返回给路由守卫使用
    getPerson({ commit }) {
        return getInfo().then(res => {
            if (res.code === 200) {
                commit('SET_NAME', res.data.nickName || res.data.username)
                commit('SET_AVATAR', res.data.avatar)
            }
            return res
        })
    },
    // 退出登录：通知后端作废 token，然后清理本地状态
    outLogin({ commit }) {
        return logout()
            .catch(() => {})
            .then(() => {
                commit('REMOVE_TOKEN')
                router.push({ path: "/login" })
            })
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
