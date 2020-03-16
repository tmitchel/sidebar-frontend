<template>
  <v-app-bar app color="primary" dark>
    <v-avatar color="primary">
      <v-icon dark x-large>mdi-account-circle</v-icon>
    </v-avatar>
    <v-toolbar-title>{{ currentChannel }}</v-toolbar-title>
    <v-spacer />
    <v-btn text x-large @click.prevent="signout">Sign Out</v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: "TopBar",
  props: ["currentChannel", "signout"]
};
</script>
