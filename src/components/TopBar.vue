<template>
  <v-app-bar app color="primary" dark>
    <v-avatar color="primary">
      <v-icon dark x-large>mdi-account-circle</v-icon>
    </v-avatar>
    <v-toolbar-title>{{ currentChannel.name }}</v-toolbar-title>
    <v-icon v-if="currentChannel.private">mdi-lock</v-icon>
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
  props: [
    "newToken",
    "currentChannel",
    "channelsForUser",
    "addUser",
    "leaveChannel",
    "signout",
    "resolve",
    "openChannelPref"
  ],
  methods: {
    handleAdd() {
      this.addUser(this.currentChannel.id);
    },
    handleLeave() {
      this.leaveChannel(this.currentChannel.id);
      this.$router.push("/");
    },
    handleResolve() {
      this.resolve(this.currentChannel.id);
    }
  },
  computed: {
    options() {
      let opts = [
        {
          text: "Mute Channel",
          action: () => null
        },
        {
          text: "Channel Preferences",
          action: this.openChannelPref
        }
      ];

      if (this.currentChannel.is_sidebar && !this.currentChannel.resolved) {
        opts.unshift({
          text: "Mark Resolved",
          action: this.handleResolve
        });
      }

      if (
        this.channelsForUser.find(el => this.currentChannel.id === el.id) ===
        undefined
      ) {
        opts.unshift({
          text: "Join Channel",
          action: this.handleAdd
        });
      } else {
        opts.push({
          text: "Leave Channel",
          action: this.handleLeave
        });
      }

      return opts;
    },
    settings() {
      const vm = this;
      return [
        {
          text: "Invite Someone",
          action: this.newToken
        },
        {
          text: "User Preferences",
          action: function() {
            vm.$router.push("/preferences");
          }
        },
        {
          text: "Help",
          action: function() {
            vm.$router.push("/help");
          }
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
