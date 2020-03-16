<template>
  <v-card light width="500">
    <v-card-title>New User</v-card-title>
    <v-container>
      <v-form>
        <v-text-field v-model="username" label="Display Name" required></v-text-field>
        <v-text-field v-model="email" label="Email" required></v-text-field>
        <v-text-field
          v-model="password"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          label="Password"
          :type="showPassword ? 'text' : 'password'"
          @click:append="showPassword = !showPassword"
          required
        ></v-text-field>
      </v-form>
    </v-container>
    <v-card-actions>
      <v-btn @click.prevent="submit(username, email, password)">Submit</v-btn>
      <v-btn @click.prevent="close">Cancel</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "NewUser",
  props: ["submit", "close"],
  data: () => ({
    username: "",
    email: "",
    password: "",
    showPassword: false
  })
};
</script>
