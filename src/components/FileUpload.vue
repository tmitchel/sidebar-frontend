<template>
  <v-card width="500">
    <v-card-text>
      <v-file-input
        v-model="files"
        autofocus
        show-size
        chips
        clearable
        multiple
        label="File input"
      ></v-file-input>
    </v-card-text>
    <v-card-actions>
      <v-btn @click.prevent="handleUpload">Upload</v-btn>
      <v-btn @click.prevent="close">Cancel</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "FileUpload",
  props: ["close", "upload"],
  data: () => ({
    files: []
  }),
  methods: {
    handleUpload() {
      this.upload(this.files);
    }
  }
};
</script>
