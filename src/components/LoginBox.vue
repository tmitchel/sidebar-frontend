<template>
  <v-card class="elevation-12">
    <v-toolbar color="primary" dark flat>
      <v-toolbar-title>Login</v-toolbar-title>
      <v-spacer />
    </v-toolbar>
    <v-card-text>
      <v-form>
        <v-text-field v-model="email" label="Email" name="login" type="text" />
        <v-text-field
          v-model="password"
          id="password"
          label="Password"
          name="password"
          type="password"
          @keypress.enter.prevent="login(email, password)"
        />
        <v-select
          v-model="workspace"
          :items="workspaces"
          label="Workspace"
          item-text="display_name"
          item-value="id"
        ></v-select>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn @click.prevent="login(email, password, workspace)" color="primary"
        >Login</v-btn
      >
      <v-btn color="primary" @click.prevent="signup">Sign Up</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "LoginBox",
  props: ["login", "signup", "workspaces"],
  data: () => ({
    email: "",
    password: "",
    workspace: ""
  })
};
</script>
