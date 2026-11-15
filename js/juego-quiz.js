/* ===== Juego 3: Mini-quiz espacial ===== */
function gQuiz() {
  var TOTAL = 6, puntos = 0, i = 0, bloqueado = false, pl = [], BANK = D().QUIZ;

  // Copia y mezcla las preguntas para que cada partida sea distinta.
  for (var k = 0; k < BANK.length; k++) pl.push(BANK[k]);
  for (var m = pl.length - 1; m > 0; m--) {
    var r = Math.floor(Math.random() * (m + 1)), tmp = pl[m];
    pl[m] = pl[r];
    pl[r] = tmp;
  }
  pl = pl.slice(0, Math.min(TOTAL, pl.length));

  var p = $("gbody");
  p.innerHTML = '<p>' + t("quizIntro") + ' <b id="qn">1/' + pl.length + '</b></p>' +
    '<div id="qbox"></div><p id="qs" class="hint" style="text-align:center"></p>';

  function pintar() {
    var q = pl[i];
    var ops = q.o.map(function(op, j) {
      return '<button class="quiz-opt" type="button" data-j="' + j + '">' + op + '</button>';
    }).join("");
    $("qn").textContent = (i + 1) + "/" + pl.length;
    $("qs").textContent = t("quizScore") + puntos;
    $("qbox").innerHTML = '<p class="quiz-q">' + q.q + '</p>' +
      '<div class="quiz-options">' + ops + '</div>' +
      '<p class="quiz-feedback" id="qf" aria-live="polite"></p>';
    bloqueado = false;

    var botones = $("qbox").querySelectorAll(".quiz-opt");
    Array.prototype.forEach.call(botones, function(b) {
      b.onclick = function() { responder(parseInt(b.dataset.j, 10)); };
    });
  }

  function responder(j) {
    if (bloqueado) return;
    bloqueado = true;
    var q = pl[i],
        bien = j === q.a,
        botones = $("qbox").querySelectorAll(".quiz-opt");

    Array.prototype.forEach.call(botones, function(b) {
      b.disabled = true;
      var idx = parseInt(b.dataset.j, 10);
      if (idx === q.a) b.classList.add("is-ok");
      else if (idx === j) b.classList.add("is-no");
    });

    if (bien) {
      puntos++;
      if (typeof bp === "function") bp(880);
    } else if (typeof bp === "function") bp(180);

    $("qs").textContent = t("quizScore") + puntos;
    var f = $("qf");
    f.innerHTML = (bien ? t("quizCorrect") : t("quizWrong")) + q.tip;

    i++;
    var accion = document.createElement("button");
    accion.type = "button";
    accion.className = "btn";
    accion.id = "qnext";
    accion.textContent = i < pl.length ? t("quizNext") : t("quizFinish");
    accion.onclick = i < pl.length ? pintar : fin;
    f.appendChild(document.createElement("br"));
    f.appendChild(accion);
    accion.focus();
  }

  function fin() {
    var perfecto = puntos === pl.length;
    if (puntos >= 4) col.quiz = true;
    if (typeof bp === "function") bp(perfecto ? 990 : 660);

    $("qbox").innerHTML = '<p class="quiz-q">' + (perfecto ? t("quizPerfect") : t("quizDone")) + '</p>' +
      '<p class="quiz-feedback">' + t("quizResultA") + '<b>' + puntos + t("quizResultB") + pl.length + '</b>. ' +
      (puntos >= 4 ? t("quizGreat") : t("quizRetry")) + '</p>';
    $("qs").textContent = "";
    var again = document.createElement("button");
    again.type = "button";
    again.className = "btn";
    again.textContent = t("playAgain");
    again.style.display = "block";
    again.style.margin = "12px auto 0";
    again.onclick = gQuiz;
    $("qbox").appendChild(again);
    again.focus();
  }

  cur = function() {};
  pintar();
}
