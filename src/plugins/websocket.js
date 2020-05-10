export function createWebSocketPlugin(socket) {
  return store => {
    store.state.connected = true;
    socket.onmessage = event => {
      new Response(event.data).json().then(msg => {
        if (msg.Type === "chat-message") {
          let new_messages = store.state.messages;
          new_messages.push(msg.Payload);
          store.commit("messages", new_messages);

          let new_channels = store.state.channels;
          for (let i = 0; i < new_channels.length; i++) {
            if (new_channels[i].id === msg.Payload.channel) {
              new_channels[i].Alert = true;
            }
          }
          store.commit("channels", new_channels);
          // store.commit("newAlert", msg.channel);
        }
      });
    };
    store.subscribe(mut => {
      if (mut.type === "sendMessages") {
        socket.send(JSON.stringify(mut.payload));
      }
    });
  };
}
