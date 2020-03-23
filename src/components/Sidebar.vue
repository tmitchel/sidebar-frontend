<template>
  <v-navigation-drawer permanent app width="200">
    <v-list dense>
      <v-list-item link to="/">
        <v-list-item-content>
          <v-list-item-title>
            <h1>Channels</h1>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link v-for="chan in channels" :key="chan.ID" dense style="min-height: 35px;">
        <v-list-item-content>
          <v-list-item-title @click.prevent="changeChannel(chan)" class="font-weight-light">
            <v-badge color="red" dot offset-y="11" offset-x="-5" class="mt-0">
              {{ chan.Name }}
            </v-badge>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link>
        <v-list-item-content>
          <v-list-item-title @click.prevent="newChannel">
            Create New Channel
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "Sidebar",
  props: ["channels", "changeChannel", "newChannel"]
};
</script>
