<template>
  <v-container>
    <v-container>
      <v-list>
        <v-subheader>Channels</v-subheader>
        <v-list-item-group v-model="channel" color="primary">
          <v-list-item
            v-for="chan in chans"
            :key="chan.ID"
            :to="`/chat/${chan.ID}`"
          >
            <v-list-item-content>
              {{ chan.Name }}
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-container>

    <v-container>
      <v-list>
        <v-subheader>Sidebars</v-subheader>
        <v-list-item-group v-model="channel" color="primary">
          <v-list-item
            v-for="chan in sidebars"
            :key="chan.ID"
            :to="`/chat/${chan.ID}`"
          >
            <v-list-item-content>
              {{ chan.Name }}
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-container>

    <v-container>
      <v-list>
        <v-subheader>Direct</v-subheader>
        <v-list-item-group v-model="channel" color="primary">
          <v-list-item
            v-for="chan in direct"
            :key="chan.ID"
            :to="`/chat/${chan.ID}`"
          >
            <v-list-item-content>
              {{ chan.Name }}
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-container>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "Channels",
  data: () => ({
    channel: ""
  }),
  computed: {
    ...mapState(["channels", "user"]),
    chans() {
      return this.channels.filter(c => c.IsSidebar === false);
    },
    sidebars() {
      return this.channels.filter(c => c.IsSidebar === true);
    },
    direct() {
      return this.channels.filter(c => c.Direct === true);
    }
  },
  methods: {
    ...mapActions(["loadUser"])
  },
  async created() {
    await this.loadUser(this.user.id);
  }
};
</script>
