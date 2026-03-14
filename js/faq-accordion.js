/*
FAQ Accordion

öffnet/schließt FAQ-<details> mit Animation
- nur eine FAQ gleichzeitig offen
- weiche max-height Transition (~450 ms)
*/


//<![CDATA[
(function () {
  function closeDetails(d) {
    if (!d.open) return;

    // Höhe aktuell messen
    const content = d.querySelector('.faq-answer') || d.querySelector(':scope > *:not(summary)');
    if (!content) { d.open = false; return; }

    const start = content.scrollHeight;
    content.style.overflow = 'hidden';
    content.style.maxHeight = start + 'px';

    // nächster Frame -> auf 0 animieren
    requestAnimationFrame(() => {
      content.style.maxHeight = '0px';
    });

    // nach Animation wirklich schließen + cleanup
    const dur = 450;
    window.setTimeout(() => {
      d.open = false;
      content.style.maxHeight = '';
      content.style.overflow = '';
    }, dur);
  }

  function openDetails(d) {
    if (d.open) return;

    const content = d.querySelector('.faq-answer') || d.querySelector(':scope > *:not(summary)');
    if (!content) { d.open = true; return; }

    // zuerst öffnen, dann Höhe animieren
    d.open = true;
    content.style.overflow = 'hidden';
    content.style.maxHeight = '0px';

    requestAnimationFrame(() => {
      const end = content.scrollHeight;
      content.style.maxHeight = end + 'px';
    });

    const dur = 450;
    window.setTimeout(() => {
      content.style.maxHeight = '';
      content.style.overflow = '';
    }, dur);
  }

  document.addEventListener('click', function (e) {
    const summary = e.target.closest && e.target.closest('.gp-faq details > summary');
    if (!summary) return;

    e.preventDefault();
    const current = summary.parentElement; // details

    // alle anderen schließen
    document.querySelectorAll('.gp-faq details[open]').forEach(d => {
      if (d !== current) closeDetails(d);
    });

    // current togglen
    if (current.open) closeDetails(current);
    else openDetails(current);
  });
})();
//]]>
