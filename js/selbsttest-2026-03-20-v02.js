
/* <![CDATA[ */

/*
 * WICHTIG – jsDelivr-Cache nach jeder Änderung manuell löschen!
 * Geh auf: https://www.jsdelivr.com/tools/purge und trag die URL ein: https://cdn.jsdelivr.net/gh/gesundheitspraxis-geistert/assets@main/js/selbsttest-vXX.js (Versionsnummer beachten)
 * Sonst zeigt die Live-Seite bis zu 24h den alten Stand.
 */
(function () {
  const allowedHosts = [
    "gesundheitspraxis-geistert.de",
    "www.gesundheitspraxis-geistert.de"
  ];

  if (!allowedHosts.includes(window.location.hostname)) {
    return;
  }

  function gpIsTestPage(path) {
    if (!path) return false;

    return (
      path.indexOf("/selbsttest/") === 0 ||
      path === "/testscript" ||
      path.indexOf("/testscript/") === 0
    );
  }

  const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
  if (!gpIsTestPage(currentPath)) {
    return;
  }

  const GP_FORM_VER = "2026-03-20-2";
console.log("SELBSTTEST AKTIV", GP_FORM_VER);

var gpTestCompleted = false;
var gpAbandonSent = false;
var gpTestStartedAt = Date.now();

const TRACKING_URL = "https://script.google.com/macros/s/AKfycbxUdClD2csFRGCuPWi9WqX_5kLm5G2K-2nyZpTrZirnHtGtEHuNPWCVnunwtWRi9S6k7Q/exec";

const GP_FORM_GRUEN = "https://401e9539.sibforms.com/serve/MUIFAB7xEJimOTWDIuRru-zsKDUuFXdIorgj7u8slBnxZl654eKfRdvXPl0lZMPi2cXZWbKy4PkmCJ0pXReKo3A1RFAAP1wdVqjCZZnWCwHyz9EJ7X13EVywq06tSJv3yxcKtthv81PdPFNHR7kn04qD3o2PU8gnvzp3EjkYqt7v6iczUWcFrUoIlSZgDT9VtF0sqWSSa_YOgsRsSg==";

const GP_FORM_GELB = "https://401e9539.sibforms.com/serve/MUIFABhoIJM37VBTosoxmFVElHBfSLSiE_53ub9w84L-VQsQfMffdqDozvVZPbnnDKprgEOIqSMaXg3OEHwCVcOxz8mcq9wtStO1vgFdpc-9BHrS7fOWFQgWugMYRdv2904s_hbnM-XGza1bZBAJZrDVRte1Wf2gRDdogRcD1L5_EFssxqzbdohDog8UldlJVyCPUAqiWBs7wnJVnQ==";

const GP_FORM_ROT = "https://401e9539.sibforms.com/serve/MUIFAIXB78-mVd4nt0f0Brwpkd1Gcq-1p8FvVfmVtMWx9iK1uIDEaR_ah0xHQCFTKy08utalxpCnzTLuNcDNSkQlh2HZw_UZMBkrlq5PWODV2XXp1z3pxjwr843Cqhn8WaDq--rVKAItUcesWfmP7czOSMcnmnIh5xkJBRbUOLQtzXH7fQpKe_O7Qg3S8_72R9V5YyBSRxspWxfeSw==";

function gpFormUrl(status){

  let base =
    status === "gruen" ? GP_FORM_GRUEN :
    status === "gelb"  ? GP_FORM_GELB :
    status === "rot"   ? GP_FORM_ROT  :
    GP_FORM_GRUEN;

  return base + (base.includes("?") ? "&" : "?") + "v=" + encodeURIComponent(GP_FORM_VER);
}

function gpGetSource(utm){
  try {
    var storedSource = sessionStorage.getItem("gp_attr_source") || "";
    if (storedSource) return storedSource;

    var utmSource = (utm && utm.utm_source ? String(utm.utm_source).toLowerCase() : "");
    var utmMedium = (utm && utm.utm_medium ? String(utm.utm_medium).toLowerCase() : "");

    // 1) UTM / gespeicherte Attribution haben Vorrang
    if (utmSource || utmMedium) {
      if (utmSource === "google" && utmMedium === "cpc") return "Google Ads";
      if ((utmSource === "facebook" || utmSource === "instagram") && utmMedium === "cpc") return "Meta Ads";
      if (utmMedium === "organic") return "Organic Search";
      if (utmMedium === "email") return "Email";
      if (utmMedium === "social") return "Social";
      if (utmSource) return utmSource;
      if (utmMedium) return utmMedium;
    }

    // 2) Fallback: aktueller Referrer
    var ref = document.referrer || "";
    if (!ref) return "Direct";

    var host = new URL(ref).hostname.toLowerCase();

    if (host.includes("google.") || host.includes("bing.") || host.includes("duckduckgo.") || host.includes("yahoo.") || host.includes("ecosia.")) {
      return "Organic Search";
    }

    if (host.includes("facebook.") || host.includes("fb.com") || host.includes("instagram.") || host.includes("youtube.")) {
      return "Social";
    }

    if (host.includes("gesundheitspraxis-geistert.de")) {
      return "Internal";
    }

    return host;
  } catch(e) {
    return "Direct";
  }
}

/* ================================
   UTM auslesen
================================ */

function gpGetUTM(){
  try{
    const url = new URL(window.location.href);

    return {
      utm_source: url.searchParams.get("utm_source") || sessionStorage.getItem("gp_attr_utm_source") || "",
      utm_medium: url.searchParams.get("utm_medium") || sessionStorage.getItem("gp_attr_utm_medium") || "",
      utm_campaign: url.searchParams.get("utm_campaign") || sessionStorage.getItem("gp_attr_utm_campaign") || "",
      utm_content: url.searchParams.get("utm_content") || sessionStorage.getItem("gp_attr_utm_content") || "",
      utm_term: url.searchParams.get("utm_term") || sessionStorage.getItem("gp_attr_utm_term") || ""
    };
  } catch(e){
   return {
      utm_source: sessionStorage.getItem("gp_attr_utm_source") || "",
      utm_medium: sessionStorage.getItem("gp_attr_utm_medium") || "",
      utm_campaign: sessionStorage.getItem("gp_attr_utm_campaign") || "",
      utm_content: sessionStorage.getItem("gp_attr_utm_content") || "",
      utm_term: sessionStorage.getItem("gp_attr_utm_term") || ""
    };
  }
}

function gpGetVisitorId() {
  try {
    let visitorId = sessionStorage.getItem("gp_visitor_id");
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      sessionStorage.setItem("gp_visitor_id", visitorId);
    }
    return visitorId;
  } catch (e) {
    return "";
  }
}

  function gpGetOrCreateTestId() {
  try {
    const path = window.location.pathname.replace(/\/+$/, "") || "/";
    const key = "gp_test_id:" + path;
    let testId = sessionStorage.getItem(key);

    if (!testId) {
      testId = crypto.randomUUID();
      sessionStorage.setItem(key, testId);
    }

    return testId;
  } catch (e) {
    return "";
  }
}

function gpGetOrCreateSessionId() {
  try {
    const key = "gp_session_id";
    let sessionId = sessionStorage.getItem(key);

    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem(key, sessionId);
    }

    return sessionId;
  } catch (e) {
    return "";
  }
}

