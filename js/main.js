// ============================================================================
// PRE-ENTREGA 3: FUNCIONES E INTEGRACIÓN DE LÓGICA
// Simulador de Cotización y Compra — TechCore Hardware & PC
// ============================================================================

// Constantes globales del sistema (Scope Global con const)
const NOMBRE_TIENDA_HARDWARE = "TechCore Hardware & PC";
const TASA_IVA_MEXICO = 0.16;
const MONTO_MINIMO_ENVIO_GRATIS = 10000;
const TARIFA_ENVIO_ESTANDAR = 250;

// ============================================================================
// 1. FUNCIONES FLECHA (Procesos simples y reutilizables con parámetros y return)
// ============================================================================

// Función flecha para calcular el subtotal de una línea de producto
const calcularSubtotalComponente = (precioUnitario, cantidadUnidades) => precioUnitario * cantidadUnidades;

// Función flecha para calcular el monto de IVA sobre una base imponible
const calcularMontoIva = (montoBaseImponible, tasaImpuesto) => Math.round(montoBaseImponible * tasaImpuesto * 100) / 100;

// Función flecha para determinar el costo de envío según el monto de compra
const calcularCostoEnvio = (subtotalConDescuento, minimoEnvioGratis, tarifaBaseEnvio) =>
    subtotalConDescuento >= minimoEnvioGratis ? 0 : tarifaBaseEnvio;

// Función flecha para calcular la mensualidad en planes de pagos fijos
const calcularMensualidadPlan = (montoTotalFinal, plazoMeses) => Math.round((montoTotalFinal / plazoMeses) * 100) / 100;

// ============================================================================
// 2. FUNCIONES EXPRESADAS (Procesamiento de reglas de negocio con return)
// ============================================================================

// Función expresada que calcula el descuento acumulado por volumen y por cupón promocional
const calcularDescuentoTotal = function (subtotalBruto, cantidadTotalUnidades, codigoCuponIngresado) {
    let porcentajeDescuentoVolumen = 0;

    if (cantidadTotalUnidades >= 5) {
        porcentajeDescuentoVolumen = 0.10;
    } else if (cantidadTotalUnidades >= 3) {
        porcentajeDescuentoVolumen = 0.05;
    }

    let porcentajeDescuentoCupon = 0;
    const codigoNormalizado = codigoCuponIngresado.trim().toUpperCase();

    if (codigoNormalizado === "TECH10") {
        porcentajeDescuentoCupon = 0.10;
    } else if (codigoNormalizado === "GAMER15") {
        porcentajeDescuentoCupon = 0.15;
    }

    const porcentajeTotalAplicable = porcentajeDescuentoVolumen + porcentajeDescuentoCupon;
    const montoDescuentoCalculado = Math.round(subtotalBruto * porcentajeTotalAplicable * 100) / 100;

    return montoDescuentoCalculado;
};

// ============================================================================
// 3. FUNCIONES DECLARADAS (Entrada de datos, Flujo encadenado y Salida de datos)
// ============================================================================

// Función declarada de ENTRADA DE DATOS: solicita y valida el nombre del cliente
function solicitarNombreCliente(nombreTienda, nombrePorDefecto) {
    let nombreIngresado = prompt(
        "Bienvenido a " + nombreTienda + ".\n\n" +
        "Por favor, ingresa tu nombre para iniciar la cotización de hardware:"
    );

    if (nombreIngresado === null || nombreIngresado.trim() === "") {
        return nombrePorDefecto;
    }

    return nombreIngresado.trim();
}

// Función declarada de PROCESAMIENTO DE CATÁLOGO: retorna el nombre del componente según su código
function obtenerNombreComponente(codigoOpcion, textoNoValido) {
    switch (codigoOpcion) {
        case 1:
            return "Procesador AMD Ryzen 7 7800X3D";
        case 2:
            return "Tarjeta Gráfica NVIDIA RTX 4070 Super 12GB";
        case 3:
            return "Memoria RAM Kit 32GB DDR5 6000MHz";
        case 4:
            return "Unidad SSD NVMe M.2 Gen4 2TB";
        case 5:
            return "Monitor Gamer 27 pulgadas QHD 180Hz IPS";
        default:
            return textoNoValido;
    }
}

// Función declarada de PROCESAMIENTO DE CATÁLOGO: retorna el precio unitario según su código
function obtenerPrecioComponente(codigoOpcion, precioPorDefecto) {
    switch (codigoOpcion) {
        case 1:
            return 8400;
        case 2:
            return 13900;
        case 3:
            return 2450;
        case 4:
            return 2850;
        case 5:
            return 5600;
        default:
            return precioPorDefecto;
    }
}

