const basepath =
  process.env.NODE_ENV === "development"
    ? "https://localhost:8080"
    : "https://sidebar-backend.herokuapp.com";

const defaultUser = {
  id: -1,
  Username: "Default User",
  Email: "user@email.com"
};

export default {
  getWorkspaces({ commit }) {
    return new Promise((res, rej) => {
      fetch(`${basepath}/workspaces`, {
        method: "GET",
        mode: "cors"
      })
        .then(resp => {
          if (resp.ok) {
            resp.json().then(r => commit("updateWorkspaces", r));
            res();
            return;
          }
        })
        .catch(() => rej("Error getting workspaces"));
    });
  },
  sendMessages(_, payload) {
    return new Promise((res, rej) => {
      fetch(`${basepath}/api/message`, {
        method: "POST",
        mode: "cors",
        headers: {
          Authorization: `bearer ${this.state.token}`
        },
        body: JSON.stringify(payload)
      })
        .then(res)
        .catch(() => rej("Error sending message"));
    });
  },
  uploadFiles(uploads) {
    return new Promise((res, rej) => {
      for (let ups of uploads) {
        fetch(`${basepath}/api/upload`, {
          method: "POST",
          mode: "cors",
          headers: {
            Authorization: `bearer ${this.state.token}`
          },
          body: ups
        }).catch(() => rej("Error uploading file"));
      }
      res();
    });
  },
  createChannel({ commit }, channel) {
    return new Promise((res, rej) => {
      fetch(`${basepath}/api/channel`, {
        method: "POST",
        mode: "cors",
        headers: {
          Authorization: `bearer ${this.state.token}`
        },
        body: JSON.stringify(channel)
      }).then(resp => {
        if (resp.status !== 200) {
          rej("Error creating new channel");
          return;
        }
        resp.json().then(resp => {
          commit("addChannel", resp);
          commit("updateCurrentChannel", resp);
          res();
        });
      });
    });
  },
  createDirect({ commit }, { to_id, name, desc }) {
    return new Promise((res, rej) => {
      fetch(`${basepath}/api/direct/${to_id}`, {
        method: "POST",
        mode: "cors",
        headers: {
          Authorization: `bearer ${this.state.token}`
        },
        body: JSON.stringify({ Name: name, details: desc })
      })
        .then(resp => {
          if (resp.status !== 200) {
            rej("Error creating direct channel");
            return;
          }
          resp.json().then(resp => {
            commit("addChannel", resp);
            commit("updateCurrentChannel", resp);
            res();
          });
        })
        .catch(() => rej("Error creating direct channel"));
    });
  },
  createSidebar({ commit }, { parent, name, user, desc }) {
    return new Promise((res, rej) => {
      fetch(`${basepath}/api/sidebar/${parent}/${user}`, {
        method: "POST",
        mode: "cors",
        headers: {
          Authorization: `bearer ${this.state.token}`
        },
        body: JSON.stringify({ Name: name, details: desc })
      })
        .then(resp => {
          if (resp.status !== 200) {
            rej("Error creating new sidebar");
            return;
          }
          resp.json().then(resp => {
            commit("addChannel", resp);
            commit("updateCurrentChannel", resp);
            res();
          });
        })
        .catch(() => rej("Error creating new sidebar"));
    });
  },
  newToken() {
    return new Promise((res, rej) => {
      fetch(`${basepath}/api/new_token`, {
        method: "POST",
        mode: "cors",
        headers: {
          Authorization: `bearer ${this.state.token}`
        }
      })
        .then(resp => {
          if (resp.status !== 200) {
            rej("Error creating new user token");
            return;
          }
          resp.json().then(resp => {
            res(resp.Token);
          });
        })
        .catch(() => rej("Error creating new user token"));
    });
  },
  addUserToChannel(_, { channel_id }) {
    return new Promise((res, rej) => {
      fetch(`${basepath}/api/add/${channel_id}`, {
        method: "POST",
        mode: "cors",
        headers: {
          Authorization: `bearer ${this.state.token}`
        }
      })
        .then(resp => {
          if (resp.status !== 200) {
            rej("Error adding user to channel");
            return;
          }
          res();
        })
        .catch(() => rej("Error adding user to channel"));
    });
  },
  removeUserFromChannel(_, { channel_id }) {
    return new Promise((res, rej) => {
      fetch(`${basepath}/api/leave/${channel_id}`, {
        method: "DELETE",
        mode: "cors",
        headers: {
          Authorization: `bearer ${this.state.token}`
        }
      })
        .then(resp => {
          if (resp.status !== 200) {
            rej("Error leaving channel");
            return;
          }
          res();
        })
        .catch(() => rej("Error leaving channel"));
    });
  },
  loadUser({ commit }, id) {
    return new Promise((res, rej) => {
      fetch(`${basepath}/api/load_user/${id}`, {
        method: "GET",
        headers: {
          Authorization: `bearer ${this.state.token}`
        }
      })
        .then(resp => {
          resp.json().then(resp => {
            commit("updateUser", resp.User || {});
            for (let i = 0; i < resp.Channels.length; i++) {
              resp.Channels[i].Alert = false;
            }
            commit("channels", resp.Channels || []);
            res();
          });
        })
        .catch(() => rej("Error loading user"));
    });
  },
  loadChannel({ commit }, id) {
    return new Promise((res, rej) => {
      fetch(`${basepath}/api/load_channel/${id}`, {
        method: "GET",
        headers: {
          Authorization: `bearer ${this.state.token}`
        }
      })
        .then(resp => {
          resp.json().then(resp => {
            commit("messages", resp.MessagesInChannel || []);
            commit("updateCurrentChannel", resp.Channel || {});
            commit("users", resp.UsersInChannel || []);
            res();
          });
        })
        .catch(() => rej("Error loading channel"));
    });
  },
  updateUser({ commit }, user) {
    return new Promise((res, rej) => {
      fetch(`${basepath}/api/update-userinfo`, {
        method: "POST",
        mode: "cors",
        headers: {
          Authorization: `bearer ${this.state.token}`
        },
        body: JSON.stringify(user)
      })
        .then(resp => {
          if (resp.status !== 200) {
            rej("Error updating user information");
            return;
          }
          resp.json().then(resp => {
            commit("updateUser", resp);
            res();
          });
        })
        .catch(() => rej("Error updating user information"));
    });
  },
  updateChannel({ commit }, channel) {
    return new Promise((res, rej) => {
      fetch(`${basepath}/api/update-channelinfo`, {
        method: "POST",
        mode: "cors",
        headers: {
          Authorization: `bearer ${this.state.token}`
        },
        body: JSON.stringify(channel)
      })
        .then(resp => {
          if (resp.status !== 200) {
            rej("Error updating channel information");
            return;
          }
          resp.json().then(resp => {
            commit("updateCurrentChannel", resp);
            res();
          });
        })
        .catch(() => rej("Error updating channel information"));
    });
  },
  signup({ commit }, { user }) {
    return new Promise((res, rej) => {
      fetch(`${basepath}/user`, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(user)
      })
        .then(resp => {
          if (resp.status !== 200) {
            rej("Error creating new user account");
            return;
          }
          resp.json().then(resp => {
            commit("updateUser", resp.User);
            commit("updateToken", resp.Token);
            res();
          });
        })
        .catch(() => rej("Error creating new user account"));
    });
  },
  login({ commit }, payload) {
    return new Promise((res, rej) => {
      fetch(`${basepath}/login`, {
        method: "POST",
        mode: "cors",
        credentials: "include",
        body: JSON.stringify(payload)
      })
        .then(resp => {
          if (resp.status !== 200) {
            rej("Error logging in");
            return;
          }
          resp.json().then(resp => {
            commit("updateUser", resp.User);
            commit("updateToken", resp.Token);
            res();
          });
        })
        .catch(() => rej("Error logging in"));
    });
  },
  signout({ commit }) {
    commit("updateUser", defaultUser);
    commit("signout");
  },
  refreshToken({ commit }) {
    return new Promise((res, rej) => {
      fetch(`${basepath}/refresh_token`, {
        method: "POST",
        mode: "cors",
        credentials: "include"
      })
        .then(resp => {
          if (resp.status === 200) {
            resp.json().then(r => commit("updateToken", r.Token));
            res();
            return;
          }
          rej("Error refreshing token");
        })
        .catch(() => rej("Error refreshing token"));
    });
  },
  resolveSidebar(_, channel) {
    return new Promise((res, rej) => {
      fetch(`${basepath}/api/resolve/${channel}`, {
        method: "POST",
        mode: "cors",
        headers: {
          Authorization: `bearer ${this.state.token}`
        },
        credentials: "include"
      })
        .then(resp => {
          if (resp.status !== 200) {
            rej("Error resolving sidebar");
            return;
          }
          res();
        })
        .catch(() => rej("Error resolving sidebar"));
    });
  }
};
