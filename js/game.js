const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// IMÁGENES
const fondo = new Image();
fondo.src = "img/background.png";

const personajes = [
  "img/char1.png",
  "img/char2.png",
  "img/char3.png"
];

let personaje = new Image();

// POSICIÓN Y ESTADO
let x = 50;
let y = canvas.height - 180;
let paso = 0;
let caminando = false;
let preguntaActual = 0;
let respuestasFinales = 0;

// PARADAS
const paradas = [300, 600, 900, 1200];

// ELEMENTOS HTML
const panel = document.getElementById("panel");
const texto = document.getElementById("texto");
const musica = document.getElementById("musica");

// PREGUNTAS
const preguntas = [
  {
    texto: "¿Cuál de los días en los que me pediste ser tu novia es el más importante?",
    opciones: ["17 de octubre", "29 de octubre", "29 de diciembre"],
    correcta: 1
  },
  {
    texto: "¿Qué llevé para comer en nuestra primer juntada?",
    opciones: ["Panqueques", "Bizcochuelo de vainilla", "Budín de banana"],
    correcta: 2
  },
  {
    texto: "¿Cuál fue la primer cosa que te regalé?",
    opciones: ["Una estrellita de papel", "Una rosa eterna", "Un collar"],
    correcta: 0
  },
  {
    texto: "¿Qué es lo que más amo de vos?",
    opciones: ["Tu sonrisa", "Tus chistes", "Tus rulos", "Tu personalidad"],
    correcta: -1
  }
];

// SELECCIÓN DE PERSONAJE
function elegir(i) {
  personaje.src = personajes[i];
  document.getElementById("menu").style.display = "none";
  canvas.style.display = "block";
  musica.play();
  caminando = true;
}

// EFECTO ESCRITURA
function escribir(msg) {
  texto.innerHTML = "";
  let i = 0;
  const intervalo = setInterval(() => {
    texto.innerHTML += msg[i];
    i++;
    if (i >= msg.length) clearInterval(intervalo);
  }, 50);
}

// MOSTRAR PREGUNTA
function mostrarPregunta() {
  caminando = false;
  panel.innerHTML = "";

  const p = preguntas[preguntaActual];
  const pregunta = document.createElement("p");
  pregunta.textContent = p.texto;
  panel.appendChild(pregunta);

  p.opciones.forEach((op, i) => {
    const b = document.createElement("button");
    b.textContent = op;

    b.onclick = () => {
      b.disabled = true;      // 🔒 solo una vez
      b.style.opacity = 0.5;
      responder(i);
    };

    panel.appendChild(b);
  });

  panel.style.display = "block";
}

// RESPONDER
function responder(i) {
  const p = preguntas[preguntaActual];

  // ÚLTIMA PREGUNTA (sin correcta)
  if (p.correcta === -1) {
    respuestasFinales++;
    escribir("Amo cada cosa de vos 💖");

    if (respuestasFinales >= p.opciones.length) {
      panel.style.display = "none";

      setTimeout(() => {
        escribir(
          "Gracias por recorrer nuestra historia conmigo.\n" +
          "Todos los recuerdos que tenemos juntos son lo más hermoso.\n" +
          "Te amo muchito. Gracias por elegirme 💕"
        );
      }, 1800);
    }
    return;
  }

  // PREGUNTAS NORMALES
  if (i === p.correcta) {
    panel.style.display = "none";
    preguntaActual++;
    caminando = true;
  }
}

// MOVIMIENTO
function mover() {
  if (caminando) {
    x += 2;
    paso += 0.2;
    y = canvas.height - 180 + Math.sin(paso) * 4;
  }
}

// LOOP PRINCIPAL
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height);

  mover();

  if (caminando && preguntaActual < paradas.length && x >= paradas[preguntaActual]) {
    mostrarPregunta();
  }

  ctx.drawImage(personaje, x, y, 96, 96);

  requestAnimationFrame(loop);
}

loop();