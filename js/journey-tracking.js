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

    /* Erste Seite der Sitzung merken */
    if (!sessionStorage.getItem("journey_entry_page")) {
      sessionStorage.setItem("journey_entry_page", path);
    }

    /* Immer letzte Seite aktualisieren */
    sessionStorage.setItem("journey_last_page", path);

  } catch (e) {}
})();