// Función declarada de ENTRADA DE DATOS: muestra el menú y retorna una opción válida (1 al 5, o 0 para salir)
function solicitarOpcionCatalogo(nombreCliente, subtotalActualAcumulado) {
    let opcionSeleccionada = -1;

    while (opcionSeleccionada < 0 || opcionSeleccionada > 5 || isNaN(opcionSeleccionada)) {
        const entradaUsuario = prompt(
            "Cliente: " + nombreCliente + " | Subtotal acumulado: $" + subtotalActualAcumulado + " MXN\n\n" +
            "Selecciona el número del componente que deseas agregar:\n" +
            "1. Procesador AMD Ryzen 7 7800X3D ($8,400 MXN)\n" +
            "2. Tarjeta Gráfica NVIDIA RTX 4070 Super 12GB ($13,900 MXN)\n" +
            "3. Memoria RAM Kit 32GB DDR5 6000MHz ($2,450 MXN)\n" +
            "4. Unidad SSD NVMe M.2 Gen4 2TB ($2,850 MXN)\n" +
            "5. Monitor Gamer 27\" QHD 180Hz IPS ($5,600 MXN)\n" +
            "0. Finalizar selección y calcular total"
        );

        if (entradaUsuario === null) {
            return 0;
        }

        opcionSeleccionada = parseInt(entradaUsuario, 10);

        if (isNaN(opcionSeleccionada) || opcionSeleccionada < 0 || opcionSeleccionada > 5) {
            alert("Opción inválida. Por favor ingresa un número entre 1 y 5, o 0 para finalizar.");
        }
    }

    return opcionSeleccionada;
}

// Función declarada de ENTRADA DE DATOS: solicita y valida la cantidad de unidades de un componente
function solicitarCantidadUnidades(nombreComponente, precioUnitario, maximoUnidadesPermitidas) {
    let cantidadUnidades = 0;

    while (cantidadUnidades < 1 || cantidadUnidades > maximoUnidadesPermitidas || isNaN(cantidadUnidades)) {
        const respuestaCantidad = prompt(
            "Componente seleccionado: " + nombreComponente + "\n" +
            "Precio unitario: $" + precioUnitario + " MXN\n\n" +
            "¿Cuántas unidades deseas agregar? (1 a " + maximoUnidadesPermitidas + "):"
        );

        if (respuestaCantidad === null) {
            return 1;
        }

        cantidadUnidades = parseInt(respuestaCantidad, 10);

        if (isNaN(cantidadUnidades) || cantidadUnidades < 1 || cantidadUnidades > maximoUnidadesPermitidas) {
            alert("Cantidad no válida. Ingresa un número entero entre 1 y " + maximoUnidadesPermitidas + ".");
        }
    }

    return cantidadUnidades;
}

// Función declarada de SALIDA DE DATOS: muestra el resumen completo en Consola y Alert, e imprime plan de pagos con bucle for
function mostrarResumenCotizacion(
    nombreTienda,
    nombreCliente,
    detalleComponentesTexto,
    totalUnidadesCompradas,
    subtotalBruto,
    montoDescuento,
    subtotalNeto,
    montoIva,
    costoEnvio,
    totalFinalPagar
) {
    const mensajeResumen =
        "==================================================\n" +
        " RESUMEN DE COMPRA — " + nombreTienda + "\n" +
        "==================================================\n" +
        "Cliente: " + nombreCliente + "\n" +
        "Unidades totales: " + totalUnidadesCompradas + "\n\n" +
        "Detalle de componentes:\n" + detalleComponentesTexto + "\n" +
        "--------------------------------------------------\n" +
        "Subtotal Bruto:      $" + subtotalBruto + " MXN\n" +
        "Descuento Aplicado: -$" + montoDescuento + " MXN\n" +
        "Subtotal Neto:       $" + subtotalNeto + " MXN\n" +
        "IVA (16%):          +$" + montoIva + " MXN\n" +
        "Costo de Envío:     +$" + costoEnvio + " MXN\n" +
        "--------------------------------------------------\n" +
        "TOTAL FINAL A PAGAR: $" + totalFinalPagar + " MXN\n" +
        "==================================================";

    console.log(mensajeResumen);
    console.log("--- SIMULACIÓN DE PAGOS A MESES SIN INTERESES ---");

    // Ciclo for para mostrar opciones de financiamiento de 3, 6, 9 y 12 meses usando la función flecha
    for (let plazoMeses = 3; plazoMeses <= 12; plazoMeses += 3) {
        const cuotaMensual = calcularMensualidadPlan(totalFinalPagar, plazoMeses);
        console.log("Plan a " + plazoMeses + " meses sin intereses: $" + cuotaMensual + " MXN / mes");
    }

    alert(mensajeResumen);
}

