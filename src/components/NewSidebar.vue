<template>
  <v-card light width="500">
    <v-card-title>New Sidebar</v-card-title>
    <v-container>
      <v-form>
        <v-text-field
          v-model="newChannelName"
          label="Sidebar Name"
          required
        ></v-text-field>
        <v-text-field
          :disabled="true"
          v-model="newChannelDesc"
          label="Channel Description"
          required
        ></v-text-field>
      </v-form>
    </v-container>
    <v-card-actions>
      <v-btn @click="submit(message, newChannelName, newChannelDesc)"
        >Submit</v-btn
      >
      <v-btn @click="close">Cancel</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "NewSidebar",
  props: ["close", "submit", "message"],
  data: () => ({
    newChannelName: "",
    newChannelDesc: ""
  }),
  created() {
    this.newChannelDesc = "Sidebar: " + this.message.content;
  }
};
</script>
