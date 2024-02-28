import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      userDetails: {},
    };
  },
  mutations: {
    setUserDetails(state, payload) {
      state.userDetails = payload;
    },
  },
});

export default store
