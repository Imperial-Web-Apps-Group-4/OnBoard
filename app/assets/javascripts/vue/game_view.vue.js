const Action = require('onboard-shared').Action;

Vue.component('game-view', {
  props: ['game', 'selectedComponentID', 'maintainAspectRatio'],
  template: `
<figure class="board-area"v-bind:class="{ 'focus': game.components[selectedComponentID] !== undefined}">
    <game-component v-for="(component, compID) in game.components"
      :id="compID" :component="component"
      :componentClass="game.manifest.componentClasses[component.classID]"
      :key="compID"
      v-bind:selected="compID == selectedComponentID"
    v-on:component-right-clicked="(id, component) => $emit('component-right-clicked', id, component)"></game-component>
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

    bus.$on('componentHeld', (componentID) => {
      this.$emit('component-right-clicked', componentID, this.game.components[componentID]);
    });
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
}).on('tap', function (event) {
  bus.$emit('componentClicked', event.currentTarget.id);
}).on('hold', function (event) {
  bus.$emit('componentHeld', event.currentTarget.id);
});

interact('.board-area').on('click', function (event){
  if (!$(event.target).hasClass('board-area')) return;
  bus.$emit('componentClicked', null);
});
