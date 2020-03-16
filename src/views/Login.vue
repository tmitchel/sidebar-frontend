<template>
  <v-content>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <login-box :login="login" :signup="openSignup"></login-box>
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

export default {
  props: {
    source: String
  },
  components: { LoginBox, NewUser },
  data: () => ({
    signup: false
  }),
  methods: {
    openSignup() {
      this.signup = true;
    },
    login(email, password) {
      console.log(`logging in with ${email} ${password}`);
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
