(function () {
  var currentPath = window.location.pathname;

  if (!sessionStorage.getItem("entry_page")) {
    sessionStorage.setItem("entry_page", currentPath);
  }

  sessionStorage.setItem("last_page", currentPath);
})();
