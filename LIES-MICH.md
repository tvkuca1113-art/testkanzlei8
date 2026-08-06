# Kanzlei Jasmina Hodzic — Website

Statische Website für Vercel. Kein Build-Schritt: Ordner hochladen, fertig.
12 Seiten, Schriften und Three.js selbst gehostet, keine Fremd-CDN-Aufrufe.

**Vor dem Livegang bitte `FREIGABE-CHECKLISTE.md` durcharbeiten.** Dort steht, was
juristisch geprüft und von Jasmina Hodzic bestätigt werden muss.

## Dateien

```
index.html                                           Startseite
erbschaftsteuer-rechner.html                         Rechner (§§ 15, 16, 19 ErbStG)
english-speaking-tax-advisor-munich.html             englische Landingpage
steuerberater-bosnisch-kroatisch-serbisch-muenchen.html
leistungen/  buchhaltung-lohnabrechnung-muenchen.html
             jahresabschluss-steuererklaerung-muenchen.html
             erbschaftsteuer-schenkungsteuer-muenchen.html
             internationales-steuerrecht-muenchen.html
             umstrukturierung-umwandlung-muenchen.html
impressum.html   datenschutz.html   404.html

assets/css/site.css        alle Stile
assets/js/site.js          Navigation, Formular, Steuer-Check, Akkordeons
assets/js/rechner.js       Rechenkern des Erbschaftsteuer-Rechners
assets/js/scenes.js        die drei 3D-Szenen (werden nachgeladen)
assets/js/three.min.js     selbst gehostet
assets/fonts/              14 WOFF2-Dateien, latin und latin-ext
img/                       Bilder in mehreren Größen, JPG + WebP
api/kontakt.js             Serverless-Funktion für das Kontaktformular

robots.txt  sitemap.xml  llms.txt  vercel.json  .vercelignore
```

`.vercelignore` hält `LIES-MICH.md` und `FREIGABE-CHECKLISTE.md` vom Webserver fern —
sie wären sonst öffentlich abrufbar.

## Örtlich testen

```bash
python3 -m http.server 8000
```

`api/kontakt` und die URLs ohne `.html` funktionieren nur auf Vercel.

---

# Befunde von der bestehenden Website steuerberaterin-hodzic.de

Geprüft am 5. August 2026. Die Seite läuft auf WordPress mit Elementor, aufgesetzt
auf einem gekauften Theme für Finanzberatung. Ein großer Teil des Theme-Demoinhalts
wurde nie ersetzt.

## Dringend — kostet vermutlich Anrufe

**Die Telefonnummer im Kontaktblock der Startseite führt ins Leere.**
Angezeigt wird `+49 (0) 89 541 990 940`, verlinkt ist aber:

```
tel: 1-800-356-8933
```

Das ist die US-Demonummer des Themes. Wer auf dem Handy im Kontaktbereich der
Startseite auf die Nummer tippt, wählt eine amerikanische Nummer. Andere Stellen
derselben Seite verlinken korrekt auf `tel:+49 89 541 990 940` — die Nummer im
Kontaktblock wurde beim Aufsetzen schlicht vergessen.

**Der Link zu den Google-Rezensionen ist kaputt.** Er beginnt mit `https://https://`
und führt daher nirgendwohin.

**Der Kartenlink zeigt auf „81475 Munich, Germany"** statt auf den Google-Eintrag der
Kanzlei. Damit geht Signalwirkung für das lokale Ranking verloren.

## Theme-Demoinhalt, der noch live ist

Im Menü und im Fußbereich stehen unübersetzte Blöcke aus dem gekauften Theme:

- `WHAT WE'RE THINKING`, `Insights`, `Case Studies`, `Media Mentions`
- Ein Mega-Menü mit `FINANCIAL`, `WEALTH`, `TAX`
- Englische Beispielartikel von Juni/Juli 2023, u. a. „Strategies to Stay Calm and
  Make Informed Decisions" und „Practical Tips for Creating and Managing Your
  Personal Budget"
- Theme-Seiten unter `/financial-planning/` und `/tax-and-estate-planning/`
- Ein `Subscribe`-Newsletter aus der Themevorlage
- `meta theme-color: #8FD299` — ein Grün, das mit der Marke nichts zu tun hat

**Das ist nicht nur unsauber, sondern potenziell berufsrechtlich heikel.** Die Blöcke
bewerben *Investment planning*, *Retirement planning*, *Portfolio management*,
*Asset allocation*, *Risk management* und *Wealth preservation* — also
Vermögensverwaltung und Anlageberatung. Für eine Steuerberaterin ist gewerbliche
Tätigkeit nach § 57 StBerG grundsätzlich mit dem Beruf unvereinbar, und
Anlageberatung ist zusätzlich erlaubnispflichtig. Diese Blöcke sollten von einer
fachkundigen Stelle bewertet und aller Voraussicht nach entfernt werden.

