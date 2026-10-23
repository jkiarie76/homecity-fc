
(() => {
    function initNewsPage() {
        const cards = [
            ...document.querySelectorAll("[data-news-card]")
        ];

        const grid = document.querySelector("#news-grid");
        const filters = [
            ...document.querySelectorAll("[data-filter]")
        ];

        const searchInput = document.querySelector("#news-search-input");
        const emptyState = document.querySelector("#news-empty-state");
        const resultsCount = document.querySelector("#news-results-count");
        const resetButton = document.querySelector("#news-reset-filters");
        const featuredSection = document.querySelector("[data-featured-section]");

        // This script is shared by the listing and individual article pages.
        if (!cards.length || !grid) return;

        let activeFilter = "all";

        function getEventCategory(card) {
            const eventDate = card.dataset.eventDate;

            if (!eventDate) return "upcoming";

            // Compare YYYY-MM-DD values using the visitor's local calendar date.
            const now = new Date();

            const today = [
                now.getFullYear(),
                String(now.getMonth() + 1).padStart(2, "0"),
                String(now.getDate()).padStart(2, "0")
            ].join("-");

            return eventDate < today ? "past" : "upcoming";
        }

        function getCardCategory(card) {
            if (card.dataset.kind === "story") return "story";
            if (card.dataset.kind === "memo") return "memo";

            return getEventCategory(card);
        }

        function updateEventLabels() {
            cards.forEach((card) => {
                if (card.dataset.kind !== "event") return;

                const label = card.querySelector("[data-card-category]");

                if (label) {
                    label.textContent =
                        getCardCategory(card) === "past"
                            ? "Past Events"
                            : "Upcoming Events";
                }
            });
        }

        function applyFilters() {
            const query = searchInput.value.trim().toLowerCase();
            let visibleCount = 0;

            cards.forEach((card) => {
                const category = getCardCategory(card);

                const searchableText = [
                    card.dataset.title || "",
                    card.dataset.summary || ""
                ].join(" ");

                const matchesCategory =
                    activeFilter === "all" || activeFilter === category;

                const matchesSearch = searchableText.includes(query);
                const isVisible = matchesCategory && matchesSearch;

                card.hidden = !isVisible;

                if (isVisible) {
                    visibleCount++;
                }
            });

            // Keep the featured item in sync with the selected filter and search.
            if (featuredSection) {
                const featuredCard =
                    featuredSection.querySelector("[data-news-card]");

                featuredSection.hidden = Boolean(featuredCard?.hidden);
            }

            if (resultsCount) {
                resultsCount.textContent =
                    `${visibleCount} ${visibleCount === 1 ? "update" : "updates"}`;
            }

            if (emptyState) {
                emptyState.hidden = visibleCount !== 0;
            }
        }

        filters.forEach((button) => {
            button.addEventListener("click", () => {
                activeFilter = button.dataset.filter || "all";

                filters.forEach((filterButton) => {
                    const isActive = filterButton === button;

                    filterButton.classList.toggle("is-active", isActive);
                    filterButton.setAttribute(
                        "aria-pressed",
                        String(isActive)
                    );
                });

                applyFilters();
            });
        });

        if (searchInput) {
            searchInput.addEventListener("input", applyFilters);
        }

        if (resetButton) {
            resetButton.addEventListener("click", () => {
                activeFilter = "all";

                if (searchInput) {
                    searchInput.value = "";
                }

                filters.forEach((button) => {
                    const isActive = button.dataset.filter === "all";

                    button.classList.toggle("is-active", isActive);
                    button.setAttribute(
                        "aria-pressed",
                        String(isActive)
                    );
                });

                applyFilters();
                searchInput?.focus();
            });
        }

        updateEventLabels();
        applyFilters();
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initNewsPage,
            { once: true }
        );
    } else {
        initNewsPage();
    }
})();
