<template>
  <v-card light width="500">
    <v-card-title>New Channel</v-card-title>
    <v-container>
      <v-form>
        <v-text-field
          v-model="newChannelName"
          label="Channel Name"
          required
        ></v-text-field>
        <v-text-field
          v-model="newChannelDesc"
          label="Channel Description"
          required
        ></v-text-field>
        <v-text-field
          v-model="newChannelImage"
          label="Channel Image"
          required
        ></v-text-field>
      </v-form>
    </v-container>
    <v-card-actions>
      <v-btn @click="submit(newChannelName, newChannelDesc, newChannelImage)"
        >Submit</v-btn
      >
      <v-btn @click="close">Cancel</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "NewChannel",
  props: ["close", "submit"],
  data: () => ({
    newChannelName: "",
    newChannelDesc: "",
    newChannelImage: ""
  })
};
</script>
