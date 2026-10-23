(() => {
  const CART_KEY = "homecityfc_cart_v1";
  const money = value => `KES ${Number(value || 0).toLocaleString("en-KE")}`;
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  const readCart = () => { try { const c = JSON.parse(localStorage.getItem(CART_KEY) || "[]"); return Array.isArray(c) ? c : []; } catch { return []; } };
  const cart = readCart();
  const empty = document.getElementById("checkout-empty");
  const layout = document.getElementById("checkout-layout");
  const review = document.getElementById("order-review");
  const form = document.getElementById("checkout-form");
  if (empty) empty.hidden = cart.length > 0;
  if (layout) layout.hidden = cart.length === 0;
  const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
  const count = cart.reduce((sum, item) => sum + Number(item.quantity), 0);
  const countNode = document.getElementById("checkout-count"); if (countNode) countNode.textContent = String(count);
  const subtotalNode = document.getElementById("checkout-subtotal"); if (subtotalNode) subtotalNode.textContent = money(subtotal);
  const itemsNode = document.getElementById("checkout-items");
  if (itemsNode) itemsNode.innerHTML = cart.map(item => `<div class="checkout-item"><div><strong>${escapeHtml(item.name)}</strong><span>${item.size ? `Size ${escapeHtml(item.size)} · ` : ""}Qty ${Number(item.quantity)}</span></div><strong>${money(Number(item.price) * Number(item.quantity))}</strong></div>`).join("");

  let pendingPreview = null;
  form?.addEventListener("submit", event => {
    event.preventDefault();
    const message = document.getElementById("checkout-message");
    if (!cart.length) { if (message) message.textContent = "Your cart is empty. Add a product before checkout."; return; }
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form).entries());
    pendingPreview = { createdAt: new Date().toISOString(), customer: data, items: cart, subtotal };
    const details = document.getElementById("review-details");
    if (details) {
      details.innerHTML = `<h3>Contact</h3><p><strong>${escapeHtml(data.fullName)}</strong><br>${escapeHtml(data.phone)}${data.email ? `<br>${escapeHtml(data.email)}` : ""}</p><h3>Delivery</h3><p>${escapeHtml(data.address)}<br>${escapeHtml(data.town)}, ${escapeHtml(data.county)}</p><h3>Items</h3>${cart.map(item => `<div class="review-item"><span>${escapeHtml(item.name)}${item.size ? ` (${escapeHtml(item.size)})` : ""} × ${Number(item.quantity)}</span><strong>${money(Number(item.price) * Number(item.quantity))}</strong></div>`).join("")}<div class="summary-total"><span>Subtotal</span><strong>${money(subtotal)}</strong></div>${data.notes ? `<h3>Notes</h3><p>${escapeHtml(data.notes)}</p>` : ""}`;
    }
    if (layout) layout.hidden = true;
    if (review) { review.hidden = false; review.scrollIntoView({ behavior: "smooth", block: "start" }); }
    if (message) message.textContent = "";
  });
  document.getElementById("edit-order")?.addEventListener("click", () => { if (review) review.hidden = true; if (layout) layout.hidden = false; });
  document.getElementById("confirm-preview")?.addEventListener("click", () => {
    const message = document.getElementById("review-message");
    if (!pendingPreview) { if (message) message.textContent = "Please enter your details first."; return; }
    try {
      localStorage.setItem("homecityfc_order_preview_v1", JSON.stringify(pendingPreview));
      if (message) message.textContent = "Order preview saved on this device only. The club has not received this order and no payment was processed.";
    } catch { if (message) message.textContent = "Could not save this preview in the browser. Please keep a copy of your details."; }
  });
})();
