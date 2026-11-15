/* ===== Juego 1: Rescata al rover (3D y 2D) ===== */
function gRover() {
  if (window.THREE && !LITE) g3D();
  else gRover2D();
}

function g3D() {
  var base = "Junta 10 ⭐ antes de que llegue la tormenta. Las esferas celestes son viento: limpian tus paneles solares y recargan la 🔋.";
  $("gbody").innerHTML = '<canvas id="rc" width="320" height="440" style="width:100%;max-width:360px;display:block;margin:10px auto;border-radius:14px;touch-action:none"></canvas><div id="hud" style="text-align:center;font-weight:800"></div><progress id="pb" max="100" value="100" style="width:100%;max-width:360px;display:block;margin:6px auto"></progress><div style="text-align:center"><button class="btn" id="bl" aria-label="Izquierda">◀</button> <button class="btn" id="br" aria-label="Derecha">▶</button></div><p id="rm" class="hint" style="text-align:center">' + base + '</p>';
  var T = THREE, c = $("rc"), R = new T.WebGLRenderer({ canvas: c, antialias: true });
  R.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  R.setSize(320, 440, false);

  var sc = new T.Scene(), c0 = new T.Color(0xc0683a), c1 = new T.Color(0x5e2c14);
  sc.background = c0.clone();
  sc.fog = new T.Fog(0xc0683a, 30, 85);

  var cam = new T.PerspectiveCamera(60, 320 / 440, .1, 200);
  cam.position.set(0, 4.4, 7.5);
  cam.lookAt(0, 0, -7);

  sc.add(new T.HemisphereLight(0xffe2c4, 0x6b3a20, .9));
  var dl = new T.DirectionalLight(0xffffff, .8);
  dl.position.set(5, 10, 5);
  sc.add(dl);

  var tc = document.createElement("canvas");
  tc.width = tc.height = 128;
  var tx = tc.getContext("2d");
  tx.fillStyle = "#b4562c";
  tx.fillRect(0, 0, 128, 128);
  for (var i = 0; i < 260; i++) {
    tx.fillStyle = "rgba(" + (i % 2 ? "70,30,15" : "220,150,100") + ",.35)";
    tx.beginPath();
    tx.arc(Math.random() * 128, Math.random() * 128, Math.random() * 2 + .5, 0, 7);
    tx.fill();
  }

  var tex = new T.CanvasTexture(tc);
  tex.wrapS = tex.wrapT = T.RepeatWrapping;
  tex.repeat.set(8, 40);

  var gd = new T.Mesh(new T.PlaneGeometry(40, 200), new T.MeshLambertMaterial({ map: tex }));
  gd.rotation.x = -Math.PI / 2;
  gd.position.z = -90;
  sc.add(gd);

  var rv = new T.Group(), WH = [];
  function M(g, cl, x, y, z) {
    var m = new T.Mesh(g, new T.MeshLambertMaterial({ color: cl }));
    m.position.set(x, y, z);
    rv.add(m);
    return m;
  }

  M(new T.BoxGeometry(1.1, .4, 1.6), 0xd9dde8, 0, .55, 0);
  M(new T.BoxGeometry(1.5, .06, 1.3), 0x2a2118, 0, .8, 0);
  M(new T.BoxGeometry(.8, .05, 1.2), 0x2a2118, -1.15, .85, 0).rotation.z = .12;
  M(new T.BoxGeometry(.8, .05, 1.2), 0x2a2118, 1.15, .85, 0).rotation.z = -.12;
  M(new T.CylinderGeometry(.05, .05, .8, 8), 0xeeeeee, 0, 1.2, -.3);
  M(new T.BoxGeometry(.5, .16, .16), 0xf2f2f2, 0, 1.65, -.3);
  M(new T.BoxGeometry(.1, .1, .05), 0x111111, -.12, 1.65, -.2);
  M(new T.BoxGeometry(.1, .1, .05), 0x111111, .12, 1.65, -.2);
  M(new T.CylinderGeometry(.25, .25, .04, 16), 0x222222, .5, .95, .4).rotation.x = 1.2;

  [-.85, .85].forEach(function(sx) {
    [-.65, 0, .65].forEach(function(z) {
      var g = new T.CylinderGeometry(.26, .26, .2, 14);
      g.rotateZ(Math.PI / 2);
      WH.push(M(g, 0x222222, sx, .26, z));
      M(new T.BoxGeometry(.05, .5, .05), 0x999999, sx * .92, .55, z);
    });
  });
  sc.add(rv);

  if (GLB && T.GLTFLoader) {
    new T.GLTFLoader().load(GLB, function(g) {
      var m = g.scene, b = new T.Box3().setFromObject(m), z = b.getSize(new T.Vector3()), ct = b.getCenter(new T.Vector3()), f = 1.9 / Math.max(z.x, z.z);
      m.scale.setScalar(f);
      m.position.set(-ct.x * f, -b.min.y * f, -ct.z * f);
      while (rv.children.length) rv.remove(rv.children[0]);
      var w = new T.Group();
      w.add(m);
      rv.add(w);
    });
  }

  var LX = [-3, 0, 3], tl = 1, O = [], s = 0, lv = 3, en = 100, t0 = Date.now(), last = t0, dd = 0, run = true, nt = 0, hit = 0, sp = .28,
      F = ["Opportunity halló pruebas de agua en Marte.", "Duró casi 15 años; se planeó para 90 días.", "Steve Squyres lideró sus instrumentos."];

  cur = function() { run = false; R.dispose(); };
  function mv(d) { tl = Math.max(0, Math.min(2, tl + d)); }
  $("bl").onclick = function() { mv(-1); };
  $("br").onclick = function() { mv(1); };
  c.onpointerdown = function(e) {
    var r = c.getBoundingClientRect();
    mv(e.clientX - r.left < r.width / 2 ? -1 : 1);
  };
  document.onkeydown = function(e) {
    if (e.key == "ArrowLeft") mv(-1);
    if (e.key == "ArrowRight") mv(1);
  };

  function end(w, m) {
    run = false;
    R.dispose();
    if (w) col.rover = true;
    $("rm").innerHTML = m + '<br><button class="btn" id="ag">Jugar otra vez</button>';
    $("ag").onclick = gRover;
  }

  function mk(k, l) {
    var m;
    if (k == 0) {
      m = new T.Mesh(new T.OctahedronGeometry(.45), new T.MeshLambertMaterial({ color: 0xffd23f, emissive: 0x886600 }));
      m.position.y = .9;
    } else if (k == 1) {
      m = new T.Mesh(new T.DodecahedronGeometry(.7), new T.MeshLambertMaterial({ color: 0x6b6f86 }));
      m.scale.set(1 + Math.random() * .4, .8 + Math.random() * .5, 1);
      m.position.y = .5;
    } else if (k == 2) {
      m = new T.Mesh(new T.CylinderGeometry(1.2, 1.2, .06, 24), new T.MeshLambertMaterial({ color: 0x3a1608 }));
      m.position.y = .04;
    } else {
      m = new T.Mesh(new T.SphereGeometry(.5, 16, 12), new T.MeshLambertMaterial({ color: 0x9be7ff, emissive: 0x2277aa, transparent: true, opacity: .75 }));
      m.position.y = .9;
    }
    m.position.x = LX[l];
    m.position.z = -70;
    m.userData = { k: k };
    sc.add(m);
    O.push(m);
  }

  function tick() {
    if (!run) return;
    var now = Date.now(), dt = Math.min(3, (now - last) / 16.67), el = (now - t0) / 1000, tm = 40 - el, st = Math.min(1, el / 40);
    last = now;
    sp = .28 + el * .004;

    var dx = LX[tl] - rv.position.x;
    rv.position.x += dx * Math.min(1, .15 * dt);
    rv.rotation.y = -dx * .1;
    rv.rotation.z = dx * .04;
    WH.forEach(function(w) { w.rotation.x -= sp * dt * 2; });
    tex.offset.y += sp * dt * .2;
    if (hit > 0) hit -= dt;
    rv.position.y = hit > 0 ? Math.abs(Math.sin(hit)) * .15 : 0;

    dd += sp * dt;
    if (dd >= 12) {
      dd = 0;
      var q = Math.random(), l = Math.floor(Math.random() * 3);
      mk(q < .36 ? 0 : q < .58 ? 1 : q < .78 ? 2 : 3, l);
      if (q >= .36 && q < .78 && Math.random() < .4) {
        mk(Math.random() < .5 ? 1 : 2, (l + 1 + Math.floor(Math.random() * 2)) % 3);
      }
    }

    en -= (.035 + st * .05) * dt;
    for (var i = O.length - 1; i >= 0; i--) {
      var m = O[i], k = m.userData.k;
      m.position.z += sp * dt;
      if (k == 0 || k == 3) m.rotation.y += .05 * dt;
      if (Math.abs(m.position.z) < 1.2 && Math.abs(rv.position.x - m.position.x) < 1.4) {
        if (k == 0) {
          s++;
          bp(880);
          if (s % 3 == 0 && s < 10) {
            $("rm").textContent = F[s / 3 - 1];
            nt = 150;
          }
        } else if (k == 3) {
          en = Math.min(100, en + 25);
          bp(660);
        } else {
          lv--;
          hit = 20;
          bp(160);
          if (navigator.vibrate) navigator.vibrate(80);
        }
        sc.remove(m);
        O.splice(i, 1);
        continue;
      }
      if (m.position.z > 8) {
        sc.remove(m);
        O.splice(i, 1);
      }
    }

    sc.background.copy(c0).lerp(c1, st);
    sc.fog.color.copy(sc.background);
    sc.fog.near = 30 - 24 * st;
    sc.fog.far = 85 - 45 * st;
    dl.intensity = .8 - .5 * st;
    R.render(sc, cam);

    $("hud").textContent = "⭐ " + s + "/10   ❤ " + lv + "   ⏱ " + Math.max(0, Math.ceil(tm)) + "   🔋 " + Math.max(0, Math.round(en)) + "%";
    $("pb").value = Math.max(0, en);
    if (nt > 0 && --nt == 0) $("rm").textContent = base;
    if (s >= 10) return end(true, "¡Rescataste al rover! En 2018 Opportunity no pudo recargarse en la tormenta; tú sí. 🎉");
    if (lv <= 0) return end(false, "Chocaste demasiado. ¡Inténtalo otra vez!");
    if (en <= 0) return end(false, "Te quedaste sin energía, como Opportunity en 2018.");
    if (tm <= 0) return end(false, "La tormenta llegó antes de juntar todas las muestras.");
    requestAnimationFrame(tick);
  }
  tick();
}

