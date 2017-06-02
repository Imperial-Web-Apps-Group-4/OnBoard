//= require vue

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
  <div class="component" v-bind:class="{ 'comp-drag': !component.locked }" v-bind:style="{ left: this.component.posX + 'px', top: this.component.posY + 'px' }">
    <img v-bind:style="size" v-bind:src="\'/user_upload/game_images/\' + componentClass.imageID + \'.png\'">
  </div>`,
  computed: {
    position: function () {
      return {
        left: this.component.posX + 'px',
        top: this.component.posY + 'px'
      }
    },
    size: function() {
      return {
        width: this.componentClass.width + 'px',
        height: this.componentClass.height + 'px'
      }
    }
  }
});

var board = new Vue({
  el: '#game-board',
  data: {
    game: {
      "manifest": {
        "componentClasses": {
          "qqazgairos": {
            "name": "Blue counter",
            "imageID": "blueC",
            "width": 45,
            "height": 45
          },
          "zz1bq57nmck": {
            "name": "Red counter",
            "imageID": "redC",
            "width": 45,
            "height": 45
          },
          "98l0utbgyn": {
            "name": "Checkers board",
            "imageID": "checkerboard",
            "width": 500,
            "height": 500
          }
        },
        "boardID": "98l0utbgyn"
      },
      "components": {
        "3jh45kjh34j": {
          "classID": "98l0utbgyn",
          "posX": 0,
          "posY": 0,
          "locked": true
        },
        "kj34lk": {
          "classID": "qqazgairos",
          "posX": 10,
          "posY": 10
        },
        "234njn": {
          "classID": "zz1bq57nmck",
          "posX": 75,
          "posY": 10
        }
      }
    }
  }
});

/* <div class="board">\
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Chess-board-with-letters_nevit_111.svg/1002px-Chess-board-with-letters_nevit_111.svg.png" alt="Board" />\
</div>\
<fieldset class="zoom-controls">\
  <input type="button" class="zoom-in" value="Zoom in" />\
  <input type="button" class="zoom-out" value="Zoom out" />\
</fieldset>
*/
