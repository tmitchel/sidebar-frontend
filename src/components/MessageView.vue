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
            <v-card-text class="text-left pb-0">
              {{ message.content }}
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
export default {
  name: "MessageView",
  props: ["message", "usersInChannel", "startSidebar", "startDirect"]
};
</script>
