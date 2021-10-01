export default {
  setUsers(state, payload) {
    state.users = payload
  },
  addUser(state, { id, data }) {
    state.users.push({ id, ...data })
  },
  updateUser(state, payload) {
    const user = state.users.find((emp) => emp.id === payload.id)

    if (user) {
      for (const key in payload.data) {
        user[key] = payload.data[key]
      }
    } else {
      state.users[payload.id] = {
        ...payload.data,
      }
    }
  },
}
