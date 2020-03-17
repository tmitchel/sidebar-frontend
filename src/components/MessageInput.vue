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
          <v-menu top offset-y :return-value="meh">
            <template v-slot:activator="{ on }">
              <v-btn dark icon v-on="on">
                <v-btn dark icon class="title">@</v-btn>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="user in users"
                :key="user.ID"
                @click.prevent="addAt(user.Username)"
              >
                <v-list-item-title>{{ user.Username }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-dialog attach="#test" width="400">
            <template v-slot:activator="{ on }">
              <v-btn id="test" dark icon v-on="on">
                <v-icon>mdi-emoticon-happy-outline</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-card-text>hi</v-card-text>
            </v-card>
          </v-dialog>
        </v-btn-toggle>
      </template>
    </v-textarea>
  </v-card>
</template>

<script>
export default {
  name: "MessageInput",
  props: ["send", "users"],
  data: () => ({
    message: "",
    meh: ""
  }),
  methods: {
    handleSend() {
      this.send(this.message);
      this.message = "";
    },
    addAt(username) {
      this.message += `@${username} `;
    }
  }
};
</script>
