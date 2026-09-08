# Contributing

Dieses Repository ist die Lesezeichen-Hub-Modulverpackung von cryptii. Aenderungen sollten deshalb entweder die Hub-Integration betreffen oder nachvollziehbar aus dem Upstream-Projekt uebernommen werden.

## Upstream

Das originale Projekt liegt unter:

```text
https://github.com/cryptii/cryptii
```

## Entwicklung

```sh
npm install
npm run dev
```

## Pull Requests

1. Nutze die Node-Version aus `.nvmrc`.
2. Fuehre `npm test` aus.
3. Fuehre `npm run module:build` aus.
4. Committe die aktualisierten Dateien in `web/`, weil der Hub Module nicht selbst baut.

## Versionierung

Wenn nur die Hub-Verpackung geaendert wird, erhoehe den `hub`-Suffix in `version.json`, zum Beispiel von `4.0.11-hub.2` auf `4.0.11-hub.3`.
