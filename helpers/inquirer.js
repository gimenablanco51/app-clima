const inquirer = require('inquirer');
require('colors');

const inquirerMenu = async () => {
    console.clear();
    console.log('======================='.green);
    console.log('Seleccione una opcion'.white);
    console.log('=======================\n'.green);

    const { opcion } = await inquirer.prompt({
        type: 'list',
        name: 'opcion',
        message: '¿Qué desea hacer?',
        choices: [
            {
                value: 1,
                name: `${'1.'.green} Ver datos del Clima`
            },
            {
                value: 2,
                name: `${'1.'.green} Listar ciudad`
            },
            {
                value: 0,
                name: `${'0.'.green} Salir`
            }
        ]
    });

    return opcion;
};

const leerInput = async (message) => {
    const { desc } = await inquirer.prompt({
        type: 'input',
        name: 'desc',
        message,
        validate(value) {
            if (value.length === 0) {
                return 'Por favor ingrese un valor';
            }
            return true;
        }
    });

    return desc;
};

const pausa = async () => {
    await inquirer.prompt({
        type: 'input',
        name: 'enter',
        message: `Presione ${'enter'.green} para continuar`
    });
};

const listadoLugares = async(lugares=[])=>{
    const choices = lugares.map((lugar,i)=>{
        const idx = `${i+1}.`.green;
        return{
            value: lugar.id,
            name: `${idx} ${lugar.nombre}`
        }
    });
    // recibir preguntas
    choices.unshift({
        value:'0',
        name:'0.'.green+'Cancelar'
    });
    const preguntas = [
        {
            type:'list',
            name:'id',
            message:'Selecciones Lugar',
            choices
        }
    ]
    const{id}=await inquirer.prompt(preguntas);
    return id;
}


module.exports = {
    inquirerMenu,
    leerInput,
    pausa,
    listadoLugares
    //comfirmar,
    //mostrarListadoChecklist
};
