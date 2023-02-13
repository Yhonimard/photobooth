import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import secureLS from "secure-ls";
var ls = new secureLS({ encodingType: "aes", encryptionSecret: "mato@booth" });

Vue.config.productionTip = false;
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    allowed: false,
    payment: {},
    transaction: {},
  },
  mutations: {
    transaction(state, val) {
      state.transaction = val;
    },
    allowed(state, val) {
      state.allowed = val;
    },
    payment(state, val) {
      state.payment = val;
    },
  },
  plugins: [
    createPersistedState({
      storage: {
        getItem: (key) => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: (key) => ls.remove(key),
      },
    }),
  ],
});
