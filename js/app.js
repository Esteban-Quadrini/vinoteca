// js/app.js

// Datos de productos
const products = [
  { id: 1, title: 'Producto 1', price: 10.00, image: 'https://via.placeholder.com/200x150', onSale: false, originalPrice: null },
  { id: 2, title: 'Producto 2', price: 20.00, image: 'https://via.placeholder.com/200x150', onSale: true, originalPrice: 25.00 },
  { id: 3, title: 'Producto 3', price: 15.00, image: 'https://via.placeholder.com/200x150', onSale: false, originalPrice: null },
  { id: 4, title: 'Producto 4', price: 30.00, image: 'https://via.placeholder.com/200x150', onSale: true, originalPrice: 40.00 }
];

// LocalStorage: obtener y guardar carrito
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Añadir producto al carrito
function addToCart(productId) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);

  if (item) {
    item.quantity++;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  saveCart(cart);
  alert('Producto agregado al carrito');
}

// Renderizar sección de productos
function renderProducts() {
  const container = document.querySelector('.productos-grid');
  if (!container) return;

  container.innerHTML = '';

  products
    .filter(p => !p.onSale)
    .forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <div class="info">
          <h3 class="title">${product.title}</h3>
          <p class="price">$${product.price.toFixed(2)}</p>
          <button class="btn btn-sm btn-primary add-to-cart" data-id="${product.id}">
            Agregar al carrito
          </button>
        </div>
      `;
      container.appendChild(card);
    });

  container.addEventListener('click', e => {
    if (e.target.matches('.add-to-cart')) {
      const id = parseInt(e.target.dataset.id, 10);
      addToCart(id);
    }
  });
}

// Renderizar sección de ofertas
function renderOffers() {
  const container = document.querySelector('.ofertas-grid');
  if (!container) return;

  container.innerHTML = '';

  products
    .filter(p => p.onSale)
    .forEach(product => {
      const discount = Math.round((1 - product.price / product.originalPrice) * 100);
      const card = document.createElement('div');
      card.className = 'offer-card';
      card.innerHTML = `
        <span class="offer-badge">–${discount}%</span>
        <img src="${product.image}" alt="${product.title}">
        <div class="info">
          <h3 class="title">${product.title}</h3>
          <p class="price"><del>$${product.originalPrice.toFixed(2)}</del> $${product.price.toFixed(2)}</p>
          <button class="btn btn-sm btn-primary add-to-cart" data-id="${product.id}">
            Agregar al carrito
          </button>
        </div>
      `;
      container.appendChild(card);
    });

  container.addEventListener('click', e => {
    if (e.target.matches('.add-to-cart')) {
      const id = parseInt(e.target.dataset.id, 10);
      addToCart(id);
    }
  });
}

// Renderizar carrito de compras
function renderCart() {
  const tableBody = document.querySelector('.carrito-table tbody');
  if (!tableBody) return;

  const cart = getCart();
  tableBody.innerHTML = '';

  if (cart.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="3">No hay productos en el carrito.</td>
      </tr>
    `;
    return;
  }

  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product.title}</td>
      <td>
        <input
          type="number"
          min="1"
          value="${item.quantity}"
          data-id="${product.id}"
          class="quantity-input"
        >
      </td>
      <td>$${(product.price * item.quantity).toFixed(2)}</td>
    `;
    tableBody.appendChild(row);
  });

  tableBody.addEventListener('change', e => {
    if (e.target.matches('.quantity-input')) {
      const id = parseInt(e.target.dataset.id, 10);
      const qty = parseInt(e.target.value, 10);
      updateQuantity(id, qty);
      renderCart();
    }
  });
}

// Actualizar cantidad o eliminar del carrito
function updateQuantity(productId, quantity) {
  let cart = getCart();

  if (quantity <= 0) {
    cart = cart.filter(i => i.id !== productId);
  } else {
    const item = cart.find(i => i.id === productId);
    if (item) item.quantity = quantity;
  }

  saveCart(cart);
}

// Inicializar según la página actual
function init() {
  const page = document.body.dataset.page;

  if (page === 'products') {
    renderProducts();
  }

  if (page === 'offers') {
    renderOffers();
  }

  if (page === 'cart') {
    renderCart();

    const checkoutBtn = document.querySelector('.btn-primary');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        alert('Compra finalizada. ¡Gracias por tu compra!');
        saveCart([]);
        renderCart();
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', init);