## „Aktuelles aus dem Steuerrecht" — was es wirklich ist

Unter `/ast/` liegt **kein eigener Blog**, sondern ein eingebundener Nachrichten-Feed
der DATEV eG. Die Seite zeigt drei Schlagzeilen, die alle nach `datev-magazin.de`
hinausführen. Darunter steht „Bereitgestellt von DATEV eG, © DATEV eG, alle Rechte
vorbehalten".

Praktische Folgen:

- **Kein SEO-Wert.** Auf der Seite steht kein eigener Text. Google sieht eine Seite,
  die aus drei Links nach außen besteht.
- **Nicht übernehmbar.** Die Inhalte gehören DATEV. Kopieren ist keine Option; der
  Feed lässt sich nur mit eigener DATEV-Lizenz einbinden.
- **Thematisch daneben.** Die Meldungen am Prüftag betrafen einen Waschstraßenschaden,
  eine Rechtsschutzversicherung und eine Ausbildungsumfrage — nichts davon berührt
  die Schwerpunkte der Kanzlei.

Deshalb wurde dieser Bereich **bewusst nicht nachgebaut**. Zwei sinnvolle Wege:

1. Den DATEV-Feed unverändert auch hier einbetten, wenn die Lizenz besteht. Er füllt
   die Seite, bringt aber weiterhin keine Sichtbarkeit.
2. **Der eigentlich wirksame Weg:** vier bis sechs eigene Beiträge pro Jahr zu den
   Schwerpunkten — etwa „Erbschaft aus Bosnien: was in Deutschland zu erklären ist"
   oder „Immobilie in Kroatien vermietet: Progressionsvorbehalt richtig angeben".
   Solche Texte gibt es auf Deutsch praktisch nicht und sie treffen genau die
   Zielgruppe. Dafür ist im Aufbau eine eigene Seite vorzusehen.

## Was aus der bestehenden Seite übernommen wurde

- **Die Philosophie der Kanzlei** (Kommunikation, Verstehen, über die Pflicht hinaus,
  aktive Unterstützung) ersetzt den vorher von mir formulierten Abschnitt
  „Zusammenarbeit". Das sind jetzt ihre eigenen Positionen, nicht meine.
- **Betriebswirtschaftliche Beratung** wurde bei den Leistungen ergänzt — stand auf
  der echten Seite, fehlte hier.
- **Kooperationspartner** (Edvin Hodzic, Nermina Arnaut) sind wieder im Fußbereich.
  Sie stehen auf der echten Seite, die Entscheidung dafür ist also bereits getroffen.
  Die berufsrechtliche Bewertung der Nennung eines Vermögensberaters bleibt dennoch
  einen Blick wert.
- **Facebook-Adresse korrigiert** auf die Adresse, die von der echten Seite verlinkt
  wird. Hinweis: Das ist ein persönliches Profil, keine Unternehmensseite. Für ein
  Unternehmen ist eine Seite besser, weil sie mit dem Google-Unternehmensprofil und
  den NAP-Daten abgeglichen werden kann.
- **Schreibweise:** Die Kanzlei schreibt „Erbschaftssteuer" mit doppeltem s, das
  Gesetz schreibt „Erbschaftsteuer" mit einem. Beide Varianten werden gesucht,
  deshalb kommen jetzt beide vor — es gibt dazu eine eigene FAQ-Frage.

## Zahlen, die weiterhin unbelegt sind

Die bestehende Seite nennt „10 Jahre Erfahrung", „200+ Mandanten", „7+ EXPERTEN" und
„4.8/5". Die Seite „Über uns" beschreibt das Team dagegen als „eine erfahrene
Steuerberaterin und Fachkräfte" — das passt nicht ohne Weiteres zu „7+ Experten".
Die Team-Sektion auf der Startseite ist leer.

Diese Angaben wurden hier **nicht übernommen**. Wenn sie belegbar sind, können sie
zurück; dann gehört auch die Durchschnittsnote wieder ins Schema-Markup.

---

# Gemessene Werte (Lighthouse, Mobil, 5. August 2026)

Gemessen mit Lighthouse gegen einen lokalen Server. Absolute Zeiten fallen auf
Vercel mit HTTP/2 und CDN besser aus; die Rangfolge der Ursachen stimmt.

| | vorher | jetzt |
|---|---|---|
| Leistung | 84 | **97** |
| Barrierefreiheit | 97 | **100** |
| Best Practices | 100 | **100** |
| SEO | 69 | **100** (nach Freigabe) |

