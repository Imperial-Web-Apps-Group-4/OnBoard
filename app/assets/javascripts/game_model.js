/* exported Game deserialiseGame */

class Game {
  constructor() {
    this.manifest = new Manifest();
    this.components = {};
  }

  addComponentClass(name, imageID, width, height) {
    this.manifest.addComponentClass(name, imageID, width, height);
  }

  addComponent(componentID, posX, posY) {
    const id = generateUniqueID(this.components);
    return {id: id, component: new Component(componentID, posX, posY) };
  }

  applyMovement(movement) {
    let component = this.components[movement.componentID];
    component.posX = movement.newX;
    component.posY = movement.newY;
  }

  resizeComponent(componentID, width, height) {
    let component = this.components[componentID];
    let compClass = this.manifest.componentClasses[component.classID];
    console.log(width + ", " + height);
    compClass.width = width;
    compClass.height = height;
  }

  getCoords(componentID) {
    let comp = this.components[componentID];
    return { x: comp.posX, y: comp.posY };
  }
}

class Manifest {
  constructor() {
    this.componentClasses = {};
  }

  addComponentClass(name, imageID, width, height) {
    const id = generateUniqueID(this.componentClasses);
    this.componentClasses[id] = new ComponentClass(name, imageID, width, height);
    return id;
  }
}

class ComponentClass {
  constructor(name, imageID, width, height) {
    this.name = name;
    this.imageID = imageID;
    this.width = width;
    this.height = height;
  }
}

class Component {
  constructor(classID, posX, posY) {
    this.classID = classID;
    this.posX = posX;
    this.posY = posY;
  }
}

function generateUniqueID(object) {
  const randomID = () => Math.random().toString(36).slice(2);
  let id = randomID();
  while (object[id] !== undefined) id = randomID();
  return id;
}

function deserialiseGame(data) {
  let game = new Game();
  Object.assign(game, data);
  return game;
}
