import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
const basepath = process.env.NODE_ENV === "development" ? "http://localhost:8080" : "https://zeit.co/tmitchel/sidebar-frontend/i6s0uuohb";
const defaultUser = {
  id: -1,
  Username: "Default User",
  Email: "user@email.com"
};

export function createWebSocketPlugin(socket) {
  return store => {
    socket.onmessage = event => {
      console.log("got message");
      new Response(event.data).json().then(msg => {
        let new_messages = store.state.messages;
        new_messages.push(msg);
        store.commit("messages", new_messages);
      });
    };
    store.subscribe(mut => {
      if (mut.type === "sendMessages") {
        socket.send(JSON.stringify(mut.payload));
        console.log("sent message");
      }
    });
  };
}

export default new Vuex.Store({
  state: {
    user: defaultUser,
    currentChannel: {},
    usersInChannel: [],
    messages: [],
    channels: [],
    channelsForUser: [],
    event: {}
  },
  mutations: {
    updateUser(state, user) {
      state.user = user;
    },
    messages(state, messages) {
      state.messages = messages;
    },
    channels(state, channels) {
      state.channels = channels;
    },
    users(state, usersInChannel) {
      state.usersInChannel = usersInChannel;
    },
    updateCurrentChannel(state, channel) {
      state.currentChannel = channel;
    },
    channelsForUser(state, channels) {
      state.channelsForUser = channels;
    },
    addChannel(state, channel) {
      state.channelsForUser.push(channel);
      state.channels.push(channel);
    },
    sendMessages() {}
  },
  actions: {
    createChannel({ commit }, channel) {
      return new Promise((res, rej) => {
        fetch(`${basepath}/api/channel`, {
          method: "POST",
          mode: "cors",
          credentials: "include",
          body: JSON.stringify(channel)
        }).then(resp => {
          if (resp.status !== 200) {
            rej();
            return;
          }
          resp.json().then(resp => {
            commit("addChannel", resp);
            commit("updateCurrentChannel", resp);
            res();
          });
        });
      });
    },
    loadUser({ commit }, id) {
      fetch(`${basepath}/api/load_user/${id}`, {
        method: "GET",
        credentials: "include"
      })
        .then(resp => {
          resp.json().then(resp => {
            commit("updateUser", resp.User || {});
            commit("channelsForUser", resp.ChannelsForUser || []);
            commit("channels", resp.Channels || []);
          });
        })
        .catch(err => console.log(err));
    },
    loadChannel({ commit }, id) {
      fetch(`${basepath}/api/load_channel/${id}`, {
        method: "GET",
        credentials: "include"
      })
        .then(resp => {
          resp.json().then(resp => {
            commit("messages", resp.MessagesInChannel || []);
            commit("updateCurrentChannel", resp.Channel || {});
            commit("users", resp.UsersInChannel || []);
          });
        })
        .catch(err => console.log(err));
    },
    getMessages({ commit }, id) {
      fetch(`${basepath}/api/messages?channel=${id}`, {
        method: "GET",
        credentials: "include"
      }).then(resp => {
        resp.json().then(resp => {
          commit("messages", resp);
        });
      });
    },
    getChannels({ commit }) {
      fetch(`${basepath}/api/channels`, {
        method: "GET",
        credentials: "include"
      }).then(resp => {
        resp.json().then(resp => {
          commit("channels", resp);
        });
      });
    },
    getUsers({ commit }) {
      fetch(`${basepath}/api/users`, {
        method: "GET",
        credentials: "include"
      }).then(resp => {
        resp.json().then(resp => {
          commit("users", resp);
        });
      });
    },
    login({ commit }, payload) {
      return new Promise((res, rej) => {
        fetch(`${basepath}/login`, {
          method: "POST",
          mode: "cors",
          credentials: "include",
          body: JSON.stringify(payload)
        })
          .then(resp => {
            if (resp.status !== 200) {
              rej();
              return;
            }
            resp.json().then(resp => {
              commit("updateUser", resp);
              res();
            });
          })
          .catch(() => rej());
      });
    },
    signout({ commit }) {
      commit("updateUser", defaultUser);
    },
    refreshToken() {
      return new Promise((res, rej) => {
        fetch(`${basepath}/api/refresh_token`, {
          method: "POST",
          mode: "cors",
          credentials: "include"
        }).then(resp => {
          if (resp.status === 200 || resp.status == 425) {
            res();
            return;
          }
          rej();
        });
      });
    }
  }
});
