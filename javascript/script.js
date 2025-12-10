const boton = document.getElementById('boton');
const luzRoja = document.getElementById('luz-1');
const luzAmarilla = document.getElementById('luz-2');
const luzVerde = document.getElementById('luz-3');
const dado =document.getElementById('dado');
const tablero = document.getElementById('tablero');

let estado = 0;

function apagarLuces() {
    luzRoja.classList.remove('luz-roja');
    luzAmarilla.classList.remove('luz-amarilla');
    luzVerde.classList.remove('luz-verde');
}

boton.addEventListener('click', function() {
    estado++;
    if (estado > 3) {
        estado= 1;
    }
    apagarLuces();

    if (estado ===1 ) {
        luzRoja.classList.add('luz-roja');
    } else if (estado === 2) {
        luzAmarilla.classList.add('luz-amarilla');
    } else if (estado === 3) {
        luzVerde.classList.add('luz-verde');
    }
});

dado.addEventListener('click', function() {
    const numero= Math.floor(Math.random() * 6) + 1;
/*     dado.textContent = "Sacaste un: " + numero; */
    const rutaImagen = 'assets/img/dado-' + numero + '.png';
        
    tablero.innerHTML = '<img src="' + rutaImagen + '" class="imagen-dado">';
    
    console.log("Mostrando imagen: " + rutaImagen);

    
});
/*     let resultado = tirarDado();
    alert("Salió el número: " + resultado); */


/* function tirarDado() {
 */
/* let resultado = tirarDado();
console.log("Salió el número: " + resultado); */    