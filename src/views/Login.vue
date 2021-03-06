<template>
  <v-content>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <login-box
            :login="handleLogin"
            :signup="openSignup"
            :workspaces="workspaces"
          ></login-box>
          <v-alert type="error" :value="errored">
            Username/password do not match any records.
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
    ...mapState(["connected", "token", "workspaces"])
  },
  async created() {
    await this.getWorkspaces();
  },
  methods: {
    ...mapActions(["login", "signup", "getWorkspaces"]),
    openSignup() {
      this.signupOpen = true;
    },
    async handleLogin(email, password, workspace) {
      this.errored = false;
      try {
        await this.login({ email, password, workspace });
        this.$router.push("/");
      } catch (err) {
        this.errored = true;
      }

      if (this.errored) {
        return;
      }

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
      try {
        await this.signup({ token, user });
        this.signupOpen = false;
        this.$router.push("/");
      } catch (err) {
        this.errored = true;
      }
      if (!this.connected) {
        const websocket_path =
          process.env.NODE_ENV === "development"
            ? `wss://localhost:8080/api/ws?auth_code=${this.token}`
            : `wss://sidebar-backend.herokuapp.com/api/ws?auth_code=${this.token}`;
        const socket = new WebSocket(websocket_path);
        createWebSocketPlugin(socket)(store);
      }
    },
    close() {
      this.signupOpen = false;
    }
  }
};
</script>