function gpGetDeviceType() {
  try {
    var ua = navigator.userAgent || "";

    if (/ipad|tablet/i.test(ua)) return "tablet";
    if (/mobi|android|iphone|ipod/i.test(ua)) return "mobile";
    return "desktop";
  } catch (e) {
    return "";
  }
}
  
function gpSendTestEvent(result, score){
  console.log("SEND TEST EVENT", result, score);

  try {
    const utm = gpGetUTM();

    var normalizedPath = window.location.pathname.replace(/\/+$/, "") || "/";
    var startedKey = "test_started_at:" + normalizedPath;
    var startedAtRaw = sessionStorage.getItem(startedKey) || "";
    var startedAt = startedAtRaw ? parseInt(startedAtRaw, 10) : gpTestStartedAt;
    var endedAt = Date.now();

    var duration = "";
    var timestampStart = "";
    var timestampEnd = new Date(endedAt).toLocaleString("sv-SE");

    if (startedAt) {
      duration = Math.max(1, Math.round((endedAt - startedAt) / 1000));
      timestampStart = new Date(startedAt).toLocaleString("sv-SE");
    }
    var formEl = document.getElementById("gpLongevityForm");
    var answeredCount = formEl ? formEl.querySelectorAll('input[type="radio"]:checked').length : "";

    const payload = {
      test_id: gpGetOrCreateTestId(),
      visitor_id: gpGetVisitorId(),
      session_id: gpGetOrCreateSessionId(),
      device: gpGetDeviceType(),
      event_type: "test_completed",
      timestamp_start: timestampStart,
      timestamp_end: timestampEnd,
      test_duration_seconds: duration,
      test_page: normalizedPath,
      entry_page: sessionStorage.getItem("journey_entry_page") || "",
      last_page_before_conversion: sessionStorage.getItem("journey_last_non_test_page") || "",
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
      utm_content: utm.utm_content,
      utm_term: utm.utm_term,
      source: gpGetSource(utm),
      question_count_answered: answeredCount,
      result: result,
      score: score
    };

    console.log("TRACKING URL", TRACKING_URL);
    console.log("Payload wird gesendet", payload);

    fetch(TRACKING_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    })
.then(function(res){
  return res.text().then(function(text){
    console.log("Tracking Antwort Status:", res.status);
    console.log("Tracking Antwort Body:", text);

  });
})
    .catch(function(err){
      console.error("Tracking Fehler:", err);
    });

  } catch(e) {
    console.error("gpSendTestEvent Fehler:", e);
  }
}

