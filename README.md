# cryptii Hub-Modul

Dieses Repository verpackt [cryptii](https://github.com/cryptii/cryptii) als statisches Modul fuer den Lesezeichen-Hub.

Der Hub baut Module beim Installieren nicht selbst. Deshalb muss die gebaute Webapp im Repository committed sein. Der Hub startet ueber `index.html`; diese Datei leitet auf die gebaute App unter `web/module.html` weiter.

## HTTP Basic Auth

Der Encoder erwartet `username:password` und erzeugt den Headerwert `Basic <Base64>`. Beim Decodieren kann der komplette Headerwert oder nur der Base64-Token eingegeben werden. Basic Auth verwendet Base64-Kodierung, keine Verschluesselung; Zugangsdaten sollten daher ausschliesslich ueber HTTPS uebertragen werden.

Der Encoder **Apache .htpasswd (APR1)** erwartet das Passwort als Inhalt und erzeugt eine vollstaendige `benutzer:$apr1$...`-Zeile. Nur der Benutzername ist einzugeben; ein zufaelliges Salt wird automatisch erzeugt und muss nicht bekannt sein. APR1 ist ein Legacy-Format zur Kompatibilitaet mit `.htpasswd`, kein moderner Passwortspeicher. Fuer neue Systeme bcrypt oder Argon2 verwenden.

## bcrypt

Waehle **bcrypt** unter **Modern cryptography**, um den Inhalt des Textfelds als Passwort zu hashen. Der Baustein erzeugt lokal einen vollstaendigen `$2b$...`-Hash mit einem neuen kryptografisch zufaelligen Salt bei jeder Berechnung. **Cost factor** ist zwischen 4 und 16 einstellbar; Standard ist 12. Hoehere Werte erhoehen den Rechenaufwand exponentiell. Die Browser-Implementierung verwendet `bcryptjs` asynchron.

bcrypt ist eine Einwegfunktion und kann nicht decodiert werden. Die Ausgabe enthaelt keinen Benutzernamen. Passwoerter ueber 72 UTF-8-Bytes werden mit einer Fehlermeldung abgelehnt, statt stillschweigend gekuerzt zu werden; bei Umlauten oder anderen mehrbyteigen Zeichen ist die zulaessige Zeichenzahl entsprechend kleiner. Auch ein generiertes Passwort muss diese Grenze einhalten.

## Passwortgenerator

Im Textfeld laesst sich **Password generator** aufklappen. Waehle eine Laenge von 1 bis 128 Zeichen sowie Kleinbuchstaben, Grossbuchstaben, Ziffern und/oder den Unterstrich `_` als einziges Sonderzeichen. **Generate password** ersetzt den Inhalt des Textfelds und aktualisiert die nachfolgenden Umwandlungen. Jede ausgewaehlte Zeichengruppe kommt mindestens einmal vor; die Laenge muss dafuer ausreichen. Standard sind 20 Zeichen mit allen vier Gruppen. Die Erzeugung erfolgt lokal mit der Web Crypto API, ohne unsicheren Zufalls-Fallback.

## Entwicklung

```sh
npm install
npm run dev
```

Die eigentliche Vite-Einstiegsdatei ist `module.html`. Die Originalquellen liegen in `src/`, `style/` und `assets/`.

## Build fuer den Hub

```sh
npm run module:build
```

Der Build schreibt die statischen Dateien nach `web/`. Committe nach jedem Build mindestens:

- `web/`
- `index.html`
- `module.html`
- `version.json`
- `package.json`
- `package-lock.json`
- `vite.config.js`

Danach kann das Repository im Lesezeichen-Hub als externes Modul ueber die GitHub-Repository-URL importiert werden. Fuer den oeffentlichen Hub-Katalog muss `version.json` im Repository-Root liegen.

## Installation im Lesezeichen-Hub

Importiere das Modul ueber:

```text
https://github.com/Lesezeichen-Hub/cryptii
```

## Versionierung

Die Upstream-Version bleibt in `package.json` erhalten. Die Modulversion in `version.json` verwendet das Format:

```json
{
  "version": "4.0.11-hub.2"
}
```

Erhoehe den `hub`-Suffix, wenn nur Verpackung oder Hub-Integration angepasst wurde. Erhoehe die Basisversion, wenn cryptii upstream aktualisiert wurde.

## Lizenz

cryptii ist MIT-lizenziert. Die originale Lizenz liegt in `LICENSE.txt`.

### bcryptjs (BSD-3-Clause)

```text
bcrypt.js
---------
Copyright (c) 2012 Nevins Bartolomeo <nevins.bartolomeo@gmail.com>
Copyright (c) 2012 Shane Girish <shaneGirish@gmail.com>
Copyright (c) 2025 Daniel Wirtz <dcode@dcode.io>

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:
1. Redistributions of source code must retain the above copyright
  notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright
  notice, this list of conditions and the following disclaimer in the
  documentation and/or other materials provided with the distribution.
3. The name of the author may not be used to endorse or promote products
  derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
```
