document.addEventListener('DOMContentLoaded', init)
let products = []
const page = document.body.dataset.page
let prefix, imgPrefix, dataPath
const validCoupons = { DESCUENTO10: 0.10, FERIA5: 0.05 }
let appliedCoupon = 0
const shippingFlat = 1500
const freeThreshold = 10000
const filters = { search: '', type: 'all', minPrice: 0, maxPrice: Infinity }

function configurePaths() {
  prefix = page === 'products' ? '' : '../'
  imgPrefix = `${prefix}imagines/`
  dataPath = `${prefix}data/products.json`
}

function showToast(msg, duration = 3000) {
  Toastify({
    text: msg,
    duration,
    gravity: 'top',
    position: 'center',
    style: {
      background: 'linear-gradient(to right, #7B1E24, #CBA135)',
      color: '#fff',
      fontWeight: '500'
    }
  }).showToast()
}

async function init() {
  configurePaths()
  try {
    const res = await fetch(dataPath)
    if (!res.ok) throw new Error()
    products = await res.json()
  } catch {
    return
  }
  if (page === 'products') {
    bindFilters()
    renderProducts()
  }
  if (page === 'offers') {
    renderOffers()
  }
  if (page === 'cart') {
    renderCart()
    bindCartCoupon()
    bindCheckout()
  }
}

function bindFilters() {
  const btnApply = document.getElementById('apply-filters')
  const btnClear = document.getElementById('clear-filters')
  const inpSearch = document.getElementById('search-input')
  const selType = document.getElementById('filter-type')
  const inpMin = document.getElementById('filter-min-price')
  const inpMax = document.getElementById('filter-max-price')
  btnApply.addEventListener('click', () => {
    filters.search = inpSearch.value.trim().toLowerCase()
    filters.type = selType.value
    filters.minPrice = Number(inpMin.value) || 0
    filters.maxPrice = Number(inpMax.value) || Infinity
    renderProducts()
  })
  btnClear.addEventListener('click', () => {
    inpSearch.value = ''
    selType.value = 'all'
    inpMin.value = ''
    inpMax.value = ''
    filters.search = ''
    filters.type = 'all'
    filters.minPrice = 0
    filters.maxPrice = Infinity
    renderProducts()
  })
}

function filterExtras(p) {
  const matchSearch = p.title.toLowerCase().includes(filters.search)
  const matchType =
    filters.type === 'all' ||
    (filters.type === 'malbec' && p.id <= 5) ||
    (filters.type === 'cabernet' && p.id >= 6 && p.id <= 8) ||
    (filters.type === 'syrah' && p.id >= 9)
  const matchPrice = p.price >= filters.minPrice && p.price <= filters.maxPrice
  return matchSearch && matchType && matchPrice
}

function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || []
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart))
}

function addToCart(id) {
  const cart = getCart()
  const item = cart.find(i => i.id === id)
  if (item) item.quantity++
  else cart.push({ id, quantity: 1 })
  saveCart(cart)
  const p = products.find(x => x.id === id)
  showToast(`Se agregó "${p.title}" al carrito`)
}

function renderProducts() {
  const groups = [
    { id: 'group-malbec', f: p => p.id <= 5 },
    { id: 'group-cabernet', f: p => p.id >= 6 && p.id <= 8 },
    { id: 'group-syrah', f: p => p.id >= 9 && p.id <= 12 }
  ]
  groups.forEach(g => {
    const c = document.getElementById(g.id)
    if (!c) return
    c.innerHTML = ''
    products
      .filter(g.f)
      .filter(filterExtras)
      .forEach(p => {
        const src = `${imgPrefix}${p.image}`
        c.insertAdjacentHTML('beforeend', `
          <div class="product-card">
            <img src="${src}" alt="${p.title}" loading="lazy">
            <div class="info">
              <h3 class="title">${p.title}</h3>
              <p class="price">$${p.price.toFixed(2)}</p>
              <button class="btn btn-sm btn-primary add-to-cart" data-id="${p.id}">Agregar al carrito</button>
            </div>
          </div>`)
      })
  })
}

function renderOffers() {
  const groups = [
    { id: 'group-malbec-offers', f: p => p.id >= 13 && p.id <= 16 },
    { id: 'group-cabernet-offers', f: p => p.id >= 17 && p.id <= 20 },
    { id: 'group-syrah-offers', f: p => p.id >= 21 && p.id <= 24 }
  ]
  groups.forEach(g => {
    const c = document.getElementById(g.id)
    if (!c) return
    c.innerHTML = ''
    products.filter(g.f).forEach(p => {
      const d = Math.round((1 - p.price / p.originalPrice) * 100)
      const src = `${imgPrefix}${p.image}`
      c.insertAdjacentHTML('beforeend', `
        <div class="offer-card">
          <span class="offer-badge">–${d}%</span>
          <img src="${src}" alt="${p.title}" loading="lazy">
          <div class="info">
            <h3 class="title">${p.title}</h3>
            <p class="price"><del>$${p.originalPrice.toFixed(2)}</del> $${p.price.toFixed(2)}</p>
            <button class="btn btn-sm btn-primary add-to-cart" data-id="${p.id}">Agregar al carrito</button>
          </div>
        </div>`)
    })
  })
}