function ready(fn){
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function(){
    var root = document.getElementById("gpLongevityRoot");
    if(!root) return;

var currentTestPage = window.location.pathname.replace(/\/+$/, "") || "/";
var startedKey = "test_started_at:" + currentTestPage;

gpTestStartedAt = Date.now();
sessionStorage.setItem(startedKey, gpTestStartedAt.toString());

      sessionStorage.setItem("gp_last_test_page", currentTestPage);
  gpGetOrCreateTestId();
  gpGetOrCreateSessionId();
  gpGetVisitorId();

    var form = document.getElementById("gpLongevityForm");
    var msg  = document.getElementById("gpMsg");
    var res  = document.getElementById("gpResult");
    var resTitle = document.getElementById("gpResultTitle");
    var resBody  = document.getElementById("gpResultBody");
    var dot  = document.getElementById("gpDot");
    var resetBtn = document.getElementById("gpResetBtn");

    if(!form || !msg || !res || !resTitle || !resBody || !dot || !resetBtn){
      return;
    }

function gpFollowupBlock(status) {
  return `
    <div class="gp-followup">

      <div class="gp-formclip">
        <iframe
          class="gp-brevo"
          src="${gpFormUrl(status)}"
          title="Ausführliche Auswertung per E-Mail erhalten"
          frameborder="0"
          scrolling="no"><\/iframe>
      <\/div>

    <\/div>
  `;
}


    /* Auswahl-Optik */
    var labels = root.querySelectorAll(".gp-optwrap");
    labels.forEach(function(label){
      var input = label.querySelector('input[type="radio"]');
      if(!input) return;

      input.addEventListener("change", function(){
        var fieldset = label.closest("fieldset");
        if(fieldset){
          fieldset.querySelectorAll(".gp-optwrap").forEach(function(l){
            l.classList.remove("gp-selected");
          });
        }
        label.classList.add("gp-selected");

        if(fieldset){
          fieldset.classList.remove("gp-error");
          var hint = fieldset.querySelector(".gp-errorhint");
          if(hint) hint.remove();
        }
        msg.textContent = "";
      });
    });

    function showError(fieldset, text){
      fieldset.classList.add("gp-error");
      if(!fieldset.querySelector(".gp-errorhint")){
        var div = document.createElement("div");
        div.className = "gp-errorhint";
        div.textContent = text || "Bitte wählen Sie eine Antwort.";
        fieldset.appendChild(div);
      }
    }

 /* Ergebnisbalken */
function runLoader(callback){
  var loader = document.getElementById("gp-test-loader");
  var bar = document.querySelector(".gp-loader-progress");

  if (!loader || !bar) {
    callback();
    return;
  }

  loader.style.display = "block";
  bar.style.width = "0%";

  var y = loader.getBoundingClientRect().top + window.pageYOffset - 90;
  window.scrollTo({ top: y, behavior: "smooth" });

  var p = 0;

  var timer = setInterval(function(){
    p += Math.random() * 8;

    if(p >= 95){
      clearInterval(timer);
      bar.style.width = "100%";

      setTimeout(function(){
        loader.style.display = "none";
        bar.style.width = "0%";
        callback();
      }, 400);

    } else {
      bar.style.width = p + "%";
    }

  }, 80);
}

    /* Submit/Auswertung */
    form.addEventListener("submit", function(e){
      e.preventDefault();

      msg.textContent = "";
      res.style.display = "none";
      resBody.innerHTML = "";

      // Validierung: alle Fragen beantwortet?
      var fieldsets = form.querySelectorAll("fieldset.gp-q");
      var firstError = null;

      fieldsets.forEach(function(fs){
        fs.classList.remove("gp-error");
        var hint = fs.querySelector(".gp-errorhint");
        if(hint) hint.remove();

        var anyChecked = fs.querySelector('input[type="radio"]:checked');
        if(!anyChecked){
          if(!firstError) firstError = fs;
          showError(fs, "Bitte wählen Sie eine Antwort.");
        }
      });

      if(firstError){
        msg.textContent = "Bitte beantworten Sie alle Fragen, dann erhalten Sie Ihr Ergebnis.";
        firstError.scrollIntoView({behavior:"smooth", block:"start"});
        return;
      }

      // Score berechnen (mit Gewichtung data-w) – WICHTIG: parseFloat!
      var total = 0;
      var maxTotal = 0;

      // optional (falls du es später wieder nutzen willst)
      var topicScores = {};

      fieldsets.forEach(function(fs, idx){
        var w = parseFloat(fs.getAttribute("data-w") || "1"); // <- FIX
        var topic = fs.getAttribute("data-topic") || ("Frage " + (idx+1));
        var checked = fs.querySelector('input[type="radio"]:checked');
        var val = checked ? parseInt(checked.value, 10) : 0;

        total += (val * w);
        maxTotal += (2 * w); // Werte 0/1/2

        topicScores[topic] = (topicScores[topic] || 0) + (val * w);
      });

      var pct = maxTotal ? Math.round((total / maxTotal) * 100) : 0;


/* === Ampel-Auswertung Logik – Conversion-optimiert === */
var status, color, title, body;

if (pct <= 25) {
  status = "gruen";
  color  = "#6f9f85";
  title  = "GRÜN – Stabil";
  body = `
<p><strong>Ihr Ergebnis zeigt eine stabile, gut regulierte Basis</strong> – Einordnung aus langjähriger Erfahrung in der Gesundheitspraxis.<\/p>

<p>Wie Sie diese Basis gezielt erhalten, zeigen wir Ihnen in Ihrer Auswertung per E&#8209;Mail.<\/p>

<ul class="gp-result-checklist">
  <li>Was Ihre Vitalität langfristig nährt<\/li>
  <li>Wie Sie Ihr biologisches Alter positiv beeinflussen<\/li>
  <li>Impulse für stabile Gesundheit</li>
<\/ul>

<div class="gp-email-hint">
  Wohin dürfen wir Ihre persönliche Auswertung senden?
</div>

${gpFollowupBlock("gruen")}
`;
}

else if (pct <= 55) {
  status = "gelb";
  color  = "#c8a64a";
  title  = "GELB – Aufbauen";
  body = `
<p><strong>Ihr Ergebnis zeigt erste Anzeichen von Ungleichgewicht</strong> – Einordnung aus langjähriger Erfahrung in der Gesundheitspraxis.<\/p>

<p>Was das konkret für Sie bedeutet, zeigen wir Ihnen in Ihrer Auswertung per E&#8209;Mail.<\/p>

<ul class="gp-result-checklist">
  <li>Wo Ihre größten Kraft&shy;räuber liegen<\/li>
  <li>Was jetzt am wichtigsten ist<\/li>
  <li>Nächste konkrete Schritte</li>
<\/ul>

<div class="gp-email-hint">
  Wohin dürfen wir Ihre persönliche Auswertung senden?
</div>

${gpFollowupBlock("gelb")}
`;
}

else {
  status = "rot";
  color  = "#b55353";
  title  = "ROT – Entlasten";
  body = `
<p><strong>Ihr Ergebnis zeigt aktuell eine spürbare Belastung</strong> – Einordnung aus langjähriger Erfahrung in der Gesundheitspraxis.<\/p>

<p>Was jetzt wirklich entlastet, zeigen wir Ihnen in Ihrer Auswertung per E&#8209;Mail.<\/p>

<ul class="gp-result-checklist">
  <li>Wie Sie Ihre Kraft&shy;räuber erkennen<\/li>
  <li>Was wieder Stabilität bringt<\/li>
  <li>Erste Schritte zur Entlastung</li><\/ul>

<div class="gp-email-hint">
  Wohin dürfen wir Ihre persönliche Auswertung senden?
</div>

${gpFollowupBlock("rot")}
`;
}

runLoader(function(){

  dot.style.background = color;
  dot.style.boxShadow = "0 0 0 6px rgba(0,0,0,.06)";
  resTitle.textContent = title;
  res.setAttribute("data-status", status);
  resBody.innerHTML = body;
  res.style.display = "block";

gpTestCompleted = true;
gpSendTestEvent(status, pct);

  /* === TRACKING: Longevity-Selbsttest Ergebnis angezeigt (GA4 Event) === */
  if (typeof gtag === "function") {
    gtag("event", "longevity_test_result", {
      event_category: "longevity",
      event_label: status
    });
  }
  /* === /TRACKING === */

  // res.scrollIntoView({behavior:"smooth", block:"start"});

});
});   

    // Reset
    resetBtn.addEventListener("click", function(){
      form.reset();
      msg.textContent = "";
      res.style.display = "none";
      resBody.innerHTML = "";
      dot.style.background = "#999";

      root.querySelectorAll(".gp-selected").forEach(function(x){
        x.classList.remove("gp-selected");
      });
      root.querySelectorAll("fieldset.gp-q.gp-error").forEach(function(fs){
        fs.classList.remove("gp-error");
        var hint = fs.querySelector(".gp-errorhint");
        if(hint) hint.remove();
      });

root.scrollIntoView({behavior:"smooth", block:"start"});
});

});

