const Shared = require('onboard-shared');
const Action    = Shared.Action;
const Component = Shared.Component;

let resizeBus = new Vue();

Vue.component('game-editor', {
  props: ['game'],
  template: `
  <div>
    <div class="middle">
      <game-view :game="game" v-bind:selectedComponentID="selectedComponentID"
      v-on:componentClicked="componentClickedHandler"></game-view>
    </div>
    <div class="right-settings sidebar">
      <toolbox v-bind:game="game"
               v-bind:selectedComponentID="selectedComponentID"
               v-on:componentPropertyChanged="componentPropertyChangedHander"
               v-on:classClicked="classClickedHandler"></toolbox>
    </div>
  </div>`,
  methods: {
    classClickedHandler: function (id) {
      let component = Component.fromClass(id, this.game.getClass(id));
      let compSpawn = new Action.ComponentSpawn(null, component);
      compSpawn = this.game.applyAction(compSpawn);
      makeReactive(this.game.components, compSpawn.componentID);
    },
    componentClickedHandler: function(componentID) {
      this.selectedComponent = this.game.components[componentID];
      this.selectedComponentID = componentID;
    },
    componentPropertyChangedHander: function(id, property, value) {
      this.game.components[id][property] = value;
    }
  },
  mounted: function () {
    resizeBus.$on('componentResized', (componentID, width, height, dx, dy) => {
      let resize = new Action.Resize(componentID, width, height);
      let coords = this.game.getCoords(componentID);
      let movement = new Action.Movement(componentID, parseInt(coords.x) + parseInt(dx), parseInt(coords.y) + parseInt(dy));
      this.game.applyActions(resize, movement);
    });
    resizeBus.$on('componentDeleted', (id) => {
      if (this.selectedComponentID === id) this.componentClickedHandler(null);
      let compDelete = new Action.ComponentDelete(id);
      this.game.applyAction(compDelete);
      vueDelete(this.game.components, id);
    });
  },
  data: function () {
    return {
      selectedComponent: null,
      selectedComponentID: null
    };
  }
});

interact('.comp-drag').resizable({
  onmove : function (event) {
    if ($(event.target).hasClass('locked')) return;
    resizeBus.$emit('componentResized', event.target.id, event.rect.width, event.rect.height, event.deltaRect.left, event.deltaRect.top);
  },
  edges: { top: true, left: true, bottom: true, right: true },
  // Aspect ratio resize disabled (buggy)
  preserveAspectRatio: false,
  // Flip component when resized past 0x0
  invert: 'reposition',
  // Limit multiple resizes per element
  maxPerElement: 1
});
