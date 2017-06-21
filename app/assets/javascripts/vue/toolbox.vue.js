const Action = require('onboard-shared').Action;
const ComponentClass = require('onboard-shared').ComponentClass;

let toolboxBus = new Vue();

Vue.component('toolbox', {
  props: ['game', 'selectedComponentID'],
  template: `
  <div class="toolbox">

    <toolbox-panel v-if="selectedComponent !== undefined" :title="'Editing Component'">
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

    <toolbox-panel :title="'Editing Component Class'" v-if="selectedClass !== undefined">
      <form class="class-attrs">
      <fieldset>
        <ul class="two-items">
          <li>
             <label for="class-width"> Width </label>
             <input type="number" v-bind:value="Math.round(selectedClass.defaultWidth)" min="0" id="class-width"
                                  v-on:input="classPropertyChanged(selectedClassID, 'defaultWidth', parseInt($event.target.value))" />
           </li>
           <li>
             <label for="class-height"> Height </label>
             <input type="number" v-bind:value="Math.round(selectedClass.defaultHeight)" min="0" id="class-height"
                                  v-on:input="classPropertyChanged(selectedClassID, 'defaultHeight', parseInt($event.target.value))" />
           </li>
        </ul>
      </fieldset>

      <label for="class-type">Class type</label>
      <select v-bind:value="selectedClass.type" v-on:input="classPropertyChanged(selectedClassID, 'type', $event.target.value)" id="class-type">
        <option value="generic">Normal</option>
        <option value="flippable">Two-sided</option>
        <option value="deck">Deck</option>
        <option value="stack">Stack</option>
      </select>

      <label for="primary-image-upload">{{primaryImageName(selectedClass.type)}}</label>
      <div class="content"><img style="width: 50px; height: 50px;" :src="getImageURL(getClassImgID(selectedClassID))"/></div>

      <div class="field" id="primaryImageUpload">
        <i class="material-icons">file_upload</i>
        <input type="file" name="primary_image_upload" id="primary_image_upload" :accept="acceptedFormats">
      </div>

      <div v-if="selectedClass.type === 'deck'">
        <!-- Deck front classes -->
        <label for="deckFrontClasses">Card fronts</label>
        <section id="deckFrontClasses">
          <div v-for="cardClassID in selectedClass.cardClassIDs" class="card-front">
            <img style="width: 50px; height: 50px;" :src="getImageURL(game.getClass(cardClassID).frontImageID)"/>
          </div>

          <div class="field" id="deckImageUpload">
            <i class="material-icons">file_upload</i>
            <input type="file" :multiple="true" name="deck-image-upload" id="deck-image-upload" :accept="acceptedFormats"/>
          </div>
        </section>
      </div>

      <div v-if="selectedClass.type === 'stack'">
        <label for="stack-quantity">Quantity</label>
        <input v-if="infiniteStack(selectedClass)" type="text" :disabled="true" value='∞'>
        <input v-else type="number" v-bind:value="selectedClass.defaultCount" min="0" id="stack-quantity"
               v-on:input="classPropertyChanged(selectedClassID, 'defaultCount', $event.target.value)" >
        <input type="checkbox" v-bind:checked="infiniteStack(selectedClass)" id="stack-infinite"
                            v-on:click="infiniteClicked(selectedClassID, $event.target.checked)" >
        <label for="stack-infinite">Infinite</label>
      </div>

      <div v-if="selectedClass.type === 'flippable'">
        <label for="flip-image-upload">Front image</label>
        <div class="content"><img :src="getImageURL(selectedClass.frontImageID)" style="width: 50px; height: 50px;"/></div>
        <div class="field" id="flipImageUpload">
          <i class="material-icons">file_upload</i>
          <input type="file" name="flip-image-upload" id="flip-image-upload" :accept="acceptedFormats"/>
        </div>
      </div>
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
        <li class="component" v-for="(componentClass, classID) in game.manifest.componentClasses" v-if="!componentClass.generated">
          <div class="toolbox-item" draggable="true" @dragstart="e => handleDrag(e, classID)" v-on:click="classClicked(classID)">
            <img v-bind:src="getImageURL(getClassImgID(classID))" draggable="false">
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
    classPropertyChanged: function (id, property, value) {
      if (property !== 'type') {
        this.$emit('classPropertyChanged', id, property, value);
        switch (property) {
          case 'cardClassIDs':
            Object.keys(this.game.components).forEach(compID => {
              let comp = this.game.components[compID];
              if (comp.classID === id) {
                comp.currentCardClasses = value.slice();
              }
            });
            break;
          case 'defaultCount':
            Object.keys(this.game.components).forEach(compID => {
              let comp = this.game.components[compID];
              if (comp.classID === id) comp.count = value;
            });
            break;
          default:
            break;
        }
        return;
      }
      this.$emit('classPropertyChanged', id, property, value);
      let compClass = this.game.getClass(id);
      let img = compClass.imageID || compClass.backImageID;
      let stackClass;
      let create;
      Vue.delete(compClass, 'imageID');
      Vue.delete(compClass, 'backImageID');
      Vue.delete(compClass, 'frontImageID');
      Vue.delete(compClass, 'cardClassIDs');
      Vue.delete(compClass, 'defaultCount');
      Vue.delete(compClass, 'contentClassID');
      switch (value) {
        case 'stack':
          this.classPropertyChanged(id, 'defaultCount', 10);
          makeReactive(compClass, 'defaultCount');
          stackClass = new ComponentClass.GenericClass('', img,
            this.selectedClass.defaultWidth, this.defaultHeight, true);
          create = new Action.ClassCreate(null, stackClass);
          create = this.game.applyAction(create);
          this.classPropertyChanged(this.selectedClassID, 'itemClassID', create.classID);
          makeReactive(compClass, 'itemClassID');
        case 'generic':
          this.classPropertyChanged(id, 'imageID', img);
          makeReactive(compClass, 'imageID');
          break;
        case 'flippable':
          this.classPropertyChanged(id, 'backImageID', img);
          this.classPropertyChanged(id, 'frontImageID', 'no_image');
          makeReactive(compClass, 'backImageID');
          makeReactive(compClass, 'frontImageID');
          break;
        case 'deck':
          this.classPropertyChanged(id, 'backImageID', img);
          this.classPropertyChanged(id, 'cardClassIDs', []);
          makeReactive(compClass, 'backImageID');
          makeReactive(compClass, 'cardClassIDs');
          break;
        default:
          console.error('No class type with name', value);
      }
      setTimeout(() => {
        $('#deckImageUpload').dmUploader(dmOptions('deck'));
        $('#flipImageUpload').dmUploader(dmOptions('flip'));
      }, 100);
      Object.keys(this.game.components).forEach(compID => {
        let comp = this.game.components[compID];
        if (comp.classID === id) this.convertComponent(comp, value);
      });
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
    getImageURL: function (imageID) {
      return `/user_upload/game_images/${imageID}.png`;
    },
    getClassImgID: function (classID) {
      return ComponentClass.getImageID(this.game.getClass(classID));
    },
    primaryImageName: function (classType) {
      switch (classType) {
        case 'deck':
        case 'flippable':
          return 'Back image';
        case 'stack':
          return 'Display image';
        case 'generic':
        default:
          return 'Image';
      }
    },
    infiniteStack: function (compClass) {
      return compClass.defaultCount === -1;
    },
    infiniteClicked: function (classID, inifiteChecked) {
      if (inifiteChecked) {
        this.classPropertyChanged(classID, 'defaultCount', -1);
      } else {
        this.classPropertyChanged(classID, 'defaultCount', 10);
      }
    },
    convertComponent: function (comp, newType) {
      let compClass = this.game.getClass(comp.classID);
      // Set type
      comp.type = newType;
      // Delete possible other members
      Vue.delete(comp, 'currentCardClasses');
      Vue.delete(comp, 'faceDown');
      Vue.delete(comp, 'count');
      switch (newType) {
        case 'generic':
          return;
        case 'stack':
          Vue.set(comp, 'count', compClass.defaultCount);
          break;
        case 'flippable':
          Vue.set(comp, 'faceDown', true);
          break;
        case 'deck':
          Vue.set(comp, 'currentCardClasses', compClass.cardClassIDs.slice());
          break;
        default:
          console.error('No class type with name', newType);
      }
    }
  },
  computed: {
    selectedComponent: function () {
      return this.game.components[this.selectedComponentID];
    },
    selectedClassID: function () {
      if (!this.selectedComponent) return null;
      return this.selectedComponent.classID;
    },
    selectedClass: function () {
      return this.game.getClass(this.selectedClassID);
    },
    acceptedFormats: function () {
      let formats = ['gif', 'jpg', 'jpeg', 'png'];
      let mimeTypes = ['image/gif', 'image/jpeg', 'image/png'];
      return formats.map((item) => '.' + item).concat(mimeTypes).join(',');
    }
  },
  mounted: function () {
    toolboxBus.$on('newImage', (imageName, imageID) => {
      let cardClass;
      let create;
      switch (imageName) {
        case 'primary':
          switch (this.selectedClass.type) {
            case 'stack':
              cardClass = new ComponentClass.GenericClass('', imageID,
                this.selectedClass.defaultWidth, this.defaultHeight, true);
              create = new Action.ClassCreate(null, cardClass);
              create = this.game.applyAction(create);
              this.classPropertyChanged(this.selectedClassID, 'itemClassID', create.classID);
            case 'generic':
              this.classPropertyChanged(this.selectedClassID, 'imageID', imageID);
              break;
            case 'deck':
            case 'flippable':
              this.classPropertyChanged(this.selectedClassID, 'backImageID', imageID);
              break;
            default:
              console.error('Unrecognised class type.');
          }
          break;
        case 'flip':
          this.classPropertyChanged(this.selectedClassID, 'frontImageID', imageID);
          break;
        case 'deck':
          // Make new generated flippable class based on image
          cardClass = new ComponentClass.FlippableClass('',
            this.selectedClass.backImageID, imageID,
            this.selectedClass.defaultWidth, this.defaultHeight, true);
          create = new Action.ClassCreate(null, cardClass);
          create = this.game.applyAction(create);
          this.selectedClass.cardClassIDs.push(create.classID);
          break;
        default:
          console.error('Incorrect image identifier specified for image upload.');
      }
    });
  },
  watch: {
    selectedClass: function () {
      setTimeout(() => {
        $('#primaryImageUpload').dmUploader(dmOptions('primary'));
        $('#deckImageUpload').dmUploader(dmOptions('deck'));
        $('#flipImageUpload').dmUploader(dmOptions('flip'));
      }, 100);
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

function dmOptions(imageName) {
  return {
    url: '/games/new_image',
    onUploadSuccess: function (id, data) {
      console.log('sucesss');
      if (data.error !== undefined) {
        // TODO: Inform user in a nicer way
        alert('Upload failed. Please check you are connected to the internet then try again.');
      } else {
        toolboxBus.$emit('newImage', imageName, data.id);
      }
    },
    onFallbackMode: function (msg) {
      alert('Upload script cannot be initialised' + msg);
    }
  };
}
