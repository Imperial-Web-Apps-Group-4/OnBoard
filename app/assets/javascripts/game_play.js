//= require vue
//= require config
/* global Vue config require NAME onAnyOfPages */
/* exported board */

$(function() {
  if (!onAnyOfPages({'game_sessions': ['edit']})) return;

  const Shared = require('onboard-shared');
  const Message = Shared.Message;

  let gameID = window.location.pathname.match(/games\/(\d+)\//)[1];
  let sessionID = window.location.pathname.match(/\w{26}/)[0];
  let socket = new WebSocket('ws://' + config.gameServer + '/games/' + gameID + '/session/' + sessionID);
  let gameplayVue;

  Vue.component('chat-area', {
    props: ['messages'],
    template: `
    <div class="chatbox-content" id="chatbox-message-area">
      <div id="messages-display">
        <div v-for="msg in messages">
            <span v-bind:class="{'official-chat': msg.official}">
              <em>{{msg.name}}:</em>
              {{msg.content}}
            </span>
        </div>
      </div>
      <input v-model="typingMessage" v-on:keyup.enter="sendChat" type="text"/>
    </div>`,
    mounted: function () {
      const WelcomeMessage = new Message.ChatMessage('OnBoard', 'Welcome to OnBoard!', true);
      this.addMessage(WelcomeMessage);
    },
    methods: {
      addMessage: function(msg) {
        this.messages.unshift(msg);
      },
      sendChat: function() {
        let msg = new Message.ChatMessage(NAME, this.typingMessage);
        this.addMessage(msg);
        this.$emit('message-sent', msg);
        this.typingMessage = '';
      }
    },
    data: function () {
      return { typingMessage: '' };
    }
  });

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

    let initialState = Shared.deserialiseGame(msg.initialState);

    // Create the Vue for the main screen
    gameplayVue = new Vue({
      el: '#game-board',
      mounted: function () {
        console.log('Board Vue loaded.');
        this.$on('messageReceived', function (msg) {
          switch (msg.type) {
          case 'game':
            if (msg.action.type !== 'movement') {
              console.error('Unrecognised action format. Full message:', msg);
              return;
            }
            this.game.applyAction(msg.action);
            break;
          case 'chat':
            this.chatMessages.unshift(msg);
            break;
          default:
            console.error('Unrecognised message format. Full message:', msg);
          }

        });
      },
      methods: {
        componentMovedHandler: function (movement) {
          socket.send(new Message.GameMessage(movement).serialise());
        },
        msgSentHandler: function (msg) {
          socket.send(msg.serialise());
        }
      },
      data: {
        game: initialState,
        chatMessages: []
      }
    });

    // Register messages to be forwarded to the board
    this.onmessage = function (event) {
      gameplayVue.$emit('messageReceived', JSON.parse(event.data));
    };
  };
});
