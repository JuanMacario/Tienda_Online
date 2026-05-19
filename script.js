import { productos } from "./images/productos.js"; //para importar el array de los productos de productos.js
import { carrito } from "./images/productos.js";

const botones = document.getElementById("menu-responsive") //para ver la accion que se realizen en los botones de navegacion en la parte superior
const cajasArticulos = document.getElementById("articulosConsolas")
const numeroCarrito = document.getElementById("numero")
const visualizarCarrito = document.getElementById("carritoCompra")
const verCarrito = document.getElementById('ventanaCarrito')
const cerrarCarro = document.getElementById('cerrarCarrito')
const articulosCarrito = document.getElementById('misCompras')
const sumaPrecios = document.getElementById('seccionTotal')
const menuToggle = document.getElementById('menu-toggle');
const menuResponsive = document.getElementById('menu-responsive');

let contador = 0

dibujarArticulos(productos, "consolas")

function dibujarArticulos(productos, articulo) {
    let moldeHTML = ``;

    let articuloFiltrar = articulo === 'todos'
        ? productos
        : productos.filter((producto) => producto.categoria == articulo);

    for (let elemento of articuloFiltrar) {
        moldeHTML += `
         <article class="articuloConsolas">
            <div class="cajaImagen">
                <img src="${elemento.img}" class="imagenPortada">
            </div>
            <div class="cajaTitulo">
                <p class="precio"><strong> Q. ${elemento.precio}.00 </strong></p>
                <h3 class="titulo">${elemento.nombre}</h3>
            </div>
            <div class="cajaDescripcion">
                <p class="descripcionArticulo"> ${elemento.descripcion}</p>
            </div>
            <button data-id="${elemento.id}" class="botonAgregar">AGREGAR AL CARRITO</button>
        </article>
      `;
    }

    cajasArticulos.innerHTML = moldeHTML;
}


function agregarCarrito(idArticulo, listaProductos) {
    let stringId = idArticulo.toString()
    let cantidadCarrito = carrito.length

    for (let articulo of listaProductos) { //buscar el articulo entre el array de todos los articulos

        if (articulo.id == stringId) { //encontrar articulo

            if (articulo.cantidad >= 1) { //validar que el producto este disponible

                if (carrito.length == 0) { //ver si el array del carrito esta vacio
                    let objetoComprar = {
                        id: articulo.id,
                        nombre: articulo.nombre,
                        precio: articulo.precio,
                        precioTotal: articulo.precio,
                        img: articulo.img,
                        aComprar: 1
                    }
                    carrito.push(objetoComprar)

                    dibujarCarrito(carrito)
                    sumaTotal(carrito)
                } else {

                    for (let i = 0; i < cantidadCarrito; i++) {
                        let producto = carrito[i]

                        if (stringId == producto.id) {
                            producto.aComprar += 1
                            producto.precioTotal += articulo.precio

                            break;
                        } else if (i + 1 == cantidadCarrito) {
                            let objetoComprar = {
                                id: articulo.id,
                                nombre: articulo.nombre,
                                precio: articulo.precio,
                                precioTotal: articulo.precio,
                                img: articulo.img,
                                aComprar: 1
                            }
                            carrito.push(objetoComprar)
                            break;
                        }
                    }
                    dibujarCarrito(carrito)
                    sumaTotal(carrito)
                }
                contador++
                let modelo = `
                <p class="cantidad">${contador}</p>`

                numeroCarrito.innerHTML += modelo

                articulo.cantidad = articulo.cantidad - 1

                if (articulo.cantidad == 0) {
                    articulo.estado = "No disponible"
                }
                dibujarCajas(listaProductos)
                break;
            } else {
                break;
            }
        }

    };
}

function dibujarCarrito(lista) {
    articulosCarrito.innerHTML = ''
    sumaPrecios.innerHTML = ''

    for (let articulo of lista) {
        let molde = `<article class="cajaCarrito">
                            <h3>${articulo.nombre}</h3>
                        <div class="contenidoCaja">
                            <img src="${articulo.img}">
                            <section class="DescripcionCarrito">
                                <p> <strong> Cantidad: </strong> ${articulo.aComprar}  </p>
                                <p> <strong> Precio Individual: </strong> Q. ${articulo.precio}.00</p> 
                                <p> <strong> Precio Total: </strong> Q. ${articulo.precioTotal}.00 </p>
                                <button data-id="${articulo.id}">Quitar Producto</button>
                            </section>
                        </div>
                    </article>`

        articulosCarrito.innerHTML += molde
    }
}

function quitarProductos(idArticulo, carrito, listaInventario) {
    let idString = idArticulo.toString()
    let indice = 0
    let indiceInventario = 0

    indice = carrito.findIndex(articulo => articulo.id == idString)
    indiceInventario = listaInventario.findIndex(articulo => articulo.id == idString)
    listaInventario[indiceInventario].cantidad += carrito[indice].aComprar
    carrito.splice(indice, 1)
    listaInventario[indiceInventario].estado = 'disponible'

    dibujarCajas(listaInventario)
    dibujarCarrito(carrito)
    sumaTotal(carrito)

    contador = contador - indiceInventario[indiceInventario].aComprar
    let modelo = `
        <p class="cantidad">${contador}</p>`

    numeroCarrito.innerHTML += modelo
}

function sumaTotal(carrito) {
    let suma = 0

    let modelo = ''
    for (let articulo of carrito) {
        suma += articulo.precioTotal
    }
    modelo = `<p>Total a pagar: Q. ${suma}.00</p> `

    sumaPrecios.innerHTML += modelo
}

botones.addEventListener("click", (e) => { //esto es para que cuando se haga clic en uno de los botones de navegacion se pueda validar que boton se toco

    if (e.target.tagName === 'BUTTON') { //esto es solo para validar que realmente se este tocando el boton 
        const categoriaSelecciona = e.target.getAttribute("data-categoria")

        filtrarArticulos(categoriaSelecciona) //aqui se llama la funcion dependiendo la categoria que se quiera visualizar 
    }
})


visualizarCarrito.addEventListener("click", () => {
    verCarrito.classList.remove('desactivo')
    verCarrito.classList.add('activo')
})

cerrarCarro.addEventListener('click', () => {
    verCarrito.classList.remove('activo')
    verCarrito.classList.add('desactivo')
})

articulosCarrito.addEventListener('click', (evento) => {
    if (evento.target.tagName === 'BUTTON') {
        const quitarArticulo = evento.target.getAttribute("data-id")
        quitarProductos(quitarArticulo, carrito, productos)
    }
});


menuToggle.addEventListener('click', () => {
    menuResponsive.classList.toggle('is-open');
});