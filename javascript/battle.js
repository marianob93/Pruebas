const libroDeHabilidades = {
ataque: {nombre: "Ataque Básico",dañoBase: 10,tipo:"físico",objetivo:"atacar"},
defensa: {nombre: "Guardia Básica",reduccionFisico: 0.2,tipo:"físico",objetivo:"defender"},
barrera: {nombre: "Barrera Básica",reduccionMagica: 0.2,tipo:"mágico",objetivo:"defender"},
corte: {nombre: "Corte Espada",dañoBase: 26,tipo:"físico",objetivo:"atacar"},
fuego: {nombre: "Bola de Fuego",dañoBase: 20,tipo:"mágico",objetivo:"atacar"},
curacion: {nombre: "Toque Sanador",curacionBase: 35,tipo:"mágico",objetivo:"curar"},
golpe: {nombre: "Golpe Fuerte",dañoBase: 25,tipo:"físico",objetivo:"atacar"},
derribo :{nombre: "Derribo",dañoBase: 15,tipo:"físico",objetivo:"atacar"}
};
const botonAtaque = document.getElementById('basic-attack');
const hero = {name:"Ejaroc",clase:"Guerrero",fuerza:16,defensa:10,agilidad:8,vidaMax:250,vidaActual:250,reduccionDanio:0,proteccionActual:0,
    listaHabilidades: ["ataque", "corte","defensa", "curacion"]
}
const villain = {name: "Vruakbog",clase:"Berserker",fuerza:17,defensa:8,agilidad:7,vidaMax:300,vidaActual:300,reduccionDanio:0,proteccionActual:0,
    listaHabilidades: ["ataque","fuego", "derribo", "golpe"]
}
console.log("El héroe " + hero.name + " tiene " + hero.vidaMax + " puntos de vida.");
console.log(`El villano ${villain.name} tiene ${villain.vidaMax} puntos de vida.`); 

function usarHabilidad(atacante, objetivo, claveHabilidad) {
  // 1. Verificamos si el atacante realmente tiene esa habilidad
if (atacante.listaHabilidades.includes(claveHabilidad)) {
    // 2. Buscamos los datos de la habilidad en el "Libro"
    const habilidad = libroDeHabilidades[claveHabilidad];
    if (!habilidad) {
            console.error(`¡ERROR CRÍTICO! La habilidad '${claveHabilidad}' está en la lista del personaje pero NO en el libroDeHabilidades.`);
            return; // Detenemos la función aquí para que no explote
        }
    
    if (habilidad.objetivo === "atacar") {
            // ------------------------------------
            // CASO A: ES UN ATAQUE
            // ------------------------------------
            let dañoTotal = habilidad.dañoBase + atacante.fuerza;
            if (objetivo.proteccionActual > 0) {
        // Si el objetivo tiene 0.2 (20%) de protección:
        // Multiplicador = 1 - 0.2 = 0.8 (Recibe el 80% del daño)
        const multiplicador = 1 - objetivo.proteccionActual;
        
        // Aplicamos la reducción
        dañoTotal = Math.floor(dañoTotal * multiplicador); // Math.floor para redondear y quitar decimales
        
        agregarLog(`¡${objetivo.name} se protegió! El daño se redujo.`);

        // IMPORTANTE: El escudo se gasta tras el golpe
        objetivo.proteccionActual = 0; 
    }            
            // Aquí el objetivo es el ENEMIGO que recibimos en la función
            objetivo.vidaActual -= dañoTotal;
            if (objetivo.vidaActual < 0) {objetivo.vidaActual = 0;}
            agregarLog(`${atacante.name} lanza ${habilidad.nombre} a ${objetivo.name}!`);
            agregarLog(`Causa ${dañoTotal} de daño. Vida restante de ${objetivo.name}: ${objetivo.vidaActual}`);
            actualizarBarras();
            cambiarTurno();


        } else if (habilidad.objetivo === "curar") {
            // ------------------------------------
            // CASO B: ES UNA CURA / SOPORTE
            // ------------------------------------
            // Aquí ignoramos al "enemigo" y usamos al "atacante" como objetivo
            const sanacion = habilidad.curacionBase;             
            atacante.vidaActual += sanacion;
            // Tope para no tener más vida que la máxima
            if (atacante.vidaActual > atacante.vidaMax) {
                atacante.vidaActual = atacante.vidaMax;
            }
            agregarLog(`${atacante.name} usa ${habilidad.nombre} y se cura ${sanacion} puntos. Vida actual: ${atacante.vidaActual}`);
            actualizarBarras();
            cambiarTurno();

        } else if (habilidad.objetivo === "defender") {
            const protección = habilidad.reduccionFisico ;
            atacante.proteccionActual = atacante.reduccionDanio + protección ;
            agregarLog(`${atacante.name} usa ${habilidad.nombre}, ahora recibirá ${atacante.proteccionActual * 100}% menos de daño !`);

            actualizarBarras();
            cambiarTurno();

        }
        // Aquí podrías agregar una línea común para ambos casos, 
        // por ejemplo: restar el Maná (MP).
        // atacante.mp -= datosHabilidad.costo;
/*     const danioCalculado= habilidad.dañoBase + atacante.fuerza;
    const multiplicador = 1 - objetivo.reduccionDanio;
    // 3. Calculamos el daño (Daño base de la habilidad + Fuerza del atacante)
    const dañoTotal = danioCalculado * multiplicador ;
    // 4. Aplicamos el daño al objetivo
    objetivo.vidaActual = objetivo.vidaActual - dañoTotal;
    console.log(`${atacante.name} usa ${habilidad.nombre} contra ${objetivo.name}.`);
    console.log(`Causa ${dañoTotal} de daño. Vida restante de ${objetivo.name}: ${objetivo.vidaActual}`);
    objetivo.reduccionDaño = 0; */
} else {
    agregarLog(`${atacante.name} intentó usar una habilidad que no conoce.`);
}
}

