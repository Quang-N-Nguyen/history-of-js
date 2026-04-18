// Fake marked@1.0.0 — IIFE that publishes window.marked with a tiny MD subset.
(function () {
  function parse(md) {
    return String(md)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }
  window.marked = { parse: parse, version: '1.0.0' };
})();
