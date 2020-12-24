# Arkadmin 

Webbasiertes Admin Panel für Ark-Gameserver

**Derzeitige Features**

- Benutzer & Benutzergruppen
- Server Traffic
- ServerControlCenter
  - Erstellen sowie Löschen von Server
  - Übersicht aller Aktiven Server
- ServerCenter
  - CMD Response
  - Backup Kontrolle
  - Modübersicht mit SteamAPI und Grafiker oberfläche über bessere Übersicht
  - Verwaltung und einspielen von Backups
  - Meldungen bezüglich Benötigten Updates & Installierten Mod
  - Automatische Updates (mit Mods Updates)
  - Automatische Backups
  - **[WIP (Funktioniert schon unklar ob in jeden Fall)]** Restart beim Crash vom Server (alwaysstart)

# Wichtig

- **[Dev-Tree]** Benutzten auf eigene GEFAHR (Debugs, Tests usw.)
- Derzeitiger Status: **Alpha**
- Discord: https://discord.gg/ykGnw49
- Trello: https://trello.com/b/HZFtQ2DZ/arkadminwin
   
# Installation

- Downloade den letzten Release
- Erstelle einen Ordner
- Kopiere alles hier hinein
- Starte das Programm mit einer der CMD's
  - Hierbei ist zu beachten, dass der Automatischen Updater nur aktiv wird, wenn das Programm mit gestartet `start_master.cmd` oder `start_dev.cmd` wird
  - sollte dies nicht gewünscht sein starte einfach das Programm mit `start_noUpdater.cmd`
- Folge den Angezeigten anweisungen auf der Webseite (http://ip:port)
- Nach abschluss der Installation startet das Panel neu mit den gewählten Einstellungen und du kannst loslegen

**Alternative:**
- Downloade nur `start_master.cmd` oder `start_dev.cmd`
- Erstelle einen Ordner und in diesen einen `cache`
- Kopiere die CMD in den Ordner und führe diese aus
- nun solle das Panel runtergeladen werden und gestartet werden
  - Es wird IMMER die letzte version der jeweiligen Branch genommen!

# Update

- Ist das Panel bereits mit `start_master.cmd` oder `start_dev.cmd` gestartet musst du nichts tun einfach warten bis auf ein neues Update geprüft wird.
- Ansonsten:
  - Beende das Panel
  - Starte einer der folgenden CMD's: `start_master.cmd` oder `start_dev.cmd`

**Alternative:**
- Downloade den letzten Release
- Kopiere alles in den Ordner vom Panel
- Starte das Programm mit einer der CMD's

# Standart Login

- Benutzername UND Password: `admin`

# app.json

| Eigenschaften         | Wert | 
| :---                  | :--- |
| `lang`                | Ordner name der für die Sprachdatei verwendet werden soll |
| `port`                | Port der genutzt werden soll für den Webserver |
| `servRoot`            | Pfad wo die Server liegen sollen |
| `logRoot`             | Pfad wo die Logs liegen sollen |
| `pathBackup`          | Pfad wo die Backups liegen sollen |
| `steamCMDRoot`        | Pfad wo die SteamCMD liegt |
| `steamAPIKey`         | SteamAPI key bekommt ihr von https://steamcommunity.com/dev/apikey |
| `appID`               | AppID von Ark:SE (dies sollte nicht geändert werden) |
| `appID_server`        | AppID von Ark:SE Server (dies sollte nicht geändert werden) |

# main.json
**INFO:** Hier sollte nur etwas verändert werden wenn man weis was man tut!

| Eigenschaften                       | Wert | 
| :---                                | :--- |
| `useDebug`                          | Ordner name der für die Sprachdatei verwendet werden soll |
| `interval > getAvailableVersion`    | Port der genutzt werden soll für den Webserver |
| `interval > getStateFromServers`    | Pfad wo die Server liegen sollen |
| `interval > getModsFromAPI`         | Pfad wo die Logs liegen sollen |
| `interval > getTraffic`             | Pfad wo die Backups liegen sollen |
| `interval > doReReadConfig`         | Pfad wo die SteamCMD liegt |
| `interval > doServerBackgrounder`   | SteamAPI key bekommt ihr von https://steamcommunity.com/dev/apikey |
| `interval > backgroundUpdater`      | AppID von Ark:SE (dies sollte nicht geändert werden) |

# Sprache Installieren

- Lade die JSON Dateien in `/lang/<lang>/` hoch 
- Bearbeite die `/app/config/app.json` und stelle `lang` auf den ordner Namen `<lang>`
- WICHTIG: Es wird derzeit nur Deutsch mitgeliefert 

# Benötigt
- `Betriebssystem`
  - Windows / Windows Server
  - Administrator Rechte bzw genügend Rechte, um Daten in den jeweiligen Ordner zu lesen, & zu Schreiben sowie Auslastung lesen zu dürfen
- `Node.JS` 
  - Version == 15.0.1   > https://nodejs.org/dist/v15.0.1/node-v15.0.1-x64.msi
  - NVM                 > https://github.com/coreybutler/nvm-windows/releases/tag/1.1.7
- `MariaDB` 
  - Server              > z.B. https://www.apachefriends.org/de/index.html
