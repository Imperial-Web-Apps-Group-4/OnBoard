//= require vue
//= require interact.min
/* global Vue, interact, require */
const Action = require('onboard-shared').Action;

Vue.component('game-view', {
  props: ['game'],
  template: `
<figure class="board-area">
    <game-component v-for="(component, compID) in game.components"
      :id="compID" :component="component"
      :componentClass="game.manifest.componentClasses[component.classID]"
      :key="compID">
    </game-component>
    <div class="recycle-bin">
      <i class="material-icons">delete</i>
    </div>
</figure>`,
  mounted: function () {
    bus.$on('componentDragged', (function (componentID, dx, dy) {
      if (dx == 0 && dy == 0) return;
      let coords = this.game.getCoords(componentID);
      let movement = new Action.Movement(componentID, coords.x + dx, coords.y + dy);
      this.game.applyAction(movement);
      this.$emit('component-moved', movement);
    }).bind(this));
  }
});

Vue.component('game-component', {
  props: ['id', 'component', 'componentClass'],
  template: `
<div v-bind:id="id" class="component" v-bind:class="{ 'comp-drag': !componentClass.attributes.locked }" v-bind:style="position">
  <img v-bind:style="size" v-bind:src="'/user_upload/game_images/' + componentClass.imageID + '.png'">
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
        width: this.componentClass.defaultWidth + 'px',
        height: this.componentClass.defaultHeight + 'px'
      };
    }
  }
});

let bus = new Vue();

interact('.comp-drag').draggable({
  restrict: {
    restriction: 'parent',
    endOnly: false,
    elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
  },
  onmove: (event) => {
    bus.$emit('componentDragged', event.target.id, event.dx, event.dy);
  },
  onstart: (event) => {
    event.target.classList.add('dragging');
  },
  onend: (event) => {
    event.target.classList.remove('dragging');
  }
}
);
