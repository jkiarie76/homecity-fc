document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================
       MOBILE NAVIGATION
       ========================================================== */

    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    const navLinks = document.querySelectorAll(
        '.nav-menu .nav-link, .nav-menu .nav-cta-btn'
    );

    if (menuToggle && navMenu) {

        menuToggle.addEventListener('click', () => {

            const isOpen = navMenu.classList.toggle('active');

            menuToggle.innerHTML = isOpen
                ? '<i class="fas fa-xmark"></i>'
                : '<i class="fas fa-bars"></i>';

            menuToggle.setAttribute(
                'aria-expanded',
                isOpen ? 'true' : 'false'
            );

        });

        navLinks.forEach(link => {

            link.addEventListener('click', () => {

                navMenu.classList.remove('active');

                menuToggle.innerHTML =
                    '<i class="fas fa-bars"></i>';

                menuToggle.setAttribute(
                    'aria-expanded',
                    'false'
                );

            });

        });

    }


    /* ==========================================================
       BACK TO TOP
       ========================================================== */

    const backToTop = document.querySelector('.back-to-top');

    if (backToTop) {

        window.addEventListener('scroll', () => {

            if (window.scrollY > 500) {

                backToTop.classList.add('show');

            } else {

                backToTop.classList.remove('show');

            }

        });

        backToTop.addEventListener('click', () => {

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

        });

    }

        /* ==========================================================
       LEAGUE TABLE EXPANSION
       ========================================================== */

    const leagueTable = document.querySelector('.league-table');
    const tableToggle = document.querySelector('.table-toggle');

    if (leagueTable && tableToggle) {

        tableToggle.addEventListener('click', () => {

            const isExpanded =
                leagueTable.classList.toggle('table-expanded');

            tableToggle.setAttribute(
                'aria-expanded',
                isExpanded ? 'true' : 'false'
            );

            tableToggle.querySelector('span').textContent =
                isExpanded
                    ? 'SHOW LESS'
                    : 'VIEW FULL TABLE';

        });

    }

});

   