//= require vue
//= require game_model
/*global Vue*/

Vue.component('game-editor', {
  props: ['game'],
  template: `
  <game-view :game="game"></game-view>
  `,
  mounted: function () {
    resizeBus.$on('componentResized', (componentID, width, height, dx, dy) => {
      this.game.resizeComponent(componentID, width, height);
      let coords = this.game.getCoords(componentID);
      let movement = new Movement(componentID, coords.x + dx, coords.y + dy);
      this.game.applyMovement(movement);
    })
  }
});

let resizeBus = new Vue();

interact('.comp-resize')
.resizable({
  preserveAspectRatio: true,
  edges: { left: true, right: true, bottom: true, top: true },
  invert: 'reposition'
})
.on('resizemove', (event) => {
  resizeBus.$emit('componentResized', event.target.id, event.rect.width, event.rect.height, event.deltaRect.left, event.deltaRect.top)
})
