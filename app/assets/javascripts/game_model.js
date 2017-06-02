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
    this.components[id] = new Component(componentID, posX, posY);
  }

  addBoard(name, imageID, width, height) {
    this.manifest.setBoard(name, imageID, width, height);
  }

  moveComponent(movement) {
    var component = this.components[movement.componentID];
    component.x = movement.newX;
    component.y = movement.newY;
  }
}

class Manifest {
  constructor() {
    this.componentClasses = {};
  }

  setBoard(name, imageID, width, height) {
    this.boardID = this.addComponentClass(name, imageID, width, height);
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
  constructor(componentID, posX, posY) {
    this.componentID = componentID;
    this.posX = posX;
    this.posY = posY;
  }
}

class Movement {
  constructor(componentID, newX, newY) {
    this.componentID = componentID;
    this.newX = newX;
    this.newY = newY;
  }
}

function generateUniqueID(object) {
  const randomID = () => Math.random().toString(36).slice(2);
  var id = randomID();
  while (object[id] !== undefined) id = randomID();
  return id;
}

// module.exports = Game;