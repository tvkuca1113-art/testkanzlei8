#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Schaltet die Website vom Demo-Zustand auf Livebetrieb um.

  python3 freigeben.py          zeigt nur an, was geaendert wuerde
  python3 freigeben.py --los    fuehrt die Aenderung durch

Danach ist die Seite fuer Suchmaschinen freigegeben. Bitte anschliessend
in der Google Search Console die sitemap.xml einreichen.
"""
import glob, io, os, sys

LOS = '--los' in sys.argv
ALT = '<meta name="robots" content="noindex,nofollow">'
NEU = '<meta name="robots" content="index,follow,max-image-preview:large">'
ROBOTS = ("User-agent: *\nAllow: /\nDisallow: /api/\n\n"
          "Sitemap: https://www.steuerberaterin-hodzic.de/sitemap.xml\n")

seiten = sorted(glob.glob('*.html') + glob.glob('leistungen/*.html'))
treffer = 0
for p in seiten:
    s = io.open(p, encoding='utf-8').read()
    if ALT in s:
        treffer += 1
        print(('  geaendert: ' if LOS else '  wuerde aendern: ') + p)
        if LOS:
            io.open(p, 'w', encoding='utf-8').write(s.replace(ALT, NEU))

if LOS:
    io.open('robots.txt', 'w', encoding='utf-8').write(ROBOTS)
    print('  robots.txt neu geschrieben (Allow: /)')
else:
    print('  wuerde robots.txt auf "Allow: /" setzen')

print()
if treffer == 0:
    print('Keine Demo-Sperre gefunden — die Seite ist offenbar bereits freigegeben.')
elif LOS:
    print('Fertig. %d Seiten freigegeben.' % treffer)
    print('Noch offen: Kontaktformular-Variablen in Vercel, Impressum und')
    print('Datenschutz fachlich pruefen lassen (siehe LIES-MICH.md).')
else:
    print('Nichts geaendert. Zum Ausfuehren:  python3 freigeben.py --los')
