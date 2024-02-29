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
        obtenerDatosGatos(offset).then(function(datosGatos) {
            renderizarLista(datosGatos);
        });
    });

    tabla.click(() =>{
        vista = "tabla";
        obtenerDatosGatos(offset).then(function(datosGatos) {
            renderizarTabla(datosGatos);
        });
    });

    asc.click(() =>{
        orden = true;
        tipoOrden = "ASC";
        if (vista == "lista") {
            ul.empty();
            obtenerDatosGatos(offset).then(function(datosGatos) {
                renderizarLista(datosGatos);
            });
        }else{
            cuerpo.empty();
            obtenerDatosGatos(offset).then(function(datosGatos) {
                renderizarTabla(datosGatos);
            });
        }
    });
    
    desc.click(() =>{
        orden = true;
        tipoOrden = "DESC";
        if (vista == "lista") {
            ul.empty();
            obtenerDatosGatos(offset).then(function(datosGatos) {
                renderizarLista(datosGatos);
            });
        }else{
            cuerpo.empty();
            obtenerDatosGatos(offset).then(function(datosGatos) {
                renderizarTabla(datosGatos);
            });
        }
       
    })

    async function obtenerDatosGatos(offset) {
        try {
            let respuesta;
    
            // Construye la URL para obtener más datos de gatos
            let url = "https://api.thecatapi.com/v1/images/search";
            let parametrosConsulta = {
                limit: 10,
                api_key: "live_vIcm09jTwDDE89WlD2S9JAEn5wz1laQkoJuiuHGcvAUTc3noy8MwpyhL0m6oBpDO",
                mime_types: "jpg",
                format: "json",
                has_breeds: true,
                order: "RAND",
                page: offset
            };

            if (orden) {
                parametrosConsulta.order = tipoOrden;
            }
    
            // Realiza la solicitud AJAX utilizando jQuery
            respuesta = await $.ajax({
                url: url,
                method: "GET",
                data: parametrosConsulta,
                dataType: "json"
            });
    
            return respuesta;
        } catch (error) {
            console.error('Error al obtener datos de gatos:', error);
            throw error;
        }
    }
    
    // Función para generar una fila con los datos de un gato
    function generarFilaTablaGato(gato) {
        var fila = $("<tr>");
        var imagen = $("<img>").attr("src", gato.url).attr("alt", "Imagen de gato").attr("width", "30%");
        var raza = gato.breeds.length > 0 ? gato.breeds[0].name : "Desconocida";
        var nombre = gato.breeds.length > 0 ? gato.breeds[0].id : "Desconocido";
    
        fila.append($("<td>").append(imagen));
        fila.append($("<td>").text(nombre));
        fila.append($("<td>").text(raza));
    
        return fila;
    }

    function generarElementosListaGato(gato) {
        var li = $("<li>");
        var imagen = $("<img>").attr("src", gato.url).attr("alt", "Imagen de gato").attr("width", "30%");
        var raza = gato.breeds.length > 0 ? gato.breeds[0].name : "Desconocida";
        var nombre = gato.breeds.length > 0 ? gato.breeds[0].id : "Desconocido";
    
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
                obtenerDatosGatos(offset).then(function(datosGatos) {
                    añadirElementoALista(datosGatos)
                 });
            }else{
                obtenerDatosGatos(offset).then(function(datosGatos) {
                    añadirFilaTabla(datosGatos)
                 });
            }
        }
    });
    
    // Cargar datos de gatos inicialmente
    obtenerDatosGatos(offset).then(function(datosGatos) {
        renderizarLista(datosGatos);
     });
    
});