/* ================================
   TEST ABBRECHER TRACKING
================================ */

function gpSendAbandonEvent(trigger) {
  try {
    if (gpTestCompleted) return;
    if (gpAbandonSent) return;

    var form = document.getElementById("gpLongevityForm");
    if (!form) return;

    var answered = form.querySelectorAll('input[type="radio"]:checked').length;
    
    gpAbandonSent = true;

    var normalizedPath = window.location.pathname.replace(/\/+$/, "") || "/";
    var startedKey = "test_started_at:" + normalizedPath;
    var startedAtRaw = sessionStorage.getItem(startedKey) || "";
    var startedAt = startedAtRaw ? parseInt(startedAtRaw, 10) : gpTestStartedAt;
    var endedAt = Date.now();

    var duration = "";
    var timestampStart = "";
    var timestampEnd = new Date(endedAt).toLocaleString("sv-SE");

    if (startedAt) {
      duration = Math.max(1, Math.round((endedAt - startedAt) / 1000));
      timestampStart = new Date(startedAt).toLocaleString("sv-SE");
    }

    var utm = gpGetUTM();

    var eventType = answered > 0 ? "test_abandoned" : "test_open_no_start";

    var payload = {
      test_id: gpGetOrCreateTestId(),
      visitor_id: gpGetVisitorId(),
      session_id: gpGetOrCreateSessionId(),
      device: gpGetDeviceType(),
      event_type: eventType,
      question_last_seen: answered,
      question_count_abandoned: answered,
      question_count_answered: answered,
      trigger: trigger || "",
      timestamp_start: timestampStart,
      timestamp_end: timestampEnd,
      test_duration_seconds: duration,
      test_page: normalizedPath,
      entry_page: sessionStorage.getItem("journey_entry_page") || "",
      last_page_before_conversion: sessionStorage.getItem("journey_last_non_test_page") || "",
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
      utm_content: utm.utm_content,
      utm_term: utm.utm_term,
      source: gpGetSource(utm)
    };

    console.log("TEST ABBRUCH WIRD GESENDET", payload);

    try {
      var blob = new Blob(
        [JSON.stringify(payload)],
        { type: "text/plain;charset=utf-8" }
      );
      navigator.sendBeacon(TRACKING_URL, blob);
    } catch (e) {}


  } catch (e) {
    console.error("gpSendAbandonEvent Fehler:", e);
  }
}

window.addEventListener("pagehide", function () {
 var normalizedPath = window.location.pathname.replace(/\/+$/, "") || "/";
if (gpIsTestPage(normalizedPath)) {
    gpSendAbandonEvent("pagehide");
  }
});

})();

/* ]]> */