FCP 1,4 s · LCP 1,7 s · Speed Index 2,4 s · CLS 0 · TBT 170 ms

## SEO 69 war kein Mangel

Der einzige nicht erfüllte SEO-Punkt war `is-crawlable` — „Page is blocked from
indexing". Das ist die eingebaute Demo-Sperre. Alle übrigen SEO-Prüfungen waren
schon vorher erfüllt.

Gegenprobe: dieselbe Seite ohne `noindex` erreicht **SEO 100**, ohne dass am Inhalt
etwas geändert wurde. Zum Umschalten liegt jetzt ein Skript bei:

```
python3 freigeben.py          # zeigt nur, was passieren würde
python3 freigeben.py --los    # schaltet frei
```

## Was tatsächlich behoben wurde

**Barrierefreiheit 97 → 100.** Zwei echte Fehler:
- Im Abschnitt „Der Weg" wurden inaktive Stufen per `opacity` abgedunkelt. Der
  Kleintext landete dadurch bei einem Kontrast von 2,05:1 gegen 4,5:1 Vorgabe.
  Jetzt werden gezielt Titelfarben zurückgenommen statt alles zu dimmen.
- Der Preishinweis nutzte `--t46`, was 3,41:1 ergab. Der Token wurde von 52 % auf
  64 % Deckkraft gesetzt — das verbessert auch viele andere Kleintexte.
- Logo-Link und Social-Symbole hatten `aria-label`, die den sichtbaren Text nicht
  enthielten. Sichtbare Kürzel sind jetzt `aria-hidden`, der volle Name steht in
  einem Nur-für-Screenreader-Element.

**Best Practices 96 → 100.** Three.js kam von cdnjs und erzeugte einen
Konsolenfehler. Es liegt jetzt unter `assets/js/three.min.js`.

**Schriften jetzt selbst gehostet.** Alle 14 WOFF2-Dateien liegen in
`assets/fonts/`, mit `unicode-range` getrennt nach `latin` und `latin-ext`, damit
Browser nur laden, was sie brauchen. Quelle: Fontsource, SIL Open Font License.
Damit ist der Punkt „Google Fonts / DSGVO" abgeschlossen und nicht mehr offen —
`datenschutz.html` Abschnitt 5 ist entsprechend umgeschrieben.

**Zwei Fremdanbieter weniger.** Vorher gingen bei jedem Aufruf Verbindungen an
`fonts.googleapis.com`, `fonts.gstatic.com` und `cdnjs.cloudflare.com`. Jetzt lädt
die Seite ausschließlich von der eigenen Domain. Das ist der eigentliche Gewinn —
nicht die Punktzahl.

## Ein Befund, der gegen die Intuition läuft

Zuerst wurden die drei wichtigsten Schriften mit `<link rel="preload">` vorgeladen.
Gemessen war das ein Rückschritt: **Leistung 82, LCP 3,7 s.** Ohne diese Preloads:
**Leistung 99, LCP 1,9 s.**

Grund: Font-Preloads mit `crossorigin` erhalten hohe Priorität und nehmen dem
Heldenbild Bandbreite — und das Bild ist das LCP-Element. Da `font-display:swap`
den Text sofort mit einer Ersatzschrift zeigt, bringt Vorladen nichts, kostet aber.

Die Preloads sind deshalb entfernt; im `<head>` steht ein Kommentar dazu, damit das
niemand „aus Versehen optimiert". Falls das kurze Umspringen der Schrift störend
wirkt, wäre ein einzelner Preload für Libre Caslon der Kompromiss — er kostet dann
aber messbar LCP.

## Was an der Leistung noch offen ist

97 statt 100 liegt an FCP und Speed Index, nicht an einem Fehler. Wer die letzten
Punkte will:
- Kritisches CSS in den `<head>` einbetten und `site.css` nachladen (etwa 19 KB des
  CSS werden beim ersten Bild nicht gebraucht)
- CSS und JS minifizieren (rund 11 KB, Vercel komprimiert allerdings schon)

Beides erschwert die Pflege und bringt wenig. Ich würde es lassen.

---

# Neu: Rechner und englische Seite

## Erbschaftsteuer-Rechner — `/erbschaftsteuer-rechner`

Rechnet nach **§§ 15, 16 und 19 ErbStG**: Steuerklasse und persönlicher Freibetrag
je nach Verhältnis, Steuersatz nach Stufe, **Härteausgleich nach § 19 Abs. 3**,
Befreiung für das **Familienheim** nach § 13 (beim Kind mit der 200-m²-Grenze
anteilig gerechnet), Hausrat nach § 13 Abs. 1 Nr. 1, Zusammenrechnung von
Vorerwerben nach § 14 sowie Abrundung auf volle 100 € nach § 10.

