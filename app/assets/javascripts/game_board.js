//= require vue
//= require interact.min
//= require messaging
/* global Vue, interact, Movement */

Vue.component('game-view', {
  props: ['game'],
  template: `
<figure class="board-area">
    <game-component v-for="(component, compID) in game.components"
      :id="compID" :component="component"
      :componentClass="game.manifest.componentClasses[component.classID]"
      :key="compID">
    </game-component>
</figure>`,
  mounted: function () {
    bus.$on('componentDragged', (function (componentID, dx, dy) {
      if (dx == 0 && dy == 0) return;
      let coords = this.game.getCoords(componentID);
      let movement = new Movement(componentID, coords.x + dx, coords.y + dy);
      this.game.applyMovement(movement);
      this.$emit('component-moved', movement);
    }).bind(this));
  }
});

Vue.component('game-component', {
  props: ['id', 'component', 'componentClass'],
  template: `
<div v-bind:id="id" class="component" v-bind:class="{ 'comp-drag': !component.locked }" v-bind:style="position">
  <img v-bind:style="size" v-bind:src="\'/user_upload/game_images/\' + componentClass.imageID + \'.png\'">
</div>`,
  computed: {
    position: function () {
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

let bus = new Vue();

interact('.comp-drag').draggable({
  restrict: {
    restriction: 'parent',
    endOnly: true,
    elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
  },
  onmove: (event) => {
    bus.$emit('componentDragged', event.target.id, event.dx, event.dy);
  }
});
