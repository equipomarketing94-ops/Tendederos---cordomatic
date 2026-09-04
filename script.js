// =========================================================
// CONFIG
// =========================================================
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:4242'
  : '';

// TODO: cambia este número por el real de WhatsApp del negocio (formato internacional sin +)
const WHATSAPP_NUMBER = '573016692668';

// =========================================================
// CATÁLOGO DE PRODUCTOS
// Cada variante tiene su propio id único para el carrito y el backend.
// Las fotos van en la carpeta /frontend/img/ con el nombre indicado.
// =========================================================
const PRODUCTS = [
  {
    id: 'abatible',
    cat: 'pared',
    name: 'Tendedero Abatible',
    emoji: '🧱',
    // FOTO: pon tu imagen en frontend/img/abatible.jpg
    img: 'img/abatible.jpg',
    desc: 'Perfecto para espacios pequeños, balcones, baños, patios y zonas de ropa. Se cierra después de usarlo para optimizar tu espacio.',
    garantia: null,
    specs: [
      'Estructura de aluminio: tubo 1×1 con pintura electroestática',
      'Varillas de acero calibre #4',
      'Soporta hasta 60 lb de peso',
      'Resistente a la intemperie',
    ],
    variants: [
      { label: '60 cm × 65 cm', price: 294000 },
      { label: '80 cm × 65 cm', price: 313000 },
      { label: '1.00 m × 65 cm', price: 339000 },
      { label: '1.20 m × 65 cm', price: 372000 },
      { label: '1.50 m × 65 cm', price: 436000 },
      { label: '1.80 m × 65 cm', price: 489000 },
      { label: '2.00 m × 65 cm', price: 533000 },
    ],
  },
  {
    id: 'colgante',
    cat: 'techo',
    name: 'Tendedero Colgante',
    emoji: '🔝',
    img: 'img/colgante.jpg',
    desc: 'Perfecto para techos altos, zonas de ropa y para personas de poca altura. Sistema de polea para bajar y subir sin esfuerzo.',
    garantia: '3 años de garantía',
    specs: [
      'Estructura de aluminio tubo 1×1 con pintura electroestática',
      'Varillas de acero calibre #4',
      'Soporta hasta 65 lb de peso',
      'Sistema de rodachinas y piola de nylon',
      'Sistema de polea metálica o plástica según medida',
      'Servicio de mantenimiento y venta de repuestos',
    ],
    variants: [
      { label: '1.00 m × 70 cm', price: 596000 },
      { label: '1.20 m × 70 cm', price: 613000 },
      { label: '1.50 m × 70 cm', price: 681000 },
      { label: '1.80 m × 70 cm', price: 732000 },
      { label: '2.00 m × 70 cm', price: 789000 },
      { label: '2.40 m × 70 cm', price: 883000 },
    ],
  },
  {
    id: 'plegable',
    cat: 'pared',
    name: 'Tendedero Plegable',
    emoji: '📐',
    img: 'img/plegable.jpg',
    desc: 'Ideal para espacios muy reducidos: baños, patios y zonas de ropa con una sola pared disponible. Se cierra plano al terminar.',
    garantia: '1 año de garantía',
    specs: [
      'Estructura de acero troquelado con pintura electroestática',
      'Varillas de aluminio plastificadas',
      'Soporta hasta 45 lb de peso',
      'Resistente a la intemperie',
      'Servicio de mantenimiento y venta de repuestos',
    ],
    variants: [
      { label: '60 cm × 1.00 m', price: 248000 },
      { label: '80 cm × 1.00 m', price: 265000 },
      { label: '1.00 m × 1.00 m', price: 281000 },
    ],
  },
  {
    id: 'estatico',
    cat: 'techo',
    name: 'Tendedero Estático',
    emoji: '⬆️',
    img: 'img/estatico.jpg',
    desc: 'Para techos bajos donde no se necesita polea. Liviano pero con la mayor capacidad de peso del mercado.',
    garantia: '3 años de garantía',
    specs: [
      'Estructura de aluminio 1×1 con pintura electroestática',
      'Varillas de acero calibre #4',
      'Soporta hasta 65 lb de peso',
      'Servicio de mantenimiento y venta de repuestos',
    ],
    variants: [
      { label: '1.00 m × 70 cm', price: 297000 },
      { label: '1.20 m × 70 cm', price: 340000 },
      { label: '1.50 m × 70 cm', price: 393000 },
      { label: '1.80 m × 70 cm', price: 489000 },
      { label: '2.40 m × 70 cm', price: 533000 },
    ],
  },
  {
    id: 'cordomatic',
    cat: 'exterior',
    name: 'Tendedero Cordomatic',
    emoji: '🪢',
    img: 'img/cordomatic.jpg',
    desc: 'Perfecto para espacios amplios donde se instalan cuerdas de pared a pared. Opción económica y muy resistente a la intemperie.',
    garantia: '1 año de garantía',
    specs: [
      'Estructura de aluminio',
      'Caja de plástico para guardar las cuerdas',
      'Piola de nylon resistente',
      'Soporta hasta 15 lb de peso por cuerda',
      'Resistente a la intemperie',
      'Servicio de mantenimiento y venta de repuestos',
    ],
    variants: [
      { label: 'Caja 21 cm — 5 cuerdas × 5 m', price: 242000 },
      { label: 'Caja 30 cm — 6 cuerdas × 5 m', price: 284000 },
    ],
  },
];

