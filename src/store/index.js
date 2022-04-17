import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
const APIURL = 'http://localhost:3000'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    users: [],
    selectedUser: [],
  },

  getters: {
    getAllUsers: (state) => state.users,
    getSelectedUser: (state) => state.selectedUser,
  },

  actions: {
    async fetchAllUsers({ commit }) {
      axios.get(`${APIURL}/users`).then((response) => {
        commit('fetch_users', response.data)
      })
    },
    async addUser({ commit }, data) {
      axios.post(`${APIURL}/users`, data).then((response) => {
        commit('add_user', response.data)
      })
    },
    async setSelectedUser({ commit }, id) {
      axios.get(`${APIURL}/users/${id}`).then((response) => {
        commit('set_selected_user', response.data)
      })
    },
    async updateUser({ commit }, { data, id }) {
      axios.put(`${APIURL}/users/${id}`, data).then((response) => {
        commit('update_user', response.data)
      })
    },
    async deleteUser({ commit }, id) {
      axios.delete(`${APIURL}/users/${id}`).then((response) => {
        commit('delete_user', response.data)
      })
    },
  },

  mutations: {
    fetch_users(state, data) {
      state.users = data
    },
    add_user(state, data) {
      state.users.push(data)
    },
    update_user(state, data) {
      let pos = state.users.findIndex((user) => user.id === data.id)
      state.users[pos] = data
    },
    delete_user(state, id) {
      let index = state.users.findIndex((user) => user.id === id)
      state.users.splice(index, 1)
    },
    set_selected_user(state, data) {
      state.selectedUser = data
    },
  },
})

export default store
