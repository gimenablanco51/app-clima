const fs = require('fs');
const { leerInput, inquirerMenu, pausa, listadoLugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busqueda');
const axios = require('axios');
require('dotenv').config();

const main = async () => {
    let opt;
    const busquedas = new Busquedas();
    do {
        opt = await inquirerMenu();
        switch (opt) {
            case 1:
                // Mostrar Mensaje
                const lugar = await leerInput('Ciudad: ');
                // Buscar Lugares
                const lugares = await busquedas.ciudad(lugar);
                // Selecionar Lugar
                const id = await listadoLugares(lugares);
                if (id === '0') continue;
                console.log({ id });
                const lugarSel = lugares.find(l => l.id === id);
                //Guardar en BD
                busquedas.guardarBD(lugarSel.nombre);

                // Informacion de un lugar de la Ciudad
                console.log('\nInformacion de la ciudad\n'.green);
                console.log('Ciudad:', lugarSel.nombre);
                console.log('Lat:', lugarSel.latitud);
                console.log('Lng:', lugarSel.longitud);
                try {
                    const datosClima = await busquedas.obtenerDatosClima(lugarSel.latitud, lugarSel.longitud);
                    //const datosClima = await busquedas.climaLugar(lugarSel.latitud, lugarSel.longitud);
                    console.log('Temperatura:', datosClima.temperatura);
                    console.log('Mínima:', datosClima.temperaturaMinima);
                    console.log('Máxima:', datosClima.temperaturaMaxima);
                    console.log('Como esta el Clima:', datosClima.descripcion.green);
                } catch (error) {
                    console.log('Error al obtener datos climáticos');
                }
                console.log('');

                // Para mostrar Informacion de Ciudades de una lugar                
                /*for (const lugar of lugares) {
                    console.log('Ciudad:', lugar.nombre);
                    console.log('Lat:', lugar.latitud);
                    console.log('Lng:', lugar.longitud);

                    try {
                        const datosClima = await obtenerDatosClima(lugar.latitud, lugar.longitud);
                        console.log('Temperatura:', datosClima.temperatura);
                        console.log('Mínima:', datosClima.temperaturaMinima);
                        console.log('Máxima:', datosClima.temperaturaMaxima);
                    } catch (error) {
                        console.log('Error al obtener datos climáticos');
                    }
                }*/
                break;
            case 2:
                console.log('\n');
                console.log('\nN° CIUDAD CONSULTADA'.green);

                const historial = busquedas.historialConsultas();
                //console.log(historial);
                historial.forEach((lugar1, i) => {
                    const idx = `${i + 1}.`;
                    console.log(idx.green + " "+ lugar1);
                });

                console.log('\n');
                break;
        }
        if (opt !== 0) await pausa();
    } while (opt !== 0);
};


main();
