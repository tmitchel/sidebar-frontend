import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
const basepath = "http://localhost:8080";
const defaultUser = {
  ID: 1,
  Username: "Default User",
  Email: "user@email.com"
};

const socket = new WebSocket("ws://localhost:8080/ws");
function createWebSocketPlugin(socket) {
  return store => {
    socket.onmessage = event => {
      new Response(event.data)
        .json()
        .then(msg => store.commit("messages", msg));
    };
    store.subscribe(mut => {
      if (mut.type === "sendMessages") {
        socket.send(mut.payload.Text);
      }
    });
  };
}

export default new Vuex.Store({
  plugins: [createWebSocketPlugin(socket)],
  state: {
    user: defaultUser,
    usersInChannel: {
      1: defaultUser,
      2: {
        ID: 2,
        Username: "Other user",
        Email: "other@email.com"
      }
    },
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
    }
  },
  actions: {
    getMessages({ commit }, id) {
      fetch(`${basepath}/messages/channel=${id}`).then(resp => {
        resp.json().then(resp => {
          commit("messages", resp);
        });
      });
    },
    getChannels({ commit }) {
      fetch(`${basepath}/channels`).then(resp => {
        resp.json().then(resp => {
          commit("channels", resp);
        });
      });
    },
    getUsers({ commit }) {
      fetch(`${basepath}/users`).then(resp => {
        resp.json().then(resp => {
          commit("users", resp);
        });
      });
    },
    login({ commit }, email, password) {
      fetch(`${basepath}/login`, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({
          email: email,
          password: password
        })
      }).then(resp => {
        resp.json().then(resp => {
          commit("updateUser", resp);
        });
      });
    },
    signout({ commit }) {
      commit("updateUser", defaultUser);
    }
  }
});
