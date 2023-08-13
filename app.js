const fs = require('fs');
const { leerInput, inquirerMenu, pausa } = require('./helpers/inquirer');
const Busquedas = require('./models/busqueda');

const main = async () => {
    let opt;
    const busquedas = new Busquedas();
    do {
        opt = await inquirerMenu();
        switch (opt) {
            case 1:
                const lugar = await leerInput('Ciudad: ');
                const datosCiudad = await busquedas.ciudad(lugar);
                guardarConsulta(datosCiudad);
                mostrarDatosCiudad(datosCiudad);
                break;
        }
        if (opt !== 0) await pausa();
    } while (opt !== 0);
}

const guardarConsulta = (datos) => {
    const historial = cargarHistorial();
    historial.push(datos);
    fs.writeFileSync('./bd/climahistorial.json', JSON.stringify(historial, null, 4));
}

const cargarHistorial = () => {
    try {
        const historial = fs.readFileSync('./bd/climahistorial.json', { encoding: 'utf-8' });
        return JSON.parse(historial);
    } catch (error) {
        return [];
    }
}

const mostrarDatosCiudad = (datos) => {
    console.log('\nInformacion de la ciudad\n'.green);
    console.log('Ciudad:', datos.ciudad);
    console.log('Lat:', datos.lat);
    console.log('Lng:', datos.lng);
    console.log('Temperatura:', datos.temperatura);
    console.log('Minima:', datos.minima);
    console.log('Maxima:', datos.maxima);
}

main();
