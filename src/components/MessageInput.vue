<template>
  <v-card style="width: 100%;" color="#616161" tile>
    <v-textarea
      @keypress.enter.prevent="handleSend"
      v-model="message"
      class="custom-class"
      dense
      solo
      flat
      rows="4"
      name="input-7-1"
      auto-grow
      hide-details=""
      placeholder="Message"
    >
      <template v-slot:append>
        <v-btn-toggle borderless="">
          <v-btn dark icon>
            <v-icon>mdi-emoticon-happy-outline</v-icon>
          </v-btn>
          <v-btn dark icon class="title">@</v-btn>
        </v-btn-toggle>
      </template>
    </v-textarea>
  </v-card>
</template>

<script>
export default {
  name: "MessageInput",
  props: ["send"],
  data: () => ({
    message: ""
  }),
  methods: {
    handleSend() {
      this.send(this.message);
      this.message = "";
    }
  }
};
</script>
