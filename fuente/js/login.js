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

    function comprobarUsuario_local(nombreUsuario, contraseña) {
        let usuarioGuardado = JSON.parse(localStorage.getItem(nombreUsuario));

        if (usuarioGuardado) {
            if (usuarioGuardado.contraseña === contraseña) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    iniciar_session.click(async function(evento) {
        evento.preventDefault();
        let nombre_usuario = $('#nombre').val();
        let clave = $('#clave').val();

        try {
            let usuario_local = comprobarUsuario_local(nombre_usuario, clave);
            if (usuario_local) {
                alert("Sesion iniciada");

                let sesionNombreUsuario = JSON.parse(localStorage.getItem(nombre_usuario));
                let listaFavoritos = [];

                if (sesionNombreUsuario) {
                    listaFavoritos = sesionNombreUsuario.favoritos;
                }

                let sesionIniciada = {
                    nombreUsuario: nombre_usuario,
                    favoritos: listaFavoritos
                };
                localStorage.setItem('sesion_iniciada', JSON.stringify(sesionIniciada));

                window.location.href = "../index.html";
            } else {
                alert("No se ha podido iniciar sesion");
            }
        } catch (error) {
            console.error('Error al comprobar usuario:', error);
        }
    });

    registrarse.click(function(evento) {
        evento.preventDefault();

        let usuarios = {
            nombreUsuario: usuarioInput.val(),
            correo: correoInput.val(),
            contraseña: claveInput.val(),
            nombre: {
                nombre: nombreInput.val(),
                apellidos: apellidosInput.val()
            },
            telefono: telefonoInput.val(),
            edad: edadInput.val(),
            DNI: dniInput.val(),
            favoritos: [],
        };

        localStorage.setItem(usuarioInput.val(), JSON.stringify(usuarios));

        alert("Usuario creado con exito");
        login.removeClass('oculto');
        registro.addClass('oculto');
    });

    abrir_registro.click(function(evento) {
        evento.preventDefault();
        registro.removeClass('oculto');
        login.addClass('oculto');
    });

    abrir_login.click(function(evento) {
        evento.preventDefault();
        login.removeClass('oculto');
        registro.addClass('oculto');
    });
});
