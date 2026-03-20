/*
=========================================================
EMAIL TRACKING – DANKESEITE (Brevo / Selbsttest)
---------------------------------------------------------
Dieses Script sendet ein "email_entered"-Event an das
Google Sheet (Apps Script), sobald ein Nutzer seine
E-Mail im Selbsttest hinterlassen hat.

WICHTIG:
– Läuft auf der Danke-Seite nach Formular-Eintragung (Optin)
– Greift auf test_id aus sessionStorage zu
– Funktioniert nur innerhalb derselben Browser-Session
– Verhindert Doppel-Tracking pro Testlauf

Ziel:
Saubere Zuordnung von E-Mail-Eintragungen zu
Test, Quelle (UTM) und Nutzerverlauf

Bei Änderungen:
– Pfad /sessionStorage-Key prüfen (gp_test_id:...)
– Apps Script URL prüfen
=========================================================
*/

/* <![CDATA[ */

(function () {

  const TRACKING_URL = "https://script.google.com/macros/s/AKfycbxUdClD2csFRGCuPWi9WqX_5kLm5G2K-2nyZpTrZirnHtGtEHuNPWCVnunwtWRi9S6k7Q/exec";

  function gpGetVisitorId(){
    try {
      return sessionStorage.getItem("gp_visitor_id") || "";
    } catch(e){
      return "";
    }
  }

  function gpGetSessionId(){
    try {
      return sessionStorage.getItem("gp_session_id") || "";
    } catch(e){
      return "";
    }
  }

  function gpGetTestId(){
    try {
      return sessionStorage.getItem("gp_test_id:" + window.location.pathname) || "";
    } catch(e){
      return "";
    }
  }

  function gpGetDeviceType(){
    try {
      var ua = navigator.userAgent || "";
      if (/ipad|tablet/i.test(ua)) return "tablet";
      if (/mobi|android|iphone|ipod/i.test(ua)) return "mobile";
      return "desktop";
    } catch (e) {
      return "";
    }
  }

  function trySendEmailEvent(){

    try {
      const testId = gpGetTestId();
      if (!testId) return;

      const emailTrackKey = "gp_email_entered_tracked:" + testId;

      if (sessionStorage.getItem(emailTrackKey) === "1") return;

      const payload = {
        test_id: testId,
        visitor_id: gpGetVisitorId(),
        session_id: gpGetSessionId(),
        device: gpGetDeviceType(),
        event_type: "email_entered",
        timestamp_end: new Date().toLocaleString("sv-SE"),
        test_page: window.location.pathname
      };

      const blob = new Blob(
        [JSON.stringify(payload)],
        { type: "text/plain;charset=utf-8" }
      );

      const sent = navigator.sendBeacon(TRACKING_URL, blob);

      if (sent) {
        sessionStorage.setItem(emailTrackKey, "1");
        console.log("EMAIL_ENTERED gesendet", payload);
      }

    } catch(e){
      console.log("email tracking error", e);
    }
  }

  // 🔁 mehrmals versuchen (wichtig wegen Timing + iframe)
  let attempts = 0;

  function loop(){
    attempts++;
    trySendEmailEvent();

    if (attempts < 10) {
      setTimeout(loop, 1000);
    }
  }

  // Start leicht verzögert
  setTimeout(loop, 800);

})();

/* ]]> */
