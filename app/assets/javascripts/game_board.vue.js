/* global Vue, Movement, interact */
Vue.component('game-view', {
  props: ['game'],
  template: `
<figure class="board-area">
    <game-component v-for="component in game.components" v-bind:component="component" v-bind:componentClass="game.manifest.componentClasses[component.classID]"></game-component>
</figure>`,
});

Vue.component('game-component', {
  props: ['component', 'componentClass'],
  template: `
<div v-bind:id="component.id" class="component" v-bind:class="{ 'comp-drag': !component.locked }" v-bind:style="positionP">
  <img v-bind:style="size" v-bind:src="\'/user_upload/game_images/\' + componentClass.imageID + \'.png\'">
</div>`,
  computed: {
    positionT: function () {
      return { transform: 'translate(' + this.component.posX + 'px, ' + this.component.posY + 'px)' };
    },
    positionP: function () {
      return {
        left: this.component.posX + 'px',
        top: this.component.posY + 'px'
      };
    },
    size: function() {
      return {
        width: this.componentClass.width + 'px',
        height: this.componentClass.height + 'px'
      };
    }
  }
});

let board = new Vue({
  el: '#game-board',
  mounted: function () {
    let socket = new WebSocket('ws://onboard.fun:8080/session/' + window.location.pathname.match(/\d+/)[0]);
    socket.onopen = function () {
      console.log('Connected to game server.');
    };
    socket.onmessage = function (event) {
      let mv = JSON.parse(event.data).data;
      board.$emit('updateComponentLocation', mv.componentID, mv.newX, mv.newY);
    };

    this.$on('moveComponent', function (componentID, dx, dy) {
      this.game.components[componentID].posX += dx;
      this.game.components[componentID].posY += dy;
      let movement = new Movement(componentID, this.game.components[componentID].posX, this.game.components[componentID].posY);
      let msg = {
        type: 'game',
        data: movement
      };
      socket.send(JSON.stringify(msg));
    });

    this.$on('updateComponentLocation', function (componentID, newX, newY) {
      console.log('Updating: ', componentID, newX, newY);
      this.game.components[componentID].posX = newX;
      this.game.components[componentID].posY = newY;
    });
  },
  data: {
    game: {
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
        }
      }
    }
  }
});


interact('.comp-drag') .draggable({
  restrict: {
    restriction: 'parent',
    endOnly: true,
    elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
  },
  onmove: moveComponent
});

function moveComponent (event) {
  board.$emit('moveComponent', event.target.id, event.dx, event.dy);
}
