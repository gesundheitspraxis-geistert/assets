/* <![CDATA[ */

(function () {
  const allowedHosts = [
    "gesundheitspraxis-geistert.de",
    "www.gesundheitspraxis-geistert.de"
  ];

  if (!allowedHosts.includes(window.location.hostname)) {
    return;
  }

  // ab hier restlicher Code

const GP_FORM_VER = "2026-03-14-11";
console.log("SELBSTTEST AKTIV 2026-03-14-11");

const TRACKING_URL = "https://script.google.com/macros/s/AKfycbylVzP56vvTMeSXFY6Nt7WspkgL6UMyMmpHaRVcoEZuLby_vPKGuIusMJwnq2sakjrnsw/exec";

function gpGetPreviousPath() {
  try {
    if (!document.referrer) return "";

    const refUrl = new URL(document.referrer);
    const ownHost = window.location.hostname.replace(/^www\./, "");
    const refHost = refUrl.hostname.replace(/^www\./, "");

    if (refHost !== ownHost) return "";
    return refUrl.pathname || "";
  } catch (e) {
    return "";
  }
}

  function gpIsTestPage(path) {
  return path && path.indexOf("/selbsttest/") === 0;
}

(function gpRememberEntryPage() {
  try {
    const prevPath = gpGetPreviousPath();

    // Nur echte Vorseiten merken, nicht die Testseite selbst
    if (prevPath && !gpIsTestPage(prevPath)) {
      sessionStorage.setItem("entry_page", prevPath);
    }
  } catch (e) {}
})();

const GP_FORM_GRUEN = "https://401e9539.sibforms.com/serve/MUIFAB7xEJimOTWDIuRru-zsKDUuFXdIorgj7u8slBnxZl654eKfRdvXPl0lZMPi2cXZWbKy4PkmCJ0pXReKo3A1RFAAP1wdVqjCZZnWCwHyz9EJ7X13EVywq06tSJv3yxcKtthv81PdPFNHR7kn04qD3o2PU8gnvzp3EjkYqt7v6iczUWcFrUoIlSZgDT9VtF0sqWSSa_YOgsRsSg==" + GP_FORM_VER;

const GP_FORM_GELB = "https://401e9539.sibforms.com/serve/MUIFABhoIJM37VBTosoxmFVElHBfSLSiE_53ub9w84L-VQsQfMffdqDozvVZPbnnDKprgEOIqSMaXg3OEHwCVcOxz8mcq9wtStO1vgFdpc-9BHrS7fOWFQgWugMYRdv2904s_hbnM-XGza1bZBAJZrDVRte1Wf2gRDdogRcD1L5_EFssxqzbdohDog8UldlJVyCPUAqiWBs7wnJVnQ==" + GP_FORM_VER;

const GP_FORM_ROT = "https://401e9539.sibforms.com/serve/MUIFAIXB78-mVd4nt0f0Brwpkd1Gcq-1p8FvVfmVtMWx9iK1uIDEaR_ah0xHQCFTKy08utalxpCnzTLuNcDNSkQlh2HZw_UZMBkrlq5PWODV2XXp1z3pxjwr843Cqhn8WaDq--rVKAItUcesWfmP7czOSMcnmnIh5xkJBRbUOLQtzXH7fQpKe_O7Qg3S8_72R9V5YyBSRxspWxfeSw==" + GP_FORM_VER;

function gpFormUrl(status){

  let base =
    status === "gruen" ? GP_FORM_GRUEN :
    status === "gelb"  ? GP_FORM_GELB :
    status === "rot"   ? GP_FORM_ROT  :
    GP_FORM_GRUEN;

  const sep = base.includes("?") ? "&" : "?";

  return base + sep + "v=" + encodeURIComponent(GP_FORM_VER);
}

function gpGetSource(){
  try {
    const ref = document.referrer || "";
    if (!ref) return "direct";

    const host = new URL(ref).hostname.toLowerCase();

    if (host.includes("google.")) return "google";
    if (host.includes("bing.")) return "bing";
    if (host.includes("facebook.")) return "facebook";
    if (host.includes("instagram.")) return "instagram";
    if (host.includes("youtube.")) return "youtube";

    return host;
  } catch(e) {
    return "direct";
  }
}


/* ================================
   UTM auslesen
================================ */

function gpGetUTM(){
  try{
    const url = new URL(window.location.href);
    return {
      utm_source: url.searchParams.get("utm_source") || "",
      utm_medium: url.searchParams.get("utm_medium") || "",
      utm_campaign: url.searchParams.get("utm_campaign") || ""
    };
  } catch(e){
    return {utm_source:"", utm_medium:"", utm_campaign:""};
  }
}

  function gpGetVisitorId() {
  try {
    let visitorId = localStorage.getItem("gp_visitor_id");
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem("gp_visitor_id", visitorId);
    }
    return visitorId;
  } catch (e) {
    return "";
  }
}

  function gpGetOrCreateTestId() {
  try {
    const key = "gp_test_id:" + window.location.pathname;
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
  
function gpSendTestEvent(result, score){
  console.log("SEND TEST EVENT", result, score);

  try {
    const utm = gpGetUTM();

    var startedKey = "test_started_at:" + window.location.pathname;
    var startedAtRaw = sessionStorage.getItem(startedKey) || "";
    var startedAt = startedAtRaw ? parseInt(startedAtRaw, 10) : 0;
    var endedAt = Date.now();

    var duration = "";
    var timestampStart = "";
    var timestampEnd = new Date(endedAt).toLocaleString("sv-SE");

    if (startedAt) {
      duration = Math.max(1, Math.round((endedAt - startedAt) / 1000));
      timestampStart = new Date(startedAt).toLocaleString("sv-SE");
    }

    const payload = {
      test_id: gpGetOrCreateTestId(),
      visitor_id: gpGetVisitorId(),
      event_type: "test_completed",
      timestamp_start: timestampStart,
      timestamp_end: timestampEnd,
      test_duration_seconds: duration,
      test_page: window.location.pathname,
      entry_page: sessionStorage.getItem("entry_page") || gpGetPreviousPath() || window.location.pathname,
      last_page_before_conversion: gpGetPreviousPath() || "",
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
      source: gpGetSource(),
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

    try {
      sessionStorage.removeItem("gp_test_id:" + window.location.pathname);
    } catch (e) {}
  });
})
    .catch(function(err){
      console.error("Tracking Fehler:", err);
    });

  } catch(e) {
    console.error("gpSendTestEvent Fehler:", e);
  }
}

