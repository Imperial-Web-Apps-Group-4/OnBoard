//= require vue
//= require jquery
//= require dmuploader.min
//= require interact.min
/*global Vue require interact onAnyOfPages deserialiseGame */
/* exported editorVue */


$(function() {
  if (!onAnyOfPages({'games': ['new', 'edit']})) return;

  const Models = require('onboard-shared');

  let eventBus = new Vue();

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
    </div>`,
    methods: {
      classClickedHandler: function (id) {
        let compObj = this.game.generateComponent(id, 0, 0);
        this.$set(this.game.components, compObj.id, compObj.component);
      }
    },
    mounted: function () {
      eventBus.$on('componentResized', (componentID, width, height, dx, dy) => {
        let classID = this.game.components[componentID].classID;
        this.game.resizeComponentClass(classID, width, height);
        let coords = this.game.getCoords(componentID);
        let movement = new Models.Movement(componentID, coords.x + dx, coords.y + dy);
        this.game.applyMovement(movement);
      });
      eventBus.$on('componentDeleted', (id) => {
        this.$delete(this.game.components, id);
      });
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
            <img v-bind:src="'/user_upload/game_images/' + componentClass.imageID + '.png'">
          </div>
        </li>
      </ul>
    </div>`,
    methods: {
      classClicked: function (classID) {
        this.$emit('classClicked', classID);
      }
    }
  });

  let stateStr = document.getElementById('game_state').value;
  let initialState;

  if (!stateStr) {
    initialState = new Models.Game();
  } else {
    initialState = deserialiseGame(JSON.parse(stateStr));
  }

  let editorVue = new Vue({
    el: '.editor-panel',
    data: {
      game: initialState
    },
    mounted: function () {
      eventBus.$on('newImage', (imageID, width, height) => {
        let classObj = this.game.generateComponentClass('', imageID, width, height);
        this.$set(this.game.manifest.componentClasses, classObj.id, classObj.compClass);
      });
    }
  });

  document.querySelector('input[type=submit]').addEventListener('click', function () {
    document.getElementById('game_state').value = JSON.stringify(editorVue.game);
  });

  $('#image_upload').dmUploader({
    url: '/games/new_image',
    onUploadSuccess: function (id, data) {
      if (data.error !== undefined) {
        // TODO: Inform user in a nicer way
        alert('Upload failed. Please check you are connected to the internet then try again.');
      } else {
        eventBus.$emit('newImage', data.id, data.width, data.height);
      }
    },
    onFallbackMode: function (msg) {
      alert('Upload script cannot be initialised' + msg);
    }
  });

  interact('.recycle-bin').dropzone({
    accept: '.comp-drag',
    overlap: 0.0000000001,
    ondropactivate: function () {
      document.querySelector('.board-area').classList.add('show-bin');
    },
    ondragenter: function (event) {
      event.target.classList.add('hover');
    },
    ondragleave: function (event) {
      event.target.classList.remove('hover');
    },
    ondrop: function (event) {
      // Remove it from the manifest and delete the element
      /* temporary */
      eventBus.$emit('componentDeleted', event.relatedTarget.id);
      event.target.classList.remove('hover');
    },
    ondropdeactivate: function () {
      document.querySelector('.board-area').classList.remove('show-bin');
    }
  });

  $('#cover_image_upload').dmUploader({
    url: '/games/new_image',
    onUploadSuccess: function (id, data) {
      if (data.error !== undefined) {
        console.log('Upload failed!');
      } else {
        console.log('Succefully uploaded cover image; hash: ' + data.id);
        $('#cover_image').attr('src', '/user_upload/game_images/' + data.id + '.png');
        $('#user_image_hash').val(data.id);
      }
    }
  });


  interact('.comp-drag').resizable({
    onmove : function (event) {
      eventBus.$emit('componentResized', event.target.id, event.rect.width, event.rect.height, event.deltaRect.left, event.deltaRect.top);
    },
    edges: { top: true, left: true, bottom: true, right: true },
    // Aspect ratio resize disabled (buggy)
    preserveAspectRatio: false,
    // Flip component when resized past 0x0
    invert: 'reposition',
    // Limit multiple resizes per element
    maxPerElement: 1
  });

});
