<template>
  <v-app-bar app color="primary" dark>
    <v-avatar color="primary">
      <v-icon dark x-large>mdi-account-circle</v-icon>
    </v-avatar>
    <v-toolbar-title>{{ currentChannel.Name }}</v-toolbar-title>
    <v-menu bottom offset-y offset-x>
      <template v-slot:activator="{ on }">
        <v-avatar color="primary" v-on="on">
          <v-icon dark @click.prevent="">mdi-cog</v-icon>
        </v-avatar>
      </template>
      <v-list>
        <v-list-item
          @click.prevent="opt.action"
          v-for="(opt, i) in options"
          :key="i"
        >
          <v-list-item-title>{{ opt.text }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-spacer />
    <v-menu bottom offset-y>
      <template v-slot:activator="{ on }">
        <v-btn text x-large v-on="on">Settings</v-btn>
      </template>
      <v-list>
        <v-list-item
          @click.prevent="opt.action"
          v-for="(opt, i) in settings"
          :key="i + options.length"
          :inactive="opt.enabled"
        >
          <v-list-item-title>{{ opt.text }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
export default {
  name: "TopBar",
  props: ["currentChannel", "channelsForUser", "addUser", "signout"],
  methods: {
    handleAdd() {
      this.addUser(this.currentChannel.ID);
    }
  },
  computed: {
    options() {
      let opts = [
        {
          text: "Mute Channel",
          action: () => null,
          enabled: false
        },
        {
          text: "Channel Preferences",
          action: () => null,
          enabled: false
        },
        {
          text: "Leave Channel",
          action: () => null,
          enabled: false
        }
      ];

      if (
        this.channelsForUser.find(el => this.currentChannel.ID === el.ID) ===
        undefined
      ) {
        opts.unshift({
          text: "Join Channel",
          action: this.handleAdd,
          enabled: true
        });
      }

      return opts;
    },
    settings() {
      const vm = this;
      return [
        {
          text: "Profile",
          action: () => null
        },
        {
          text: "User Preferences",
          action: function() {
            vm.$router.push("/preferences");
          }
        },
        {
          text: "Help",
          action: () => null
        },
        {
          text: "Sign Out",
          action: vm.signout
        }
      ];
    }
  }
};
</script>

<style>
.shorter {
  padding-left: 10px !important;
  padding-right: 10px !important;
}
</style>