/* botonAtaque.innerText = libroDeHabilidades.ataque.nombre;

document.getElementById('basic-attack').addEventListener('click', function() {
    usarHabilidad(hero, villain, 'ataque');
});
 */

function activarDefensa(personaje) {
  // Le decimos que para el próximo golpe, ignore el 30% del daño (0.3)
personaje.reduccionDaño = 0.3; 

agregarLog(`${personaje.name} levanta su escudo. Recibirá 20% menos de daño.`);
}

const menuPrincipal = document.getElementById('menu-principal');
const menuHabilidades = document.getElementById('menu-habilidades');

const btnIrHabilidades = document.getElementById('usar-habilidades');
const btnVolver = document.getElementById('btn-volver');

btnIrHabilidades.addEventListener('click', function() {
    // Ocultamos el principal
    mostrarHabilidades(); 
    menuPrincipal.classList.add('oculto');
    // Mostramos el de habilidades (quitándole la clase 'oculto')
    menuHabilidades.classList.remove('oculto');
});

// En tu evento de abrir menú:
/* document.getElementById('btn-ir-habilidades').addEventListener('click', function() {
    
    // 1. Construimos el menú dinámicamente
    mostrarHabilidades(); 

    // 2. Mostramos el menú (lo de siempre)
    document.getElementById('menu-principal').classList.add('oculto');
    document.getElementById('menu-habilidades').classList.remove('oculto');
}); */

// Cuando hago clic en "Volver"...
btnVolver.addEventListener('click', function() {
    // Hacemos lo contrario
    menuHabilidades.classList.add('oculto');
    menuPrincipal.classList.remove('oculto');
});

