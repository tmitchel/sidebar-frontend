import Vue from "vue";
import Router from "vue-router";
import Login from "./views/Login.vue";
import Chat from "./views/Chat.vue";
import Channels from "./views/Channels.vue";
import Preferences from "./views/Preferences.vue";
import Help from "./views/Help.vue";
import store from "@/store.js";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/chat/:channel",
      name: "chat",
      component: Chat,
      beforeEnter: checkToken
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/",
      name: "channels",
      component: Channels,
      beforeEnter: checkToken
    },
    {
      path: "/preferences",
      name: "preferences",
      component: Preferences,
      beforeEnter: checkToken
    },
    {
      path: "/help",
      name: "help",
      component: Help,
      beforeEnter: checkToken
    }
  ]
});

function checkToken(to, from, next) {
  if (store.state.user.id !== -1) {
    next();
  } else {
    next({
      path: "/login"
    });
  }
}
