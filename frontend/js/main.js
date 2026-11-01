/* =====================================================
   SMARTGRIEVANCE MAIN JAVASCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    console.log(
        "SmartGrievance frontend initialized"
    );


    /* ==============================================
       MOBILE MENU
    ============================================== */

    const mobileMenu =
        document.getElementById("mobileMenu");

    const navLinks =
        document.querySelector(".nav-links");


    if (mobileMenu) {

        mobileMenu.addEventListener(
            "click",
            function () {

                if (
                    navLinks.style.display === "flex"
                ) {

                    navLinks.style.display = "none";

                } else {

                    navLinks.style.display = "flex";

                    navLinks.style.flexDirection =
                        "column";

                    navLinks.style.position =
                        "absolute";

                    navLinks.style.top =
                        "78px";

                    navLinks.style.right =
                        "5%";

                    navLinks.style.padding =
                        "20px";

                    navLinks.style.background =
                        "#0a1024";

                    navLinks.style.border =
                        "1px solid rgba(255,255,255,0.1)";

                    navLinks.style.borderRadius =
                        "15px";

                }

            }
        );

    }


    /* ==============================================
       SCROLL REVEAL
    ============================================== */

    const cards =
        document.querySelectorAll(
            ".feature-card, .workflow-step"
        );


    const observer =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.style.opacity = "1";

                        entry.target.style.transform =
                            "translateY(0)";

                    }

                });

            },
            {
                threshold: 0.15
            }
        );


    cards.forEach(function (card) {

        card.style.opacity = "0";

        card.style.transform =
            "translateY(30px)";

        card.style.transition =
            "all 0.7s ease";

        observer.observe(card);

    });

});