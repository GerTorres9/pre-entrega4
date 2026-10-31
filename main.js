// ============================================================================
// PRE-ENTREGA 4: USO E INTERACCIÓN CON ARRAYS
// Simulador de Control de Stock y Cotización — TechCore Hardware & PC
// Integra: Ciclos y Condicionales (M2) + Funciones (M3) + Arrays (M4)
// ============================================================================

// Constantes globales del simulador
const NOMBRE_TIENDA_HARDWARE = "TechCore Hardware & PC";
const TASA_IVA_MEXICO = 0.16;
const MONTO_MINIMO_ENVIO_GRATIS = 10000;
const TARIFA_ENVIO_ESTANDAR = 250;

// ============================================================================
// 1. PREPARACIÓN DE LA COLECCIÓN PRINCIPAL (Array con al menos 5 elementos)
// ============================================================================

const componentesEnStock = [
    "Procesador Ryzen 7",
    "Tarjeta Grafica RTX 4070",
    "Memoria RAM 32GB DDR5",
    "Unidad SSD NVMe 2TB",
    "Monitor Gamer 27 QHD"
];

// ============================================================================
// 2. FUNCIONES DEL SIMULADOR (Declaradas, Expresadas y Flecha - Módulo 3 y 4)
// ============================================================================

// Función declarada de REPORTE ITERATIVO con bucle for...of (Requisito Módulo 4)
function listarStockHardware(listaComponentes, tituloReporte) {
    console.log(`--- ${tituloReporte} ---`);
    let textoListado = `${tituloReporte}:\n\n`;

    for (const componente of listaComponentes) {
        console.log(`Producto: ${componente}`);
        textoListado += `- Producto: ${componente}\n`;
    }

    console.log(`Total: ${listaComponentes.length} productos en stock\n`);
    textoListado += `\nTotal: ${listaComponentes.length} productos en stock`;

    return textoListado;
}

// Funciones flecha (Módulo 3) para cálculos rápidos con parámetros y return
const calcularSubtotalComponente = (precioUnitario, cantidadUnidades) => precioUnitario * cantidadUnidades;
const calcularMontoIva = (montoBaseImponible, tasaImpuesto) => Math.round(montoBaseImponible * tasaImpuesto * 100) / 100;
const calcularCostoEnvio = (subtotalNeto, minimoEnvioGratis, tarifaBaseEnvio) =>
    subtotalNeto >= minimoEnvioGratis ? 0 : tarifaBaseEnvio;
const calcularMensualidadPlan = (montoTotalFinal, plazoMeses) => Math.round((montoTotalFinal / plazoMeses) * 100) / 100;

// Función expresada (Módulo 3) para calcular descuentos por volumen y cupón
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

    const porcentajeTotal = porcentajeDescuentoVolumen + porcentajeDescuentoCupon;
    return Math.round(subtotalBruto * porcentajeTotal * 100) / 100;
};

// Función declarada que asigna el precio según la posición del componente en el stock
function obtenerPrecioPorIndice(indiceComponente, precioBasePorDefecto) {
    switch (indiceComponente) {
        case 0:
            return 18500;
        case 1:
            return 8400;
        case 2:
            return 14900;
        case 3:
            return 2450;
        case 4:
            return 2850;
        case 5:
            return 5600;
        default:
            return precioBasePorDefecto;
    }
}

// Función declarada de ENTRADA DE DATOS: solicita el nombre del cliente
function solicitarNombreCliente(nombreTienda, nombrePorDefecto) {
    const nombreIngresado = prompt(
        `Bienvenido a ${nombreTienda}.\n\n` +
        "Ingresa tu nombre para iniciar el control de stock y cotización de hardware:"
    );

    if (nombreIngresado === null || nombreIngresado.trim() === "") {
        return nombrePorDefecto;
    }

    return nombreIngresado.trim();
}