function renderCart() {
  const cart = getCart()
  const c = document.getElementById('cart-items')
  if (!c) return
  c.innerHTML = cart.length ? '' : '<p>No hay productos en el carrito.</p>'
  cart.forEach(i => {
    const p = products.find(x => x.id === i.id)
    if (!p) return
    const card = document.createElement('div')
    card.className = 'card mb-3'
    card.innerHTML = `
      <div class="row g-0 align-items-center">
        <div class="col-4 col-sm-3">
          <img src="${imgPrefix}${p.image}" class="img-fluid rounded-start" alt="${p.title}" loading="lazy">
        </div>
        <div class="col-8 col-sm-9">
          <div class="card-body">
            <h6 class="card-title mb-1">${p.title}</h6>
            <p class="card-text text-muted mb-2">$${p.price.toFixed(2)} c/u</p>
            <div class="input-group input-group-sm mb-2 w-auto">
              <button class="btn btn-outline-secondary btn-decrease" data-id="${p.id}">−</button>
              <input type="number" min="1" value="${i.quantity}" class="form-control quantity-input text-center" data-id="${p.id}">
              <button class="btn btn-outline-secondary btn-increase" data-id="${p.id}">+</button>
            </div>
            <button class="btn btn-link text-danger btn-remove" data-id="${p.id}"><i class="bi bi-trash-fill"></i> Eliminar</button>
          </div>
        </div>
      </div>`
    c.appendChild(card)
  })
  atualizarListenersDeCarrito()
}

function atualizarListenersDeCarrito() {
  const c = document.getElementById('cart-items')
  c.querySelectorAll('.btn-increase').forEach(b => b.onclick = () => { updateQty(+b.dataset.id, getQty(+b.dataset.id) + 1); renderCart() })
  c.querySelectorAll('.btn-decrease').forEach(b => b.onclick = () => { updateQty(+b.dataset.id, getQty(+b.dataset.id) - 1); renderCart() })
  c.querySelectorAll('.btn-remove').forEach(b => b.onclick = () => { updateQty(+b.dataset.id, 0); renderCart() })
  c.querySelectorAll('.quantity-input').forEach(i => i.onchange = () => { updateQty(+i.dataset.id, +i.value); renderCart() })
  actualizarResumen()
}

function updateQty(id, qty) {
  let cart = getCart()
  cart = qty > 0 ? cart.map(i => i.id === id ? { ...i, quantity: qty } : i) : cart.filter(i => i.id !== id)
  saveCart(cart)
}

function getQty(id) {
  const item = getCart().find(i => i.id === id)
  return item?.quantity || 0
}

function onApplyCoupon() {
  const code = document.getElementById('coupon-code').value.trim().toUpperCase()
  appliedCoupon = validCoupons[code] || 0
  showToast(appliedCoupon ? `Cupón "${code}" aplicado (${appliedCoupon * 100}% off)` : 'Cupón inválido')
  actualizarResumen()
}

function actualizarResumen() {
  const cart = getCart()
  let subtotal = 0
  cart.forEach(i => { const p = products.find(x => x.id === i.id); if (p) subtotal += p.price * i.quantity })
  const discount = subtotal * appliedCoupon
  const after    = subtotal - discount
  const ship     = after >= freeThreshold ? 0 : shippingFlat
  const tax      = after * 0.21
  const total    = after + ship + tax
  const fmt      = n => `$${n.toFixed(2)}`
  document.getElementById('order-subtotal').textContent = fmt(subtotal)
  document.getElementById('order-shipping').textContent = fmt(ship)
  document.getElementById('order-tax').textContent      = fmt(tax)
  document.getElementById('order-total').textContent    = fmt(total)
  const msgEl = document.getElementById('free-shipping-msg')
  if (msgEl) msgEl.textContent = after >= freeThreshold ? '¡Te ganaste envío gratis!' : `Faltan ${fmt(freeThreshold - after)} para envío gratis.`
}

function bindCartCoupon() {
  document.getElementById('apply-coupon')?.addEventListener('click', onApplyCoupon)
}

function bindCheckout() {
  document.getElementById('checkout-btn')?.addEventListener('click', () => {
    saveCart([])
    appliedCoupon = 0
    document.getElementById('coupon-code').value = ''
    renderCart()
    showToast('Compra finalizada. ¡Gracias por tu compra!')
  })
}

document.body.addEventListener('click', e => {
  if (e.target.matches('.add-to-cart')) addToCart(+e.target.dataset.id)
})