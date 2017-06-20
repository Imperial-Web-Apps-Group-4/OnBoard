const ComponentClass = require('onboard-shared').ComponentClass;

Vue.component('toolbox', {
  props: ['game', 'selectedComponentID'],
  template: `
  <div class="toolbox">

    <toolbox-panel v-if="selectedComponent !== undefined" :title="'Editing Item'">
      <form class="item-attrs">

        <fieldset>
          <ul class="two-items">
            <li>
              <label for="position-x-selection"> Position X </label>
              <input type="number" v-bind:value="selectedComponent.posX" min="0" id="position-x-selection"
                                   v-on:input="componentPropertyChanged(selectedComponentID, 'posX', $event.target.value)" />
            </li>
            <li>
              <label for="position-y-selection"> Position Y </label>
              <input type="number" v-bind:value="selectedComponent.posY" min="0" id="position-y-selection"
                                   v-on:input="componentPropertyChanged(selectedComponentID, 'posY', $event.target.value)" />
            </li>
         </ul>
       </fieldset>

       <input type="checkbox" v-bind:checked="selectedComponent.locked" id="position-locked"
                            v-on:click="componentPropertyChanged(selectedComponentID, 'locked', $event.target.checked)" />
       <label for="position-locked">Locked </label>

       <fieldset>
         <ul class="two-items">
           <li>
              <label for="width-selection"> Width </label>
              <input type="number" v-bind:value="Math.round(selectedComponent.width)" min="0" id="width-selection"
                                   v-on:input="componentPropertyChanged(selectedComponentID, 'width', $event.target.value)" />
            </li>
            <li>
              <label for="height-selection"> Height </label>
              <input type="number" v-bind:value="Math.round(selectedComponent.height)" min="0" id="height-selection"
                                   v-on:input="componentPropertyChanged(selectedComponentID, 'height', $event.target.value)" />
            </li>
         </ul>
       </fieldset>

       <input type="checkbox" v-bind:checked="selectedComponent.aspectRatioLock" id="maintain-aspect-ratio"
                            v-on:click="componentPropertyChanged(selectedComponentID, 'aspectRatioLock', $event.target.checked); moveComponents();" />
       <label for="maintain-aspect-ratio">Maintain Aspect Ratio </label>

      <fieldset class="plus-minus">
        <ul>
          <li>
            <button v-on:click="decreaseZIndex"><i class="material-icons">remove</i></button>
          </li>
          <li>
            Layer {{selectedComponent.zIndex}}
          </li>
          <li>
            <button v-on:click="increaseZIndex"><i class="material-icons">add</i></button>
          </li>
        </ul>
      </fieldset>
     </form>
    </toolbox-panel>

    <toolbox-panel :title="'Components'">
      <template slot="header">
        <div class="field" v-bind:class="{'no-component-glow': Object.entries(game.manifest.componentClasses).length === 0}" id="image_upload">
          <i class="material-icons">file_upload</i>
          <input type="file" multiple="multiple" name="image" id="image" :accept="acceptedFormats"/>
        </div>
      </template>
      <ul>
        <li class="component" v-for="(componentClass, classID) in game.manifest.componentClasses">
          <div class="toolbox-item" draggable="true" @dragstart="e => handleDrag(e, classID)" v-on:click="classClicked(classID)">
            <img v-bind:src="'/user_upload/game_images/' + getImageID(classID) + '.png'" draggable="false">
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
    },
    increaseZIndex: function (event) {
      event.preventDefault();
      this.componentPropertyChanged(this.selectedComponentID, 'zIndex', this.selectedComponent.zIndex + 1);
    },
    decreaseZIndex: function (event) {
      event.preventDefault();
      if (this.selectedComponent.zIndex <= 1) return;
      this.componentPropertyChanged(this.selectedComponentID, 'zIndex', this.selectedComponent.zIndex - 1);
    },
    handleDrag: function (event, classID) {
      event.dataTransfer.setData('text/plain', classID);
      event.dataTransfer.dropEffect = 'none';
    },
    getImageID: function (classID) {
      return ComponentClass.getImageID(this.game.getClass(classID));
    }
  },
  computed: {
    selectedComponent: function () {
      return this.game.components[this.selectedComponentID];
    },
    acceptedFormats: function () {
      let formats = ['gif', 'jpg', 'jpeg', 'png'];
      let mimeTypes = ['image/gif', 'image/jpeg', 'image/png'];
      return formats.map((item) => '.' + item).concat(mimeTypes).join(',');
    }
  }
});

Vue.component('toolbox-panel', {
  props: ['title'],
  template: `
  <section class="panel" v-bind:class="[kebabCase(title)]">
    <header>
      <h2 v-html="title"></h2>
      <slot name="header">
      </slot>
    </header>
    <slot>
      <p>Panel contents</p>
    </slot>
  </section>`,
  methods: {
    kebabCase: function (string) {
      return string.split(/ |_|-/).join('-').split('').map(function (a) {
        return a.toLowerCase();
      }).join('').toLowerCase();
    }
  }
});
