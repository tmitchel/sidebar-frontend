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
        console.log("Message: ", msg);
        if (msg.Type === "chat-message") {
          let new_messages = store.state.messages;
          new_messages.push(msg.Payload);
          store.commit("messages", new_messages);

          let new_channels = store.state.channels;
          for (let i = 0; i < new_channels.length; i++) {
            if (new_channels[i].id === msg.Payload.channel) {
              new_channels[i].Alert = true;
            }
          }
          store.commit("channels", new_channels);
          // store.commit("newAlert", msg.channel);
        }
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
    token: "",
    alert: {},
    user: defaultUser,
    currentChannel: {},
    usersInChannel: [],
    messages: [],
    channels: [],
    event: {}
  },
  mutations: {
    updateToken(state, token) {
      state.token = token;
    },
    updateUser(state, user) {
      state.user = user;
    },
    messages(state, messages) {
      state.messages = messages;
    },
    channels(state, channels) {
      state.channels = channels;
      for (let i = 0; i < channels.length; i++) {
        state.alert[channels[i].id] = false;
      }
    },
    newAlert(state, channelID) {
      state.alerts[channelID] = true;
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
    signout() {}
  },
  actions: {
    sendMessages(_, payload) {
      fetch(`${basepath}/api/message`, {
        method: "POST",
        mode: "cors",
        headers: {
          Authorization: `bearer ${this.state.token}`
        },
        body: JSON.stringify(payload)
      }).catch(err => console.log(err));
    },
    uploadFiles(uploads) {
      return new Promise((res, rej) => {
        for (let ups of uploads) {
          fetch(`${basepath}/api/upload`, {
            method: "POST",
            mode: "cors",
            headers: {
              Authorization: `bearer ${this.state.token}`
            },
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
          headers: {
            Authorization: `bearer ${this.state.token}`
          },
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
    createDirect({ commit }, { to_id, name, desc }) {
      return new Promise((res, rej) => {
        fetch(`${basepath}/api/direct/${to_id}`, {
          method: "POST",
          mode: "cors",
          headers: {
            Authorization: `bearer ${this.state.token}`
          },
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
          headers: {
            Authorization: `bearer ${this.state.token}`
          },
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
          headers: {
            Authorization: `bearer ${this.state.token}`
          }
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
    addUserToChannel(_, { channel_id }) {
      return new Promise((res, rej) => {
        fetch(`${basepath}/api/add/${channel_id}`, {
          method: "POST",
          mode: "cors",
          headers: {
            Authorization: `bearer ${this.state.token}`
          }
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
    removeUserFromChannel(_, { channel_id }) {
      return new Promise((res, rej) => {
        fetch(`${basepath}/api/leave/${channel_id}`, {
          method: "DELETE",
          mode: "cors",
          headers: {
            Authorization: `bearer ${this.state.token}`
          }
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
      console.log(this);
      fetch(`${basepath}/api/load_user/${id}`, {
        method: "GET",
        headers: {
          Authorization: `bearer ${this.state.token}`
        }
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
        headers: {
          Authorization: `bearer ${this.state.token}`
        }
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
          headers: {
            Authorization: `bearer ${this.state.token}`
          },
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
          headers: {
            Authorization: `bearer ${this.state.token}`
          },
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
          body: JSON.stringify(payload)
        })
          .then(resp => {
            if (resp.status !== 200) {
              rej();
              return;
            }
            resp.json().then(resp => {
              commit("updateUser", resp.User);
              commit("updateToken", resp.Token);
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
          headers: {
            Authorization: `bearer ${this.state.token}`
          },
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
          headers: {
            Authorization: `bearer ${this.state.token}`
          },
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
