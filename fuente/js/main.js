$(document).ready(function() {
    let offset = 0; // Variable para controlar el offset de la paginación
    let lista = $("#lista");
    let tabla = $('#tabla');
    let asc = $('#asc');
    let desc = $('#desc');
    let vista = "lista";
    let orden = false;
    let tipoOrden = "RAND";
    let contenedor = $('#gatos');
    var tablaGatos = $("<table>").addClass("tabla-gatos");
    let cuerpo = $("<tbody>");
    let ul = $("<ul>").addClass("lista-gatos");

    lista.click(() =>{
        vista = "lista";
        obtenerDatosGatos().then(function(datosGatos) {
            renderizarLista(datosGatos);
        });
    });

    tabla.click(() =>{
        vista = "tabla";
        obtenerDatosGatos().then(function(datosGatos) {
            renderizarTabla(datosGatos);
        });
    });

    asc.click(() =>{
        orden = true;
        tipoOrden = "ASC";
        if (vista == "lista") {
            ul.empty();
            obtenerDatosGatos().then(function(datosGatos) {
                renderizarLista(datosGatos);
            });
        }else{
            cuerpo.empty();
            obtenerDatosGatos().then(function(datosGatos) {
                renderizarTabla(datosGatos);
            });
        }
    });
    
    desc.click(() =>{
        orden = true;
        tipoOrden = "DESC";
        if (vista == "lista") {
            ul.empty();
            obtenerDatosGatos().then(function(datosGatos) {
                renderizarLista(datosGatos);
            });
        }else{
            cuerpo.empty();
            obtenerDatosGatos().then(function(datosGatos) {
                renderizarTabla(datosGatos);
            });
        }
       
    })

    async function obtenerDatosFacts() {
        try {
            let respuesta;
    
            // Construye la URL para obtener más datos de gatos
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

    async function obtenerBreeds() {
        try {
            // URL para obtener los 25 primeros breeds
            let url = "https://api.thecatapi.com/v1/breeds?limit=25";
    
            // Realiza la solicitud AJAX utilizando jQuery
            let respuesta = await $.ajax({
                url: url,
                method: "GET",
                dataType: "json"
            });
    
            // Array para almacenar los breeds con id y name
            let breeds = [];
    
            // Itera sobre la respuesta y almacena los breeds con id y name en el array
            respuesta.forEach((breed) => {
                breeds.push({
                    id: breed.id,
                    name: breed.name
                });
            });
            return breeds;
        } catch (error) {
            console.error('Error al obtener breeds:', error);
            throw error;
        }
    }

    async function obtenerIdsRazasCoincidentes() {
        try {
            // Obtener los breeds y los facts
            let breeds = await obtenerBreeds();
            let facts = await obtenerDatosFacts();
    
            // Array para almacenar los IDs de las razas coincidentes
            let idsRazasCoincidentes = [];
    
            // Recorre los facts y los breeds para buscar coincidencias
            facts.forEach((fact) => {
                breeds.forEach((breed) => {
                    // Compara los nombres de las razas en ambos arrays
                    if (fact === breed.name) {
                        // Si hay coincidencia, guarda el ID de la raza
                        idsRazasCoincidentes.push(breed.id);
                    }
                });
            });
    
            return idsRazasCoincidentes;
        } catch (error) {
            console.error('Error al obtener IDs de razas coincidentes:', error);
            throw error;
        }
    }

    async function obtenerDatosGatos() {
        try {
            let razas = await obtenerIdsRazasCoincidentes();
            let respuestaRazas = []; // Array para almacenar las respuestas de las razas
    
            // Iterar sobre cada ID de raza
            for (let i = 0; i < razas.length; i++) {
                let url = `https://api.thecatapi.com/v1/images/search?limit=1&breed_ids=${razas[i]}&api_key=live_vIcm09jTwDDE89WlD2S9JAEn5wz1laQkoJuiuHGcvAUTc3noy8MwpyhL0m6oBpDO`;
                
                let parametrosConsulta = {
                    mime_types: "jpg",
                    format: "json",
                    order: "RAND",
                    page: offset
                };

                // Realizar la solicitud AJAX utilizando jQuery
                let respuestaRaza = await $.ajax({
                    url: url,
                    method: "GET",
                    data: parametrosConsulta,
                    dataType: "json"
                });
    
                // Agregar la respuesta de la raza al array de respuestas
                respuestaRazas.push(respuestaRaza);
            }

            respuestaRazas.sort((a, b) => {
                let nombreA = a[0].breeds[0].name.toLowerCase();
                let nombreB = b[0].breeds[0].name.toLowerCase();
                if (tipoOrden === "ASC") {
                    return nombreA.localeCompare(nombreB);
                } else if (tipoOrden === "DESC") {
                    return nombreB.localeCompare(nombreA);
                } else {
                    return 0;
                }
            });
    
            // Imprimir las respuestas de las razas
            return respuestaRazas;
    
        } catch (error) {
            console.error('Error al obtener datos de gatos:', error);
            throw error;
        }
    }
    
    // Función para generar una fila con los datos de un gato
    function generarFilaTablaGato(gatoData) {
        var gato = gatoData[0]; // Obtener el objeto de gato del array
        var fila = $("<tr>");
        var imagen = $("<img>").attr("src", gato.url).attr("alt", "Imagen de gato").attr("width", "30%");
        var raza = gato.breeds[0].name;
        var nombre = gato.breeds[0].id;
    
        fila.append($("<td>").append(imagen));
        fila.append($("<td>").text(nombre));
        fila.append($("<td>").text(raza));
    
        return fila;
    }
    
    function generarElementosListaGato(gatoData) {
        var gato = gatoData[0]; // Obtener el objeto de gato del array
        var li = $("<li>");
        var imagen = $("<img>").attr("src", gato.url).attr("alt", "Imagen de gato").attr("width", "30%");
        var raza = gato.breeds[0].name;
        var nombre = gato.breeds[0].id;
    
        li.append($("<p>").append(imagen));
        li.append($("<p>").text(nombre));
        li.append($("<p>").text(raza));
    
        return li;
    }
    
    var encabezado = $("<thead>").append("<tr><th>Imagen</th><th>Nombre</th><th>Raza</th></tr>");
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

    function crearGatosLista(datosGatos) {
        // Iterar a través de cada gato en el resultado y agregarlo a la tabla
        datosGatos.forEach(function(gato) {
            ul.append(generarElementosListaGato(gato));
        });

        return ul;
    }

    function añadirFilaTabla(datosGatos) {
        datosGatos.forEach((gato) => {
            let filas = generarFilaTablaGato(gato);
            cuerpo.append(filas);
        })
    }

    function añadirElementoALista(datosGatos) {
        datosGatos.forEach((gato) => {
            ul.append(generarElementosListaGato(gato));
        })
    }


    function renderizarLista(datosGatos){
        contenedor.empty();
        contenedor.append(crearGatosLista(datosGatos));
    }
    
    function renderizarTabla(datosGatos){
        contenedor.empty();
        contenedor.append(crearGatosTabla(datosGatos));
    }

    // Monitorear el desplazamiento de la página
    $(window).scroll(function() {
        if ($(window).scrollTop() + $(window).height() == $(document).height()) {
            offset++; // Incrementar el offset para la próxima paginación
            // Si se llega al final de la página, cargar más datos de gatos
            if (vista == "lista") {
                obtenerDatosGatos().then(function(datosGatos) {
                    añadirElementoALista(datosGatos)
                 });
            }else{
                obtenerDatosGatos().then(function(datosGatos) {
                    añadirFilaTabla(datosGatos)
                 });
            }
        }
    });
    
    // Cargar datos de gatos inicialmente
    obtenerDatosGatos().then(function(datosGatos) {
        renderizarLista(datosGatos);
     });
    
});
