// Network: identical to pain-01's minimal version.
(function () {
  var CHAT_URL = 'http://127.0.0.1:3001/chat';

  async function sendUserMessage(text) {
    window.APP.state.addMessage('user', text);
    window.APP.render.renderAll();

    var payload = window.APP.state.getMessages().map(function (m) {
      return { role: m.role, content: m.text };
    });

    try {
      var res = await fetch(CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: payload }),
      });
      var data = await res.json();
      var reply = data.choices[0].message.content;
      window.APP.state.addMessage('assistant', reply);
    } catch (e) {
      window.APP.state.addMessage('assistant', 'Error: ' + e.message);
    }
    window.APP.render.renderAll();
  }

  window.APP.api = { sendUserMessage: sendUserMessage };

  document.getElementById('send').addEventListener('click', function () {
    var input = document.getElementById('input');
    var text = input.value.trim();
    if (!text) return;
    input.value = '';
    sendUserMessage(text);
  });
})();
