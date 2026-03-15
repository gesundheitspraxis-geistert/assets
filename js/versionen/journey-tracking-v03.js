/* =========================================================
   Journey Tracking – Einstiegsseite & letzte Seite speichern
   ---------------------------------------------------------
   Dieses kleine Script merkt sich pro Browser-Sitzung:

   journey_entry_page = erste Seite der Sitzung
   journey_last_page  = zuletzt besuchte Seite

   Diese Werte werden später vom Selbsttest verwendet,
   um die echte Einstiegsseite und die letzte Seite vor
   dem Test zu erfassen.

   WICHTIG:
   Script sollte global auf allen Seiten laufen.

   Wenn Änderungen gemacht werden:
   jsDelivr-Cache manuell löschen:
   https://www.jsdelivr.com/tools/purge
   ========================================================= */

(function () {
  try {
    var path = window.location.pathname || "";
    if (!path) return;

    var isTestPage =
      path.indexOf("/selbsttest/") === 0 ||
      path === "/testscript" ||
      path.indexOf("/testscript/") === 0;

    if (!sessionStorage.getItem("journey_entry_page")) {
      sessionStorage.setItem("journey_entry_page", path);
    }

    if (!isTestPage) {
      sessionStorage.setItem("journey_last_non_test_page", path);
    }

    console.log("JOURNEY GLOBAL", {
      path: path,
      isTestPage: isTestPage,
      entry: sessionStorage.getItem("journey_entry_page"),
      lastNonTest: sessionStorage.getItem("journey_last_non_test_page")
    });
  } catch (e) {
    console.error("Journey global Fehler:", e);
  }
})();
