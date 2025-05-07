# Ohjelmointi 4
Ohjelmointi 4 -kurssin ryhmätyön repository

Lyhyt ohje: OSRS MultiToolin paikallinen hostaaminen

Multitoolin hostaaminen paikallisesti vaatii seuraavien työkalujen ja kirjastojen asentamisen:

node.js
axios
cors
express

Node.js asennettava sivulta https://nodejs.org/en/download


Komentorivissä runescape-proxy-server directoryssä ollessa saa axiosin asennettua
kirjoittamalla komentoriviin:
npm install axios

Experssin kirjoittamalla:
npm install express

corssin kirjoittamalla: 
npm install cors


Tehtyäsi nämä käynnistä serveri runescape-proxy-server kansionsta komennolla node index.js
Tämän jälkeen pitäsi pystyä sivu avaamaan paikallisesti

Jos itemsearch ei toimi paikallisesti, käy vaihtamassa tiedoston itemFetch.js alussa kommenteissa
 oleva const host = "http://localhost:3000" pois kommentista ja const host = window.location.origin; kommentiksi
