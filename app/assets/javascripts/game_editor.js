//= require vue
/*global Vue*/

Vue.component('game-editor', {
  props: ['game'],
  template: `
  <game-view :game="game"></game-view>
  `
});
