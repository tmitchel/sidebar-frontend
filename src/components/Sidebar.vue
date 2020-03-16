<template>
  <v-navigation-drawer permanent app>
    <v-list dense>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            <h1>Channels</h1>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link v-for="chan in channels" :key="chan.ID">
        <v-list-item-content>
          <v-list-item-title @click.prevent="changeChannel(chan)">
            {{ chan.Name }}
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
