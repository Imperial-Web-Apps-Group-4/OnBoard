//= require vue
//= require jquery
//= require dmuploader.min
//= require interact.min
/*global Vue require interact onAnyOfPages makeReactive vueDelete */
/* exported editorVue */


$(function() {
  if (!onAnyOfPages({'games': ['new', 'edit']})) return;

  const Shared = require('onboard-shared');
  const Action = Shared.Action;
  const Game = Shared.Game;
  const ComponentClass = Shared.ComponentClass;

  let eventBus = new Vue();
  let stateStr = document.getElementById('game_state').value;
  let initialState;

  if (!stateStr) {
    initialState = new Game();
  } else {
    initialState = Shared.deserialiseGame(JSON.parse(stateStr));
  }

  let editorVue = new Vue({
    el: '.editor-panel',
    data: {
      game: initialState
    },
    mounted: function () {
      eventBus.$on('newImage', (imageID, width, height) => {
        let newClass = new ComponentClass.GenericClass('', imageID, width, height);
        let classCreate = new Action.ClassCreate(null, newClass);
        classCreate = this.game.applyAction(classCreate);
        makeReactive(this.game.manifest.componentClasses, classCreate.classID);
      });
      eventBus.$on('componentDeleted', (id) => {
        let compDelete = new Action.ComponentDelete(id);
        this.game.applyAction(compDelete);
        vueDelete(this.game.components, id);
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
    ondropactivate: function (event) {
      if ($(event.relatedTarget).hasClass('locked')) return;
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
        console.log('Successfully uploaded cover image; hash: ' + data.id);
        $('#cover_image').attr('src', '/user_upload/game_images/' + data.id + '.png');
        $('#user_image_hash').val(data.id);
      }
    }
  });

  $('form').submit(function() {
    if (!$('#game_name').val()) {
      $('#game-name-needed').fadeIn(500).delay(2500).fadeOut(500);
      return false;
    }
  });

});
