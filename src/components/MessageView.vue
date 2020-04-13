<template>
  <v-hover v-slot:default="{ hover }">
    <v-card shaped style="margin-left: 1%; margin-bottom: 1%;">
      <v-container class="pa-0 ma-0">
        <v-row>
          <v-col cols="auto">
            <v-card-subtitle class="pb-0 pt-1 font-weight-black text-left">
              <v-avatar size="36" color="primary">
                <v-icon dark>mdi-account-circle</v-icon>
              </v-avatar>
              {{ message.user_info.display_name }}
            </v-card-subtitle>
            <v-card-text v-if="!message.Markdown" class="text-left pb-0 mt-1">
              {{ formed }}
            </v-card-text>
            <v-card-text v-else class="text-left pb-0 mt-1">
              <div v-html="formed"></div>
            </v-card-text>
          </v-col>
          <v-col v-if="hover" class="pl-0">
            <v-btn @click.prevent="startSidebar(message)" icon class="mt-0">
              <v-icon>mdi-database-plus</v-icon>
            </v-btn>
            <v-btn @click.prevent="startDirect(message)" icon class="mt-0">
              <v-icon>mdi-message</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-hover>
</template>

<script>
import marked from "marked";

export default {
  name: "MessageView",
  props: ["message", "usersInChannel", "startSidebar", "startDirect"],
  computed: {
    formed() {
      return marked(this.message.content);
    }
  }
};
</script>

<style scoped>
p {
  padding: 0px !important;
  margin: 0px !important;
}
</style>
