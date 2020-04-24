import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
const basepath =
  process.env.NODE_ENV === "development"
    ? "https://localhost:8080"
    : "https://sidebar-backend.herokuapp.com";
const defaultUser = {
  id: -1,
  Username: "Default User",
  Email: "user@email.com"
};

export function createWebSocketPlugin(socket) {
  return store => {
    store.state.connected = true;
    socket.onmessage = event => {
      new Response(event.data).json().then(msg => {
        let new_messages = store.state.messages;
        new_messages.push(msg);
        store.commit("messages", new_messages);

        let new_channels = store.state.channels;
        if (msg.channel !== store.state.currentChannel.id) {
          for (let i = 0; i < new_channels.length; i++) {
            if (new_channels[i].id === msg.channel) {
              new_channels[i].Alert = true;
            }
          }
        }
        console.log("commit new channels");
        store.commit("channels", new_channels);
      });
    };
    store.subscribe(mut => {
      if (mut.type === "sendMessages") {
        socket.send(JSON.stringify(mut.payload));
      } else if (mut.type === "signout") {
        // socket.send(
        //   JSON.stringify({
        //     id: "",
        //     event: 69,
        //     content: "",
        //     to_user: "",
        //     from_user: "",
        //     channel: ""
        //   })
        // );
      }
    });
  };
}

export default new Vuex.Store({
  state: {
    connected: false,
    user: defaultUser,
    currentChannel: {},
    usersInChannel: [],
    messages: [],
    channels: [],
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
    addChannel(state, channel) {
      state.channels.push(channel);
    },
    sendMessages() {},
    signout() {}
  },
  actions: {
    uploadFiles(uploads) {
      return new Promise((res, rej) => {
        for (let ups of uploads) {
          fetch(`${basepath}/api/upload`, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            body: ups
          }).catch(err => rej(err));
        }
        res();
      });
    },
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
    createDirect({ commit }, { to_id, from_id, name, desc }) {
      return new Promise((res, rej) => {
        fetch(`${basepath}/api/direct/${to_id}/${from_id}`, {
          method: "POST",
          mode: "cors",
          credentials: "include",
          body: JSON.stringify({ Name: name, details: desc })
        })
          .then(resp => {
            if (resp.status !== 200) {
              rej();
              return;
            }
            resp.json().then(resp => {
              commit("addChannel", resp);
              commit("updateCurrentChannel", resp);
              res();
            });
          })
          .catch(() => rej());
      });
    },
    createSidebar({ commit }, { parent, name, user, desc }) {
      return new Promise((res, rej) => {
        fetch(`${basepath}/api/sidebar/${parent}/${user}`, {
          method: "POST",
          mode: "cors",
          credentials: "include",
          body: JSON.stringify({ Name: name, details: desc })
        })
          .then(resp => {
            if (resp.status !== 200) {
              rej();
              return;
            }
            resp.json().then(resp => {
              commit("addChannel", resp);
              commit("updateCurrentChannel", resp);
              res();
            });
          })
          .catch(() => rej());
      });
    },
    newToken() {
      return new Promise((res, rej) => {
        fetch(`${basepath}/api/new_token`, {
          method: "POST",
          mode: "cors",
          credentials: "include"
        })
          .then(resp => {
            if (resp.status !== 200) {
              rej();
              return;
            }
            resp.json().then(resp => {
              res(resp.Token);
            });
          })
          .catch(() => rej());
      });
    },
    addUserToChannel(_, { user_id, channel_id }) {
      return new Promise((res, rej) => {
        fetch(`${basepath}/api/add/${user_id}/${channel_id}`, {
          method: "POST",
          mode: "cors",
          credentials: "include"
        })
          .then(resp => {
            if (resp.status !== 200) {
              rej();
              return;
            }
            res();
          })
          .catch(() => rej());
      });
    },
    removeUserFromChannel(_, { user_id, channel_id }) {
      return new Promise((res, rej) => {
        fetch(`${basepath}/api/leave/${user_id}/${channel_id}`, {
          method: "DELETE",
          mode: "cors",
          credentials: "include"
        })
          .then(resp => {
            if (resp.status !== 200) {
              rej();
              return;
            }
            res();
          })
          .catch(() => rej());
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
            for (let i = 0; i < resp.Channels.length; i++) {
              resp.Channels[i].Alert = false;
            }
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
    updateUser({ commit }, user) {
      return new Promise((res, rej) => {
        fetch(`${basepath}/api/update-userinfo`, {
          method: "POST",
          mode: "cors",
          credentials: "include",
          body: JSON.stringify(user)
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
          .catch(err => rej(err));
      });
    },
    updateChannel({ commit }, channel) {
      return new Promise((res, rej) => {
        fetch(`${basepath}/api/update-channelinfo`, {
          method: "POST",
          mode: "cors",
          credentials: "include",
          body: JSON.stringify(channel)
        })
          .then(resp => {
            if (resp.status !== 200) {
              rej();
              return;
            }
            resp.json().then(resp => {
              commit("updateCurrentChannel", resp);
              res();
            });
          })
          .catch(err => rej(err));
      });
    },
    signup({ commit }, { token, user }) {
      return new Promise((res, rej) => {
        fetch(`${basepath}/api/user/${token}`, {
          method: "POST",
          mode: "cors",
          credentials: "include",
          body: JSON.stringify(user)
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
          .catch(err => rej(err));
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
      commit("signout");
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
    },
    resolveSidebar(_, channel) {
      return new Promise((res, rej) => {
        fetch(`${basepath}/api/resolve/${channel}`, {
          method: "POST",
          mode: "cors",
          credentials: "include"
        }).then(resp => {
          if (resp.status !== 200) {
            rej();
            return;
          }
          res();
        });
      });
    }
  }
});
