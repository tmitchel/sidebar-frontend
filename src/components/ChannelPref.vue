<template>
  <v-card>
    <v-card-title>Channel Preferences</v-card-title>
    <v-form>
      <v-text-field v-model="name" label="Name"></v-text-field>
      <v-text-field v-model="desc" label="Description"></v-text-field>
    </v-form>
    <v-card-actions>
      <v-btn @click="handleSubmit">Update</v-btn>
      <v-btn @click="close">Close</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "ChannelPref",
  props: ["channel", "close", "submit"],
  data: () => ({
    name: "",
    desc: ""
  }),
  created() {
    this.name = this.channel.name;
    this.desc = this.channel.details;
  },
  methods: {
    handleSubmit() {
      this.submit(this.name, this.desc);
      this.close();
    }
  }
};
</script>
