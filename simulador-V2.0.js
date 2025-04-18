function Juego(nombre, precio) {
  this.nombre = nombre;
  this.precio = precio;
}

const juegosDisponibles = [
  new Juego("FIFA 23", 60),
  new Juego("God of War", 70),
  new Juego("Minecraft", 30),
  new Juego("Call of Duty", 65),
  new Juego("Mario Kart", 50),
];

let carritoCompras = cargarCarritoDesdeLocalStorage();
function iniciarSimulador() {
  const nombreUsuario = prompt(
    "Bienvenido a la tienda de videojuegos. ¿Cuál es tu nombre?"
  );
  if (nombreUsuario === null || nombreUsuario === "") {
    alert("Necesitas ingresar un nombre para continuar.");
    return;
  }
  alert(
    "¡Hola " +
      nombreUsuario +
      "! Vamos a ayudarte con tu compra de videojuegos."
  );
  const quiereVerJuegos = confirm(
    "¿Deseas ver la lista de juegos disponibles?"
  );
  if (quiereVerJuegos) {
    mostrarJuegosDisponibles();
  }
  procesarCompra(nombreUsuario);
}

function mostrarJuegosDisponibles() {
  let listaJuegos = "Juegos disponibles:\n\n";
  for (let i = 0; i < juegosDisponibles.length; i++) {
    listaJuegos +=
      i +
      1 +
      ". " +
      juegosDisponibles[i].nombre +
      " - $" +
      juegosDisponibles[i].precio +
      "\n";
  }
  alert(listaJuegos);
}

function procesarCompra(nombreUsuario) {
  let seguirComprando = true;
  while (seguirComprando) {
    let listaJuegos = "Selecciona un juego (ingresa el número):\n\n";
    for (let i = 0; i < juegosDisponibles.length; i++) {
      listaJuegos +=
        i +
        1 +
        ". " +
        juegosDisponibles[i].nombre +
        " - $" +
        juegosDisponibles[i].precio +
        "\n";
    }
    const seleccion = prompt(listaJuegos);
    const numeroSeleccion = parseInt(seleccion);
    if (numeroSeleccion >= 1 && numeroSeleccion <= juegosDisponibles.length) {
      const juegoSeleccionado = juegosDisponibles[numeroSeleccion - 1];
      carritoCompras.push(juegoSeleccionado);
      guardarCarritoEnLocalStorage();
      alert("¡Agregaste " + juegoSeleccionado.nombre + " a tu carrito!");
    } else {
      alert("Selección no válida. Por favor intenta de nuevo.");
    }
    seguirComprando = confirm("¿Deseas agregar otro juego al carrito?");
  }
  calcularTotal(nombreUsuario);
}

function calcularTotal(nombreUsuario) {
  if (carritoCompras.length === 0) {
    alert("No has agregado ningún juego al carrito.");
    return;
  }
  let subtotal = 0;
  let resumenCompra = "Resumen de tu compra:\n\n";
  for (let i = 0; i < carritoCompras.length; i++) {
    subtotal += carritoCompras[i].precio;
    resumenCompra +=
      "- " +
      carritoCompras[i].nombre +
      " - $" +
      carritoCompras[i].precio +
      "\n";
  }
  let descuento = 0;
  if (carritoCompras.length >= 3) {
    descuento = 0.2;
  } else if (carritoCompras.length === 2) {
    descuento = 0.1;
  }

  const montoDescuento = subtotal * descuento;
  const total = subtotal - montoDescuento;

  resumenCompra += "\nSubtotal: $" + subtotal.toFixed(2);
  resumenCompra += "\nCantidad de juegos: " + carritoCompras.length;
  if (descuento > 0) {
    resumenCompra += "\nDescuento aplicado: " + descuento * 100 + "%";
    resumenCompra += "\nMonto de descuento: $" + montoDescuento.toFixed(2);
  } else {
    resumenCompra += "\nNo se aplicaron descuentos.";
  }
  resumenCompra += "\nTotal a pagar: $" + total.toFixed(2);
  alert(resumenCompra);
  console.log("===== RESUMEN DE COMPRA =====");
  console.log("Cliente: " + nombreUsuario);
  console.log(resumenCompra);
  const mensaje =
    "¡Gracias por tu compra, " + nombreUsuario + "! Vuelve pronto.";
  const mensajeConfirmacionElement = document.getElementById(
    "mensaje-confirmacion"
  );
  mensajeConfirmacionElement.textContent = mensaje;
}

function guardarCarritoEnLocalStorage() {
  localStorage.setItem("carrito", JSON.stringify(carritoCompras));
}

function cargarCarritoDesdeLocalStorage() {
  const carritoGuardado = localStorage.getItem("carrito");
  if (carritoGuardado) {
    return JSON.parse(carritoGuardado);
  } else {
    return [];
  }
}

document
  .getElementById("iniciarBtn")
  .addEventListener("click", iniciarSimulador);

console.log("Simulador de Tienda de Videojuegos cargado correctamente.");
