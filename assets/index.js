// Contenedor de productos
const products = document.querySelector(".products-container");
const productsCart = document.querySelector(".cart-container");
const total = document.querySelector(".total");
const categories = document.querySelector(".categories");
// un html collection de todas las categorias
const categoriesList = document.querySelectorAll(".category");
const btnLoad = document.querySelector(".btn-load");
const buyBtn = document.querySelector(".btn-buy");
const cartBtn = document.querySelector(".cart-label");
const barsBtn = document.querySelector(".menu-label");
const cartMenu = document.querySelector(".cart");
const barsMenu = document.querySelector(".navbar-list");
const overlay = document.querySelector(".overlay");
// BOTON DE VACIAR CARRITO
const deleteBtn = document.querySelector(".btn-delete");
// SELECTOR DEL MODAL
// MENSAJE INFORMATIVO
const successModal = document.querySelector(".add-modal");

// Setear el array para el carro
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Funcion para guardar en el localStorage
const saveLocalStorage = (cartList) => {
  localStorage.setItem("cart", JSON.stringify(cartList));
};

// Funcion para retornar el html a renderizar
const renderProduct = (product) => {
  const { id, name, price, cardImg, freeShippingImg, freeShippingText } =
    product;
  return `
    <div class="product">
    <img src=${cardImg} alt=${name} class="product-img" />
    <div class="product-info">
        <!-- top -->
        <div class="product-top">
            <h3>${name}</h3>
            <p>Precio</p>
        </div>

        <!-- mid -->
        <div class="product-mid">
            <div class="product-user">
                <img src=${freeShippingImg} alt="user" />
                <p>${freeShippingText}</p>
            </div>
            <span>$ ${price} </span>
        </div>

                <!-- bot -->
        <div class="product-bot">
            <div class="product-offer">
                <div class="offer-time">
        
                </div>
                <button class="btn-add"
                data-id='${id}'
                data-name='${name}'
                data-bid='${price}'
                data-img='${cardImg}'>Agregar</button>
            </div>
        </div>


    </div>
</div>`;
};
// Funcion para renderizar los productos divididos.
// Recibe uin index, si no recibe nada por defecto va a ser 0
// Si el index es 0  renderiza el primer array del data
const renderDividedProducts = (index = 0) => {
  products.innerHTML += productsController.dividedProducts[index]
    .map(renderProduct)
    .join("");
};

const renderFilteredProducts = (category) => {
  const productList = productsData.filter(
    // TIENE QUE SER IGUAL A LA CATEGORIA CLICKEADA.
    (product) => product.category === category
  );

  products.innerHTML = productList.map(renderProduct).join("");
};

// Funcion para renderizar los productos
// Recibe un index, si no le pasamos nada por default va a ser 0 y una categoria, si no le pasamos nada por default va a ser undefined
// Si no hay categoria renderizame los productos del array dividido.
// Si hay categoria ejecuta renderFilteredProducts
const renderProducts = (index = 0, category = undefined) => {
  if (!category) {
    renderDividedProducts(index);
    return;
  }
  renderFilteredProducts(category);
};

// Logica de filtros
// si no tenes categoria, remover clase de hidden y sino ocultarlo
const changeShowMoreBtnState = (category) => {
  if (!category) {
    btnLoad.classList.remove("hidden");
    return;
  }
  btnLoad.classList.add("hidden");
};

// le pasamos la categoria selecionada
const changeBtnActiveState = (selectedCategory) => {
  // foreach metodo de array- hay que convertirlo
  const categories = [...categoriesList];
  categories.forEach((categoryBtn) => {
    // si no es igual a la categoria que le estamos pasando, le sacamos la clase y retornamos y sino lo volvemos a pintar
    if (categoryBtn.dataset.category !== selectedCategory) {
      categoryBtn.classList.remove("active");
      return;
    }
    categoryBtn.classList.add("active");
  });
};

//GUARDAMOS EN UNA VARIABLE LA CATEGORIA SELECCIONADA
const changeFilterState = (e) => {
  const selectedCategory = e.target.dataset.category;
  changeBtnActiveState(selectedCategory);
  changeShowMoreBtnState(selectedCategory);
};

// Funcion para aplicar el filtro por categorias
//SI NO CONTIENE CATEGORIA - RETORNA. SINO EJECUTA UNA FUNCION
const aplicarFiltroCateg = (e) => {
  if (!e.target.classList.contains("category")) return;
  changeFilterState(e);
  if (!e.target.dataset.category) {
    products.innerHTML = "";
    renderProducts();
  } else {
    // LE PASAMOS UN INDICE - OSEA QUE RENDERICE APARTIR DEL INDICE 0.
    renderProducts(0, e.target.dataset.category);
    // cuando apriete en cualquier otro filtro que vuelva a ser uno.
    productsController.nextProductsIndex = 1;
  }
};