function gRover2D() {
  $("gbody").innerHTML = '<canvas id="rc" width="320" height="440" style="width:100%;max-width:360px;display:block;margin:10px auto;border-radius:14px;touch-action:none"></canvas><div style="text-align:center"><button class="btn" id="bl" aria-label="Izquierda">◀</button> <button class="btn" id="br" aria-label="Derecha">▶</button></div><p id="rm" class="hint" style="text-align:center">Junta 10 ⭐ antes de que llegue la tormenta. El viento 💨 limpia tus paneles solares y recarga la energía 🔋. Toca los lados para moverte.</p>';
  var c = $("rc"), x = c.getContext("2d"), LX = [55, 160, 265], tl = 1, rx = 160, O = [], TR = [], PB = [], DS = [], s = 0, lv = 3, en = 100, t0 = Date.now(), last = t0, dd = 0, run = true, note = "", nt = 0, hit = 0, sp = 3,
      F = ["Opportunity halló pruebas de agua en Marte.", "Duró casi 15 años; se planeó para 90 días.", "Steve Squyres lideró sus instrumentos."];

  for (var i = 0; i < 70; i++) PB.push({ x: Math.random() * 320, y: Math.random() * 440, r: Math.random() * 2 + .6 });
  for (i = 0; i < 30; i++) DS.push({ x: Math.random() * 320, y: Math.random() * 440, v: Math.random() * 2 + 1 });

  cur = function() { run = false; };
  function mv(d) { tl = Math.max(0, Math.min(2, tl + d)); }
  $("bl").onclick = function() { mv(-1); };
  $("br").onclick = function() { mv(1); };
  c.onpointerdown = function(e) {
    var r = c.getBoundingClientRect();
    mv(e.clientX - r.left < r.width / 2 ? -1 : 1);
  };
  document.onkeydown = function(e) {
    if (e.key == "ArrowLeft") mv(-1);
    if (e.key == "ArrowRight") mv(1);
  };

  function end(w, m) {
    run = false;
    if (w) col.rover = true;
    $("rm").innerHTML = m + '<br><button class="btn" id="ag">Jugar otra vez</button>';
    $("ag").onclick = gRover;
  }

  function ell(a, b, w, h, col2) {
    x.fillStyle = col2;
    x.beginPath();
    x.ellipse(a, b, w, h, 0, 0, 7);
    x.fill();
  }

  function rover() {
    x.save();
    x.translate(rx, 372);
    x.rotate((LX[tl] - rx) * .003);
    ell(4, 6, 22, 26, "rgba(0,0,0,.25)");
    x.strokeStyle = "#888";
    x.lineWidth = 2;
    x.beginPath();
    x.moveTo(-16, -16);
    x.lineTo(-16, 16);
    x.moveTo(16, -16);
    x.lineTo(16, 16);
    x.stroke();
    x.fillStyle = "#222";
    [-16, 0, 16].forEach(function(y) {
      x.fillRect(-20, y - 6, 7, 12);
      x.fillRect(13, y - 6, 7, 12);
    });
    x.fillStyle = "#d9dde8";
    x.fillRect(-11, -14, 22, 28);
    x.fillStyle = "#1d3b8f";
    x.fillRect(-14, -10, 28, 22);
    x.strokeStyle = "#d6a43a";
    x.lineWidth = 2;
    x.strokeRect(-14, -10, 28, 22);
    x.strokeStyle = "rgba(255,255,255,.35)";
    x.lineWidth = 1;
    x.beginPath();
    x.moveTo(0, -10);
    x.lineTo(0, 12);
    x.moveTo(-14, 1);
    x.lineTo(14, 1);
    x.stroke();
    x.fillStyle = "#eee";
    x.fillRect(-2, -21, 4, 10);
    ell(0, -23, 3.5, 3, "#ffd23f");
    if (hit > 0) {
      x.fillStyle = "rgba(255,60,40," + Math.min(.6, hit / 20) + ")";
      x.fillRect(-22, -26, 44, 56);
    }
    x.restore();
  }

  function tick() {
    if (!run) return;
    var now = Date.now(), dt = Math.min(3, (now - last) / 16.67), el = (now - t0) / 1000, tm = 40 - el, st = Math.min(1, el / 40);
    last = now;
    sp = 3 + el * .03;
    rx += (LX[tl] - rx) * Math.min(1, .18 * dt);
    if (hit > 0) hit -= dt;
    dd += sp * dt;

    if (dd >= 140) {
      dd = 0;
      var q = Math.random(), l = Math.floor(Math.random() * 3);
      O.push({ l: l, y: -20, k: q < .36 ? 0 : q < .58 ? 1 : q < .78 ? 2 : 3 });
      if (q >= .36 && q < .78 && Math.random() < .4) {
        O.push({ l: (l + 1 + Math.floor(Math.random() * 2)) % 3, y: -20, k: Math.random() < .5 ? 1 : 2 });
      }
    }

    en -= (.035 + st * .05) * dt;
    var gb = x.createLinearGradient(0, 0, 0, 440);
    gb.addColorStop(0, "#c0683a");
    gb.addColorStop(1, "#a64e28");
    x.fillStyle = gb;
    x.fillRect(0, 0, 320, 440);

    PB.forEach(function(p) {
      p.y += sp * dt;
      if (p.y > 445) {
        p.y = -5;
        p.x = Math.random() * 320;
      }
      x.fillStyle = "rgba(70,30,15,.35)";
      x.beginPath();
      x.arc(p.x, p.y, p.r, 0, 7);
      x.fill();
    });

    TR.push({ x: rx, y: 384 });
    if (TR.length > 60) TR.shift();
    x.fillStyle = "rgba(60,25,10,.28)";
    TR.forEach(function(t) {
      t.y += sp * dt;
      x.fillRect(t.x - 14, t.y, 3, sp + 1);
      x.fillRect(t.x + 11, t.y, 3, sp + 1);
    });

    for (var i = O.length - 1; i >= 0; i--) {
      var o = O[i], ox = LX[o.l];
      o.y += sp * dt;
      if (o.k == 1) {
        ell(ox + 4, o.y + 6, 16, 8, "rgba(0,0,0,.3)");
        var g = x.createRadialGradient(ox - 5, o.y - 5, 2, ox, o.y, 16);
        g.addColorStop(0, "#b9bfd6");
        g.addColorStop(1, "#474c63");
        x.fillStyle = g;
        x.beginPath();
        x.arc(ox, o.y, 15, 0, 7);
        x.fill();
      } else if (o.k == 2) {
        ell(ox, o.y, 26, 14, "#e0905c");
        ell(ox, o.y + 1, 21, 10, "#4a1d0c");
        ell(ox, o.y + 3, 16, 6, "#2e1006");
      } else {
        if (o.k == 0) ell(ox, o.y, 18, 18, "rgba(255,210,63,.35)");
        x.font = "26px serif";
        x.textAlign = "center";
        x.fillText(o.k == 0 ? "⭐" : "💨", ox, o.y + 9);
      }

      if (Math.abs(o.y - 372) < 24 && Math.abs(rx - ox) < 32) {
        if (o.k == 0) {
          s++;
          bp(880);
          if (s % 3 == 0 && s < 10) {
            note = F[s / 3 - 1];
            nt = 120;
          }
        } else if (o.k == 3) {
          en = Math.min(100, en + 25);
          bp(660);
        } else {
          lv--;
          hit = 20;
          bp(160);
          if (navigator.vibrate) navigator.vibrate(80);
        }
        O.splice(i, 1);
        continue;
      }
      if (o.y > 470) O.splice(i, 1);
    }

    rover();
    x.fillStyle = "rgba(150,70,25," + (.35 * st) + ")";
    x.fillRect(0, 0, 320, 440);
    var gr = x.createRadialGradient(rx, 372, 70, 160, 220, 330);
    gr.addColorStop(0, "rgba(50,20,8,0)");
    gr.addColorStop(1, "rgba(50,20,8," + (.75 * st) + ")");
    x.fillStyle = gr;
    x.fillRect(0, 0, 320, 440);

    x.strokeStyle = "rgba(255,210,160," + (.5 * st) + ")";
    x.lineWidth = 1;
    DS.forEach(function(d) {
      d.x += d.v * 3 * dt * (1 + st);
      d.y += dt;
      if (d.x > 330) {
        d.x = -10;
        d.y = Math.random() * 440;
      }
      if (d.y > 440) d.y = 0;
      x.beginPath();
      x.moveTo(d.x, d.y);
      x.lineTo(d.x - 8 - 6 * st, d.y + 1);
      x.stroke();
    });

    x.fillStyle = "#fff";
    x.font = "bold 16px sans-serif";
    x.textAlign = "left";
    x.fillText("⭐ " + s + "/10   ❤ " + lv + "   ⏱ " + Math.max(0, Math.ceil(tm)), 10, 24);
    x.fillText("🔋", 10, 52);
    x.fillStyle = "rgba(0,0,0,.45)";
    x.fillRect(34, 40, 120, 12);
    x.fillStyle = en > 30 ? "#3ddc84" : "#ff5a4d";
    x.fillRect(34, 40, 1.2 * Math.max(0, en), 12);

    if (nt > 0) {
      nt--;
      x.fillStyle = "rgba(0,0,0,.7)";
      x.fillRect(10, 64, 300, 40);
      x.fillStyle = "#fff";
      x.font = "12px sans-serif";
      x.fillText(note, 18, 89);
    }

    if (s >= 10) return end(true, "¡Rescataste al rover! En 2018 Opportunity no pudo recargarse en la tormenta; tú sí. 🎉");
    if (lv <= 0) return end(false, "Chocaste demasiado. ¡Inténtalo otra vez!");
    if (en <= 0) return end(false, "Te quedaste sin energía, como Opportunity en 2018.");
    if (tm <= 0) return end(false, "La tormenta llegó antes de juntar todas las muestras.");
    requestAnimationFrame(tick);
  }
  tick();
}
