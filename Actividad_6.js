$(document).ready(() => {
    // Inicializar Particle y otras variables necesarias
    const particle = new Particle();
    const deviceId = 'e00fce68b318ceade94e9d21'; // ID del dispositivo Boron
    let token;

    // Función para iniciar sesión en Particle
    const login = async () => {
        try {
            // Iniciar sesión y obtener el token de acceso
            const { body } = await particle.login({ username: 'rjimenez@ucol.mx', password: 'K7RM839C2' });
            token = body.access_token;
        } catch (err) {
            // Manejo de errores si no se puede iniciar sesión
            console.error('No se pudo iniciar sesión en Particle:', err);
        }
    };

    // Función para actualizar el valor del slider y la visualización
    const updateSlider = () => {
        // Obtener el valor actual del slider
        const rangePercent = $('#Ktms').val();
        
        // Actualizar el texto del span con el valor del slider
        $('#Kvaluetms').text(rangePercent);
        
        // Cambiar el filtro de color del slider en función del valor
        $('#Ktms').css('filter', `hue-rotate(-${rangePercent * 8}deg)`);
        
        // Mover y escalar la etiqueta del valor del slider
        $('#Kvaluetms').css('transform', `translateX(-50%) scale(${1 + (rangePercent / 20)})`);

        // Enviar el valor del slider al dispositivo Particle
        particle.callFunction({ 
            deviceId, 
            name: 'TMS_2', 
            argument: rangePercent, 
            auth: token 
        })
        .then(data => {
            // Log de éxito después de llamar a la función
            console.log('Función llamada exitosamente:', data);
            
            // Obtener el valor de la variable 'val' del dispositivo
            return particle.getVariable({ 
                deviceId, 
                name: 'val', 
                auth: token 
            });
        })
        .then(({ body }) => {
            // Actualizar el texto del span con el valor de la variable 'val'
            $('#particleValue').text(body.result);
        })
        .catch(err => {
            // Manejo de errores en la cadena de promesas
            console.error('Error en la cadena de promesas:', err);
        });
    };

    // Iniciar sesión y luego configurar el evento del slider
    login().then(() => $('#Ktms').on('input change', updateSlider));
});
