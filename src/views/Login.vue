<template>
  <v-content>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <login-box :login="handleLogin" :signup="openSignup"></login-box>
          <v-alert type="error" :value="errored">
            I'm an error alert.
          </v-alert>
          <v-overlay
            :absolute="false"
            opacity=".86"
            :value="signupOpen"
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
import { mapActions, mapState } from "vuex";
import store from "@/store.js";
import { createWebSocketPlugin } from "@/plugins/websocket.js";

export default {
  props: {
    source: String
  },
  components: { LoginBox, NewUser },
  data: () => ({
    signupOpen: false,
    errored: false
  }),
  computed: {
    ...mapState(["connected", "token"])
  },
  methods: {
    ...mapActions(["login", "signup"]),
    openSignup() {
      this.signupOpen = true;
    },
    async handleLogin(email, password) {
      await this.login({ email, password })
        .then(() => {
          this.$router.push("/");
        })
        .catch(() => (this.errored = true));
      if (!this.connected) {
        const websocket_path =
          process.env.NODE_ENV === "development"
            ? `wss://localhost:8080/api/ws?auth_code=${this.token}`
            : `wss://sidebar-backend.herokuapp.com/api/ws?auth_code=${this.token}`;
        const socket = new WebSocket(websocket_path);
        createWebSocketPlugin(socket)(store);
      }
    },
    async submit(display_name, email, password, token, profile_image) {
      const user = { display_name, email, password, token, profile_image };
      await this.signup({ token, user });
      this.signupOpen = false;
      await this.handleLogin(email, password);
    },
    close() {
      this.signupOpen = false;
    }
  }
};
</script>
