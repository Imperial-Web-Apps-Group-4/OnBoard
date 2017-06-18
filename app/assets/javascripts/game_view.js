//= require vue
//= require interact.min
/* global Vue, interact, require */
const Action = require('onboard-shared').Action;
const Component = require('onboard-shared').Component;

Vue.component('game-view', {
  props: ['game', 'selectedComponentID'],
  template: `
<figure class="board-area" v-bind:class="{ 'focus': selectedComponentID != undefined }">
    <game-component v-for="(component, compID) in game.components"
      :id="compID" :component="component"
      :componentClass="game.manifest.componentClasses[component.classID]"
      :key="compID"
      v-bind:selected="compID == selectedComponentID">
    </game-component>
    <div class="recycle-bin">
      <i class="material-icons">delete</i>
    </div>
</figure>`,
  mounted: function () {
    bus.$on('componentDragged', (function (componentID, dx, dy) {
      if (dx == 0 && dy == 0) return;
      let coords = this.game.getCoords(componentID);
      let movement = new Action.Movement(componentID, parseInt(coords.x) + dx, parseInt(coords.y) + dy);
      this.game.applyAction(movement);
      this.$emit('component-moved', movement);
    }).bind(this));

    bus.$on('componentClicked', (componentID) => {
      this.$emit('componentClicked', componentID);
    });
  }
});

Vue.component('game-component', {
  props: ['id', 'component', 'componentClass', 'selected'],
  template: `
<div v-bind:id="id" class="component comp-drag" v-bind:class="{ 'locked': component.locked, 'comp-selected': selected }" v-bind:style="position">
  <img v-bind:style="size" v-bind:src="imageURL">
</div>`,
  computed: {
    position: function () {
      return {
        left: this.component.posX + 'px',
        top: this.component.posY + 'px'
      };
    },
    size: function () {
      return {
        width: this.component.width + 'px',
        height: this.component.height + 'px'
      };
    },
    imageURL: function () {
      let imageID = Component.getImageID(this.component, this.componentClass);
      return `/user_upload/game_images/${imageID}.png`;
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
    if ($(event.target).hasClass('locked')) return;
    bus.$emit('componentDragged', event.target.id, event.dx, event.dy);
  },
  onstart: (event) => {
    if ($(event.target).hasClass('locked')) return;
    event.target.classList.add('dragging');
  },
  onend: (event) => {
    event.target.classList.remove('dragging');
  }
}).on('tap', function(event) {
  bus.$emit('componentClicked', event.currentTarget.id);
});

interact('.board-area').on('click', function (event){
  if (!$(event.target).hasClass('board-area')) return;
  bus.$emit('componentClicked', null);
});
