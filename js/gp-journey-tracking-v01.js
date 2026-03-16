/* =========================================================
   Journey Tracking – Einstiegsseite, letzte Seite & Attribution
   ---------------------------------------------------------
   Dieses Script merkt sich pro Browser-Sitzung:

   journey_entry_page = erste Seite der Sitzung
   journey_last_page  = zuletzt besuchte Nicht-Test-Seite

   Zusätzlich speichert es kanalbezogene Attribution
   im localStorage, damit sie später im Selbsttest
   auch nach mehreren Seitenaufrufen noch verfügbar ist:

   gp_attr_utm_source
   gp_attr_utm_medium
   gp_attr_utm_campaign
   gp_attr_utm_content

   WICHTIG:
   Script sollte global auf allen Seiten laufen.

   Wenn Änderungen gemacht werden:
   jsDelivr-Cache manuell löschen:
   https://www.jsdelivr.com/tools/purge
   ========================================================= */

(function () {
  try {

    /* =========================================================
       Attribution speichern (UTM / Referrer)
       ========================================================= */
    function gpStoreAttributionIfMissing() {
      try {
        var url = new URL(window.location.href);

        var utm_source = url.searchParams.get("utm_source") || "";
        var utm_medium = url.searchParams.get("utm_medium") || "";
        var utm_campaign = url.searchParams.get("utm_campaign") || "";
        var utm_content = url.searchParams.get("utm_content") || "";

        var hasStored = !!localStorage.getItem("gp_attr_utm_source");

        /* 1) UTMs haben Vorrang */
        if (utm_source || utm_medium || utm_campaign || utm_content) {
          localStorage.setItem("gp_attr_utm_source", utm_source);
          localStorage.setItem("gp_attr_utm_medium", utm_medium);
          localStorage.setItem("gp_attr_utm_campaign", utm_campaign);
          localStorage.setItem("gp_attr_utm_content", utm_content);
          return;
        }

    /* 2) Nur wenn noch nichts gespeichert ist → Referrer prüfen */
if (!hasStored) {
  var ref = document.referrer || "";
  if (!ref) return;

  var host = "";
  try {
    host = new URL(ref).hostname.toLowerCase();
  } catch (e) {}

  if (host.indexOf("google.") !== -1) {
    localStorage.setItem("gp_attr_utm_source", "Google Search");
    localStorage.setItem("gp_attr_utm_medium", "organic");
    return;
  }

  if (host.indexOf("bing.") !== -1) {
    localStorage.setItem("gp_attr_utm_source", "Bing Search");
    localStorage.setItem("gp_attr_utm_medium", "organic");
    return;
  }

  if (host.indexOf("duckduckgo.") !== -1) {
    localStorage.setItem("gp_attr_utm_source", "DuckDuckGo");
    localStorage.setItem("gp_attr_utm_medium", "organic");
    return;
  }

  if (host.indexOf("yahoo.") !== -1) {
    localStorage.setItem("gp_attr_utm_source", "Yahoo Search");
    localStorage.setItem("gp_attr_utm_medium", "organic");
    return;
  }

  if (host.indexOf("ecosia.") !== -1) {
    localStorage.setItem("gp_attr_utm_source", "Ecosia");
    localStorage.setItem("gp_attr_utm_medium", "organic");
    return;
  }

  if (host.indexOf("facebook.") !== -1 || host.indexOf("fb.com") !== -1) {
    localStorage.setItem("gp_attr_utm_source", "Facebook");
    localStorage.setItem("gp_attr_utm_medium", "social");
    return;
  }

  if (host.indexOf("instagram.") !== -1) {
    localStorage.setItem("gp_attr_utm_source", "Instagram");
    localStorage.setItem("gp_attr_utm_medium", "social");
    return;
  }

  if (host.indexOf("youtube.") !== -1) {
    localStorage.setItem("gp_attr_utm_source", "YouTube");
    localStorage.setItem("gp_attr_utm_medium", "social");
    return;
  }
}

      } catch (e) {}
    }

    /* Attribution beim Seitenaufruf prüfen */
    gpStoreAttributionIfMissing();

    /* =========================================================
       Journey-Tracking
       ========================================================= */
    var path = window.location.pathname || "";
    if (!path) return;

    var isTestPage =
      path.indexOf("/selbsttest/") === 0 ||
      path === "/testscript" ||
      path.indexOf("/testscript/") === 0;

    if (!sessionStorage.getItem("journey_entry_page")) {
      sessionStorage.setItem("journey_entry_page", path);
    }

    /* last page nur auf Nicht-Testseiten aktualisieren */
    if (!isTestPage) {
      sessionStorage.setItem("journey_last_page", path);
      sessionStorage.setItem("journey_last_non_test_page", path);
    }

  } catch (e) {}
})();