// =========================================================
// UTILIDADES
// =========================================================
function formatCOP(n) {
  return '$' + n.toLocaleString('es-CO') + ' COP';
}

// =========================================================
// CARRITO — guardado en localStorage para no perder datos al recargar
// =========================================================
const CART_KEY = 'tendederos_cart_v2';
let cart = loadCart(); // { "abatible__0": { productId, variantIdx, qty } }

function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }
  catch { return {}; }
}
function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCartCount();
  renderCartDrawer();
}

function addToCart(productId, variantIdx) {
  const key = `${productId}__${variantIdx}`;
  if (cart[key]) { cart[key].qty += 1; }
  else { cart[key] = { productId, variantIdx, qty: 1 }; }
  saveCart();
  openCart();
}

function setQty(key, qty) {
  if (qty <= 0) { delete cart[key]; }
  else { cart[key].qty = qty; }
  saveCart();
}

function cartCount() {
  return Object.values(cart).reduce((a, b) => a + b.qty, 0);
}

function cartTotal() {
  return Object.values(cart).reduce((sum, item) => {
    const p = PRODUCTS.find(p => p.id === item.productId);
    if (!p) return sum;
    return sum + p.variants[item.variantIdx].price * item.qty;
  }, 0);
}

// =========================================================
// RENDER — catálogo de productos
// =========================================================
let activeFilter = 'all';

