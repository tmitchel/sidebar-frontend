import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
const basepath = "http://localhost:8080";
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
        console.log(mut.payload);
      }
    });
  };
}

export default new Vuex.Store({
  state: {
    user: defaultUser,
    currentChannel: {
      ID: 1,
      Name: "Channel One",
      IsSidebar: false,
      Parent: 0
    },
    usersInChannel: [
      defaultUser,
      {
        id: 2,
        Username: "Other user",
        Email: "other@email.com"
      }
    ],
    channels: [
      {
        ID: 1,
        Name: "Channel One",
        IsSidebar: false,
        Parent: 0
      },
      {
        ID: 2,
        Name: "Channel Two",
        IsSidebar: false,
        Parent: 0
      },
      {
        ID: 3,
        Name: "Channel Three",
        IsSidebar: true,
        Parent: 1
      }
    ],
    event: {
      ID: 4,
      Event: 2,
      Content: "",
      ToUser: 0,
      FromUser: 1,
      Channel: 1
    },
    messages: [
      {
        ID: 1,
        Event: 1,
        Content: "Message One 😀",
        ToUser: 0,
        FromUser: 1,
        Channel: 1
      },
      {
        ID: 2,
        Event: 1,
        Content: "Message Two",
        ToUser: 0,
        FromUser: 1,
        Channel: 1
      },
      {
        ID: 3,
        Event: 1,
        Content: "Message Three",
        ToUser: 0,
        FromUser: 1,
        Channel: 1
      }
    ]
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
    sendMessages() {}
  },
  actions: {
    loadChannel({ commit }, id) {
      fetch(`${basepath}/api/load_channel/${id}`, {
        method: "GET",
        credentials: "include"
      })
        .then(resp => {
          resp.json().then(resp => {
            commit("messages", resp.MessagesInChannel);
            commit("updateCurrentChannel", resp.Channel);
            commit("users", resp.UsersInChannel);
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
          if (resp.status === 200) {
            res();
            return;
          }
          rej();
        });
      });
    }
  }
});