// Funcion que checkee si estamos en el ultimo array del array de productos divididos
const isLastIndexOf = () =>
  productsController.nextProductsIndex === productsController.productsLimit;

// Funcion para cargar mas productos
// renderiza los proximos productos(Boton Ver mas)
const MostrarMasProductos = () => {
  renderProducts(productsController.nextProductsIndex);
  productsController.nextProductsIndex++;
  // si estamos en el final ocultamos el boton
  if (isLastIndexOf()) {
    btnLoad.classList.add("hidden");
  }
};

// Menu Interface
// Logica para abrir y cerrar el carrito/menu y mostrar el overlay
const toggleMenu = () => {
  barsMenu.classList.toggle("open-menu");
  if (cartMenu.classList.contains("open-cart")) {
    cartMenu.classList.remove("open-cart");
    return;
  }
  overlay.classList.toggle("show-overlay");
};

const toggleCart = () => {
  cartMenu.classList.toggle("open-cart");
  if (barsMenu.classList.contains("open-menu")) {
    barsMenu.classList.remove("open-menu");
    return;
  }
  overlay.classList.toggle("show-overlay");
};

// Funcion para cerrar menu y carrito si scrolleamos
const closeOnScroll = () => {
  if (
    !barsMenu.classList.contains("open-menu") &&
    !cartMenu.classList.contains("open-cart")
  )
    return;

  barsMenu.classList.remove("open-menu");
  cartMenu.classList.remove("open-cart");
  overlay.classList.remove("show-overlay");
};

// si el target no tiene la clase navlink- no hagas nada, retorna.
const closeOnClick = (e) => {
  if (!e.target.classList.contains("navbar-link")) return;
  barsMenu.classList.remove("open-menu");
  overlay.classList.remove("show-overlay");
};

// cerrar los menus

const closeOnOverlayClick = () => {
  barsMenu.classList.remove("open-menu");
  cartMenu.classList.remove("open-cart");
  overlay.classList.remove("show-overlay");
};

// logica render carrito

const renderCartProduct = (cartProduct) => {
  const { id, name, bid, img, quantity } = cartProduct;
  return `
  <div class="cart-item">
    <img src=${img} alt="Beer House" />
    <div class="item-info">
      <h3 class="item-title">${name}</h3>
      <p class="item-bid">Precio</p>
      <span class="item-price">$${bid}</span>
    </div>
    <div class="item-handler">
      <span class="quantity-handler down" data-id=${id}>-</span>
      <span class="item-quantity">${quantity}</span>
      <span class="quantity-handler up" data-id=${id}>+</span>
    </div>
  </div>
  `;
};

// si el carrito esta vacio, le cambiamos el inner html. no hay productos en el carrito

const renderCart = () => {
  if (!cart.length) {
    productsCart.innerHTML = `<p class="empty-msg">No hay productos en el carrito</p>`;
    return;
  }
  productsCart.innerHTML = cart.map(renderCartProduct).join("");
};

const getCartTotal = () => {
  return cart.reduce((acc, cur) => acc + Number(cur.bid) * cur.quantity, 0);
};

const MostrarTotalCart = () => {
  // tofixed - limitar decimales seleccionados
  total.innerHTML = `${getCartTotal().toFixed(2)} `;
};

// SE HACE EL MISMO METODO YA QUE AMBOS CUMPLEN LA MISMA FUNCION
const disableBtn = (btn) => {
  if (!cart.length) {
    btn.classList.add("disabled");
  } else {
    btn.classList.remove("disabled");
  }
};

const createProductData = (id, name, bid, img) => {
  return { id, name, bid, img };
};

// le pasamos un producto, si hay un item igual al id del producto que ya tenemos sumalo y sino undefin
const isExistingCartProduct = (product) => {
  return cart.find((item) => item.id === product.id);
};

//Recorremos el carrito y cuando encuentra el producto el cual agregamos, sumamos una unidad.
// ! POR SEGUNDA VEZ
const addUnitToProduct = (product) => {
  cart = cart.map((cartProduct) => {
    // funcion ternaria - si hay existente suma y sino no modifica el producto-
    return cartProduct.id === product.id
      ? { ...cartProduct, quantity: cartProduct.quantity + 1 }
      : cartProduct;
  });
};

// si el producto no existe lo creamos(modifcamos el carrito expred, copia del carrito que ya tenia con un objeto nuevo, a su vez copia el producto que teniamos como parametro y le agregamos una nueva porpiedad quantity)
const createCartProduct = (product) => {
  cart = [...cart, { ...product, quantity: 1 }];
};

