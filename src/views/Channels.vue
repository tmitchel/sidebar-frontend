<template>
  <v-container>
    <!-- Overlay for creating a new channel -->
    <v-overlay :absolute="false" opacity=".86" :value="newChannel" z-index="6">
      <new-channel :close="close" :submit="submit"></new-channel>
    </v-overlay>

    <v-container>
      <v-list>
        <v-subheader>Channels</v-subheader>
        <v-list-item-group v-model="channel" color="primary">
          <v-list-item
            v-for="chan in chans"
            :key="chan.id"
            :to="`/chat/${chan.id}`"
          >
            <v-list-item-content>
              {{ chan.name }}
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
            :key="chan.id"
            :to="`/chat/${chan.id}`"
          >
            <v-list-item-content>
              {{ chan.name }}
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
            :key="chan.id"
            :to="`/chat/${chan.id}`"
          >
            <v-list-item-content>
              {{ chan.name }}
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-container>
    <v-container>
      <v-btn color="secondary" class="ma-1" @click.prevent="newChannel = true">New Channel</v-btn>
      <v-btn color="secondary" class="ma-1" @click.prevent="back">Cancel</v-btn>
    </v-container>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import NewChannel from "@/components/NewChannel.vue";

export default {
  name: "Channels",
  components: { NewChannel },
  data: () => ({
    channel: "",
    newChannel: false
  }),
  computed: {
    ...mapState(["channels", "user"]),
    chans() {
      return this.channels.filter(
        c => c.is_sidebar === false && c.direct === false
      );
    },
    sidebars() {
      return this.channels.filter(c => c.is_sidebar === true);
    },
    direct() {
      return this.channels.filter(c => c.direct === true);
    }
  },
  methods: {
    ...mapActions(["loadUser", "createChannel"]),
    back() {
      this.$router.back();
    },
    // close the overlay for creating a new channel
    close() {
      this.newChannel = false;
    },
    // submit the form for creating a new channel
    async submit(newName) {
      this.newChannel = false;
      await this.createChannel({
        Name: newName
      });
    }
  },
  async created() {
    await this.loadUser(this.user.id);
  }
};
</script>
