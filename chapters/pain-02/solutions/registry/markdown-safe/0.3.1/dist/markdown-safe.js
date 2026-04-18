// Fake markdown-safe@0.3.1 — upgraded to marked@^2 (calls marked.render now).
(function () {
  function render(md) {
    return window.Sanitize.clean(window.marked.render(md));
  }
  window.MarkdownSafe = { render: render, version: '0.3.1' };
})();
