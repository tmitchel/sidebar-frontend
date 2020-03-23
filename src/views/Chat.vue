<template>
  <v-container class="fill-height no-marg" fluid>
    <!-- Left panel showing channels -->
    <sidebar
      :channels="channels"
      :changeChannel="changeChannel"
      :newChannel="openNewChannel"
    />

    <!-- Overlay for creating a new channel -->
    <v-overlay :absolute="false" opacity=".86" :value="newChannel" z-index="6">
      <new-channel :close="close" :submit="submit"></new-channel>
    </v-overlay>

    <!-- Navbar with current channel name and logout button -->
    <top-bar
      :currentChannel="currentChannel"
      :signout="handleSignout"
    ></top-bar>

    <!-- Main screen with messages and text box -->
    <v-container class="fill-height no-marg" fluid>
      <v-col class="text-center no-marg" align-self="end">
        <v-row v-for="m in findMatches" :key="m.ID" no-gutters="">
          <message-view
            v-if="m.event === 1"
            :message="m"
            :startSidebar="startSidebar"
          />
        </v-row>
        <v-row no-gutters align="end">
          <message-input
            :send="send"
            :users="usersInChannel"
            :typing="handleTyping"
            :typer="event"
          ></message-input>
        </v-row>
      </v-col>
    </v-container>
  </v-container>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import Sidebar from "@/components/Sidebar.vue";
import NewChannel from "@/components/NewChannel.vue";
import TopBar from "@/components/TopBar.vue";
import MessageInput from "@/components/MessageInput.vue";
import MessageView from "@/components/MessageView.vue";

export default {
  name: "Chat",
  components: { Sidebar, NewChannel, TopBar, MessageInput, MessageView },
  props: {
    source: String
  },
  data: () => ({
    newChannel: false,
    typer: null,
    timer: null
  }),
  computed: {
    ...mapState([
      "user",
      "usersInChannel",
      "channels",
      "messages",
      "event",
      "currentChannel"
    ]),
    findMatches() {
      console.log(this.$router.history.current.params["channel"]);
      let match = this.messages;
      for (let i = 0; i < this.messages.length; i++) {
        const user = this.usersInChannel.find(
          u => u.id === this.messages[i].from_user
        );
        match[i].user_info = user;
      }
      return match;
    }
  },
  async created() {
    await this.loadChannel(this.$router.history.current.params["channel"]);
    this.timer = setInterval(this.refreshToken, 1000 * 60); // 1 minute
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    ...mapActions(["signout", "loadChannel", "refreshToken"]),
    ...mapMutations(["sendMessages"]),
    // send a message to the chat
    send(message) {
      if (message !== "") {
        console.log(message);
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
    },
    // submit the form for creating a new channel
    submit(newName) {
      console.log(`Creating new channel: ${newName}`);
      this.newChannel = false;
    },
    // handle user signing out
    handleSignout() {
      this.signout();
      console.log("signing out");
      this.$router.push("/login");
    },
    // change the current channel
    changeChannel(chan) {
      this.$router.push(`/chat/${chan.ID}`);
      this.loadChannel(chan.ID);
    },
    // open the overlay for creating a new channel
    openNewChannel() {
      this.newChannel = true;
    },
    startSidebar() {
      console.log("starting a sidebar");
    },
    handleTyping() {
      console.log("typing now");
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
