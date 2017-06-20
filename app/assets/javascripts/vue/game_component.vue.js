const Component = require('onboard-shared').Component;

Vue.component('game-component', {
  props: ['id', 'component', 'componentClass', 'selected', 'maintain-aspect'],
  template: `
<div v-bind:id="id" class="component comp-drag" v-bind:class="{ 'locked': component.locked, 'comp-selected': selected, 'maintain-aspect': this.component.aspectRatioLock, 'comp-owned': component.owned, 'comp-hidden': (component.owned && component.owner !== USERIDENTIFICATION) }"
    v-bind:style="position" @contextmenu.prevent="rightClick">
  <img v-bind:style="size" v-bind:src="'/user_upload/game_images/' + componentClass.imageID + '.png'">
</div>`,
  methods: {
    rightClick: function () {
      this.$emit('component-right-clicked', this.id, this.component);
    }
  },
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
  },
  data: function () {
    return {
      USERIDENTIFICATION: USERIDENTIFICATION
    }
  }
});
