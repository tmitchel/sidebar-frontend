<template>
  <v-container class="fill-height no-marg" fluid>
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
            <v-list-item-title @click.prevent="newChannel = !newChannel">
              Create New Channel
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-overlay :absolute="false" opacity=".86" :value="newChannel" z-index="6">
      <v-card light width="500">
        <v-card-title>New Channel</v-card-title>
        <v-container>
          <v-form>
            <v-text-field v-model="newChannelName" label="Channel Name" required></v-text-field>
          </v-form>
        </v-container>
        <v-card-actions>
          <v-btn @click="newChannel = false">Submit</v-btn>
          <v-btn @click="newChannel = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-overlay>

    <v-app-bar app color="primary" dark>
      <v-avatar color="primary">
        <v-icon dark x-large>mdi-account-circle</v-icon>
      </v-avatar>
      <v-toolbar-title>{{ currentChannel }}</v-toolbar-title>
      <v-spacer />
      <v-btn text x-large>Sign Out</v-btn>
    </v-app-bar>

    <v-container class="fill-height no-marg" fluid>
      <v-col class="text-center no-marg" align-self="end">
        <v-row v-for="m in messages" :key="m.ID" no-gutters="">
          <v-hover v-slot:default="{ hover }">
            <v-card shaped style="margin-left: 1%; margin-bottom: 1%;">
              <v-container class="pa-0 ma-0">
                <v-row>
                  <v-col cols="auto">
                    <v-card-subtitle class="pb-0 pt-1 font-weight-black text-left">
                      <v-avatar size="36" color="primary">
                        <v-icon dark>mdi-account-circle</v-icon>
                      </v-avatar>
                      {{ usersInChannel[m.FromUser].Username }}
                    </v-card-subtitle>
                    <v-card-text class="text-left pb-0">
                      {{ m.Content }}
                    </v-card-text>
                  </v-col>
                  <v-col v-if="hover">
                    <v-btn icon v-if="hover" class="mt-0">
                      <v-icon>mdi-database-plus</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-hover>
        </v-row>
        <v-row no-gutters align="end">
          <v-card style="width: 100%;" color="#616161" tile>
            <v-textarea @keypress.enter.prevent="send" v-model="message" class="custom-class" dense solo flat rows="4" name="input-7-1" auto-grow hide-details="" placeholder="Message">
              <template v-slot:append>
                <v-btn-toggle borderless="">
                  <v-btn dark icon>
                    <v-icon>mdi-emoticon-happy-outline</v-icon>
                  </v-btn>
                  <v-btn dark icon class="title">@</v-btn>
                </v-btn-toggle>
              </template>
            </v-textarea>
          </v-card>
        </v-row>
      </v-col>
    </v-container>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Chat",
  props: {
    source: String
  },
  data: () => ({
    drawer: null,
    message: "",
    currentChannel: "",
    newChannel: false,
    newChannelName: ""
  }),
  computed: {
    ...mapState(["user", "usersInChannel", "channels", "messages"])
  },
  methods: {
    send() {
      if (this.message !== "") {
        console.log(this.message);
        this.message = "";
      }
    },
    changeChannel(chan) {
      this.currentChannel = chan.Name;
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
