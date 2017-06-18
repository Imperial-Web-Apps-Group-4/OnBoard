/* globals NAME */

const Message = require('onboard-shared').Message;

Vue.component('chat-area', {
  props: ['messages'],
  template: `
    <div class="chatbox-content" id="chatbox-message-area">
      <div id="messages-display">
        <div v-for="msg in messages">
            <span v-bind:class="{'official-chat': msg.official}">
              <em>{{msg.name}}:</em>
              {{msg.content}}
            </span>
        </div>
      </div>
      <input v-model="typingMessage" v-on:keyup.enter="sendChat" type="text"/>
    </div>`,
  mounted: function () {
    const WelcomeMessage = new Message.ChatMessage('OnBoard', 'Welcome to OnBoard!', true);
    const ShareMessage = new Message.ChatMessage('OnBoard', `Share this link to your friends to play together: ${window.location.href}`, true);
    this.addMessage(WelcomeMessage);
    this.addMessage(ShareMessage);
  },
  methods: {
    addMessage: function(msg) {
      this.messages.unshift(msg);
    },
    sendChat: function() {
      let msg = new Message.ChatMessage(NAME, this.typingMessage);
      this.addMessage(msg);
      this.$emit('message-sent', msg);
      this.typingMessage = '';
    }
  },
  data: function () {
    return { typingMessage: '' };
  }
});
