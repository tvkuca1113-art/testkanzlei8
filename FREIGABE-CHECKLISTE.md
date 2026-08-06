# Freigabe-Checkliste

Diese Liste enthält alles, was **vor dem Livegang** noch von Jasmina Hodzic bestätigt
oder von einer fachkundigen Stelle geprüft werden muss. Im Quelltext sind die
betroffenen Stellen mit `<!-- BESTÄTIGEN: ... -->` markiert.

---

## A. Muss juristisch geprüft werden

| # | Punkt | Warum |
|---|---|---|
| A1 | **Impressum** (`impressum.html`) | Sorgfältig nach § 5 DDG, § 18 MStV und Berufsrecht erstellt — aber keine Rechtsberatung und keine Zusicherung der Konformität. |
| A2 | **Datenschutzerklärung** (`datenschutz.html`) | Beschreibt die tatsächlich eingesetzte Technik. Vollständigkeit und Rechtsgrundlagen müssen fachkundig bestätigt werden. |
| A3 | **Benennung einer Datenschutzbeauftragten** | In Abschnitt 1 wird davon ausgegangen, dass keine Benennungspflicht besteht. Bitte im Einzelfall prüfen. |
| A4 | **Anschrift Vercel Inc.** | Angegeben: 440 N Barranca Ave #4133, Covina, CA 91723. In Quellen findet sich auch eine ältere Adresse in Walnut, CA. Vor Livegang gegen die aktuelle Angabe auf vercel.com prüfen. |
| A5 | **Anschrift Resend, Inc.** | Angegeben: 2261 Market Street #5039, San Francisco, CA 94114. Ebenfalls gegenprüfen. |
| A6 | **Auftragsverarbeitungsverträge** | Die Erklärung setzt voraus, dass mit Vercel und Resend jeweils ein AVV nach Art. 28 DSGVO abgeschlossen **ist**. Beide bieten ihn online an — er muss aktiv akzeptiert werden. |
| A7 | **Kooperationspartner im Fußbereich** | Edvin Hodzic (Deutsche Vermögensberatung AG) und Nermina Arnaut. Die Nennung eines Vermögensberaters auf der Website einer Steuerberaterin sollte berufsrechtlich (BOStB, § 57 StBerG) freigegeben werden. |

**Der Hinweis auf die EU-Plattform zur Online-Streitbeilegung wurde entfernt.** Die
Plattform wurde am 20. Juli 2025 abgeschaltet; ein verbliebener Hinweis wäre selbst
abmahnfähig. Die Aussage zur Verbraucherschlichtung nach § 36 VSBG bleibt bestehen.

---

## B. Muss inhaltlich bestätigt werden

| # | Angabe | Wo | Status |
|---|---|---|---|
| B1 | **39 € / 149 € / 349 € monatlich** | Startseite, Abschnitt Preise | aus der Vorfassung übernommen, unbestätigt |
| B2 | **Leistungsumfang:** einfacher Fall / bis 2 Vermietungsobjekte | Preiskachel 1 | von mir vorgeschlagen, unbestätigt |
| B3 | **Leistungsumfang:** bis ca. 100 Belege monatlich, ohne Lohn | Preiskachel 2 | von mir vorgeschlagen, unbestätigt |
| B4 | **Leistungsumfang:** bis ca. 250 Belege monatlich, bis 5 Angestellte | Preiskachel 3 | von mir vorgeschlagen, unbestätigt |
| B5 | **Sprachen DE · BS · HR · SR · EN** | Hero, Sprachenseite, englische Seite, Schema | aus der Vorfassung |
| B6 | **Qualifikationen:** Steuerberaterin, Wirtschaftsjuristin, LL.M., M.A. Taxation, Mitglied der Steuerberaterkammer München | Hero, Über mich, Schema | aus der bestehenden Website übernommen |
| B7 | **„Antwort in der Regel innerhalb eines Arbeitstages"** | Haltung, FAQ, Danke-Text | Leistungsversprechen — muss haltbar sein |
| B8 | **Mandantenportal** | Abschnitt Digital | Als „Beispielansicht" gekennzeichnet. Falls kein Portal existiert, Abschnitt anpassen. |
| B9 | **Öffnungszeiten** Mo–Do 9–16, Fr 9–13 | Kontakt, Fußbereich, Schema | aus der Vorfassung |
| B10 | **USt-IdNr. DE363797524**, Generali als Berufshaftpflicht | Impressum, Fußbereich | aus der Vorfassung |
| B11 | **Social-Media-Adressen** | Fußbereich | Der Facebook-Link führt auf ein **persönliches Profil**, nicht auf eine Unternehmensseite. Für NAP-Konsistenz wäre eine Seite besser. |
| B12 | **Digitaler Prozess** (Belege per Plattform, Buchhaltung cloudbasiert, elektronische Übermittlung) | Digital, Der Weg, FAQ | Muss der Realität entsprechen. |

**Nicht verwendet und bewusst nicht erfunden:** Google-Rezensionen, Durchschnittsnote,
Mandantenzahlen, Teamgröße, Berufserfahrung in Jahren, Zertifizierungen,
Fachberater-Titel. Für echte Rezensionen liegt in `index.html` nach dem Block
`<div class="vt vt4 up">` eine fertige Vorlage als Kommentar. Erst wenn eine
belegbare Durchschnittsnote vorliegt, darf `aggregateRating` in die Schema-Daten.

