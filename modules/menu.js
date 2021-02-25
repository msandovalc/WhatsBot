const config = require('../config');

async function getMenu() { //Promise read data

    try {
        var out = ({
            message: "Te doy la Bienvenida a nuestro menú de opciones de nuestro *Bot de Edificando Sueños*\n" +
            "Por favor *Escriba el número* de las siguientes opciones:\n"+
            "*1.* Enviar video de concepto del desarrollo del negocio 💰📈📲🤓\n" + 
            "*2.* Enviar 2 videos de testimonios 🎞🤩\n" + 
            "*3.* Enviar imagenes de beneficios e ingresos 📲🤓\n" +
            "*4.* Horarios de presentaciones de desarrollo del negocio 💻📲🤓\n" +
            "*5.* Agendar una llamada con Manuel Sandoval 📱🧑‍💻\n"
        })
        return out
    } catch (err) {
        return "read_error"
    } 
}

module.exports = {
    getMenu
}