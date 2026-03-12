
(function(){
  function setTocOpen(wrap, open){
    if(!wrap) return;

    var btn  = wrap.querySelector('.gp-toc-acc__head');
    var body = wrap.querySelector('[data-gp-toc-body]');
    var lbl  = wrap.querySelector('[data-gp-toc-label]');
    if(!btn || !body) return;

    wrap.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    body.hidden = !open;
    if(lbl) lbl.textContent = open ? 'AUSBLENDEN' : 'ANZEIGEN';
  }

  function toggleToc(e){
    // Klick auf Kopfzeile?
    var head = e.target.closest && e.target.closest('.gp-toc-acc__head');
    if(head){
      e.preventDefault();
      var wrap = head.closest('[data-gp-toc]');
      if(!wrap) return;
      var isOpen = wrap.classList.contains('is-open');
      setTocOpen(wrap, !isOpen);
      return;
    }

    // Klick auf Link im TOC -> einklappen (optional, fühlt sich wie ZGD an)
    var link = e.target.closest && e.target.closest('[data-gp-toc] .gp-toc a');
    if(link){
      var w = link.closest('[data-gp-toc]');
      setTocOpen(w, false);
      return;
    }
  }

  document.addEventListener('click', toggleToc, false);

  // Initial: alle TOCs zu
  document.querySelectorAll('[data-gp-toc]').forEach(function(wrap){
    setTocOpen(wrap, false);
  });
})();

document.addEventListener("click", function (e) {
    const btn = e.target.closest(".gp-toc-acc__head");
    if (!btn) return;

    const expanded = btn.getAttribute("aria-expanded") === "true";
    const textEl = btn.querySelector(".gp-toc-acc__toggle-text");

    if (textEl) {
        textEl.textContent = expanded
            ? textEl.dataset.textOpen
            : textEl.dataset.textClosed;
    }
});