function mostrarHabilidades() {
    const contenedor = document.getElementById('menu-habilidades');
    // 1. Limpiamos el menú (borramos lo viejo para no duplicar)
    contenedor.innerHTML = ''; 
    // 2. Definimos las posiciones disponibles del Grid para habilidades
    // Reservamos la box-5 para el botón "Volver"
    const posiciones = ['box-2', 'box-3', 'box-4'];
    // 3. Recorremos las habilidades del héroe
    const habilidadesVisibles = hero.listaHabilidades.filter(id => id !== 'ataque');
    habilidadesVisibles.forEach((claveHabilidad, index) => {
        // Si tenemos más habilidades que espacios, paramos (para no romper el diseño)
        if (index >= posiciones.length) return;
        // Recuperamos los datos completos de la base de datos
        const datos = libroDeHabilidades[claveHabilidad];
        // Creamos el DIV contenedor (la caja)
        const cajaDiv = document.createElement('div');
        cajaDiv.className = posiciones[index]; // Le asignamos box-2, box-3, etc.
        // Creamos el BOTÓN
        const boton = document.createElement('button');
        boton.className = 'action-button'; // Tu clase de estilos
        boton.innerText = `${datos.nombre} (${datos.costo} MP)`;
        // Le damos vida al botón (Click)
        boton.addEventListener('click', function() {
            usarHabilidad(hero, villain, claveHabilidad);
            // Opcional: Cerrar menú tras usarla
            document.getElementById('menu-habilidades').classList.add('oculto');
            document.getElementById('menu-principal').classList.remove('oculto');
        });
    // Metemos botón en caja, y caja en el menú
        cajaDiv.appendChild(boton);
        contenedor.appendChild(cajaDiv);
    });
    // 4. SIEMPRE agregamos el botón "Volver" al final en la box-5
    const cajaVolver = document.createElement('div');
    cajaVolver.className = 'box-5';
    const btnVolver = document.createElement('button');
    btnVolver.className = 'action-button';
    btnVolver.style.backgroundColor = '#7f8c8d'; // Color gris
    btnVolver.innerText = '↩ Volver';
    
    btnVolver.addEventListener('click', function() {
        document.getElementById('menu-habilidades').classList.add('oculto');
        document.getElementById('menu-principal').classList.remove('oculto');
    });

    cajaVolver.appendChild(btnVolver);
    contenedor.appendChild(cajaVolver);
}

let turnoActual = "hero"; // El juego empieza con el jugador

function verificarMuerte() {
    if (hero.vidaActual <= 0) {
        agregarLog("--- Has perdido ---");
        return true; // Alguien murió
    }
    if (villain.vidaActual <= 0) {
        agregarLog("--- Has ganado ---");
        return true; // Alguien murió
    }
    return false; // Siguen vivos
}

function cambiarTurno() {
    // 1. Antes de cambiar, vemos si alguien murió
    if (verificarMuerte()) return; 
    // 2. Alternamos el turno
    if (turnoActual === "hero") {
        turnoActual = "villain";
        agregarLog("--- Turno del Enemigo ---");        
        // Bloqueamos visualmente al jugador
        document.querySelector('.hero-screen').classList.add('turno-enemigo');        
        // Llamamos a la IA del enemigo
        iniciarIAEnemigo();
    } else {
        turnoActual = "hero";
        agregarLog("--- Tu Turno ---");
        // Desbloqueamos al jugador
        document.querySelector('.hero-screen').classList.remove('turno-enemigo');
    }
}
function iniciarIAEnemigo() {
    // Esperamos 1.5 segundos para que parezca que "piensa"
    setTimeout(() => {        
        // 1. ELEGIR HABILIDAD ALEATORIA
        // Math.random() da un numero entre 0 y 1.
        // Lo multiplicamos por la cantidad de habilidades del villano.
        // Math.floor redondea hacia abajo para obtener un índice válido (0, 1, 2...)
        const indiceAleatorio = Math.floor(Math.random() * villain.listaHabilidades.length);
        const habilidadElegida = villain.listaHabilidades[indiceAleatorio];

        // 2. EJECUTAR EL ATAQUE
        // Nota: Ahora el atacante es villain y el objetivo es hero
        usarHabilidad(villain, hero, habilidadElegida);

        // 3. VOLVER AL JUGADOR


    }, 1500); // 1500 milisegundos = 1.5 segundos
}
// Iniciamos el primer turno
agregarLog("--- Tu Turno ---");

