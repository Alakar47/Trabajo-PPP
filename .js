// 1. CARRUSEL DE LA GALERÍA
let galeriaFotos = [
    "img/taller-1.svg",
    "img/taller-2.svg",
    "img/taller-3.svg"
];

let indiceActual = 0;
let autoplayTimer;
const track = document.getElementById("carousel-track");
const dotsContainer = document.getElementById("carousel-dots");
const btnPrev = document.getElementById("carousel-prev");
const btnNext = document.getElementById("carousel-next");

function crearDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = "";
    galeriaFotos.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.className = "carousel-dot" + (i === 0 ? " active" : "");
        dot.setAttribute("aria-label", "Ir a foto " + (i + 1));
        dot.addEventListener("click", function() {
            irASlide(i);
            reiniciarAutoplay();
        });
        dotsContainer.appendChild(dot);
    });
}

function renderizarCarrusel() {
    if (!track) return;
    track.style.transform = "translateX(-" + (indiceActual * 100) + "%)";
    document.querySelectorAll(".carousel-slide").forEach(function(s, i) {
        s.classList.toggle("active", i === indiceActual);
    });
    document.querySelectorAll(".carousel-dot").forEach(function(d, i) {
        d.classList.toggle("active", i === indiceActual);
    });
}

function irASlide(i) {
    indiceActual = (i + galeriaFotos.length) % galeriaFotos.length;
    renderizarCarrusel();
}

function iniciarAutoplay() {
    autoplayTimer = setInterval(function() {
        irASlide(indiceActual + 1);
    }, 4000);
}

function reiniciarAutoplay() {
    clearInterval(autoplayTimer);
    iniciarAutoplay();
}

if (btnPrev) btnPrev.addEventListener("click", function() {
    irASlide(indiceActual - 1);
    reiniciarAutoplay();
});

if (btnNext) btnNext.addEventListener("click", function() {
    irASlide(indiceActual + 1);
    reiniciarAutoplay();
});

if (track) {
    track.addEventListener("mouseenter", function() { clearInterval(autoplayTimer); });
    track.addEventListener("mouseleave", function() { iniciarAutoplay(); });
}

crearDots();
renderizarCarrusel();
iniciarAutoplay();


// 2. PRODUCTOS INICIALES (Catálogo del taller - 12 productos)
let productosIniciales = [
    { nombre: "Aceite Castrol Actevo 4T 20W-50", precio: 18000, imagen: "img/prod-1.svg" },
    { nombre: "Aceite Motul 5100 4T Semisintético 1L", precio: 35000, imagen: "img/prod-2.svg" },
    { nombre: "Aceite Yamalube 2T 1 litro", precio: 15000, imagen: "img/prod-3.svg" },
    { nombre: "Bujía NGK C7HSA", precio: 8000, imagen: "img/prod-4.svg" },
    { nombre: "Filtro de aceite para moto", precio: 14000, imagen: "img/prod-5.svg" },
    { nombre: "Lubricante para cadena de moto", precio: 25000, imagen: "img/prod-6.svg" },
    { nombre: "Grasa lubricante para cadena Penetrit", precio: 10000, imagen: "img/prod-7.svg" },
    { nombre: "Limpiador de cadena para moto (aerosol)", precio: 15000, imagen: "img/prod-8.svg" },
    { nombre: "Líquido de frenos DOT 4", precio: 18000, imagen: "img/prod-9.svg" },
    { nombre: "Pastillas de freno para moto", precio: 30000, imagen: "img/prod-10.svg" },
    { nombre: "Filtro de nafta universal", precio: 5000, imagen: "img/prod-11.svg" },
    { nombre: "Cámara de aire para moto rodado 18", precio: 13000, imagen: "img/prod-12.svg" }
];

let productos = JSON.parse(localStorage.getItem("mis_productos_grilla")) || productosIniciales;

function mostrarProductos() {
    let contenedor = document.getElementById("lista-productos");
    let listaAdmin = document.getElementById("lista-admin");
    if (!contenedor) return;

    contenedor.innerHTML = "";
    if (listaAdmin) listaAdmin.innerHTML = "";

    for (let i = 0; i < productos.length; i++) {
        let item = productos[i];

        // Dibuja los cuadros en la grilla del catálogo (3 columnas)
        contenedor.innerHTML += `
            <div class="product-card">
                <div class="product-img">
                    <img src="${item.imagen}" alt="${item.nombre}" onerror="this.style.opacity='0.2'">
                    
                </div>
                <div class="product-info">
                    <h3>${item.nombre}</h3>
                    <span class="precio">$${item.precio}</span>
                </div>
            </div>
        `;

        // Listado para eliminar en el Admin
        if (listaAdmin) {
            listaAdmin.innerHTML += `
                <li>
                    <span>${item.nombre} <small>($${item.precio})</small></span>
                    <button class="btn-borrar" onclick="quitarProducto(${i})">Eliminar</button>
                </li>
            `;
        }
    }
}

function quitarProducto(posicion) {
    if (!confirm("¿Eliminar este producto del catálogo?")) return;
    productos.splice(posicion, 1);
    localStorage.setItem("mis_productos_grilla", JSON.stringify(productos));
    mostrarProductos();
}

// Agregar producto nuevo
document.getElementById("form-agregar").addEventListener("submit", function(e) {
    e.preventDefault();
    let nombre = document.getElementById("nuevo-nombre").value;
    let precio = document.getElementById("nuevo-precio").value;
    let imagen = document.getElementById("nueva-imagen").value;

    productos.push({ nombre: nombre, precio: precio, imagen: imagen });
    localStorage.setItem("mis_productos_grilla", JSON.stringify(productos));

    mostrarProductos();
    this.reset();
    alert("¡Producto agregado al catálogo!");
});

// Vaciar todo el catálogo
document.getElementById("btn-vaciar-catalogo").addEventListener("click", function() {
    if (!confirm("¿Vaciar todo el catálogo de productos? Esta acción no se puede deshacer.")) return;
    productos = [];
    localStorage.removeItem("mis_productos_grilla");
    mostrarProductos();
    alert("Catálogo vaciado.");
});


// 3. ABRIR Y CERRAR EL PANEL DE ADMINISTRACIÓN
document.getElementById("btn-admin").addEventListener("click", function(e) {
    e.preventDefault();
    mostrarProductos();
    document.getElementById("ventana-admin").style.display = "flex";
});

document.getElementById("cerrar-admin").addEventListener("click", function() {
    document.getElementById("ventana-admin").style.display = "none";
});


// 4. FORMULARIO DE TURNOS
document.getElementById("form-turno").addEventListener("submit", function(e) {
    e.preventDefault();
    document.getElementById("mensaje-turno").style.display = "block";
    this.reset();
});

// Inicializar la página cargando carrusel y productos
mostrarProductos();
