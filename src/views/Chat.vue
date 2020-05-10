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

    <!-- Overlay for creating a new sidebar -->
    <v-overlay :absolute="false" opacity=".86" :value="newSidebar" z-index="6">
      <new-sidebar
        :close="close"
        :submit="submitSidebar"
        :message="sidebarMessage"
      ></new-sidebar>
    </v-overlay>

    <!-- Overlay for new user token -->
    <v-overlay :absolute="false" opacity=".86" :value="Invite" z-index="6">
      <invitation :close="close" :token="newToken"></invitation>
    </v-overlay>

    <!-- Notification for @'s -->
    <v-snackbar v-model="atted" top right :timeout="6000"
      >New Message!
      <v-btn color="red" text @click="atted = false">
        Close
      </v-btn></v-snackbar
    >

    <!-- Overlay with channel preferences -->
    <v-overlay :absolute="false" opacity=".86" :value="channelPref" z-index="6">
      <channel-pref
        :close="close"
        :submit="submitChannelPref"
        :channel="currentChannel"
      ></channel-pref>
    </v-overlay>

    <!-- Overlay for uploading files -->
    <v-overlay :absolute="false" opacity=".86" :value="uploadFile" z-index="6">
      <file-upload :close="close" :upload="handleUpload"></file-upload>
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
        <v-row v-for="m in findMatches" :key="m.id" no-gutters="">
          <message-view
            ref="con"
            v-if="m.event === 1"
            :message="m"
            :startSidebar="startSidebar"
            :startDirect="startDirect"
            :user="user"
            :channel="currentChannel"
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
        :fileUpload="toggleFileUpload"
      ></message-input>
    </v-footer>
  </v-container>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import Sidebar from "@/components/Sidebar.vue";
import NewChannel from "@/components/NewChannel.vue";
import NewSidebar from "@/components/NewSidebar.vue";
import TopBar from "@/components/TopBar.vue";
import MessageInput from "@/components/MessageInput.vue";
import MessageView from "@/components/MessageView.vue";
import Invitation from "@/components/Invitation.vue";
import ChannelPref from "@/components/ChannelPref.vue";
import FileUpload from "@/components/FileUpload.vue";

export default {
  name: "Chat",
  components: {
    Sidebar,
    NewChannel,
    NewSidebar,
    TopBar,
    MessageInput,
    MessageView,
    Invitation,
    ChannelPref,
    FileUpload
  },
  props: {
    source: String
  },
  data: () => ({
    newChannel: false,
    newSidebar: false,
    sidebarMessage: "",
    Invite: false,
    typer: null,
    timer: null,
    channelPref: false,
    preview: false,
    uploadFile: false,
    atted: false
  }),
  updated() {
    if (this.$refs.con !== undefined) {
      let bottom = this.$refs.con[this.$refs.con.length - 1];
      if (bottom !== undefined) {
        bottom.$vuetify.goTo(bottom, { duration: 0 });
      }
    }
  },
  computed: {
    ...mapState([
      "user",
      "usersInChannel",
      "messages",
      "event",
      "currentChannel",
      "channels",
      "alert"
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
        c => c.Member === true && c.is_sidebar === false && c.direct === false
      );
    },
    sidebars() {
      return this.channels.filter(
        c => c.Member === true && c.is_sidebar === true && c.direct === false
      );
    },
    directs() {
      return this.channels.filter(
        c => c.Member === true && c.is_sidebar === false && c.direct === true
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
      "resolveSidebar",
      "uploadFiles",
      "addUserToChannel",
      "loadUser",
      "updateChannel"
    ]),
    ...mapMutations({
      sendMessages: "sendMessages",
      updateChannels: "channels"
    }),
    // send a message to the chat
    send(message) {
      if (message !== "") {
        this.sendMessages({
          event: 1,
          content: message,
          to_user: "",
          from_user: this.user.id,
          channel: this.$router.history.current.params["channel"]
        });
      }
    },
    // close the overlay for creating a new channel
    close() {
      this.newChannel = false;
      this.newSidebar = false;
      this.Invite = false;
      this.channelPref = false;
      this.uploadFile = false;
    },
    // submit the form for creating a new channel
    async submit(newName, newDesc, newImage) {
      this.newChannel = false;
      await this.createChannel({
        Name: newName,
        details: newDesc,
        display_image: newImage
      });
      await this.addUserToChannel({
        user_id: this.user.id,
        channel_id: this.currentChannel.id
      });
      await this.loadUser(this.user.id);
      await this.loadChannel(this.currentChannel.id);
      this.$router.push(`/chat/${this.currentChannel.id}`);
    },
    async submitChannelPref(newName, newDesc, newImage) {
      await this.updateChannel({
        ...this.currentChannel,
        name: newName,
        details: newDesc,
        display_image: newImage
      });
      await this.loadUser(this.user.id);
      await this.loadChannel(this.currentChannel.id);
    },
    // handle user signing out
    handleSignout() {
      this.signout();
      this.$router.push("/login");
    },
    // change the current channel
    changeChannel(chan) {
      if (this.$router.history.current.path !== `/chat/${chan.id}`) {
        let all_channels = this.channels;
        all_channels.find(c => c.id === chan.id).Alert = false;
        this.alert[chan.id] = false;
        this.updateChannels(all_channels);
        this.$router.push(`/chat/${chan.id}`);
        this.loadChannel(chan.id);
      }
    },
    // open the overlay for creating a new channel
    openNewChannel() {
      this.newChannel = true;
    },
    openChannelPref() {
      this.channelPref = true;
    },
    startSidebar(message) {
      this.sidebarMessage = message;
      this.newSidebar = true;
    },
    async submitSidebar(message, name, desc, img) {
      this.newSidebar = false;
      await this.createSidebar({
        parent: message.channel,
        name: name,
        user: this.user.id,
        desc: desc,
        display_image: img
      });
      await this.loadUser(this.user.id);
      await this.loadChannel(this.currentChannel.id);
      this.$router.push(`/chat/${this.currentChannel.id}`);
    },
    async startDirect(message) {
      await this.createDirect({
        to_id: message.user_info.id,
        from_id: this.user.id,
        name: message.user_info.display_name,
        desc: `Direct message with ${message.user_info.display_name}`
      });
      await this.loadUser(this.user.id);
      await this.loadChannel(this.currentChannel.id);
      this.$router.push(`/chat/${this.currentChannel.id}`);
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
      await this.loadChannel(this.$router.history.current.params["channel"]);
    },
    toggleFileUpload() {
      this.uploadFile = !this.uploadFile;
    },
    async handleUpload(upFiles) {
      console.log(`uploading ${upFiles}`);
      await this.uploadFiles(upFiles);
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
