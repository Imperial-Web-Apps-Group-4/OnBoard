const Component = require('onboard-shared').Component;

Vue.component('game-component', {
  props: ['id', 'component', 'componentClass', 'selected', 'maintain-aspect'],
  template: `
    <div v-bind:id="id" class="component comp-drag" v-bind:class="{ 'locked': component.locked, 'comp-selected': selected, 'maintain-aspect': this.component.aspectRatioLock }" v-bind:style="position">
      <img v-bind:style="size" v-bind:src="imageURL">
    </div>`,
  computed: {
    position: function () {
      return {
        left: this.component.posX + 'px',
        top: this.component.posY + 'px'
      };
    },
    size: function () {
      return {
        width: this.component.width + 'px',
        height: this.component.height + 'px'
      };
    },
    imageURL: function () {
      let imageID = Component.getImageID(this.component, this.componentClass);
      return `/user_upload/game_images/${imageID}.png`;
    }
  }
});
