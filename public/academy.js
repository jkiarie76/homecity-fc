
function initAcademyGallery() {
    const gallery = document.querySelector("#academy-gallery-grid");
    const filtersContainer = document.querySelector("#academy-gallery-filters");
    const countElement = document.querySelector("#academy-visible-count");
    const emptyMessage = document.querySelector("#academy-gallery-empty");

    if (!gallery || !filtersContainer) return;

    const cards = Array.from(
        gallery.querySelectorAll(".academy-gallery-item")
    );

    if (!cards.length) return;

    // Collect unique categories from the gallery cards.
    const categories = [
        ...new Set(
            cards
                .map((card) => card.dataset.category?.trim())
                .filter(Boolean)
        )
    ];

    // Keep the existing All button and rebuild the remaining filters.
    filtersContainer.innerHTML = `
        <button
            class="academy-filter-btn active"
            type="button"
            data-filter="all"
            aria-pressed="true"
        >
            All
        </button>
    `;

    categories.forEach((category) => {
        const button = document.createElement("button");

        button.className = "academy-filter-btn";
        button.type = "button";
        button.dataset.filter = category;
        button.textContent = category;
        button.setAttribute("aria-pressed", "false");

        filtersContainer.appendChild(button);
    });

    function applyFilter(selectedCategory) {
        let visibleCount = 0;

        cards.forEach((card) => {
            const category = card.dataset.category;
            const isVisible =
                selectedCategory === "all" ||
                category === selectedCategory;

            card.hidden = !isVisible;

            if (isVisible) visibleCount++;
        });

        filtersContainer
            .querySelectorAll(".academy-filter-btn")
            .forEach((button) => {
                const isActive = button.dataset.filter === selectedCategory;

                button.classList.toggle("active", isActive);
                button.setAttribute("aria-pressed", String(isActive));
            });

        if (countElement) {
            countElement.textContent = String(visibleCount);
        }

        if (emptyMessage) {
            emptyMessage.hidden = visibleCount !== 0;
        }
    }

    // One listener handles every filter button.
    filtersContainer.addEventListener("click", (event) => {
        const button = event.target.closest(".academy-filter-btn");

        if (!button || !filtersContainer.contains(button)) return;

        applyFilter(button.dataset.filter);
    });

    applyFilter("all");
}

// Works on initial page load and Astro page navigation.
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAcademyGallery, {
        once: true
    });
} else {
    initAcademyGallery();
}

document.addEventListener("astro:page-load", initAcademyGallery);
