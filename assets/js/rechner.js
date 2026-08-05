/* ==========================================================================
   KANZLEI JASMINA HODZIC — assets/js/rechner.js
   Erbschaft- und Schenkungsteuer, überschlägige Berechnung.

   Rechtsgrundlagen:
     § 15 ErbStG  Steuerklassen
     § 16 ErbStG  persönliche Freibeträge
     § 19 Abs. 1  Steuersätze
     § 19 Abs. 3  Härteausgleich bei knappem Überschreiten einer Wertgrenze
     § 13 Abs. 1 Nr. 1   Hausrat und andere bewegliche Gegenstände
     § 13 Abs. 1 Nr. 4b/4c  Familienheim
     § 14 ErbStG  Zusammenrechnung von Erwerben innerhalb von zehn Jahren

   Nicht berücksichtigt: Versorgungsfreibetrag (§ 17), Verschonung von
   Betriebsvermögen (§§ 13a, 13b), Anrechnung ausländischer Steuer (§ 21),
   Pflichtteile, Nutzungsrechte. Diese Punkte können das Ergebnis erheblich
   verändern und werden nur im Mandat geprüft.
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- Verhältnis: Steuerklasse und Freibetrag ---------- */
  /* eltern: bei Erwerb von Todes wegen Klasse I, bei Schenkung Klasse II */
  var VERH = {
    ehegatte:    { name: 'Ehegatte / eingetragener Lebenspartner', erb: [1, 500000], sch: [1, 500000] },
    kind:        { name: 'Kind / Stiefkind',                       erb: [1, 400000], sch: [1, 400000] },
    enkel:       { name: 'Enkel',                                  erb: [1, 200000], sch: [1, 200000] },
    urenkel:     { name: 'Urenkel / weitere Abkömmlinge',           erb: [1, 100000], sch: [1, 100000] },
    eltern:      { name: 'Eltern / Großeltern',                    erb: [1, 100000], sch: [2,  20000] },
    geschwister: { name: 'Geschwister, Nichte/Neffe, Schwiegerkind', erb: [2, 20000], sch: [2, 20000] },
    sonstige:    { name: 'Sonstige, auch Lebensgefährte',          erb: [3,  20000], sch: [3, 20000] }
  };

  /* ---------- § 19 Abs. 1: Wertgrenzen und Sätze ---------- */
  var GRENZEN = [75000, 300000, 600000, 6000000, 13000000, 26000000, Infinity];
  var SAETZE = {
    1: [0.07, 0.11, 0.15, 0.19, 0.23, 0.27, 0.30],
    2: [0.15, 0.20, 0.25, 0.30, 0.35, 0.40, 0.43],
    3: [0.30, 0.30, 0.30, 0.30, 0.50, 0.50, 0.50]
  };

  function stufe(wert) {
    for (var i = 0; i < GRENZEN.length; i++) { if (wert <= GRENZEN[i]) return i; }
    return GRENZEN.length - 1;
  }

  /* Steuer auf den steuerpflichtigen Erwerb, mit Härteausgleich */
  function steuer(stpfl, klasse) {
    if (stpfl <= 0) return { betrag: 0, satz: 0, haerte: 0 };
    var i = stufe(stpfl);
    var satz = SAETZE[klasse][i];
    var voll = stpfl * satz;
    if (i === 0) return { betrag: Math.floor(voll), satz: satz, haerte: 0 };

    /* § 19 Abs. 3: Der Sprung auf den höheren Satz wird gedeckelt. */
    var grenze = GRENZEN[i - 1];
    var satzVor = SAETZE[klasse][i - 1];
    var steuerAnGrenze = grenze * satzVor;
    var faktor = satz > 0.30 ? 0.75 : 0.5;
    var gedeckelt = steuerAnGrenze + Math.min(voll - steuerAnGrenze, faktor * (stpfl - grenze));
    var betrag = Math.min(voll, gedeckelt);
    return { betrag: Math.floor(betrag), satz: satz, haerte: Math.floor(voll - betrag) };
  }

  /* ---------- Gesamtrechnung ---------- */
  function rechne(e) {
    var v = VERH[e.verhaeltnis];
    var kl = (e.art === 'erb' ? v.erb : v.sch)[0];
    var fb = (e.art === 'erb' ? v.erb : v.sch)[1];

    /* Familienheim — die Befreiung haengt davon ab, WER erwirbt und WIE:
         § 13 Abs. 1 Nr. 4a  Schenkung unter Ehegatten        -> frei, ohne Frist, ohne Flaechengrenze
         § 13 Abs. 1 Nr. 4b  Erbfall, Ehegatte                -> frei, zehn Jahre Selbstnutzung
         § 13 Abs. 1 Nr. 4c  Erbfall, Kind                    -> frei bis 200 m², zehn Jahre Selbstnutzung
       Eine Schenkung des Familienheims an ein Kind ist NICHT befreit. */
    var heimFrei = 0, heimHinweis = '';
    if (e.heimWert > 0) {
      if (e.verhaeltnis === 'ehegatte') {
        heimFrei = e.heimWert;
        heimHinweis = e.art === 'sch'
          ? 'Die Zuwendung des Familienheims unter Ehegatten ist nach § 13 Abs. 1 Nr. 4a ErbStG steuerfrei — ohne Flächengrenze und ohne Behaltensfrist.'
          : 'Das Familienheim bleibt beim Ehegatten nach § 13 Abs. 1 Nr. 4b ErbStG außer Ansatz — Bedingung: zehn Jahre weiter selbst genutzt.';
      } else if (e.verhaeltnis === 'kind' && e.art === 'erb') {
        var anteil = e.wohnflaeche > 200 ? 200 / e.wohnflaeche : 1;
        heimFrei = Math.round(e.heimWert * anteil);
        heimHinweis = anteil < 1
          ? 'Beim Kind ist die Befreiung nach § 13 Abs. 1 Nr. 4c ErbStG auf 200 m² Wohnfläche begrenzt. Bei ' +
            e.wohnflaeche + ' m² bleiben rund ' + Math.round(anteil * 100) + ' % des Wertes außer Ansatz.'
          : 'Das Familienheim bleibt beim Kind bis 200 m² Wohnfläche außer Ansatz — Bedingung: zehn Jahre weiter selbst genutzt.';
      } else if (e.verhaeltnis === 'kind') {
        heimHinweis = 'Achtung: Die Befreiung für das Familienheim gilt bei Kindern nur für den Erwerb von Todes wegen (§ 13 Abs. 1 Nr. 4c ErbStG). Eine Schenkung des Familienheims an ein Kind ist nicht befreit und wird hier deshalb voll angesetzt.';
      } else {
        heimHinweis = 'Die Befreiung für das Familienheim gilt nur für Ehegatten und eingetragene Lebenspartner sowie — beim Erwerb von Todes wegen — für Kinder.';
      }
    }

    /* Hausrat und andere bewegliche Gegenstände (§ 13 Abs. 1 Nr. 1) */
    var hausratFrei = 0;
    if (e.hausrat) hausratFrei = (kl === 1) ? 41000 : 12000;

    var brutto = e.wert;
    var nachSach = Math.max(0, brutto - heimFrei - hausratFrei);
    var vor = e.vorerwerb || 0;                       /* § 14: Zusammenrechnung */
    var bemessung = nachSach + vor;
    var stpflRoh = Math.max(0, bemessung - fb);
    /* Abrundung auf volle 100 € (§ 10 Abs. 1 Satz 6 ErbStG) */
    var stpfl = Math.floor(stpflRoh / 100) * 100;

    var s = steuer(stpfl, kl);
    /* Bei Vorerwerben wird die Steuer auf den Vorerwerb abgezogen (vereinfacht) */
    var abzug = 0;
    if (vor > 0) {
      var stpflVor = Math.floor(Math.max(0, vor - fb) / 100) * 100;
      abzug = steuer(stpflVor, kl).betrag;
    }
    /* § 14 Abs. 3: Der Abzug darf die Steuer nicht unter den Betrag druecken,
       der sich fuer den jetzigen Erwerb allein ergeben wuerde. */
    var stpflAllein = Math.floor(Math.max(0, nachSach - fb) / 100) * 100;
    var steuerAllein = steuer(stpflAllein, kl).betrag;
    var faellig = Math.max(0, s.betrag - abzug);
    if (vor > 0) faellig = Math.max(faellig, steuerAllein);

    /* Vergleich: Übertragung zu Lebzeiten in zwei Schritten mit zehn Jahren Abstand */
    var haelfte = Math.floor(Math.max(0, nachSach) / 2);
    var stpflH = Math.floor(Math.max(0, haelfte - fb) / 100) * 100;
    var zweiFenster = steuer(stpflH, kl).betrag * 2;

    return {
      klasse: kl, freibetrag: fb, verhaeltnisName: v.name,
      heimFrei: heimFrei, heimHinweis: heimHinweis, hausratFrei: hausratFrei,
      bemessung: bemessung, steuerpflichtig: stpfl,
      satz: s.satz, haerteausgleich: s.haerte,
      steuer: faellig, abzugVorerwerb: abzug,
      belastung: brutto > 0 ? faellig / brutto : 0,
      zweiFenster: zweiFenster,
      ersparnis: Math.max(0, faellig - zweiFenster)
    };
  }

  /* Für die Selbstprüfung in Node verfügbar machen */
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { rechne: rechne, steuer: steuer };
    return;
  }

  /* ================= Anbindung an die Oberfläche ================= */
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return [].slice.call(document.querySelectorAll(s)); };
  if (!$('#rechner')) return;

  var eur = function (n) { return n.toLocaleString('de-DE', { maximumFractionDigits: 0 }) + ' €'; };
  var pct = function (n) { return (n * 100).toLocaleString('de-DE', { maximumFractionDigits: 1 }) + ' %'; };

  var Z = { verhaeltnis: 'kind', art: 'erb', wert: 600000, heimWert: 0, wohnflaeche: 140,
            hausrat: false, vorerwerb: 0 };

  function zeichnen() {
    var r = rechne(Z);

    $('#r-klasse').textContent = ['', 'I', 'II', 'III'][r.klasse];
    $('#r-freibetrag').textContent = eur(r.freibetrag);
    $('#r-stpfl').textContent = eur(r.steuerpflichtig);
    $('#r-satz').textContent = r.steuerpflichtig > 0 ? pct(r.satz) : '—';
    $('#r-steuer').textContent = eur(r.steuer);
    $('#r-belastung').textContent = pct(r.belastung);

    var z = [];
    z.push(['Wert des Erwerbs', eur(Z.wert)]);
    if (r.heimFrei > 0)     z.push(['./. Familienheim steuerfrei', '− ' + eur(r.heimFrei)]);
    if (r.hausratFrei > 0)  z.push(['./. Hausrat und bewegliche Gegenstände', '− ' + eur(r.hausratFrei)]);
    if (Z.vorerwerb > 0)    z.push(['+ Vorerwerbe der letzten zehn Jahre (§ 14)', '+ ' + eur(Z.vorerwerb)]);
    z.push(['./. Persönlicher Freibetrag (§ 16)', '− ' + eur(r.freibetrag)]);
    z.push(['= Steuerpflichtiger Erwerb', eur(r.steuerpflichtig)]);
    if (r.steuerpflichtig > 0) z.push(['Steuersatz, Klasse ' + ['', 'I', 'II', 'III'][r.klasse], pct(r.satz)]);
    if (r.haerteausgleich > 0) z.push(['Härteausgleich (§ 19 Abs. 3)', '− ' + eur(r.haerteausgleich)]);
    if (r.abzugVorerwerb > 0)  z.push(['./. Steuer auf den Vorerwerb', '− ' + eur(r.abzugVorerwerb)]);
    $('#r-weg').innerHTML = z.map(function (p, i) {
      var letzte = i === z.length - 1;
      return '<div class="rz' + (letzte ? ' sum' : '') + '"><span>' + p[0] + '</span><b>' + p[1] + '</b></div>';
    }).join('');

    /* Zehnjahresfenster — Werte immer erst setzen, dann ein- oder ausblenden,
       sonst bleibt in der verborgenen Box ein alter Betrag stehen. */
    var box = $('#r-fenster');
    $('#r-zwei').textContent = eur(r.zweiFenster);
    $('#r-ersparnis').textContent = eur(r.ersparnis);
    box.style.display = r.ersparnis > 0 ? 'block' : 'none';

    /* Hinweise */
    var h = [];
    if (r.heimHinweis) h.push(r.heimHinweis);
    if (r.steuerpflichtig === 0 && Z.wert > 0)
      h.push('Nach diesen Angaben bleibt der Erwerb unter dem Freibetrag. Die Anzeigepflicht nach § 30 ErbStG besteht trotzdem — drei Monate ab Kenntnis.');
    if (Z.verhaeltnis === 'ehegatte' && Z.art === 'erb')
      h.push('Für Ehegatten kommt beim Erwerb von Todes wegen zusätzlich ein Versorgungsfreibetrag nach § 17 ErbStG in Betracht. Er wird hier nicht gerechnet, weil er sich um den Wert nicht steuerpflichtiger Versorgungsbezüge mindert.');
    if (Z.verhaeltnis === 'kind' && Z.art === 'erb')
      h.push('Für Kinder bis 27 Jahre kommt beim Erwerb von Todes wegen zusätzlich ein altersabhängiger Versorgungsfreibetrag nach § 17 ErbStG in Betracht. Er ist hier nicht enthalten.');
    if (Z.art === 'sch' && Z.verhaeltnis === 'eltern')
      h.push('Bei einer Schenkung an Eltern oder Großeltern gilt Steuerklasse II mit 20.000 € Freibetrag — beim Erwerb von Todes wegen dagegen Klasse I mit 100.000 €.');
    $('#r-hinweise').innerHTML = h.length
      ? h.map(function (t) { return '<li>' + t + '</li>'; }).join('') : '';
    $('#r-hinweisbox').style.display = h.length ? 'block' : 'none';

    /* Familienheim-Felder nur zeigen, wenn sie etwas bewirken */
    $('#r-flaeche-feld').style.display = (Z.verhaeltnis === 'kind' && Z.heimWert > 0) ? 'flex' : 'none';
  }

  /* Verhältnis */
  $$('#r-verh button').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('#r-verh button').forEach(function (x) { x.classList.remove('an'); x.setAttribute('aria-checked', 'false'); });
      b.classList.add('an'); b.setAttribute('aria-checked', 'true');
      Z.verhaeltnis = b.dataset.v; zeichnen();
    });
  });
  /* Art des Erwerbs */
  $$('#r-art button').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('#r-art button').forEach(function (x) { x.classList.remove('an'); x.setAttribute('aria-checked', 'false'); });
      b.classList.add('an'); b.setAttribute('aria-checked', 'true');
      Z.art = b.dataset.a; zeichnen();
    });
  });
  /* Zahlenfelder */
  /* Textfeld statt number, damit Tausenderpunkte angezeigt werden koennen.
     inputmode="numeric" sorgt auf dem Handy weiter fuer die Zifferntastatur. */
  function zahl(id, feld, anzeigeId) {
    var el = $(id); if (!el) return;
    function setzen() {
      var roh = String(el.value).replace(/[^\d]/g, '');
      var n = parseInt(roh, 10);
      Z[feld] = isNaN(n) ? 0 : n;
      var schoen = Z[feld].toLocaleString('de-DE');
      if (el.value !== schoen) {
        el.value = schoen;
        try { el.setSelectionRange(schoen.length, schoen.length); } catch (e) {}
      }
      if (anzeigeId) $(anzeigeId).textContent = eur(Z[feld]);
      zeichnen();
    }
    el.addEventListener('input', setzen);
    setzen();
  }
  zahl('#r-wert', 'wert', '#r-wert-anz');
  zahl('#r-heim', 'heimWert', '#r-heim-anz');
  zahl('#r-vor', 'vorerwerb', '#r-vor-anz');
  var fl = $('#r-flaeche');
  if (fl) fl.addEventListener('input', function () {
    var n = parseInt(fl.value, 10); Z.wohnflaeche = isNaN(n) ? 0 : n;
    $('#r-flaeche-anz').textContent = Z.wohnflaeche + ' m²'; zeichnen();
  });
  var hr = $('#r-hausrat');
  if (hr) hr.addEventListener('click', function () {
    Z.hausrat = !Z.hausrat;
    hr.classList.toggle('an', Z.hausrat);
    hr.setAttribute('aria-pressed', Z.hausrat ? 'true' : 'false');
    zeichnen();
  });

  zeichnen();
})();
