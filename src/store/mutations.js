export default {
  updateToken(state, token) {
    state.token = token;
  },
  updateUser(state, user) {
    state.user = user;
  },
  messages(state, messages) {
    state.messages = messages;
  },
  channels(state, channels) {
    state.channels = channels;
    for (let i = 0; i < channels.length; i++) {
      state.alert[channels[i].id] = false;
    }
  },
  newAlert(state, channelID) {
    state.alerts[channelID] = true;
  },
  users(state, usersInChannel) {
    state.usersInChannel = usersInChannel;
  },
  updateCurrentChannel(state, channel) {
    state.currentChannel = channel;
  },
  addChannel(state, channel) {
    state.channels.push(channel);
  },
  signout() {}
};
