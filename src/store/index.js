import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      userDetails: {},
      
      emailRules: [
        v => !!v || 'Email is required',
        v => /^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/i.test(v) || 'Please enter valid Email'
      ],

      passwordRules: [
        v => !!v || 'Password is required',
        v => v.length>=8 || "Minimum 8 characters are required"
      ],

    };
  },
  mutations: {
    setUserDetails(state, payload) {
      state.userDetails = payload;
    },
  },
});

export default store
