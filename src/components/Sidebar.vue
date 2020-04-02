<template>
  <v-navigation-drawer permanent app width="200">
    <template v-slot:prepend>
      <v-list-item two-line>
        <v-list-item-avatar>
          <img src="https://randomuser.me/api/portraits/women/81.jpg" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ user.display_name }}</v-list-item-title>
          <v-list-item-subtitle>Active</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>
    <v-divider></v-divider>

    <v-list dense>
      <v-list-item link to="/">
        <v-list-item-content>
          <v-list-item-title>
            <h1>Sidebars</h1>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        link
        v-for="chan in sidebars"
        :key="chan.ID"
        dense
        style="min-height: 35px;"
      >
        <v-list-item-content>
          <v-list-item-title
            @click.prevent="changeChannel(chan)"
            class="font-weight-light"
          >
            <v-badge color="red" dot offset-y="11" offset-x="-5" class="mt-0">
              {{ chan.Name }}
            </v-badge>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider :inset="false"></v-divider>
    <v-list dense>
      <v-list-item link to="/">
        <v-list-item-content>
          <v-list-item-title>
            <h1>Direct</h1>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        link
        v-for="chan in direct"
        :key="chan.ID"
        dense
        style="min-height: 35px;"
      >
        <v-list-item-content>
          <v-list-item-title
            @click.prevent="changeChannel(chan)"
            class="font-weight-light"
          >
            <v-badge color="red" dot offset-y="11" offset-x="-5" class="mt-0">
              {{ chan.Name }}
            </v-badge>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider :inset="false"></v-divider>
    <v-list dense>
      <v-list-item link to="/">
        <v-list-item-content>
          <v-list-item-title>
            <h1>Channels</h1>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        link
        v-for="chan in chans"
        :key="chan.ID"
        dense
        style="min-height: 35px;"
      >
        <v-list-item-content>
          <v-list-item-title
            @click.prevent="changeChannel(chan)"
            class="font-weight-light"
          >
            <v-badge color="red" dot offset-y="11" offset-x="-5" class="mt-0">
              {{ chan.Name }}
            </v-badge>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider :inset="false"></v-divider>
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
  props: ["channels", "changeChannel", "newChannel", "user"],
  computed: {
    chans() {
      return this.channels.filter(
        c => c.IsSidebar === false && c.Direct === false
      );
    },
    sidebars() {
      return this.channels.filter(c => c.IsSidebar === true);
    },
    direct() {
      return this.channels.filter(c => c.Direct === true);
    }
  }
};
</script>
