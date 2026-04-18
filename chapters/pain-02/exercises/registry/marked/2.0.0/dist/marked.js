// Fake marked@2.0.0 — breaking: renames parse() to render().
(function () {
  function render(md) {
    return String(md).replace(/\n/g, '<br>');
  }
  window.marked = { render: render, version: '2.0.0' };
})();
