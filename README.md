# SPFX-Flow-Button

In diesem Projekt befinden sich folgende SharePoint Elemente:

- SharePoint List Erweiterung "RechnungVorbereiten"

## Entwicklungsumgebung

- Docker Desktop
- Visual Studio Code
- VSCode Erweiterungen
  - Docker
  - Dev Containers

Docker Desktop muss gestartet sein, damit VSCode den Container erstellen und starten kann.
Damit ist es möglich innerhalb des Docker Containers zu entwickeln, ohne mit lokalen Einstellungen in Konflikt zu geraten.

## RechnungVorbereiten

Die Erweiterung erzeugt eine Schaltfläche in einer SharePoint List, sobald Zeilen ausgewählt sind. Dies bietet die Möglichkeit mehrere Datensätze gleichzeitig an einen Flow zu senden.

Die Aufgabe ist, in diesem Fall, die ID's der ausgewählten Zeilen einer speziellen Liste an einen Flow zu senden. In diesem Fall sollen mehrere Positionen einer neuen Rechnungsnummer zugeordnet werden. Danach wird ein Dialog angezeigt, damit der Benutzer weiss, dass sein Klick auf die Schaltfläche ausgeführt wurde.

Die ID's der Zeilen werden als Liste (Array) an die URL eines Flows übergeben, der dann alle weiteren Funktionen übernimmt.

Es wird eine SharePoint Liste für drei Properties benötigt, damit diese Eigenschften unabhängig von dieser Erweiterung und ohne Programmierkenntnisse bearbeitet werden können.

Die Liste hat den Namen "SPFX_RechnungVorbereiten_Konfiguration" und verfügt über die Spalten "key" und "value". Darin sind die Werte für "FlowURL", "ListID" und "DialogText" gespeichert.

So ist es möglich die Schaltfläche nur ein einer bestimmten Liste azuzeigen, auch wenn die Erweiterung in allen Listen verfügbar ist.

## Paket erstellen

Paket für die Auslieferung erstellen:

```bash
node updateVersion.js && gulp clean && gulp bundle --ship && gulp package-solution --ship
```

## Erweiterung lokal testen

Test Server starten, um die erweiterung im SharePoint zu testen

```bash
gulp serve
```

## Verwendete SharePoint Framework Version

![version](https://img.shields.io/badge/version-1.17.1-green.svg)

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

> Get your own free development tenant by subscribing to [Microsoft 365 developer program](http://aka.ms/o365devprogram)

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## References

- [Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Building for Microsoft teams](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/build-for-teams-overview)
- [Use Microsoft Graph in your solution](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/using-microsoft-graph-apis)
- [Publish SharePoint Framework applications to the Marketplace](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/publish-to-marketplace-overview)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp) - Guidance, tooling, samples and open-source controls for your Microsoft 365 development
