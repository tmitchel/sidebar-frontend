import Vue from "vue";
import Vuex from "vuex";
import actions from "./store/actions";
import mutations from "./store/mutations";

Vue.use(Vuex);

const defaultUser = {
  id: -1,
  Username: "Default User",
  Email: "user@email.com"
};

export default new Vuex.Store({
  state: {
    connected: false,
    token: "",
    alert: {},
    workspaces: [],
    user: defaultUser,
    currentChannel: {},
    usersInChannel: [],
    messages: [],
    channels: [],
    event: {}
  },
  mutations,
  actions
});
