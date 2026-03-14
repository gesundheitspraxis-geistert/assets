(function () {
  if (!sessionStorage.getItem("entry_page")) {
    sessionStorage.setItem("entry_page", window.location.pathname);
  }
})();
