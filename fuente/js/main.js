$(document).ready(function() {
    let lista = $("#lista");
    let tabla = $('#tabla');
    let asc = $('#asc');
    let desc = $('#desc');
    let titulo = $('#titulo');
    let botones = $('#botones');
    let cerrarSesion = $('#cerrar_sesion');
    let vista = "lista";
    let tipoOrden = "RAND";
    let contenedor = $('#gatos');
    var tablaGatos = $("<table>").addClass("tabla-gatos");
    let cuerpo = $("<tbody>");
    let ul = $("<ul>").addClass("lista-gatos");
    let masGatos = false;

    let datosGatosGlobal = [];

    //Obtener los datos iniciales y guardarlos en un array
    function obtenerYAlmacenarDatosGatos() {
        obtenerDatosGatos().then(function(datosGatos) {
            datosGatosGlobal = datosGatos;
            renderizarLista(datosGatosGlobal); //renderizar la lista por defecto
        });
    }

    //Evento que cambia la vista de los gatos a lista
    lista.click(() => {
        vista = "lista";
        if (tipoOrden === "ASC") {
            renderizarLista(datosGatosGlobal.sort((a, b) => a[0].breeds[0].name.localeCompare(b[0].breeds[0].name)));
        } else if (tipoOrden === "DESC") {
            renderizarLista(datosGatosGlobal.sort((a, b) => b[0].breeds[0].name.localeCompare(a[0].breeds[0].name)));
        } else {
            renderizarLista(datosGatosGlobal);
        }
    });

    //Evento que cambia la vista de los gatos a tabla
    tabla.click(() => {
        vista = "tabla";
        if (tipoOrden === "ASC") {
            renderizarTabla(datosGatosGlobal.sort((a, b) => a[0].breeds[0].name.localeCompare(b[0].breeds[0].name)));
        } else if (tipoOrden === "DESC") {
            renderizarTabla(datosGatosGlobal.sort((a, b) => b[0].breeds[0].name.localeCompare(a[0].breeds[0].name)));
        } else {
            renderizarTabla(datosGatosGlobal);
        }
    });

    // Eventos para ordenar los gatos ascendente o descendentemente
    asc.click(() => {
        tipoOrden = "ASC";
        if (vista == "lista") {
            ul.empty();
            renderizarLista(datosGatosGlobal.sort((a, b) => a[0].breeds[0].name.localeCompare(b[0].breeds[0].name)));
        } else {
            cuerpo.empty();
            renderizarTabla(datosGatosGlobal.sort((a, b) => a[0].breeds[0].name.localeCompare(b[0].breeds[0].name)));
        }
    });

    desc.click(() => {
        tipoOrden = "DESC";
        if (vista == "lista") {
            ul.empty();
            renderizarLista(datosGatosGlobal.sort((a, b) => b[0].breeds[0].name.localeCompare(a[0].breeds[0].name)));
        } else {
            cuerpo.empty();
            renderizarTabla(datosGatosGlobal.sort((a, b) => b[0].breeds[0].name.localeCompare(a[0].breeds[0].name)));
        }
    });
    
    

    cerrarSesion.click((evento) => {
        evento.preventDefault();
    
        // Obtener la sesión actual del usuario
        let sesionIniciada = JSON.parse(localStorage.getItem('sesion_iniciada_gatos'));
    
        if (sesionIniciada) {
            // Obtener el nombre de usuario
            let nombreUsuario = sesionIniciada.nombreUsuario;
    
            // Obtener los favoritos del usuario actual
            let usuario = JSON.parse(localStorage.getItem(`${nombreUsuario}_gato`));
            let nuevosFavoritos = sesionIniciada.favoritos || [];
            if (!usuario) {
                usuario = {
                    nombreUsuario: nombreUsuario,
                    favoritos: []
                };
            }
    
            usuario.favoritos = [];
    
            // Agregar los nuevos favoritos a la lista existente de favoritos del usuario
            usuario.favoritos.push(...nuevosFavoritos);
    
            // Guardar los cambios en el localStorage
            localStorage.setItem(`${nombreUsuario}_gato`, JSON.stringify(usuario));
    
            // Eliminar la sesión actual
            localStorage.removeItem('sesion_iniciada_gatos');
    
            alert("Hasta la próxima");
            // Recarga la pagina
            location.reload();
        } else {
            // Si no hay sesión iniciada, da un mensaje de error
            alert("No hay sesión iniciada");
        }
    });

    //Funcion que obtiene de una de las APIS las razas que tiene y las guarda en un array
    async function obtenerDatosFacts() {
        try {
            let respuesta;
    
            //URL para obtener más datos de gatos
            let url = "https://catfact.ninja/breeds";
    
            // Realiza la solicitud AJAX utilizando jQuery
            respuesta = await $.ajax({
                url: url,
                method: "GET",
                dataType: "json"
            });
    
            // Verifica si la respuesta contiene datos
            if (respuesta && respuesta.data && respuesta.data.length > 0) {
                // Crea un array para almacenar los nombres de las razas
                let nombresRazas = [];
    
                // Itera sobre los datos y guarda los nombres de las razas en el array
                respuesta.data.forEach((item) => {
                    nombresRazas.push(item.breed);
                });
    

    
                // Retorna el array con los nombres de las razas
                return nombresRazas;
            } else {
                console.log('No se encontraron datos de razas de gatos.');
                return [];
            }
        } catch (error) {
            console.error('Error al obtener datos de gatos:', error);
            throw error;
        }
    }

    //Funcion que compara las razas de ambas APIS y se queda solo con las que coinciden
    function obtenerIdsRazasCoincidentes() {
        // Retorna una promesa para manejar la asincronía
        return new Promise(function(resolve, reject) {
            // Obtener los breeds
            $.ajax({
                url: "https://api.thecatapi.com/v1/breeds?limit=25",
                method: "GET",
                dataType: "json",
                success: function(respuestaBreeds) {
                    // Obtener los facts después de obtener los breeds
                    obtenerDatosFacts().then(function(facts) {
                        try {
                            // Array para almacenar los IDs de las razas coincidentes
                            let idsRazasCoincidentes = [];
    
                            // Filtrar breeds coincidentes con los facts
                            respuestaBreeds.forEach(function(breed) {
                                if (facts.includes(breed.name)) {
                                    idsRazasCoincidentes.push(breed.id);
                                }
                            });
    
                            // Resuelve la promesa con los IDs de las razas coincidentes
                            resolve(idsRazasCoincidentes);
                        } catch (error) {
                            // Rechaza la promesa si ocurre un error
                            reject('Error al obtener IDs de razas coincidentes:', error);
                        }
                    }).catch(function(error) {
                        // Rechaza la promesa si ocurre un error al obtener los facts
                        reject('Error al obtener datos de facts:', error);
                    });
                },
                error: function(errorThrown) {
                    // Rechaza la promesa si ocurre un error al obtener los breeds
                    reject('Error al obtener breeds:', errorThrown);
                }
            });
        });
    }

    //Funcion que saca un campo de cada raza de gatos que contiene la API para evitar repeticiones de la misma raza
    function obtenerDatosGatos() {
        return new Promise(function(resolve, reject) {
            try {
                // Obtener nombres de razas y sus IDs
                obtenerIdsRazasCoincidentes().then(function(razas) {
                    // Realizar todas las solicitudes de imágenes en paralelo
                    let promesasDatosGatos = razas.map(function(raza) {
                        let url = `https://api.thecatapi.com/v1/images/search?limit=1&breed_ids=${raza}&api_key=live_vIcm09jTwDDE89WlD2S9JAEn5wz1laQkoJuiuHGcvAUTc3noy8MwpyhL0m6oBpDO`;
    
                        // Realizar la solicitud AJAX 
                        return $.ajax({
                            url: url,
                            method: 'GET',
                            dataType: 'json'
                        });
                    });
    
                    // Esperar a que todas las promesas de imágenes se resuelvan
                    Promise.all(promesasDatosGatos).then(function(respuestasImagenes) {
                        // Resolver la promesa con las respuestas de las imágenes
                        resolve(respuestasImagenes);
                    }).catch(function(error) {
                        // Manejar errores al obtener las imágenes
                        console.error('Error al obtener datos de los gatos:', error);
                        reject(error);
                    });
                }).catch(function(error) {
                    // Manejar errores al obtener las razas
                    console.error('Error al obtener IDs de razas:', error);
                    reject(error);
                });
            } catch (error) {
                // Manejar otros errores
                console.error('Error al obtener datos de gatos:', error);
                reject(error);
            }
        });
    }

    //Funcion que crea los botones de favorios, me gusta y no me gusta
    function crearBotonesDeAccion(gato) {
        // Botón de favorito
        const botonFavorito = $('<button>').html('<i class="fas fa-heart"></i>').addClass('boton-favorito');
        const sesionIniciada = JSON.parse(localStorage.getItem('sesion_iniciada_gatos')) || {};
        const favoritos = sesionIniciada.favoritos || [];
        if (favoritos.includes(gato.breeds[0].id)) {
            // Si el ID del producto está en la lista de favoritos, aplicar un estilo diferente
            botonFavorito.addClass('favorito-activo');
        }

        botonFavorito.click(function(evento) {
            evento.stopPropagation();
    
            // Obtener el objeto sesion_iniciada del localStorage
            let sesionIniciada = JSON.parse(localStorage.getItem('sesion_iniciada_gatos'));

            if (!sesionIniciada) {
                alert("Debes iniciar sesion para añadir un gato a favoritos")
            }else{
                // Verificar si ya existe un array de favoritos, si no, crear uno vacío
                let favoritos = sesionIniciada.favoritos || [];
        
                // Obtener el ID del producto al que se le ha dado favorito
                let idGato = gato.breeds[0].id;
        
                // Verificar si el producto ya está en la lista de favoritos
                if (!favoritos.includes(idGato)) {
                    // Agregar el ID del producto a la lista de favoritos
                    favoritos.push(idGato);
                    // Agregar el estilo de favorito activo al botón
                    botonFavorito.addClass('favorito-activo');
                } else {
                    // Si el producto ya está en la lista de favoritos, quitarlo de la lista y el estilo de favorito activo del botón
                    favoritos.forEach((item, index) => {
                        if (item === idGato) {
                            favoritos.splice(index, 1); // Eliminar el elemento de la lista de favoritos
                            botonFavorito.removeClass('favorito-activo'); // Quitar el estilo de favorito activo del botón
                        }
                    });
                }
        
                // Actualizar el objeto sesion_iniciada en el localStorage con la lista de favoritos actualizada
                sesionIniciada.favoritos = favoritos;
                localStorage.setItem('sesion_iniciada_gatos', JSON.stringify(sesionIniciada));
                }
        });
        
        
        // Botón de me gusta
        let meGustaCount = localStorage.getItem(`MeGustaCount-${gato.breeds[0].id}`) || 0;
        const botonMeGusta = $('<button>').html('<i class="fas fa-thumbs-up"></i>').addClass('boton-me-gusta').attr('id', `boton-me-gusta-${gato.breeds[0].id}`).text("Me gusta (" + meGustaCount + ")").click(function(evento) {
            evento.stopPropagation();
            meGustaCount = localStorage.getItem(`MeGustaCount-${gato.breeds[0].id}`) || 0;
            meGustaCount++;
            localStorage.setItem(`MeGustaCount-${gato.breeds[0].id}`, meGustaCount);
            botonMeGusta.text(`Me gusta (${meGustaCount})`);
        });
    
        // Botón de no me gusta
        let noMeGustaCount = localStorage.getItem(`NoMeGustaCount-${gato.breeds[0].id}`) || 0;
        const botonNoMeGusta = $('<button>').html('<i class="fas fa-thumbs-down"></i>').addClass('boton-no-me-gusta').attr('id', `boton-no-me-gusta-${gato.breeds[0].id}`).text("No me gusta (" + noMeGustaCount + ")").click(function(evento) {
            evento.stopPropagation();
            noMeGustaCount = localStorage.getItem(`NoMeGustaCount-${gato.breeds[0].id}`) || 0;
            noMeGustaCount++;
            localStorage.setItem(`NoMeGustaCount-${gato.breeds[0].id}`, noMeGustaCount);
            botonNoMeGusta.text(`No me gusta (${noMeGustaCount})`);
        });
    
        return {
            botonFavorito: botonFavorito,
            botonMeGusta: botonMeGusta,
            botonNoMeGusta: botonNoMeGusta
        };
    }

    //Fucnion que genera la informacion adicional del gato al que se le de click
    async  function crearInfomacionRaza(gato){
        let idRaza = gato.breeds[0].id; //sacar la id del gato al que se le hizo click
        //Pedir 3 gatos de la misma raza para poder tener al menos 3 imagenes que mostrar
        let url = `https://api.thecatapi.com/v1/images/search?limit=3&breed_ids=${idRaza}&api_key=live_vIcm09jTwDDE89WlD2S9JAEn5wz1laQkoJuiuHGcvAUTc3noy8MwpyhL0m6oBpDO`;
        let gatosRaza = [];

        let respuesta = await $.ajax({
            url: url,
            method: 'GET',
            dataType: 'json'
        });

        gatosRaza = respuesta;

        titulo.text("Raza: " + gatosRaza[0].breeds[0].name);
      
        //Contenedor de las imagenes
        let contenedorImg = $("<div>").attr("class", "imagenes-raza");

        //Recorrer los gatos obtenidos para sacar las 3 imagenes
        gatosRaza.forEach((gato) =>{
            let img = $("<img>").attr("src", gato.url)
            contenedorImg.append(img);
        });

        //Contenedro que almacenara toda la informacion sobre la raza selecionada
        let contenedorCaracteristicas = $("<div>").attr("class", "caract-raza");

        let contenedorMedidas = $("<div>").attr("class", "caract-medidas");
        let pLong = $("<p>").text("Longitud:" + gatosRaza[0].breeds[0].weight.imperial + " m");
        let pAncho = $("<p>").text("Anchura:" + gatosRaza[0].breeds[0].weight.metric + " m");
        contenedorMedidas.append(pLong);
        contenedorMedidas.append(pAncho);

        let contenedorTemperamento = $("<div>").attr("class", "caract-temp");
        let pTemperamento = $("<p>").text("Temperamento:" + gatosRaza[0].breeds[0].temperament);
        contenedorTemperamento.append(pTemperamento);

        let contenedorOrigen = $("<div>").attr("class", "caract-origen");
        let pPais = $("<p>").text("Pais:" + gatosRaza[0].breeds[0].origin);
        let pCodigo = $("<p>").text("Codigo:" + gatosRaza[0].breeds[0].country_code);
        contenedorOrigen.append(pPais);
        contenedorOrigen.append(pCodigo);

        let contenedorVida = $("<div>").attr("class", "caract.vida");
        let pVida = $("<p>").text("Esperanza de vida:" + gatosRaza[0].breeds[0].life_span + " años");
        contenedorVida.append(pVida);

        let contenedorWikipedia = $("<div>").attr("class", "caract-wiki");
        let a = $("<a>").text("Saber mas sobre la raza").attr("href", gatosRaza[0].breeds[0].wikipedia_url);
        contenedorWikipedia.append(a);

        let volver = $("<buttom>").attr("class", "volver").text("Volver");

        //Evento para el boton de volver que al pulsarlo te vuelve a generar con la vista en la que estabas los gatos
        volver.click((evento)=>{
            contenedor.empty();
            titulo.text("Informacion gatos");
            botones.removeClass("oculto");
            evento.stopPropagation();
            if (vista == "lista") {
                if (tipoOrden === "ASC") {
                    renderizarLista(datosGatosGlobal.sort((a, b) => a[0].breeds[0].name.localeCompare(b[0].breeds[0].name)));
                } else if (tipoOrden === "DESC") {
                    renderizarLista(datosGatosGlobal.sort((a, b) => b[0].breeds[0].name.localeCompare(a[0].breeds[0].name)));
                } else {
                    renderizarLista(datosGatosGlobal);
                }
            }else{
                if (tipoOrden === "ASC") {
                    renderizarTabla(datosGatosGlobal.sort((a, b) => a[0].breeds[0].name.localeCompare(b[0].breeds[0].name)));
                } else if (tipoOrden === "DESC") {
                    renderizarTabla(datosGatosGlobal.sort((a, b) => b[0].breeds[0].name.localeCompare(a[0].breeds[0].name)));
                } else {
                    renderizarTabla(datosGatosGlobal);
                }
            }
        });

        contenedorCaracteristicas.append(contenedorImg);
        contenedorCaracteristicas.append(contenedorMedidas);
        contenedorCaracteristicas.append(contenedorTemperamento);
        contenedorCaracteristicas.append(contenedorOrigen);
        contenedorCaracteristicas.append(contenedorVida);
        contenedorCaracteristicas.append(contenedorWikipedia);
        contenedorCaracteristicas.append(volver);

        contenedor.empty();
        botones.addClass("oculto");
        contenedor.append(contenedorCaracteristicas);

    }

    // Función para generar una fila con los datos de un gato
    function generarFilaTablaGato(gatoData) {
        var gato = gatoData[0]; 
        var fila = $("<tr>");
        fila.click((evento)=>{
            evento.stopPropagation();
            crearInfomacionRaza(gato);
        });
        var imagen = $("<img>").attr("src", gato.url).attr("alt", "Imagen de gato").attr("width", "30%");
        var raza = gato.breeds[0].name;
        var nombre = gato.breeds[0].id;
    
        let botones = crearBotonesDeAccion(gato);
        let celdaBotones = $("<td>").attr("class", "botonera");
        celdaBotones.append(botones.botonFavorito);
        celdaBotones.append(botones.botonMeGusta);
        celdaBotones.append(botones.botonNoMeGusta);

        
        fila.append($("<td>").append(imagen));
        fila.append($("<td>").text(nombre));
        fila.append($("<td>").text(raza));
        fila.append(celdaBotones);
    
        return fila;
    }

    //Funcion para generar los li de la lista de los gatos    
    function generarElementosListaGato(gatoData) {
        var gato = gatoData[0]; 
        var li = $("<li>");
        li.click((evento)=>{
            evento.stopPropagation();
            crearInfomacionRaza(gato);
        });
        var imagen = $("<img>").attr("src", gato.url).attr("alt", "Imagen de gato").attr("width", "30%");
        var raza = gato.breeds[0].name;
        var nombre = gato.breeds[0].id;

        let botones = crearBotonesDeAccion(gato);
        let btn = $("<div>").attr("class", "botonera");
        btn.append(botones.botonFavorito);
        btn.append(botones.botonMeGusta);
        btn.append(botones.botonNoMeGusta);

        li.append($("<p>").append(imagen));
        li.append($("<p>").text(nombre));
        li.append($("<p>").text(raza));
        li.append(btn);
    
        return li;
    }


    //Creacion de la tabla 
    var encabezado = $("<thead>").append("<tr><th>Imagen</th><th>Nombre</th><th>Raza</th><th>Acciones</th></tr>");
    tablaGatos.append(encabezado);
    // Función para agregar datos de gatos a la tabla
    function crearGatosTabla(datosGatos) {
        tablaGatos.append(cuerpo);
    
        // Iterar a través de cada gato en el resultado y agregarlo a la tabla
        datosGatos.forEach(function(gato) {
            var filaGato = generarFilaTablaGato(gato);
            cuerpo.append(filaGato);
        });

        return tablaGatos;
    }

    //Creacion de la lista
    function crearGatosLista(datosGatos) {
        // Iterar a través de cada gato en el resultado y agregarlo a la tabla
        datosGatos.forEach(function(gato) {
            ul.append(generarElementosListaGato(gato));
        });

        return ul;
    }

    //Funcion que añade una fila nueva a la tabla en el scroll infinito
    function addFilaTabla(datosGatos) {
        datosGatos.forEach((gato) => {
            let filas = generarFilaTablaGato(gato);
            cuerpo.append(filas);
        })
    }

    //Funcion que añade un elemento a la lista en el scroll infinito
    function addElementoALista(datosGatos) {
        datosGatos.forEach((gato) => {
            ul.append(generarElementosListaGato(gato));
        })
    }


    //Funcion que genera la vista lista
    function renderizarLista(datosGatos){
        contenedor.empty();
        ul.empty();
        contenedor.append(crearGatosLista(datosGatos));
    }
    
    //Funcion que genera la vista tabla
    function renderizarTabla(datosGatos){
        contenedor.empty();
        cuerpo.empty();
        contenedor.append(crearGatosTabla(datosGatos));
    }

    // Evento para el escroll infinito dependiendo de la vista actual
    $(window).scroll(function() {
        if (!masGatos && ($(window).scrollTop() + $(window).height()) >= $(document).height() - 10) {
            // Si se llega al final de la página, cargar más datos de gatos
            if (vista == "lista") {
                masGatos = true;
                obtenerDatosGatos().then(function(datosGatos) {
                    addElementoALista(datosGatos);
                    masGatos = false;
                });
            }else{
                masGatos = true;
                obtenerDatosGatos().then(function(datosGatos) {
                    addFilaTabla(datosGatos);
                    masGatos = false;
                });
               
            }
        }
    });
    
    // Cargar datos de gatos inicialmente
    obtenerYAlmacenarDatosGatos();
    
});
