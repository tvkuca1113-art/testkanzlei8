/* ==========================================================================
   KANZLEI JASMINA HODZIC — assets/js/site.js
   Grundfunktionen. 3D wird nachgeladen, erst wenn eine Szene in die Nähe
   des Sichtfensters kommt (spart ~600 kB auf Seiten ohne 3D-Kontakt).
   ========================================================================== */
(function () {
  "use strict";

  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SM = matchMedia('(max-width:1080px)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Seite freigeben (ohne blockierende Vorschaltseite) ---------- */
  function los() {
    document.body.classList.add('los');
    $$('#held .mk').forEach(function (m) { m.classList.add('an'); });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { requestAnimationFrame(los); });
  } else { requestAnimationFrame(los); }

  /* ---------- Navigation ---------- */
  var nav = $('#nav'), burg = $('#burg'), nl = $('#nl'), stick = $('#sticky'), prog = $('#prog');

  if (burg && nl) {
    burg.addEventListener('click', function () {
      var o = nl.classList.toggle('auf');
      document.body.classList.toggle('menu', o);
      document.body.classList.toggle('stop', o);
      burg.setAttribute('aria-expanded', o ? 'true' : 'false');
    });
    $$('#nl a').forEach(function (a) {
      a.addEventListener('click', function () {
        nl.classList.remove('auf');
        document.body.classList.remove('menu', 'stop');
        burg.setAttribute('aria-expanded', 'false');
      });
    });
    addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nl.classList.contains('auf')) { burg.click(); burg.focus(); }
    });
  }

  /* Ausklappmenü "Leistungen" — Klick auf Mobil, Hover auf Desktop */
  $$('.dd').forEach(function (dd) {
    var btn = dd.querySelector('button');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var o = dd.classList.toggle('auf');
      btn.setAttribute('aria-expanded', o ? 'true' : 'false');
    });
    if (!SM) {
      dd.addEventListener('mouseenter', function () { dd.classList.add('auf'); btn.setAttribute('aria-expanded', 'true'); });
      dd.addEventListener('mouseleave', function () { dd.classList.remove('auf'); btn.setAttribute('aria-expanded', 'false'); });
    }
  });
  document.addEventListener('click', function () {
    $$('.dd.auf').forEach(function (dd) {
      dd.classList.remove('auf');
      var b = dd.querySelector('button'); if (b) b.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Scroll: Fortschritt, feste Navigation, Sticky-Leiste ---------- */
  var festAn = false, stickAn = false, warten = false;
  function onScroll() {
    if (warten) return;
    warten = true;
    requestAnimationFrame(function () {
      warten = false;
      var d = document.documentElement;
      var max = d.scrollHeight - d.clientHeight;
      if (prog) prog.style.width = (max > 0 ? (d.scrollTop / max * 100) : 0) + '%';
      var f = window.scrollY > 40;
      if (f !== festAn && nav) { nav.classList.toggle('fest', f); festAn = f; }
      if (stick) {
        var s = window.scrollY > innerHeight * 0.7;
        if (s !== stickAn) { stick.classList.toggle('an', s); stickAn = s; }
      }
    });
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Einblenden beim Scrollen ----------
     threshold 0: löst aus, sobald der erste Pixel den Rand erreicht.
     Wichtig für Elemente, die höher sind als das Sichtfenster (Bildbanner,
     3D-Bühnen) — mit einem Anteilsschwellwert blieben die sonst verborgen. */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('an');
      $$('.mk', e.target).forEach(function (m) { m.classList.add('an'); });
      io.unobserve(e.target);
    });
  }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
  $$('.up').forEach(function (el) { io.observe(el); });
  $$('.kopf .mk, .spr .mk').forEach(function (m) {
    new IntersectionObserver(function (e, o) {
      if (e[0].isIntersecting) { m.classList.add('an'); o.disconnect(); }
    }, { threshold: 0, rootMargin: '0px 0px -8% 0px' }).observe(m);
  });

  /* ---------- Akkordeons (Leistungen, FAQ) ---------- */
  var offen = [];
  function akk(sel) {
    $$(sel).forEach(function (p) {
      var b = p.querySelector('button'), box = p.querySelector('.box,.a');
      if (!b || !box) return;
      b.addEventListener('click', function () {
        var war = p.classList.contains('auf');
        $$(sel).forEach(function (q) {
          q.classList.remove('auf');
          var x = q.querySelector('.box,.a'); if (x) x.style.maxHeight = null;
          var qb = q.querySelector('button'); if (qb) qb.setAttribute('aria-expanded', 'false');
        });
        offen = offen.filter(function (o) { return o.p !== p; });
        if (!war) {
          p.classList.add('auf');
          box.style.maxHeight = box.scrollHeight + 'px';
          b.setAttribute('aria-expanded', 'true');
          offen.push({ p: p, box: box });
        }
      });
    });
  }
  akk('.lp'); akk('.fq');
  /* Höhe nach Drehen des Geräts neu messen — sonst schneidet der Text ab */
  var rt;
  addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () {
      offen.forEach(function (o) { o.box.style.maxHeight = o.box.scrollHeight + 'px'; });
    }, 160);
  });

  /* ---------- Steuer-Check ---------- */
  window.checkSetzen = null;
  (function () {
    var wurzel = $('#check'); if (!wurzel) return;
    var S = { rf: 'privat', um: 60000, fl: {} };
    var LB = { privat: 'Privatperson', frei: 'Freiberuflich', einzel: 'Einzelunternehmen', gmbh: 'GmbH / UG' };
    var f2 = function (n) { return n.toLocaleString('de-DE'); };
    var eF = $('#c-fld'), eH = $('#c-hrs'), eP = $('#c-prof'), eM = $('#c-mod'), eV = $('#c-vl'), eU = $('#c-umt');

    function bausteine() {
      var m = [], f = S.fl;
      if (S.rf === 'privat') m.push(['Einkommensteuererklärung', 'Vollständige Erstellung und fristgerechte Abgabe.']);
      else {
        m.push(['Laufende Buchhaltung', 'Monatliche Verbuchung, Umsatzsteuer-Voranmeldung, Auswertungen.']);
        m.push([S.rf === 'gmbh' ? 'Bilanz & Jahresabschluss' : 'EÜR oder Jahresabschluss', 'Erstellung nach handels- und steuerrechtlichen Vorgaben.']);
      }
      if (S.rf === 'gmbh') m.push(['Gehalt & Ausschüttung', 'Gestaltung der Geschäftsführervergütung und der Gewinnverwendung.']);
      if (f.personal)   m.push(['Lohnbuchhaltung', 'Abrechnung, Meldungen an Sozialversicherung und Finanzamt.']);
      if (f.ausland)    m.push(['Internationales Steuerrecht', 'Doppelbesteuerungsabkommen, Ansässigkeit, Meldepflichten.']);
      if (f.immobilien) m.push(['Vermietung & Immobilien', 'Einkünfte aus Vermietung, Abschreibung, Veräußerungsfristen.']);
      if (f.erbschaft)  m.push(['Erbschaft & Schenkung', 'Freibeträge im Zehnjahresrhythmus, Bewertung, Anzeigepflichten.']);
      if (S.um >= 400000 && S.rf !== 'privat') m.push(['Jahresplanung', 'Vorausschau auf Investitionen, Liquidität und Vorauszahlungen.']);
      return m.slice(0, 5);
    }
    function rechne() {
      var f = S.fl, feld = 1;
      if (S.rf !== 'privat') feld++;
      if (S.rf === 'gmbh') feld++;
      if (f.ausland) feld++; if (f.immobilien) feld++; if (f.erbschaft) feld++; if (f.personal) feld++;
      feld = Math.min(6, feld);
      var h = { privat: 14, frei: 48, einzel: 72, gmbh: 118 }[S.rf] || 60;
      if (f.personal) h += 65; if (f.ausland) h += 26; if (f.immobilien) h += 16; if (f.erbschaft) h += 20;
      if (S.um > 600000) h = Math.round(h * 1.35); else if (S.um > 200000) h = Math.round(h * 1.15);
      return { feld: feld, hrs: Math.round(h) };
    }
    function zeichne() {
      var r = rechne();
      eP.textContent = LB[S.rf];
      eF.textContent = r.feld + ' von 6';
      eH.textContent = '≈ ' + r.hrs + ' Std./Jahr';
      eV.textContent = 'Zweitens — ' + (S.rf === 'privat' ? 'Bruttojahreseinkommen' : 'Jahresumsatz');
      eU.textContent = f2(S.um) + ' €';
      var h = '';
      bausteine().forEach(function (m) {
        h += '<div class="m"><i>—</i><span><span>' + m[0] + '</span><s>' + m[1] + '</s></span></div>';
      });
      eM.innerHTML = h;
      if (typeof window.checkSetzen === 'function') window.checkSetzen(r.feld, S.um);
    }
    $$('#c-rf button').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('#c-rf button').forEach(function (x) { x.classList.remove('an'); x.setAttribute('aria-checked', 'false'); });
        b.classList.add('an'); b.setAttribute('aria-checked', 'true');
        S.rf = b.dataset.rf; zeichne();
      });
    });
    $$('#c-fl button').forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.dataset.f; S.fl[k] = !S.fl[k];
        b.classList.toggle('an', S.fl[k]);
        b.setAttribute('aria-pressed', S.fl[k] ? 'true' : 'false');
        zeichne();
      });
    });
    var sl = $('#c-um');
    if (sl) sl.addEventListener('input', function (e) { S.um = parseInt(e.target.value, 10); zeichne(); });
    window.__sync = zeichne;
    zeichne();
  })();

  /* ---------- Mandantenportal-Vorschau ---------- */
  var portal = $('#portal');
  if (portal) new IntersectionObserver(function (e, o) {
    if (e[0].isIntersecting) { portal.classList.add('an'); o.disconnect(); }
  }, { threshold: .4 }).observe(portal);

  /* ---------- Karte: lädt erst auf Klick (kein Datenabfluss vorher) ---------- */
  var kbtn = $('#karte-btn');
  if (kbtn) kbtn.addEventListener('click', function () {
    var k = $('#karte');
    k.innerHTML = '<iframe title="Kanzlei Jasmina Hodzic auf der Karte" loading="lazy" ' +
      'referrerpolicy="no-referrer-when-downgrade" ' +
      'src="https://www.openstreetmap.org/export/embed.html?bbox=11.4685%2C48.0855%2C11.4925%2C48.0975&layer=mapnik&marker=48.0915079%2C11.480529"></iframe>';
    k.style.padding = '0';
  });

  /* ---------- Einwilligung ---------- */
  (function () {
    var box = $('#cook'); if (!box) return;
    try { if (!localStorage.getItem('jh_ck')) setTimeout(function () { box.classList.add('an'); }, 1500); } catch (e) {}
    function set(v) { try { localStorage.setItem('jh_ck', v); } catch (e) {} box.classList.remove('an'); }
    var ok = $('#ck-ok'), no = $('#ck-no');
    if (ok) ok.addEventListener('click', function () { set('alle'); });
    if (no) no.addEventListener('click', function () { set('noetig'); });
  })();

  /* ---------- Kontaktformular ----------
     Sendet an /api/kontakt (Vercel-Funktion). Schlägt der Versand fehl,
     bekommt der Besucher die direkten Wege statt einer falschen Erfolgsmeldung. */
  var kf = $('#kf');
  if (kf) kf.addEventListener('submit', function (e) {
    e.preventDefault();
    var fehler = $('#fehler'), knopf = kf.querySelector('button[type=submit]');
    if ($('#f-hp') && $('#f-hp').value) return;                    /* Honigtopf gegen Bots */
    if (!kf.checkValidity()) { kf.reportValidity(); return; }

    var daten = {
      name: $('#f-n').value.trim(), email: $('#f-m').value.trim(),
      telefon: $('#f-t') ? $('#f-t').value.trim() : '',
      firma: $('#f-f') ? $('#f-f').value.trim() : '',
      anliegen: $('#f-a') ? $('#f-a').value : '',
      nachricht: $('#f-msg') ? $('#f-msg').value.trim() : ''
    };
    if (fehler) fehler.style.display = 'none';
    knopf.disabled = true;
    knopf.querySelector('span').textContent = 'Wird gesendet …';

    fetch('/api/kontakt', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(daten)
    })
      .then(function (r) { if (!r.ok) throw new Error('Status ' + r.status); return r.json(); })
      .then(function () { kf.style.display = 'none'; $('#dank').style.display = 'block'; })
      .catch(function () {
        knopf.disabled = false;
        knopf.querySelector('span').textContent = 'Nachricht absenden';
        if (fehler) {
          fehler.innerHTML = 'Die Nachricht konnte gerade nicht übermittelt werden. ' +
            'Bitte melden Sie sich direkt: <a href="tel:+4989541990940" style="color:var(--wein)">089 541 990 940</a> ' +
            'oder <a href="mailto:info@steuerberaterin-hodzic.de" style="color:var(--wein)">info@steuerberaterin-hodzic.de</a>.';
          fehler.style.display = 'block';
        }
      });
  });

  /* ---------- Magnetische Knöpfe (nur Zeigegerät, nur Desktop) ---------- */
  if (!SM && !RM && matchMedia('(hover:hover)').matches) {
    $$('[data-mag]').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = 'translate(' + ((e.clientX - (r.left + r.width / 2)) * .1) + 'px,' +
          ((e.clientY - (r.top + r.height / 2)) * .14) + 'px)';
      });
      b.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });
  }

  /* ---------- Inhaltsverzeichnis auf Unterseiten ---------- */
  (function () {
    var links = $$('.rand nav a[href^="#"]');
    if (!links.length) return;
    var ziele = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); }).filter(Boolean);
    var ob = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('an', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    ziele.forEach(function (z) { ob.observe(z); });
  })();

  /* ---------- 3D erst nachladen, wenn eine Szene näher kommt ---------- */
  (function () {
    var buehnen = $$('#pc3,#cc3,#jc3');
    if (!buehnen.length) return;
    var geladen = false;
    function laden() {
      if (geladen) return; geladen = true;
      var a = document.createElement('script');
      a.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      a.onload = function () {
        var b = document.createElement('script');
        b.src = '/assets/js/scenes.js';
        document.head.appendChild(b);
      };
      a.onerror = function () { /* ohne 3D bleibt die Seite vollständig nutzbar */ };
      document.head.appendChild(a);
    }
    var ob = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { laden(); ob.disconnect(); } });
    }, { rootMargin: '500px 0px' });
    buehnen.forEach(function (b) { ob.observe(b.parentElement || b); });
  })();

})();