(function(){
  function ready(fn){
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function(){
    var root = document.getElementById("gpLongevityRoot");
    if(!root) return;

var currentTestPage = window.location.pathname;
var startedKey = "test_started_at:" + currentTestPage;

// Für jeden neuen Seitenaufruf frische Startzeit setzen
sessionStorage.setItem(startedKey, Date.now().toString());

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

  loader.style.display = "block";
  bar.style.width = "0%";

  /* sanft zum Ladebereich scrollen */
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
  title  = "Stabil";
  body = `
<p><strong>Ihr Ergebnis zeigt eine gute gesund&shy;heitliche Basis.<\/strong> 
Viele Bereiche sind aktuell gut im Gleich&shy;gewicht.<\/p>
<p>In der <b>individuellen Auswertung<\/b> per E&#8209;Mail zeige ich Ihnen, wie Sie diese Stabi&shy;lität weiter stärken:<\/p>
<ul class="gp-result-checklist">
  <li>Was Ihre Vitalität langfristig nährt<\/li>
  <li>Wie Sie Ihr bio&shy;logisches Alter positiv beeinflussen<\/li>
<\/ul>
${gpFollowupBlock("gruen")}
`;
}

else if (pct <= 55) {
  status = "gelb";
  color  = "#c8a64a";
  title  = "Aufbauen";
  body = `
<p><strong>Ihr Ergebnis zeigt erhöhten Unter&shy;stützungs&shy;bedarf.<\/strong> Einige Bereiche brauchen jetzt gezielten Aufbau.<\/p>
<p>In der <b>individuellen Auswertung<\/b> per E&#8209;Mail zeige ich Ihnen, wo Sie ansetzen können:<\/p>
<ul class="gp-result-checklist">
  <li>Wo Ihre größten Kraft&shy;räuber liegen<\/li>
  <li>Was jetzt am wichtigsten ist<\/li>
<\/ul>
${gpFollowupBlock("gelb")}
`;
}

else {
  status = "rot";
  color  = "#b55353";
  title  = "Entlasten";
  body = `
<p><strong>Ihr Ergebnis deutet auf eine deut&shy;liche Über&shy;lastung hin.<\/strong> In solchen Phasen ist es wichtig, zuerst Entlastung zu schaffen.<\/p>
<p>In der <b>individuellen Auswertung<\/b> per E&#8209;Mail zeige ich Ihnen, wo Sie beginnen können:<\/p>
<ul class="gp-result-checklist">
  <li>Wie Sie Ihre Kraft&shy;räuber erkennen<\/li>
  <li>Was zuerst wirklich entlastet<\/li>
<\/ul>
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
})();

  })();
/* ]]> */
