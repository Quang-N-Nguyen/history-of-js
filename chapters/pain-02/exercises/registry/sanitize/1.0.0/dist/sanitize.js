// Fake sanitize@1.0.0 — strips <script> tags. Publishes window.Sanitize.
(function () {
  function clean(html) {
    return String(html).replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  }
  window.Sanitize = { clean: clean, version: '1.0.0' };
})();
