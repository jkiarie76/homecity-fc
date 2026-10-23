
/* =========================================
   HOMECITY FC — SENIOR TEAM GALLERY
========================================= */

function initSeniorGallery() {
    const gallery = document.querySelector("#team-gallery");

    if (!gallery || gallery.dataset.initialized === "true") {
        return;
    }

    const filtersContainer = gallery.querySelector(
        "#senior-gallery-filters"
    );

    const galleryGrid = gallery.querySelector(
        "#senior-gallery-grid"
    );

    const counter = gallery.querySelector(".gallery-count");
    const emptyMessage = gallery.querySelector(
        ".senior-gallery__empty"
    );

    if (!filtersContainer || !galleryGrid) return;

    gallery.dataset.initialized = "true";

    const cards = Array.from(
        galleryGrid.querySelectorAll(".senior-gallery__item")
    );

    // Create a stable category slug from the category name.
    const normalizeCategory = (value) =>
        value.trim().toLowerCase();

    // Build categories from the gallery's actual data.
    // Adding a new category to a gallery item adds a filter automatically.
    const categories = [
        ...new Set(
            cards
                .map((card) =>
                    normalizeCategory(card.dataset.category || "")
                )
                .filter(Boolean)
        )
    ];

    // Keep the All button and generate the remaining filters.
    filtersContainer.replaceChildren();

    const allButton = document.createElement("button");
    allButton.type = "button";
    allButton.className = "gallery-filter is-active";
    allButton.dataset.filter = "all";
    allButton.setAttribute("aria-pressed", "true");
    allButton.textContent = "All";

    filtersContainer.appendChild(allButton);

    categories.forEach((category) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "gallery-filter";
        button.dataset.filter = category;
        button.setAttribute("aria-pressed", "false");

        // Display the category in a readable format.
        button.textContent = category
            .split(/\s+/)
            .map((word) =>
                word.charAt(0).toUpperCase() + word.slice(1)
            )
            .join(" ");

        filtersContainer.appendChild(button);
    });

    function applyFilter(selectedCategory) {
        let visibleCount = 0;

        cards.forEach((card) => {
            const category = normalizeCategory(
                card.dataset.category || ""
            );

            const matches =
                selectedCategory === "all" ||
                category === selectedCategory;

            card.hidden = !matches;

            if (matches) visibleCount++;
        });

        filtersContainer
            .querySelectorAll(".gallery-filter")
            .forEach((button) => {
                const isActive =
                    button.dataset.filter === selectedCategory;

                button.classList.toggle("is-active", isActive);
                button.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );
            });

        if (counter) {
            counter.textContent = String(visibleCount).padStart(2, "0");
        }

        if (emptyMessage) {
            emptyMessage.hidden = visibleCount !== 0;
        }
    }

    // Event delegation means generated filters need no individual listeners.
    filtersContainer.addEventListener("click", (event) => {
        const button = event.target.closest(".gallery-filter");

        if (!button || !filtersContainer.contains(button)) return;

        applyFilter(button.dataset.filter || "all");
    });

    // Open the original image in a new tab when a gallery image is clicked.
    galleryGrid.addEventListener("click", (event) => {
        const link = event.target.closest("[data-gallery-image]");

        if (!link || !galleryGrid.contains(link)) return;

        // Preserve standard browser link behaviour.
        // A dedicated lightbox can be added later.
    });

    // Initialize the counter and display every photo.
    applyFilter("all");
}

initSeniorGallery();

// Support Astro client-side navigation if enabled.
document.addEventListener("astro:page-load", initSeniorGallery);
