//= require vue
//= require config
/* global Vue config require */
/* exported board */

$(function() {
  if (!onAnyOfPages({'game_sessions': ['edit']})) return;

  const Models = require('onboard-shared');

  let gameID = window.location.pathname.match(/games\/(\d+)\//)[1];
  let sessionID = window.location.pathname.match(/\w{26}/)[0];
  let socket = new WebSocket('ws://' + config.gameServer + '/games/' + gameID + '/session/' + sessionID);
  let gameplayVue;

  socket.onopen = function () {
    console.log(`Connected to game server. Session ID: ${sessionID}.`);
  };

  socket.onmessage = function (event) {
    // Process handshake message
    let msg = JSON.parse(event.data);
    if (msg.type !== 'init') {
      alert('Game server handshake failed.');
      return;
    }
    if (msg.version !== config.gameServerClientVersion) {
      alert('Game server connection failed (version mismatch).');
      return;
    }

    let initialState = Models.deserialiseGame(msg.initialState);

    // Create the Vue for the main screen
    gameplayVue = new Vue({
      el: '#game-board',
      mounted: function () {
        console.log('Board Vue loaded.');
        this.$on('messageReceived', function (msg) {
          if (msg.type !== 'game' || msg.action.type !== 'movement') {
            console.error('Unrecognised message format. Full message:', msg);
            return;
          }
          this.game.applyMovement(msg.action);
        });
      },
      methods: {
        componentMovedHandler: function (movement) {
          socket.send(new Models.GameMessage(movement).serialise());
        }
      },
      data: {
        game: initialState
      }
    });

    // Register messages to be forwarded to the board
    this.onmessage = function (event) {
      gameplayVue.$emit('messageReceived', JSON.parse(event.data));
    };
  };

  new Vue({
    el: '#messages-display',
    data: {
        messages: [{name: "Greta", content: "Hi Timmy!"},{name: "Timothy", content: "Hi Greta!"},{name: "OnBoard", content: "Welcome to OnBoard!", official: true}]
    }
  });

});
