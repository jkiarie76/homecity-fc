(() => {
  const CART_KEY = "homecityfc_cart_v1";
  const readCart = () => { try { const c = JSON.parse(localStorage.getItem(CART_KEY) || "[]"); return Array.isArray(c) ? c : []; } catch { return []; } };
  const saveCart = cart => { localStorage.setItem(CART_KEY, JSON.stringify(cart)); render(); window.dispatchEvent(new CustomEvent("homecity:cart-updated", { detail: { cart } })); };
  const money = value => `KES ${Number(value || 0).toLocaleString("en-KE")}`;
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  const itemsRoot = document.getElementById("cart-items");
  const render = () => {
    const cart = readCart();
    const empty = document.getElementById("cart-empty");
    const layout = document.getElementById("cart-layout");
    if (empty) empty.hidden = cart.length > 0;
    if (layout) layout.hidden = cart.length === 0;
    document.querySelectorAll("[data-cart-count]").forEach(node => node.textContent = String(cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0)));
    if (!itemsRoot) return;
    itemsRoot.innerHTML = cart.map((item, index) => `
      <article class="cart-item" data-index="${index}">
        <div class="cart-product-cell"><div class="cart-thumb">${item.image ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" onerror="this.style.display='none'">` : ""}</div><div class="cart-product-copy"><h3>${escapeHtml(item.name)}</h3>${item.size ? `<p>Size: ${escapeHtml(item.size)}</p>` : ""}<p>${money(item.price)} each</p><button type="button" class="text-button remove-item" data-action="remove" data-index="${index}">Remove</button></div></div>
        <div class="quantity-control" aria-label="Quantity controls"><button type="button" data-action="decrease" data-index="${index}" aria-label="Decrease quantity">−</button><span>${Number(item.quantity)}</span><button type="button" data-action="increase" data-index="${index}" aria-label="Increase quantity">+</button></div>
        <strong class="cart-line-total">${money(Number(item.price) * Number(item.quantity))}</strong>
      </article>`).join("");
    const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
    const count = cart.reduce((sum, item) => sum + Number(item.quantity), 0);
    const countNode = document.getElementById("summary-item-count");
    if (countNode) countNode.textContent = String(count);
    ["cart-subtotal", "cart-total"].forEach(id => { const node = document.getElementById(id); if (node) node.textContent = money(subtotal); });
  };
  itemsRoot?.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const index = Number(button.dataset.index);
    const cart = readCart();
    const item = cart[index];
    if (!item) return;
    if (button.dataset.action === "remove") cart.splice(index, 1);
    if (button.dataset.action === "increase") item.quantity = Number(item.quantity) + 1;
    if (button.dataset.action === "decrease") { item.quantity = Number(item.quantity) - 1; if (item.quantity <= 0) cart.splice(index, 1); }
    saveCart(cart);
  });
  document.getElementById("clear-cart")?.addEventListener("click", () => { if (readCart().length && window.confirm("Remove all items from your cart?")) saveCart([]); });
  window.addEventListener("storage", event => { if (event.key === CART_KEY) render(); });
  window.addEventListener("homecity:cart-updated", render);
  render();
})();
