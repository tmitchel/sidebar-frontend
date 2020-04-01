<template>
  <v-container>
    <v-list>
      <v-subheader>Channels</v-subheader>
      <v-list-item-group v-model="channel" color="primary">
        <v-list-item
          v-for="chan in channels"
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
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "Channels",
  data: () => ({
    channel: ""
  }),
  computed: {
    ...mapState(["channels", "user"])
  },
  methods: {
    ...mapActions(["loadUser"])
  },
  async created() {
    await this.loadUser(this.user.id);
  }
};
</script>