**Der eigentliche Verkaufspunkt** ist der Vergleich am Ende: Was dieselbe
Übertragung kosten würde, wenn sie zu Lebzeiten in zwei Schritten mit zehn Jahren
Abstand erfolgt. Beispiel Kind, 1,2 Mio. €: **152.000 € auf einmal gegen 44.000 € in
zwei Schritten.** Diese Zahl macht das Argument für frühe Nachfolgeplanung in einem
Satz — und genau das ist ihr Schwerpunkt.

### Geprüft

Die Rechenlogik wurde gegen handgerechnete Fälle getestet, erst in Node, dann im
Browser. Belegte Fälle:

| Fall | Ergebnis |
|---|---|
| Kind erbt 500.000 € | 11.000 € |
| Ehegatte erbt 600.000 € | 11.000 € |
| Enkel erbt 300.000 € | 11.000 € |
| Kind erbt 1.000.000 € | 90.000 € |
| Geschwister erbt 100.000 € | 13.750 € — Härteausgleich greift |
| Kind erbt 476.000 € | 5.750 € — Härteausgleich greift |
| Ehegatte, 900.000 € mit Heim 500.000 € | 0 € |
| Kind, Heim 600.000 € auf 400 m² | nur 50 % befreit |
| Eltern, Schenkung 120.000 € | 20.000 € (Klasse II) |
| Eltern, Erbfall 120.000 € | 1.400 € (Klasse I) |

Zwei meiner ersten Erwartungen waren falsch, nicht der Code: 100.000 € liegen über
der Grenze von 75.000 € und werden mit 11 % belegt, nicht mit 7 %. Und in
Steuerklasse III gilt der Satz von 50 % bereits ab 6 Mio. €, nicht erst ab 13 Mio.
Deshalb wurde gerechnet und nicht geschätzt.

### Bewusst nicht enthalten

Versorgungsfreibetrag (§ 17 — er mindert sich um nicht steuerbare Versorgungsbezüge
und wäre ohne diese Angabe zu hoch), Verschonung von Betriebsvermögen (§§ 13a, 13b),
Anrechnung ausländischer Steuer (§ 21), Nutzungsrechte, Pflichtteile,
Nachlassverbindlichkeiten. Wo es relevant wird, weist der Rechner selbst darauf hin.

Die Eingaben **verlassen das Gerät nicht** — gerechnet wird nur im Browser, nichts
wird gespeichert oder übertragen. Das steht auch so in der Datenschutzerklärung.

Rechtlicher Hinweis unter dem Rechner: ausdrücklich keine Beratung im Sinne des
StBerG, keine Zusage eines Ergebnisses.

## Englische Seite — `/english-speaking-tax-advisor-munich`

Eine starke Seite, kein übersetzter Gesamtauftritt. Begründung: eine halb
übersetzte Website erzeugt dünne Seiten und hreflang-Fehler, die niemand pflegt.

Inhaltlich auf die Fälle zugeschnitten, die in München tatsächlich anfallen: erste
deutsche Steuererklärung, **RSUs und Aktienoptionen** samt Aufteilung über
Arbeitstage bei länderübergreifender Vesting-Periode, Zu- und Wegzug mit § 6 AStG,
Freiberufler gegen Gewerbe, Einkünfte und Vermögen im Ausland.

**Bewusst klar abgegrenzt:** Es wird ausdrücklich gesagt, dass die Kanzlei die
deutsche Seite vollständig abdeckt, aber **keine** US-Steuererklärungen, FBAR oder
FATCA-Meldungen für US-Behörden erstellt. Das ist die ehrliche Grenze — und besser
im ersten Absatz als im April.

Ebenso klargestellt: Beratung auf Englisch, aber Erklärungen und Behördenschreiben
sind auf Deutsch. Das ist gesetzlich so, keine Entscheidung der Kanzlei.

## hreflang

Startseite, Sprachenseite und englische Seite verweisen **gegenseitig** aufeinander,
mit `x-default` auf die deutsche Startseite. Reziprozität ist Pflicht — fehlt eine
Richtung, ignoriert Google die Angaben.

Sollte später ein vollständiger englischer Auftritt kommen, ist der richtige Zeitpunkt
für die Umstellung auf `/de/` und `/en/` **vor** dem Ausbau. Ein Nachrüsten bedeutet
Weiterleitungen und verlorene Signale.

## Navigation

Die Reihenfolge ist jetzt: Leistungen · Preise · Steuer-Check · Rechner · Über mich ·
Sprachen BS·HR·SR · EN · Erstgespräch. „Fragen" ist entfallen — der FAQ-Bereich wird
beim Scrollen ohnehin erreicht und war der schwächste Menüpunkt.
