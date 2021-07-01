/**
 * Prototyp zewnętrznej aplikacji do obejrzenia wydarzeń FAME MMA
 */

// UWAGA!!!!!!
// Na ten moment zostało tylko przetestowane na komputerach z systemami operacyjnymi Windows!
// Niezdefiniowane tutejsze systemy operacyjne, np. macOS, linux i inne, oznaczają że nie zostało do nich nadane wsparcie.

// OBSProcessManager - Autor: Norbert Podbiegły
// Wersja "alfa", nieoptymalna - musi zostać skończona

const os = require("os"),
	findProcess = require("find-process");

const {BrowserWindow, dialog} = require("electron");

class OBSProcessManager {
	constructor(windowBrowser) {
		if (!windowBrowser || !windowBrowser instanceof BrowserWindow)
			throw new Error("OBSProcessManager :: Wymagane jest okienko do wysyłania serwerom obecną listę procesów OBS!");
		
		this.interval = null; // interval do skanowania

		this.window = windowBrowser; // okienko

		/**
		 * @todo Wsparcie dla macOS, Linux i inne.
		 * @todo Większe rozplecenie architektury dla Linux i MacOS.
		 */
		this.architecture = os.arch().replace("x", "");

		// this.platform = os.platform();

		this.processName = "obs" + this.architecture; // nazwa procesu obs
		this.scanTime = 3 * 1000; // co ile milisekund ma skanować

		this._activateScanProcesses(); // automatycznie aktywuje
	}

	async _getProcesses() {
		return await findProcess("name", this.processName); // skanowanie procesów po nazwie
	}

	async _checkProcesses() {
		const processes = await this._getProcesses(); // skanowanie procesów

		processes.forEach(p => { // lista procesów OBS (bo pewnie będzie full tego pewnie, coś w tym stylu)
			const FULL_PROCESS_NAME = p.name.toLowerCase().replace(/\.[0-9a-z]+$/i, ""); // usuwanie końcówki procesów (.exe i takie tam) i zamiast dużych liter, daje do mniejszych (dokładniejsze tzw. przeszukanie procesów)

			if (this.processName === FULL_PROCESS_NAME)
				process.kill(p.pid, "SIGTERM"), dialog.showMessageBoxSync(this.window, {
					title: "Błąd",
					type: "error",
					detail: "Nie możesz używać OBS'a!"
				}); // w tym przypadku dałem tutaj zabijanie procesu i do okienka dialog
		});
	}

	_activateScanProcesses() { // aktywacja skanowania procesów
		if (!this.interval || this.interval === null)
			this.interval = setInterval(async () => await this._checkProcesses(), this.scanTime);
	}

	_deactiveScanProcesses() { // dezaktywacja skanowania procesów
		if (this.interval)
			clearInterval(this.interval);
	}
}

module.exports = OBSProcessManager;