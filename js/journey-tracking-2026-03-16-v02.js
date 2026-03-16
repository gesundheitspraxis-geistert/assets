/* =========================================================
   Journey Tracking – Einstiegsseite, letzte Seite & Attribution
   ---------------------------------------------------------
   Dieses Script merkt sich pro Browser-Sitzung:

   journey_entry_page = erste Seite der Sitzung

   Zusätzlich speichert es kanalbezogene Attribution
   im sessionStorage, damit sie später im Selbsttest
   innerhalb derselben Sitzung verfügbar ist:

   gp_attr_utm_source
   gp_attr_utm_medium
   gp_attr_utm_campaign
   gp_attr_utm_content
   gp_attr_source

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

        var utm_source   = url.searchParams.get("utm_source") || "";
        var utm_medium   = url.searchParams.get("utm_medium") || "";
        var utm_campaign = url.searchParams.get("utm_campaign") || "";
        var utm_content  = url.searchParams.get("utm_content") || "";
        var utm_term = url.searchParams.get("utm_term") || "";

        var hasStored = !!sessionStorage.getItem("gp_attr_utm_source");

        console.log("GP JOURNEY DEBUG", {
          path: window.location.pathname,
          href: window.location.href,
          referrer: document.referrer,
          hasStored: hasStored,
          storedSource: sessionStorage.getItem("gp_attr_utm_source"),
          storedMedium: sessionStorage.getItem("gp_attr_utm_medium"),
          storedChannel: sessionStorage.getItem("gp_attr_source")
        });

        /* 1) UTMs haben Vorrang */
        if (utm_source || utm_medium || utm_campaign || utm_content || utm_term) {
          sessionStorage.setItem("gp_attr_utm_source", utm_source);
          sessionStorage.setItem("gp_attr_utm_medium", utm_medium);
          sessionStorage.setItem("gp_attr_utm_campaign", utm_campaign);
          sessionStorage.setItem("gp_attr_utm_content", utm_content);
          sessionStorage.setItem("gp_attr_utm_term", utm_term);

          var utmSourceLc = String(utm_source).toLowerCase();
          var utmMediumLc = String(utm_medium).toLowerCase();
          var sourceLabel = "";

          if (utmSourceLc === "google" && utmMediumLc === "cpc") {
            sourceLabel = "Google Ads";
          } else if ((utmSourceLc === "facebook" || utmSourceLc === "instagram") && utmMediumLc === "cpc") {
            sourceLabel = "Meta Ads";
          } else if (utmMediumLc === "organic") {
            sourceLabel = "Organic Search";
          } else if (utmMediumLc === "email") {
            sourceLabel = "Email";
          } else if (utmMediumLc === "social") {
            sourceLabel = "Social";
          } else if (utm_source) {
            sourceLabel = utm_source;
          } else if (utm_medium) {
            sourceLabel = utm_medium;
          }

          if (sourceLabel) {
            sessionStorage.setItem("gp_attr_source", sourceLabel);
          }

          console.log("GP JOURNEY UTM STORED", {
            source: utm_source,
            medium: utm_medium,
            campaign: utm_campaign,
            content: utm_content,
            channel: sourceLabel
          });

          return;
        }

        /* 2) Nur wenn noch nichts gespeichert ist → Referrer prüfen */
        if (!hasStored) {
          var ref = document.referrer || "";

          if (!ref) {
            console.log("GP JOURNEY NO REFERRER", {
              path: window.location.pathname
            });
            return;
          }

          var host = "";
          try {
            host = new URL(ref).hostname.toLowerCase();
          } catch (e) {}

          console.log("GP JOURNEY REF HOST", {
            ref: ref,
            host: host
          });

          if (host.indexOf("google.") !== -1) {
            sessionStorage.setItem("gp_attr_utm_source", "google");
            sessionStorage.setItem("gp_attr_utm_medium", "organic");
            sessionStorage.setItem("gp_attr_source", "Organic Search");
            console.log("GP JOURNEY REF STORED", { source: "google", medium: "organic", channel: "Organic Search" });
            return;
          }

          if (host.indexOf("bing.") !== -1) {
            sessionStorage.setItem("gp_attr_utm_source", "bing");
            sessionStorage.setItem("gp_attr_utm_medium", "organic");
            sessionStorage.setItem("gp_attr_source", "Organic Search");
            console.log("GP JOURNEY REF STORED", { source: "bing", medium: "organic", channel: "Organic Search" });
            return;
          }

          if (host.indexOf("duckduckgo.") !== -1) {
            sessionStorage.setItem("gp_attr_utm_source", "duckduckgo");
            sessionStorage.setItem("gp_attr_utm_medium", "organic");
            sessionStorage.setItem("gp_attr_source", "Organic Search");
            console.log("GP JOURNEY REF STORED", { source: "duckduckgo", medium: "organic", channel: "Organic Search" });
            return;
          }

          if (host.indexOf("yahoo.") !== -1) {
            sessionStorage.setItem("gp_attr_utm_source", "yahoo");
            sessionStorage.setItem("gp_attr_utm_medium", "organic");
            sessionStorage.setItem("gp_attr_source", "Organic Search");
            console.log("GP JOURNEY REF STORED", { source: "yahoo", medium: "organic", channel: "Organic Search" });
            return;
          }

          if (host.indexOf("ecosia.") !== -1) {
            sessionStorage.setItem("gp_attr_utm_source", "ecosia");
            sessionStorage.setItem("gp_attr_utm_medium", "organic");
            sessionStorage.setItem("gp_attr_source", "Organic Search");
            console.log("GP JOURNEY REF STORED", { source: "ecosia", medium: "organic", channel: "Organic Search" });
            return;
          }

          if (host.indexOf("facebook.") !== -1 || host.indexOf("fb.com") !== -1) {
            sessionStorage.setItem("gp_attr_utm_source", "facebook");
            sessionStorage.setItem("gp_attr_utm_medium", "social");
            sessionStorage.setItem("gp_attr_source", "Social");
            console.log("GP JOURNEY REF STORED", { source: "facebook", medium: "social", channel: "Social" });
            return;
          }

          if (host.indexOf("instagram.") !== -1) {
            sessionStorage.setItem("gp_attr_utm_source", "instagram");
            sessionStorage.setItem("gp_attr_utm_medium", "social");
            sessionStorage.setItem("gp_attr_source", "Social");
            console.log("GP JOURNEY REF STORED", { source: "instagram", medium: "social", channel: "Social" });
            return;
          }

          if (host.indexOf("youtube.") !== -1) {
            sessionStorage.setItem("gp_attr_utm_source", "youtube");
            sessionStorage.setItem("gp_attr_utm_medium", "social");
            sessionStorage.setItem("gp_attr_source", "Social");
            console.log("GP JOURNEY REF STORED", { source: "youtube", medium: "social", channel: "Social" });
            return;
          }

          console.log("GP JOURNEY REF NOT MAPPED", {
            ref: ref,
            host: host
          });
        }

      } catch (e) {
        console.log("GP JOURNEY ERROR IN ATTRIBUTION", e);
      }
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

    console.log("GP JOURNEY PAGE STORED", {
      path: path,
      isTestPage: isTestPage,
      entry: sessionStorage.getItem("journey_entry_page"),
      lastNonTest: sessionStorage.getItem("journey_last_non_test_page"),
      channel: sessionStorage.getItem("gp_attr_source")
    });

  } catch (e) {
    console.log("GP JOURNEY FATAL ERROR", e);
  }
})();
