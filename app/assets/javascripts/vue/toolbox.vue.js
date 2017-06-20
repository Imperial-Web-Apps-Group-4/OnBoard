Vue.component('toolbox', {
  props: ['game', 'selectedComponentID'],
  template: `
  <div class="toolbox">

    <toolbox-panel v-if="selectedComponent !== undefined" :title="'Editing Item <mark>' + selectedComponentID + '</mark>'">
      <form class="item-attrs">
        <label for="position-x-selection"> Position X </label>
        <input type="number" v-bind:value="selectedComponent.posX" min="0" id="position-x-selection"
                             v-on:input="componentPropertyChanged(selectedComponentID, 'posX', $event.target.value)" />

        <label for="position-y-selection"> Position Y </label>
        <input type="number" v-bind:value="selectedComponent.posY" min="0" id="position-y-selection"
                             v-on:input="componentPropertyChanged(selectedComponentID, 'posY', $event.target.value)" />

       <input type="checkbox" v-bind:checked="selectedComponent.locked" id="position-locked"
                            v-on:click="componentPropertyChanged(selectedComponentID, 'locked', $event.target.checked)" />
       <label for="position-locked">Locked </label>

       <label for="width-selection"> Width </label>
       <input type="number" v-bind:value="Math.round(selectedComponent.width)" min="0" id="width-selection"
                            v-on:input="componentPropertyChanged(selectedComponentID, 'width', $event.target.value)" />

       <label for="height-selection"> Height </label>
       <input type="number" v-bind:value="Math.round(selectedComponent.height)" min="0" id="height-selection"
                            v-on:input="componentPropertyChanged(selectedComponentID, 'height', $event.target.value)" />

       <input type="checkbox" v-bind:checked="selectedComponent.aspectRatioLock" id="maintain-aspect-ratio"
                            v-on:click="componentPropertyChanged(selectedComponentID, 'aspectRatioLock', $event.target.checked); moveComponents();" />
       <label for="maintain-aspect-ratio">Maintain Aspect Ratio </label>

     </form>
    </toolbox-panel>

    <toolbox-panel :title="'Toolbox'">
      <template slot="header">
        <div class="field" v-bind:class="{'no-component-glow': Object.entries(game.manifest.componentClasses).length === 0}" id="image_upload">
          <i class="material-icons">file_upload</i>
          <input type="file" multiple="multiple" name="image" id="image" />
        </div>
      </template>
      <ul>
        <li class="component" v-for="(componentClass, classID) in game.manifest.componentClasses">
          <div class="toolbox-item" v-on:click="classClicked(classID)">
            <img v-bind:src="'/user_upload/game_images/' + componentClass.imageID + '.png'">
          </div>
        </li>
        <li class="no-component-text" v-if="Object.entries(game.manifest.componentClasses).length === 0">
          Upload new images with the button above
        </li>
      </ul>
    </toolbox-panel>

  </div>`,
  methods: {
    classClicked: function (classID) {
      this.$emit('classClicked', classID);
    },
    componentPropertyChanged: function (id, property, value) {
      this.$emit('componentPropertyChanged', id, property, value);
    },
    changeAspectRatio: function (bool) {
      this.$emit('changeAspectRatio', bool);
    },
    moveComponents: function () {
      this.$emit('moveComponents');
    }
  },
  computed: {
    selectedComponent: function () {
      return this.game.components[this.selectedComponentID];
    }
  }
});

Vue.component('toolbox-panel', {
  props: ['title'],
  template: `
  <section class="panel">
    <header>
      <h2 v-html="title"></h2>
      <slot name="header">
      </slot>
    </header>
    <slot>
      <p>Panel contents</p>
    </slot>
  </section>`
});