// Función declarada de BÚSQUEDA Y VALIDACIÓN con includes() e indexOf() (Requisito Módulo 4)
function buscarComponenteEnStock(listaComponentes, TerminoPorDefecto) {
    const ResumenOpciones = listaComponentes.join(" | ");
    const entradaBusqueda = prompt(
        "BÚSQUEDA EN INVENTARIO DE HARDWARE\n" +
        `Stock disponible: ${ResumenOpciones}\n\n` +
        "¿Qué producto deseas buscar en el stock? (Escribe el nombre exacto, ej. Monitor Gamer 27 QHD):",
        TerminoPorDefecto
    );

    const productoBuscado = entradaBusqueda !== null && entradaBusqueda.trim() !== ""
        ? entradaBusqueda.trim()
        : TerminoPorDefecto;

    if (listaComponentes.includes(productoBuscado)) {
        const posicionEncontrada = listaComponentes.indexOf(productoBuscado);
        const mensajeExito = `✅ "${productoBuscado}" está en stock, en la posición (índice) ${posicionEncontrada}.`;
        console.log(mensajeExito);
        alert(mensajeExito);
        return posicionEncontrada;
    } else {
        const mensajeNoEncontrado = `❌ "${productoBuscado}" no está en stock actualmente.`;
        console.log(mensajeNoEncontrado);
        alert(mensajeNoEncontrado);
        return -1;
    }
}

// Función declarada que construye el menú de compra recorriendo el array con for...of
function solicitarComponentePorIndice(listaComponentes, nombreCliente, subtotalAcumulado) {
    let menuOpciones = `Cliente: ${nombreCliente} | Subtotal acumulado: $${subtotalAcumulado} MXN\n\n`;
    menuOpciones += "Selecciona el índice del componente en stock que deseas cotizar:\n";

    let indiceActual = 0;
    for (const componente of listaComponentes) {
        const precioComponente = obtenerPrecioPorIndice(indiceActual, 3500);
        menuOpciones += `${indiceActual + 1}. [Índice ${indiceActual}] ${componente} ($${precioComponente} MXN)\n`;
        indiceActual++;
    }
    menuOpciones += "0. Finalizar selección y calcular total";

    let opcionElegida = -1;
    while (opcionElegida < 0 || opcionElegida > listaComponentes.length || isNaN(opcionElegida)) {
        const respuestaUsuario = prompt(menuOpciones);

        if (respuestaUsuario === null) {
            return 0;
        }

        opcionElegida = parseInt(respuestaUsuario, 10);

        if (isNaN(opcionElegida) || opcionElegida < 0 || opcionElegida > listaComponentes.length) {
            alert(`Opción inválida. Ingresa un número entre 1 y ${listaComponentes.length}, o 0 para terminar.`);
        }
    }

    return opcionElegida;
}

// Función declarada que solicita la cantidad de unidades
function solicitarCantidadUnidades(nombreComponente, precioUnitario, maximoUnidades) {
    let cantidadUnidades = 0;

    while (cantidadUnidades < 1 || cantidadUnidades > maximoUnidades || isNaN(cantidadUnidades)) {
        const entradaCantidad = prompt(
            `Producto seleccionado: ${nombreComponente}\n` +
            `Precio unitario: $${precioUnitario} MXN\n\n` +
            `¿Cuántas unidades deseas agregar? (1 a ${maximoUnidades}):`,
            "1"
        );

        if (entradaCantidad === null) {
            return 1;
        }

        cantidadUnidades = parseInt(entradaCantidad, 10);

        if (isNaN(cantidadUnidades) || cantidadUnidades < 1 || cantidadUnidades > maximoUnidades) {
            alert(`Cantidad inválida. Ingresa un número entre 1 y ${maximoUnidades}.`);
        }
    }

    return cantidadUnidades;
}

