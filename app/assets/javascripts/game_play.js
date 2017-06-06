//= require vue
//= require config
//= require messaging
//= require game_model
/* global Vue config GameMessage  deserialiseGame */
/* exported board */

let board = new Vue({
  el: '#game-board',
  mounted: function () {
    let sessionID = window.location.pathname.match(/\w{26}/)[0];
    let game = this.game;

    this.socket = new WebSocket('ws://'+ config.gameServer +'/session/' +
      sessionID);
    this.socket.onopen = function () {
      console.log(`Connected to game server. Session ID: ${sessionID}).`);
    };
    this.socket.onmessage = function (event) {
      console.log('Received movement', JSON.parse(event.data));
      game.applyMovement(JSON.parse(event.data).data);
    };
  },
  data: {
    game: deserialiseGame({
      'manifest': {
        'componentClasses': {
          'qqazgairos': {
            'name': 'Blue counter',
            'imageID': 'blueC',
            'width': 45,
            'height': 45
          },
          'zz1bq57nmck': {
            'name': 'Red counter',
            'imageID': 'redC',
            'width': 45,
            'height': 45
          },
          '98l0utbgyn': {
            'name': 'Checkers board',
            'imageID': 'checkerboard',
            'width': 500,
            'height': 500
          }
        }
      },
      'components': {
        '3jh45kjh34j': {
          'id': '3jh45kjh34j',
          'classID': '98l0utbgyn',
          'posX': 0,
          'posY': 0,
          'locked': true
        },
        'kj34lk': {
          'id': 'kj34lk',
          'classID': 'qqazgairos',
          'posX': 10,
          'posY': 10
        },
        '234njn': {
          'id': '234njn',
          'classID': 'zz1bq57nmck',
          'posX': 75,
          'posY': 10
        },
        '234nj1n': {
          'id': '234nj1n',
          'classID': 'zz1bq57nmck',
          'posX': 140,
          'posY': 10
        },
        '234n1jn': {
          'id': '234n1jn',
          'classID': 'zz1bq57nmck',
          'posX': 205,
          'posY': 10
        },
        '2341njn': {
          'id': '2341njn',
          'classID': 'zz1bq57nmck',
          'posX': 270,
          'posY': 10
        }
      }
    })
  },
  methods: {
    componentMovedHandler: function (movement) {
      let msg = new GameMessage(movement);
      this.socket.send(msg.serialise());
    }
  }
});
