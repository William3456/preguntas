var btnNext = select_id("btnNext");
function inicio(){
    swal.fire({
      title: "Bienvenido",
      html:
        "<li>Para jugar únicamente debes responder a la pregunta con una de las opciones.</li>",
      icon: "success"
    });
}

function deshabilitarBtn(){
  var botones = document.querySelectorAll("button");
  $(botones).addClass("disabled");
}
function habilitarBtn(){
  var botones = document.querySelectorAll("button");
  $(botones).removeClass("disabled");
}
let preguntas_aleatorias = true;
let mostrar_pantalla_juego_términado = true;
let reiniciar_puntos_al_reiniciar_el_juego = true;
let ronda = 1;

window.onload = function () {
  base_preguntas = readText("base-preguntas.json");
  interprete_bp = JSON.parse(base_preguntas);
  inicio()
  escogerPreguntaAleatoria();
};

let pregunta;
let posibles_respuestas;
btn_correspondiente = [
  select_id("btn1"),
  select_id("btn2"),
  select_id("btn3"),
  select_id("btn4")
];
let npreguntas = [];

let preguntas_hechas = 0;
let preguntas_correctas = 0;

function escogerPreguntaAleatoria() {
  deshabilitarBtn();
  $(btnNext).addClass("disabled");
  let n;
  if (preguntas_aleatorias) {
    n = Math.floor(Math.random() * interprete_bp.length);
  } else {
    n = 0;
  }

  while (npreguntas.includes(n)) {
    n++;
    if (n >= interprete_bp.length) {
      n = 0;
    }
    if (npreguntas.length == interprete_bp.length) {
      //Aquí es donde el juego se reinicia
      if (mostrar_pantalla_juego_términado) {
      
        swal.fire({
          title: "Juego finalizado",
          html:
            "Puntuación: " + preguntas_correctas + "/" + (preguntas_hechas) + "<br>Inciando ronda: " + parseInt(ronda + 1) + "...",
          icon: "success"
        });
      }
      if (reiniciar_puntos_al_reiniciar_el_juego) {
        preguntas_correctas = 0
        preguntas_hechas = 0
        ronda++;
      }
      npreguntas = [];
    }
  }
  npreguntas.push(n);
  preguntas_hechas++;

  escogerPregunta(n);
}

function escogerPregunta(n) {
  let totalPreguntas = interprete_bp.length;  
  let pc = preguntas_correctas;

  pregunta = interprete_bp[n];
  select_id("categoria").innerHTML = pregunta.categoria;
  select_id("pregunta").innerHTML = pregunta.pregunta;
  //select_id("numero").innerHTML = n;
  select_id("num_preg").innerHTML = preguntas_hechas;
  select_id("total_preg").innerHTML = totalPreguntas;
  select_id("ronda").innerHTML = ronda;

  if (preguntas_hechas > 1) {
    select_id("puntaje").innerHTML = pc + "/" + (preguntas_hechas);
  } else {
    select_id("puntaje").innerHTML = pc + "/" + (preguntas_hechas);
  }

  style("imagen").objectFit = pregunta.objectFit;
  desordenarRespuestas(pregunta);
  if (pregunta.imagen) {
    select_id("imagen").setAttribute("src", pregunta.imagen);
    style("imagen").height = "200px";
    style("imagen").width = "100%";
  } else {
    style("imagen").height = "0px";
    style("imagen").width = "0px";
    setTimeout(() => {
      select_id("imagen").setAttribute("src", "");
    }, 500);
  }
 
  habilitarBtn();
}

function desordenarRespuestas(pregunta) {
  posibles_respuestas = [
    pregunta.respuesta,
    pregunta.incorrecta1,
    pregunta.incorrecta2,
    pregunta.incorrecta3,
  ];
  posibles_respuestas.sort(() => Math.random() - 0.5);

  select_id("textoPregun1").innerHTML = posibles_respuestas[0];
  select_id("textoPregun2").innerHTML = posibles_respuestas[1];
  select_id("textoPregun3").innerHTML = posibles_respuestas[2];
  select_id("textoPregun4").innerHTML = posibles_respuestas[3];
}

let suspender_botones = false;

function oprimir_btn(i, element) {
  
  if (suspender_botones) {
    return;
  }
  $(btnNext).removeClass("disabled");
 
  element.blur();
  deshabilitarBtn();
  suspender_botones = true;
  if (posibles_respuestas[i] == pregunta.respuesta) {
    preguntas_correctas++;
    btn_correspondiente[i].style.background = "lightgreen";
  } else {
    btn_correspondiente[i].style.background = "pink";
  }
  for (let j = 0; j < 4; j++) {
    if (posibles_respuestas[j] == pregunta.respuesta) {
      btn_correspondiente[j].style.background = "lightgreen";
      break;
    }
  }
}

// let p = prompt("numero")

function reiniciar() {
  for (const btn of btn_correspondiente) {
    btn.style.background = "";
    btn.blur();
  }
  escogerPreguntaAleatoria();
}

function select_id(id) {
  return document.getElementById(id);
}

function style(id) {
  return select_id(id).style;
}

function readText(ruta_local) {
  var texto = null;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", ruta_local, false);
  xmlhttp.send();
  if (xmlhttp.status == 200) {
    texto = xmlhttp.responseText;
  }
  return texto;
}
function siguientePregunta(element){
  
  if(suspender_botones){
    reiniciar();
    suspender_botones = false;
    habilitarBtn();
  }
  btnNext.blur();
}