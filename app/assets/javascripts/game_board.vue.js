//= require vue

Vue.component('game-view', {
  props: ['game'],
  template: '<div class="board">\
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Chess-board-with-letters_nevit_111.svg/1002px-Chess-board-with-letters_nevit_111.svg.png" alt="Board" />\
  </div>\
  <fieldset class="zoom-controls">\
    <input type="button" class="zoom-in" value="Zoom in" />\
    <input type="button" class="zoom-out" value="Zoom out" />\
  </fieldset>'
});

Vue.component('game-component', {
  props: ['component'],
  template: '<p>I am a component</p>'
});

var editor = new Vue({
  el: '#game-table',
  data: {
    game: {
      "manifest": {
        "componentClasses": {
          "qqazgairos": {
            "name": "Green counter",
            "imageID": "greenC",
            "width": 30,
            "height": 30
          },
          "zz1bq57nmck": {
            "name": "Red counter",
            "imageID": "redC",
            "width": 30,
            "height": 30
          },
          "ptt88sopbn": {
            "name": "Yellow counter",
            "imageID": "yellowC",
            "width": 30,
            "height": 30
          },
          "98l0utbgyn": {
            "name": "Snakes & ladders board",
            "imageID": "snakesBoard",
            "width": 500,
            "height": 500
          }
        },
        "boardID": "98l0utbgyn"
      },
      "components": {
      }
    }
  }
});
