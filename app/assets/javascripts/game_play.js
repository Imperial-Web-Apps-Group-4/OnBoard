//= require vue
//= require config
//= require messaging
//= require game_model
/* global Vue config deserialiseGame GameMessage */
/* exported board */

$(function() {
  if (!onAnyOfPages({"game_sessions": ["edit"]})) return;

  let sessionID = window.location.pathname.match(/\w{26}/)[0];
  let socket = new WebSocket('ws://' + config.gameServer + '/session/' + sessionID);
  let gameplayVM;

  socket.onopen = function () {
    console.log(`Connected to game server. Session ID: ${sessionID}).`);
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
    let initialState = deserialiseGame(msg.initalGameState);

    // Create the Vue for the main screen
    gameplayVM = new Vue({
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
          socket.send(new GameMessage(movement).serialise());
        }
      },
      data: {
        game: initialState
      }
    });

    // Register messages to be forwarded to the board
    this.onmessage = function (event) {
      gameplayVM.$emit('messageReceived', JSON.parse(event.data));
    };
  };
});
