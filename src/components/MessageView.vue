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
              {{ usersInChannel[message.FromUser].Username }}
            </v-card-subtitle>
            <v-card-text class="text-left pb-0">
              {{ message.Content }}
            </v-card-text>
          </v-col>
          <v-col v-if="hover" class="pl-0">
            <v-btn @click.prevent="startSidebar" icon class="mt-0">
              <v-icon>mdi-database-plus</v-icon>
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
  props: ["message", "usersInChannel", "startSidebar"]
};
</script>
