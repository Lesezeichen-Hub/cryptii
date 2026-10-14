# cryptii Hub-Modul

Dieses Repository verpackt [cryptii](https://github.com/cryptii/cryptii) als statisches Modul fuer den Lesezeichen-Hub.

Der Hub baut Module beim Installieren nicht selbst. Deshalb muss die gebaute Webapp im Repository committed sein. Der Hub startet ueber `index.html`; diese Datei leitet auf die gebaute App unter `web/module.html` weiter.

## HTTP Basic Auth

Der Encoder erwartet `username:password` und erzeugt den Headerwert `Basic <Base64>`. Beim Decodieren kann der komplette Headerwert oder nur der Base64-Token eingegeben werden. Basic Auth verwendet Base64-Kodierung, keine Verschluesselung; Zugangsdaten sollten daher ausschliesslich ueber HTTPS uebertragen werden.

Der Encoder **Apache .htpasswd (APR1)** erwartet das Passwort als Inhalt und erzeugt eine vollstaendige `benutzer:$apr1$...`-Zeile. Nur der Benutzername ist einzugeben; ein zufaelliges Salt wird automatisch erzeugt und muss nicht bekannt sein. APR1 ist ein Legacy-Format zur Kompatibilitaet mit `.htpasswd`, kein moderner Passwortspeicher. Fuer neue Systeme bcrypt oder Argon2 verwenden.

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
