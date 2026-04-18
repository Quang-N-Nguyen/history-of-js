// Fake marked@1.1.0 — adds inline italics. Same API as 1.0.0.
(function () {
  function parse(md) {
    return String(md)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }
  window.marked = { parse: parse, version: '1.1.0' };
})();
