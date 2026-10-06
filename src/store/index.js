import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import user from "./modules/user"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 侧边栏是否折叠
    isCollapse: false
  },
  getters: {},
  mutations: {
    // 切换侧边栏折叠状态
    setIsCollapse(state, value) {
      state.isCollapse = value
    }
  },
  actions: {
    toggleCollapse({ commit, state }) {
      commit('setIsCollapse', !state.isCollapse)
    }
  },
  modules: {
    user
  },
  // 刷新页面后登录态与用户信息不丢失
  plugins: [
    createPersistedState({
      key: 'fitness-vue',
      paths: ['user', 'isCollapse']
    })
  ]
})
