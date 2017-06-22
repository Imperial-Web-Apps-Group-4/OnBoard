const Shared = require('onboard-shared');
const Action = Shared.Action;
const Component = Shared.Component;

Vue.component('game-view', {
  props: ['game', 'selectedComponentID', 'maintainAspectRatio'],
  template: `
<figure class="board-area"v-bind:class="{ 'focus': game.components[selectedComponentID] !== undefined}">
    <game-component v-for="(component, compID) in game.components"
      :id="compID" :component="component"
      :componentClass="game.manifest.componentClasses[component.classID]"
      :key="compID"
      v-bind:selected="compID == selectedComponentID"
      v-bind:style="{ 'z-index': compID == selectedComponentID ? 9999 : component.zIndex }"
      v-on:component-right-clicked="(id, component) => $emit('component-right-clicked', id, component)">
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
      this.$emit('action-applied', movement);
    }).bind(this));

    bus.$on('componentClicked', (componentID) => {
      this.$emit('componentClicked', componentID);
    });

    bus.$on('componentHeld', (componentID) => {
      this.$emit('component-right-clicked', componentID, this.game.components[componentID]);
    });

    bus.$on('componentDoubleClicked', (componentID) => {
      // Fire the primary action
      // TODO: Add method to game
      let component = this.game.components[componentID];

      // Handle generic components
      if (component.type === 'generic') return;

      // Handle flippable cards
      if (component.type === 'flippable') {
        let action = new Action.Flip(componentID);
        this.game.applyAction(action);
        this.$emit('action-applied', action);
        return;
      }

      // Handle decks & stacks
      let compClass = this.game.getClass(component.classID);
      let newComp;
      if (component.type === 'deck') {
        if (component.currentCardClasses.length === 0) return; // Ignore clicks on empty decks
        let cardClassID = component.currentCardClasses.pop();
        newComp = Component.fromClass(cardClassID, this.game.getClass(cardClassID));
      } else if (component.type === 'stack') {
        if (component.count === 0) return; // Ignore clicks on empty stacks
        component.count--;
        newComp = Component.fromClass(compClass.itemClassID, this.game.getClass(compClass.itemClassID));
      }
      // Set ownership based on parent
      if (component.owned) {
        newComp.owned = true;
        newComp.owner = component.owner;
      }
      // Set dimensions & position to be like parent
      newComp.width = component.width;
      newComp.height = component.height;
      newComp.posX = component.posX + 15;
      newComp.posY = component.posY + 15;
      // Apply component spawn action
      let action = new Action.ComponentSpawn(null, newComp);
      action = this.game.applyAction(action);
      makeReactive(this.game.components, action.componentID);
      this.$emit('action-applied', action);
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
}).on('doubletap', function(event) {
  bus.$emit('componentDoubleClicked', event.currentTarget.id);
});

interact('.board-area').on('click', function (event){
  if (!$(event.target).hasClass('board-area')) return;
  bus.$emit('componentClicked', null);
});