---

## C. Technische Schritte vor dem Livegang

1. **Kontaktformular scharf schalten.** In Vercel unter *Settings → Environment
   Variables*: `RESEND_API_KEY`, `MAIL_AN` (`info@steuerberaterin-hodzic.de`),
   `MAIL_VON` (verifizierte Absenderadresse der eigenen Domain). Die Absenderdomain
   muss bei Resend per DNS verifiziert sein. **Danach einmal live testen.**
   Ohne diese Variablen zeigt das Formular Telefonnummer und E-Mail an — es wird
   nie ein Erfolg vorgetäuscht.
2. **Domain umstellen.** Die Seiten stehen auf `index,follow`; alle Canonicals und
   hreflang-Angaben zeigen auf `https://www.steuerberaterin-hodzic.de/`.
   **Solange die Seite nur auf einer Testdomain läuft**, sollte dort `noindex`
   gesetzt bleiben, damit keine Testdomain in den Index gerät.
3. **Google Search Console:** Domain verifizieren, `sitemap.xml` einreichen.
4. **Google-Unternehmensprofil:** vollständig ausfüllen, Hauptkategorie
   „Steuerberater", Öffnungszeiten und Adresse identisch zur Website (NAP).
   Für „Steuerberater München" entscheidet das Profil stärker als die Website.

---

## D. Grenzen des Erbschaftsteuer-Rechners

Der Rechner ist auf der Seite ausdrücklich als überschlägig und unverbindlich
gekennzeichnet. Umgesetzt sind: Steuerklassen (§ 15), persönliche Freibeträge
(§ 16), Steuersätze (§ 19 Abs. 1), Härteausgleich (§ 19 Abs. 3), Familienheim
(§ 13 Abs. 1 Nr. 4a/4b/4c), Hausrat (§ 13 Abs. 1 Nr. 1), Zusammenrechnung von
Vorerwerben (§ 14) sowie Abrundung (§ 10).

**Bewusst nicht berücksichtigt**, weil eine vereinfachte Rechnung hier irreführend
wäre:

- **Versorgungsfreibetrag (§ 17).** Er mindert sich um den Kapitalwert nicht
  steuerbarer Versorgungsbezüge. Ohne diese Angabe wäre das Ergebnis zu niedrig.
- **Verschonung von Betriebsvermögen (§§ 13a, 13b).** Zu stark einzelfallabhängig.
- **Anrechnung ausländischer Steuer (§ 21).**
- **Nutzungsrechte, Pflichtteile, Nachlassverbindlichkeiten.**
- **§ 14 vereinfacht:** angerechnet wird die fiktive Steuer auf den Vorerwerb nach
  heutigem Recht; die Untergrenze nach § 14 Abs. 3 ist umgesetzt. Die tatsächlich
  gezahlte höhere Steuer nach § 14 Abs. 1 Satz 3 wird nicht abgefragt.
- **Zehnjahresvergleich:** gleich große Teilübertragungen, als Illustration
  gekennzeichnet — keine Empfehlung.

Wo eine dieser Grenzen für die Eingabe relevant wird, weist der Rechner selbst
darauf hin. **Bitte einmal fachlich gegenrechnen**, bevor die Seite live geht.

---

## E. Was in dieser Runde korrigiert wurde

- **Rechtsfehler im Rechner:** Die Befreiung für das Familienheim wurde bisher auch
  bei einer **Schenkung an ein Kind** angesetzt. § 13 Abs. 1 Nr. 4c gilt nur für den
  Erwerb von Todes wegen; für Ehegatten greift bei Schenkung Nr. 4a. Getrennt umgesetzt.
- **§ 14 Abs. 3** als Untergrenze ergänzt; Steuerklasse I um **Urenkel** erweitert;
  Hinweis auf den Enkel-Sonderfall bei vorverstorbenem Kind aufgenommen.
- **Hausrat** war als „Hausrat und bewegliche Gegenstände" bezeichnet, gerechnet wurde
  nur der Hausratsbetrag. Bezeichnung und Rechnung stimmen jetzt überein.
- **Google Fonts waren auf fünf Seiten zurück**, weil neu erzeugte Seiten aus einer
  älteren Vorlage stammten. Entfernt; die Vorlage ist ebenfalls korrigiert. Ohne diesen
  Fund wäre die Aussage „Schriften ausschließlich vom eigenen Server" in der
  Datenschutzerklärung **unwahr** gewesen.
- **404-Seite** stand auf `index,follow` und ist jetzt auf `noindex,follow`.
- Tippfehler „Gegebenenfolls" in der Datenschutzerklärung.
- Absolute Versprechen zurückgenommen: „Danach müssen Sie nicht mehr daran denken"
  → „Den Großteil übernehme ich… Entscheidungen bleiben bei Ihnen"; „Fristen kommen
  nicht überraschend" → „Fristen sollen nicht überraschen".
- „Gebunden, unterschrieben" → „Freigegeben, elektronisch übermittelt".
- Auszeichnung „Häufigste Wahl" auf der Preiskachel entfernt — nicht belegbar.
- Toter Fußbereich-Link „Steuergestaltung" entfernt; „Umstrukturierung" führt jetzt
  auf eine eigene Seite.
