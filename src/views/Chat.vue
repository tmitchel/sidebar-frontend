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
    <top-bar :currentChannel="currentChannel" :signout="signout"></top-bar>

    <!-- Main screen with messages and text box -->
    <v-container class="fill-height no-marg" fluid>
      <v-col class="text-center no-marg" align-self="end">
        <v-row v-for="m in messages" :key="m.ID" no-gutters="">
          <message-view :message="m" :usersInChannel="usersInChannel" />
        </v-row>
        <v-row no-gutters align="end">
          <message-input :send="send"></message-input>
        </v-row>
      </v-col>
    </v-container>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
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
    currentChannel: "",
    newChannel: false
  }),
  computed: {
    ...mapState(["user", "usersInChannel", "channels", "messages"])
  },
  methods: {
    // send a message to the chat
    send(message) {
      if (message !== "") {
        console.log(message);
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
    signout() {
      console.log("signing out");
    },
    // change the current channel
    changeChannel(chan) {
      this.currentChannel = chan.Name;
    },
    // open the overlay for creating a new channel
    openNewChannel() {
      this.newChannel = true;
    }
  }
};
</script>

<style lang="sass">
@import '~vuetify/src/styles/styles.sass'

.no-marg
  padding: 0pt

.v-textarea.v-text-field--enclosed textarea
  margin-left: 2%
</style>
