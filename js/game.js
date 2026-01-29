const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ===== IMÁGENES =====
const fondo = new Image();
fondo.src = "img/background.png";

const personajes = [
  "img/char1.png",
  "img/char2.png",
  "img/char3.png"
];

let personaje = new Image();

// ===== POSICIÓN Y ESTADO =====
let x = 50;
let yBase = canvas.height - 180;
let y = yBase;
let paso = 0;
let caminando = false;
let preguntaActual = 0;
let respuestasFinales = 0;
let juegoTerminado = false;

// ===== PARADAS =====
const paradas = [300, 600, 900, 1200];

// ===== ELEMENTOS HTML =====
const panel = document.getElementById("panel");
const texto = document.getElementById("texto");
const musica = document.getElementById("musica");

// ===== PREGUNTAS =====
const preguntas = [
  {
    texto: "¿Cuál de los días en los que me pediste ser tu novia es el más importante para los dos?",
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

// ===== SELECCIÓN DE PERSONAJE =====
function elegir(i) {
  personaje.src = personajes[i];
  document.getElementById("menu").style.display = "none";
  canvas.style.display = "block";

  musica.volume = 0.4;
  musica.play();

  caminando = true;
}

// ===== EFECTO ESCRITURA =====
function escribir(msg) {
  texto.innerHTML = "";
  let i = 0;

  const intervalo = setInterval(() => {
    texto.innerHTML += msg.charAt(i);
    i++;
    if (i >= msg.length) clearInterval(intervalo);
  }, 40);
}

// ===== MOSTRAR PREGUNTA =====
function mostrarPregunta() {
  caminando = false;
  panel.innerHTML = "";
  panel.style.display = "block";

  const p = preguntas[preguntaActual];
  escribir(p.texto);

  p.opciones.forEach((op, i) => {
    const b = document.createElement("button");
    b.textContent = op;

    b.onclick = () => {
      b.disabled = true;
      b.style.opacity = 0.5;
      responder(i);
    };

    panel.appendChild(b);
  });
}

// ===== RESPONDER =====
function responder(i) {
  const p = preguntas[preguntaActual];

  // ÚLTIMA PREGUNTA
  if (p.correcta === -1) {
    respuestasFinales++;
    escribir("Amo cada cosa de vos 💖");

    if (respuestasFinales === p.opciones.length) {
      panel.style.display = "none";
      juegoTerminado = true;

      setTimeout(() => {
        escribir(
          "Gracias por recorrer nuestra historia conmigo 💕\n\n" +
          "Todos los recuerdos que tenemos juntos son lo más hermoso\n" +
          "Te amo muchito.\n\n" +
          "Gracias por elegirme 💖"
        );
      }, 1500);
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

// ===== MOVIMIENTO =====
function mover() {
  if (!caminando) return;

  x += 2;
  paso += 0.2;
  y = yBase + Math.sin(paso) * 6;
}

// ===== LOOP PRINCIPAL =====
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Fondo siempre visible
  ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height);

  mover();

  // Paradas
  if (
    caminando &&
    preguntaActual < paradas.length &&
    x >= paradas[preguntaActual]
  ) {
    mostrarPregunta();
  }

  // Personaje
  ctx.drawImage(personaje, x, y, 120, 120);

  requestAnimationFrame(loop);
}

loop();
