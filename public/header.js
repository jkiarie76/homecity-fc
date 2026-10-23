(() => {
    const initHomecityHeader = () => {
        document.querySelectorAll(".hc-header").forEach((header) => {
            if (header.dataset.initialized === "true") return;

            const menuToggle = header.querySelector(".hc-menu-toggle");
            const navigation = header.querySelector(".hc-navigation");
            const dropdown = header.querySelector(".hc-dropdown");
            const dropdownToggle = header.querySelector(".hc-dropdown-toggle");

            if (!menuToggle || !navigation) {
                console.error("Homecity header: menu button or navigation not found.");
                return;
            }

            header.dataset.initialized = "true";

            const closeDropdown = () => {
                dropdown.classList.remove("dropdown-open");
                dropdownToggle.setAttribute("aria-expanded", "false");
            };

            const closeMenu = () => {
                navigation.classList.remove("nav-open");
                menuToggle.classList.remove("menu-open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Open navigation menu");
                closeDropdown();
            };

            menuToggle.addEventListener("click", () => {
                const isOpen = navigation.classList.toggle("nav-open");

                menuToggle.classList.toggle("menu-open", isOpen);
                menuToggle.setAttribute("aria-expanded", String(isOpen));
                menuToggle.setAttribute(
                    "aria-label",
                    isOpen ? "Close navigation menu" : "Open navigation menu"
                );

                if (!isOpen) closeDropdown();
            });

            if (dropdown && dropdownToggle) {
                dropdownToggle.addEventListener("click", () => {
                    const isOpen = dropdown.classList.toggle("dropdown-open");
                    dropdownToggle.setAttribute("aria-expanded", String(isOpen));
                });
            }

            navigation.querySelectorAll("a").forEach((link) => {
                link.addEventListener("click", closeMenu);
            });

            document.addEventListener("click", (event) => {
                if (
                    event.target instanceof Node &&
                    !header.contains(event.target)
                ) {
                    closeMenu();
                }
            });

            document.addEventListener("keydown", (event) => {
                if (event.key === "Escape") {
                    const menuWasOpen = navigation.classList.contains("nav-open");

                    closeMenu();

                    if (menuWasOpen) menuToggle.focus();
                }
            });

            window.addEventListener("resize", () => {
                if (window.innerWidth > 1050) closeMenu();
            });
        });
    };

    initHomecityHeader();
    document.addEventListener("astro:page-load", initHomecityHeader);
})();