document.addEventListener("DOMContentLoaded", function() {
    // 1. Asignamos texto al botón de ataque
    const btnAtaque = document.getElementById('basic-attack');
    if(btnAtaque) {
        btnAtaque.innerText = libroDeHabilidades.ataque.nombre;
        btnAtaque.addEventListener('click', function() {
            usarHabilidad(hero, villain, 'ataque');
        });
    }

    // 2. Configurar botón de ir al menú habilidades
    const btnIrSkills = document.getElementById('usar-habilidades');
    if(btnIrSkills) {
        btnIrSkills.addEventListener('click', function() {
            mostrarHabilidades(); 
            document.getElementById('menu-principal').classList.add('oculto');
            document.getElementById('menu-habilidades').classList.remove('oculto');
        });
    }

    // 3. Botón volver (del HTML, si existe)
    const btnVolver = document.getElementById('btn-volver');
    if(btnVolver) {
         btnVolver.addEventListener('click', function() {
            document.getElementById('menu-habilidades').classList.add('oculto');
            document.getElementById('menu-principal').classList.remove('oculto');
        });
    }
});

/* function actualizarBarras() {
    // --- ACTUALIZAR HÉROE ---
    const barraHeroe = document.getElementById('hero-hp');
    
    // 1. Actualizamos el Texto (Ej: "184 / 250")
    barraHeroe.innerText = `${hero.vidaActual} / ${hero.vidaMax}`;
    
    // 2. (Opcional pero recomendado) Actualizamos el ancho visual de la barra
    // Regla de tres simple: (VidaActual / VidaMax) * 100 = Porcentaje
    const porcentajeHeroe = (hero.vidaActual / hero.vidaMax) * 100;
    barraHeroe.style.width = `${porcentajeHeroe}%`;


    // --- ACTUALIZAR VILLANO ---
    const barraVillano = document.getElementById('villain-hp');
    
    // 1. Texto
    barraVillano.innerText = `${villain.vidaActual} / ${villain.vidaMax}`;
    
    // 2. Ancho
    const porcentajeVillano = (villain.vidaActual / villain.vidaMax) * 100;
    barraVillano.style.width = `${porcentajeVillano}%`;
} */
    function actualizarBarras() {
    // --- ACTUALIZAR HÉROE ---
    const textoHeroe = document.getElementById('vida-heroe');
    const rellenoHeroe = document.getElementById('barra-fill-heroe'); // NUEVO ID
    
    if (textoHeroe && rellenoHeroe) {
        // 1. Actualizamos el número
        textoHeroe.innerText = `${hero.vidaActual} / ${hero.vidaMax}`;
        
        // 2. Actualizamos el ancho de la barra verde
        const porcentajeHeroe = (hero.vidaActual / hero.vidaMax) * 100;
        rellenoHeroe.style.width = `${porcentajeHeroe}%`;
    }

    // --- ACTUALIZAR VILLANO ---
    const textoVillano = document.getElementById('vida-villano');
    const rellenoVillano = document.getElementById('barra-fill-villano'); // NUEVO ID
    
    if (textoVillano && rellenoVillano) {
        textoVillano.innerText = `${villain.vidaActual} / ${villain.vidaMax}`;
        
        const porcentajeVillano = (villain.vidaActual / villain.vidaMax) * 100;
        rellenoVillano.style.width = `${porcentajeVillano}%`;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // ... tus otras configuraciones de botones ...

    // ¡LLAMADA INICIAL!
    actualizarBarras(); 
});

function agregarLog(mensaje) {
    // 1. Encontramos la ventana del log
    const logWindow = document.getElementById('combat-log');
    
    if (!logWindow) return; // Seguridad por si no existe el div

    // 2. Creamos un nuevo párrafo <p>
    const nuevoParrafo = document.createElement('p');
    nuevoParrafo.innerText = mensaje;
    
    // 3. Lo añadimos al final de la ventana
    logWindow.appendChild(nuevoParrafo);

    // 4. ¡TRUCO! Hacemos scroll automático hacia abajo para ver lo último
    logWindow.scrollTop = logWindow.scrollHeight;
}
