// Network: same path as pain-01 but via require().
var state = require('./state');
var render = require('./render');

var CHAT_URL = 'http://127.0.0.1:3001/chat';

async function sendUserMessage(text) {
  state.addMessage('user', text);
  render.renderAll();

  var payload = state.getMessages().map(function (m) {
    return { role: m.role, content: m.text };
  });

  try {
    var res = await fetch(CHAT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: payload }),
    });
    var data = await res.json();
    state.addMessage('assistant', data.choices[0].message.content);
  } catch (e) {
    state.addMessage('assistant', 'Error: ' + e.message);
  }
  render.renderAll();
}

module.exports = { sendUserMessage: sendUserMessage };
