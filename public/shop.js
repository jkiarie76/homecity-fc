
(() => {
  const CART_KEY = "homecityfc_cart_v1";

  const readCart = () => {
    try {
      const value = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      return Array.isArray(value)
        ? value.filter(item => item && item.id && Number(item.quantity) > 0)
        : [];
    } catch {
      return [];
    }
  };

  const updateCartCounts = () => {
    const count = readCart().reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    );

    document.querySelectorAll("[data-cart-count]").forEach(node => {
      node.textContent = String(count);
    });
  };

  const showToast = message => {
    const toast = document.getElementById("shop-toast");
    const text = document.getElementById("shop-toast-message");

    if (!toast || !text) return;

    text.textContent = message;
    toast.hidden = false;
  };

  // Cart purchasing remains disabled until checkout is implemented.
  document.addEventListener("click", event => {
    const button = event.target.closest("[data-add-to-cart]");
    if (!button) return;

    if (button.disabled) return;

    showToast("Online purchasing is coming soon. Please check back later.");
  });

  // Search, category filtering and sorting.
  const search = document.getElementById("shop-search");
  const category = document.getElementById("shop-category");
  const sort = document.getElementById("shop-sort");
  const grid = document.getElementById("shop-product-grid");
  const noResults = document.getElementById("shop-no-results");

  const filterProducts = () => {
    if (!grid) return;

    const cards = [...grid.querySelectorAll(".product-card")];
    const term = (search?.value || "").trim().toLowerCase();
    const selectedCategory = category?.value || "all";

    cards.forEach(card => {
      const name = card.dataset.name || "";
      const text = (card.textContent || "").toLowerCase();

      const matchesText =
        name.includes(term) || text.includes(term);

      const matchesCategory =
        selectedCategory === "all" ||
        card.dataset.category === selectedCategory;

      card.hidden = !(matchesText && matchesCategory);
    });

    const visible = cards.filter(card => !card.hidden);

    visible.sort((a, b) => {
      if (sort?.value === "price-low") {
        return Number(a.dataset.price) - Number(b.dataset.price);
      }

      if (sort?.value === "price-high") {
        return Number(b.dataset.price) - Number(a.dataset.price);
      }

      if (sort?.value === "name") {
        return (a.dataset.name || "").localeCompare(
          b.dataset.name || ""
        );
      }

      // Featured/default order: preserve the CMS Display Order.
      return cards.indexOf(a) - cards.indexOf(b);
    });

    visible.forEach(card => grid.appendChild(card));

    if (noResults) {
      noResults.hidden = visible.length > 0;
    }
  };

  search?.addEventListener("input", filterProducts);
  category?.addEventListener("change", filterProducts);
  sort?.addEventListener("change", filterProducts);

  document
    .getElementById("shop-toast-close")
    ?.addEventListener("click", () => {
      const toast = document.getElementById("shop-toast");
      if (toast) toast.hidden = true;
    });

  updateCartCounts();
  filterProducts();
})();
