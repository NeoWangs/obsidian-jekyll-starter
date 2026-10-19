(function () {
  // Kramdown/Rouge can put the language class on the code or its wrapper.
  var blocks = document.querySelectorAll('pre > code.language-mermaid, .language-mermaid pre > code');
  if (!blocks.length) return;

  function renderDiagrams() {
    blocks.forEach(function (code) {
      var source = code.textContent;
      var block = code.closest('.highlighter-rouge') || code.parentElement;
      var container = document.createElement('div');
      container.className = 'oj-mermaid';
      block.parentNode.insertBefore(container, block);

      var diagram;
      try {
        diagram = window.pele.mount(container, source, {
          zoom: false,
          onRender: function () {
            block.hidden = true;
          },
          onError: function (error) {
            block.hidden = false;
            console.warn('Could not render Mermaid diagram:', error);
          }
        });
        if (diagram.error) {
          diagram.destroy();
          container.remove();
          return;
        }
      } catch (error) {
        if (diagram) diagram.destroy();
        container.remove();
        block.hidden = false;
        console.warn('Could not render Mermaid diagram:', error);
      }
    });
  }

  var script = document.createElement('script');
  // Pin the browser bundle so upstream releases cannot silently change posts.
  script.src = 'https://cdn.jsdelivr.net/npm/pele@1.6.0/dist/pele.global.js';
  script.onload = renderDiagrams;
  script.onerror = function () {
    console.warn('Could not load Pele; Mermaid source blocks remain visible.');
  };
  document.head.appendChild(script);
})();
