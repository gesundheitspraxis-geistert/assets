/* 
HTML-Fragment Loader
----------------------------------------
Lädt externe HTML-Dateien in Elemente mit dem Attribut
data-include="pfad/zur/datei.html".

Zweck:
Der Selbsttest-HTML-Block liegt zentral in
/assets/html/selbsttest.html und wird so auf mehreren
Testseiten eingebunden, damit Änderungen nur einmal
gepflegt werden müssen.

Verwendung:
<div data-include="/assets/html/selbsttest.html"></div>

Wichtig:
Dieses Script hat nichts mit dem eigentlichen
Selbsttest-JavaScript zu tun und verändert dessen
Logik nicht.
*/

// Quelle des Testblocks:
// /assets/html/selbsttest.html

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("[data-include]").forEach(function (el) {
    var file = el.getAttribute("data-include");
    if (!file) return;

    fetch(file)
      .then(function (response) {
        if (!response.ok) throw new Error("HTTP " + response.status);
        return response.text();
      })
      .then(function (html) {
        el.innerHTML = html;
      })
      .catch(function (err) {
        console.error("Include error:", err);
      });
  });
});
