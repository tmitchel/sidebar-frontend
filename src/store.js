import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      ID: 1,
      Username: "Default User",
      Email: "user@email.com"
    },
    usersInChannel: {
      1: {
        ID: 1,
        Username: "Default User",
        Email: "user@email.com"
      },
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
    messages: [
      {
        ID: 1,
        Event: 1,
        Content: "Message One",
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
  mutations: {},
  actions: {}
});
