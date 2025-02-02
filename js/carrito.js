import { articulos } from "./conexionAPI.js";

const seccionArticulos = document.querySelector(".container-section");
const searchBox = document.querySelector("#search");
const apiUrl = 'https://backgutzy3d.onrender.com/api/actualizar';

// Listar Productos
export async function listarArticulos() {
  const articulosLista = await articulos();
  const articuloDiv = document.createElement("ul");
  articuloDiv.classList.add("product__items"); // Añadir la clase product__items
  articulosLista.forEach((articulo) => {
    const { id, nombre, descripcion, img, precio } = articulo;
    const li = document.createElement("li");
    li.classList.add("card");
    li.id = id;
    li.innerHTML = `
      <img src="${img}" alt="${nombre}">
      <h2>${nombre}</h2>
      <p>${descripcion}</p>
      <p class="price">$${precio}</p>
      <button class="buy-button" type="button">Comprar</button>
    `;
    articuloDiv.appendChild(li);
  });
  seccionArticulos.appendChild(articuloDiv);
}
listarArticulos();

// ----------------------------------------------------------------

const carrito = document.querySelector("#carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito");
const finalizarCompraBtn = document.querySelector("#finalizar-compra");
let articulosCarrito = [];

seccionArticulos.addEventListener("click", (event) => {
  if (event.target.classList.contains("buy-button")) {
    const itemId = event.target.parentNode;
    leerDatosArticulo(itemId);
  }
});

vaciarCarritoBtn.addEventListener("click", () => {
  articulosCarrito = [];
  limpiarHTML();
  document.querySelector("#total").innerHTML = "Total: $0";
});

carrito.addEventListener('click', eliminarArticulo);

async function actualizarStock(id, cantidad) {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, cantidad })
    });
    if (!response.ok) {
      throw new Error('Error al actualizar el stock');
    }
    const result = await response.json();
    console.log(result.message);
  } catch (error) {
    console.error('Error:', error);
  }
}

finalizarCompraBtn.addEventListener("click", async () => {
  if (articulosCarrito.length === 0) {
    alert("El carrito está vacío");
  } else {

    for (const articulo of articulosCarrito) {
      await actualizarStock(articulo.id, articulo.cantidad);
    }

    alert("¡Compra exitosa!");
    articulosCarrito = []; // Vaciar el carrito después de la compra
    limpiarHTML();
    document.querySelector("#total").innerHTML = "Total: $0";
  }
});

function eliminarArticulo(e) {
  if (e.target.classList.contains("borrar-curso")) {
    const articuloId = e.target.getAttribute("data-id");
    articulosCarrito = articulosCarrito.filter((articulo) => articulo.id !== articuloId);
    carritoHTML(); 
  }
}

function leerDatosArticulo(articulo) {
  const infoArticulo = {
    id: articulo.id,
    imagen: articulo.querySelector("img").src,
    nombre: articulo.querySelector("h2").textContent,
    descripcion: articulo.querySelector("p").textContent,
    precio: parseFloat(articulo.querySelector(".price").textContent.replace('$', '')),
    cantidad: 1,
  };

  const existe = articulosCarrito.some(
    (articulo) => articulo.id === infoArticulo.id
  );
  if (existe) {
    articulosCarrito.forEach((articulo) => {
      if (articulo.id === infoArticulo.id) {
        articulo.cantidad++;
      }
    });
  } else {
    articulosCarrito.push(infoArticulo);
  }

  const total = articulosCarrito.reduce((acc, item) => acc + item.cantidad * parseFloat(item.precio), 0); 
  carritoHTML();
  document.querySelector("#total").innerHTML = `Total: $${total}`;
}

function carritoHTML() {
  limpiarHTML();
  articulosCarrito.forEach((articulo) => {
    const { id, nombre, imagen, precio, cantidad } = articulo;
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>
        <img src="${imagen}" width=100>
      </td>
      <td>${nombre}</td>
      <td>${precio}</td>
      <td>${cantidad}</td>
      <td>
        <button class="borrar-curso" data-id="${id}">X</button>
      </td>
    `;
    contenedorCarrito.appendChild(row);
  });
}

function limpiarHTML() {
  while (contenedorCarrito.firstChild) {
    contenedorCarrito.removeChild(contenedorCarrito.firstChild);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // Verificar el estado de sesión al cargar la página de login
  ajustarVisibilidadBotones();
});

function ajustarVisibilidadBotones() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const btnLogin = document.querySelector(".nav-menu-login");

  if (isLoggedIn && btnLogin) {
      // Ocultar botón de login si el usuario está autenticado
      btnLogin.style.display = "none";
  }
}

searchBox.addEventListener("input", async () => {
  const articulosLista = await articulos();
  const searchTerm = searchBox.value.toLowerCase();
  const filteredArticulos = articulosLista.filter((articulo) =>
    articulo.nombre.toLowerCase().includes(searchTerm) || articulo.descripcion.toLowerCase().includes(searchTerm)
  );
  mostrarArticulos(filteredArticulos);
});

function mostrarArticulos(articulosLista) {
  seccionArticulos.innerHTML = ""; // Limpiar la sección antes de mostrar los productos
  const articuloDiv = document.createElement("ul");
  articuloDiv.classList.add("product__items");
  articulosLista.forEach((articulo) => {
    const { id, nombre, descripcion, img, precio } = articulo;
    const li = document.createElement("li");
    li.classList.add("card");
    li.id = id;
    li.innerHTML = `
      <img src="${img}" alt="${nombre}">
      <h2>${nombre}</h2>
      <p>${descripcion}</p>
      <p class="price">$${precio}</p>
      <button class="buy-button" type="button">Comprar</button>
    `;
    articuloDiv.appendChild(li);
  });
  seccionArticulos.appendChild(articuloDiv);
}

