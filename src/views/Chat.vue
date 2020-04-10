<template>
  <v-container class="fill-height no-marg" fluid>
    <!-- Left panel showing channels -->
    <sidebar
      :basic="basics"
      :sidebars="sidebars"
      :direct="directs"
      :changeChannel="changeChannel"
      :newChannel="openNewChannel"
      :user="user"
    />

    <!-- Overlay for creating a new channel -->
    <v-overlay :absolute="false" opacity=".86" :value="newChannel" z-index="6">
      <new-channel :close="close" :submit="submit"></new-channel>
    </v-overlay>

    <!-- Overlay for new user token -->
    <v-overlay :absolute="false" opacity=".86" :value="Invite" z-index="6">
      <invitation :close="close" :token="newToken"></invitation>
    </v-overlay>

    <!-- Overlay with channel preferences -->
    <v-overlay :absolute="false" opacity=".86" :value="channelPref" z-index="6">
      <channel-pref :close="close" :submit="submitChannelPref" :channel="currentChannel"></channel-pref>
    </v-overlay>

    <!-- Navbar with current channel name and logout button -->
    <top-bar
      :currentChannel="currentChannel"
      :signout="handleSignout"
      :channelsForUser="channelsForUser"
      :addUser="addUser"
      :leaveChannel="leaveChannel"
      :newToken="invite"
      :resolve="handleResolve"
      :openChannelPref="openChannelPref"
    ></top-bar>

    <!-- Main screen with messages and text box -->
    <v-container class="fill-height no-marg" fluid>
      <v-col class="text-center no-marg" align-self="end">
        <v-row v-for="m in findMatches" :key="m.ID" no-gutters="">
          <message-view
            ref="con"
            v-if="m.event === 1"
            :message="m"
            :startSidebar="startSidebar"
            :startDirect="startDirect"
          />
        </v-row>
      </v-col>
    </v-container>
    <v-footer app inset class="pa-0">
      <message-input
        :send="send"
        :users="usersInChannel"
        :typing="handleTyping"
        :typer="event"
      ></message-input>
    </v-footer>
  </v-container>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import Sidebar from "@/components/Sidebar.vue";
import NewChannel from "@/components/NewChannel.vue";
import TopBar from "@/components/TopBar.vue";
import MessageInput from "@/components/MessageInput.vue";
import MessageView from "@/components/MessageView.vue";
import Invitation from "@/components/Invitation.vue";
import ChannelPref from "@/components/ChannelPref.vue";

export default {
  name: "Chat",
  components: {
    Sidebar,
    NewChannel,
    TopBar,
    MessageInput,
    MessageView,
    Invitation,
    ChannelPref
  },
  props: {
    source: String
  },
  data: () => ({
    newChannel: false,
    Invite: false,
    typer: null,
    timer: null,
    channelPref: false
  }),
  updated() {
    let bottom = this.$refs.con[this.$refs.con.length - 1];
    bottom.$vuetify.goTo(bottom, { duration: 0 });
  },
  computed: {
    ...mapState([
      "user",
      "usersInChannel",
      "messages",
      "event",
      "currentChannel",
      "channels"
    ]),
    findMatches() {
      if (this.messages === undefined) {
        return [];
      }
      let match = this.messages;
      for (let i = 0; i < this.messages.length; i++) {
        const user = this.usersInChannel.find(
          u => u.id === this.messages[i].from_user
        );
        match[i].user_info = user;
      }
      return match;
    },
    channelsForUser() {
      return this.channels.filter(c => c.Member === true);
    },
    basics() {
      return this.channels.filter(
        c => c.Member === true && c.IsSidebar === false && c.Direct === false
      );
    },
    sidebars() {
      return this.channels.filter(
        c => c.Member === true && c.IsSidebar === true && c.Direct === false
      );
    },
    directs() {
      return this.channels.filter(
        c => c.Member === true && c.IsSidebar === false && c.Direct === true
      );
    }
  },
  async created() {
    await this.loadChannel(this.$router.history.current.params["channel"]);
    this.timer = setInterval(this.refreshToken, 1000 * 60); // 1 minute
    this.$vuetify.goTo(500);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    ...mapActions([
      "signout",
      "loadChannel",
      "loadUser",
      "refreshToken",
      "createChannel",
      "createSidebar",
      "createDirect",
      "addUserToChannel",
      "removeUserFromChannel",
      "newToken",
      "resolveSidebar"
    ]),
    ...mapMutations(["sendMessages"]),
    // send a message to the chat
    send(message) {
      if (message !== "") {
        this.sendMessages({
          event: 1,
          content: message,
          to_user: 1,
          from_user: this.user.id,
          channel: parseInt(this.$router.history.current.params["channel"])
        });
      }
    },
    // close the overlay for creating a new channel
    close() {
      this.newChannel = false;
      this.Invite = false;
      this.channelPref = false;
    },
    // submit the form for creating a new channel
    async submit(newName) {
      this.newChannel = false;
      await this.createChannel({
        Name: newName
      });
      this.$router.push(`/chat/${this.currentChannel.ID}`);
    },
    async submitChannelPref(newName) {
      console.log(`rename channel ${this.currentChannel.ID} from ${this.currentChannel.Name} to ${newName}`);
    },
    // handle user signing out
    handleSignout() {
      this.signout();
      this.$router.push("/login");
    },
    // change the current channel
    changeChannel(chan) {
      if (this.$router.history.current.path !== `/chat/${chan.ID}`) {
        this.$router.push(`/chat/${chan.ID}`);
        this.loadChannel(chan.ID);
      }
    },
    // open the overlay for creating a new channel
    openNewChannel() {
      this.newChannel = true;
    },
    openChannelPref() {
      this.channelPref = true;
    },
    async startSidebar(message) {
      await this.createSidebar({
        parent: message.id,
        name: `Sidebar: ${message.content}`,
        user: this.user.id
      });
      await this.loadUser(this.user.id);
    },
    async startDirect(message) {
      await this.createDirect({
        to_id: message.user_info.id,
        from_id: this.user.id,
        name: `Direct: ${message.user_info.display_name}`
      });
      await this.loadUser(this.user.id);
    },
    handleTyping() {
      console.log("typing now");
    },
    async leaveChannel(channel_id) {
      await this.removeUserFromChannel({
        user_id: this.user.id,
        channel_id: channel_id
      });
      await this.loadUser(this.user.id);
    },
    async addUser(channel_id) {
      await this.addUserToChannel({
        user_id: this.user.id,
        channel_id: channel_id
      });
      await this.loadChannel(this.$router.history.current.params["channel"]);
      await this.loadUser(this.user.id);
    },
    async invite() {
      this.newToken = await this.newToken();
      this.Invite = true;
    },
    async handleResolve(channel_id) {
      await this.resolveSidebar(channel_id);
      await this.loadUser(this.user.id);
    }
  }
};
</script>

<style lang="sass">
.no-marg
  padding: 0pt

.v-textarea.v-text-field--enclosed textarea
  margin-left: 2%
</style>
