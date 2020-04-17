<template>
  <v-card style="width: 100%;" color="#616161" tile>
    <v-container v-if="preview">
      <div v-html="formattedContent"></div>
      <v-btn @click.prevent="preview = !preview">Cancel</v-btn>
    </v-container>
    <v-textarea
      v-else
      @keypress.enter.prevent="handleSend"
      @keypress="typing"
      v-model="message"
      dense
      solo
      flat
      rows="3"
      name="input-7-1"
      auto-grow
      hide-details=""
      placeholder="Message"
    >
      <template v-slot:append>
        <v-btn-toggle borderless="">
          <v-menu top offset-y>
            <template v-slot:activator="{ on }">
              <v-btn dark icon v-on="on">
                <v-btn dark icon class="title">@</v-btn>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="user in users"
                :key="user.id"
                @click.prevent="addAt(user.display_name)"
              >
                <v-list-item-title>{{ user.display_name }}</v-list-item-title>
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
          <!-- <v-btn icon @click.prevent="preview = !preview">
            <v-icon>mdi-format-letter-case</v-icon>
          </v-btn>
          <v-btn icon @click.prevent="fileUpload">
            <v-icon>mdi-file-document-outline</v-icon>
          </v-btn> -->
        </v-btn-toggle>
      </template>
    </v-textarea>
    <v-sheet v-if="typer && typer.Event === 2" class="text-left pl-3">
      {{ users[typer.from_user].display_name }} is typing...
    </v-sheet>
  </v-card>
</template>

<script>
import marked from "marked";

export default {
  name: "MessageInput",
  props: ["send", "users", "typing", "typer", "fileUpload"],
  data: () => ({
    message: "",
    preview: false
  }),
  computed: {
    formattedContent() {
      return marked(this.message);
    }
  },
  methods: {
    handleSend(e) {
      if (e.shiftKey) {
        this.message += "\n";
      } else {
        this.send(this.message);
        this.message = "";
      }
    },
    addAt(username) {
      this.message += `@${username} `;
    }
  }
};
</script>
