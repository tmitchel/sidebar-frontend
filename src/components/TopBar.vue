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
    "resolve"
  ],
  methods: {
    handleAdd() {
      this.addUser(this.currentChannel.ID);
    },
    handleLeave() {
      this.leaveChannel(this.currentChannel.ID);
      this.$router.push("/");
    },
    handleResolve() {
      this.resolve(this.currentChannel.ID);
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
          action: () => null
        }
      ];

      if (this.currentChannel.IsSidebar && !this.currentChannel.resolved) {
        opts.unshift({
          text: "Mark Resolved",
          action: this.handleResolve
        });
      }

      if (
        this.channelsForUser.find(el => this.currentChannel.ID === el.ID) ===
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
