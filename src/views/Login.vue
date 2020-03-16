<template>
  <v-content>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Login</v-toolbar-title>
              <v-spacer />
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field label="Email" name="login" type="text" />
                <v-text-field id="password" label="Password" name="password" type="password" />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary">Login</v-btn>
              <v-btn color="primary" @click="signup = !signup">Sign Up</v-btn>
            </v-card-actions>
          </v-card>
          <v-overlay :absolute="false" opacity=".86" :value="signup" z-index="5">
            <v-card light width="500">
              <v-card-title>New User</v-card-title>
              <v-container>
                <v-form>
                  <v-text-field
                    v-model="newUsername"
                    label="Display Name"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="newEmail"
                    label="Email"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="newPassword"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    label="Password"
                    :type="showPassword ? 'text' : 'password'"
                    @click:append="showPassword = !showPassword"
                    required
                  ></v-text-field>
                </v-form>
              </v-container>
              <v-card-actions>
                <v-btn @click="signup = false">Submit</v-btn>
                <v-btn @click="signup = false">Cancel</v-btn>
              </v-card-actions>
            </v-card>
          </v-overlay>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
export default {
  props: {
    source: String
  },
  data: () => ({
    signup: false,
    newUsername: "",
    newEmail: "",
    newPassword: "",
    showPassword: false
  })
};
</script>