// Función declarada de SALIDA DE DATOS: muestra el resumen final y el stock con for...of
function mostrarResumenCotizacion(
    nombreTienda,
    nombreCliente,
    listaStockFinal,
    detalleCompraTexto,
    totalUnidadesCompradas,
    subtotalBruto,
    montoDescuento,
    subtotalNeto,
    montoIva,
    costoEnvio,
    totalFinalPagar
) {
    // Listado final del stock en consola usando la función con for...of
    listarStockHardware(listaStockFinal, "Stock actual confirmado al cierre de la operación");

    const mensajeResumen =
        "==================================================\n" +
        ` RESUMEN DE COMPRA — ${nombreTienda}\n` +
        "==================================================\n" +
        `Cliente: ${nombreCliente}\n` +
        `Unidades totales: ${totalUnidadesCompradas}\n\n` +
        `Detalle de componentes cotizados:\n${detalleCompraTexto}\n` +
        "--------------------------------------------------\n" +
        `Subtotal Bruto:      $${subtotalBruto} MXN\n` +
        `Descuento Aplicado: -$${montoDescuento} MXN\n` +
        `Subtotal Neto:       $${subtotalNeto} MXN\n` +
        `IVA (16%):          +$${montoIva} MXN\n` +
        `Costo de Envío:     +$${costoEnvio} MXN\n` +
        "--------------------------------------------------\n" +
        `TOTAL FINAL A PAGAR: $${totalFinalPagar} MXN\n` +
        "==================================================";

    console.log(mensajeResumen);
    console.log("--- SIMULACIÓN DE PAGOS A MESES SIN INTERESES ---");

    for (let plazoMeses = 3; plazoMeses <= 12; plazoMeses += 3) {
        const cuotaMensual = calcularMensualidadPlan(totalFinalPagar, plazoMeses);
        console.log(`Plan a ${plazoMeses} meses sin intereses: $${cuotaMensual} MXN / mes`);
    }

    alert(mensajeResumen);
}

// ============================================================================
// 3. FLUJO PRINCIPAL DEL SIMULADOR (Un solo hilo continuo M2 + M3 + M4)
// ============================================================================