function renderProducts() {
  const grid = document.getElementById('product-grid');
  const list = activeFilter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.cat === activeFilter);

  grid.innerHTML = list.map(p => {
    const firstPrice = p.variants[0].price;
    const lastPrice = p.variants[p.variants.length - 1].price;
    const priceRange = p.variants.length > 1
      ? `${formatCOP(firstPrice)} – ${formatCOP(lastPrice)}`
      : formatCOP(firstPrice);

    const imgHtml = `
      <div class="card-img">
        <img src="${p.img}" alt="${p.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="placeholder" style="display:none">
          <span class="placeholder-icon">${p.emoji}</span>
          <span>Foto próximamente</span>
        </div>
        <span class="card-badge">${p.cat}</span>
        ${p.garantia ? `<span class="garantia-badge">✓ ${p.garantia}</span>` : ''}
      </div>
    `;

    const specsHtml = `
      <ul class="specs-list">
        ${p.specs.map(s => `<li>${s}</li>`).join('')}
      </ul>
    `;

    const selectHtml = `
      <div class="size-selector">
        <label for="sel-${p.id}">Elige medida</label>
        <select class="size-select" id="sel-${p.id}" data-product="${p.id}">
          ${p.variants.map((v, i) => `<option value="${i}">${v.label} — ${formatCOP(v.price)}</option>`).join('')}
        </select>
      </div>
    `;

    return `
      <article class="card-product">
        ${imgHtml}
        <div class="card-body">
          <span class="card-cat">${p.cat}</span>
          <h3>${p.name}</h3>
          <p class="desc">${p.desc}</p>
          ${specsHtml}
          ${selectHtml}
          <div class="card-foot">
            <div>
              <div class="price" id="price-${p.id}">${formatCOP(firstPrice)}</div>
              ${p.variants.length > 1 ? `<div style="font-size:0.72rem;color:var(--ink-soft)">desde ${formatCOP(firstPrice)}</div>` : ''}
            </div>
            <button class="btn btn-blue btn-sm" data-add="${p.id}">Añadir al carrito</button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Actualizar precio al cambiar medida
  grid.querySelectorAll('.size-select').forEach(sel => {
    sel.addEventListener('change', () => {
      const p = PRODUCTS.find(p => p.id === sel.dataset.product);
      const price = p.variants[parseInt(sel.value)].price;
      document.getElementById(`price-${p.id}`).textContent = formatCOP(price);
    });
  });

  // Botón añadir al carrito
  grid.querySelectorAll('[data-add]').forEach(btn => {
    btn.addEventListener('click', () => {
      const pid = btn.dataset.add;
      const sel = document.getElementById(`sel-${pid}`);
      addToCart(pid, parseInt(sel.value));
    });
  });
}

// =========================================================
// RENDER — contador y drawer del carrito
// =========================================================
function renderCartCount() {
  const el = document.getElementById('cart-count');
  const n = cartCount();
  el.textContent = n;
  el.style.display = n > 0 ? 'flex' : 'none';
}

function renderCartDrawer() {
  const wrap = document.getElementById('cart-items');
  const entries = Object.entries(cart);

  if (entries.length === 0) {
    wrap.innerHTML = `<p class="cart-empty">Tu carrito está vacío.<br>Añade un tendedero del catálogo.</p>`;
  } else {
    wrap.innerHTML = entries.map(([key, item]) => {
      const p = PRODUCTS.find(p => p.id === item.productId);
      if (!p) return '';
      const variant = p.variants[item.variantIdx];
      return `
        <div class="cart-item">
          <div class="cart-item-img">
            <img src="${p.img}" alt="${p.name}" onerror="this.outerHTML='<span style=\\"font-size:1.6rem\\">${p.emoji}</span>'">
          </div>
          <div class="cart-item-info">
            <h4>${p.name}</h4>
            <div class="size-label">${variant.label}</div>
            <div class="price" style="font-size:0.9rem;margin-top:4px">${formatCOP(variant.price * item.qty)}</div>
            <div class="qty-row">
              <button class="qty-btn" data-dec="${key}">−</button>
              <span class="qty-val">${item.qty}</span>
              <button class="qty-btn" data-inc="${key}">+</button>
            </div>
            <button class="remove-btn" data-remove="${key}">Quitar</button>
          </div>
        </div>
      `;
    }).join('');

    wrap.querySelectorAll('[data-inc]').forEach(b => b.addEventListener('click', () => {
      const k = b.dataset.inc; setQty(k, cart[k].qty + 1);
    }));
    wrap.querySelectorAll('[data-dec]').forEach(b => b.addEventListener('click', () => {
      const k = b.dataset.dec; setQty(k, cart[k].qty - 1);
    }));
    wrap.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', () => setQty(b.dataset.remove, 0)));
  }

  document.getElementById('cart-total').textContent = formatCOP(cartTotal());
}

// =========================================================
// CARRITO — abrir / cerrar
// =========================================================
function openCart() {
  document.getElementById('cart-drawer').classList.add('open');
  document.getElementById('overlay').classList.add('open');
}
function closeCart() {
  document.getElementById('cart-drawer').classList.remove('open');
  document.getElementById('overlay').classList.remove('open');
}

// =========================================================
// FILTROS por categoría
// =========================================================
function setupFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      renderProducts();
    });
  });
}

// =========================================================
// CHECKOUT — conecta con el backend Wompi (Fase 2)
// =========================================================
async function goToCheckout() {
  if (cartCount() === 0) return;
  const btn = document.getElementById('checkout-btn');
  btn.textContent = 'Conectando con el pago…';
  btn.disabled = true;

  try {
    const items = Object.values(cart).map(item => ({
      id: item.productId,
      variantIdx: item.variantIdx,
      qty: item.qty,
    }));
    const res = await fetch(`${API_BASE}/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });
    if (!res.ok) throw new Error();
    const data = await res.json();
    if (data.url) { window.location.href = data.url; }
    else throw new Error();
  } catch {
    btn.textContent = 'Pagar con Wompi';
    btn.disabled = false;
    alert('No se pudo conectar con el servidor de pago. El backend de Wompi se configurará en la siguiente fase.');
  }
}

// =========================================================
// FORMULARIO DE CONTACTO
// =========================================================
function setupContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = 'Enviando…';
    status.className = 'form-status';
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      status.textContent = '✓ Mensaje enviado. Te respondemos pronto.';
      status.className = 'form-status ok';
      form.reset();
    } catch {
      status.textContent = 'No se pudo enviar. Escríbenos por WhatsApp mientras lo solucionamos.';
      status.className = 'form-status err';
    }
  });
}

// =========================================================
// INIT
// =========================================================
function init() {
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola, quiero información sobre los tendederos')}`;
  document.getElementById('wa-float').href = waUrl;
  document.getElementById('wa-contact').href = waUrl;
  document.getElementById('wa-hero').href = waUrl;

  renderProducts();
  renderCartCount();
  renderCartDrawer();
  setupFilters();
  setupContactForm();

  document.getElementById('cart-open').addEventListener('click', openCart);
  document.getElementById('cart-close').addEventListener('click', closeCart);
  document.getElementById('overlay').addEventListener('click', closeCart);
  document.getElementById('checkout-btn').addEventListener('click', goToCheckout);
}

document.addEventListener('DOMContentLoaded', init);
