//= require vue
//= require jquery
//= require dmuploader.min
//= require game_model
/*global Vue deserialiseGame Game */
/* exported editorVue */

Vue.component('game-editor', {
  props: ['game'],
  template: `
  <div>
    <div class="middle">
      <game-view :game="game"></game-view>
    </div>
    <div class="right-settings sidebar">
      <toolbox v-bind:componentClasses="game.manifest.componentClasses" v-on:classClicked="classClickedHandler"></toolbox>
    </div>
  </div>
  `,
  methods: {
    classClickedHandler: function(id) {
      let compObj = this.game.generateComponent(id, 0, 0);
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
      <li class="component" v-for="(componentClass, classID) in componentClasses">
        <div class="toolbox-item" v-on:click="classClicked(classID)">
          <img v-bind:src="\'/user_upload/game_images/\' + componentClass.imageID + \'.png\'">
        </div>
      </li>
    </ul>
  </div>`,
  methods: {
    classClicked: function(classID) {
      this.$emit('classClicked', classID);
    }
  }
});

let uploadBus = new Vue();

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
  },
  mounted: function () {
    uploadBus.$on('newImage', (imageID, width, height) => {
      let classObj = this.game.generateComponentClass('', imageID, width, height);
      this.$set(this.game.manifest.componentClasses, classObj.id, classObj.compClass);
    });
  }
});

document.querySelector('input[type=submit]').addEventListener('click', function(){
  document.getElementById('game_state').value = JSON.stringify(editorVue.game);
});

$('#image_upload').dmUploader({
  url: '/games/new_image',
  onUploadSuccess: function(id, data){
    if (data.error !== undefined) {
      // TODO: Inform user in a nicer way
      alert('Upload failed. Please check you are connected to the internet then try again.');
    } else {
      uploadBus.$emit('newImage', data.id, data.width, data.height);
    }
  },
  onFallbackMode: (msg) => {
    alert('Upload script cannot be initialised' + msg);
  }
});
