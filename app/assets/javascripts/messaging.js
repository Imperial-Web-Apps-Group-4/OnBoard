/* exported Message GameMessage */

class Message {
  constructor(type, data) {
    this.type = type;
    this.data = data;
  }

  serialise() {
    return JSON.stringify(this);
  }
}

class GameMessage extends Message {
  constructor(data) {
    super('game', data);
  }
}
