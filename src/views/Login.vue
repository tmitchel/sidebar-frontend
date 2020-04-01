<template>
  <v-content>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <login-box :login="handleLogin" :signup="openSignup"></login-box>
          <v-overlay
            :absolute="false"
            opacity=".86"
            :value="signup"
            z-index="5"
          >
            <new-user :submit="submit" :close="close"></new-user>
          </v-overlay>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
import LoginBox from "@/components/LoginBox.vue";
import NewUser from "@/components/NewUser.vue";
import { mapActions } from "vuex";
import store, { createWebSocketPlugin } from "@/store.js";

export default {
  props: {
    source: String
  },
  components: { LoginBox, NewUser },
  data: () => ({
    signup: false,
    errored: false
  }),
  methods: {
    ...mapActions(["login"]),
    openSignup() {
      this.signup = true;
    },
    async handleLogin(email, password) {
      console.log(`Logging in with ${email} ${password}`);
      await this.login({ email, password })
        .then(() => {
          this.$router.push("/");
        })
        .catch(() => (this.errored = true));
      const websocket_path =
        process.env.NODE_ENV === "development"
          ? "wss://localhost:8080/ws"
          : "wss://sidebar-backend.herokuapp.com/ws";
      const socket = new WebSocket(websocket_path);
      createWebSocketPlugin(socket)(store);
    },
    submit(username, email, password) {
      console.log(`creating user with ${username} ${email} ${password}`);
      this.signup = false;
    },
    close() {
      this.signup = false;
    }
  }
};
</script>
