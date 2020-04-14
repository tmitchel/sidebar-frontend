<template>
  <v-container>
    <h1>Preferences</h1>
    <v-snackbar v-model="success" timeout="2000">
      <h3>Success!</h3>
      <v-btn color="blue" text @click="success = false">Close</v-btn>
    </v-snackbar>
    <v-snackbar v-model="failure" timeout="2000">
      <h3>Error!</h3>
      <v-btn color="blue" text @click="failure = false">Close</v-btn>
    </v-snackbar>
    <v-row>
      <v-col>
        <v-form>
          <v-text-field
            v-model="display_name"
            label="Display Name"
          ></v-text-field>
          <v-text-field v-model="email" label="Email"></v-text-field>
          <v-text-field
            v-model="profile_image"
            label="Profile Image"
          ></v-text-field>
        </v-form>
      </v-col>
      <v-col>
        <v-img
          class="roundy"
          contain
          :src="display_profile_image"
          width="200"
        ></v-img>
        <v-btn
          small
          width="100"
          @click.prevent="display_profile_image = profile_image"
          >Preview</v-btn
        >
        <v-btn small width="100" @click.prevent="undoProfileImage"
          >Cancel</v-btn
        >
      </v-col>
    </v-row>
    <v-btn color="primary" @click.prevent="update" class="ma-1">Update</v-btn>
    <v-btn color="primary" @click.prevent="back" class="ma-1">Close</v-btn>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "Preferences",
  data: () => ({
    display_name: "",
    email: "",
    profile_image: "",
    display_profile_image: "",
    success: false,
    failure: false
  }),
  computed: {
    ...mapState(["user"])
  },
  methods: {
    ...mapActions(["updateUser"]),
    back() {
      this.$router.back();
    },
    undoProfileImage() {
      this.display_profile_image = this.user.profile_image;
      this.profile_image = this.user.profile_image;
    },
    update() {
      let newEmail = this.user.email;
      let newDisplayName = this.user.display_name;
      let newProfileImage = this.user.profile_image;
      if (this.email !== "") {
        newEmail = this.email;
      }

      if (this.profile_image !== "") {
        newProfileImage = this.profile_image;
      }

      if (this.display_name !== "") {
        newDisplayName = this.display_name;
      }

      let vm = this;
      this.updateUser({
        id: this.user.id,
        email: newEmail,
        display_name: newDisplayName,
        profile_image: newProfileImage
      })
        .then(() => {
          vm.success = true;
          vm.display_profile_image = newProfileImage;
        })
        .catch(() => (vm.failure = false));
    }
  },
  created() {
    this.display_name = this.user.display_name;
    this.email = this.user.email;
    this.profile_image = this.user.profile_image;
    this.display_profile_image = this.user.profile_image;
  }
};
</script>

<style>
.roundy {
  border-radius: 8px;
}
</style>
