# Technische Anforderungen: Architektur

**Zweck:** Legt fest, wie Gameplay, Darstellung und Szenen getrennt sein müssen.
**Zielgruppe:** Alle Code-Agenten, besonders Architektur-Agenten.
**Abhängigkeiten:** keine. Ergänzend [testing-and-greybox.md](testing-and-greybox.md).

## Rahmen

- CONFIRMED: Vorgesehene Technologie Phaser 3, TypeScript, Vite (D-026). Noch nicht installiert, die Code-Projektstruktur ist noch nicht festgelegt.
- OPEN: Konkrete Ordner-/Modulstruktur. Dieses Dokument legt nur Anforderungen an die Trennung fest, nicht die Struktur.

## Anforderungen

### REQ-ARC-001 – Gameplay getrennt von Darstellung
- **Problemstellung:** Gameplay-Logik darf nicht an Grafik oder Engine gebunden sein.
- **Ziel:** Gameplay lässt sich ohne Rendering ausführen und testen.
- **Gewünschtes Verhalten:** Die Spiellogik (Zustände, Regeln, Simulation) kennt keine Rendering-Objekte. Die Darstellung liest den Gameplay-Zustand und zeichnet ihn.
- **Akzeptanzkriterien:** (1) Gameplay-Module importieren kein Phaser und keine Darstellungsmodule. (2) Die Simulation läuft headless (ohne Browser/Canvas). (3) Die Datenflussrichtung ist Gameplay → Darstellung, nicht umgekehrt. Eingaben gelangen über eine abstrakte Eingabeschnittstelle ins Gameplay.
- **Testfälle:** auto: Statische Prüfung (Import-Regel), Gameplay-Tests laufen in einer Umgebung ohne DOM/Canvas.
- **Abhängigkeiten:** –
- **Entscheidungsstatus:** CONFIRMED (D-022).

### REQ-ARC-002 – Szenen ohne Spiellogik
- **Problemstellung:** Szenen (Phaser-Szenen) neigen dazu, Logik aufzunehmen.
- **Ziel:** Szenen sind dünne Verdrahtung.
- **Gewünschtes Verhalten:** Szenen erzeugen die Darstellung, leiten Eingaben weiter, treiben die Simulation per Zeitschritt und lesen Zustände. Sie enthalten keine Spielregeln.
- **Akzeptanzkriterien:** (1) Keine Spielregel (Schaden, Zielwahl, Spawn, Reparatur) ist in einer Szene implementiert. (2) Ein Austausch der Szene ändert kein Gameplay-Ergebnis.
- **Testfälle:** auto: Gameplay-Tests decken alle Regeln ohne Szene ab. Review: Szenencode enthält keine Regeln.
- **Abhängigkeiten:** REQ-ARC-001.
- **Entscheidungsstatus:** CONFIRMED (D-023).

### REQ-ARC-003 – Gameplay funktioniert mit Platzhaltern
- **Problemstellung:** Gameplay darf nicht von finalen Grafiken abhängen.
- **Ziel:** Vollständig spielbar mit geometrischen Platzhaltern.
- **Gewünschtes Verhalten:** Jede Spielentität ist ohne Asset-Dateien darstellbar.
- **Akzeptanzkriterien:** (1) Es werden keine Bilddateien für das Gameplay benötigt. (2) Ein Austausch der Platzhalter durch Grafiken ändert das Gameplay nicht.
- **Testfälle:** manuell: Prototyp ohne Asset-Ordner starten und spielen.
- **Abhängigkeiten:** testing-and-greybox.
- **Entscheidungsstatus:** CONFIRMED (D-024).

### REQ-ARC-004 – Konfigurierbare Werte
- **Problemstellung:** Viele Zahlenwerte sind OPEN und werden sich ändern.
- **Ziel:** Werte stehen in Konfigurationsdaten, nicht im Logikcode.
- **Gewünschtes Verhalten:** Gameplay-Parameter (Geschwindigkeiten, Schaden, Radien, Intervalle, Gegneranzahl, Spielfeldmaße) kommen aus austauschbarer Konfiguration.
- **Akzeptanzkriterien:** (1) Kein Zahlenwert mit Spielwirkung ist in der Gameplay-Logik fest verdrahtet. (2) Tests können eigene Konfigurationen übergeben. (3) Platzhalter-Testwerte sind als solche gekennzeichnet und keine Designwerte.
- **Testfälle:** auto: Test mit zwei Konfigurationen liefert unterschiedliche Ergebnisse.
- **Abhängigkeiten:** alle Gameplay-Dokumente.
- **Entscheidungsstatus:** PROPOSED (technische Konsequenz aus den vielen OPEN-Werten; nicht ausdrücklich bestätigt).
