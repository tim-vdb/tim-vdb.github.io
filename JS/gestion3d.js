document.addEventListener("DOMContentLoaded", function () {

    // --- Gestion du Loader Canvas - Page D'accueil ---
    function waitForPageLoadAndDelay(delay) {
        return new Promise((resolve) => {
            window.onload = () => {
                setTimeout(() => {
                    resolve();
                }, delay);
            };
        });
    }

    const LoaderDelay = 4500;

    waitForPageLoadAndDelay(LoaderDelay).then(() => {
        const loader = document.getElementById("canvas");
        const div_fixed = document.getElementById("div_fixed");

        // Suppression du loader
        if (loader) {
            loader.remove();
        }
         // Réactive le défilement
        document.body.style.overflow = "auto";
        div_fixed.style.opacity = "1";

        // Animation translate
        const observer_elements = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show_aperçu");
                }
            });
        }, { threshold: 0.2 });

        const animTranslate = document.querySelectorAll(".animTranslateLeft, .animTranslateRight, .animTranslateBottom, .animTranslateTop")
        animTranslate.forEach((el) => observer_elements.observe(el));
    });

});