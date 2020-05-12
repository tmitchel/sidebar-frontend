<template>
  <v-card light width="500">
    <v-card-title>New User</v-card-title>
    <v-container>
      <v-form>
        <v-text-field
          v-model="username"
          label="Display Name"
          @input="$v.username.$touch()"
          :error-messages="usernameError"
          required
        ></v-text-field>
        <v-text-field
          v-model="email"
          label="Email"
          required
          @input="$v.email.$touch()"
          :error-messages="emailError"
        ></v-text-field>
        <v-text-field
          v-model="password"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          label="Password"
          :type="showPassword ? 'text' : 'password'"
          @click:append="showPassword = !showPassword"
          @input="$v.password.$touch()"
          :error-messages="passwordError"
          required
        ></v-text-field>
        <v-text-field v-model="profileImg" label="Profile Image"></v-text-field>
      </v-form>
    </v-container>
    <v-card-actions>
      <v-btn @click.prevent="handleSubmit">Submit</v-btn>
      <v-btn @click.prevent="close">Cancel</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { validationMixin } from "vuelidate";
import {
  required,
  maxLength,
  minLength,
  email
} from "vuelidate/lib/validators";

export default {
  name: "NewUser",
  props: ["submit", "close"],
  data: () => ({
    username: "",
    email: "",
    token: "",
    password: "",
    showPassword: false,
    profileImg: "",
    errored: false
  }),
  methods: {
    handleSubmit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.submit(
          this.username,
          this.email,
          this.password,
          this.token,
          this.profileImg
        );
      }
    }
  },
  computed: {
    usernameError() {
      if (!this.$v.username.$dirty) {
        return [];
      } else if (!this.$v.username.required) {
        return ["Name is required"];
      } else if (!this.$v.username.minLength) {
        return ["Name must be at least 3 characters long"];
      } else if (!this.$v.username.maxLength) {
        return ["Name must be at most 40 characters long"];
      } else if (this.username.indexOf(" ") != -1) {
        return ["Spaces aren't allowed in names"];
      } else {
        return [];
      }
    },
    emailError() {
      if (!this.$v.email.$dirty) {
        return [];
      } else if (!this.$v.email.required || !this.$v.email.email) {
        return ["Valid email is required"];
      } else {
        return [];
      }
    },
    passwordError() {
      if (!this.$v.password.$dirty) {
        return [];
      } else if (!this.$v.password.required) {
        return ["Password is required"];
      } else if (!this.$v.password.minLength) {
        return ["Password must be at least 8 characters long"];
      } else {
        return [];
      }
    }
  },
  mixins: [validationMixin],
  validations: {
    username: {
      required,
      minLength: minLength(3),
      maxLength: maxLength(40)
    },
    email: {
      required,
      email
    },
    password: {
      required,
      minLength: minLength(8)
    }
  }
};
</script>
