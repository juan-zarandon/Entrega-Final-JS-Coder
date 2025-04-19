// elementos traidos del DOM
const listaDeJuegosDiv = document.getElementById("lista-de-juegos");
const carritoDeComprasDiv = document.getElementById("carrito-de-compras");
const resumenCompraDiv = document.getElementById("resumen-compra");
const iniciarBtn = document.getElementById("iniciarBtn");
const carritoVacioMensaje = document.getElementById("carrito-vacio"); // Referencia al mensaje de carrito vacío

// declaracion de variable dejuegos  disponibles
let juegosDisponibles = [];
// uso de WebStorage API para guardar el carrito
let carritoCompras = cargarCarritoDesdeLocalStorage();

// Asincronismo: uso de fetch API, Promesas (then y catch) y JSON
function cargarJuegos() {
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      juegosDisponibles = data;
      mostrarJuegosDisponibles();
    })
    .catch((error) => {
      console.error("Error al cargar los juegos:", error);
      listaDeJuegosDiv.innerHTML =
        '<p class="error">No se pudieron cargar los juegos.</p>';
    });
}

// Nueva funcion para tomar los datos de los juegos y mostrarlos de forma interactiva
function mostrarJuegosDisponibles() {
  listaDeJuegosDiv.innerHTML = "";
  if (juegosDisponibles.length === 0) {
    listaDeJuegosDiv.innerHTML =
      "<p>No hay juegos disponibles en este momento.</p>";
    return;
  }
  const listaJuegosUL = document.createElement("ul");
  listaJuegosUL.classList.add("lista-juegos");
  juegosDisponibles.forEach((juego) => {
    const juegoLI = document.createElement("li");
    juegoLI.classList.add("juego-item");
    juegoLI.innerHTML = `
      <span>${juego.nombre} - $${juego.precio}</span>
      <button class="agregar-carrito" data-id="${juego.id}">Agregar al carrito</button>
    `;
    listaJuegosUL.appendChild(juegoLI);
  });
  listaDeJuegosDiv.appendChild(listaJuegosUL);
  const botonesAgregar = document.querySelectorAll(".agregar-carrito");
  botonesAgregar.forEach((boton) => {
    boton.addEventListener("click", agregarJuegoAlCarrito);
  });
}

// Funcion para obtener ID del juego y agregra al carrito
function agregarJuegoAlCarrito(event) {
  const juegoId = parseInt(event.target.dataset.id);
  const juegoSeleccionado = juegosDisponibles.find(
    (juego) => juego.id === juegoId
  );

  if (juegoSeleccionado) {
    carritoCompras.push(juegoSeleccionado);
    guardarCarritoEnLocalStorage();
    mostrarCarrito();
    mostrarResumen();
  }
}

// funcion para mostrar los items del carrito o el mensaje de carrito vacío
function mostrarCarrito() {
  carritoDeComprasDiv.innerHTML = "";
  if (carritoCompras.length === 0) {
    carritoDeComprasDiv.innerHTML =
      '<p id="carrito-vacio">Tu carrito está vacío.</p>';
    return;
  }

  const listaCarritoUL = document.createElement("ul");
  listaCarritoUL.classList.add("lista-carrito");

  carritoCompras.forEach((item) => {
    const itemLI = document.createElement("li");
    itemLI.classList.add("carrito-item");
    itemLI.innerHTML = `
      <span>${item.nombre} - $${item.precio}</span>
    `;
    listaCarritoUL.appendChild(itemLI);
  });

  carritoDeComprasDiv.appendChild(listaCarritoUL);
}

// funcion para calcular el subtotal, aplicar descuento y total a pagar
function calcularTotal() {
  let subtotal = 0;
  carritoCompras.forEach((juego) => {
    subtotal += juego.precio;
  });

  let descuento = 0;
  if (carritoCompras.length >= 3) {
    descuento = 0.2;
  } else if (carritoCompras.length === 2) {
    descuento = 0.1;
  }
  // Calculo del descuento y el total a pagar
  const montoDescuento = subtotal * descuento;
  const total = subtotal - montoDescuento;

  return {
    subtotal: subtotal,
    descuento: descuento,
    montoDescuento: montoDescuento,
    total: total,
  };
}

// funcion para mostrar el resumen de la compra
function mostrarResumen() {
  resumenCompraDiv.innerHTML = "";

  if (carritoCompras.length > 0) {
    const resumen = calcularTotal();
    const resumenHTML = `
      <h3>Resumen de tu compra</h3>
      <p>Subtotal: $${resumen.subtotal.toFixed(2)}</p>
      <p>Cantidad de juegos: ${carritoCompras.length}</p>
      ${
        resumen.descuento > 0
          ? `<p>Descuento aplicado: ${
              resumen.descuento * 100
            }% (-$${resumen.montoDescuento.toFixed(2)})</p>`
          : "<p>No se aplicaron descuentos.</p>"
      }
      <h3>Total a pagar: $${resumen.total.toFixed(2)}</h3>
    `;
    resumenCompraDiv.innerHTML = resumenHTML;
  }
}

// funcion para guardar el carrito en localStorage
function guardarCarritoEnLocalStorage() {
  localStorage.setItem("carrito", JSON.stringify(carritoCompras));
}

// funcion para cargar el carrito desde localStorage
function cargarCarritoDesdeLocalStorage() {
  const carritoGuardado = localStorage.getItem("carrito");
  if (carritoGuardado) {
    return JSON.parse(carritoGuardado);
  } else {
    return [];
  }
}

// Funcion para borrar el carrito
function borrarCarrito() {
  carritoCompras = [];
  localStorage.removeItem("carrito");
  mostrarCarrito();
  mostrarResumen();
}

// Inicialización: cargar juegos y mostrar el carrito al cargar la página
cargarJuegos();
mostrarCarrito();
mostrarResumen();

if (iniciarBtn) {
  iniciarBtn.style.display = "none";
}

//boton de finalizacion de compra con Sweet Alert (librerias)
document.addEventListener("DOMContentLoaded", function () {
  const finalizarCompraBtn = document.getElementById("boton-finalizar-compra");

  if (finalizarCompraBtn) {
    finalizarCompraBtn.addEventListener("click", () => {
      Swal.fire({
        title: "¡Compra Finalizada!",
        text: "¿Deseas completar tu compra?",
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Sí, finalizar compra",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          borrarCarrito();
          Swal.fire(
            "¡Compra exitosa!",
            "Tu compra se ha completado.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("Cancelado", "Tu compra ha sido cancelada.", "info");
        }
      });
    });
  } else {
    console.error("No se encontró el botón con el ID 'boton-finalizar-compra'");
  }
});