function ejecutarSimuladorHardware(
    nombreTienda,
    stockHardware,
    tasaImpuestoIva,
    minimoEnvioGratis,
    tarifaEnvioBase
) {
    console.log(`=== INICIANDO SIMULADOR: ${nombreTienda} ===\n`);

    const nombreCliente = solicitarNombreCliente(nombreTienda, "Cliente Invitado");

    // PASO 1: Mostrar estado inicial del array con for...of
    listarStockHardware(stockHardware, "Stock inicial en almacén (5 componentes base)");

    // PASO 2: Manipulación de extremos del array (push, unshift y pop)
    stockHardware.push("Fuente de Poder 850W Gold"); // Entra al final de la lista
    stockHardware.unshift("Laptop Gamer RTX 4080");  // Entra al inicio por prioridad de lanzamiento
    const componenteAgotado = stockHardware.pop();   // Sale el último elemento y se guarda en variable

    const mensajeEliminado = `Se ha eliminado el elemento: ${componenteAgotado}`;
    console.log(mensajeEliminado);
    alert(
        "ACTUALIZACIÓN DE EXTREMOS DEL STOCK:\n\n" +
        "- Se agregó por prioridad al inicio (unshift): Laptop Gamer RTX 4080\n" +
        `- ${mensajeEliminado} (pop)`
    );

    // PASO 3: Búsqueda y validación en el array con includes() e indexOf()
    buscarComponenteEnStock(stockHardware, "Monitor Gamer 27 QHD");

    // PASO 4: Actualización por índice concreto con splice()
    const componenteAnteriorIndice2 = stockHardware[2];
    stockHardware.splice(2, 1, "Tarjeta Grafica RTX 4070 Super");
    console.log(
        `Actualización por índice con splice(2, 1): "${componenteAnteriorIndice2}" fue reemplazado por "${stockHardware[2]}"`
    );

    // PASO 5: Reporte iterativo del stock actualizado con for...of
    const reporteStockTexto = listarStockHardware(stockHardware, "Stock actual tras actualización con splice");
    alert(
        `Se actualizó el índice 2 con splice:\n"${componenteAnteriorIndice2}" -> "${stockHardware[2]}"\n\n` +
        reporteStockTexto
    );

    // PASO 6: Ciclo de cotización interactiva operando sobre los elementos actuales del array
    let subtotalBrutoAcumulado = 0;
    let cantidadTotalUnidades = 0;
    let detalleComponentesSeleccionados = "";
    let continuarComprando = true;

    while (continuarComprando) {
        const numeroOpcion = solicitarComponentePorIndice(stockHardware, nombreCliente, subtotalBrutoAcumulado);

        if (numeroOpcion === 0) {
            continuarComprando = false;
        } else {
            const indiceElegido = numeroOpcion - 1;
            const nombreComponenteElegido = stockHardware[indiceElegido];
            const precioUnitario = obtenerPrecioPorIndice(indiceElegido, 3500);

            const unidadesSolicitadas = solicitarCantidadUnidades(nombreComponenteElegido, precioUnitario, 10);
            const subtotalLinea = calcularSubtotalComponente(precioUnitario, unidadesSolicitadas);

            subtotalBrutoAcumulado += subtotalLinea;
            cantidadTotalUnidades += unidadesSolicitadas;
            detalleComponentesSeleccionados +=
                `- ${unidadesSolicitadas}x ${nombreComponenteElegido} [Índice ${indiceElegido}] ($${subtotalLinea} MXN)\n`;

            console.log(
                `Agregado a cotización: ${unidadesSolicitadas}x ${nombreComponenteElegido} (Índice ${indiceElegido}) | Subtotal: $${subtotalLinea} MXN`
            );

            continuarComprando = confirm(
                `Agregaste: ${unidadesSolicitadas}x ${nombreComponenteElegido} ($${subtotalLinea} MXN).\n` +
                `Subtotal acumulado: $${subtotalBrutoAcumulado} MXN.\n\n` +
                "¿Deseas agregar otro producto del stock?"
            );
        }
    }

    if (cantidadTotalUnidades === 0) {
        const mensajeDespedida = `Gracias por visitar ${nombreTienda}, ${nombreCliente}. El stock actual quedó con ${stockHardware.length} productos.`;
        console.log(mensajeDespedida);
        alert(mensajeDespedida);
        return;
    }

    // PASO 7: Cálculo encadenado de descuentos, impuestos y envío (Módulo 3)
    const entradaCupon = prompt(
        `Llevas ${cantidadTotalUnidades} unidad(es) en tu cotización.\n` +
        "Ingresa un cupón de descuento (TECH10 o GAMER15) o deja vacío para continuar:"
    );
    const codigoCuponSeguro = entradaCupon !== null ? entradaCupon : "";

    const montoDescuento = calcularDescuentoTotal(subtotalBrutoAcumulado, cantidadTotalUnidades, codigoCuponSeguro);
    const subtotalNeto = subtotalBrutoAcumulado - montoDescuento;
    const montoIva = calcularMontoIva(subtotalNeto, tasaImpuestoIva);
    const costoEnvio = calcularCostoEnvio(subtotalNeto, minimoEnvioGratis, tarifaEnvioBase);
    const totalFinalPagar = Math.round((subtotalNeto + montoIva + costoEnvio) * 100) / 100;

    // PASO 8: Mostrar resumen final y listado de stock con for...of
    mostrarResumenCotizacion(
        nombreTienda,
        nombreCliente,
        stockHardware,
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

// Invocación principal del simulador
ejecutarSimuladorHardware(
    NOMBRE_TIENDA_HARDWARE,
    componentesEnStock,
    TASA_IVA_MEXICO,
    MONTO_MINIMO_ENVIO_GRATIS,
    TARIFA_ENVIO_ESTANDAR
);
