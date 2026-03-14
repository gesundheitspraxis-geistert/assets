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

const GP_FORM_VER = "2026-03-13-26";
const TRACKING_URL = "https://script.google.com/macros/s/AKfycbwi0vq4JhCeu1mdZaR33rLNn4hBjwO4GTDgTZQdqtMS6SVnCejLrOe19k0B58J1JwaH/exec";

const GP_FORM_GRUEN = "https://401e9539.sibforms.com/serve/MUIFAB7xEJimOTWDIuRru-zsKDUuFXdIorgj7u8slBnxZl654eKfRdvXPl0lZMPi2cXZWbKy4PkmCJ0pXReKo3A1RFAAP1wdVqjCZZnWCwHyz9EJ7X13EVywq06tSJv3yxcKtthv81PdPFNHR7kn04qD3o2PU8gnvzp3EjkYqt7v6iczUWcFrUoIlSZgDT9VtF0sqWSSa_YOgsRsSg==?v=" + GP_FORM_VER;

const GP_FORM_GELB = "https://401e9539.sibforms.com/serve/MUIFABhoIJM37VBTosoxmFVElHBfSLSiE_53ub9w84L-VQsQfMffdqDozvVZPbnnDKprgEOIqSMaXg3OEHwCVcOxz8mcq9wtStO1vgFdpc-9BHrS7fOWFQgWugMYRdv2904s_hbnM-XGza1bZBAJZrDVRte1Wf2gRDdogRcD1L5_EFssxqzbdohDog8UldlJVyCPUAqiWBs7wnJVnQ==?v=" + GP_FORM_VER;

const GP_FORM_ROT = "https://401e9539.sibforms.com/serve/MUIFAIXB78-mVd4nt0f0Brwpkd1Gcq-1p8FvVfmVtMWx9iK1uIDEaR_ah0xHQCFTKy08utalxpCnzTLuNcDNSkQlh2HZw_UZMBkrlq5PWODV2XXp1z3pxjwr843Cqhn8WaDq--rVKAItUcesWfmP7czOSMcnmnIh5xkJBRbUOLQtzXH7fQpKe_O7Qg3S8_72R9V5YyBSRxspWxfeSw==?v=" + GP_FORM_VER;

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

function gpSendTestEvent(result, score){
  try {
    if (!sessionStorage.getItem("entry_page")) {
      sessionStorage.setItem("entry_page", window.location.pathname);
    }

    fetch(TRACKING_URL, {
      method: "POST",
      body: JSON.stringify({
        event_id: crypto.randomUUID(),
        event_type: "test_completed",
        entry_page: sessionStorage.getItem("entry_page") || window.location.pathname,
        source: gpGetSource(),
        result: result,
        score: score
      })
    }).catch(function(){});
  } catch(e) {}
}

(function(){
  function ready(fn){
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function(){
    var root = document.getElementById("gpLongevityRoot");
    if(!root) return;

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
