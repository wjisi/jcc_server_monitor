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
    currentNode: "XX",
    refreshTime: "",
    selectStatus: ""
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
    },
    SET_CURRENT_REFRESHTIME(state, refreshTime) {
      Vue.set(state, 'refreshTime', refreshTime)
    },
    SET_CURRENT_SELECTSTATUS(state, selectStatus) {
      Vue.set(state, 'selectStatus', selectStatus)
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
    }, nodeName) => commit('SET_CURRENT_NODE', nodeName),
    updateCurrentRefreshTime: ({
      commit
    }, refreshTime) => commit('SET_CURRENT_REFRESHTIME', refreshTime),
    updateCurrentSelectStatus: ({
      commit
    }, selectStatus) => commit('SET_CURRENT_SELECTSTATUS', selectStatus)

  },
  getters: {
    userStatus: state => state.userStatus,
    currentPage: state => state.currentPage,
    currentNode: state => state.currentNode,
    refreshTime: state => state.refreshTime,
    selectStatus: state => state.selectStatus,
    isLogin: state => state.userStatus !== NOT_LOGIN
  }
});

export default store;