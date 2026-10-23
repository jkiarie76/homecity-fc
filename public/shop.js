(() => {
  const CART_KEY = "homecityfc_cart_v1";
  const readCart = () => {
    try {
      const value = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      return Array.isArray(value) ? value.filter(item => item && item.id && Number(item.quantity) > 0) : [];
    } catch { return []; }
  };
  const writeCart = cart => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCounts();
    window.dispatchEvent(new CustomEvent("homecity:cart-updated", { detail: { cart } }));
  };
  const updateCartCounts = () => {
    const count = readCart().reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    document.querySelectorAll("[data-cart-count]").forEach(node => { node.textContent = String(count); });
  };
  const money = amount => `KES ${Number(amount || 0).toLocaleString("en-KE")}`;
  const showToast = message => {
    const toast = document.getElementById("shop-toast");
    const text = document.getElementById("shop-toast-message");
    if (!toast || !text) return;
    text.textContent = message;
    toast.hidden = false;
  };

  document.addEventListener("click", event => {
    const button = event.target.closest("[data-add-to-cart]");
    if (!button) return;
    const card = button.closest(".product-card");
    if (!card) return;
    const id = String(button.dataset.productId || card.dataset.productId || "");
    const name = card.querySelector("h3")?.textContent?.trim();
    const image = card.querySelector(".product-image")?.getAttribute("src") || "";
    const price = Number(card.dataset.price);
    const sizeSelect = card.querySelector(".product-size");
    const size = sizeSelect ? sizeSelect.value : "";
    if (!id || !name || !Number.isFinite(price)) { showToast("This product could not be added. Please refresh and try again."); return; }
    const cart = readCart();
    const existing = cart.find(item => item.id === id && item.size === size);
    if (existing) existing.quantity += 1;
    else cart.push({ id, name, image, price, size, quantity: 1 });
    writeCart(cart);
    showToast(`${name}${size ? ` (${size})` : ""} added to cart`);
    button.classList.add("is-added");
    window.setTimeout(() => button.classList.remove("is-added"), 650);
  });

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
      const matchesText = (card.dataset.name || "").includes(term) || (card.textContent || "").toLowerCase().includes(term);
      const matchesCategory = selectedCategory === "all" || card.dataset.category === selectedCategory;
      card.hidden = !(matchesText && matchesCategory);
    });
    const visible = cards.filter(card => !card.hidden);
    visible.sort((a, b) => {
      if (sort?.value === "price-low") return Number(a.dataset.price) - Number(b.dataset.price);
      if (sort?.value === "price-high") return Number(b.dataset.price) - Number(a.dataset.price);
      if (sort?.value === "name") return (a.dataset.name || "").localeCompare(b.dataset.name || "");
      return 0;
    });
    visible.forEach(card => grid.appendChild(card));
    if (noResults) noResults.hidden = visible.length > 0;
  };
  search?.addEventListener("input", filterProducts);
  category?.addEventListener("change", filterProducts);
  sort?.addEventListener("change", filterProducts);
  document.getElementById("shop-toast-close")?.addEventListener("click", () => { const toast = document.getElementById("shop-toast"); if (toast) toast.hidden = true; });
  updateCartCounts();
})();
