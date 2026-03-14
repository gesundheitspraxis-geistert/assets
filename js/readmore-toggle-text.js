/*
Read More Toggle

ändert den Buttontext bei ausgeblendeten Textabschnitten
"Mehr lesen" ↔ "Weniger anzeigen"
*/
//<![CDATA[

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
//]]>
