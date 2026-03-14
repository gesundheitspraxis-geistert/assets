/*
YouTube Lazy Load Player

lädt das YouTube-Video erst nach Klick auf den Video-Teaser.
Dadurch werden vorher keine YouTube-Cookies gesetzt.

Funktionen:
- ersetzt den Video-Teaser durch ein YouTube iframe
- startet das Video automatisch (autoplay)
- nutzt youtube-nocookie.com
- passt die Bildunterschrift unter dem Video an
- setzt die CSS-Klasse "video-is-playing"
*/

/* <![CDATA[ */
// === lädt Inhalte von Youtube ===

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".gp-video-teaser").forEach(function (btn) {
        btn.addEventListener("click", function () {
            var videoId = btn.getAttribute("data-video-id");
            if (!videoId) return;

            var mediaContainer = btn.closest(".gp-hero-media, .gp-intent-media");
            
            if (mediaContainer) {
                var footerText = mediaContainer.querySelector(".gp-video-footer-text");
                if (footerText) {
                    // Ein klarer, sachlicher Text
                    footerText.innerHTML = "Infovideo zum Selbsttest (YouTube)"; 
                    // Deutlich dunkler (0.85), wirkt nun wie eine bewusste Bildunterschrift
                    footerText.style.opacity = "0.85"; 
                }
                mediaContainer.classList.add("video-is-playing");
            }

            btn.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + videoId + '?autoplay=1&rel=0" ' +
                            'style="position:absolute; top:0; left:0; width:100%; height:100%; border:0; border-radius:18px;" ' +
                            'allow="autoplay; encrypted-media" allowfullscreen><\/iframe>';
        });
    });
});
/* ]]> */
