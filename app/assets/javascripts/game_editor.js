//= require vue
//= require game_model
/*global Vue deserialiseGame*/

Vue.component('game-editor', {
  props: ['game'],
  template: `
  <div>
    <div class="middle">
      <game-view :game="game"></game-view>
    </div>
    <div class="right-settings sidebar">
      <toolbox v-bind:componentClasses="game.manifest.componentClasses" v-on:componentClassClicked="componentClassClickedHandler"></toolbox>
    </div>
  </div>
  `,
  methods: {
    componentClassClickedHandler: function(id) {
      let compObj = this.game.addComponent(id, 0, 0);
      this.$set(this.game.components, compObj.id, compObj.component);
    }
  }
});

Vue.component('toolbox', {
  props: ['componentClasses'],
  template: `
  <div class="toolbox">
    <h2>Toolbox</h2>
    <ul>
      <li class="component" v-for="(componentClass, key) in componentClasses">
        <div class="toolbox-item" v-on:click="add(key)">
          <img v-bind:src="\'/user_upload/game_images/\' + componentClass.imageID + \'.png\'">
        </div>
      </li>
    </ul>
  </div>`,
  methods: {
    add: function(id) {
      console.log(id, "Toolbox item clicked, add triggered");
      this.$emit('componentClassClicked', id);
    }
  }
});

let stateStr = document.getElementById('game_state').value;
let initialState;

if (!stateStr) {
  initialState = new Game();
} else {
  initialState = deserialiseGame(JSON.parse(stateStr));
}

let editorVue = new Vue({
  el: '.editor-panel',
  data: {
    game: initialState
  }
});

document.querySelector('input[type=submit]').addEventListener("click", function(e){
  document.getElementById('game_state').value = JSON.stringify(editorVue.game);
});