# Arkadmin 

Webbasiertes Admin Panel für Ark-Gameserver

# Wichtig

- [Dev-Tree] Benutzten auf eigene GEFAHR (Debugs, Tests usw.)
- Derzeitiger Status: *Alpha*
- Discord: https://discord.gg/ykGnw49
   
# Installation

- Erstelle ein MariaDB Datenbank und lade die Tabelle von `forInstall/mariaDB` hinein
- gehe in den Ordner `Panel/app/config` und trage den Zugang in `mysql.json`
- Danach Konfiguriere die `app.json` weitere infos > app.json
  - Bitte Beachte: die `main.json` sollte nicht bearbietet werden außer man weis was man tut!
- Starte `start_master.cmd` dies Aktiviert auch den Automatischen Updater, ist das nicht gewünscht starte mit `start_noUpdater`

# Update

- Starte `start_master.cmd` dies Aktiviert auch den Automatischen Updater, ist das nicht gewünscht starte mit `start_noUpdater`

# Standart Login

- Benutzername UND Password: `admin`

# app.json

| Eigenschaften | Wert | 
| :--- | :--- |
| `lang` | Ordner name der für die Sprachdatei verwendet werden soll |
| `port` | Port der genutzt werden soll für den Webserver |
| `servRoot` | Pfad wo die Server liegen sollen (am ende KEIN `\\`) |
| `logRoot` | Pfad wo die Logs liegen sollen (am ende KEIN `\\`) |
| `pathBackup` | Pfad wo die Backups liegen sollen (am ende KEIN `\\`) |
| `steamCMDRoot` | Pfad wo die SteamCMD liegt (am ende KEIN `\\`) |
| `steamAPIKey` | SteamAPI key bekommt ihr von https://steamcommunity.com/dev/apikey |
| `appID` | AppID von Ark:SE (dies sollte nicht geändert werden) |
| `appID_server` | AppID von Ark:SE Server (dies sollte nicht geändert werden) |
  
# Sprache Installieren

- Lade die JSON Dateien in `/lang/<lang>/` hoch 
- Bearbeite die `/app/config/app.json` und stelle `lang` auf den ordner Namen `<lang>`
- WICHTIG: Es wird derzeit nur Deutsch mitgeliefert 

# Benötigt

- `Node.JS` Version == 15.0.1   > https://nodejs.org/dist/v15.0.1/node-v15.0.1-x64.msi
- `Node.JS` NVM                 > https://github.com/coreybutler/nvm-windows/releases/tag/1.1.7
- `MariaDB` Server              > z.B. https://www.apachefriends.org/de/index.html
