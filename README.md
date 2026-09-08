# cryptii Hub-Modul

Dieses Repository verpackt [cryptii](https://github.com/cryptii/cryptii) als statisches Modul fuer den Lesezeichen-Hub.

Der Hub baut Module beim Installieren nicht selbst. Deshalb muss die gebaute Webapp im Repository committed sein. Der Hub startet ueber `index.html`; diese Datei leitet auf die gebaute App unter `web/module.html` weiter.

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
  "version": "4.0.11-hub.1"
}
```

Erhoehe den `hub`-Suffix, wenn nur Verpackung oder Hub-Integration angepasst wurde. Erhoehe die Basisversion, wenn cryptii upstream aktualisiert wurde.

## Lizenz

cryptii ist MIT-lizenziert. Die originale Lizenz liegt in `LICENSE.txt`.
