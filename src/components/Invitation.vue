<template>
  <v-card>
    <v-card-title>Send this token to a friend</v-card-title>
    <v-card-text>
      <h1>{{ token }}</h1>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="copy">Copy</v-btn>
      <v-btn @click="close">Close</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "Invitation",
  props: ["token", "close"],
  methods: {
    copy() {
      navigator.clipboard.writeText(this.token);
    }
  }
};
</script>
