//= require vue
//= require game_model
/*global Vue */

let resizeBus = new Vue();

Vue.component('game-editor', {
  props: ['game'],
  template: `
  <game-view :game="game"></game-view>
  `,
  mounted: function () {
    resizeBus.$on('componentResized', (componentID, width, height, dx, dy) => {
      this.game.resizeComponent(componentID, width + dx, height + dy);
      let coords = this.game.getCoords(componentID);
      console.log("Cx:" + coords.x + " Cy:" + coords.y);
      let movement = new Movement(componentID, coords.x + dx, coords.y + dy);
      this.game.applyMovement(movement);
    })
  }
});

let editorVue = new Vue({
  el: '#editor-div',
  data: {game: deserialiseGame({
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
  }
 },
 "components": {
  "3jh45kjh34j": {
   "id": "3jh45kjh34j",
   "classID": "98l0utbgyn",
   "posX": 0,
   "posY": 0
  },
  "kj34lk": {
   "id": "kj34lk",
   "classID": "qqazgairos",
   "posX": 10,
   "posY": 10
  },
  "234njn": {
   "id": "234njn",
   "classID": "zz1bq57nmck",
   "posX": 75,
   "posY": 10
  },
  "234nj1n": {
   "id": "234njn",
   "classID": "zz1bq57nmck",
   "posX": 140,
   "posY": 10
  },
  "234n1jn": {
   "id": "234njn",
   "classID": "zz1bq57nmck",
   "posX": 205,
   "posY": 10
  },
  "2341njn": {
   "id": "234njn",
   "classID": "zz1bq57nmck",
   "posX": 270,
   "posY": 10
  }
}
})}
});

interact('.comp-drag')
.resizable({
  preserveAspectRatio: true ,
  edges: { left: true, right: true, bottom: true, top: true },
})
.on('resizemove', (event) => {
  resizeBus.$emit('componentResized', event.target.id, event.rect.width, event.rect.height, event.deltaRect.left, event.deltaRect.top)
})
