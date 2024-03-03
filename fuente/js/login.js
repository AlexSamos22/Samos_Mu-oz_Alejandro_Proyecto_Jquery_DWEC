$(document).ready(function() {

    let abrir_registro = $('#abrir_registro');
    let registro = $('#registro');
    let login = $('#login');
    let abrir_login = $('#abrir_login');
    let iniciar_session = $('#inciar_sesion');
    let registrarse = $('#registarse');
    let usuarioInput = $('#usuario');
    let correoInput = $('#correo');
    let claveInput = $('#Clave');
    let nombreInput = $('#Nombre');
    let apellidosInput = $('#apellidos');
    let telefonoInput = $('#telefono');
    let edadInput = $('#edad');
    let dniInput = $('#dni');

    $('#correo, #Clave, #Nombre, #apellidos, #telefono, #edad, #dni, #registrarse').prop('disabled', true);

    //Funcion que comprueba si el usuario existe
    function comprobarUsuario_local(nombreUsuario, contrasena) {
        let usuarioGuardado = JSON.parse(localStorage.getItem(`${nombreUsuario}_gato`));
        if (usuarioGuardado) {
            if (usuarioGuardado.contrasena === contrasena) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    //Evento que llama a la funcion de comprobar usuario y si la respuesta es true carga su lista de favoritos y su nombre en la sesion_iniciada
    iniciar_session.click(async function(evento) {
        evento.preventDefault();
        let nombre_usuario = $('#nombreLogin').val();
        let clave = $('#claveLogin').val();
        console.log(nombre_usuario);
        console.log(clave);

        try {
            let usuario_local = comprobarUsuario_local(nombre_usuario, clave);
            if (usuario_local) {
                alert("Sesion iniciada");

                let sesionNombreUsuario = JSON.parse(localStorage.getItem(`${nombre_usuario}_gato`));
                let listaFavoritos = [];

                if (sesionNombreUsuario) {
                    listaFavoritos = sesionNombreUsuario.favoritos;
                }

                let sesionIniciada = {
                    nombreUsuario: nombre_usuario,
                    favoritos: listaFavoritos
                };
                localStorage.setItem('sesion_iniciada_gatos', JSON.stringify(sesionIniciada));

                window.location.href = "../index.html";
            } else {
                alert("No se ha podido iniciar sesion");
            }
        } catch (error) {
            console.error('Error al comprobar usuario:', error);
        }
    });

    //Funcion que registra a un usuario
    registrarse.click(function(evento) {
        evento.preventDefault();

        let usuarios = {
            nombreUsuario: usuarioInput.val(),
            correo: correoInput.val(),
            contrasena: claveInput.val(),
            nombre: {
                nombre: nombreInput.val(),
                apellidos: apellidosInput.val()
            },
            telefono: telefonoInput.val(),
            edad: edadInput.val(),
            DNI: dniInput.val(),
            favoritos: [],
        };

        localStorage.setItem(`${usuarioInput.val()}_gato`, JSON.stringify(usuarios));

        $('#correo, #Clave, #Nombre, #apellidos, #telefono, #edad, #dni, #registrarse').val('');

        alert("Usuario creado con exito");
        login.removeClass('oculto');
        registro.addClass('oculto');
    });

    
    usuarioInput.on('input', function() {
        let usuarioValor = $(this).val();
        let regexUsuario = /^[a-zA-Z0-9][a-zA-Z0-9_\-\.]*$/.test(usuarioValor);

        if (!regexUsuario || usuarioValor === "") {
            // Si el nombre de usuario no es válido o está vacío, deshabilitan los campos de abajo
            $('#correo, #Clave, #nombre, #apellidos, #telefono, #edad, #dni, #registrarse').prop('disabled', true);
            mostrarMensajeError("usuario", 'El nombre de usuario debe contener al menos una letra y un número y solo puede tener los caracteres _ - .');
        } else {
            // Si el nombre de usuario es válido, habilitar el campo de correo electrónico
            $('#correo').prop('disabled', false);
            quitarMensajeError("usuario");
        }
    });
    
    correoInput.on('input', function() {
        let correoValor = $(this).val();
        let regexCorreo = /[a-zA-Z0-9_.-]+@[a-z]+\.[a-z]{2,3}$/.test(correoValor);
    
        if (!regexCorreo || correoValor === "") {
            // Si el correo no es válido o está vacío, deshabilitar los campos de abajo
            $('#Clave, #nombre, #apellidos, #telefono, #edad, #dni, #registrarse').prop('disabled', true);
            mostrarMensajeError("correo", "El correo solo puede contener letras, números y los caracteres - _ .");
        } else {
            // Si el correo es válido, habilitar el campo de clave
            $('#Clave').prop('disabled', false);
            quitarMensajeError("correo");
        }
    });

    claveInput.on('input', function() {
        let claveValor = $(this).val();
        // Se usan las búsquedas positivas para asegurar que sí o sí aparezca al menos 1 de cada tipo
        let regexClave = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_\-.@])[A-Za-z\d_\-.@]*/.test(claveValor);
    
        if (!regexClave || claveValor === "") {
            // Si la clave no es válida o está vacía, deshabilitar los campos de abajo
            $('#nombre, #apellidos, #telefono, #edad, #dni, #registrarse').prop('disabled', true);
            mostrarMensajeError("contraseña", "La contraseña debe contener al menos una minúscula, una mayúscula, un número y un _ , - o .");
        } else {
            // Si la clave es válida, habilitar el campo de nombre
            $('#Nombre').prop('disabled', false);
            quitarMensajeError("contraseña");
        }
    });

    nombreInput.on('input', function() {
        let nombreValor = $(this).val();
        let regexNombre = /^[a-zA-Z]+$/.test(nombreValor);
    
        if (!regexNombre || nombreValor === "") {
            // Si el nombre no es válido o está vacío, deshabilitar los campos de abajo
            $('#apellidos, #telefono, #edad, #dni, #registrarse').prop('disabled', true);
            mostrarMensajeError("Nombre", "El nombre solo puede contener letras");
        } else {
            // Si el nombre es válido, habilitar el campo de apellidos
            $('#apellidos').prop('disabled', false);
            quitarMensajeError("Nombre");
        }
    });

    apellidosInput.on('input', function() {
        let apellidosValor = $(this).val();
        let regexApellidos = /^[A-Za-z]+ [A-Za-z]+$/.test(apellidosValor);
    
        if (!regexApellidos || apellidosValor === "") {
            // Si los apellidos no son válidos o están vacíos, deshabilitar los campos de abajo
            $('#telefono, #edad, #dni, #registrarse').prop('disabled', true);
            mostrarMensajeError("Apellidos", "Los apellidos deben contener solo letras y estar separados por un espacio");
        } else {
            // Si los apellidos son válidos, habilitar el campo de teléfono
            $('#telefono').prop('disabled', false);
            quitarMensajeError("Apellidos");
        }
    });

    telefonoInput.on('input', function() {
        let telfValor = $(this).val();
        let regexTelf = /^\d{9}$/.test(telfValor);
    
        if (!regexTelf || telfValor === "") {
            // Si el teléfono no es válido o está vacío, deshabilitar los campos de abajo
            $('#edad, #dni, #registrarse').prop('disabled', true);
            mostrarMensajeError("Telf", "Teléfono no válido");
        } else {
            // Si el teléfono es válido, habilitar el campo de edad
            $('#edad').prop('disabled', false);
            quitarMensajeError("Telf");
        }
    });

    edadInput.on('input', function() {
        let edadfValor = $(this).val();
    
        if (edadfValor === "") {
            // Si la edad no es válida o está vacía, deshabilitar los campos de abajo
            $('#dniInput, #registrarse').prop('disabled', true);
            mostrarMensajeError("Edad", "La edad no puede estar vacía");
        } else {
            // Si la edad es válida, habilitar el campo de DNI
            $('#dni').prop('disabled', false);
            quitarMensajeError("Edad");
        }
    });

    dniInput.on('input', function() {
        let dniValor = $(this).val();
        let regexDNI = /^\d{8}[a-zA-Z]$/.test(dniValor);
    
        if (!regexDNI || dniValor === "") {
            // Si el DNI no es válido o está vacío, deshabilitar los campos de abajo
            $('#registrarse').prop('disabled', true);
            mostrarMensajeError("DNI", "Formato de DNI no válido");
        } else {
            // Si el DNI es válido, habilitar el botón para enviar el registro
            $('#registrarse').prop('disabled', false);
            quitarMensajeError("DNI");
        }
    });

    //Evento para abrir el registro y ocultar el login
    abrir_registro.click(function(evento) {
        evento.preventDefault();
        registro.removeClass('oculto');
        login.addClass('oculto');
    });

    //Evento para ocultar el registro y mostrar el login
    abrir_login.click(function(evento) {
        evento.preventDefault();
        login.removeClass('oculto');
        registro.addClass('oculto');
    });

    // Muestra el mensaje de error si algún parámetro del campo no coincide
function mostrarMensajeError(campoError, mensaje) {
    let parrafo = $(`#error_${campoError}`);
    parrafo.addClass('mensaje-error');
    parrafo.text(mensaje);
}

// Quita el mensaje de error si el campo es correcto
function quitarMensajeError(campoError) {
    let parrafo = $(`#error_${campoError}`);
    parrafo.removeClass('mensaje-error');
    parrafo.text("");
}
});
