(function () {
  function setTocOpen(wrap, open) {
    if (!wrap) return;
    var btn    = wrap.querySelector('.gp-toc-acc__head');
    var body   = wrap.querySelector('[data-gp-toc-body]');
    var textEl = btn ? btn.querySelector('.gp-toc-acc__toggle-text') : null;
    if (!btn || !body) return;
    wrap.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    body.hidden = !open;
    if (textEl) {
      textEl.textContent = open
        ? (textEl.dataset.textOpen   || 'zuklappen')
        : (textEl.dataset.textClosed || 'aufklappen');
    }
  }

  document.addEventListener('click', function (e) {
    var head = e.target.closest && e.target.closest('.gp-toc-acc__head');
    if (head) {
      e.preventDefault();
      var wrap = head.closest('[data-gp-toc]');
      if (!wrap) return;
      setTocOpen(wrap, !wrap.classList.contains('is-open'));
      return;
    }
    var link = e.target.closest && e.target.closest('[data-gp-toc] .gp-toc a');
    if (link) {
      setTocOpen(link.closest('[data-gp-toc]'), false);
    }
  }, false);

  document.querySelectorAll('[data-gp-toc]').forEach(function (wrap) {
    setTocOpen(wrap, false);
  });

})();
