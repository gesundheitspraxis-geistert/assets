/* <![CDATA[ */

(function () {

const TRACKING_URL = "https://script.google.com/macros/s/AKfycbxUdClD2csFRGCuPWi9WqX_5kLm5G2K-2nyZpTrZirnHtGtEHuNPWCVnunwtWRi9S6k7Q/exec";

function gpGetVisitorId(){
  try{
    return localStorage.getItem("gp_visitor_id") || "";
  }catch(e){
    return "";
  }
}

function gpGetSessionId(){
  try{
    return sessionStorage.getItem("gp_session_id") || "";
  }catch(e){
    return "";
  }
}

function gpGetTestId(){
  try{
    const key = "gp_test_id:/selbsttest/gesundheit/";
    return sessionStorage.getItem(key) || "";
  }catch(e){
    return "";
  }
}

function gpGetDeviceType(){
  try{
    var ua = navigator.userAgent || "";
    if (/ipad|tablet/i.test(ua)) return "tablet";
    if (/mobi|android|iphone|ipod/i.test(ua)) return "mobile";
    return "desktop";
  }catch(e){
    return "";
  }
}

try {

  const testId = gpGetTestId();
  const emailTrackKey = "gp_email_entered_tracked:" + testId;

  if (!testId) return;
  if (sessionStorage.getItem(emailTrackKey) === "1") return;

  const payload = {
    test_id: testId,
    visitor_id: gpGetVisitorId(),
    session_id: gpGetSessionId(),
    device: gpGetDeviceType(),
    event_type: "email_entered",
    timestamp_end: new Date().toLocaleString("sv-SE"),
    test_page: "/selbsttest/gesundheit/"
  };

  const blob = new Blob(
    [JSON.stringify(payload)],
    { type: "text/plain;charset=utf-8" }
  );

  const sent = navigator.sendBeacon(TRACKING_URL, blob);

  if (sent) {
    sessionStorage.setItem(emailTrackKey, "1");
  }

} catch(e){
  console.log("email tracking error", e);
}

})();

/* ]]> */