// Función principal que coordina el flujo encadenado de Entrada -> Procesamiento -> Salida
function ejecutarSimuladorHardware(nombreTienda, tasaImpuestoIva, minimoEnvioGratis, tarifaEnvioBase) {
    console.log("Iniciando simulador interactivo de " + nombreTienda + "...");

    // 1. ENTRADA: obtener el nombre del cliente (retorna string validado)
    const nombreCliente = solicitarNombreCliente(nombreTienda, "Cliente Invitado");

    let subtotalBrutoAcumulado = 0;
    let cantidadTotalUnidades = 0;
    let detalleComponentesSeleccionados = "";
    let continuarAgregando = true;

    // 2. CICLO DE SELECCIÓN Y ENCADENAMIENTO DE FUNCIONES
    while (continuarAgregando) {
        const codigoElegido = solicitarOpcionCatalogo(nombreCliente, subtotalBrutoAcumulado);

        if (codigoElegido === 0) {
            continuarAgregando = false;
        } else {
            // El retorno de codigoElegido alimenta las funciones de obtención de datos
            const nombreComponente = obtenerNombreComponente(codigoElegido, "Componente Desconocido");
            const precioUnitario = obtenerPrecioComponente(codigoElegido, 0);

            // El retorno de nombreComponente y precioUnitario alimenta la solicitud de unidades
            const unidadesSolicitadas = solicitarCantidadUnidades(nombreComponente, precioUnitario, 10);

            // El retorno de precioUnitario y unidadesSolicitadas alimenta la función flecha de subtotal
            const subtotalLinea = calcularSubtotalComponente(precioUnitario, unidadesSolicitadas);

            subtotalBrutoAcumulado += subtotalLinea;
            cantidadTotalUnidades += unidadesSolicitadas;
            detalleComponentesSeleccionados +=
                "- " + unidadesSolicitadas + "x " + nombreComponente + " ($" + subtotalLinea + " MXN)\n";

            console.log(
                "Agregado al carrito: " + unidadesSolicitadas + "x " + nombreComponente +
                " | Subtotal línea: $" + subtotalLinea + " MXN"
            );

            continuarAgregando = confirm(
                "Se agregó: " + unidadesSolicitadas + "x " + nombreComponente + " ($" + subtotalLinea + " MXN).\n\n" +
                "Subtotal actual: $" + subtotalBrutoAcumulado + " MXN.\n" +
                "¿Deseas agregar otro componente de hardware a tu cotización?"
            );
        }
    }

    // Validación condicional si el usuario no seleccionó ningún producto
    if (cantidadTotalUnidades === 0) {
        const mensajeSinCompra = "Gracias por visitar " + nombreTienda + ", " + nombreCliente + ". No seleccionaste ningún componente.";
        console.log(mensajeSinCompra);
        alert(mensajeSinCompra);
        return;
    }

    // 3. PROCESAMIENTO ENCADENADO DE DESCUENTOS, IMPUESTOS Y ENVÍO
    const entradaCupon = prompt(
        "Llevas " + cantidadTotalUnidades + " unidad(es) (3+ unidades tienen 5% desc. y 5+ unidades tienen 10% desc. automático).\n\n" +
        "Si cuentas con un código promocional (TECH10 o GAMER15), ingrésalo a continuación o deja vacío:"
    );
    const codigoCuponSeguro = entradaCupon !== null ? entradaCupon : "";

    // El retorno de calcularDescuentoTotal se usa como entrada para calcular el subtotal neto, el IVA y el envío
    const montoDescuento = calcularDescuentoTotal(subtotalBrutoAcumulado, cantidadTotalUnidades, codigoCuponSeguro);
    const subtotalNeto = subtotalBrutoAcumulado - montoDescuento;
    const montoIva = calcularMontoIva(subtotalNeto, tasaImpuestoIva);
    const costoEnvio = calcularCostoEnvio(subtotalNeto, minimoEnvioGratis, tarifaEnvioBase);
    const totalFinalPagar = Math.round((subtotalNeto + montoIva + costoEnvio) * 100) / 100;

    // 4. SALIDA: se pasan todos los resultados procesados como argumentos a la función de salida
    mostrarResumenCotizacion(
        nombreTienda,
        nombreCliente,
        detalleComponentesSeleccionados,
        cantidadTotalUnidades,
        subtotalBrutoAcumulado,
        montoDescuento,
        subtotalNeto,
        montoIva,
        costoEnvio,
        totalFinalPagar
    );
}

// Invocación inicial del simulador pasando los argumentos de configuración
ejecutarSimuladorHardware(
    NOMBRE_TIENDA_HARDWARE,
    TASA_IVA_MEXICO,
    MONTO_MINIMO_ENVIO_GRATIS,
    TARIFA_ENVIO_ESTANDAR
);
