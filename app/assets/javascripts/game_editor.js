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


let editorVue = new Vue({
  el: '.editor-panel',
  data: {
    game: deserialiseGame(JSON.parse(document.getElementById('game_state').value))
  }
});

interact('.toolbox-item').draggable({
  restrict: {
    restriction: 'parent',
    endOnly: true,
    elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
  },
  onmove: (event) => {
    let target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }
});

document.querySelector('input[type=submit]').addEventListener("click", function(e){
  document.getElementById('game_state').value = JSON.stringify(editorVue.game);
});