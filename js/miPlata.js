function registro() {
    let id = prompt("Ingrese identificación");
    let nombre = prompt("Ingrese su nombre de usuario");
    let correo = prompt("Ingrese correo electrónico");
    while(!validarCorreo(correo)){
        alert("Formato de correo inválido. Intente de nuevo")
        correo = prompt("Ingrese correo electrónico");
        if (correo===null) return null; 
    }
    let contrasenna = prompt("Ingrese su contraseña");
    let contrasenna2 = prompt("Repetir contraseña")
    while (contrasenna!==contrasenna2){
        alert("Las contraseñas no coinciden. Intente de nuevo");
        contrasenna = prompt("Ingrese su contraseña");
        contrasenna2 = prompt("Repetir contraseña")
        if (contrasenna===null || contrasenna2 === null) return null;
    }
    let saldoInicial = prompt("Ingrese su saldo inicial");
    const d = new Date().toLocaleString();
    let saldo = parseFloat(saldoInicial) || 0;
    localStorage.setItem("saldo",String(saldo));
    localStorage.setItem("nombre", nombre);
    localStorage.setItem("contraseña", contrasenna);
    localStorage.removeItem("cuentaBloqueada" + nombre);
    const register = [d,"Registro",0,saldo];
    return register;
}

function validarCorreo(correo) {
    if (correo === null) return false;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
}

function validarCierre(valor){
    if (valor === null){
        alert("operación cancelada");
    return true;
    }
    return false;
}

function iniciarSesion() {
        let maxIntentos = 3;
        while (true) {
            let nombre = prompt("Ingrese su nombre de usuario");
            if(validarCierre(nombre)){
        return null;
        }
        if (localStorage.getItem("cuentaBloqueada" + nombre) === "true") {
            alert("Su cuenta está bloqueada");
        return null;
        }
            let intentos = parseInt(localStorage.getItem("intentos" + nombre)) || 0;
            let contrasenna = prompt("Ingrese su contraseña");

            if(validarCierre(contrasenna)){
            return null;
            }
    if (nombre === localStorage.getItem("nombre") && contrasenna === localStorage.getItem("contraseña")) {
            alert("Inicio de sesión exitoso");
            localStorage.removeItem("cuentaBloqueada" + nombre); // Limpiar intentos
            localStorage.removeItem("intentos" + nombre)
        return true;
    } else {
            intentos++;
            localStorage.setItem("intentos" + nombre, intentos); // Guardar intentos por usuario
        if (intentos >= maxIntentos) {
            localStorage.setItem("cuentaBloqueada" + nombre, "true");
            alert("Máximo de intentos alcanzado. cuenta bloqueada por 24 horas, comunicate con tú banco.");
            return false;
        } else {
            alert("Intento fallido. Te quedan " + (maxIntentos - intentos));
        }
    }
        }
}

function transaccion() {
    let option = prompt("Transacciones y Movimientos\n                1.Retirar dinero\n                2.Consignar dinero a su cuenta\n                3.Consultar saldo\n                4.Consultar movimientos\n                5.Salir");
    return option;
}


function limpiar(){
    localStorage.clear();
}

function solicitarSiNo(mensaje) {
    let respuesta;
    while (true) {
        respuesta = prompt(mensaje);
        
        // Si el usuario presiona "Cancelar", devolvemos null
        if (respuesta === null) return null; 
        
        let limpia = respuesta.toLowerCase().trim();
        if (limpia === "si" || limpia === "no") {
            return limpia;
        }
        
        alert("⚠️ Por favor, responde únicamente con 'si' o 'no'.");
    }
}
// INICIO DEL PROGRAMA
let opcionLimpiar = solicitarSiNo("¿Desea limpiar datos previos? (si/no)");
if (opcionLimpiar === "si") {
    limpiar();
} else if (opcionLimpiar === null) {
    alert("Proceso interrumpido.");
}

let opcionRegistro = solicitarSiNo("¿Desea registrarse como nuevo usuario? (si/no)");
let reg = null;
let movimientos = [];
if (opcionRegistro === "si") {
    reg = registro();
}

let resultado = iniciarSesion();
while (resultado === false) {
    resultado = iniciarSesion();
}

if (resultado === true) {
    let opcion = transaccion();
    while (opcion !== "5") {
        let saldoActual = parseFloat(localStorage.getItem("saldo")) || 0;
        let fecha = new Date().toLocaleString(); 

        switch (opcion) {
            case "1": // RETIRAR
                let retirar = parseFloat(prompt("Indique el monto a retirar")) || 0;
                if (retirar <= 0) {
                    alert("Monto inválido");
                } else if (saldoActual >= retirar) {
                    saldoActual -= retirar;
                    localStorage.setItem("saldo", String(saldoActual));
                    alert("Retiro exitoso. Saldo actual: " + saldoActual);
                    movimientos.push([fecha, "Retiro", "-" + retirar, saldoActual]);
                } else {
                    alert("Saldo insuficiente");
                }
                break;

            case "2": // CONSIGNAR
                let consignar = parseFloat(prompt("Indique el monto a consignar")) || 0;
                if (consignar > 0) {
                    saldoActual += consignar;
                    localStorage.setItem("saldo", String(saldoActual));
                    alert("Consignación exitosa. Saldo actual: " + saldoActual);
                    movimientos.push([fecha, "Consignación", "+" + consignar, saldoActual]);
                } else {
                    alert("Monto inválido");
                }
                break;

            case "3": // SALDO
                alert("Su saldo actual es: " + localStorage.getItem("saldo"));
                break;

            case "4": // MOVIMIENTOS
                let cabecera = ["Fecha", "Concepto", "Valor", "Saldo"];
                let filas = [];
                
                if (reg) filas.push(reg.join(" | ")); // Registro inicial
                movimientos.forEach(mov => filas.push(mov.join(" | ")));

                if (filas.length > 0) {
                    alert("CONSULTA DE MOVIMIENTOS\n" + 
                          cabecera.join(" | ") + "\n" + 
                          "--------------------------------------------------\n" + 
                          filas.join("\n"));
                } else {
                    alert("No hay movimientos en esta sesión.");
                }
                break;

            default:
                alert("Opción inválida");
        }
        opcion = transaccion();
    }
}