(function () {
  var modules = { 0: function (module, exports, require) {
// Entry: wire up state, render, api (same roles as pain-01 — but via require()).
var state = require(1);
var render = require(2);
var api = require(3);

window.APP = { state: state, render: render, api: api };

document.getElementById('send').addEventListener('click', function () {
  var input = document.getElementById('input');
  var text = input.value.trim();
  if (!text) return;
  input.value = '';
  api.sendUserMessage(text);
});

}, 1: function (module, exports, require) {
// State: CJS version. No IIFE, no window.APP assignment here — just exports.
var messages = [];

function addMessage(role, text) {
  messages.push({ role: role, text: text });
}

module.exports = {
  addMessage: addMessage,
  getMessages: function () { return messages; }
};

}, 2: function (module, exports, require) {
// Render: reads state via require, paints the DOM.
var state = require(1);

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderAll() {
  var el = document.getElementById('messages');
  el.innerHTML = state.getMessages()
    .map(function (m) {
      return '<div>' + escapeHtml(m.role) + ': ' + escapeHtml(m.text) + '</div>';
    })
    .join('');
}

module.exports = { renderAll: renderAll };

}, 3: function (module, exports, require) {
// Network: same path as pain-01 but via require().
var state = require(1);
var render = require(2);

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

} };
  var cache = {};
  function require(id) {
    if (cache[id]) return cache[id].exports;
    var module = { exports: {} };
    cache[id] = module;
    modules[id](module, module.exports, require);
    return module.exports;
  }
  require(0);
})();
