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
      <toolbox v-bind:componentClasses="game.manifest.componentClasses"></toolbox>
    </div>
  </div>
  `
});

Vue.component('toolbox', {
  props: ['componentClasses'],
  template: `
  <div class="toolbox">
    <h2>Toolbox</h2>
    <ul>
      <li class="component" v-for="componentClass in componentClasses">
        <div class="toolbox-item">
          <img v-bind:src="\'/user_upload/game_images/\' + componentClass.imageID + \'.png\'">
        </div>
      </li>
    </ul>
  </div>`
});


let editorVue = new Vue({
  el: '.editor-panel',
  data: {
    game: deserialiseGame({
      "manifest": {
        "componentClasses": {
          "qqazgairos": {
            "name": "Blue counter",
            "imageID": "blueC",
            "width": 45,
            "height": 45
          },
          "zz1bq57nmck": {
            "name": "Red counter",
            "imageID": "redC",
            "width": 45,
            "height": 45
          },
          "98l0utbgyn": {
            "name": "Checkers board",
            "imageID": "checkerboard",
            "width": 500,
            "height": 500
          },
          "3gg3gg1997": {
            "name": "Egg counter",
            "imageID": "egg",
            "width": 256,
            "height": 256
          }
        }
      },
      "components" : {
        "fwwefeeghwegweghj": {
          classID: "98l0utbgyn",
          posX: 0,
          posY: 0
        },
        "fweghwegweghj": {
          classID: "qqazgairos",
          posX: 40,
          posY: 200
        }
      }
    })
  }
});

interact('.toolbox-item').draggable({
  restrict: {
    restriction: 'parent',
    endOnly: true,
    elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
  },
  onmove: (event) => {
    var target = event.target,
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
  }/*,
  onstart: (event) => {
    event.target.classList.add("dragging");
  },
  onend: (event) => {
    event.target.classList.remove("dragging");
  }*/
});

/*let app = new Vue({
  el: '#images-display',
  data: {
    images: []
  }
});

$('#image_upload').dmUploader({
  url: '/games/new_image',
  onUploadSuccess: function(id, data){
    if (data.error !== undefined) {
      console.log("Upload failed!");
    } else {
      console.log('Succefully uploaded image ' + id + ' to hash: ' + data.id);
      app.images.push('/user_upload/game_images/' + data.id + '.png');
    }
  }
});*/