// Fake markdown-safe@0.3.0 — wraps marked@^1 + sanitize@^1.
(function () {
  function render(md) {
    return window.Sanitize.clean(window.marked.parse(md));
  }
  window.MarkdownSafe = { render: render, version: '0.3.0' };
})();