// le pasamos msj como parametro - cuando muestro le agregamos active-modal(CSS)
// textConten - le pasamos el mensaje a mostrar y le damos settimeout con un determinado tiempo
const showSuccessModal = (msg) => {
  successModal.classList.add("active-modal");
  successModal.textContent = msg;
  setTimeout(() => {
    successModal.classList.remove("active-modal");
  }, 1500);
};

// ACTUALIZAR EL LOCAl - RENDER DE CARRITO - TOTAL - AMBOS BOTONES.
const checkCartState = () => {
  saveLocalStorage(cart);
  renderCart(cart);
  MostrarTotalCart(cart);
  disableBtn(buyBtn);
  disableBtn(deleteBtn);
};

const agregarProduct = (e) => {
  // SI NO CONTIENE LA CLASE BTN ADD_ RETONA SIN HACER
  if (!e.target.classList.contains("btn-add")) return;
  const { id, name, bid, img } = e.target.dataset;
  const product = createProductData(id, name, bid, img);

  if (isExistingCartProduct(product)) {
    // Añadir una unidad // si existe
    addUnitToProduct(product);
    //Mostrar el modal de que se agrego una unidad
    showSuccessModal("Se agregó una unidad del producto al carrito");
  } else {
    //Crear el producto
    createCartProduct(product);
    //Mostrar el modal de que se agrego el producto
    showSuccessModal("El producto se ha agregado al carrito");
  }
  checkCartState();
};

// ! filtra todos los productos cuyo id sea distinto al que tenemos
const removeProductFromCart = (existingProduct) => {
  cart = cart.filter((product) => product.id !== existingProduct.id);
  checkCartState();
};

// sacarle una unidad a un producto
const substractProductUnit = (existingProduct) => {
  cart = cart.map((product) => {
    return product.id === existingProduct.id
      ? { ...product, quantity: Number(product.quantity) - 1 }
      : product;
  });
};

const handleMinusBtnEvent = (id) => {
  const existingCartProduct = cart.find((item) => item.id === id);

  // si la cantidad es igual a 1
  if (existingCartProduct.quantity === 1) {
    if (window.confirm("Desea eliminar el producto del carro")) {
      // borrar producto
      removeProductFromCart(existingCartProduct);
    }
    return;
  }
  // Restar uno al producto existente
  substractProductUnit(existingCartProduct);
};

// buscamos el prodcuto en el carrito cuyo id sea igual que dataid.
const handlePlusBtnEvent = (id) => {
  const existingCartProduct = cart.find((item) => item.id === id);
  addUnitToProduct(existingCartProduct);
};

const handleQuantity = (e) => {
  // si contiene down/up que lo definimos en renderCart
  if (e.target.classList.contains("down")) {
    handleMinusBtnEvent(e.target.dataset.id);
  } else if (e.target.classList.contains("up")) {
    handlePlusBtnEvent(e.target.dataset.id);
  }
  checkCartState();
};

//VACIAR EL CARRITO // LIMPIAR
const resetCartItems = () => {
  cart = [];
  checkCartState();
};

const completeCartAction = (confirmMsg, successMsg) => {
  // si esta vacio retorna directamente
  if (!cart.length) return;
  if (window.confirm(confirmMsg)) {
    resetCartItems();
    alert(successMsg);
  }
};

const completeBuy = () => {
  // primer mensaje de confirmmsg parametro
  completeCartAction("¿Desea completar su compra?", "¡Gracias por su compra!");
};

const deleteCart = () => {
  // srgundo mensaje successMsg
  completeCartAction(
    "¿Desea vaciar el carrito?",
    "No hay productos en el carrito"
  );
};

// Funcion inicializadora
const init = () => {
  renderProducts();
  categories.addEventListener("click", aplicarFiltroCateg);
  btnLoad.addEventListener("click", MostrarMasProductos);
  cartBtn.addEventListener("click", toggleCart);
  barsBtn.addEventListener("click", toggleMenu);
  window.addEventListener("scroll", closeOnScroll);
  barsMenu.addEventListener("click", closeOnClick);
  overlay.addEventListener("click", closeOnOverlayClick);
  // CON EL DOM ASEGURAMOS QUE ESTE TODO CARGADO Y AL FINAL RENDERIZAMOS EL CARRITO Y EL TOTAL
  document.addEventListener("DOMContentLoaded", renderCart);
  document.addEventListener("DOMContentLoaded", MostrarTotalCart);
  products.addEventListener("click", agregarProduct);
  productsCart.addEventListener("click", handleQuantity);
  disableBtn(deleteBtn);
  disableBtn(buyBtn);
  buyBtn.addEventListener("click", completeBuy);
  deleteBtn.addEventListener("click", deleteCart);
};

init();
