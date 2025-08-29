**Mi Tienda de Vinos
Una pequeña tienda online de vinos estática, con secciones de productos, ofertas y un carrito de compras interactivo. Usa JavaScript puro, Bootstrap 5 y Toastify.js para notificaciones, y carga datos vía fetch desde data/products.json. El carrito se guarda en localStorage y permite aplicar cupones, calcular envío, impuestos y finalizar la compra.

Características principales
- Pre-renderizado de páginas estáticas (HTML/CSS/JS)
- Filtro por texto, variedad y rango de precios
- Sección de ofertas con badge de descuento
- Carrito persistente en localStorage
- Aplicación de cupones de descuento (DESCUENTO10, FERIA5)
- Cálculo de subtotal, envío gratuito a partir de $10 000, impuestos (21%) y total
- Notificaciones con Toastify.js
- Responsive/mobile-first con Bootstrap 5

Tecnologías
- HTML5 / CSS3
- Bootstrap 5 (CSS y JS)
- Vanilla JavaScript (ES6+)
- Toastify.js para toasts
- fetch + JSON para catálogo de productos
- localStorage para persistencia del carrito

Instalación y uso
- Clonar el repositorio
git clone https://github.com/tu-usuario/mi-tienda-vinos.git
cd mi-tienda-vinos
- Servir estático
- Con VSCode Live Server
- Con npm install -g serve y luego serve .
- O desplegar en Netlify, GitHub Pages, Vercel, etc.
- Abrir en el navegador:
- http://localhost:5000/index.html
- Navegar a ofertas.html y carrito.html

Estructura del proyecto
/
├── data/
│   └── products.json       # Catálogo de productos
├── css/
│   └── style.css           # Estilos personalizados
├── imagines/               # Imágenes de productos
├── js/
│   └── app.js              # Lógica de filtros, carrito y toasts
├── index.html              # Página de Productos
├── page/
│   ├── ofertas.html        # Página de Ofertas
│   └── carrito.html        # Página de Carrito
└── README.md



Personalización
- Catálogo: modificar data/products.json
- Cupones: editar el objeto validCoupons en js/app.js
- Umbral de envío gratis: cambiar freeThreshold (en ARS)
- Estilos: ajustar variables en css/style.css
- Notificaciones: personalizar showToast() con Toastify options

Flujo de usuario
- En la página de Productos:
- Buscar por nombre
- Filtrar por variedad o rango de precios
- Añadir al carrito y ver toast
- En Ofertas:
- Ver descuentos dinámicos
- Agregar ofertas al carrito
- En Carrito:
- Ajustar cantidad, eliminar productos
- Aplicar cupón y ver descuento
- Revisar resumen: subtotal, envío, impuestos y total
- Finalizar compra (resetea carrito)

Contribuciones
¡Bienvenidos!
- Haz un fork
- Crea una rama feature/tu-mejora
- Haz commits atómicos
- Abre un pull request

Licencia
MIT © 2025
Licencia MIT
**
