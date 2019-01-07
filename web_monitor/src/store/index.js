import Vue from "vue";
import Vuex from "vuex";
import Lockr from "lockr";
Lockr.prefix = 'JC_serverMonitor_';
const NOT_LOGIN = 0
Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    userStatus: Lockr.get('user_status') || NOT_LOGIN,
    currentPage: "currentStatus",
    currentNode: "XX"
  },
  mutations: {
    SET_USER_STATUS(state, status) {
      state.userStatus = status
      Lockr.set('user_status', status)
    },
    SET_CURRENT_PAGE(state, pageName) {
      Vue.set(state, 'currentPage', pageName)
    },
    SET_CURRENT_NODE(state, nodeName) {
      Vue.set(state, 'currentNode', nodeName)
    }
  },
  actions: {
    updateUserStatus: ({
      commit
    }, status) => commit('SET_USER_STATUS', status),
    updateCurrentPage: ({
      commit
    }, pageName) => commit('SET_CURRENT_PAGE', pageName),
    updateCurrentNode: ({
      commit
    }, nodeName) => commit('SET_CURRENT_NODE', nodeName)
  },
  getters: {
    userStatus: state => state.userStatus,
    currentPage: state => state.currentPage,
    currentNode: state => state.currentNode,
    isLogin: state => state.userStatus !== NOT_LOGIN
  }
});

export default store;