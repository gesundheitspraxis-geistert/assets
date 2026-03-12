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

    if(lbl){
      lbl.textContent = open
        ? lbl.dataset.textOpen
        : lbl.dataset.textClosed;
    }
  }

  function toggleToc(e){
    var head = e.target.closest && e.target.closest('.gp-toc-acc__head');
    if(head){
      e.preventDefault();
      var wrap = head.closest('[data-gp-toc]');
      if(!wrap) return;
      var isOpen = wrap.classList.contains('is-open');
      setTocOpen(wrap, !isOpen);
      return;
    }

    var link = e.target.closest && e.target.closest('[data-gp-toc] .gp-toc a');
    if(link){
      var w = link.closest('[data-gp-toc]');
      setTocOpen(w, false);
    }
  }

  document.addEventListener('click', toggleToc, false);

  document.querySelectorAll('[data-gp-toc]').forEach(function(wrap){
    setTocOpen(wrap, false);
  });
})();
