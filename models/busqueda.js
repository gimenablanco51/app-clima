const fs = require('fs');

const axios = require('axios');
require('dotenv').config();

class Busquedas {
    historial = [];
    dbPath = './db/database.json';

    constructor() {        
    }

    get paramMapBox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        };
    }

    get paramsWeather() {
        return {
            'access_token': process.env.OPENWEATHER_KEY,
            'limit': 5,
            'language': 'es'
        };
    }

    async ciudad(lugar = '') {
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramMapBox
            });

            const resp = await instance.get();
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                longitud: lugar.center[0],
                latitud: lugar.center[1]                
            }));
        } catch (error) {
            throw new Error('No se pudo determinar la ciudad');
        }
    }
    
    async obtenerDatosClima(latitud, longitud){
        try {            
            const apiKey = process.env.OPENWEATHER_KEY;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitud}&lon=${longitud}&units=metric&lang=es&appid=${apiKey}`;

            const resp = await axios.get(url);
            return {
                temperatura: resp.data.main.temp,
                temperaturaMinima: resp.data.main.temp_min,
                temperaturaMaxima: resp.data.main.temp_max,
                descripcion: resp.data.weather[0].description      
            }
        } catch (error) {
            console.log(error);
        }
    }

    async agregarHistorial(lugar=''){
        //PREVENIR DUPLICADOS
        if(this.historial.includes(lugar.toLocaleLowerCase())) return;
        this.historial.unshift(lugar.toLocaleLowerCase());
        //GRABAR EN BD
        this.guardarBD();

    }
    
    guardarBD(ciudad=''){
        /*const payload = {
            historial:this.historial
        };
        fs.writeFileSync(this.dbPath, JSON.stringify(payload));*/

        let historial = [];
        if (fs.existsSync(this.dbPath)) {
            historial = JSON.parse(fs.readFileSync(this.dbPath, 'utf-8'));
        }
        // Evitar duplicados en el historial
        if (!historial.includes(ciudad)) {
            historial.push(ciudad);
            fs.writeFileSync(this.dbPath, JSON.stringify(historial));
        }

    }

    historialConsultas = () => {
    if (fs.existsSync(this.dbPath)) {
        return JSON.parse(fs.readFileSync(this.dbPath, 'utf-8'));
        }
        return [];
    };
    
}

module.exports = Busquedas;
